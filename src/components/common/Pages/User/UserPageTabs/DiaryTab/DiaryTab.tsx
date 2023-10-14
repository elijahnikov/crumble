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
            limit: 32,
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
    return (
        <div>
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
                                {movie.createdAt.toDateString()}
                            </TableCell>
                            <TableCell>
                                {movie.createdAt.toDateString()}
                            </TableCell>
                            <TableCell>{movie.movieTitle}</TableCell>
                            <TableCell>{movie.movie.releaseDate}</TableCell>
                            <TableCell>{movie.ratingGiven}</TableCell>
                            <TableCell>{""}</TableCell>
                            <TableCell>{""}</TableCell>
                        </TableRow>
                    ))}
                    {/* <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell className="font-medium">INV001</TableCell>
                        <TableCell>Paid</TableCell>
                        <TableCell>Credit Card</TableCell>
                        <TableCell className="text-right">$250.00</TableCell>
                    </TableRow> */}
                </TableBody>
            </Table>
        </div>
    );
};

export default DiaryTab;
