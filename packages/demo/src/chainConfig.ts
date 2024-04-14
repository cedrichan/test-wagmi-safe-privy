import { createConfig } from "@privy-io/wagmi"
import { http } from "viem"
import { baseSepolia, sepolia } from "viem/chains"

export const configureChainsConfig = createConfig({
  chains: [baseSepolia,sepolia],
  ssr: true, 
  transports: {
    [sepolia.id]: http(),
    [baseSepolia.id]: http()

  }
})
  
declare module 'wagmi' { 
  interface Register { 
    config: typeof configureChainsConfig 
  } 
} 
