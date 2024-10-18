'use server';

import { revalidatePath } from "next/cache";

export const handleRateRefresh = async () => {
  try {
    revalidatePath('/rate');
  } catch (e) {
    console.warn('Caught the error dummy', e)
    
    throw new Error('Failed to refresh the exchange rate. Please check your internet connection and try again.');
  }
};