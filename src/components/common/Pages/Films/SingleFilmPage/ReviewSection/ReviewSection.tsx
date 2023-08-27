import { Container } from "@/components/common/Layout/Layout";
import { api } from "@/utils/api";
import React from "react";

interface ReviewSectionProps {
    movieId: number;
}

const ReviewSection = ({ movieId }: ReviewSectionProps) => {
    const { data, isLoading } = api.review.reviews.useQuery({
        limit: 3,
        movieId,
    });

    if (data) {
        return (
            <Container>
                <h1>No reviews yet</h1>
            </Container>
        );
    }
    return <></>;
};

export default ReviewSection;
