import React, { useState } from "react";
import {
  CURRENT_TAX_BANDS,
  DEMO_SALARIES,
  LIVING_WAGE,
  NI_ABOVE_UPPER_RATE,
  NI_PRIMARY_RATE,
  NI_PRIMARY_THRESHOLD,
  NI_SECONDARY_RATE,
  NI_SECONDARY_THRESHOLD,
  NI_UPPER_EARNINGS_LIMIT,
  NUM_UK_TAXPAYERS,
  PERCENTILES,
  POPULATION_OF_UK,
  SPENDING,
  TaxBand,
  TAXES,
} from "./data";
import TaxBandEditor from "./TaxBandEditor";

function taxPayable(income: number, rate: number, bandStart: number, bandEnd?: number) {
  const incomeOverThreshold = income - bandStart;
  return Math.max(
    0,
    (bandEnd ? Math.min(bandEnd - bandStart, incomeOverThreshold) : incomeOverThreshold) * rate,
  );
}

function currentTakeHome(income: number) {
  const weekly = income / 52;
  const nationalInsurance =
    Math.min(Math.max(0, weekly - NI_PRIMARY_THRESHOLD), NI_UPPER_EARNINGS_LIMIT) *
      NI_PRIMARY_RATE +
    Math.max(0, weekly - NI_UPPER_EARNINGS_LIMIT) * NI_ABOVE_UPPER_RATE;
  const incomeTax =
    CURRENT_TAX_BANDS.reduce(
      (a, { rate, bandStart, bandEnd }) => a + taxPayable(income, rate, bandStart, bandEnd),
      0,
    ) / 52;
  return weekly - nationalInsurance - incomeTax;
}

function newGrossIncome(income: number, weeklyUbiAmount: number) {
  const nationalInsurance = Math.max(0, income / 52 - NI_SECONDARY_THRESHOLD) * NI_SECONDARY_RATE;
  return income + (weeklyUbiAmount + nationalInsurance) * 52;
}

function newTakeHome(income: number, weeklyUbiAmount: number, taxBands: TaxBand[]) {
  const newGross = newGrossIncome(income, weeklyUbiAmount);
  const incomeTax = taxBands.reduce(
    (a, { rate, bandStart, bandEnd }) => a + taxPayable(newGross, rate, bandStart, bandEnd),
    0,
  );
  return (newGross - incomeTax) / 52;
}

function incomeTaxRaised(
  medianIncome: number,
  numberOfPeople: number,
  weeklyUbiAmount: number,
  taxBands: TaxBand[],
) {
  const newGross = newGrossIncome(medianIncome, weeklyUbiAmount);
  const incomeTax = taxBands.reduce(
    (a, { rate, bandStart, bandEnd }) => a + taxPayable(newGross, rate, bandStart, bandEnd),
    0,
  );
  return incomeTax * numberOfPeople;
}

