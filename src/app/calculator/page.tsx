'use client';

import { useMemo, useState } from 'react';
import '../styles/main.scss';

const RATE_API_URL: string =
  (process.env['NEXT_PUBLIC_LOCALHOST_API_URL'] || '') + '/rate';

export default function Page() {
  const [currencyExchangeFormError, setCurrencyExchangeFormError] =
    useState<boolean>(false);

  const [convertedCurrencyRate, setConvertedCurrencyRate] = useState<
    number | null
  >(null);

  const [inputAmountInEur, setInputAmountInEur] = useState<number | null>(null);
  const [inputAmountInEurError, setInputAmountInEurError] =
    useState<boolean>(false);

  const handleExchangeRateInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    setInputAmountInEurError(false);
    const valueFromInput: string = event.target.value;

    const numericValueFromInput: number = +valueFromInput;

    if (numericValueFromInput < 0) {
      setInputAmountInEurError(true);

      return;
    }
    setInputAmountInEur(numericValueFromInput);
  };

  const convertCurrency = () => {
    fetch(RATE_API_URL)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const exchangedAmount =
          +data.exchange_rate * (inputAmountInEur as number);
        const roundedExchangedAmount = Math.round(exchangedAmount * 100) / 100;

        if (Number.isNaN(roundedExchangedAmount)) {
          throw new Error('Could not get the converted currency amount');
        }

        setConvertedCurrencyRate(roundedExchangedAmount);
      })
      .catch(() => {
        setCurrencyExchangeFormError(true);
        return null;
      });
  };

  const isEurInputValid = useMemo(() => {
    return inputAmountInEur && inputAmountInEur >= 0;
  }, [inputAmountInEur]);

  return (
    <main className="main">
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
      >
        <div className="button-pair">
          <input
            onChange={handleExchangeRateInputChange}
            value={inputAmountInEur || ''}
            name="amount-in-euro"
            placeholder="Euro amount"
            type="number"
            className="button-pair__child"
          />
          <button
            className="button button-pair__child"
            disabled={!isEurInputValid}
            type="submit"
          >
            Check amount in PLN
          </button>
          {!isEurInputValid && (
            <p>Option is disabled until a correct amount is provided</p>
          )}
        </div>

        {inputAmountInEurError && <p>Please enter a valid number</p>}
      </form>

      {currencyExchangeFormError && (
        <p>Error occurred when getting exchange rate. Please try again</p>
      )}

      {!currencyExchangeFormError && convertedCurrencyRate !== null && (
        <div>
          Requested value in PLN:{' '}
          <span data-cy="converted-currency-rate">{convertedCurrencyRate}</span>
        </div>
      )}
    </main>
  );
}
