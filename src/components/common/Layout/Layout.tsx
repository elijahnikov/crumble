import { useSession } from "next-auth/react";
import NavigationBar from "../NavigationBar/NavigationBar";
import MobileNavigationBar from "../MobileNavigationBar/MobileNavigationBar";
import clxsm from "@/utils/clsxm";

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
    fullWidth?: boolean;
}

const Layout = ({ children, title, fullWidth }: LayoutProps) => {
    const { data: session } = useSession();
    const authenticated = !!session;

    return (
        <div className="flex flex-col lg:flex-row">
            {authenticated && (
                <div className="sticky top-0 z-20">
                    <aside className="sticky top-0 hidden h-screen lg:block">
                        <NavigationBar />
                    </aside>
                    <aside className="sticky top-0 z-20 lg:hidden">
                        <MobileNavigationBar />
                    </aside>
                </div>
            )}

            <main className="mx-auto flex w-full flex-col items-center gap-6 px-4 py-8 dark:bg-brand sm:px-6 sm:pt-12 lg:px-8">
                <div
                    className={clxsm(
                        fullWidth ? "w-full" : "w-[80vw] lg:w-[45vw]",
                        "flex flex-col gap-6 lg:gap-8"
                    )}
                >
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;