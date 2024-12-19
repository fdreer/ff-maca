/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
    readonly GOOGLE_AUTH_EMAIL: string
    readonly GOOGLE_AUTH_KEY: string
    readonly SHEET_ID: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
