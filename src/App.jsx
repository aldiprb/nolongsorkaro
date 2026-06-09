import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'

// Import Components dari folder components
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { MapComponent } from './components/MapComponent'

// Import Pages
import HomePage from './pages/Home'
import TentangPage from './pages/Tentang'
import MitigasiPage from './pages/Mitigasi'

// ✅ Scroll ke atas setiap pindah halaman
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}

// 404 Page
function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center">
      <h1 className="text-5xl font-bold text-emerald-600">404</h1>
      <p className="text-slate-500 mt-2">Halaman tidak ditemukan</p>
      <Link to="/" className="mt-4 text-emerald-600 hover:underline">
        Kembali ke Beranda
      </Link>
    </div>
  )
}

// App utama
export default function App() {
  return (
    <Router>
      <ScrollToTop />

      {/* Tambahkan flex dan flex-col agar footer bisa menempel di bawah */}
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Navbar dari components */}
        <Navbar />

        {/* Konten utama dibungkus flex-grow agar mengisi sisa ruang */}
        <main className="grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Memasukkan MapComponent langsung ke route /peta */}
            <Route path="/peta" element={<MapComponent />} />
            <Route path="/mitigasi" element={<MitigasiPage />} />
            <Route path="/tentang" element={<TentangPage />} />

            {/* fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        {/* Footer dari components diletakkan di paling bawah */}
        <Footer />
      </div>
    </Router>
  )
}