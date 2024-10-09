'use client';

import { useEffect, useMemo, useState } from 'react';
import './page.scss';
import getTime from './helpers/getTime';
import { TransactionData } from '@/pages/api/transaction';

export interface TransactionDataToNextApi {
  transaction_eur_amount: number
}

export default function Page() {
  const [exchangeRate, setExchangeRate] = useState<null | number>(null);
  const [currencyExchangeFormError, setCurrencyExchangeFormError] =
    useState<boolean>(false);
  const [convertedCurrencyRate, setConvertedCurrencyRate] = useState<
    number | null
  >(null);

  const [inputAmountInEur, setInputAmountInEur] = useState<number | null>(null);
  const [inputAmountInEurError, setInputAmountInEurError] =
    useState<boolean>(false);
  
  const [transactionAmount, setTransactionAmount] = useState<number | null>(null)
  const [transactionDetails, setTransactionDetails] = useState<TransactionData | null>(null)


  const [lastCurrencyRateUpdateTimestamp, setLastCurrencyRateUpdateTimestamp] = useState<string | null>(null);

  const getExchangeRate = () => {
    fetch('/api/exchange-rate')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const { exchange_rate } = data;

        setExchangeRate(exchange_rate);

        setLastCurrencyRateUpdateTimestamp(getTime());
      })
      .catch(() => console.error('Error fetching exchange data'));
  };

  const convertCurrency = () => {
    fetch('/api/exchange-rate')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const exchangedAmount =
          +data.exchange_rate * (inputAmountInEur as number);
        const roundedExchangedAmount = Math.round(exchangedAmount * 100) / 100;
        // TODO check without plus operator
        setConvertedCurrencyRate(roundedExchangedAmount);
      })
      .catch(() => {
        setCurrencyExchangeFormError(true);
        return null;
      });
  };


  const finaliseTransaction = (transactionAmount: number) => {
    fetch('/api/transaction', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ transaction_eur_amount: transactionAmount } as TransactionDataToNextApi),
    })
      .then((response) => response.json())
      .then((transactionData: TransactionData) => {
        setTransactionDetails(transactionData);
      });
  };

  useEffect(() => {
    getExchangeRate();

    const exchangeFetchInterval = setInterval(getExchangeRate, 10000);

    return () => clearInterval(exchangeFetchInterval);
  }, []);


  const isEurInputValid = useMemo(() => {
    return inputAmountInEur && inputAmountInEur >= 0;
  }, [inputAmountInEur]);

  return (
    <main className='main'>
      <section className='section-tile'>
        <h1>Exchange rate</h1>

        <p>Exchange rate: <span data-cy="exchange-rate">{exchangeRate}</span></p>

        {lastCurrencyRateUpdateTimestamp && <p>Last exchange rate update: {lastCurrencyRateUpdateTimestamp}</p>}

        <button onClick={() => getExchangeRate()}>Update Exchange rate</button>
      </section>

      <section className='section-tile'>
        <h2>Conversion calculator</h2>

        <form
          onSubmit={(event: React.FormEvent) => {
            event.preventDefault();
            setInputAmountInEurError(false);

            if (!isEurInputValid) {
              setInputAmountInEurError(true);
              return;
            }

            convertCurrency();
          }}
          action=""
        >
          <input
            onChange={(event) => {
              event.preventDefault();
              setInputAmountInEurError(false);

              const valueFromInput: string = event.target.value;

              console.log('valueFromInput:', valueFromInput);

              const numericValueFromInput: number = +valueFromInput;

              console.log('+event.target.value:', +event.target.value);

              if (numericValueFromInput < 0) {
                console.log('error in input');
                setInputAmountInEurError(true);
                return;
              }

              setInputAmountInEur(numericValueFromInput);
            }}
            value={inputAmountInEur || ''}
            name="amount-in-euro"
            placeholder="Euro amount"
            type="number"
          />

          <button disabled={!isEurInputValid} type="submit">
            Check amount in PLN
          </button>

          {inputAmountInEurError && <p>Please enter a valid number</p>}
        </form>

        {/* TODO */}
        {currencyExchangeFormError && (
          <p>Error occurred when getting exchange rate. Please try again</p>
        )}

        {!currencyExchangeFormError && convertedCurrencyRate !== null && (
          <div>Requested value in PLN: <span data-cy="converted-currency-rate">{convertedCurrencyRate}</span></div>
        )}
      </section>

      <section className='section-tile'>
        <h2>Make a Transaction</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();

            // Validate data
            if (!transactionAmount) {
              alert('Wrong transaction amount - not submittign the form!');
              return;
            }

            // Data is valid
            finaliseTransaction(transactionAmount);
          }}
          action=""
        >
          <input
            onChange={(event) => {
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
            }}
            value={transactionAmount || ''}
            placeholder='Euro amount'
            type="number"
          />

          <button type="submit">Make a transaction</button>
        </form>

        {transactionDetails && <p>Transaction completed!</p>}

        {transactionDetails && (
          <table>
            <thead>
              <tr>
                <th>Amount in PLN</th>
                <th>Amount in EUR</th>
                <th>Exchange rate EUR/PLN</th>
                <th>Time of transaction</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{transactionDetails.transaction_eur_amount}</td>
                <td>{transactionDetails.transaction_pln_amount}</td>
                <td>{transactionDetails.currenty_exchange_rate}</td>
                <td>{transactionDetails.timestamp}</td>
              </tr>
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
