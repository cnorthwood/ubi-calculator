import React, { FunctionComponent } from "react";
import { TaxBand } from "./data";
import NewTaxBand from "./NewTaxBand";

interface TaxBandEditorProps {
  taxBands: TaxBand[];
  onChange: (taxBands: TaxBand[]) => void;
}

const TaxBandEditor: FunctionComponent<TaxBandEditorProps> = ({ taxBands, onChange }) => (
  <table className="table is-fullwidth">
    <thead>
      <tr>
        <th scope="col">Tax rate</th>
        <th scope="col">Band start</th>
        <th scope="col">Band end</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {taxBands.map((taxBand, i) => (
        <tr key={i}>
          <td>
            <div className="control has-icons-right">
              <input
                className="input"
                type="number"
                min={0}
                max={100}
                value={Math.round(taxBand.rate * 100)}
                onChange={(ev) => {
                  const newTaxBands = taxBands.map((taxBand) => ({ ...taxBand }));
                  newTaxBands[i].rate = parseInt(ev.currentTarget.value, 10) / 100;
                  onChange(newTaxBands);
                }}
              />

              <span className="icon is-small is-right">%</span>
            </div>
          </td>
          <td>
            <div className="control has-icons-left">
              <input
                className="input"
                type="number"
                value={taxBand.bandStart}
                min={taxBands[i - 1]?.bandStart ?? 0}
                max={taxBands[i].bandEnd}
                onChange={(ev) => {
                  const newTaxBands = taxBands.map((taxBand) => ({ ...taxBand }));
                  newTaxBands[i].bandStart = parseInt(ev.currentTarget.value, 10);
                  if (i > 0) {
                    newTaxBands[i - 1].bandEnd = newTaxBands[i].bandStart;
                  }
                  onChange(newTaxBands);
                }}
              />
              <span className="icon is-small is-left">£</span>
            </div>
          </td>
          <td>
            {i < taxBands.length - 1 ? (
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="number"
                  value={taxBand.bandEnd}
                  onChange={(ev) => {
                    const newTaxBands = taxBands.map((taxBand) => ({ ...taxBand }));
                    newTaxBands[i].bandEnd = parseInt(ev.currentTarget.value, 10);
                    newTaxBands[i + 1].bandStart = newTaxBands[i].bandEnd!;
                    onChange(newTaxBands);
                  }}
                />
                <span className="icon is-small is-left">£</span>
              </div>
            ) : null}
          </td>
          <td>
            <button
              className="delete"
              title="remove band"
              onClick={() => {
                const newTaxBands = taxBands.filter((_, j) => i !== j);
                if (newTaxBands.length > 1) {
                  newTaxBands[newTaxBands.length - 1].bandEnd = undefined;
                }
                onChange(newTaxBands);
              }}
            />
          </td>
        </tr>
      ))}
      <NewTaxBand
        onAdd={(newTaxBand: TaxBand) => {
          const newTaxBands = taxBands.map((taxBand) => ({ ...taxBand }));
          if (taxBands.some((taxBand) => taxBand.bandStart === newTaxBand.bandStart)) {
            newTaxBands.find((taxBand) => taxBand.bandStart === newTaxBand.bandStart)!.rate =
              newTaxBand.rate;
          } else {
            newTaxBands.push(newTaxBand);
            newTaxBands.sort((a, b) => a.bandStart - b.bandStart);
            const newIndex = newTaxBands.findIndex(
              (taxBand) => taxBand.bandStart === newTaxBand.bandStart,
            )!;
            if (newIndex < newTaxBands.length - 1) {
              newTaxBand.bandEnd = newTaxBands[newIndex + 1].bandStart;
            }
            if (newIndex > 0) {
              newTaxBands[newIndex - 1].bandEnd = newTaxBand.bandStart;
            }
          }
          onChange(newTaxBands);
        }}
      />
    </tbody>
  </table>
);

export default TaxBandEditor;
