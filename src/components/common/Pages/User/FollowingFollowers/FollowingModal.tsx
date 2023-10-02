import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Modal from "@/components/ui/Modal/Modal";
import { api } from "@/utils/api";
import InfiniteScroll from "react-infinite-scroll-component";
import { FollowingUserEntry } from "./Entry";

const FollowingModal = ({
    open,
    setOpen,
    username,
    toggleSubscription,
}: {
    open: boolean;
    setOpen: (value: boolean) => void;
    username: string;
    toggleSubscription: ({ id }: { id: string }) => void;
}) => {
    let data;
    if (open) {
        data = api.subscription.getFollowingForUser.useInfiniteQuery(
            {
                username,
                limit: 5,
            },
            {
                getNextPageParam: (lastPage) => lastPage.nextCursor,
            }
        );
    }

    if (!data) {
        return null;
    }

    const following = data.data?.pages.flatMap((page) => page.following);

    if (!following) {
        return null;
    }
    return (
        <>
            <Modal open={open} onOpenChange={setOpen}>
                <Modal.Content title="Following">
                    <>
                        {data?.isLoading ? (
                            <div className="flex w-full justify-center text-center">
                                <LoadingSpinner size={30} />
                            </div>
                        ) : (
                            <div className="max-h-[300px] min-h-[300px] overflow-y-auto">
                                {data?.data && (
                                    <InfiniteScroll
                                        dataLength={following?.length}
                                        next={data.fetchNextPage}
                                        hasMore={data.hasNextPage!}
                                        loader={
                                            <div className="flex w-full justify-center text-center">
                                                <LoadingSpinner size={30} />
                                            </div>
                                        }
                                        height="300px"
                                    >
                                        {following.length > 0 &&
                                            data.data?.pages
                                                .flatMap(
                                                    (page) => page.following
                                                )
                                                .map((following, index) => (
                                                    <FollowingUserEntry
                                                        key={
                                                            following.userId +
                                                            index
                                                        }
                                                        following={following}
                                                        toggleSubscription={
                                                            toggleSubscription
                                                        }
                                                    />
                                                ))}
                                    </InfiniteScroll>
                                )}
                            </div>
                        )}
                    </>
                </Modal.Content>
            </Modal>
        </>
    );
};

export default FollowingModal;
