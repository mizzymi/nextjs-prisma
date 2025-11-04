export default function CardMetaList(props: {
    category?: string;
    setName?: string;
    rarity?: string;
    illustrator?: string;
    hp?: number | string;
    types?: string[];
    stage?: string;
    retreat?: number;
    regulationMark?: string;
}) {
    const {
        category, setName, rarity, illustrator, hp, types, stage, retreat, regulationMark,
    } = props;

    return (
        <dl className="mt-4 grid gap-2 text-sm">
            {category && <div><strong>Categoría:</strong> {category}</div>}
            {setName && <div><strong>Colección:</strong> {setName}</div>}
            {rarity && <div><strong>Rareza:</strong> {rarity}</div>}
            {illustrator && <div><strong>Ilustrador/a:</strong> {illustrator}</div>}
            {typeof hp !== "undefined" && <div><strong>PS:</strong> {hp}</div>}
            {types?.length ? <div><strong>Tipos:</strong> {types.join(", ")}</div> : null}
            {stage && <div><strong>Etapa:</strong> {stage}</div>}
            {typeof retreat === "number" && <div><strong>Retirada:</strong> {retreat}</div>}
            {regulationMark && <div><strong>Regulación:</strong> {regulationMark}</div>}
        </dl>
    );
}
