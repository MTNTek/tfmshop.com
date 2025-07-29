'use client'

import { useEffect, useState } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  description: string
  is_active: number
}

interface Product {
  id: string
  name: string
  price: number
  stock: number
  category?: string
}

interface ProductsResponse {
  products: Product[]
  pagination: {
    total: number
  }
}

export default function TestDataPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Load categories
        const categoriesRes = await fetch('/api/categories')
        if (!categoriesRes.ok) throw new Error('Failed to load categories')
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)

        // Load products
        const productsRes = await fetch('/api/products')
        if (!productsRes.ok) throw new Error('Failed to load products')
        const productsData: ProductsResponse = await productsRes.json()
        setProducts(productsData.products)

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Loading API Test...</h1>
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-red-600">API Test - Error</h1>
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {error}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test - Success! 🎉</h1>
        
        {/* Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid gap-3">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                    <span className="text-xs text-gray-500">Slug: {category.slug}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs ${
                      category.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid gap-3">
              {products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded">
                  <div>
                    <h3 className="font-medium">{product.name}</h3>
                    {product.category && (
                      <span className="text-sm text-blue-600">Category: {product.category}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-green-600">${product.price}</div>
                    <div className="text-sm text-gray-600">Stock: {product.stock}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">API Status Summary</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Categories API:</span>
              <span className="ml-2 text-green-600">✅ Working ({categories.length} categories)</span>
            </div>
            <div>
              <span className="font-medium">Products API:</span>
              <span className="ml-2 text-green-600">✅ Working ({products.length} products)</span>
            </div>
            <div>
              <span className="font-medium">Database:</span>
              <span className="ml-2 text-green-600">✅ SQLite Connected</span>
            </div>
            <div>
              <span className="font-medium">Frontend:</span>
              <span className="ml-2 text-green-600">✅ Successfully Loading Data</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
