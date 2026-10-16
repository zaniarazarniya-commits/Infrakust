import fs from "fs"
import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// Vercel kör cleanUrls: /case/formad serves från dist/case/formad/index.html.
// `vite preview` gör inte det utan faller tillbaka på startsidans HTML, vilket
// ger en hydreringsavvikelse (React #418) som inte finns i produktion.
const previewCleanUrls = (): Plugin => ({
  name: 'preview-clean-urls',
  configurePreviewServer(server) {
    const outDir = path.resolve(server.config.root, server.config.build.outDir)
    server.middlewares.use((req, _res, next) => {
      const pathname = (req.url ?? '').split('?')[0]
      if (pathname !== '/' && !path.extname(pathname)) {
        const page = path.posix.join(pathname, 'index.html')
        if (fs.existsSync(path.join(outDir, page))) {
          req.url = page + (req.url ?? '').slice(pathname.length)
        }
      }
      next()
    })
  },
})

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Inspektions-pluginet (lägger till code-path-attribut) ska bara köras i
  // dev-servern — aldrig i produktionsbygget eller vid prerendering, annars
  // läcker källsökvägar ut i den statiska HTML:en.
  const enableInspect = command === 'serve' && !process.env.PRERENDER

  return {
    // Absolute base so hashed assets resolve from the domain root on every
    // route depth. Relative ('./') breaks nested routes like /case/grand-hotel.
    base: '/',
    plugins: [...(enableInspect ? [inspectAttr()] : []), react(), previewCleanUrls()],
    server: {
      port: 3000,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
});
