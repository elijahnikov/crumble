import Layout, { Container } from "@/components/common/Layout/Layout";
import SignIn from "@/components/common/SignIn/SignIn";
import { LOGO_URL } from "@/constants";
import Image from "next/image";

const LoginPage = () => {
    return (
        <Layout hideNavBar hideFooter customWidth="400">
            <div className="flex h-screen w-full items-center  justify-center">
                <Container>
                    <div className="mx-auto mt-5 flex w-[400px] justify-center px-4 pb-4 text-center dark:border-gray-700">
                        <div className="flex gap-2">
                            <span className="sr-only">Crumble</span>

                            <Image
                                alt="Supercrumble logo"
                                width={40}
                                height={40}
                                src={LOGO_URL}
                            />
                            <h2 className="my-auto font-bold text-black dark:text-white">
                                Crumble{" "}
                            </h2>
                        </div>
                    </div>
                    <h3 className="py-5 text-center text-slate-600 dark:text-slate-200">
                        Sign into your account
                    </h3>

                    <div className="mx-auto flex justify-center">
                        <div>
                            <SignIn callbackUrl={"/"} />
                        </div>
                    </div>
                </Container>
            </div>
        </Layout>
    );
};

export default LoginPage;
