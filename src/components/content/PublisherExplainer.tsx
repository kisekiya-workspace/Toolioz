import Link from 'next/link';

export function HomePublisherExplainer() {
  return (
    <section className="bg-[#fafafa] py-14 sm:py-16 dark:bg-[#0a0a0a]">
      <div className="mx-auto max-w-[760px] px-6">
        <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[#171717] sm:text-3xl dark:text-[#ededed]">
          What this site publishes
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Toolioz is a small independent publisher of browser calculators and file utilities. Each listed
          page is meant to complete one job: project an SIP, estimate income tax under a stated regime,
          format JSON, merge a PDF, or build a biodata. Pages that only repeat another tool with a
          different keyword are not added to the public directory.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          A published finance calculator shows the equation it uses, the inputs that change the result,
          and the limits of that result. For example, a monthly SIP of ₹5,000 for 10 years at a 12%
          annual rate, compounded monthly, invests ₹6,00,000 and finishes near ₹11.6 lakh before tax
          and expense ratios. That figure is a future-value of an annuity, not a promised mutual-fund
          return. Market returns vary, and equity LTCG rules in India should be checked against the
          current{' '}
          <a
            href="https://www.incometax.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0072F5] underline-offset-2 hover:underline"
          >
            Income Tax Department
          </a>{' '}
          guidance before a filing or investment decision.
        </p>
        <h3 className="mt-8 text-lg font-semibold text-[#171717] dark:text-[#ededed]">
          How a page is reviewed
        </h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          <li>The on-page formula is compared with the function in code for ordinary values, zeros, and invalid input.</li>
          <li>Assumptions such as compounding frequency, payment timing, currency, and tax year are written next to the result.</li>
          <li>Tax, loan, and investment outputs are labelled as planning estimates, not advice.</li>
          <li>
            File tools that are marked local processing keep the document in the browser. The website still loads
            ordinary page assets and analytics, which are described in the{' '}
            <Link href="/privacy-policy" className="text-[#0072F5] underline-offset-2 hover:underline">
              privacy policy
            </Link>
            .
          </li>
        </ul>
        <h3 className="mt-8 text-lg font-semibold text-[#171717] dark:text-[#ededed]">
          Where to start
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Use the{' '}
          <Link href="/finance/sip-calculator" className="text-[#0072F5] underline-offset-2 hover:underline">
            SIP calculator
          </Link>{' '}
          for monthly mutual-fund projections, the{' '}
          <Link href="/finance/income-tax" className="text-[#0072F5] underline-offset-2 hover:underline">
            income-tax calculator
          </Link>{' '}
          for a stated-year estimate, the{' '}
          <Link href="/devtools/json-formatter" className="text-[#0072F5] underline-offset-2 hover:underline">
            JSON formatter
          </Link>{' '}
          for parse errors, or the{' '}
          <Link href="/pdftools/merge-pdf" className="text-[#0072F5] underline-offset-2 hover:underline">
            PDF merge
          </Link>{' '}
          tool for combining files. Step-by-step write-ups live in the{' '}
          <Link href="/how-to" className="text-[#0072F5] underline-offset-2 hover:underline">
            how-to library
          </Link>
          . Correction requests go to{' '}
          <Link href="/contact" className="text-[#0072F5] underline-offset-2 hover:underline">
            contact
          </Link>{' '}
          or{' '}
          <a href="mailto:support@toolioz.com" className="text-[#0072F5] underline-offset-2 hover:underline">
            support@toolioz.com
          </a>
          . The{' '}
          <Link href="/editorial-policy" className="text-[#0072F5] underline-offset-2 hover:underline">
            editorial policy
          </Link>{' '}
          explains selection, sources, and updates.
        </p>
      </div>
    </section>
  );
}

export function FinancePublisherExplainer() {
  return (
    <section className="border-t border-zinc-200 bg-white py-14 sm:py-16 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="text-2xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50">
          How to choose a finance calculator
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          The finance workspace is limited to investment, tax, loan, and everyday money-math tools that
          have a documented formula. SIP, lumpsum, and retirement pages project future value from a
          stated rate. FD pages use a deposit rate and tenure. EMI and prepayment pages amortize a
          principal. GST and income-tax pages apply a published rate or slab for a labelled year. They
          are not substitutes for a bank statement, an AMFI scheme document, or a return prepared by a
          tax professional.
        </p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Percentage increase, reverse percentage, and after-tax discount sit here because they answer
          price, salary, and invoice questions. Sports records, school grades, and body-composition
          estimates are not part of this catalog.
        </p>
        <h3 className="mt-8 text-lg font-bold text-zinc-950 dark:text-zinc-50">Worked SIP check</h3>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Future value of a month-end SIP uses M = P × [((1 + i)^n − 1) / i] × (1 + i), where P is the
          monthly amount, i is the annual rate divided by 12, and n is the number of months. With P =
          5,000, a 12% annual rate, and n = 120, invested capital is 6,00,000 and the projected value is
          about 11.61 lakh before tax. Changing the rate to 10% drops the same plan to about 10.33 lakh.
          That sensitivity is why every result on Toolioz is tied to the inputs on the page, not to a
          generic “expected return.”
        </p>
        <p className="mt-4 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
          Primary references for Indian users include the{' '}
          <a
            href="https://www.incometax.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
          >
            Income Tax Department
          </a>
          ,{' '}
          <a
            href="https://www.amfiindia.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400"
          >
            AMFI
          </a>{' '}
          for mutual-fund industry data, and lender rate sheets for EMI examples. When a rule changes,
          the calculator copy is dated and should be read against the official source. Report a mismatch
          through the{' '}
          <Link href="/contact" className="text-blue-600 underline-offset-2 hover:underline dark:text-blue-400">
            contact page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
