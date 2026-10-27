import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Nama minimal 2 karakter.'),
  email: z.string().trim().email('Masukkan email yang valid.'),
  phone: z.string().trim().min(9, 'Nomor telepon minimal 9 digit.').max(16, 'Nomor telepon terlalu panjang.'),
  address: z.string().trim().min(10, 'Alamat minimal 10 karakter.'),
  payment: z.enum(['transfer', 'cod']),
})

export const productSchema = z.object({
  title: z.string().trim().min(3, 'Nama produk minimal 3 karakter.'),
  category: z.string().min(1, 'Pilih kategori.'),
  price: z.coerce.number().positive('Harga harus lebih dari 0.'),
  image: z.string().trim().url('Masukkan URL gambar yang valid.'),
  description: z.string().trim().min(10, 'Deskripsi minimal 10 karakter.'),
})

export const loginSchema = z.object({
  email: z.string().trim().email('Masukkan email yang valid.'),
  password: z.string().min(6, 'Kata sandi minimal 6 karakter.'),
})