const App = () => {
  const [ubiAmount, setUbiAmount] = useState<number>(LIVING_WAGE);
  const [ukPopulation, setUkPopulation] = useState<number>(POPULATION_OF_UK);
  const [taxBands, setTaxBands] = useState<TaxBand[]>([
    { bandStart: 0, bandEnd: 37_500, rate: 0.32 },
    { bandStart: 37_500, bandEnd: 137_500, rate: 0.52 },
    { bandStart: 137_500, rate: 0.57 },
  ]);
  const [showTaxBandNotice, setShowTaxBandNotice] = useState<boolean>(true);
  const [showUbiNotice, setShowUbiNotice] = useState<boolean>(true);

  const costOfUbi = ubiAmount * 52 * ukPopulation;
  const newIncomeTaxRaised = PERCENTILES.reduce(
    (a, medianIncome) =>
      a + incomeTaxRaised(medianIncome, NUM_UK_TAXPAYERS / 100, ubiAmount, taxBands),
    0,
  );

  const balance =
    Object.values(TAXES).reduce((a, value) => a + value, 0) -
    Object.values(SPENDING).reduce((a, value) => a + value, 0) -
    costOfUbi +
    newIncomeTaxRaised;

  return (
    <div className="columns">
      <div className="column is-half">
        <div className="field">
          <label className="label" htmlFor="ubi-amount">
            Weekly UBI payment
          </label>
          <div className="control has-icons-left">
            <input
              id="ubi-amount"
              className="input"
              type="number"
              value={ubiAmount}
              step={0.01}
              onChange={(ev) => {
                const value = parseFloat(ev.currentTarget.value);
                setShowUbiNotice(false);
                setUbiAmount(isNaN(value) ? 0 : value);
              }}
            />
            <span className="icon is-small is-left">£</span>
          </div>
          <p className="help">
            The Real Living Wage in the UK is currently £{LIVING_WAGE.toLocaleString()} per week.
          </p>
        </div>
        {showUbiNotice ? (
          <div className="notification is-info">
            The default level of UBI is set to equal the full-time income of someone working on the
            Living Wage. Try changing it.
          </div>
        ) : null}
        <div className="field">
          <label className="label" htmlFor="population">
            Eligible population
          </label>
          <div className="control">
            <input
              id="population"
              className="input"
              type="number"
              value={ukPopulation}
              onChange={(ev) => {
                setUkPopulation(parseInt(ev.currentTarget.value));
              }}
            />
          </div>
          <p className="help">
            The estimated number of adults over 18 in the UK is {POPULATION_OF_UK.toLocaleString()}
          </p>
        </div>
        <div className="field">
          <h2 className="label">Tax Bands</h2>
          <TaxBandEditor
            taxBands={taxBands}
            onChange={(newTaxBands) => {
              setShowTaxBandNotice(false);
              setTaxBands(newTaxBands);
            }}
          />
          {showTaxBandNotice ? (
            <div className="notification is-info">
              The default tax bands are based around today's tax bands with National Insurance.
              Experiment to raise more money to plug the deficit!
            </div>
          ) : null}
        </div>
        <div className="field">
          <h2 className="label">Tax Revenue</h2>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Income Tax</strong>
                </td>
                <td>£{newIncomeTaxRaised.toLocaleString()}</td>
              </tr>
              {Object.entries(TAXES).map(([desc, value]) => (
                <tr key={desc}>
                  <td>{desc}</td>
                  <td>£{value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="field">
          <h2 className="label">Government Spending</h2>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th scope="col">Item</th>
                <th scope="col">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Universal Basic Income</strong>
                </td>
                <td>£{costOfUbi.toLocaleString()}</td>
              </tr>
              {Object.entries(SPENDING).map(([desc, value]) => (
                <tr key={desc}>
                  <td>{desc}</td>
                  <td>£{value.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="column is-half">
        <div className="field">
          <h2 className="label">Budget balance</h2>
          <div
            className={`button is-large ${balance < 0 ? "is-danger" : "is-success"} is-fullwidth`}
          >
            {balance < 0 ? "-£" : "£"}
            {Math.round(Math.abs(balance)).toLocaleString()}
          </div>
        </div>
        <div className="field">
          <h2 className="label">Takehome comparisons</h2>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th scope="col">Current Annual Salary</th>
                <th scope="col">Current Weekly Takehome</th>
                <th scope="col">New Weekly Takehome</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  £4,918{" "}
                  <span className="help">
                    Universal Credit standard allowance - replaced by UBI
                  </span>
                </td>
                <td>£{Math.round(currentTakeHome(4918)).toLocaleString()}</td>
                <td
                  className={
                    newTakeHome(0, ubiAmount, taxBands) > currentTakeHome(4918)
                      ? "has-text-success"
                      : "has-text-danger"
                  }
                >
                  £{Math.round(newTakeHome(0, ubiAmount, taxBands)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  £9,110 <span className="help">Full State Pension - replaced by UBI</span>
                </td>
                <td>£{Math.round(currentTakeHome(9110)).toLocaleString()}</td>
                <td
                  className={
                    newTakeHome(0, ubiAmount, taxBands) > currentTakeHome(9110)
                      ? "has-text-success"
                      : "has-text-danger"
                  }
                >
                  £{Math.round(newTakeHome(0, ubiAmount, taxBands)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  £17,000 <span className="help">Full time on minimum wage</span>
                </td>
                <td>£{Math.round(currentTakeHome(17000)).toLocaleString()}</td>
                <td
                  className={
                    newTakeHome(17000, ubiAmount, taxBands) > currentTakeHome(17000)
                      ? "has-text-success"
                      : "has-text-danger"
                  }
                >
                  £{Math.round(newTakeHome(17000, ubiAmount, taxBands)).toLocaleString()}
                </td>
              </tr>
              {DEMO_SALARIES.map((val, i) => (
                <tr key={val}>
                  <td>
                    £{val.toLocaleString()}
                    {i > 0 &&
                    DEMO_SALARIES[i - 1] < PERCENTILES[50] &&
                    DEMO_SALARIES[i] > PERCENTILES[50] ? (
                      <span className="help">Top 50%</span>
                    ) : null}
                  </td>
                  <td>£{Math.round(currentTakeHome(val)).toLocaleString()}</td>
                  <td
                    className={
                      newTakeHome(val, ubiAmount, taxBands) > currentTakeHome(val)
                        ? "has-text-success"
                        : "has-text-danger"
                    }
                  >
                    £{Math.round(newTakeHome(val, ubiAmount, taxBands)).toLocaleString()}
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  £75,300 <span className="help">Top 5%</span>
                </td>
                <td>£{Math.round(currentTakeHome(75300)).toLocaleString()}</td>
                <td
                  className={
                    newTakeHome(75300, ubiAmount, taxBands) > currentTakeHome(75300)
                      ? "has-text-success"
                      : "has-text-danger"
                  }
                >
                  £{Math.round(newTakeHome(75300, ubiAmount, taxBands)).toLocaleString()}
                </td>
              </tr>
              <tr>
                <td>
                  £166,000 <span className="help">Top 1%</span>
                </td>
                <td>£{Math.round(currentTakeHome(166000)).toLocaleString()}</td>
                <td
                  className={
                    newTakeHome(166000, ubiAmount, taxBands) > currentTakeHome(166000)
                      ? "has-text-success"
                      : "has-text-danger"
                  }
                >
                  £{Math.round(newTakeHome(166000, ubiAmount, taxBands)).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
          <p className="help">
            This assumes all salary is paid by PAYE and is based on standard income tax thresholds
            in England. The income tax thresholds assume employer's NI is scrapped and incorporated
            into the wage/salary. It also does not take into account the current income tax taper
            for high earners.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;
