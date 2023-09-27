import { prisma } from "../db";

interface CreateNewActivityParams {
    currentUserId: string;
    action: string;
    activity: string;
    id: string;
}

export const createNewActivity = async ({
    currentUserId,
    action,
    activity,
    id,
}: CreateNewActivityParams) => {
    await prisma.activity.create({
        data: {
            userId: currentUserId,
            action,
            [activity]: id,
        },
    });
};
