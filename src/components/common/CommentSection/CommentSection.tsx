import Button from "@/components/ui/Button/Button";
import InputArea from "@/components/ui/InputArea/InputArea";
import { useSession } from "next-auth/react";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import { fromNow } from "@/utils/general/dateFormat";
import { BsHeartFill, BsThreeDots } from "react-icons/bs";
import { Menu, Transition } from "@headlessui/react";
import clxsm from "@/utils/clsxm";
import InfiniteScroll from "react-infinite-scroll-component";

interface Comment {
    id: string;
    text: string;
    linkedToId: string;
    user: {
        name: string | null;
        displayName: string | null;
        id: string;
        image: string | null;
    };
    likeCount: number;
    likedByMe: boolean;
    createdAt: Date;
}

interface CommentSectionProps {
    linkedToId: string;
    commentCount: number;
    isLoading: boolean;
    isError: boolean;
    hasMore?: boolean;
    fetchNewComments: () => Promise<unknown>;
    createNewComment: (variables: { text: string; linkedToId: string }) => void;
    deleteComment: (variables: { id: string }) => void;
    toggleLike: (variables: { id: string }) => void;
    comments?: Comment[];
}

const CommentSection = ({
    linkedToId,
    commentCount,
    isLoading,
    isError,
    hasMore,
    fetchNewComments,
    createNewComment,
    deleteComment,
    toggleLike,
    comments,
}: CommentSectionProps) => {
    const [commentText, setCommentText] = useState<string>("");

    const { data: session } = useSession();
    const authenticated = !!session;

    const handlePostComment = () => {
        if (commentText !== "")
            createNewComment({ linkedToId, text: commentText });
        setCommentText("");
    };

    if (isLoading) return <div>Loading...</div>;

    if (isError) return <div>Error...</div>;

    if (comments === null || typeof comments === "undefined") return null;

    return (
        <>
            <div className="rounded-md border-[1px] border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-brand-light">
                <p>{commentCount} comments</p>
                {authenticated && (
                    <>
                        <InputArea
                            className="mt-2 h-[80px]"
                            fullWidth
                            value={commentText}
                            change={setCommentText}
                            placeholder={`Leave a comment as ${session?.user.name}`}
                        />
                        <Button
                            className="float-right"
                            onClick={handlePostComment}
                        >
                            Post
                        </Button>
                    </>
                )}
                <hr className="mt-12 border-gray-200 dark:border-gray-700" />
                <InfiniteScroll
                    dataLength={comments.length}
                    next={fetchNewComments}
                    hasMore={hasMore!}
                    loader={"Loading..."}
                >
                    {comments.map((comment) => (
                        <SingleComment
                            deleteComment={deleteComment}
                            toggleLike={toggleLike}
                            comment={comment}
                            currentUserId={session?.user.id}
                            key={comment.id}
                        />
                    ))}
                </InfiniteScroll>
            </div>
        </>
    );
};

export default CommentSection;

interface SingleCommentProps {
    comment: Comment;
    deleteComment: (variables: { id: string }) => void;
    toggleLike: (variables: { id: string }) => void;
    currentUserId?: string;
}

const SingleComment = ({
    comment,
    currentUserId,
    deleteComment,
    toggleLike,
}: SingleCommentProps) => {
    const handleToggleLike = () => {
        toggleLike({ id: comment.id });
    };

    return (
        <div className="mt-2 rounded-lg  p-2">
            <div className="flex">
                <div className="flex w-[100%]">
                    {comment.user.image && (
                        <Image
                            src={comment.user.image}
                            width={35}
                            height={35}
                            className="rounded-full"
                            alt={comment.user.name!}
                        />
                    )}
                    <p className="ml-2 mt-2 text-sm text-slate-700 dark:text-slate-400">
                        {comment.user.name!} says,
                    </p>
                    <p className="float-right ml-2 mt-[11px] inline text-xs text-gray-500">
                        {fromNow(comment.createdAt)}
                    </p>
                </div>
                <CommentActionPopover
                    deleteComment={deleteComment}
                    commentId={comment.id}
                    commentAuthorId={comment.user.id}
                    currentUserId={currentUserId}
                />
            </div>
            <div className="flex">
                <p className="my-4 ml-1 w-[90%] text-slate-700 dark:text-slate-300">
                    {comment.text}
                </p>
            </div>
            <div className="ml-2 flex space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                <BsHeartFill
                    onClick={handleToggleLike}
                    className={clxsm(
                        comment.likedByMe
                            ? "fill-crumble"
                            : "fill-gray-600 dark:fill-gray-300",
                        "mt-[5px] h-3 w-3 cursor-pointer hover:fill-crumble hover:dark:fill-crumble"
                    )}
                />
                <div className="mt-[3px] flex space-x-1 text-xs">
                    <p>{comment.likeCount}</p>
                </div>
            </div>
            <hr className="mt-5 border-gray-200 dark:border-gray-700" />
        </div>
    );
};

const CommentActionPopover = ({
    commentId,
    commentAuthorId,
    currentUserId,
    deleteComment,
}: {
    commentId: string;
    commentAuthorId: string;
    currentUserId?: string;
    deleteComment: (variables: { id: string }) => void;
}) => {
    const matchingUserId = commentAuthorId === currentUserId;

    const handleDeleteComment = () => {
        deleteComment({ id: commentId });
    };

    return (
        <Menu as="div" className="relative ml-3">
            <div>
                <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    <div>
                        <BsThreeDots className="mr-1 mt-1 fill-slate-700 dark:fill-slate-300" />
                    </div>
                </Menu.Button>
            </div>
            <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
            >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border-[1px] bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-gray-800 dark:bg-brand">
                    {!matchingUserId && (
                        <Menu.Item>
                            <div className="block px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">
                                Report
                            </div>
                        </Menu.Item>
                    )}

                    {matchingUserId && (
                        <Menu.Item>
                            {({ active }) => (
                                <div
                                    onClick={handleDeleteComment}
                                    className={clxsm(
                                        active ? "bg-brand-light" : "",
                                        "flex cursor-pointer px-4 py-2 text-sm text-crumble dark:text-crumble"
                                    )}
                                >
                                    Delete
                                </div>
                            )}
                        </Menu.Item>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    );
};
