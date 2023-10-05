import { type RouterOutputs } from "@/utils/api";
import { prisma } from "../db";

const activityIdNames = [
    "listId",
    "listEntryId",
    "watchedId",
    "reviewId",
    "favouriteMovieId",
    "reviewLikeId",
    "userId",
] as const;

type PartialRecord<K extends string, T> = {
    [P in K]?: T;
};

type ActivityIdNamesType = (typeof activityIdNames)[number];

interface CreateNewActivityParams {
    currentUserId: string;
    idMap: Array<PartialRecord<ActivityIdNamesType, string>>;
}

const activityToPrivacySettingMapping: Record<ActivityIdNamesType, string> = {
    listId: "showListsInActivity",
    listEntryId: "showListEntryInActivity",
    watchedId: "showWatchedInActivity",
    reviewId: "showReviewInActivity",
    favouriteMovieId: "showFavouriteMovieInActivity",
    reviewLikeId: "showReviewLikeInActivity",
    userId: "showReviewLikeInActivity",
};

export const createNewActivity = async ({
    currentUserId,
    idMap,
}: CreateNewActivityParams) => {
    const privacySettingsForUser = await prisma.privacy.findFirst({
        where: {
            userId: currentUserId,
        },
    });
    const privacySettings: RouterOutputs["privacy"]["getPrivacySettingsByUserId"] =
        privacySettingsForUser;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allowedActivities: any = {
        userId: currentUserId,
    };

    for (const obj of idMap) {
        if (
            privacySettings![
                activityToPrivacySettingMapping[
                    Object.keys(
                        obj
                    )[0] as keyof typeof activityToPrivacySettingMapping
                ] as keyof typeof privacySettings
            ]
        ) {
            Object.assign(allowedActivities, obj);
        }
    }

    if (Object.keys(allowedActivities).length > 0) {
        await prisma.activity.create({
            data: allowedActivities,
        });
    }
};
