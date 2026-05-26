import { defineConfig } from 'vite'
// Avoid importing Node 'path' to keep this config free of Node-only typings in editors
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function assetResolver() {
  return {
    name: 'asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('asset/')) {
        const filename = id.replace('asset/', '')
        // Use import.meta.url to form a file URL pointing at the assets directory
        return new URL(`./src/assets/${filename}`, import.meta.url).pathname
      }
    },
  }
}

export default defineConfig({
  plugins: [
    assetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      // Resolve @ to the src directory using import.meta.url so we avoid Node globals
      '@': new URL('./src/', import.meta.url).pathname,
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
