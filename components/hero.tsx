import { Button } from "@/components/ui/button"
import { Leaf, Bell } from "lucide-react"
import Image from "next/image"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden pt-20">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(74, 222, 128, 0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(74, 222, 128, 0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="text-center lg:text-left">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-4">
              <Bell className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Próximamente Disponible</span>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Leaf className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Vitalidad de Origen Vegetal</span>
            </div>

            {/* Main headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 text-balance">
              POTENCIA AL
              <span className="block text-primary">EXTREMO</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mb-10 text-pretty">
              SPINAL ofrece energía limpia de origen vegetal con cero azúcar. Enriquecido con vitaminas y antioxidantes para un rendimiento máximo.
            </p>

            {/* Single Flavor Notice */}
            <div className="mb-8 p-4 rounded-lg bg-card/50 border border-border inline-block">
              <p className="text-sm text-muted-foreground">
                <span className="text-primary font-semibold">Sabor Único:</span> Original - El poder puro de SPINAL
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Button size="lg" className="text-lg px-8 py-6 font-semibold" disabled>
                Próximamente
              </Button>
            </div>
          </div>

          {/* Product image */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-80 h-80 bg-primary/30 rounded-full blur-3xl" />
            <Image
              src="/images/spinal-can.png"
              alt="Lata de SPINAL Energy Drink"
              width={400}
              height={600}
              className="relative z-10 drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 mt-16 pt-16 border-t border-border/50">
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-primary">160mg</div>
            <div className="text-sm text-muted-foreground mt-1">Cafeína Natural</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-primary">0g</div>
            <div className="text-sm text-muted-foreground mt-1">Azúcar</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-primary">475ml</div>
            <div className="text-sm text-muted-foreground mt-1">Por Lata</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-black text-primary">B3-B12</div>
            <div className="text-sm text-muted-foreground mt-1">Complejo Vitamínico</div>
          </div>
        </div>
      </div>
    </section>
  )
}
