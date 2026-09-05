import { defineConfig } from "steiger"
import fsd from "@feature-sliced/steiger-plugin"

export default defineConfig([
    ...fsd.configs.recommended,
    {
        rules: {
            "fsd/typo-in-layer-name": "off",
            "fsd/segments-by-purpose": "off",
            "fsd/insignificant-slice": "off",
            "fsd/ambiguous-slice-names": "off",
        },
    },
    {
        ignores: ["**/generated/**", "**/node_modules/**"],
    },
])
