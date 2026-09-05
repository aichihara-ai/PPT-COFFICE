import { createWriteStream } from "node:fs"
import { mkdir } from "node:fs/promises"
import { pipeline } from "node:stream/promises"
import { Readable } from "node:stream"

/** Known Uber Eats CDN hero images (used when store pages block scrapers). */
const KNOWN_IMAGES = {
    japadog:
        "https://tb-static.uber.com/prod/image-proc/processed_images/03c3e8b604bdcda81a2720a52d3497c7/fb86662148be855d931b37d6c1e5fcbe.jpeg",
    earls:
        "https://tb-static.uber.com/prod/image-proc/processed_images/bbd769bdfd768e993e6c22bbf15fbd86/08829600257ed8168dd856cafb7446c8.jpeg",
    "cactus-club":
        "https://tb-static.uber.com/prod/image-proc/processed_images/fca078d218582f37ee9625a05bf4669a/4f3f62f3f5b6932263e7f27923f93b2d.jpeg",
    peaceful:
        "https://tb-static.uber.com/prod/image-proc/processed_images/0174b11b0519a1a158cf45da2a15b2ac/ec1689ae3a25695f1b8e25c59bec5034.webp",
    jamjar:
        "https://tb-static.uber.com/prod/image-proc/processed_images/262ed353f85a2842cd025883fb58cf64/f6deb0afc24fee6f4bd31a35e6bcbd47.jpeg",
    nandos:
        "https://tb-static.uber.com/prod/image-proc/processed_images/5947f5ad63e7ccf3610142ec5b168998/fa23f51b9c499b035a68831c96e1821e.jpeg",
    "burgers-fries":
        "https://tb-static.uber.com/prod/image-proc/processed_images/49a2cb5e4d34a8468a3a0efedd3bd73e/dfe73df3a8123af1971eabf3eeff9ac1.jpeg",
}

const stores = [
    ["japadog", "https://www.ubereats.com/ca/store/japadog-robson-st/yfgO-fkkQl20VBJgclbA9A"],
    ["mezze", "https://www.ubereats.com/ca/store/mazahr-lebanese-kitchen/lfLZKb6zSWaRiIsrfQlgcA"],
    ["nuba", "https://www.ubereats.com/ca/store/nuba-in-yaletown/Le9NW_t2SM2UH1Uvz0gzbQ"],
    ["earls", "https://www.ubereats.com/ca/store/earls-kitchen-+-bar-yaletown/DIRMCZsvX9eCE1BslH_Kbw"],
    ["cactus-club", "https://www.ubereats.com/ca/store/cactus-club-cafe-west-broadway/ExRp_ZRBVsagkpJTO4GP-w"],
    ["honest-greens", "https://www.ubereats.com/ca/store/tractor-foods-marine-building/JEBPOWN4Rz-SFkkn-Jj4tg"],
    ["tractor-foods", "https://www.ubereats.com/ca/store/tractor-foods-marine-building/JEBPOWN4Rz-SFkkn-Jj4tg"],
    ["chipotle", "https://www.ubereats.com/ca/store/chipotle-mexican-grill-818-howe-st/hB07Xm23Ryi4n7PX_aowqg"],
    ["poke-man", "https://www.ubereats.com/ca/store/the-poke-guy/bEESrxaVRweGVfoBBgpAqA"],
    ["banana-leaf", "https://www.ubereats.com/ca/store/lost-banana-leaf-robson/5KE5OtmzREyTv77pJA-yKg"],
    ["peaceful", "https://www.ubereats.com/ca/store/peaceful-restaurant-kitsilano/3VW7HEUwU3mR_GJylx5npg"],
    ["jamjar", "https://www.ubereats.com/ca/store/jamjar-canteen/qsmBQsOOT7KcOtQWSWZGMA"],
    ["nandos", "https://www.ubereats.com/ca/store/nandos-davie-%26-howe/6nPYvQjbRsmFCgq5ODZboQ"],
    ["freshii", "https://www.ubereats.com/ca/store/freshii-1291-howe-st/-_YvgBeYTreBRPmBBSQcIg"],
    ["burgers-fries", "https://www.ubereats.com/ca/store/five-guys-635-robson-st-ca/VWwKWYQQXIyn8vAfFj7zfg"],
]

const headers = {
    "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Accept-Language": "en-CA,en;q=0.9",
    Accept: "text/html,application/xhtml+xml",
}

function pickImage(html) {
    const hero =
        html.match(/heroImageURL\\":\\"(https:[^\\"]+)\\"/)?.[1] ||
        html.match(/"heroImageURL":"(https:[^"]+)"/)?.[1]
    if (hero) return hero

    const imgs = [
        ...html.matchAll(
            /https:\/\/tb-static\.uber\.com\/prod\/image-proc\/processed_images\/[^"\\]+?\.(?:jpg|jpeg|webp)/g
        ),
    ].map((match) => match[0])

    return imgs.sort((a, b) => b.length - a.length)[0] ?? null
}

async function download(url, dest) {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`download failed (${response.status})`)
    await pipeline(Readable.fromWeb(response.body), createWriteStream(dest))
}

await mkdir("public/lunch", { recursive: true })

for (const [file, storeUrl] of stores) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const response = await fetch(storeUrl, { headers, redirect: "follow" })
    const html = await response.text()
    const imageUrl = pickImage(html) ?? KNOWN_IMAGES[file] ?? null

    if (!imageUrl) {
        console.warn(`skip ${file}: no image URL available`)
        continue
    }

    const ext = imageUrl.includes(".webp") ? "webp" : "jpg"
    const dest = `public/lunch/${file}.${ext}`
    await download(imageUrl, dest)
    console.log(`saved ${dest}`)
}
