import { useEffect, useState } from 'react'
import { Link } from '../router'
import { useRouter } from '../useRouter'
import Icon from './Icon'

function SearchForm({ location, navigate, onSubmitSearch }) {
  const query = new URLSearchParams(location.split('?')[1] ?? '').get('q') ?? ''
  const [search, setSearch] = useState(query)

  useEffect(() => {
    const value = search.trim()
    if (value === query.trim()) return undefined
    const timeout = window.setTimeout(() => {
      navigate(`/produk${value ? `?q=${encodeURIComponent(value)}` : ''}`)
      onSubmitSearch()
    }, 350)
    return () => window.clearTimeout(timeout)
  }, [navigate, onSubmitSearch, query, search])

  function clearSearch() {
    setSearch('')
  }

  return (
    <form className="search-box" onSubmit={(event) => event.preventDefault()}>
      <Icon name="search" size={17} />
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari produk..." aria-label="Cari produk" />
      {search && <button type="button" className="clear-search" onClick={clearSearch} aria-label="Hapus pencarian"><Icon name="close" size={15} /></button>}
    </form>
  )
}

export default function SiteHeader({ cartCount }) {
  const { location, navigate } = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const path = location.split('?')[0]
  function animateNavPointer(event) {
    if (event.pointerType !== 'mouse') return
    const target = event.target.closest('.nav-link, .nav-action, .brand')
    if (!target || !event.currentTarget.contains(target)) return
    const bounds = target.getBoundingClientRect()
    target.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`)
    target.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`)
  }

  return (
    <header className="site-header">
      <div className="nav-wrap" onPointerMove={animateNavPointer}>
        <Link className="brand" to="/" aria-label="MyShop, beranda" onClick={() => setMenuOpen(false)}>
          <span className="brand-mark"><Icon name="cart" size={19} /></span>
          <span>My<span>Shop</span></span>
        </Link>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navigasi utama">
          <Link className={`nav-link ${path === '/' ? 'active' : ''}`} to="/" onClick={() => setMenuOpen(false)}><span>Beranda</span></Link>
          <Link className={`nav-link ${path === '/produk' ? 'active' : ''}`} to="/produk" onClick={() => setMenuOpen(false)}><span>Produk</span></Link>
          <Link className={`nav-link ${path.startsWith('/admin') ? 'active' : ''}`} to="/admin" onClick={() => setMenuOpen(false)}><span>Admin</span></Link>
        </nav>
        <SearchForm key={location} location={location} navigate={navigate} onSubmitSearch={() => setMenuOpen(false)} />
        <div className="nav-actions">
          <span className="catalog-status ready" role="status"><i />Katalog tersimpan</span>
          <Link className={`nav-action cart-trigger ${path === '/keranjang' ? 'active' : ''}`} to="/keranjang" aria-label={`Buka keranjang, ${cartCount} barang`} onClick={() => setMenuOpen(false)}>
            <Icon name="cart" size={21} />
            <span className="cart-count">{cartCount}</span>
          </Link>
          <button type="button" className="nav-action menu-trigger" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'} aria-expanded={menuOpen}>
            <Icon name={menuOpen ? 'close' : 'menu'} size={21} />
          </button>
        </div>
      </div>
    </header>
  )
}
