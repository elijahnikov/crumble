import clxsm from "@/utils/clsxm";
import Image from "next/image";

interface ListImageProps {
    posters: Array<string | null>;
    size?: number;
}

const generateZIndex = (index: number, postersLen: number): string => {
    return `z-${(postersLen - index) * 10}`;
};

const ListImageWide = ({ posters, size = 50 }: ListImageProps) => {
    return (
        // <div className={`flex`}>
        <div className="flex">
            {posters.map((poster, index) => (
                <Image
                    key={index}
                    className={clxsm(
                        generateZIndex(index, posters.length),
                        `relative min-w-[30%]  rounded-md object-cover shadow-md [&:not(:first-child)]:-ml-[12.5%]`
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

export default ListImageWide;
