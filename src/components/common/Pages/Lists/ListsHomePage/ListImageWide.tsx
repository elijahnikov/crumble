import clxsm from "@/utils/clsxm";
import Image from "next/image";
import Link from "next/link";

interface ListImageProps {
    posters: Array<string | null>;
    size?: number;
    listId: string;
}

const ListImageWide = ({ posters, listId, size = 50 }: ListImageProps) => {
    return (
        <Link
            href={{
                pathname: "/list/[id]",
                query: {
                    id: listId,
                },
            }}
            className={`flex w-full cursor-pointer rounded-md border-crumble bg-none hover:border-[2px]`}
        >
            {posters[0] && (
                <Image
                    className={clxsm(
                        `relative z-50 min-w-[40%] max-w-[50%] rounded-md object-cover shadow-md lg:w-[43%]`
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/w500${posters[0]}`}
                    width={size}
                    height={size}
                    sizes="10vw"
                />
            )}
            {posters[1] && (
                <Image
                    className={clxsm(
                        `relative right-[25%] z-40 min-w-[40%] max-w-[50%] rounded-md object-cover shadow-md `
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/w500${posters[1]}`}
                    width={size}
                    height={size}
                    sizes="100vw"
                />
            )}
            {posters[2] && (
                <Image
                    className={clxsm(
                        `relative right-[50%] z-30 min-w-[40%]  max-w-[50%] rounded-md object-cover shadow-md `
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/w500${posters[2]}`}
                    width={size}
                    height={size}
                    sizes="100vw"
                />
            )}
            {posters[3] && (
                <Image
                    className={clxsm(
                        `relative right-[75%] z-20 min-w-[40%] max-w-[50%] rounded-md object-cover shadow-md `
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/w500${posters[3]}`}
                    width={size}
                    height={size}
                    sizes="100vw"
                />
            )}
            {posters[4] && (
                <Image
                    className={clxsm(
                        `relative right-[100%] z-10 min-w-[40%] max-w-[50%] rounded-md object-cover shadow-md `
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/w500${posters[4]}`}
                    width={size}
                    height={size}
                    sizes="100vw"
                />
            )}
        </Link>
    );
};

export default ListImageWide;
