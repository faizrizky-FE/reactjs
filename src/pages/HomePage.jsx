import { Link } from '../router'
import { categories, testimonials } from '../data/products'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import useScrollReveal from '../hooks/useScrollReveal'
import '../styles/home-page.css'

function ProductSkeleton({ count = 4 }) {
  return <div className="product-grid skeleton-grid" role="status" aria-label="Memuat produk">
    {Array.from({ length: count }, (_, index) => <article className="product-card skeleton-card" key={`skeleton-${index}`} aria-hidden="true"><div className="skeleton-image" /><div className="skeleton-info"><span /><span /><span /><span /></div></article>)}
  </div>
}

export default function HomePage({ products, loadState, favorites, onFavorite, onAdd }) {
  useScrollReveal(`home-${products.length}-${loadState}`)

  return (
    <>
      <section className="hero-section" id="beranda">
        <div className="hero-inner content-width">
          <div className="hero-copy" data-reveal>
            <span className="eyebrow"><span className="eyebrow-dot" /> Belanja Lebih Mudah</span>
            <h1>Temukan Produk Terbaik untuk <span>Kebutuhanmu</span></h1>
            <p>Pengalaman belanja yang cepat, aman, dan menyenangkan. Temukan produk favoritmu dengan harga terbaik.</p>
            <div className="hero-buttons">
              <Link className="button button-primary" to="/produk">Belanja Sekarang <Icon name="arrow" size={17} /></Link>
              <a className="button button-secondary" href="#kategori"><span className="grid-mini">▦</span> Lihat Kategori</a>
            </div>
            <div className="hero-proof"><span className="proof-avatars"><i>😊</i><i>🙂</i><i>😎</i></span><span><strong>10.000+</strong> pelanggan puas</span><span className="proof-stars">★★★★★</span></div>
          </div>
          <div className="hero-art" aria-label="Ilustrasi keranjang belanja" role="img" data-reveal>
            <div className="art-glow" />
            <div className="float-tile tile-one">✦</div><div className="float-tile tile-two">▦</div><div className="float-tile tile-three">♡</div><div className="float-tile tile-four">⌁</div>
            <svg className="shopping-illustration" viewBox="0 0 520 390" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="263" cy="335" rx="166" ry="17" fill="#DCE9FF" />
              <path d="M128 113h35l35 152h185l35-118H171" stroke="#286BDF" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
              <path d="m191 154 15 98h160l24-98H191Z" fill="#DCE9FF" stroke="#4387F8" strokeWidth="8" />
              <path d="M218 163v83m41-83v83m43-83v83m42-83v83M200 191h174m-165 34h156" stroke="#75A9FF" strokeWidth="5" />
              <path d="M205 119h115v67H205z" fill="#FFC477" stroke="#F0A84D" strokeWidth="5" />
              <path d="M226 119v-18h72v18" stroke="#E9A44F" strokeWidth="6" strokeLinecap="round" />
              <path d="M313 151h49v100h-49z" fill="#448BFA" />
              <path d="M324 151v-13c0-15 28-15 28 0v13" stroke="#286BDF" strokeWidth="7" strokeLinecap="round" />
              <path d="M242 254h70v57h-70z" fill="#FFD096" stroke="#F0B66A" strokeWidth="5" />
              <path d="M259 254v-11h35v11" stroke="#E9A44F" strokeWidth="5" />
              <path d="M237 311v17m83-17v17" stroke="#31517E" strokeWidth="7" strokeLinecap="round" />
              <circle cx="224" cy="332" r="17" fill="#172D4B" /><circle cx="224" cy="332" r="7" fill="#9CB2D1" />
              <circle cx="356" cy="332" r="17" fill="#172D4B" /><circle cx="356" cy="332" r="7" fill="#9CB2D1" />
              <path d="M165 117h34" stroke="#286BDF" strokeWidth="12" strokeLinecap="round" />
            </svg>
            <div className="art-caption">Pilihan kecil, kebahagiaan besar <span>✦</span></div>
            <div className="hero-floating-card"><span>✦</span><div><strong>Temukan favoritmu</strong><small>Harga spesial setiap hari</small></div></div>
          </div>
        </div>
      </section>

      <section className="home-perks content-width" aria-label="Keunggulan MyShop" data-reveal>
        <div><span className="perk-icon">↗</span><span><strong>Gratis ongkir</strong><small>Untuk belanja di atas Rp500 ribu</small></span></div>
        <i />
        <div><span className="perk-icon">◇</span><span><strong>Belanja terlindungi</strong><small>Transaksi nyaman dan aman</small></span></div>
        <i />
        <div><span className="perk-icon">✦</span><span><strong>Produk pilihan</strong><small>Kurasi terbaik, kualitas terjamin</small></span></div>
      </section>

      <section className="category-section section-pad" id="kategori" data-reveal>
        <div className="section-heading centered">
          <span className="eyebrow">Kategori</span>
          <h2>Jelajahi Kategori Kami</h2>
          <p>Temukan berbagai produk unggulan dalam kategori yang kamu butuhkan.</p>
        </div>
        <div className="category-grid content-width">
          {categories.slice(1).map((category, index) => (
            <Link to={`/produk?category=${encodeURIComponent(category.name)}`} className={`category-card tone-${category.tone}`} key={category.name} data-reveal style={{ '--reveal-order': index }}>
              <span className="category-icon">{category.icon}</span><span>{category.name}</span><span className="category-arrow"><Icon name="arrow" size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="home-products section-pad">
        <div className="content-width">
          <div className="products-heading" data-reveal>
            <div className="section-heading"><span className="eyebrow">Produk Unggulan</span><h2>Favorit Minggu Ini</h2><p>Pilihan seru untuk upgrade aktivitas sehari-hari.</p></div>
            <Link className="text-link" to="/produk">Jelajahi semua <Icon name="arrow" size={15} /></Link>
          </div>
          {loadState === 'loading' ? <ProductSkeleton /> : products.length > 0
            ? <div className="product-grid">{products.slice(0, 4).map((product, index) => <ProductCard key={product.id} product={product} index={index} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onAdd={onAdd} />)}</div>
            : <p className="home-error">Produk belum dapat dimuat. Coba buka halaman produk untuk memuat ulang katalog.</p>}
        </div>
      </section>

      <section className="trust-section content-width" data-reveal>
        <div className="trust-copy"><span className="eyebrow">Kenapa Pilih MyShop?</span><h2>Belanja Aman, Nyaman,<br />dan Terpercaya</h2><p>Kami selalu mengutamakan kepuasan pelanggan dengan layanan terbaik dan produk berkualitas.</p><Link to="/produk" className="button button-primary">Pelajari Lebih Lanjut <Icon name="arrow" size={16} /></Link></div>
        <div className="trust-shield"><div className="shield-halo" /><Icon name="shield" size={104} /><span className="shield-check"><Icon name="check" size={34} /></span></div>
        <div className="trust-benefits">
          <div className="benefit"><span className="benefit-icon"><Icon name="truck" size={21} /></span><span><strong>Pengiriman Cepat</strong><small>Pesanan sampai dengan aman dan tepat waktu.</small></span></div>
          <div className="benefit"><span className="benefit-icon"><Icon name="card" size={21} /></span><span><strong>Pembayaran Aman</strong><small>Transaksi lebih aman dengan berbagai metode pembayaran.</small></span></div>
          <div className="benefit"><span className="benefit-icon"><Icon name="shield" size={21} /></span><span><strong>Produk Berkualitas</strong><small>Semua produk melalui proses seleksi yang ketat.</small></span></div>
        </div>
      </section>

      <section className="reviews-section section-pad" id="testimoni" data-reveal>
        <div className="section-heading centered"><span className="eyebrow">Testimoni</span><h2>Apa Kata Pelanggan Kami?</h2><p>Kepuasan pelanggan adalah motivasi terbesar kami untuk terus berkembang.</p></div>
        <div className="review-grid content-width">{testimonials.map((review, index) => <article className="review-card" key={review.name} data-reveal style={{ '--reveal-order': index }}><div className="review-person"><span className={`review-avatar avatar-${review.color}`}>{review.initials}</span><span><strong>{review.name}</strong><small><Icon name="star" size={13} /> {review.rating}</small></span></div><p>“{review.quote}”</p></article>)}</div>
      </section>
    </>
  )
}
