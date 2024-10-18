'use client';

import { useState } from 'react';
import getTime from '../helpers/getTime';
import './UpdateRateForm.scss';

type Props = {
  exchangeRate: number;
  timestamp: string;
};

interface ExchangeRateData {exchangeRate: number, timestamp: string}

export default function UpdateRateForm({ exchangeRate, timestamp }: Props) {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [rateFetchError, setRateFetchError] = useState<null | Error>(null);

  const [updatedExchangeRate, setUpdatedExchangeRate] = useState<null | ExchangeRateData>(
    null
  );

  const LOCALHOST_API_URL =
    (process.env['NEXT_PUBLIC_LOCALHOST_API_URL'] || '') + '/rate';

  const handleRateUpdateSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setUpdatedExchangeRate(null);
    setIsUpdating(true);
    setRateFetchError(null);

    try {
      const response = await fetch(LOCALHOST_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          'Failed to update the exchange rate. Please try again.'
        );
      }

      const data: {exchange_rate: number} = await response.json();

      setUpdatedExchangeRate({
        exchangeRate: data.exchange_rate,
        timestamp: getTime()
      });
    } catch (error) {
      setRateFetchError(
        error instanceof Error
          ? error
          : new Error('Could not update the exchange rate. Please try again.')
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const exchangeRateData: ExchangeRateData = updatedExchangeRate ? updatedExchangeRate : {
    exchangeRate,
    timestamp
  }

  return (
    <>
      <p>
        Exchange rate:
        <span data-cy="exchange-rate">
          {exchangeRateData.exchangeRate}
        </span>
      </p>

      {!!timestamp && <p>Last exchange rate update: {exchangeRateData.timestamp}</p>}

      <form className='update-rate-form' onSubmit={handleRateUpdateSubmit}>
        <button
          className="button"
          disabled={isUpdating}
          type="submit"
        >
          {isUpdating
            ? 'Updating...'
            : 'Update Exchange rate'}
        </button>

        {!!rateFetchError && (
          <span className="rate-fetch-error">{rateFetchError.message}</span>
        )}
      </form>
    </>
  );
}
