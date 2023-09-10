const LoadingSpinner = (props: { size?: number }) => {
    return (
        <div role="status">
            <svg
                className="animate-spin"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                width={props.size ?? 16}
                height={props.size ?? 16}
            >
                <path
                    className="fill-current"
                    d="M7.229 1.173a9.25 9.25 0 1011.655 11.412 1.25 1.25 0 10-2.4-.698 6.75 6.75 0 11-8.506-8.329 1.25 1.25 0 10-.75-2.385z"
                ></path>
            </svg>
            <span className="sr-only">Loading</span>
        </div>
    );
};

export default LoadingSpinner;

export const LoadingPage = () => {
    return (
        <div className="flex items-center justify-center align-middle">
            <LoadingSpinner size={40} />
        </div>
    );
};
