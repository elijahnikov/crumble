import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import StandardDropzone from "@/components/common/StandardDropzone/StandardDropzone";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import { PLACEHOLDER_USER_IMAGE_URL } from "@/constants";
import { api, type RouterOutputs } from "@/utils/api";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import FavouriteMoviesEditable from "./FavouriteMoviesEditable";

interface ProfileTabProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

const isOutside30Days = (lastChangedDate: Date | null) => {
    if (!lastChangedDate) return true;
    const daysDifference = dayjs().diff(lastChangedDate?.toDateString(), "day");
    return daysDifference > 30;
};

const ProfileTab = ({ user }: ProfileTabProps) => {
    const router = useRouter();
    const [inputs, setInputs] = useState<{
        bio: string;
        bioLink: string;
        displayName: string;
        username: string;
    }>({
        bio: user.bio ?? "",
        bioLink: user.bioLink ?? "",
        displayName: user.displayName ?? "",
        username: user.name ?? "",
    });
    const [hasEdited, setHasEdited] = useState<boolean>(false);
    const [usernameTaken, setUsernameTaken] = useState<
        "taken" | "available" | "none"
    >("none");
    const [headerPreview, setHeaderPreview] = useState<string | undefined>("");
    const [imagePreview, setImagePreview] = useState<string | undefined>("");
    const [loadingUsernameCheck, setLoadingUsernameCheck] =
        useState<boolean>(false);

    const trpcUtils = api.useContext();
    const { update } = useSession();

    const { data: favouriteMovies } =
        api.user.getFavouriteMoviesForUser.useQuery({
            username: user.name!,
        });

    const { mutate: usernameCheck } = api.user.checkUsername.useMutation({
        onSuccess: (data) => {
            if (data.usernameTaken) {
                setUsernameTaken("taken");
            } else {
                setUsernameTaken("available");
            }
        },
    });

    const { mutate: editUserDetailsMutate } =
        api.user.editUserDetails.useMutation({
            onSuccess: async () => {
                toast.success(`Updated your user details.`, {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
                await trpcUtils.user.invalidate();
            },
            onError: (error) => {
                toast.error(
                    error.message
                        ? error.message
                        : `Could not update your details, please try again later.`,
                    {
                        position: "bottom-center",
                        duration: 4000,
                        className: "dark:bg-brand dark:text-white text-black",
                    }
                );
            },
        });

    const { mutate: changeUsername } = api.user.changeUsername.useMutation({
        onSuccess: async (data) => {
            toast.success(`Updated your username.`, {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
            void router.replace(`/@${data.newUsername}/profile`);
            await trpcUtils.user.invalidate();
            void update();
        },
        onError: (error) => {
            toast.error(
                error.message
                    ? error.message
                    : `Could not update your username, please try again later.`,
                {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                }
            );
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setHasEdited(true);
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const handleCancel = () => {
        setLoadingUsernameCheck(false);
        setHasEdited(false);
        setHeaderPreview("");
        setImagePreview("");
        setInputs({
            bio: user.bio ?? "",
            bioLink: user.bioLink ?? "",
            displayName: user.displayName ?? "",
            username: user.name ?? "",
        });
    };

    const setPreviews = (from: "header" | "image", url: string) => {
        if (from === "header") setHeaderPreview(url);
        else if (from === "image") setImagePreview(url);
    };

    useEffect(() => {
        if (inputs.username !== "" && inputs.username !== user.name)
            setLoadingUsernameCheck(true);
        setUsernameTaken("none");
        const delayDebounceFn = setTimeout(() => {
            if (inputs.username !== "" && inputs.username !== user.name) {
                usernameCheck({
                    username: inputs.username,
                });
            }
            setLoadingUsernameCheck(false);
        }, 1000);
        return () => {
            clearTimeout(delayDebounceFn);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputs.username]);

    return (
        <>
            <div className="flex">
                <h2 className="w-[80%]">Profile</h2>
                <Link href="/[username]/profile" as={`/@${user.name}/profile`}>
                    <Button className="mt-[5px]" size="sm" intent={"secondary"}>
                        Back to profile
                    </Button>
                </Link>
            </div>
            <div className="relative mt-[20px]">
                <p className="pb-2 text-sm">
                    Change your profile picture and header.
                </p>
                <div>
                    <StandardDropzone callback={setPreviews} to="header">
                        {/* eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing */}
                        {headerPreview ? (
                            <Image
                                width={0}
                                height={0}
                                sizes="100vw"
                                src={headerPreview}
                                alt={user.name!}
                                className="h-[200px] cursor-pointer rounded-lg object-cover opacity-0 duration-[0.5s]"
                                priority
                                style={{ width: "100%" }}
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        ) : user.header ? (
                            <Image
                                width={0}
                                height={0}
                                sizes="100vw"
                                src={user.header}
                                alt={user.name!}
                                className="h-[200px] cursor-pointer rounded-lg object-cover opacity-0 duration-[0.5s]"
                                priority
                                style={{ width: "100%" }}
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        ) : (
                            <div className="h-[200px] w-full cursor-pointer rounded-lg bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100" />
                        )}
                    </StandardDropzone>
                    <StandardDropzone callback={setPreviews} to="image">
                        {user.image ? (
                            <Image
                                width={110}
                                height={110}
                                className="shadow-xs absolute bottom-0 left-0 -mb-[20px] ml-4 cursor-pointer rounded-full opacity-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] duration-[0.5s]"
                                src={imagePreview ? imagePreview : user.image}
                                priority
                                alt="Profile picture"
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        ) : (
                            <Image
                                width={110}
                                height={110}
                                className="shadow-xs absolute bottom-0 left-0 -mb-[20px] ml-4 cursor-pointer rounded-full opacity-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] duration-[0.5s]"
                                src={PLACEHOLDER_USER_IMAGE_URL}
                                priority
                                alt="Profile picture"
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        )}
                    </StandardDropzone>
                </div>
            </div>
            <div className="h-[50px]" />
            <div className="space-y-5">
                <div className="flex">
                    <div className="w-[50%]">
                        <p className="ml-1 mt-2 text-sm">Username</p>
                        <Input
                            fullWidth
                            name="username"
                            placeholder="Username"
                            value={inputs.username}
                            onChange={handleChange}
                            className={`${
                                usernameTaken === "taken"
                                    ? "border-red-400 dark:border-red-400"
                                    : usernameTaken === "available"
                                    ? "border-green-400 dark:border-green-400"
                                    : usernameTaken === "none"
                                    ? ""
                                    : ""
                            }`}
                        />
                    </div>
                    <div className="ml-1 mt-10">
                        {loadingUsernameCheck && <LoadingSpinner />}
                    </div>
                    {usernameTaken === "available" &&
                        inputs.username !== user.name && (
                            <div className="mt-8">
                                <Button
                                    disabled={
                                        inputs.username === user.name ||
                                        !isOutside30Days(
                                            user.usernameChangeDate
                                        )
                                    }
                                    onClick={() => {
                                        if (
                                            inputs.username !== user.name &&
                                            isOutside30Days(
                                                user.usernameChangeDate
                                            )
                                        ) {
                                        }
                                        changeUsername({
                                            name: inputs.username,
                                        });
                                        setUsernameTaken("none");
                                    }}
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                </div>
                <div>
                    {usernameTaken === "taken" ? (
                        <p className="relative ml-2 mt-[-20px] text-sm text-crumble">
                            Username is taken
                        </p>
                    ) : usernameTaken === "available" ? (
                        <p className="relative ml-2 mt-[-20px] text-sm text-green-400">
                            Username is available
                        </p>
                    ) : null}
                </div>
                <div>
                    <p className="ml-1 mt-2 text-sm">Display name</p>
                    <div className="w-[50%]">
                        <Input
                            fullWidth
                            name="displayName"
                            placeholder="Display name"
                            value={inputs.displayName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <p className="ml-1 mt-2 text-sm">Website</p>
                    <div className="w-[50%]">
                        <Input
                            fullWidth
                            name="bioLink"
                            placeholder="Share something interesting"
                            value={inputs.bioLink}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <p className="ml-1 mt-2 text-sm">About you</p>
                    <div className="w-[100%]">
                        <InputArea
                            fullWidth
                            name="bio"
                            placeholder="Write a few words about yourself"
                            value={inputs.bio}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div>
                    <p className="ml-1 mt-2 text-sm">Your favourite movies</p>
                    {favouriteMovies && (
                        <FavouriteMoviesEditable
                            data={favouriteMovies}
                            user={user}
                            setHasEdited={setHasEdited}
                        />
                    )}
                </div>
                <div className="flex space-x-2">
                    <Button
                        onClick={handleCancel}
                        intent={"secondary"}
                        disabled={
                            !hasEdited &&
                            (headerPreview === "" || imagePreview === "")
                        }
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={
                            !hasEdited &&
                            headerPreview === "" &&
                            imagePreview === ""
                        }
                        onClick={() => {
                            editUserDetailsMutate({
                                ...inputs,
                                header: headerPreview,
                                image: imagePreview,
                            });
                            setHasEdited(false);
                            setHeaderPreview("");
                            setImagePreview("");
                        }}
                    >
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ProfileTab;
