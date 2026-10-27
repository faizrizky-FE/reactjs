import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom'
import { categories, formatPrice, initialProducts } from './data/products'
import SiteHeader from './components/SiteHeader'
import SiteFooter from './components/SiteFooter'
import MotionEffects from './components/MotionEffects'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import { AdminDashboard, AdminLayout, AdminProductsPage } from './pages/AdminPages'
import './App.css'

const HomePage = lazy(() => import('./pages/HomePage'))
const ProductsPage = lazy(() => import('./pages/ProductsPage'))
const CartPage = lazy(() => import('./pages/CartPage'))

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem('myshop-cart') || '[]')
    return Array.isArray(stored) ? stored.filter((item) =>
      item && typeof item.id === 'string' && typeof item.title === 'string' &&
      Number.isFinite(item.price) && Number.isInteger(item.quantity) && item.quantity > 0,
    ) : []
  } catch {
    return []
  }
}

function readProducts() {
  const stored = localStorage.getItem('myshop-products')
  if (stored === null) {
    localStorage.setItem('myshop-products', JSON.stringify(initialProducts))
    return initialProducts
  }
  const parsed = JSON.parse(stored)
  if (!Array.isArray(parsed)) throw new Error('Data katalog tersimpan tidak valid.')
  return parsed
}

function ProductDetail({ products, favorites, onFavorite, onAdd }) {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)
  if (!product) return <section className="not-found-page"><h1>Produk belum tersedia</h1><p>Coba kembali ke katalog untuk melihat produk lainnya.</p><Link className="button button-primary" to="/produk">Kembali ke katalog</Link></section>
  return <section className="product-detail-page section-pad"><div className="content-width product-detail-layout">
    <img src={product.image} alt={product.title} />
    <div><span className="eyebrow">{product.category}</span><h1>{product.title}</h1><p className="product-detail-rating">★ {Number(product.rating).toFixed(1)} · {Math.floor(product.rating * 21)} ulasan</p><strong className="product-detail-price">{formatPrice(product.price)}</strong><p>{product.description}</p><div className="product-detail-actions"><button className="button button-primary" onClick={() => onAdd(product)} type="button">Tambah ke keranjang</button><button className="button button-secondary" onClick={() => onFavorite(product)} type="button">{favorites.includes(product.id) ? 'Hapus favorit' : 'Simpan favorit'}</button></div><Link to="/produk">← Kembali ke katalog</Link></div>
  </div></section>
}

function NotFound() {
  return <section className="not-found-page"><span className="eyebrow">404</span><h1>Halaman tidak ditemukan</h1><p>Sepertinya halaman yang kamu cari tidak tersedia.</p><Link className="button button-primary" to="/">Kembali ke beranda</Link></section>
}

