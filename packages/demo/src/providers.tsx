"use client";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider as PrivyWagmiProvider } from '@privy-io/wagmi';
import React from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base, baseSepolia, mainnet, polygon, polygonMumbai, sepolia } from "viem/chains";
import { configureChainsConfig } from "./chainConfig";


export const Providers = ({ children }: { children: React.ReactNode }) => {

  const queryClient = new QueryClient();

  return (
    <CacheProvider>
      <ChakraProvider>
        <PrivyProvider
          appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
          config={{
            walletConnectCloudProjectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID,
            loginMethods: ["wallet", "google", "email"], // "email", "google", "twitter"
            //defaultChain: sepolia,
            embeddedWallets: {
              createOnLogin: "users-without-wallets",
            },
            supportedChains: [
              sepolia,
              baseSepolia,
              base,
              mainnet,
              polygon,
              polygonMumbai,
            ],
            appearance: {
              theme: "dark",
              accentColor: "#676FFF",
              showWalletLoginFirst: true,
            },
          }}
        >
            <QueryClientProvider client={queryClient}>
              <PrivyWagmiProvider config={ configureChainsConfig }>
                {children}
              </PrivyWagmiProvider>
            </QueryClientProvider>
        </PrivyProvider>
      </ChakraProvider>
    </CacheProvider>
  );
};
