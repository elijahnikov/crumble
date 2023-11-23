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
    const [loading, setLoading] = useState<boolean>(false);
    const [details, setDetails] = useState<IPersonDetailsFetch>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [credits, setCredits] = useState<Record<string, any>>({});

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
        const tempObj: Record<string, any> = {};
        console.log({ credits });
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
                    tempObj[renamedJob].push({ job: renamedJob, ...rest });
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
            {loading && <LoadingSpinner />}
            <Header
                formattedType={formattedType}
                formattedName={formattedName}
                name={name}
                credits={credits}
                details={details}
            />
            {JSON.stringify(credits[formattedType])}
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
        <>
            <p>Movies {jobHeadingMapping[formattedType]} by</p>
            <h3>{formattedName}</h3>
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
            <div className="w-[20%]">
                <Image
                    alt={formattedName ?? ""}
                    src={`https://image.tmdb.org/t/p/w500/${details?.picture}`}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="rounded-md border-t-[1px] dark:border-gray-800"
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                />
            </div>
        </>
    );
};

export default SinglePersonView;
