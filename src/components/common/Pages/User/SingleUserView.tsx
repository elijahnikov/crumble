import Button from "@/components/ui/Button/Button";
import { type RouterOutputs } from "@/utils/api";
import Image from "next/image";

interface SingleUserViewProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
    isMe: boolean;
}

const SingleUserView = ({ user, isMe }: SingleUserViewProps) => {
    return (
        <div>
            <UserHeader isMe={isMe} userHeaderData={user} />
            <UserInfo user={user} isMe={isMe} />
        </div>
    );
};

export default SingleUserView;

interface UserHeaderProps {
    userHeaderData: SingleUserViewProps["user"];
    isMe: boolean;
}

const UserHeader = ({ userHeaderData, isMe }: UserHeaderProps) => {
    const user = userHeaderData;

    return (
        <div>
            <div className="relative">
                {user.header ? (
                    <Image
                        width={0}
                        height={0}
                        sizes="100vw"
                        src={user.header}
                        alt={user.name!}
                        className="h-[250px] rounded-lg object-cover opacity-0 duration-[0.5s]"
                        priority
                        style={{ width: "100%" }}
                        onLoadingComplete={(image) =>
                            image.classList.remove("opacity-0")
                        }
                    />
                ) : (
                    <div className="h-[250px] w-full rounded-lg bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100" />
                )}
                {user.image && (
                    <>
                        <Image
                            width={140}
                            height={140}
                            className="absolute bottom-0 left-0 -mb-[30px] ml-4 rounded-full opacity-0 shadow-xl drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)] duration-[0.5s]"
                            src={user.image}
                            priority
                            alt="Profile picture"
                            onLoadingComplete={(image) =>
                                image.classList.remove("opacity-0")
                            }
                        />
                    </>
                )}
                {isMe && (
                    <Button
                        intent={"secondary"}
                        className="absolute bottom-0 right-0 mb-[20px] mr-[20px]"
                    >
                        Edit profile
                    </Button>
                )}
            </div>
        </div>
    );
};

const UserInfo = ({
    user,
    isMe,
}: {
    user: SingleUserViewProps["user"];
    isMe: boolean;
}) => {
    return (
        <div className="mt-12 flex px-5">
            <div className="flex w-[80%]">
                <div>
                    {<h3>{user.displayName ? user.displayName : user.name}</h3>}
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                        @{user.name}
                    </p>
                </div>
                <div>{isMe && <Button className="ml-5">Follow</Button>}</div>
            </div>

            <div className="relative w-[100%]">
                <div className="ml-5 flex w-[90%] w-full space-x-4 text-center text-sm text-slate-600 dark:text-slate-300">
                    <div>
                        <h3>{user.followers}</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            followers
                        </p>
                    </div>
                    <div>
                        <h3>{user.following}</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            following
                        </p>
                    </div>
                    <div>
                        <h3>{user.totalHoursWatched}</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            hours watched
                        </p>
                    </div>
                    <div>
                        <h3>{user.totalListsCreated}</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            lists created
                        </p>
                    </div>
                    <div>
                        <h3>{user.totalMoviesWatched}</h3>
                        <p className="text-slate-500 dark:text-slate-400">
                            movies watched
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
