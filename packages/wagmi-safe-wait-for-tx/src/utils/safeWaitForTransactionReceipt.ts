import {
  Address,
  PublicClient,
  WaitForTransactionReceiptParameters,
  WaitForTransactionReceiptReturnType,
} from "viem";
import { isContractWallet, resolveSafeTx } from "./safe";

/**
 * usable in a plain viem context
 *
 * @param publicClient
 * @param params
 * @returns TransactionReceipt
 */
export const safeWaitForTransactionReceipt = async (
  publicClient: PublicClient,
  params: WaitForTransactionReceiptParameters & {
    address: Address;
  }
): Promise<WaitForTransactionReceiptReturnType> => {
  if (!publicClient.chain) {
    throw new Error("no chain on public client");
  }

  const { address, ...waitParams } = params;

  const { isSafe } = await isContractWallet(publicClient, address);

  if (isSafe) {
    //try to resolve the underlying transaction
    const resolvedTx = await resolveSafeTx(publicClient.chain.id, params.hash);
    if (!resolvedTx) throw new Error("couldnt resolve safe tx");

    return publicClient.waitForTransactionReceipt({ ...waitParams, hash: resolvedTx });
  } else {
    return publicClient.waitForTransactionReceipt(waitParams);
  }
};
