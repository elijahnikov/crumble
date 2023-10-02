import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Button from "@/components/ui/Button/Button";
import { api, type RouterOutputs } from "@/utils/api";
import uncamelize from "@/utils/general/uncamelizeText";
import { Switch } from "@headlessui/react";

import Link from "next/link";
import toast from "react-hot-toast";

interface PrivacyTabProps {
    user: NonNullable<RouterOutputs["user"]["getUserForSettings"]>;
}

const PrivacyTab = ({ user }: PrivacyTabProps) => {
    const trpcUtils = api.useContext();
    const { data: settings, isLoading } =
        api.privacy.getPrivacySettingsByUserId.useQuery();

    const {
        mutate: changeSetting,
        isLoading: changeSettingLoading,
        variables,
    } = api.privacy.setPrivacySettings.useMutation({
        onSuccess: async (data) => {
            toast.success("Updated your privacy settings", {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
            await trpcUtils.privacy.invalidate();
        },
        onError: (message) => {
            toast.error(message.message, {
                position: "bottom-center",
                duration: 4000,
                className: "dark:bg-brand dark:text-white text-black",
            });
        },
    });

    const handleChangeSetting = (setting: string, value: boolean) => {
        changeSetting({
            setting,
            value,
        });
    };

    return (
        <div>
            <div className="flex">
                <h2 className="w-[80%]">Profile</h2>
                <Link href="/[username]/profile" as={`/@${user.name}/profile`}>
                    <Button className="mt-[5px]" size="sm" intent={"secondary"}>
                        Back to profile
                    </Button>
                </Link>
            </div>
            <div>
                {isLoading ? (
                    <div className="mx-auto  flex w-full justify-center pt-10">
                        <LoadingSpinner size={40} />
                    </div>
                ) : (
                    settings && (
                        <div className="mt-5 space-y-4">
                            {Object.keys(settings)
                                .filter(
                                    (setting) =>
                                        !["id", "userId"].includes(setting)
                                )
                                .map((setting, index) => {
                                    const checked = Boolean(
                                        settings[
                                            setting as keyof typeof settings
                                        ]
                                    );
                                    return (
                                        <>
                                            {setting === "privateAccount" && (
                                                <p className="text-xs">
                                                    Private accounts will only
                                                    be visible to followers.
                                                    Users will have to request
                                                    to follow your profile.
                                                </p>
                                            )}
                                            {index === 1 && (
                                                <p className="text-xs">
                                                    Choose which activities on
                                                    Crumble will be shown on
                                                    your public profile.
                                                </p>
                                            )}
                                            <div
                                                className=" rounded-xl border px-5 py-5 dark:border-slate-700"
                                                key={index}
                                            >
                                                <div className="flex space-x-4">
                                                    <Switch
                                                        checked={checked}
                                                        onChange={() =>
                                                            handleChangeSetting(
                                                                setting,
                                                                !checked
                                                            )
                                                        }
                                                        className={`${
                                                            checked
                                                                ? "bg-crumble"
                                                                : "bg-slate-300 dark:bg-slate-700"
                                                        } relative inline-flex h-6 w-11 items-center rounded-full`}
                                                    >
                                                        <span
                                                            className={`${
                                                                checked
                                                                    ? "translate-x-6"
                                                                    : "translate-x-1"
                                                            } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                                                        />
                                                    </Switch>
                                                    <p>{uncamelize(setting)}</p>
                                                    {changeSettingLoading &&
                                                        setting ===
                                                            variables?.setting && (
                                                            <div className="pt-[2px]">
                                                                <LoadingSpinner
                                                                    size={20}
                                                                />
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                            {/* <hr className="border-slate-200 dark:border-slate-700" /> */}
                                        </>
                                    );
                                })}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default PrivacyTab;
