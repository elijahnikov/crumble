import { api } from "@/utils/api";
import { getDatesToSortBy } from "@/utils/date/getDatesToSortBy";

const PopularReviews = () => {
    const { data, isLoading } = api.review.reviews.useQuery({
        limit: 3,
        orderBy: "reviewLikes",
        dateSortBy: getDatesToSortBy("1 week"),
    });

    return <></>;
};

export default PopularReviews;
