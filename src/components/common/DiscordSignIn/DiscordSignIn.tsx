import Button from "@/components/ui/Button/Button";
import { type BuiltInProviderType } from "next-auth/providers";
import {
    type ClientSafeProvider,
    type LiteralUnion,
    getCsrfToken,
    getProviders,
} from "next-auth/react";
import { useEffect, useState } from "react";

interface DiscordSignInProps {
    callbackUrl: string | string[] | undefined;
}

const DiscordSignIn = ({ callbackUrl }: DiscordSignInProps) => {
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
                Object.keys(providers).map((providerKey, i) => (
                    <div key={i}>
                        <form
                            action={providers[providerKey]?.signinUrl}
                            method="POST"
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

                            <Button intent="secondary" type="submit">
                                Sign in
                                <i
                                    className={
                                        "bi-" + providers[providerKey]?.id
                                    }
                                    role="img"
                                    aria-label="Discord"
                                ></i>
                            </Button>
                        </form>
                    </div>
                ))}
        </>
    );
};

export default DiscordSignIn;
