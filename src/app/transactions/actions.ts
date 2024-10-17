'use server';

import { revalidatePath } from "next/cache"

export const handleTransactionsUpdate = async () => {
  revalidatePath('/transactions');
}