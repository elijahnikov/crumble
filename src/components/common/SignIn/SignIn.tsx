import Button from "@/components/ui/Button/Button";
import { type BuiltInProviderType } from "next-auth/providers";
import {
    type ClientSafeProvider,
    type LiteralUnion,
    getCsrfToken,
    getProviders,
} from "next-auth/react";
import { useEffect, useState } from "react";
import { type IconType } from "react-icons";
import { BsDiscord, BsGithub, BsGoogle, BsTwitter } from "react-icons/bs";

interface DiscordSignInProps {
    callbackUrl: string | string[] | undefined;
}

const providerLogoMap: Record<string, IconType> = {
    Discord: BsDiscord,
    GitHub: BsGithub,
    Google: BsGoogle,
    Twitter: BsTwitter,
};

const SignIn = ({ callbackUrl }: DiscordSignInProps) => {
    const [providers, setProviders] = useState<Record<
        LiteralUnion<BuiltInProviderType, string>,
        ClientSafeProvider
    > | null>(null);
    const [csrfToken, setCsrfToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        const fetchNextAuth = async () => {
            if (status !== "loading") {
                if (providers === null) {
                    const providersTemp = await getProviders();
                    setProviders(providersTemp);
                    if (csrfToken === undefined) {
                        const csrfTokenTemp = await getCsrfToken();
                        setCsrfToken(csrfTokenTemp);
                    }
                }
            }
        };

        void fetchNextAuth();
    }, [csrfToken, providers]);
    return (
        <>
            {providers &&
                Object.keys(providers).map((providerKey, index) => (
                    <div className="hidden lg:block" key={index}>
                        <form
                            action={providers[providerKey]?.signinUrl}
                            method="POST"
                            className="space-y-3 text-center"
                        >
                            <input
                                type="hidden"
                                name="csrfToken"
                                value={csrfToken}
                            />
                            {providers[providerKey]?.callbackUrl && (
                                <input
                                    type="hidden"
                                    name="callbackUrl"
                                    value={callbackUrl}
                                />
                            )}

                            <Button
                                className="mt-2 min-w-[250px] py-2"
                                intent="secondary"
                                type="submit"
                                size={"base"}
                                leftIcon={
                                    providerLogoMap[
                                        providers[providerKey]!.name
                                    ]
                                }
                            >
                                Sign in with {providers[providerKey]!.name}
                            </Button>
                        </form>
                    </div>
                ))}
        </>
    );
};

export default SignIn;
