import { parseUberEatsUrl, slugToDisplayName, normalizeUberEatsUrl } from "@/shared/lib/uber-eats-links"

export type MenuPreviewItem = {
    name: string
    price?: string
    description?: string
}

export type MenuPreview = {
    storeName: string
    uberEatsUrl: string
    fetchedAt: string
    items: MenuPreviewItem[]
    unavailable?: boolean
}

const DEMO_MENU_TEMPLATES: MenuPreviewItem[][] = [
    [
        { name: "Lunch combo", price: "$14.99", description: "Entree + side + drink" },
        { name: "Chef's bowl", price: "$13.50", description: "Rice, protein, veggies" },
        { name: "Soup & salad", price: "$11.25" },
        { name: "Signature sandwich", price: "$12.75" },
        { name: "Side fries", price: "$4.50" },
    ],
    [
        { name: "Poke bowl (regular)", price: "$15.99", description: "2 proteins" },
        { name: "Bento box", price: "$16.50" },
        { name: "Miso soup", price: "$3.99" },
        { name: "Chicken katsu", price: "$14.25" },
        { name: "Veggie roll (4 pc)", price: "$6.50" },
    ],
    [
        { name: "Burrito bowl", price: "$13.95" },
        { name: "Tacos (3)", price: "$12.50" },
        { name: "Quesadilla", price: "$11.99" },
        { name: "Chips & guac", price: "$5.25" },
        { name: "Agua fresca", price: "$3.75" },
    ],
]

function hashString(value: string) {
    let hash = 0
    for (let i = 0; i < value.length; i += 1) {
        hash = (hash << 5) - hash + value.charCodeAt(i)
        hash |= 0
    }
    return Math.abs(hash)
}

function buildDemoMenu(storeName: string, url: string): MenuPreviewItem[] {
    const template = DEMO_MENU_TEMPLATES[hashString(url) % DEMO_MENU_TEMPLATES.length]
    const prefix = storeName.split(" ")[0]

    return template.map((item, index) => ({
        ...item,
        name: index === 0 ? `${prefix} ${item.name}` : item.name,
    }))
}

export function extractUberEatsMenuDemo(url: string): MenuPreview {
    const normalized = normalizeUberEatsUrl(url)
    const { slug } = parseUberEatsUrl(normalized)
    const storeName = slugToDisplayName(slug)

    return {
        storeName,
        uberEatsUrl: normalized,
        fetchedAt: new Date().toISOString(),
        items: buildDemoMenu(storeName, normalized),
    }
}

export function extractUberEatsMenuFromUrlOnly(url: string): MenuPreview {
    const normalized = normalizeUberEatsUrl(url)
    const { slug } = parseUberEatsUrl(normalized)
    const storeName = slugToDisplayName(slug)

    return {
        storeName,
        uberEatsUrl: normalized,
        fetchedAt: new Date().toISOString(),
        items: [],
        unavailable: true,
    }
}
