'use server';

import { revalidatePath } from "next/cache";

export const handleRateRefresh = async () => {
  try {
    revalidatePath('/rate');
  } catch {
    throw new Error('Failed to refresh the exchange rate. Please check your internet connection and try again.');
  }
};