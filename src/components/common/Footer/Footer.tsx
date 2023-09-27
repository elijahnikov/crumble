import { BsGithub, BsLinkedin, BsTwitter } from "react-icons/bs";

const Footer = () => {
    return (
        <footer className="mt-[-10px]">
            <div className="mx-auto flex items-center justify-between space-x-2 px-6 px-8 pb-8">
                <div className="flex justify-center space-x-6 "></div>
                <div className="mt-0  mt-6">
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
                <div className="mt-6 flex space-x-2">
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
            </div>
        </footer>
    );
};

export default Footer;
