import { Card, CardContent } from "@/components/ui/card"
import { Waves, Shield, Zap, Users } from "lucide-react"
import { RippleEffect } from "@/components/ui/ripple-effect"

const valueProps = [
  {
    icon: Waves,
    title: "Fluid Swaps",
    description:
      "Experience seamless token swaps with our innovative liquidity mechanics that eliminate traditional slippage.",
  },
  {
    icon: Shield,
    title: "Deep Liquidity",
    description:
      "Access deep liquidity pools powered by advanced market-making algorithms and institutional partnerships.",
  },
  {
    icon: Zap,
    title: "UX-First Design",
    description: "Intuitive interface designed for both beginners and professionals with guided trading experiences.",
  },
  {
    icon: Users,
    title: "Secure by Design",
    description: "Built with security at its core, featuring audited smart contracts and battle-tested infrastructure.",
  },
]

export function ValuePropsSection() {
  return (
    <section className="py-24 bg-linear-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            Why Choose <span className="text-accent">Maelstrom</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Built for the next generation of DeFi traders who demand speed, security, and seamless user experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop) => (
            <Card
              key={prop.title}
              className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border-border/50 bg-card/50 backdrop-blur-sm relative overflow-hidden cursor-pointer"
            >
              <RippleEffect color="rgba(124, 58, 237, 0.06)" />
              <CardContent className="p-6 text-center relative">
                <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
                  <prop.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{prop.title}</h3>
                <p className="text-sm text-muted-foreground text-pretty">{prop.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
