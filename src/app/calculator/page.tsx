'use server';

import { CalculatorForm } from './CalculatorForm';
import './page.scss';
import '../styles/main.scss';

const RATE_API_URL: string =
  (process.env['NEXT_PUBLIC_LOCALHOST_API_URL'] || '') + '/rate';

export default async function Page() {
  return (
    <main className="main">
      <h2 className="title title--2">Conversion calculator</h2>

      <p className='main__exchange'>EUR/PLN</p>

      <CalculatorForm rateApiUrl={RATE_API_URL} />
    </main>
  );
}
