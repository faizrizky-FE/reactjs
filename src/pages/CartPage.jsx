import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '../router'
import Icon from '../components/Icon'
import { formatPrice } from '../data/products'
import useScrollReveal from '../hooks/useScrollReveal'
import { checkoutSchema } from '../schemas/forms'
import '../styles/cart-page.css'

export default function CartPage({ cart, onQuantity, onRemove, onCheckout }) {
  useScrollReveal('cart')

  const [checkoutDone, setCheckoutDone] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutError, setCheckoutError] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', email: '', phone: '', address: '', payment: 'transfer' },
  })
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? (subtotal >= 500000 ? 0 : 20000) : 0

  async function submitCheckout(values) {
    setCheckoutError('')
    try {
      await onCheckout(values)
      setCheckoutDone(true)
    } catch (error) {
      setCheckoutError(error.message)
    }
  }

  if (checkoutDone) {
    return <section className="cart-page section-pad"><div className="checkout-success" data-reveal><span className="success-icon"><Icon name="check" size={35} /></span><span className="eyebrow">Pesanan tersimpan</span><h1>Terima kasih sudah belanja!</h1><p>Pesananmu sudah disimpan di browser ini. Pembayaran dan pengiriman belum diproses otomatis.</p><Link to="/produk" className="button button-primary">Lanjut Belanja <Icon name="arrow" size={16} /></Link></div></section>
  }

  return (
    <section className="cart-page section-pad">
      <div className="content-width">
        <div className="cart-page-heading" data-reveal><span className="eyebrow">Ringkasan belanja</span><h1>Keranjang Kamu <span>({cart.reduce((total, item) => total + item.quantity, 0)})</span></h1><p>Periksa lagi pilihanmu sebelum lanjut ke pembayaran.</p></div>
        {cart.length > 0 ? <div className="cart-layout">
          <div className="cart-list" data-reveal>
            {cart.map((item) => <article className="cart-page-item" key={item.id}>
              <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
              <div className="cart-page-item-info"><span className="product-category">{item.category}</span><h2>{item.title}</h2><p>{formatPrice(item.price)}</p><div className="quantity-control"><button type="button" onClick={() => onQuantity(item.id, -1)} aria-label={`Kurangi ${item.title}`}><Icon name="minus" size={14} /></button><span>{item.quantity}</span><button type="button" onClick={() => onQuantity(item.id, 1)} aria-label={`Tambah ${item.title}`}><Icon name="plus" size={14} /></button></div></div>
              <button type="button" className="remove-item" onClick={() => onRemove(item.id)} aria-label={`Hapus ${item.title}`}><Icon name="trash" size={18} /></button>
            </article>)}
            <Link className="back-to-shop" to="/produk"><Icon name="arrow" size={15} /> Lanjut belanja</Link>
          </div>
          <aside className="order-summary" data-reveal><h2>Ringkasan Pesanan</h2><div><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div><div><span>Pengiriman</span><strong>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</strong></div>{subtotal > 0 && subtotal < 500000 && <p className="shipping-hint">Belanja {formatPrice(500000 - subtotal)} lagi untuk gratis ongkir.</p>}<div className="summary-total"><span>Total</span><strong>{formatPrice(subtotal + shipping)}</strong></div>
            {!checkoutOpen ? <button type="button" className="button button-primary checkout-button" onClick={() => setCheckoutOpen(true)}>Lanjut Checkout <Icon name="arrow" size={17} /></button> : <form className="checkout-form" onSubmit={handleSubmit(submitCheckout)} noValidate>
              <h3>Data pengiriman</h3>
              <label>Nama lengkap<input autoComplete="name" {...register('name')} />{errors.name && <small>{errors.name.message}</small>}</label>
              <label>Email<input type="email" autoComplete="email" {...register('email')} />{errors.email && <small>{errors.email.message}</small>}</label>
              <label>Nomor telepon<input type="tel" autoComplete="tel" {...register('phone')} />{errors.phone && <small>{errors.phone.message}</small>}</label>
              <label>Alamat lengkap<textarea rows="3" autoComplete="street-address" {...register('address')} />{errors.address && <small>{errors.address.message}</small>}</label>
              <label>Metode pembayaran<select {...register('payment')}><option value="transfer">Transfer bank</option><option value="cod">Bayar di tempat</option></select>{errors.payment && <small>{errors.payment.message}</small>}</label>
              {checkoutError && <p className="form-server-error" role="alert">{checkoutError}</p>}
              <div className="checkout-form-actions"><button type="submit" className="button button-primary checkout-button" disabled={isSubmitting}>{isSubmitting ? 'Memproses...' : 'Konfirmasi pesanan'} <Icon name="arrow" size={17} /></button><button type="button" className="button button-secondary checkout-reset" onClick={() => reset()}>Reset form</button></div>
            </form>}
            <p className="checkout-note"><Icon name="shield" size={15} /> Pesanan disimpan lokal; pembayaran dan pengiriman belum terhubung.</p></aside>
        </div> : <div className="empty-cart-page" data-reveal><span className="empty-cart-icon"><Icon name="cart" size={32} /></span><h2>Keranjangmu masih kosong</h2><p>Yuk, cari sesuatu yang bikin harimu lebih menyenangkan.</p><Link to="/produk" className="button button-primary">Mulai Belanja <Icon name="arrow" size={16} /></Link></div>}
      </div>
    </section>
  )
}
