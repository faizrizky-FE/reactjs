import Icon from './Icon'
import { formatPrice } from '../data/products'
import { Link } from 'react-router-dom'
import '../styles/product-card.css'

export default function ProductCard({ product, index, favorite, onFavorite, onAdd }) {
  return (
    <article className="product-card" data-reveal style={{ '--reveal-order': index % 4 }}>
      <div className="product-image-wrap">
        {index === 0 && <span className="product-badge">Pilihan</span>}
        <button type="button" className={`favorite-button ${favorite ? 'is-favorite' : ''}`} onClick={() => onFavorite(product)} aria-label={favorite ? `Hapus ${product.title} dari favorit` : `Simpan ${product.title} ke favorit`}><Icon name="heart" size={18} /></button>
        <img src={product.image} alt={product.title} loading="lazy" decoding="async" fetchPriority="low" />
        <button type="button" className="quick-add" onClick={() => onAdd(product)}><Icon name="plus" size={16} /> Tambah</button>
      </div>
      <div className="product-info">
        <span className={`product-category category-${product.category.toLowerCase()}`}>{product.category}</span>
        <h3 title={product.title}><Link className="product-detail-link" to={`/produk/${product.id}`}>{product.title}</Link></h3>
        <p className="product-price">{formatPrice(product.price)}</p>
        <div className="product-bottom"><span className="rating"><Icon name="star" size={15} /> {Number(product.rating).toFixed(1)} <span className="review-count">({Math.floor(product.rating * 21)} ulasan)</span></span><button type="button" className="add-cart-button" onClick={() => onAdd(product)} aria-label={`Tambah ${product.title} ke keranjang`}><Icon name="cart" size={17} /></button></div>
      </div>
    </article>
  )
}
