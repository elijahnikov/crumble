import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="mt-[-10px]">
            <div className="mx-auto max-w-7xl space-x-2 px-6 pb-8 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2"></div>
                <div className="mt-6  md:mt-0">
                    <p className="text-center text-xs leading-5 text-gray-400 dark:text-slate-500">
                        Made by{" "}
                        <a
                            className="text-gray-500 dark:text-slate-400"
                            href="https://enkv.me"
                            target="_blank"
                            rel="noreferrer"
                        >
                            ENKV
                        </a>
                    </p>
                </div>
                <a href="https://github.com/elijahnikov" target="_blank">
                    <BsGithub className="h-3 w-3 fill-slate-600 dark:fill-slate-300" />
                </a>
                <a href="https://twitter.com/elijahnikov" target="_blank">
                    <BsTwitter className="h-3 w-3 fill-slate-600 dark:fill-slate-300" />
                </a>
                <a
                    href="https://www.linkedin.com/in/elijah-posnikov/"
                    target="_blank"
                >
                    <BsLinkedin className="h-3 w-3 fill-slate-600 dark:fill-slate-300" />
                </a>
            </div>
        </footer>
    );
};

export default Footer;
