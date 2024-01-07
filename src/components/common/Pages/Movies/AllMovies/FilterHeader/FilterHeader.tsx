import Button from "@/components/ui/Button/Button";
import { Select } from "@/components/ui/Select/Select";
import { decades, genres, sortings } from "@/utils/data/constants";
import { useRouter } from "next/router";
import CastSearch from "../CastSearch/CastSearch";
import { type ICastSearch } from "@/server/api/schemas/movie";
import useIsMobile from "@/utils/hooks/useIsMobile";

const FilterHeader = ({
    decade,
    genre,
    sort,
    chosenCast,
    setChosenCast,
    handleRemove,
}: {
    decade: string;
    genre: string;
    sort: string;
    chosenCast: Array<ICastSearch>;
    setChosenCast: React.Dispatch<React.SetStateAction<Array<ICastSearch>>>;
    handleRemove: (castId: number) => void;
}) => {
    const isMobile = useIsMobile();
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 gap-[15px] md:grid-cols-4">
            <CastSearch
                isMobile={isMobile}
                chosenCast={chosenCast}
                setChosenCast={setChosenCast}
                handleRemove={handleRemove}
            />
            <Select
                label={isMobile ? undefined : "Decade"}
                size="sm"
                value={decade}
                setValue={() => null}
            >
                {["All", ...Object.keys(decades)].map((decade, index) => (
                    <Select.Item
                        size="sm"
                        key={index}
                        value={`${decade}`}
                        onClick={() => {
                            if (decade === "All") {
                                const { query, pathname } = router;
                                delete query.decade;
                                void router.replace({
                                    pathname,
                                    query,
                                });
                            } else {
                                void router.replace({
                                    pathname: "/movies/all/",
                                    query: {
                                        ...router.query,
                                        decade,
                                    },
                                });
                            }
                        }}
                    >
                        {decade}
                    </Select.Item>
                ))}
            </Select>
            <Select
                label={isMobile ? undefined : "Genre"}
                size="sm"
                value={genre}
                setValue={() => null}
            >
                {genres.map((genre, index) => (
                    <Select.Item
                        size="sm"
                        key={index}
                        value={genre.name}
                        onClick={() =>
                            void router.replace({
                                pathname: "/movies/all/",
                                query: {
                                    ...router.query,
                                    genre: genre.name,
                                },
                            })
                        }
                    >
                        {genre.name}
                    </Select.Item>
                ))}
            </Select>
            <Select
                label={isMobile ? undefined : "Sort by"}
                size="sm"
                value={sort}
                setValue={() => null}
            >
                {sortings.map((sorting, index) => (
                    <Select.Item
                        size="sm"
                        key={index}
                        value={sorting.name}
                        onClick={() =>
                            void router.replace({
                                pathname: "/movies/all/",
                                query: {
                                    ...router.query,
                                    sort: sorting.name,
                                },
                            })
                        }
                    >
                        {sorting.name}
                    </Select.Item>
                ))}
            </Select>
            <div className="mt-[18px]">
                {Object.keys(router.query).length > 0 && (
                    <Button
                        onClick={() => {
                            const { pathname } = router;
                            void router.replace({
                                pathname,
                            });
                        }}
                        intent={"secondary"}
                        size="sm"
                    >
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};

export default FilterHeader;
