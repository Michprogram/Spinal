import { Leaf, Battery, Sparkles, Zap } from "lucide-react"

const features = [
  {
    icon: Leaf,
    title: "Fórmula Vegetal",
    description: "100% vitalidad de origen vegetal con cafeína natural de granos de café verde para energía limpia.",
  },
  {
    icon: Battery,
    title: "Complejo de Vitamina B",
    description: "Enriquecido con vitaminas B3, B6 y B12 para apoyar el metabolismo energético y reducir la fatiga.",
  },
  {
    icon: Sparkles,
    title: "Impulso Antioxidante",
    description: "Cargado de poderosos antioxidantes para proteger las células y apoyar el bienestar general.",
  },
  {
    icon: Zap,
    title: "Energía Sin Azúcar",
    description: "Toda la energía, sin el bajón. Fórmula cero azúcar para un rendimiento sostenido todo el día.",
  },
]

export function Features() {
  return (
    <section id="caracteristicas" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-balance mb-4">
            ¿Por Qué Elegir <span className="text-primary">SPINAL</span>?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
            Bebida energética de alto rendimiento diseñada con ingredientes de origen vegetal para quienes exigen más de su combustible.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
