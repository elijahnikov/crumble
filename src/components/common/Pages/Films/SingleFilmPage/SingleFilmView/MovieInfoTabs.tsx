import {
    TabsList,
    Tabs,
    TabsContent,
    TabsTrigger,
} from "@/components/ui/Tabs/Tabs";
import { type movieDetailsFetchSchema } from "@/utils/types/schemas";
import { useState } from "react";
import { type z } from "zod";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { showJobs } from "@/utils/constants";
import Tooltip from "@/components/ui/Tooltip/Tooltip";

interface MovieInfoTabsProps {
    movieInfo: Pick<
        z.infer<typeof movieDetailsFetchSchema>,
        | "credits"
        | "production_companies"
        | "production_countries"
        | "spoken_languages"
        | "alternative_titles"
        | "genres"
    >;
}

const MovieInfoTabs = ({ movieInfo }: MovieInfoTabsProps) => {
    return (
        <div className="float-right mr-7 mt-10 w-[93%]">
            <Tabs defaultValue="cast" className="w-[100%]">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="cast">Cast</TabsTrigger>
                    <TabsTrigger value="crew">Crew</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="genres">Genres</TabsTrigger>
                </TabsList>
                <TabsContent value="cast">
                    <Cast cast={movieInfo.credits.cast} />
                </TabsContent>
                <TabsContent value="crew">
                    <Crew crew={movieInfo.credits.crew} />
                </TabsContent>
                <TabsContent value="details">
                    <Details
                        companies={movieInfo.production_companies}
                        countries={movieInfo.production_countries}
                        languages={movieInfo.spoken_languages}
                        alternativeTitles={movieInfo.alternative_titles}
                    />
                </TabsContent>
                <TabsContent value="genres">
                    <Genres genres={movieInfo.genres} />
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
    const [amountShowed, setAmountShowed] = useState<number>(16);

    const handleShowMore = () => {
        setAmountShowed(amountShowed + 16);
    };

    return (
        <div className="mt-[20px]">
            <div className="flex">
                <h3>Cast</h3>
                <p className="pl-2 pt-[12px] text-xs text-slate-500 dark:text-slate-400">
                    {cast.length} cast members
                </p>
            </div>
            <div className="mb-[15px] mt-[10px] grid w-full grid-cols-8 gap-2">
                {cast
                    ? cast
                          .filter((obj) => {
                              return obj.profile_path;
                          })
                          .slice(0, amountShowed)
                          .map((d) => (
                              <div
                                  key={d.id}
                                  className="inline-block cursor-pointer"
                              >
                                  <Tooltip>
                                      <Tooltip.Trigger>
                                          <Image
                                              alt={d.name}
                                              src={`https://image.tmdb.org/t/p/w500/${d.profile_path}`}
                                              width={0}
                                              height={0}
                                              sizes="100vw"
                                              className="rounded-md border-t-[1px] opacity-0 duration-[0.5s] dark:border-gray-800"
                                              style={{
                                                  width: "100%",
                                                  height: "100%",
                                              }}
                                              onLoadingComplete={(image) =>
                                                  image.classList.remove(
                                                      "opacity-0"
                                                  )
                                              }
                                          />
                                      </Tooltip.Trigger>
                                      <Tooltip.Content>
                                          {d.name}
                                      </Tooltip.Content>
                                  </Tooltip>
                              </div>
                          ))
                    : null}
            </div>
            <div className="flex space-x-2">
                {cast.length > amountShowed && (
                    <Button size={"sm"} onClick={handleShowMore}>
                        Show more...
                    </Button>
                )}
                {amountShowed > 16 && (
                    <Button
                        onClick={() => setAmountShowed(16)}
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
    const groupJobs = (): Record<string, typeof crew> => {
        return crew.reduce(function (
            memo: Record<string, typeof crew>,
            x: (typeof crew)[0]
        ) {
            if (!memo[x.job]) {
                memo[x.job] = [];
            }
            memo[x.job]!.push(x);
            return memo;
        },
        {});
    };

    const groupedJobs = groupJobs();

    return (
        <div className="mt-[20px] w-[98%]">
            <h3>Crew</h3>
            <div className="mt-6">
                {showJobs.map((job: { title: string; label: string }) => (
                    <div className="mt-2" key={job.title}>
                        {groupedJobs[job.title] && (
                            <div className="mb-[25px] mt-[-10px] flex  border-b-[1px] border-gray-300 dark:border-gray-800">
                                <p className="text-xs text-slate-700 dark:text-slate-400">
                                    {job.label.toLocaleUpperCase()}
                                </p>
                                <div className="align-right float-right ml-auto inline w-[200px] text-right">
                                    {groupedJobs[job.title]
                                        ? groupedJobs[job.title]?.map((j) => (
                                              <div
                                                  key={j.id}
                                                  className="mb-2 ml-2 inline-block 
                                            cursor-pointer rounded-[5px] border-t-[1px] 
                                            border-gray-200 bg-brand-white p-[5px] text-xs 
                                            text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                              >
                                                  {j.name}
                                              </div>
                                          ))
                                        : null}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

interface DetailsProps {
    companies: MovieInfoTabsProps["movieInfo"]["production_companies"];
    countries: MovieInfoTabsProps["movieInfo"]["production_countries"];
    languages: MovieInfoTabsProps["movieInfo"]["spoken_languages"];
    alternativeTitles: MovieInfoTabsProps["movieInfo"]["alternative_titles"];
}

const Details = ({
    companies,
    countries,
    languages,
    alternativeTitles,
}: DetailsProps) => {
    return (
        <div className="mt-[20px]">
            <h3>Details</h3>
            <div className="mt-4 w-[100%]">
                <div>
                    <div className="mb-[25px] flex  border-b-[1px] border-gray-300 dark:border-gray-800">
                        <p className="text-xs text-slate-700 dark:text-slate-400">
                            STUDIOS
                        </p>

                        <div className="align-right float-right ml-auto inline w-[400px] text-right">
                            {companies.map((company) => (
                                <span
                                    key={company.id}
                                    className="mb-2 ml-2 inline-block 
                                            cursor-pointer rounded-[5px] border-t-[1px] 
                                            border-gray-200 bg-brand-white p-[5px] text-xs 
                                            text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                >
                                    {company.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-[25px] mt-[-10px] flex  border-b-[1px] border-gray-300 dark:border-gray-800">
                        <p className="text-xs text-slate-700 dark:text-slate-400">
                            COUNTRIES
                        </p>

                        <div className="align-right float-right ml-auto inline w-[400px] text-right">
                            {countries.map((country) => (
                                <span
                                    key={country.iso_3166_1}
                                    className="mb-2 ml-2 inline-block 
                                            cursor-pointer rounded-[5px] border-t-[1px] 
                                            border-gray-200 bg-brand-white p-[5px] text-xs 
                                            text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                >
                                    {country.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-[25px] mt-[-10px] flex  border-b-[1px] border-gray-300 dark:border-gray-800">
                        <p className="text-xs text-slate-700 dark:text-slate-400">
                            LANGUAGES
                        </p>

                        <div className="align-right float-right ml-auto inline w-[400px] text-right">
                            {languages.map((language) => (
                                <span
                                    key={language.iso_639_1}
                                    className="mb-2 ml-2 inline-block 
                                            cursor-pointer rounded-[5px] border-t-[1px] 
                                            border-gray-200 bg-brand-white p-[5px] text-xs 
                                            text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                >
                                    {language.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-[25px] mt-[-10px] flex  border-b-[1px] border-gray-300 dark:border-gray-800">
                        <p className="text-xs text-slate-700 dark:text-slate-400">
                            ALTERNATIVE TITLES
                        </p>

                        <div className="align-right float-right ml-auto inline w-[400px] text-right">
                            {alternativeTitles.titles.map((title) => (
                                <span
                                    key={title.iso_3166_1}
                                    className="mb-2 ml-2 inline-block 
                                            cursor-pointer rounded-[5px] border-t-[1px] 
                                            border-gray-200 bg-brand-white p-[5px] text-xs 
                                            text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                >
                                    {title.title}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Genres = ({
    genres,
}: {
    genres: Array<{
        id: number;
        name: string;
    }>;
}) => {
    return (
        <div className="mt-[20px]">
            <h3>Genres</h3>
            <div className="mt-4 w-[100%]">
                <div>
                    <div className="mb-[25px] flex  border-b-[1px] border-gray-300 dark:border-gray-800">
                        <p className="text-xs text-slate-700 dark:text-slate-400">
                            GENRES
                        </p>

                        <div className="align-right float-right ml-auto inline w-[400px] text-right">
                            {genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="mb-2 ml-2 inline-block 
                                    cursor-pointer rounded-[5px] border-t-[1px] 
                                    border-gray-200 bg-brand-white p-[5px] text-xs 
                                    text-slate-700 hover:bg-gray-200 dark:border-gray-800 dark:bg-brand dark:text-white dark:hover:bg-gray-800"
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