function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const [products, setProducts] = useState(readProducts)
  const [cart, setCart] = useState(readCart)
  const [favorites, setFavorites] = useState([])
  const [toast, setToast] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('myshop-admin') === 'true')
  const search = new URLSearchParams(location.search).get('q') ?? ''
  const totalProducts = products.length

  useEffect(() => {
    const titles = { '/': 'MyShop — Belanja Lebih Mudah', '/produk': 'Produk — MyShop', '/keranjang': 'Keranjang — MyShop', '/login': 'Masuk Admin — MyShop', '/admin': 'Admin — MyShop' }
    document.title = titles[location.pathname] ?? (location.pathname.startsWith('/produk/') ? 'Detail Produk — MyShop' : 'MyShop')
  }, [location.pathname])

  useEffect(() => {
    localStorage.setItem('myshop-cart', JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2800)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const featuredProducts = useMemo(() => {
    const order = categories.slice(1).map((category) => category.name)
    return [...products].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))
  }, [products])

  function addToCart(product) {
    setCart((items) => {
      const existing = items.find((item) => item.id === product.id)
      return existing
        ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...items, { ...product, quantity: 1 }]
    })
    setToast(`${product.title} ditambahkan ke keranjang`)
  }

  function changeQuantity(productId, amount) {
    setCart((items) => items.map((item) => item.id === productId ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  }

  function removeFromCart(productId) {
    setCart((items) => items.filter((item) => item.id !== productId))
  }

  function toggleFavorite(product) {
    const isFavorite = favorites.includes(product.id)
    setFavorites((items) => isFavorite ? items.filter((id) => id !== product.id) : [...items, product.id])
    setToast(isFavorite ? 'Dihapus dari favorit' : 'Disimpan ke favorit')
  }

  function checkout(customer) {
    const orders = JSON.parse(localStorage.getItem('myshop-orders') || '[]')
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 0 && subtotal < 500000 ? 20000 : 0
    const order = {
      ...customer,
      id: `order-${crypto.randomUUID()}`,
      items: cart,
      subtotal,
      shipping,
      total: subtotal + shipping,
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem('myshop-orders', JSON.stringify([...orders, order]))
    setCart([])
  }

  function saveProducts(nextProducts) {
    localStorage.setItem('myshop-products', JSON.stringify(nextProducts))
    setProducts(nextProducts)
  }

  function createProduct(product) {
    const saved = { ...product, id: `product-${crypto.randomUUID()}`, rating: 4.5 }
    saveProducts([saved, ...products])
  }

  function updateProduct(id, product) {
    if (!products.some((item) => item.id === id)) throw new Error('Produk tidak ditemukan.')
    saveProducts(products.map((item) => item.id === id ? { ...item, ...product } : item))
  }

  function deleteProduct(id) {
    saveProducts(products.filter((item) => item.id !== id))
  }

  function login() {
    localStorage.setItem('myshop-admin', 'true')
    setIsAuthenticated(true)
  }

  function logout() {
    localStorage.removeItem('myshop-admin')
    setIsAuthenticated(false)
    navigate('/')
  }

  return (
    <div className="site-shell">
      <MotionEffects />
      <SiteHeader cartCount={cart.reduce((total, item) => total + item.quantity, 0)} />
      <main className="route-content" key={location.pathname}>
        <Suspense fallback={<div className="route-loading" role="status"><span className="spinner" />Menyiapkan halaman...</div>}>
          <Routes>
            <Route path="/" element={<HomePage products={featuredProducts} loadState="ready" favorites={favorites} onFavorite={toggleFavorite} onAdd={addToCart} />} />
            <Route path="/produk" element={<ProductsPage key={location.search} products={products} totalProducts={totalProducts} search={search} favorites={favorites} onFavorite={toggleFavorite} onAdd={addToCart} onResetSearch={() => navigate('/produk')} />} />
            <Route path="/produk/:productId" element={<ProductDetail products={products} favorites={favorites} onFavorite={toggleFavorite} onAdd={addToCart} />} />
            <Route path="/keranjang" element={<CartPage cart={cart} onQuantity={changeQuantity} onRemove={removeFromCart} onCheckout={checkout} />} />
            <Route path="/login" element={<LoginPage onLogin={login} />} />
            <Route path="/admin" element={<ProtectedRoute isAuthenticated={isAuthenticated}><AdminLayout onLogout={logout} /></ProtectedRoute>}>
              <Route index element={<AdminDashboard products={products} />} />
              <Route path="products" element={<AdminProductsPage products={products} onCreate={createProduct} onUpdate={updateProduct} onDelete={deleteProduct} />} />
              <Route path="products/new" element={<AdminProductsPage products={products} onCreate={createProduct} onUpdate={updateProduct} onDelete={deleteProduct} />} />
              <Route path="products/:productId/edit" element={<AdminProductsPage products={products} onCreate={createProduct} onUpdate={updateProduct} onDelete={deleteProduct} />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <SiteFooter onNotify={setToast} />
      {toast && <div className="toast" role="status"><span>✓</span>{toast}</div>}
    </div>
  )
}

export default App
