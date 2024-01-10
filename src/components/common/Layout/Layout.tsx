import NavigationBar from "../Navigation/NavigationBar/NavigationBar";
import MobileNavigationBar from "../Navigation/MobileNavigationBar/MobileNavigationBar";
import clxsm from "@/utils/clsxm";
import Footer from "../Footer/Footer";

interface LayoutProps {
    children: React.ReactNode;
    fullWidth?: boolean;
    hideNavBar?: boolean;
    hideFooter?: boolean;
    customWidth?: string;
}

const Layout = ({
    children,
    fullWidth,
    hideNavBar = false,
    hideFooter = false,
    customWidth = "1000",
}: LayoutProps) => {
    // const { data: session } = useSession();
    // const authenticated = !!session;

    return (
        <div className="flex flex-col lg:flex-row">
            {!hideNavBar && (
                <div className="sticky top-0 z-20">
                    <aside className="sticky top-0 hidden h-screen lg:block">
                        <NavigationBar />
                    </aside>
                    <aside className="sticky top-0 z-20 lg:hidden">
                        <MobileNavigationBar />
                    </aside>
                </div>
            )}

            <main className="mx-auto flex h-full w-full flex-col items-center gap-6 px-4 py-8 dark:bg-brand sm:px-6 sm:pt-12 lg:px-8">
                <div
                    style={{ maxWidth: customWidth + "px" }}
                    className={clxsm(
                        fullWidth ? "w-full" : "w-[90vw] lg:w-[60vw]",
                        "flex flex-col gap-8"
                    )}
                >
                    {children}
                </div>
                {!hideFooter && <Footer />}
            </main>
        </div>
    );
};

export default Layout;

export const Container = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="rounded-lg border-[1px] border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-brand-light">
            <div className="w-[100%] pb-5">{children}</div>
        </div>
    );
};
