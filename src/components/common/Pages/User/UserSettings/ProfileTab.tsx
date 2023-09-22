import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import StandardDropzone from "@/components/common/StandardDropzone/StandardDropzone";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import { PLACEHOLDER_USER_IMAGE_URL } from "@/constants";
import { api, type RouterOutputs } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProfileTabProps {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}

const ProfileTab = ({ user }: ProfileTabProps) => {
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
            onSuccess: () => {
                toast.success(`Updated your user details.`, {
                    position: "bottom-center",
                    duration: 4000,
                    className: "dark:bg-brand dark:text-white text-black",
                });
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
            <h2>Profile</h2>
            <div className="relative mt-[20px]">
                <p className="pb-2 text-sm">
                    Change your profile picture and header.
                </p>
                <div>
                    {user.header ? (
                        <StandardDropzone to="header">
                            <Image
                                width={0}
                                height={0}
                                sizes="100vw"
                                src={user.header}
                                alt={user.name!}
                                className="h-[200px] rounded-lg object-cover opacity-0 duration-[0.5s]"
                                priority
                                style={{ width: "100%" }}
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        </StandardDropzone>
                    ) : (
                        <StandardDropzone to="header">
                            <div className="h-[200px] w-full rounded-lg bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100" />
                        </StandardDropzone>
                    )}
                    {user.image ? (
                        <StandardDropzone to="image">
                            <Image
                                width={110}
                                height={110}
                                className="shadow-xs absolute bottom-0 left-0 -mb-[20px] ml-4 rounded-full opacity-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] duration-[0.5s]"
                                src={user.image}
                                priority
                                alt="Profile picture"
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        </StandardDropzone>
                    ) : (
                        <StandardDropzone to="image">
                            <Image
                                width={110}
                                height={110}
                                className="shadow-xs absolute bottom-0 left-0 -mb-[20px] ml-4 rounded-full opacity-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] duration-[0.5s]"
                                src={PLACEHOLDER_USER_IMAGE_URL}
                                priority
                                alt="Profile picture"
                                onLoadingComplete={(image) =>
                                    image.classList.remove("opacity-0")
                                }
                            />
                        </StandardDropzone>
                    )}
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
                <div className="flex space-x-2">
                    <Button
                        onClick={handleCancel}
                        intent={"secondary"}
                        disabled={!hasEdited}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={!hasEdited}
                        onClick={() =>
                            editUserDetailsMutate({
                                ...inputs,
                                name: inputs.username,
                                header: headerPreview,
                                image: imagePreview,
                            })
                        }
                    >
                        Save
                    </Button>
                </div>
            </div>
        </>
    );
};

export default ProfileTab;
