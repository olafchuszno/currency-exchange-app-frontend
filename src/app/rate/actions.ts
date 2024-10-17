'use server';

import { revalidatePath } from "next/cache";

export const handleRateRefresh = async () => {
  revalidatePath('/rate');
};