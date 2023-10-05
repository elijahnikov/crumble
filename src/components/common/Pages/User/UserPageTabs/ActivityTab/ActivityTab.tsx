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
    const { data, isLoading } = api.activity.getActivityForUser.useQuery({
        username: user.name!,
        specificActivity: ["favouriteMovie", "watched", "review", "listEntry"],
        limit: 10,
    });

    const { data: settings } =
        api.privacy.getPrivacySettingsByUserId.useQuery();

    return <></>;
};

export default ActivityTab;
