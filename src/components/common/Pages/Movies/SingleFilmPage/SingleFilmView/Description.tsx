import clxsm from "@/utils/clsxm";

const Description = ({
    isMobile,
    children,
    directors,
    overview,
    releaseDate,
    tagline,
    title,
}: {
    isMobile: boolean;
    releaseDate: string;
    title: string;
    directors: string[];
    tagline: string;
    overview: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={clxsm(
                "ml-[20px] mt-[22px]",
                isMobile && "mx-auto mt-[50px] w-[90%] justify-center"
            )}
        >
            <div className="flex">
                <div>
                    <span className="text-md mt-[7px] font-semibold text-crumble">
                        {releaseDate}
                    </span>
                    <h2>{title}</h2>
                </div>
            </div>
            <div className="mt-2 flex">
                <p className="mr-1 text-xs text-gray-600 dark:text-gray-300">
                    Directed by{" "}
                </p>
                <span className="flex space-x-2  break-words text-xs text-gray-600 dark:text-gray-300">
                    {directors.map((director, index) => (
                        <p key={index}>
                            <span className="text-crumble underline">
                                {director}
                            </span>
                        </p>
                    ))}
                </span>
            </div>
            <div className="mt-5 space-y-4">
                <p className="font-semibold text-slate-800 dark:text-slate-400">
                    {tagline}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300">
                    {overview}
                </p>
                <div className="pt-[5%]">{children}</div>
            </div>
        </div>
    );
};

export default Description;
