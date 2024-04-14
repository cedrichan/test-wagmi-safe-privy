"use client";
import { Button, Flex, Text, VStack } from "@chakra-ui/react";
import { useIsContractWallet } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { useCallback } from "react";
import { Address } from "viem";
import { useAccount, useDisconnect } from "wagmi";

export const LoginButton = () => {
  const {setActiveWallet} = useSetActiveWallet()
  
  const {address, chain, chainId} = useAccount()
    const { logout, login, user, connectWallet } = usePrivy();
  const isContractWallet = useIsContractWallet(
    address as Address | undefined
  );

  const { disconnect } = useDisconnect();

  const { wallets, ready } = useWallets();

  const unlink = useCallback(() => {
    disconnect();
    try {
      logout();
    } catch (e: any) {
      console.warn("cant disconnect wallet");
    }
  }, [disconnect, logout]);

  if (wallets && wallets.length > 0) {
    return (
      <Flex gap={2} align="center">
        <VStack>
          {wallets.map((wallet) => (
            <Flex key={wallet.address}>
              {wallet.address === address ? (
                <Text onClick={() => setActiveWallet(wallet)}>
                  {wallet.address} {isContractWallet.isContract ? "AA" : "EOA"}
                  {isContractWallet.isSafe && "SAFE"}
                </Text>
              ) : (
                <Button onClick={() => setActiveWallet(wallet)} size="sm">
                  Activate {wallet.address}
                </Button>
              )}
            </Flex>
          ))}
          <Flex>Chain: {chainId} {chain?.name}</Flex>
        </VStack>
        <Button onClick={unlink}>Logout</Button>
      </Flex>
    );
  }

  if (user) {
    return <Button onClick={() => logout()} colorScheme="yellow">
      Log out
    </Button>
  }
  //use "login" for the full privy flow
  return (
    <>
    <Button onClick={() => login()} colorScheme="orange">
      Login
    </Button>
    </>
  );
};
