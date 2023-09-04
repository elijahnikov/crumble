import clxsm from "@/utils/clsxm";
import Image from "next/image";

interface ListImageProps {
    posters: Array<string | null>;
    size?: number;
}

const ListImage = ({ posters, size = 50 }: ListImageProps) => {
    return (
        <div className="flex bg-red-400">
            {posters.map((poster, index) => (
                <>
                    {index}
                    <Image
                        className={clxsm(`relative right-${index * 10}`)}
                        key={index}
                        alt="listposters"
                        src={`https://image.tmdb.org/t/p/original${poster}`}
                        width={size}
                        height={size}
                    />
                </>
            ))}
        </div>
    );
};

export default ListImage;
