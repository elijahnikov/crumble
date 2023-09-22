import StandardDropzone from "@/components/common/StandardDropzone/StandardDropzone";
import Input from "@/components/ui/Input/Input";
import InputArea from "@/components/ui/InputArea/InputArea";
import { api, type RouterOutputs } from "@/utils/api";
import Image from "next/image";
import { useEffect, useState } from "react";

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

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setHasEdited(true);
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
        checkIfUsernameExists(inputs.username);
    };

    function checkIfUsernameExists(username: string) {
        setUsernameTaken("none");
        console.log("here");
        const delayDebounceFn = setTimeout(() => {
            if (username !== "" && username !== user.name) {
                const { data } = api.user.checkUsername.useQuery(
                    {
                        username,
                    },
                    {
                        enabled: username !== "" && username !== user.name,
                    }
                );
                console.log(data);
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }

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
                            <div className="shadow-xs absolute bottom-0 left-0 -mb-[30px] ml-4 h-20 w-20 rounded-full opacity-0 drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)] duration-[0.5s]" />
                        </StandardDropzone>
                    )}
                </div>
            </div>
            <div className="h-[50px]" />
            <div className="space-y-5">
                <div>
                    <p className="ml-1 mt-2 text-sm">Username</p>
                    <div className="w-[50%]">
                        <Input
                            fullWidth
                            name="username"
                            placeholder="Username"
                            value={inputs.username}
                            onChange={handleChange}
                        />
                    </div>
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
            </div>
        </>
    );
};

export default ProfileTab;
