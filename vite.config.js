import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Agar aapka project sub-folder mein nahi hai, toh 'base' ki zarurat nahi hai
})
