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
    "executive producer": "executive produced",
    producer: "produced",
    director: "directed",
    editor: "edited",
    writer: "written",
    composer: "composed",
    cinematography: "shot",
    "set decoration": "with set decoration",
};

const renamedJobTypes: Record<string, string> = {
    "director of photography": "cinematography",
    "original music composer": "composer",
    "set designer": "set decoration",
};

const ignoredJobTypes = ["Screenplay", "Thanks", "Story", "Characters"];

const SinglePersonView = ({
    type,
    name,
}: {
    type: string | string[] | undefined;
    name: string;
}) => {
    const router = useRouter();

    const formattedName = name.split("-")[0];
    const formattedType = String(type).toLocaleLowerCase();
    const personId = name.split("-")[1];

    const [showExtraText, setShowExtraText] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const [details, setDetails] = useState<IPersonDetailsFetch>();
    const [credits, setCredits] = useState<Record<string, CreditType[]>>({});

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
            // if (data) setCredits(data);
        }

        setTimeout(() => {
            setLoading(false);
        }, Math.floor(Math.random() * (1000 - 200 + 1)) + 200);
    }, [name, personId]);

    const parseCreditsInfo = (credits: IPersonCreditsFetch) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const tempObj: Record<string, CreditType[]> = {};

        if (credits.cast) {
            console.log(1, credits.cast);
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
        console.log(tempObj);
        setCredits(tempObj);
    };

    useEffect(() => {
        void fetchPersonDetails();
    }, [fetchPersonDetails]);

    return (
        <>
            {loading && <LoadingSpinner />}
            <div>
                <div className="flex">
                    <div>
                        <Header
                            formattedType={formattedType}
                            formattedName={formattedName}
                            name={name}
                            credits={credits}
                            details={details}
                        />
                        <div className="mt-2 grid w-full grid-cols-4 gap-3 border-t-[1px] py-2 dark:border-slate-700">
                            {credits[formattedType]
                                ?.sort((a, b) => b.popularity - a.popularity)
                                .map((credit) => (
                                    <MovieImage
                                        key={credit.id}
                                        movie={{
                                            movieId: credit.id,
                                            poster: credit.poster_path,
                                            title: credit.original_title,
                                        }}
                                    />
                                ))}
                        </div>
                    </div>
                    <div className="ml-4 px-10">
                        <Image
                            alt={formattedName ?? ""}
                            src={`https://image.tmdb.org/t/p/w500/${details?.picture}`}
                            width={400}
                            height={400}
                            className="rounded-md border-t-[1px] dark:border-gray-800"
                        />
                        <p className="mt-5 max-w-[300px] text-sm dark:text-slate-400">
                            {showExtraText
                                ? details?.biography
                                : details?.biography.slice(0, 120) + "..."}

                            <span
                                onClick={() => setShowExtraText(!showExtraText)}
                                className="cursor-pointer text-crumble"
                            >
                                {!showExtraText ? " More" : " Less"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

const Header = ({
    formattedType,
    formattedName,
    name,
    credits,
    details,
}: {
    formattedType: string;
    formattedName: string | undefined;
    name: string;
    credits: Record<string, unknown>;
    details: IPersonDetailsFetch | undefined;
}) => {
    const router = useRouter();
    return (
        <div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
                Movies {jobHeadingMapping[formattedType]} by
            </p>
            <h3>{formattedName}</h3>
            <div className="mt-5">
                <Select
                    size="sm"
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
            </div>
        </div>
    );
};

export default SinglePersonView;
