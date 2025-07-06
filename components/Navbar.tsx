'use client'

export default function Navbar() {
  return (
    <nav className="w-full p-4 shadow bg-white fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600 tracking-tight">
          <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">Start</span>MB
        </div>
        <a
          href="/auth"
          className="text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          Get Started
        </a>
      </div>
    </nav>
  )
}
