import { prisma } from "../db";

const activityIdNames = [
    "listId",
    "listEntryId",
    "watchedId",
    "reviewId",
    "favouriteMovieId",
    "reviewLikeId",
] as const;

type PartialRecord<K extends string, T> = {
    [P in K]?: T;
};

type ActivityIdNamesType = (typeof activityIdNames)[number];

interface CreateNewActivityParams2 {
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
};

export const createNewActivity = async ({
    currentUserId,
    idMap,
}: CreateNewActivityParams2) => {
    console.log(idMap);
    const privacySettingsForUser = await prisma.privacy.findFirst({
        where: {
            userId: currentUserId,
        },
    });
    console.log(Object.keys(idMap));
    // const check =
    //     privacySettingsForUser &&
    //     privacySettingsForUser[
    //         activityToPrivacySettingMapping[
    //             activity as keyof typeof activityToPrivacySettingMapping
    //         ] as keyof typeof privacySettingsForUser
    //     ];
    // if (check) {
    //     await prisma.activity.create({
    //         data:
    //             secondId && secondIdName
    //                 ? {
    //                       userId: currentUserId,
    //                       [activity]: id,
    //                       [secondIdName]: secondId,
    //                   }
    //                 : {
    //                       userId: currentUserId,
    //                       [activity]: id,
    //                   },
    //     });
    // }
};
