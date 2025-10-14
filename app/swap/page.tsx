import { SwapInterface } from "@/components/swap/swap-interface"

export default function SwapPage() {
  return (
    <div className="min-h-screen bg-gradient-pattern overflow-hidden">
      <main className="container mx-auto px-4 py-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text-animated">Swap Tokens</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience seamless token swaps with our advanced liquidity mechanics and zero slippage trading.
            </p>
          </div>

            <div className="lg:col-span-2">
              <SwapInterface />
            </div>
        </div>
      </main>
    </div>
  )
}
