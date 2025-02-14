import { http, createConfig } from 'wagmi'
import { base, mainnet, sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// const projectId = '<WALLETCONNECT_PROJECT_ID>'

export const config = createConfig({
  chains: [mainnet, base],
  connectors: [
    injected()
  ],
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [sepolia.id]: http(),
  },
})
export const BACKEND_URL = "http://localhost:3000/api";
export const MARKETPLACE_CONTRACT_ADDRESS = import.meta.env.VITE_MARKETPLACE_CONTRACT_ADDRESS;
export const TOKEN_CONTRACT_ADDRESS = import.meta.env.VITE_TOKEN_CONTRACT_ADDRESS;
