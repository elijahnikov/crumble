import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/Table/Table";
import { type RouterOutputs, api } from "@/utils/api";
import dayjs from "dayjs";
import { BiRefresh } from "react-icons/bi";
import { BsListNested } from "react-icons/bs";
import { Rating } from "react-simple-star-rating";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button/Button";

const DiaryTab = ({
    user,
}: {
    user: NonNullable<RouterOutputs["user"]["getUser"]>;
}) => {
    const {
        data: movies,
        isInitialLoading,
        isError,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = api.watched.watched.useInfiniteQuery(
        {
            username: user.name!,
            limit: 10,
        },
        {
            getNextPageParam: (lastPage) => lastPage.nextCursor,
        }
    );

    if (isError) {
        return <div>Error...</div>;
    }

    if (isInitialLoading) {
        return (
            <div className="mx-auto mt-10 flex w-full justify-center">
                <LoadingSpinner size={40} />
            </div>
        );
    }

    const watched = movies?.pages.flatMap((page) => page.watched);

    if (!watched || watched.length === 0) {
        return (
            <p className="text-sm font-normal text-slate-600 dark:text-slate-400">
                {user.name} has not watched any movies just yet.
            </p>
        );
    }
    function modifyArray(arr: NonNullable<typeof watched>) {
        let lastMonth: number | null = null;

        arr.forEach((movie) => {
            const createdAt = new Date(movie.createdAt);
            const currentMonth = createdAt.getMonth() + 1;

            if (lastMonth === null || lastMonth !== currentMonth) {
                lastMonth = currentMonth;
            } else {
                movie.createdAt = new Date(movie.createdAt);
                movie.createdAt.setFullYear(1970);
            }
        });

        return arr;
    }

    const modifiedArray = modifyArray(watched);

    return (
        <div className="w-full">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">Month</TableHead>
                        <TableHead>Day</TableHead>
                        <TableHead>Film</TableHead>
                        <TableHead className="text-right">Released</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Rewatch</TableHead>
                        <TableHead>Review</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {watched.map((movie) => (
                        <TableRow key={movie.id}>
                            <TableCell>
                                {movie.createdAt.getFullYear() !== 1970 && (
                                    <div>
                                        <p className="text-lg font-bold uppercase dark:text-slate-200">
                                            {dayjs()
                                                .month(
                                                    movie.createdAt.getMonth()
                                                )
                                                .format("MMM")}
                                        </p>
                                        <p className="text-xs font-normal dark:text-slate-400">
                                            {dayjs()
                                                .year(
                                                    movie.createdAt.getFullYear()
                                                )
                                                .format("YYYY")}
                                        </p>
                                    </div>
                                )}
                            </TableCell>
                            <TableCell>
                                {
                                    <div>
                                        <p className="text-lg font-bold uppercase dark:text-slate-200">
                                            {dayjs(movie.createdAt).date()}
                                        </p>
                                        <p className="text-xs font-normal dark:text-slate-400">
                                            {dayjs()
                                                .year(movie.createdAt.getDay())
                                                .format("ddd")}
                                        </p>
                                    </div>
                                }
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center">
                                    <Link
                                        href={{
                                            pathname: "/movie/[id]",
                                            query: {
                                                id: movie.movieId,
                                            },
                                        }}
                                    >
                                        <Image
                                            className="rounded-md"
                                            width={50}
                                            height={0}
                                            alt={`${movie.movieTitle}`}
                                            src={`https://image.tmdb.org/t/p/w500${movie.poster}`}
                                        />
                                    </Link>
                                    <p className="ml-5 max-w-[70%] truncate">
                                        {movie.movieTitle}
                                    </p>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {dayjs(movie.movie.releaseDate).year()}
                            </TableCell>
                            <TableCell>
                                {movie.ratingGiven ? (
                                    <Rating
                                        style={{ marginBottom: "2px" }}
                                        emptyStyle={{ display: "flex" }}
                                        fillStyle={{
                                            display: "-webkit-inline-box",
                                        }}
                                        allowFraction={true}
                                        initialValue={movie.ratingGiven}
                                        size={14}
                                        readonly
                                        emptyColor="#404446"
                                        fillColor="#EF4444"
                                    />
                                ) : (
                                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                                        No rating given
                                    </p>
                                )}
                            </TableCell>
                            <TableCell>
                                {movie.rewatch && (
                                    <BiRefresh className="h-4 w-4" />
                                )}
                            </TableCell>
                            <TableCell>
                                {movie.reviewLink && (
                                    <Link
                                        href="/review/[id]/"
                                        as={`/review/${movie.reviewLink}`}
                                    >
                                        <BsListNested className="h-4 w-4" />
                                    </Link>
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            {hasNextPage && (
                <div className="mx-auto mt-5 flex w-[100%] justify-center">
                    <Button
                        onClick={() => void fetchNextPage()}
                        loading={isFetchingNextPage}
                        size={"sm"}
                    >
                        More
                    </Button>
                </div>
            )}
        </div>
    );
};

export default DiaryTab;
