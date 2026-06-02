export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <svg 
              viewBox="0 0 32 32" 
              className="w-8 h-8 text-primary"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none" />
              <path 
                d="M16 6 L16 10 M16 12 L16 16 M16 18 L16 22 M16 24 L16 26" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round"
              />
              <circle cx="16" cy="8" r="1.5" fill="currentColor" />
              <circle cx="16" cy="14" r="1.5" fill="currentColor" />
              <circle cx="16" cy="20" r="1.5" fill="currentColor" />
              <circle cx="16" cy="25" r="1.5" fill="currentColor" />
            </svg>
            <span className="text-xl font-black tracking-tight">SPINAL</span>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            {new Date().getFullYear()} SPINAL Energy. Todos los derechos reservados. Vitalidad de Origen Vegetal.
          </p>
        </div>
      </div>
    </footer>
  )
}
