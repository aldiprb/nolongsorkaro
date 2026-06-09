import { MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-white">
              SIG Longsor Karo
            </span>
          </div>
          <p className="max-w-md text-sm text-slate-400">
            Sistem Informasi Geografis untuk Pemetaan Kerentanan Longsor
            Berbasis NDVI dan Kemiringan Lereng di Kabupaten Karo, Sumatera Utara.
          </p>
          <div className="border-t border-slate-800 pt-4 mt-4 w-full">
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} SIG Longsor Karo. Dikembangkan untuk kepentingan penelitian dan edukasi.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
