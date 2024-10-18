'use client';

import { useMemo, useState } from "react";

export const CalculatorForm = ({rateApiUrl}: {rateApiUrl: string}) => {
  const [currencyExchangeFormError, setCurrencyExchangeFormError] =
  useState<boolean>(false);

const [convertedCurrencyRate, setConvertedCurrencyRate] = useState<
  {eur: number, pln: number, exchangeRate: number} | null
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
  fetch(rateApiUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if (!inputAmountInEur) {
        return;
      }

      const exchangedAmount =
        +data.exchange_rate * inputAmountInEur;
      const roundedExchangedAmount = Math.round(exchangedAmount * 100) / 100;

      if (Number.isNaN(roundedExchangedAmount)) {
        throw new Error('Could not get the converted currency amount');
      }

      setConvertedCurrencyRate({
        eur: inputAmountInEur,
        pln: roundedExchangedAmount,
        exchangeRate: +data.exchange_rate,
      });
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
    <>
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
              Convert to PLN
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
            <span data-cy="converted-currency-rate">{convertedCurrencyRate.pln}</span>
            <p>(Converted {convertedCurrencyRate.eur} EUR with rate EUR/PLN = {convertedCurrencyRate.exchangeRate})</p>
          </div>
      )}
    </>
  )

}
