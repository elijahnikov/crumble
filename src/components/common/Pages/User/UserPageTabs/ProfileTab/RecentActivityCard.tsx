import { api, type RouterOutputs } from "@/utils/api";

interface RecentActivityCardProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

const RecentActivityCard = ({ user }: RecentActivityCardProps) => {
    const { data } = api.activity.getActivityForUser.useQuery({
        username: user.name!,
        limit: 5,
    });

    data && console.log(data);

    return (
        <div>
            <div className="flex">
                <p className="w-full text-sm text-slate-600 dark:text-slate-300">
                    Recent activity
                </p>
            </div>
            <div className="border-b pt-1 dark:border-slate-500" />
        </div>
    );
};

export default RecentActivityCard;
