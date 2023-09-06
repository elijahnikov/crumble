import clxsm from "@/utils/clsxm";
import Image from "next/image";

interface ListImageProps {
    posters: Array<string | null>;
    size?: number;
}

const ListImage = ({ posters, size = 50 }: ListImageProps) => {
    const generateZIndex = (index: number): string => {
        return `z-${(posters.length - index) * 10}`;
    };
    return (
        <div className={`flex`}>
            {posters.map((poster, index) => (
                <Image
                    key={index}
                    className={clxsm(
                        generateZIndex(index),
                        `rounded-md  object-cover shadow-md [&:not(:first-child)]:-ml-20`
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${poster}`}
                    width={size}
                    height={size}
                />
            ))}
            {/* {posters[0] && (
                <Image
                    className="relative z-50 rounded-md object-cover"
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${posters[0]}`}
                    width={size}
                    height={size}
                />
            )}
            {posters[1] && (
                <Image
                    className="relative z-40 -ml-20 rounded-md object-cover"
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${posters[1]}`}
                    width={size}
                    height={size}
                />
            )}
            {posters[2] && (
                <Image
                    className="relative z-30 -ml-20 rounded-md object-cover"
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${posters[2]}`}
                    width={size}
                    height={size}
                />
            )}
            {posters[3] && (
                <Image
                    className="relative z-20 -ml-20 rounded-md object-cover"
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${posters[3]}`}
                    width={size}
                    height={size}
                />
            )}
            {posters[4] && (
                <Image
                    className="relative z-10 -ml-20 rounded-md object-cover"
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${posters[4]}`}
                    width={size}
                    height={size}
                />
            )} */}
        </div>
    );
};

export default ListImage;
