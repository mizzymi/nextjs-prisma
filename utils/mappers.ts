import type { Carta, Type, Rarity } from '@/types/pokedeck'

export function mapType(tcgType?: string): Type | undefined {
    if (!tcgType) return undefined

    const t = tcgType.toLowerCase()

    switch (t) {
        case 'colorless': return 'Normal'
        case 'lightning': return 'Electric'
        case 'darkness': return 'Dark'
        case 'metal': return 'Steel'
        case 'psychic': return 'Psychid'
        case 'fairy': return 'Fairy'
        case 'dragon': return 'Dragon'
        case 'fighting': return 'Fighting'
        case 'grass': return 'Grass'
        case 'water': return 'Water'
        case 'fire': return 'Fire'

        default: return undefined
    }
}


export function mapRarity(r?: string): Rarity | undefined {
    if (!r) return undefined

    const x = r.toLowerCase()

    if (x.includes('special illustration')) return 'Special Illustration Rare'
    if (x.includes('illustration')) return 'Illustration Rare'
    if (x.includes('double')) return 'Double Rare'
    if (x.includes('ultra')) return 'Ultra Rare'
    if (x.includes('hyper')) return 'Hyper Rare'
    if (x === 'rare') return 'Rare'
    if (x === 'uncommon') return 'Uncommon'
    if (x === 'common') return 'Common'

    return undefined
}


export function toCarta(card: any): Carta {
    return {
        tcgdexId: card.id,
        name: card.name,
        life: typeof card.hp === 'number' ? card.hp : undefined,
        ability: Array.isArray(card.abilities) ? card.abilities.map((a: any) => a.name) : [],
        serie: card.set?.id ? card.set.id : undefined,
        image: typeof card.getImageURL === 'function' ? card.getImageURL('high', 'png') : card.image,
        type: Array.isArray(card.types) ? mapType(card.types[0]) : undefined,
        rarity: mapRarity(card.rarity)
    }
}