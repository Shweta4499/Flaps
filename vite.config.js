import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: ".", 
  publicDir: "public",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "public/index.html"),
        flap2: resolve(__dirname, "public/flap2.html"),
        flap3: resolve(__dirname, "public/flap3.html"),
        flap4: resolve(__dirname, "public/flap4.html"),
        flap5: resolve(__dirname, "public/flap5.html"),
        flap6: resolve(__dirname, "public/flap6.html")
      }
    }
  },
  server: {
    port: 5173,
    open: "/index.html" 
  }
});
