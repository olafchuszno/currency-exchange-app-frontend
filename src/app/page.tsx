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

  const getExchangeRate = () => {
    fetch('/api/exchange-rate')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log('--- data:', data.exchange_rate);
        console.log('--- data:', data);
        setExchangeRate(data.exchange_rate)
      })
      .catch(() => console.error('Error fetching exchange data'));
  };

  const convertCurrency = () => {
    fetch('/api/exchange-rate')
      .then((response) => {
        console.log('next internal api response:', response);
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

  // const makeTransaction = () => {
  //   fetch('/api/transaction', {
  //     method: 'post',
  //   })
  //     .then((response) => {
  //       console.log('next internal api response:', response);
  //       return response.json();
  //     })
  //     .then((data) => {
  //       console.log('data in makeTransaction:', data)
  //     })
  //     .catch(() => {
  //       console.log('error in makeTransaction function')
  //     });
  // };

  // const getTransactionFinalAmount = () => {
  //   fetch('http://localhost:3030/transaction', {
  //     method: 'post',
  //     body: JSON.stringify({
  //       amountToExchange: 100,
  //       currency: 'EUR'
  //     })
  //   })
  //     .then(response => response.json())
  //     .then(data => console.log('data:', data));
  // }

  const getTransactionCheck = () => {
    fetch('/api/transaction')
      .then(response => {
        return response.json()
      })
      .then(data => console.log('transaction returned:', data.response));
  }

  useEffect(() => {
    getExchangeRate();

    getTransactionCheck();

    // const exchangeFetchInterval = setInterval(getExchangeRate, 10000);

    // return () => clearInterval(exchangeFetchInterval);
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
              console.log('Please enter a valid amount');
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
        {/* <button onClick={() => makeTransaction()}>Make a transaction</button> */}
      </section>
    </main>
  );
}
