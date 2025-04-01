// src/components/Layout.jsx
import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-white">
      <Navbar />
      <main className="p-4">{children}</main>
    </div>
  )
}
