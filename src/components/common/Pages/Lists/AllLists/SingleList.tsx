import { type List } from "./InfiniteListSection";

interface SingleListProps {
    list: List;
    toggleLike: (variables: { id: string }) => void;
}

const SingleList = ({ list, toggleLike }: SingleListProps) => {
    return <></>;
};

export default SingleList;
