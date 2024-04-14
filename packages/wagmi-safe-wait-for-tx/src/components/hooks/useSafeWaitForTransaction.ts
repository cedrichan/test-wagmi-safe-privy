import { useEffect, useState } from "react";
import { WriteContractReturnType } from "viem";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { resolveSafeTx } from "../../utils/safe";
import { useIsContractWallet } from "./useIsContractWallet";


export const useSafeWaitForTransaction = (
  writeResult: WriteContractReturnType | undefined
) => {
  const { address, chain } = useAccount();

  const { isSafe: isSafeWallet } = useIsContractWallet(address);

  const [safeResult, setSafeResult] = useState<
  WriteContractReturnType | undefined
  >();

  const waitResponse = useWaitForTransactionReceipt({
    chainId: chain?.id,
    hash: safeResult,
  });
  
  useEffect(() => {
    if (!writeResult || !chain || isSafeWallet === undefined) {
      return;
    }

    if (isSafeWallet) {
      //try to resolve the underlying transaction
      resolveSafeTx(chain.id, writeResult).then((resolvedTx) => {
        if (!resolvedTx) throw new Error("couldnt resolve safe tx");
        setSafeResult(resolvedTx);
      });
    } else {
      setSafeResult(writeResult);
    }
  }, [chain, isSafeWallet, writeResult]);

  return waitResponse;
};
