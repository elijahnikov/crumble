const FavouriteMovieActivity = ({
    small,
    movieTitle,
    createdAt,
}: {
    small: boolean;
    movieTitle: string;
    createdAt: Date;
}) => {
    return <>Added {movieTitle} to their favourites</>;
};

export default FavouriteMovieActivity;
