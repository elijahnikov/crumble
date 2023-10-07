import Button from "@/components/ui/Button/Button";
import { createNewActivity } from "@/server/helpers/createActivity";
import { type RouterOutputs, api } from "@/utils/api";

const ActivityTab = ({
    user,
    isMe,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe: boolean;
}) => {
    const { data, isLoading } =
        api.activity.getActivityForUser.useInfiniteQuery(
            {
                username: user.name!,
                limit: 10,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );

    return <></>;
};

export default ActivityTab;
