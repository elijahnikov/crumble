import {
    TabsList,
    Tabs,
    TabsContent,
    TabsTrigger,
} from "@/components/ui/Tabs/Tabs";
import { movieDetailsFetchSchema } from "@/utils/types/schemas";
import { useState } from "react";
import { z } from "zod";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { showJobs } from "@/utils/constants";

interface MovieInfoTabsProps {
    movieInfo: Pick<
        z.infer<typeof movieDetailsFetchSchema>,
        | "credits"
        | "production_companies"
        | "production_countries"
        | "spoken_languages"
        | "alternative_titles"
    >;
}

const MovieInfoTabs = ({ movieInfo }: MovieInfoTabsProps) => {
    return (
        <div className="float-right mr-5 mt-10 w-[65%]">
            <Tabs defaultValue="cast" className="w-[100%]">
                <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="cast">Cast</TabsTrigger>
                    <TabsTrigger value="crew">Crew</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="genres">Genres</TabsTrigger>
                    <TabsTrigger value="releases">Releases</TabsTrigger>
                </TabsList>
                <TabsContent value="cast" className="mr-2">
                    <Cast cast={movieInfo.credits.cast} />
                </TabsContent>
                <TabsContent value="crew">
                    <Crew crew={movieInfo.credits.crew} />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default MovieInfoTabs;

const Cast = ({
    cast,
}: {
    cast: MovieInfoTabsProps["movieInfo"]["credits"]["cast"];
}) => {
    const [amountShowed, setAmountShowed] = useState<number>(12);

    const handleShowMore = () => {
        setAmountShowed(amountShowed + 12);
    };

    return (
        <div className="ml-2 mt-[10px]">
            <h3 className="ml-2">Cast</h3>
            <div className="mb-[15px] mt-[10px] grid w-full grid-cols-6 gap-2">
                {cast &&
                    cast
                        .filter((obj) => {
                            return obj.profile_path;
                        })
                        .slice(0, amountShowed)
                        .map((d) => (
                            <div
                                key={d.id}
                                className="inline-block cursor-pointer"
                            >
                                <Image
                                    alt={d.name}
                                    src={`https://image.tmdb.org/t/p/w500/${d.profile_path}`}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    className="rounded-md border-t-[1px] dark:border-gray-800"
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        ))}
            </div>
            <div className="flex space-x-2">
                {cast.length > amountShowed && (
                    <Button size={"sm"} onClick={handleShowMore}>
                        Show more...
                    </Button>
                )}
                {amountShowed > 12 && (
                    <Button
                        onClick={() => setAmountShowed(12)}
                        size="sm"
                        intent="secondary"
                    >
                        Show less
                    </Button>
                )}
            </div>
        </div>
    );
};

const Crew = ({
    crew,
}: {
    crew: MovieInfoTabsProps["movieInfo"]["credits"]["crew"];
}) => {
    const groupJobs = (): { [job: string]: typeof crew } => {
        return crew.reduce(function (memo: any, x: any) {
            if (!memo[x["job"]]) {
                memo[x["job"]] = [];
            }
            memo[x["job"]].push(x);
            return memo;
        }, {});
    };

    const groupedJobs = groupJobs();
    console.log({ groupedJobs: groupedJobs["Screenplay"] });

    return (
        <div className="ml-2 mt-[10px] w-[98%]">
            <h3 className="ml-2">Crew</h3>
            <div className="mt-5">
                {showJobs.map((job: { title: string; label: string }) => (
                    <div className="mt-2" key={job.title}>
                        {groupedJobs[job.title as keyof typeof groupedJobs] && (
                            <div className="flex border-b-[1px] border-gray-300 dark:border-gray-800">
                                <p className="text-sm text-slate-700 dark:text-slate-400">
                                    {job.label.toLocaleUpperCase()}
                                </p>
                                <div className="align-right float-right ml-auto inline w-[200px] text-right">
                                    {groupedJobs[job.title] &&
                                        groupedJobs[job.title]?.map((j) => (
                                            <div
                                                key={j.id}
                                                className="mb-2 ml-2 inline-block 
                                            cursor-pointer rounded-[5px] border-t-[1px] 
                                            border-gray-200 bg-brand-white p-[5px] text-xs 
                                            text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                            >
                                                {j.name}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
