"use client";

import { ActiveAddress } from "@/components/ActiveAddress";
import {
  storageAbi,
  useReadStorageRetrieve,
  useWriteStorageStore
} from "@/generated/wagmi";
import { safeDecodeLogs } from "@/utils/safeDecodeLogs";
import {
  Button,
  Flex,
  FormControl,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSafeWaitForTransaction } from "@moleculexyz/wagmi-safe-wait-for-tx";
import { useCallback, useEffect, useState } from "react";
import { WriteContractReturnType } from "viem";
import { useAccount } from "wagmi";

export default function Home() {
  const { address, chainId } = useAccount();

  const toast = useToast();
  const [newVal, setNewVal] = useState<number>(0);
  const [curVal, setCurVal] = useState<number>();
  const [tx, setTx] = useState<WriteContractReturnType>();

  const { data, error, status } = useReadStorageRetrieve();
  const { writeContractAsync } = useWriteStorageStore();
  const { data: receipt, isError, isLoading } = useSafeWaitForTransaction(tx);

  useEffect(() => {
    if (data === undefined) return;
    setCurVal(Number(data));
    setNewVal(Number(data));
  }, [data]);

  useEffect(() => {
    if (!receipt) return;

    const numberChangedEvent = safeDecodeLogs(receipt, storageAbi).find(
      (e) => e?.eventName == "NumberChanged"
    );
    if (!numberChangedEvent) {
      console.warn("couldnt find numberchanged event");
      return;
    }

    console.log(numberChangedEvent);
    toast({
      status: "success",
      title: "Number updated",
      description: `to ${numberChangedEvent.args._new}`,
    });
    setCurVal(Number(numberChangedEvent.args._new));
  }, [receipt, toast]);

  const onSubmit = useCallback(async () => {
    if (!address || !chainId || newVal === undefined) return;

    setTx(
      await writeContractAsync({
        args: [BigInt(newVal || 0n)],
      })
    );
  }, [address, chainId, newVal, writeContractAsync]);

  return (
    <main>
      <Text>
        current value: {curVal !== undefined ? curVal.toString() : "not avail"}
      </Text>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
          return false;
        }}
      >
        <Flex>
          <FormControl>
            <Input
              name="newVal"
              type="number"
              value={newVal}
              onChange={(v: any) => { v.preventDefault(); setNewVal(v.target.valueAsNumber) }}
            />
          </FormControl>
          <Button colorScheme="cyan" type="submit">
            Store
          </Button>
        </Flex>
        {tx && (
          <Flex direction="column" my={6}>
            <Text>
              Transaction: <b>{tx}</b>
            </Text>
            {receipt && (
              <Text>
                Receipt: <b>{receipt.status}</b>
              </Text>
            )}
          </Flex>
        )}
      </form>
      <ActiveAddress />
    </main>
  );
}
