import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

import { PutObjectCommand, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { TRPCError } from "@trpc/server";
import { env } from "@/env.mjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis/nodejs";

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(1, "5 s"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export const s3Router = createTRPCRouter({
    getObjects: publicProcedure.query(async ({ ctx }) => {
        const { s3 } = ctx;

        const listObjectsOutput = await s3.listObjectsV2({
            Bucket: env.AWS_BUCKET_NAME,
        });

        return listObjectsOutput.Contents ?? [];
    }),

    getStandardUploadPresignedUrl: publicProcedure
        .input(z.object({ key: z.string(), userId: z.string() }))
        .mutation(async ({ ctx, input }) => {
            const { success } = await ratelimit.limit("image_upload");
            if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

            const { key } = input;
            const { s3 } = ctx;

            const putObjectCommand = new PutObjectCommand({
                Bucket: env.AWS_BUCKET_NAME,
                Key: key,
            });

            return await getSignedUrl(s3, putObjectCommand);
        }),

    getMultipartUploadPresignedUrl: publicProcedure
        .input(z.object({ key: z.string(), filePartTotal: z.number() }))
        .mutation(async ({ ctx, input }) => {
            const { key, filePartTotal } = input;
            const { s3 } = ctx;

            const uploadId = (
                await s3.createMultipartUpload({
                    Bucket: env.AWS_BUCKET_NAME,
                    Key: key,
                })
            ).UploadId;

            if (!uploadId) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "Could not create multipart upload",
                });
            }

            const urls: Promise<{ url: string; partNumber: number }>[] = [];

            for (let i = 1; i <= filePartTotal; i++) {
                const uploadPartCommand = new UploadPartCommand({
                    Bucket: env.AWS_BUCKET_NAME,
                    Key: key,
                    UploadId: uploadId,
                    PartNumber: i,
                });

                const url = getSignedUrl(s3, uploadPartCommand).then((url) => ({
                    url,
                    partNumber: i,
                }));

                urls.push(url);
            }

            return {
                uploadId,
                urls: await Promise.all(urls),
            };
        }),

    completeMultipartUpload: publicProcedure
        .input(
            z.object({
                key: z.string(),
                uploadId: z.string(),
                parts: z.array(
                    z.object({
                        ETag: z.string(),
                        PartNumber: z.number(),
                    })
                ),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const { key, uploadId, parts } = input;
            const { s3 } = ctx;

            const completeMultipartUploadOutput =
                await s3.completeMultipartUpload({
                    Bucket: env.AWS_BUCKET_NAME,
                    Key: key,
                    UploadId: uploadId,
                    MultipartUpload: {
                        Parts: parts,
                    },
                });

            return completeMultipartUploadOutput;
        }),
});
