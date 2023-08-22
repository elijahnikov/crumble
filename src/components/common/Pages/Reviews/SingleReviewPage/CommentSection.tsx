import Button from "@/components/ui/Button/Button";
import InputArea from "@/components/ui/InputArea/InputArea";
import { api, type RouterOutputs } from "@/utils/api";
import { useSession } from "next-auth/react";
import React, { useState } from "react";

interface CommentSectionProps {
    review: RouterOutputs["review"]["review"];
}

const CommentSection = ({ review }: CommentSectionProps) => {
    const [commentText, setCommentText] = useState<string>("");

    const { commentCount, reviewComments } = review.review;
    const { data: session } = useSession();
    const authenticated = !!session;

    const trpcUtils = api.useContext();
    const { mutate } = api.review.createReviewComment.useMutation({
        onSuccess: async () => {
            await trpcUtils.review.review.invalidate();
        },
    });

    const handlePostComment = () => {
        if (commentText !== "")
            mutate({
                reviewId: review.review.id,
                text: commentText,
            });
        setCommentText("");
    };
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
                <hr className="mt-10 border-gray-200 dark:border-gray-700" />
                {reviewComments.map((comment) => (
                    <div key={comment.id}>{comment.text}</div>
                ))}
            </div>
        </>
    );
};

export default CommentSection;
