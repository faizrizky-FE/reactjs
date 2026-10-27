import { useMemo, useState } from 'react'
import { useRouter } from '../useRouter'
import { categories } from '../data/products'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import useScrollReveal from '../hooks/useScrollReveal'
import '../styles/products-page.css'

export default function ProductsPage({ products, totalProducts, search, favorites, onFavorite, onAdd, onResetSearch }) {
  const { location } = useRouter()
  const params = new URLSearchParams(location.split('?')[1] ?? '')
  const routeCategory = params.get('category')
  const [selectedCategory, setSelectedCategory] = useState(categories.some((category) => category.name === routeCategory) ? routeCategory : 'Semua')
  const [sortBy, setSortBy] = useState('featured')
  const [page, setPage] = useState(1)
  const pageSize = 8
  useScrollReveal(`products-${products.length}-${selectedCategory}-${search}-${page}`)
  const canUseCatalogTotal = selectedCategory === 'Semua' && !search

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    const filtered = products.filter((product) => {
      const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory
      const matchesSearch = !query || `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
    if (sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price)
    if (sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price)
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating)
    if (sortBy === 'featured') {
      const order = ['Laptop', 'Smartphone', 'Audio', 'Wearable', 'Aksesori', 'Lainnya']
      filtered.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))
    }
    return filtered
  }, [products, search, selectedCategory, sortBy])

  function changeCategory(category) {
    setSelectedCategory(category)
    setPage(1)
  }

  function resetFilters() {
    changeCategory('Semua')
    setSortBy('featured')
    onResetSearch()
  }

  const productCount = canUseCatalogTotal ? totalProducts : filteredProducts.length
  const pageCount = Math.max(1, Math.ceil(productCount / pageSize))
  const currentPage = Math.min(page, pageCount)
  const currentProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const hasNextLocalPage = currentPage < pageCount

  return (
    <section className="products-page section-pad">
      <div className="content-width">
        <div className="products-page-heading" data-reveal><span className="eyebrow">Koleksi MyShop</span><h1>Temukan yang kamu cari<span>.</span></h1><p>Produk pilihan, harga bersahabat, dan pengalaman belanja yang praktis.</p></div>
        <div className="catalog-toolbar" data-reveal>
          <div className="catalog-filters" aria-label="Filter kategori">
            {categories.map((category) => <button key={category.name} type="button" className={`filter-chip ${selectedCategory === category.name ? 'active' : ''}`} aria-pressed={selectedCategory === category.name} onClick={() => changeCategory(category.name)}>{category.name}</button>)}
          </div>
          <label className="sort-label">Urutkan
            <select value={sortBy} onChange={(event) => { setSortBy(event.target.value); setPage(1) }} aria-label="Urutkan produk">
              <option value="featured">Unggulan</option><option value="rating">Rating tertinggi</option><option value="price-low">Harga terendah</option><option value="price-high">Harga tertinggi</option>
            </select>
          </label>
          {(search || selectedCategory !== 'Semua' || sortBy !== 'featured') && <button className="reset-filters" type="button" onClick={resetFilters}>Reset filter</button>}
        </div>
        {filteredProducts.length > 0
          ? <>
            <div className="product-grid">{currentProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onAdd={onAdd} />)}</div>
            <div className="catalog-footer">
              <span>Menampilkan {Math.min((currentPage - 1) * pageSize + 1, productCount)}–{Math.min(currentPage * pageSize, productCount)} dari {productCount} produk</span>
              <div className="pagination-controls">
                <button type="button" className="button button-secondary" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Sebelumnya</button>
                <span>Halaman {currentPage} / {pageCount}</span>
                {hasNextLocalPage
                  ? <button type="button" className="button button-secondary" onClick={() => setPage(currentPage + 1)}>Berikutnya <Icon name="arrow" size={16} /></button>
                  : null}
              </div>
            </div>
          </>
          : <div className="empty-products" data-reveal><span>⌕</span><h2>Produk belum ditemukan</h2><p>Coba kata kunci atau kategori lainnya, ya.</p><button className="button button-secondary" type="button" onClick={resetFilters}>Reset pencarian dan filter</button></div>}
      </div>
    </section>
  )
}
