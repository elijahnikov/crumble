import Button from "@/components/ui/Button/Button";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface FollowersUserEntryProps {
    follower: {
        name: string | null;
        displayName: string | null;
        image: string | null;
        userId: string;
        amIFollowing: boolean;
    };
    toggleSubscription: ({ id }: { id: string }) => void;
}

export const FollowersUserEntry = ({
    follower,
    toggleSubscription,
}: FollowersUserEntryProps) => {
    const { data: session } = useSession();

    return (
        <>
            <div className="flex">
                <div className="w-[8%]">
                    {follower.image && (
                        <Image
                            src={follower.image}
                            alt={follower.name!}
                            width={44}
                            height={44}
                            className="rounded-full"
                        />
                    )}
                </div>
                <div className="w-[90%] pl-4">
                    <p className="font-semibold">
                        {follower.displayName
                            ? follower.displayName
                            : follower.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        @{follower.name}
                    </p>
                </div>
                <div className="mr-2 pt-[6px]">
                    {session?.user.id !== follower.userId && (
                        <Button
                            onClick={() =>
                                toggleSubscription({
                                    id: follower.userId,
                                })
                            }
                            intent={
                                follower.amIFollowing ? "secondary" : "primary"
                            }
                        >
                            {follower.amIFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                </div>
            </div>
            <hr className="my-2 dark:border-slate-800" />
        </>
    );
};

interface FollowingUserEntryProps {
    following: {
        name: string | null;
        displayName: string | null;
        image: string | null;
        userId: string;
        amIFollowing: boolean;
    };
    toggleSubscription: ({ id }: { id: string }) => void;
}

export const FollowingUserEntry = ({
    following,
    toggleSubscription,
}: FollowingUserEntryProps) => {
    const { data: session } = useSession();
    console.log(following);
    return (
        <>
            <div className="flex">
                <div className="w-[8%]">
                    {following.image && (
                        <Image
                            src={following.image}
                            alt={following.name!}
                            width={44}
                            height={44}
                            className="rounded-full"
                        />
                    )}
                </div>
                <div className="w-[90%] pl-4">
                    <p className="font-semibold">
                        {following.displayName
                            ? following.displayName
                            : following.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-500">
                        @{following.name}
                    </p>
                </div>
                <div className="mr-2 pt-[6px]">
                    {session?.user.id !== following.userId && (
                        <Button
                            onClick={() =>
                                toggleSubscription({
                                    id: following.userId,
                                })
                            }
                            intent={
                                following.amIFollowing ? "secondary" : "primary"
                            }
                        >
                            {following.amIFollowing ? "Unfollow" : "Follow"}
                        </Button>
                    )}
                </div>
            </div>
            <hr className="my-2 dark:border-slate-800" />
        </>
    );
};
