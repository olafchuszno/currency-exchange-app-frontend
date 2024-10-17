'use server'

import { TransactionData } from "@/pages/api/transaction";
import TransactionsTable from "./TransactionsTable";
import { UpdateTransactionsForm } from "./UpdateTransactionsForm";
import '../styles/main.scss';

interface TransactionFetchError {
  error: Error;
}

type TransactionsFetchResponse = TransactionData[] | TransactionFetchError;

const getAllTransactions = async (): Promise<TransactionsFetchResponse> => {
  try {
  const response = await fetch('http://host.docker.internal:4000/transaction');
  
    const data: TransactionData[] = await response.json();
    
    return data;
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error : new Error('Unknown error occured when fetching transactions'),
    };
  }
}

export default async function Page() {
  const transactions: TransactionsFetchResponse = await getAllTransactions();

  const hasFetchingError = 'error' in transactions;

  return (
    <main className="main">
      <h2 className="title title--2">All Transactions</h2>

      {hasFetchingError && <p>Could&apos;t not fetch transactions. Please try again.</p>}

      <div>
        <UpdateTransactionsForm />
      </div>


      {!hasFetchingError
        && !!transactions?.length
        && <TransactionsTable transactions={transactions} />
      }
    </main>
  )
}
