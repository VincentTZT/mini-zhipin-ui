/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Auto generate by env-parse
  readonly VITE_MINI_ZHIPIN_TITLE: string
  readonly VITE_MINI_ZHIPIN_API_URL: string
  readonly VITE_MINI_ZHIPIN_API_PREFIX: string
  readonly VITE_MINI_ZHIPIN_UI_PREFIX: string
  readonly VITE_USER_NODE_ENV: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}