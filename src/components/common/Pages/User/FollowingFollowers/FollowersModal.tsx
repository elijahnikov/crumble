import LoadingSpinner from "@/components/common/LoadingSpinner/LoadingSpinner";
import Modal from "@/components/ui/Modal/Modal";
import { api } from "@/utils/api";
import InfiniteScroll from "react-infinite-scroll-component";
import UserEntry from "./Entry";

const FollowersModal = ({
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
        data = api.subscription.getFollowersForUser.useInfiniteQuery(
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

    const followers = data.data?.pages.flatMap((page) => page.followers);

    if (!followers) {
        return null;
    }
    return (
        <>
            <Modal open={open} onOpenChange={setOpen}>
                <Modal.Content title="Followers">
                    <>
                        {data?.isLoading ? (
                            <div className="flex w-full justify-center text-center">
                                <LoadingSpinner size={30} />
                            </div>
                        ) : (
                            <div className="max-h-[200px] min-h-[200px] overflow-y-auto">
                                {data?.data && (
                                    <InfiniteScroll
                                        dataLength={followers?.length}
                                        next={data.fetchNextPage}
                                        hasMore={data.hasNextPage!}
                                        loader={
                                            <div className="flex w-full justify-center text-center">
                                                <LoadingSpinner size={30} />
                                            </div>
                                        }
                                        height="200px"
                                    >
                                        {followers.length > 0 &&
                                            data.data?.pages
                                                .flatMap(
                                                    (page) => page.followers
                                                )
                                                .map((follower, index) => (
                                                    <UserEntry
                                                        key={
                                                            follower.userId +
                                                            index
                                                        }
                                                        follower={follower}
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

export default FollowersModal;
