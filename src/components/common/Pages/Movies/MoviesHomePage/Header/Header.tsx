import clxsm from "@/utils/clsxm";
import Link from "next/link";

import MovieSearch from "../MovieSearch/MovieSearch";
import Button from "@/components/ui/Button/Button";
import useIsMobile from "@/utils/hooks/useIsMobile";

const Header = () => {
    const isMobile = useIsMobile();
    return (
        <div className="flex">
            <div className="flex w-[100%]">
                <h2>Movies</h2>
                <Link href={"/movies/all/"}>
                    <Button
                        size="sm"
                        className={clxsm("ml-2 sm:mt-1")}
                        intent={"primary"}
                    >
                        Browse
                    </Button>
                </Link>
            </div>
            <MovieSearch />
        </div>
    );
};

export default Header;
