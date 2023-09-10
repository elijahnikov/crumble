const Footer = () => {
    return (
        <footer className="">
            <div className="mx-auto max-w-7xl px-6 pb-8 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex justify-center space-x-6 md:order-2"></div>
                <div className="mt-6 md:order-1 md:mt-0">
                    <p className="text-center leading-5 text-gray-400">
                        Made by{" "}
                        <a
                            className="text-gray-300 hover:text-green-100"
                            href="https://hudsonyuen.com"
                            target="_blank"
                            rel="noreferrer"
                        >
                            ENKV
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
