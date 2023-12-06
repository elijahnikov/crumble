import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import { Select } from "@/components/ui/Select/Select";
import {
    type IPersonDetailsFetch,
    personDetailsFetchSchema,
    personCreditsSchema,
    type IPersonCreditsFetch,
} from "@/server/api/schemas/person";
import { fetchWithZod } from "@/utils/fetch/zodFetch";
import { useRouter } from "next/router";
import { useState, useCallback, useEffect } from "react";
import { type ZodType } from "zod";
import Image from "next/image";
import _ from "lodash";
import MovieImage from "../../Movies/AllMovies/MovieImage/MovieImage";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import clxsm from "@/utils/clsxm";
import Tooltip from "@/components/ui/Tooltip/Tooltip";

interface CreditType {
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    department?: string | null;
    id: number;
    original_language: string;
    original_title: string;
    job?: string | null;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
    character: string | null;
    credit_id: string;
    order: number | null;
}

const jobHeadingMapping: Record<string, string> = {
    actor: "starring",
    "executive producer": "executive produced by",
    producer: "produced by",
    director: "directed by",
    editor: "edited by",
    writer: "written by",
    composer: "composed by",
    cinematography: "shot by",
    "set decoration": "with set decoration by",
    "co-producer": "co-produced by",
};

const renamedJobTypes: Record<string, string> = {
    "director of photography": "cinematography",
    "original music composer": "composer",
    "set designer": "set decoration",
};

const ignoredJobTypes = ["Screenplay", "Thanks", "Story", "Characters"];

const sortObj = {
    Popularity: "popularity",
    "Release date": "release_date",
    Alphabetical: "original_title",
    Watched: "watched",
};

