import { prisma } from "../db";

interface CreateNewActivityParams {
    currentUserId: string;
    action: string;
    activity: string;
    id: string;
}

const activityToPrivacySettingMapping = {
    listId: "showListsInActivity",
    listEntryId: "showListEntryInActivity",
    watchedId: "showWatchedInActivity",
    reviewId: "showReviewInActivity",
    favouriteMovieId: "showFavouriteMovieInActivity",
};

export const createNewActivity = async ({
    currentUserId,
    action,
    activity,
    id,
}: CreateNewActivityParams) => {
    const privacySettingsForUser = await prisma.privacy.findFirst({
        where: {
            userId: currentUserId,
        },
    });
    const check =
        privacySettingsForUser &&
        privacySettingsForUser[
            activityToPrivacySettingMapping[
                activity as keyof typeof activityToPrivacySettingMapping
            ] as keyof typeof privacySettingsForUser
        ];
    if (check) {
        await prisma.activity.create({
            data: {
                userId: currentUserId,
                action,
                [activity]: id,
            },
        });
    }
};
