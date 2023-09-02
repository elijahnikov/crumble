import { Container } from "@/components/common/Layout/Layout";
import { RouterOutputs, api } from "@/utils/api";

interface SingleListViewProps {
    list: RouterOutputs["list"]["list"];
}

const SingleListView = ({ list }: SingleListViewProps) => {
    const { list: listData } = list;
    const { user: author } = listData;

    const trpcUtils = api.useContext();

    return (
        <>
            <Container>
                <p>hello</p>
            </Container>
        </>
    );
};

export default SingleListView;
