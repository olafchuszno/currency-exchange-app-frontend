'use client';

import { handleTransactionsUpdate } from "./actions";

export function UpdateTransactionsForm() {
  return (
    <form action={handleTransactionsUpdate}>
      <button className="button" type='submit'>Get all transactions</button>
    </form>
  );
}
