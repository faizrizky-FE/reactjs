import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { categories, formatPrice } from '../data/products'
import { productSchema } from '../schemas/forms'
import '../styles/admin-page.css'

export function AdminLayout({ onLogout }) {
  return (
    <section className="admin-page section-pad">
      <div className="content-width">
        <header className="admin-heading"><div><span className="eyebrow">MyShop Studio</span><h1>Kelola toko</h1></div><button className="button button-secondary" type="button" onClick={onLogout}>Keluar</button></header>
        <nav className="admin-nav" aria-label="Navigasi admin">
          <NavLink end to="/admin">Ringkasan</NavLink>
          <NavLink to="/admin/products">Produk</NavLink>
          <Link to="/">Lihat toko ↗</Link>
        </nav>
        <Outlet />
      </div>
    </section>
  )
}

export function AdminDashboard({ products }) {
  return <div className="admin-dashboard">
    <div className="admin-stat"><span>Total produk</span><strong>{products.length}</strong><Link to="/admin/products">Kelola katalog →</Link></div>
    <div className="admin-dashboard-note"><strong>Katalog tersimpan di browser</strong><p>Tambah, edit, dan hapus produk tersimpan di browser ini dan tetap tersedia setelah halaman dimuat ulang.</p></div>
  </div>
}

export function AdminProductsPage({ products, onCreate, onUpdate, onDelete }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  const editing = Boolean(productId)
  const product = products.find((item) => item.id === productId)
  const [serverError, setServerError] = useState('')
  const [deleteBusy, setDeleteBusy] = useState('')
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: { title: '', category: '', price: '', image: '', description: '' },
  })

  useEffect(() => {
    reset(product ? {
      title: product.title,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.description,
    } : { title: '', category: '', price: '', image: '', description: '' })
  }, [product, reset])

  async function submit(values) {
    setServerError('')
    try {
      if (editing) await onUpdate(productId, values)
      else await onCreate(values)
      reset()
      navigate('/admin/products')
    } catch (error) {
      setServerError(error.message)
    }
  }

  async function remove(id) {
    setDeleteBusy(id)
    setServerError('')
    try {
      await onDelete(id)
    } catch (error) {
      setServerError(error.message)
    } finally {
      setDeleteBusy('')
    }
  }

  if (editing && !product) {
    return <div className="admin-empty"><h2>Produk tidak ditemukan</h2><Link to="/admin/products">Kembali ke katalog</Link></div>
  }

  return <div className="admin-products-layout">
    <div className="admin-product-form">
      <h2>{editing ? 'Edit produk' : 'Tambah produk'}</h2>
      <form className="admin-form" onSubmit={handleSubmit(submit)} noValidate>
        <label>Nama produk<input {...register('title')} />{errors.title && <small>{errors.title.message}</small>}</label>
        <label>Kategori<select {...register('category')}><option value="">Pilih kategori</option>{categories.filter((item) => item.name !== 'Semua').map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select>{errors.category && <small>{errors.category.message}</small>}</label>
        <label>Harga (IDR)<input type="number" min="1" step="1000" {...register('price')} />{errors.price && <small>{errors.price.message}</small>}</label>
        <label>URL gambar<input type="url" {...register('image')} />{errors.image && <small>{errors.image.message}</small>}</label>
        <label>Deskripsi<textarea rows="3" {...register('description')} />{errors.description && <small>{errors.description.message}</small>}</label>
        {serverError && <p className="form-server-error" role="alert">{serverError}</p>}
        <div className="admin-form-actions"><button className="button button-primary" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Tambah produk'}</button><button className="button button-secondary" type="button" onClick={() => reset()}>Reset form</button>{editing && <Link className="button button-secondary" to="/admin/products">Batal</Link>}</div>
      </form>
    </div>
    <div className="admin-product-list">
      <div className="admin-list-heading"><h2>Daftar produk</h2><span>{products.length} produk</span></div>
      {serverError && <p className="form-server-error" role="alert">{serverError}</p>}
      {products.length === 0 ? <p className="admin-empty">Belum ada produk pada katalog.</p> : products.map((item) => <article className="admin-product-row" key={item.id}>
        <img src={item.image} alt="" loading="lazy" />
        <div><strong>{item.title}</strong><span>{item.category} · {formatPrice(item.price)}</span></div>
        <div className="admin-row-actions"><Link to={`/admin/products/${item.id}/edit`} aria-label={`Edit ${item.title}`}>Edit</Link><button type="button" disabled={deleteBusy === item.id} onClick={() => remove(item.id)}>{deleteBusy === item.id ? '...' : 'Hapus'}</button></div>
      </article>)}
    </div>
  </div>
}
