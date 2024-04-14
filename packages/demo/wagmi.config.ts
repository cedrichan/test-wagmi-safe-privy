import { defineConfig } from "@wagmi/cli";
import { actions, react } from "@wagmi/cli/plugins";
//import { erc20ABI } from "wagmi";
import { Abi } from "viem";
import StorageABI from "./src/abis/Storage.json";
import { baseSepolia, sepolia } from "viem/chains";

export default defineConfig({
  out: "src/generated/wagmi.ts",
  contracts: [
    {
      name: "Storage",
      abi: StorageABI as Abi,
      address: {
        [sepolia.id]: "0x2F97B5f616495C2e923F39a46648eb783C053Ad7",
        [baseSepolia.id]: "0x0F224D7f8532D6de53C7ef1DC93B3AE9DeC74f83",
      },
    },
  ],
  plugins: [
    react(),
    actions(),
  ],
});
