import clxsm from "@/utils/clsxm";
import Image from "next/image";

interface ListImageProps {
    posters: Array<string | null>;
    size?: number;
}

const generateZIndex = (index: number, postersLen: number): string => {
    return `z-${(postersLen - index) * 10}`;
};

const ListImage = ({ posters, size = 50 }: ListImageProps) => {
    return (
        <div className={`flex`}>
            {posters.map((poster, index) => (
                <Image
                    key={index}
                    className={clxsm(
                        generateZIndex(index, posters.length),
                        `min-w-[25%] max-w-[41%] rounded-md object-cover shadow-md lg:w-[43%] [&:not(:first-child)]:-ml-[5.7vw] lg:[&:not(:first-child)]:-ml-[5vw]`
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