const SinglePersonView = ({
    type,
    name,
}: {
    type: string | string[] | undefined;
    name: string;
}) => {
    const { data: session } = useSession();

    const { data } = api.watched.watched.useQuery({
        username: String(session?.user.name),
    });

    const formattedName = name.split("-")[0];
    const formattedType = String(type).toLocaleLowerCase();
    const nameSplit = name.split("-");
    const personId = nameSplit[nameSplit.length - 1];

    const [showExtraText, setShowExtraText] = useState<boolean>(false);
    const [highlight, setHighlight] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [sortBy, setSortBy] = useState<string>("popularity");

    const [details, setDetails] = useState<IPersonDetailsFetch>();
    const [credits, setCredits] = useState<Record<string, CreditType[]>>({});

    const watched = data?.watched.map((w) => w.movieId);
    const toCountAgainst = credits[formattedType]?.map((c) => c.id);
    const matchingElementsFilter = watched?.filter((item) =>
        toCountAgainst?.includes(item)
    );

    const fetchPersonDetails = useCallback(async () => {
        setLoading(true);
        if (name && name !== "") {
            const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US`;

            const data = (await fetchWithZod(
                url,
                personDetailsFetchSchema as ZodType
            )) as IPersonDetailsFetch;

            if (data) setDetails(data);
        }

        if (name && name !== "") {
            const url = `https://api.themoviedb.org/3/person/${personId}/movie_credits?language=en-US`;
            const data = (await fetchWithZod(
                url,
                personCreditsSchema as ZodType
            )) as IPersonCreditsFetch;
            parseCreditsInfo(data);
        }

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    }, [name, personId]);

    const parseCreditsInfo = (credits: IPersonCreditsFetch) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempObj: Record<string, CreditType[]> = {};

        if (credits.cast) {
            tempObj.actor = credits.cast;
        }
        if (credits.crew) {
            const crewDataSet = credits.crew;
            for (const crew of crewDataSet) {
                const { job, ...rest } = crew;
                if (!ignoredJobTypes.includes(job)) {
                    const renamedJob =
                        renamedJobTypes[job.toLocaleLowerCase()] ??
                        job.toLocaleLowerCase();
                    tempObj[renamedJob] = tempObj[renamedJob] ?? [];
                    tempObj[renamedJob]!.push({
                        job: renamedJob,
                        ...rest,
                    } as CreditType);
                }
            }
        }
        setCredits(tempObj);
    };

    useEffect(() => {
        void fetchPersonDetails();
    }, [fetchPersonDetails]);

    return (
        <>
            {loading ? (
                <div className="mt-5 flex items-center justify-center align-middle">
                    <LoadingSpinner size={50} />
                </div>
            ) : (
                <div>
                    <div className="flex">
                        <div>
                            <Header
                                formattedType={formattedType}
                                formattedName={formattedName}
                                name={name}
                                credits={credits}
                                details={details}
                                sortBy={[sortBy, setSortBy]}
                            />
                            <div className="mt-2 grid w-full grid-cols-4 gap-3 border-t-[1px] py-2 dark:border-slate-700">
                                {credits[formattedType]
                                    ?.sort((a, b) => {
                                        if (sortBy === "popularity") {
                                            return b.popularity - a.popularity;
                                        } else if (sortBy === "release_date") {
                                            return (
                                                new Date(
                                                    b.release_date
                                                ).getTime() -
                                                new Date(
                                                    a.release_date
                                                ).getTime()
                                            );
                                        } else if (
                                            sortBy === "original_title"
                                        ) {
                                            if (
                                                a.original_title <
                                                b.original_title
                                            )
                                                return -1;
                                            if (
                                                a.original_title >
                                                b.original_title
                                            )
                                                return 1;
                                            return 0;
                                        } else if (
                                            sortBy === "watched" &&
                                            watched
                                        ) {
                                            const aWatchedIndex =
                                                watched.indexOf(a.id);
                                            const bWatchedIndex =
                                                watched.indexOf(b.id);

                                            if (
                                                aWatchedIndex === -1 &&
                                                bWatchedIndex === -1
                                            )
                                                return 0;
                                            if (aWatchedIndex === -1) return 1;
                                            if (bWatchedIndex === -1) return -1;
                                            return (
                                                aWatchedIndex - bWatchedIndex
                                            );
                                        }
                                        return 0;
                                    })
                                    .map((credit) => (
                                        <div key={credit.id}>
                                            <Tooltip>
                                                <Tooltip.Trigger>
                                                    <div>
                                                        <MovieImage
                                                            movie={{
                                                                movieId:
                                                                    credit.id,
                                                                poster: credit.poster_path,
                                                                title: credit.original_title,
                                                            }}
                                                            highlight={
                                                                highlight
                                                                    ? matchingElementsFilter
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                </Tooltip.Trigger>
                                                <Tooltip.Content>
                                                    <div className="flex space-x-1">
                                                        <p className="text-crumble">
                                                            as
                                                        </p>
                                                        <p>
                                                            {credit.character}
                                                        </p>
                                                    </div>
                                                </Tooltip.Content>
                                            </Tooltip>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        <div className="ml-4 w-[50%] px-10">
                            <div className="max-w-[200px]">
                                <Image
                                    alt={formattedName ?? ""}
                                    width={0}
                                    height={0}
                                    sizes="100vw"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                    }}
                                    src={`https://image.tmdb.org/t/p/w500/${details?.picture}`}
                                    className="rounded-md border-t-[1px] dark:border-gray-800"
                                />
                            </div>
                            <p className="mt-5 max-w-[300px] text-sm text-slate-700 dark:text-slate-400">
                                {showExtraText
                                    ? details?.biography
                                    : details?.biography.slice(0, 200) + "..."}

                                <span
                                    onClick={() =>
                                        setShowExtraText(!showExtraText)
                                    }
                                    className="cursor-pointer text-crumble"
                                >
                                    {!showExtraText ? " More" : " Less"}
                                </span>
                            </p>
                            {matchingElementsFilter &&
                                typeof toCountAgainst !== "undefined" && (
                                    <div
                                        className="cursor-pointer"
                                        onClick={() =>
                                            matchingElementsFilter.length > 0 &&
                                            setHighlight(!highlight)
                                        }
                                    >
                                        <Tracker
                                            highlight={highlight}
                                            countAgainstLength={
                                                toCountAgainst.length
                                            }
                                            matchingLength={
                                                matchingElementsFilter.length
                                            }
                                        />
                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const Header = ({
    formattedType,
    formattedName,
    name,
    credits,
    sortBy,
}: {
    formattedType: string;
    formattedName: string | undefined;
    name: string;
    credits: Record<string, unknown>;
    details: IPersonDetailsFetch | undefined;
    sortBy: [string, React.Dispatch<React.SetStateAction<string>>];
}) => {
    const router = useRouter();
    const [sortByValue, setSortBy] = sortBy;
    return (
        <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Movies {jobHeadingMapping[formattedType]}
            </p>
            <h3>{formattedName}</h3>
            <div className="mt-5 space-x-2">
                <Select
                    size="sm"
                    label="Job"
                    value={_.upperFirst(String(formattedType))}
                    setValue={() => null}
                >
                    {Object.keys(credits).map((credit, index) => {
                        const formattedCredit = _.startCase(_.toLower(credit));
                        return (
                            <Select.Item
                                size="sm"
                                key={index}
                                value={formattedCredit}
                                onClick={() =>
                                    void router.replace({
                                        pathname: `/people/${credit}/${name}/`,
                                    })
                                }
                            >
                                {formattedCredit}
                            </Select.Item>
                        );
                    })}
                </Select>
                <Select
                    label="Sort"
                    size="sm"
                    value={sortByValue}
                    setValue={() => null}
                >
                    {Object.keys(sortObj).map((sort, index) => {
                        return (
                            <Select.Item
                                size="sm"
                                key={index}
                                value={sortObj[sort as keyof typeof sortObj]}
                                onClick={() =>
                                    setSortBy(
                                        sortObj[sort as keyof typeof sortObj]
                                    )
                                }
                            >
                                {sort}
                            </Select.Item>
                        );
                    })}
                </Select>
            </div>
        </div>
    );
};

const Tracker = ({
    matchingLength,
    countAgainstLength,
    highlight,
}: {
    matchingLength: number;
    countAgainstLength: number;
    highlight: boolean;
}) => {
    return (
        <Tooltip>
            <Tooltip.Trigger>
                <div
                    className={clxsm(
                        "mt-5 w-full rounded-md border bg-brand-white dark:border-slate-700 dark:bg-brand",
                        !highlight
                            ? "border-slate-200 dark:border-slate-700"
                            : "border-crumble dark:border-crumble"
                    )}
                >
                    <div className="flex p-2">
                        <div className="w-full">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                You have watched
                            </p>
                            <div className="flex space-x-1">
                                <p>{matchingLength}</p>
                                <p>/</p>
                                <p>{countAgainstLength}</p>
                            </div>
                        </div>
                        <div>
                            <h2 className="mt-1 text-slate-700 dark:text-slate-200">
                                {(
                                    (matchingLength / countAgainstLength) *
                                    100
                                ).toFixed()}
                                %
                            </h2>
                        </div>
                    </div>
                    <div
                        style={{
                            width: `${(
                                (matchingLength / countAgainstLength) *
                                100
                            ).toFixed()}%`,
                        }}
                        className={clxsm(
                            "h-1 bg-crumble",
                            matchingLength !== countAgainstLength
                                ? "rounded-bl-md"
                                : "rounded-b-md"
                        )}
                    />
                </div>
            </Tooltip.Trigger>
            <Tooltip.Content>
                <p>Click to toggle highlight watched</p>
            </Tooltip.Content>
        </Tooltip>
    );
};

export default SinglePersonView;
