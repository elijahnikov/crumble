import Link from "next/link";
import Image from "next/image";
import {
    type ClientSafeProvider,
    type LiteralUnion,
    getCsrfToken,
    getProviders,
    useSession,
} from "next-auth/react";
import Button from "@/components/ui/Button/Button";
import { type BuiltInProviderType } from "next-auth/providers";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import DiscordSignIn from "../DiscordSignIn/DiscordSignIn";
import DarkModeSwitch from "../DarkModeSwitch/DarkModeSwitch";

const NavigationBar = () => {
    const router = useRouter();
    const { data: session } = useSession();
    return (
        <div className="fixed z-10 flex min-h-[5vh] w-full bg-white text-center text-black dark:bg-black dark:text-white">
            <div className="align-center ml-[10px] inline-flex w-full min-w-[80%] items-center ">
                <Link
                    href={"/"}
                    className="align-center ml-[10px] flex items-center"
                >
                    <Image
                        alt="Supercrumble logo"
                        width={60}
                        height={60}
                        src="https://i.ibb.co/r4WtSVc/supercrumble800x800.png"
                    />
                    <h3 className="ml-[10px]">Crumble</h3>
                </Link>
            </div>
            <div className="mx-0 mr-5 flex w-[10%] items-center justify-center text-center">
                <DarkModeSwitch />
                {session &&
                    (session.user.image ? (
                        <Image
                            src={session.user.image}
                            alt={`${session.user.name}'s Profile Picture`}
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : null)}
                {!session && (
                    <DiscordSignIn callbackUrl={router.query.callbackUrl} />
                )}
            </div>
        </div>
    );
};

export default NavigationBar;
