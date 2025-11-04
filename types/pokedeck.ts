export type Type =
| 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice'
| 'Fighting' | 'Posion' | 'Ground' | 'Flying' | 'Psychid'
| 'Bug' | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy'


export type Rarity =
| 'Common' | 'Uncommon' | 'Rare' | 'Double Rare' | 'Ultra Rare'
| 'Illustration Rare' | 'Special Illustration Rare' | 'Hyper Rare'


export type Carta = {
tcgdexId: string
name: string
life?: number
ability: string[]
serie?: string
image?: string
type?: Type
rarity?: Rarity
}