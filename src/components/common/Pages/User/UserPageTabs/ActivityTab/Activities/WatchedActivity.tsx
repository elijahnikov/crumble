const WatchedActivity = ({
    small,
    movieTitle,
}: {
    small: boolean;
    movieTitle: string;
    createdAt: Date;
}) => {
    return <>Watched {movieTitle}</>;
};

export default WatchedActivity;
