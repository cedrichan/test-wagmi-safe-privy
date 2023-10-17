import { LoginButton } from "@/components/LoginButton";
import { Providers } from "@/providers";
import { Container, Flex, Text } from "@chakra-ui/react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Container maxW="container.lg" minH="100vh" bg="gray.100">
            <Flex w="full" align="center" justify="space-between">
              <Text fontWeight="bold">Safetest</Text>
              <Flex>
                <LoginButton />
              </Flex>
            </Flex>
            {children}
          </Container>
        </Providers>
      </body>
    </html>
  );
}