"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search } from "lucide-react"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void
  debounceTime?: number
}

export function SearchInput({ onSearch, debounceTime = 300, className = "", ...props }: SearchInputProps) {
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(searchTerm)
    }, debounceTime)

    return () => {
      clearTimeout(handler)
    }
  }, [searchTerm, onSearch, debounceTime])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        className="w-full rounded-md border border-gray-300 pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        {...props}
      />
      {searchTerm && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={() => {
            setSearchTerm("")
            onSearch("")
          }}
        >
          ×
        </button>
      )}
    </div>
  )
}
