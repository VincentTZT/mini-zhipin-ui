/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Auto generate by env-parse
  readonly VITE_VX_BOSS_TITLE: string
  readonly VITE_VX_BOSS_API_URL: string
  readonly VITE_VX_BOSS_API_PREFIX: string
  readonly VITE_USER_NODE_ENV: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}