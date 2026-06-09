/**
 * Supabase Client Configuration
 * 
 * File ini berisi konfigurasi koneksi ke Supabase.
 * Digunakan untuk membuat client Supabase yang akan digunakan
 * untuk fetch data dari database.
 */

import { createClient } from '@supabase/supabase-js'

// Mengambil environment variables untuk koneksi Supabase di Vite
// PENTING: Pastikan di file .env Anda memakai prefix VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/**
 * Membuat Supabase client instance
 * Client ini digunakan untuk berkomunikasi dengan database Supabase
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Helper function untuk mendapatkan label kerentanan berdasarkan nilai dn
 */
export function getKerentananLabel(dn) {
  switch (dn) {
    case 1:
      return 'Tinggi'
    case 2:
      return 'Sedang'
    case 3:
      return 'Rendah'
    default:
      return 'Tidak Diketahui'
  }
}

/**
 * Helper function untuk mendapatkan warna berdasarkan tingkat kerentanan
 */
export function getKerentananColor(dn) {
  switch (dn) {
    case 1:
      return '#dc2626' // Merah - Tinggi
    case 2:
      return '#f59e0b' // Kuning - Sedang
    case 3:
      return '#22c55e' // Hijau - Rendah
    default:
      return '#6b7280' // Abu-abu
  }
}