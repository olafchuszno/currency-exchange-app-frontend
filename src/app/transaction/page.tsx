'use client'

import { useState } from "react";
import { TransactionData } from "@/pages/api/transaction"
import TransactionDetails from "./TransactionDetails";
import './page.scss';
import './TransactionDetails.scss';
import '../styles/main.scss';

interface TransactionError {
  message: string;
}

export interface TransactionDataToNextApi {
  transaction_eur_amount: number;
}


export default function Page() {
  const [transactionAmount, setTransactionAmount] = useState<number | null>(
    null
  );
  // const [forecastedTransactionPlnAmount, setForecastedTransactionPlnAmount] =
  //   useState<number | null>(null);
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionData | null>(null);
  const [transactionError, setTransactionError] =
    useState<TransactionError | null>(null);

  const [isFinalisingTransaction, setIsFinalisingTransaction] = useState(false);

  const finaliseTransaction = (transactionAmount: number) => {
    setTransactionDetails(null);
    setIsFinalisingTransaction(true);

    fetch('http://localhost:4000/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transaction_eur_amount: transactionAmount,
      } as TransactionDataToNextApi),
    })
      .then((response) => response.json())
      .then((transactionData: TransactionData) => {
        setTransactionDetails(transactionData);
      })
      .catch(() => {
        const transactionError: TransactionError = {
          message: 'Could not finalise the transaction.',
        };

        setTransactionError(transactionError);
      })
      .finally(() => {
        setIsFinalisingTransaction(false);
      });
  };

  const handleTransactionAmountInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const newTransactionInputValue = event.target.value;
    if (newTransactionInputValue === '') {
      setTransactionAmount(null);
      return;
    }
    const newTransactionAmount = +event.target.value;
    if (!newTransactionAmount || newTransactionAmount <= 0) {
      alert('Transaction amount has to be larger than 0');
      return;
    }
    setTransactionAmount(newTransactionAmount);
  }

  return (
    <main className="main">
        <h2 className="title title--2">Make a Transaction</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            if (!transactionAmount) {
              alert('Wrong transaction amount - not submittign the form!');
              return;
            }

            finaliseTransaction(transactionAmount);
          }}
          action=""
        >
          <div className='button-pair'>
            <input
              onChange={handleTransactionAmountInputChange}
              value={transactionAmount || ''}
              placeholder="Euro amount"
              type="number"
              className='button-pair__child'
            />

            <button className='button button-pair__child' type="submit">Make a transaction</button>
          </div>
        </form>

        {/* {forecastedTransactionPlnAmount &&
          !transactionDetails &&
          !isFinalisingTransaction && (
            <div>
              <p>Forecasted amonut in PLN: {forecastedTransactionPlnAmount}</p>
              <p>(exchange rate is fluctuating and is likely to change)</p>
            </div>
          )} */}

        {isFinalisingTransaction && <p>Finalising the transaction...</p>}

        {transactionError && (
          <p>{transactionError.message}. Please try again.</p>
        )}

        {transactionDetails && <p>Transaction completed!</p>}

        {transactionDetails && (
          <TransactionDetails transaction={transactionDetails} />
        )}
      </main>
  )
}

