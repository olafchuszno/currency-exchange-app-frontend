'use client';

import { useEffect, useMemo, useState } from 'react';

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
  const [transactionFinalAmount, setTransactionFinalAmount] = useState<number | null>(null)

  const getExchangeRate = () => {
    fetch('/api/exchange-rate')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setExchangeRate(data.exchange_rate)
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
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({transaction_amount: transactionAmount}),
    })
      .then(response => response.json())
      .then(data => setTransactionFinalAmount(data.transaction_amount as number));
  }

  useEffect(() => {
    getExchangeRate();

    const exchangeFetchInterval = setInterval(getExchangeRate, 1000);

    return () => clearInterval(exchangeFetchInterval);
  }, []);

  // useEffect(() => {
  //   // When exchange rate changes we want to change the form result
  // }, [exchangeRate]);

  const isEurInputValid = useMemo(() => {
    return inputAmountInEur && inputAmountInEur >= 0;
  }, [inputAmountInEur]);

  return (
    <main>
      <section>
        <h1>Hello, my first Next.js app!</h1>
        <p>Exchange rate: {exchangeRate}</p>
      </section>

      <section style={{ border: '1px solid red', marginTop: '36px' }}>
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

              // if (valueFromInput[0] === '0' && valueFromInput[1] !== ',') {
              //   valueFromInput = valueFromInput.slice(1);
              // }

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
            placeholder="Enter an amount in EUR"
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
          <p>Requested value in PLN: {convertedCurrencyRate}</p>
        )}
      </section>

      <section>
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
            type="number"
          />

          <button type="submit">Make a transaction</button>
        </form>

        <div>transaction final amount: {transactionFinalAmount}</div>
      </section>
    </main>
  );
}
