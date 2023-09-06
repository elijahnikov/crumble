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
                        `max-w-[50%] rounded-md object-cover shadow-md [&:not(:first-child)]:-ml-20`
                    )}
                    alt="listposters"
                    src={`https://image.tmdb.org/t/p/original${poster}`}
                    width={size}
                    height={size}
                    sizes="10vw"
                />
            ))}
        </div>
    );
};

export default ListImage;
