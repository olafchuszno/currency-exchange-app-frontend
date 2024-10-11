'use client';

import { useEffect, useMemo, useState } from 'react';
import { TransactionData } from '@/pages/api/transaction';
import { TransactionsTable } from './components/TransactionsTable/TransactionsTable';
import { getFixedFloatingPointNumber } from './helpers/getFixedFloatingPointNumber';
import getTime from './helpers/getTime';
import './page.scss';

export interface TransactionDataToNextApi {
  transaction_eur_amount: number;
}

interface TransactionError {
  message: string;
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

  const [transactionAmount, setTransactionAmount] = useState<number | null>(
    null
  );
  const [forecastedTransactionPlnAmount, setForecastedTransactionPlnAmount] =
    useState<number | null>(null);
  const [transactionDetails, setTransactionDetails] =
    useState<TransactionData | null>(null);
  const [transactionError, setTransactionError] =
    useState<TransactionError | null>(null);

  const [isFinalisingTransaction, setIsFinalisingTransaction] = useState(false);

  const [lastCurrencyRateUpdateTimestamp, setLastCurrencyRateUpdateTimestamp] =
    useState<string | null>(null);

  const [allTransactions, setAllTransactions] = useState<
    null | TransactionData[]
  >(null);
  const [isFetchingAllTransactions, setIsFetchingAllTransactions] =
    useState<boolean>(false);
  const [fetchAllTransactionError, setFetchAllTransactionError] =
    useState<boolean>(false);

  useEffect(() => {
    if (transactionAmount && exchangeRate) {
      setForecastedTransactionPlnAmount(
        getFixedFloatingPointNumber(transactionAmount * exchangeRate)
      );
    } else {
      setForecastedTransactionPlnAmount(null);
    }
  }, [exchangeRate, transactionAmount]);

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
        setConvertedCurrencyRate(roundedExchangedAmount);
      })
      .catch(() => {
        setCurrencyExchangeFormError(true);
        return null;
      });
  };

  const getAllTransactions = () => {
    setIsFetchingAllTransactions(true);
    setFetchAllTransactionError(false);

    fetch('/api/transaction')
      .then((response) => response.json())
      .then((transactionsResponse: { transactions: TransactionData[] }) => {
        setAllTransactions(transactionsResponse.transactions);
      })
      .catch(() => {
        setFetchAllTransactionError(true);
      })
      .finally(() => {
        setIsFetchingAllTransactions(false);
      });
  };

  const finaliseTransaction = (transactionAmount: number) => {
    setTransactionDetails(null);
    setIsFinalisingTransaction(true);

    fetch('/api/transaction', {
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

  useEffect(() => {
    getExchangeRate();

    const exchangeFetchInterval = setInterval(getExchangeRate, 10000);

    return () => clearInterval(exchangeFetchInterval);
  }, []);

  const isEurInputValid = useMemo(() => {
    return inputAmountInEur && inputAmountInEur >= 0;
  }, [inputAmountInEur]);

  const handleExchangeRateInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setInputAmountInEurError(false);
    const valueFromInput: string = event.target.value;

    const numericValueFromInput: number = +valueFromInput;

    if (numericValueFromInput < 0) {
      setInputAmountInEurError(true);

      return;
    }
    setInputAmountInEur(numericValueFromInput);
  }

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
      <section className="section-tile">
        <h2 className="title title--2">Exchange rate</h2>

        <p>
          Exchange rate: <span data-cy="exchange-rate">{exchangeRate}</span>
        </p>

        {lastCurrencyRateUpdateTimestamp && (
          <p>Last exchange rate update: {lastCurrencyRateUpdateTimestamp}</p>
        )}

        <div>
          <button className='button' onClick={() => getExchangeRate()}>
            Update Exchange rate
          </button>
        </div>
      </section>

      <section className="section-tile">
        <h2 className="title title--2">Conversion calculator</h2>

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
          <div className='button-pair'>
            <input
              onChange={handleExchangeRateInputChange}
              value={inputAmountInEur || ''}
              name="amount-in-euro"
              placeholder="Euro amount"
              type="number"
              className='button-pair__child'
            />
            <button className='button button-pair__child' disabled={!isEurInputValid} type="submit">
              Check amount in PLN
            </button>
            {!isEurInputValid && <p>Option is disabled until a correct amount is provided</p>}
          </div>

          {inputAmountInEurError && <p>Please enter a valid number</p>}
        </form>

        {currencyExchangeFormError && (
          <p>Error occurred when getting exchange rate. Please try again</p>
        )}

        {!currencyExchangeFormError && convertedCurrencyRate !== null && (
          <div>
            Requested value in PLN:{' '}
            <span data-cy="converted-currency-rate">
              {convertedCurrencyRate}
            </span>
          </div>
        )}
      </section>

      <section className="section-tile">
        <h2 className="title title--2">Make a Transaction</h2>

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

        {forecastedTransactionPlnAmount &&
          !transactionDetails &&
          !isFinalisingTransaction && (
            <div>
              <p>Forecasted amonut in PLN: {forecastedTransactionPlnAmount}</p>
              <p>(exchange rate is fluctuating and is likely to change)</p>
            </div>
          )}

        {isFinalisingTransaction && <p>Finalising the transaction...</p>}

        {transactionError && (
          <p>{transactionError.message}. Please try again.</p>
        )}

        {transactionDetails && <p>Transaction completed!</p>}

        {transactionDetails && (
          <TransactionsTable shortenedHeaders={true} transactions={[transactionDetails]} />
        )}
      </section>

      <section className="section-tile">
        <h2 className="title title--2">All Transactions</h2>

        {fetchAllTransactionError && <p>Error fetching transactions.</p>}

        {!isFetchingAllTransactions &&
          !!allTransactions &&
          !allTransactions.length && <p>No transactions yet.</p>}

        <div>
          <button className='button'
            onClick={() => {
              getAllTransactions();
            }}
          >
            Get all transactions
          </button>{' '}
          {isFetchingAllTransactions && <span>Fetching transactions...</span>}
        </div>

        {allTransactions?.length && (
          <TransactionsTable transactions={allTransactions} />
        )}
      </section>
    </main>
  );
}
