import Image from "next/image";

export default function CardImage({
    src,
    alt,
}: {
    src?: string;
    alt: string;
}) {
    return src ? (
        <Image src={src} alt={alt} width={300} height={420} className="h-auto rounded" />
    ) : (
        <div className="grid aspect-[300/420] place-items-center rounded w-75 bg-black/5 text-xs">
            Sin imagen
        </div>
    );
}
