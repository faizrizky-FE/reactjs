import Icon from './Icon'
import { Link } from '../router'

export default function SiteFooter({ onNotify }) {
  function submitNewsletter(event) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    if (!formData.get('email')) return
    event.currentTarget.reset()
    onNotify('Terima kasih! Kamu akan mendapat kabar promo terbaru.')
  }

  return (
    <footer className="site-footer">
      <div className="footer-main content-width">
        <div className="footer-brand">
          <Link className="brand brand-light" to="/"><span className="brand-mark"><Icon name="cart" size={19} /></span><span>My<span>Shop</span></span></Link>
          <p>Belanja online jadi lebih mudah,<br />cepat, dan aman bersama MyShop.</p>
          <div className="social-links"><a href="#footer" aria-label="Facebook">f</a><a href="#footer" aria-label="Instagram">◎</a><a href="#footer" aria-label="YouTube">▶</a><a href="#footer" aria-label="X">𝕏</a></div>
        </div>
        <div className="footer-column"><h3>Tautan Cepat</h3><Link to="/">Beranda</Link><Link to="/produk">Produk</Link><a href="/#kategori">Kategori</a><a href="#footer">Kontak</a></div>
        <div className="footer-column"><h3>Bantuan</h3><a href="#footer">Cara Belanja</a><a href="#footer">Pengiriman</a><a href="#footer">Pembayaran</a><a href="#footer">FAQ</a></div>
        <div className="footer-newsletter" id="footer"><h3>Newsletter</h3><p>Dapatkan informasi terbaru tentang promo dan produk menarik dari MyShop.</p><form onSubmit={submitNewsletter}><label className="sr-only" htmlFor="newsletter-email">Alamat email</label><input id="newsletter-email" name="email" type="email" placeholder="Masukkan email kamu" required /><button type="submit" aria-label="Daftar newsletter"><Icon name="arrow" size={17} /></button></form></div>
      </div>
      <div className="footer-bottom content-width"><span>© 2026 MyShop. All rights reserved.</span><span><a href="#footer">Syarat &amp; Ketentuan</a><i /> <a href="#footer">Kebijakan Privasi</a></span></div>
    </footer>
  )
}
