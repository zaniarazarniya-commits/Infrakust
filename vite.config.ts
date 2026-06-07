import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // Inspektions-pluginet (lägger till code-path-attribut) ska bara köras i
  // dev-servern — aldrig i produktionsbygget eller vid prerendering, annars
  // läcker källsökvägar ut i den statiska HTML:en.
  const enableInspect = command === 'serve' && !process.env.PRERENDER

  return {
    base: '/',
    plugins: [...(enableInspect ? [inspectAttr()] : []), react()],
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
