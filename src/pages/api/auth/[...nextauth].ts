import NextAuth from "next-auth";
import { authOptions } from "@/server/auth";

const authHandler = NextAuth(authOptions);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function handler(...params: any[]) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await authHandler(...params);
}
