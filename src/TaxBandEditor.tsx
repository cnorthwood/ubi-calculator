import React, { FunctionComponent } from "react";
import { TaxBand } from "./data";
import NewTaxBand from "./NewTaxBand";

interface TaxBandEditorProps {
  taxBands: TaxBand[];
  onChange: (taxBands: TaxBand[]) => void;
}

const TaxBandEditor: FunctionComponent<TaxBandEditorProps> = ({ taxBands, onChange }) => (
  <div className="table-container">
    <table className="table is-fullwidth">
      <thead>
        <tr>
          <th scope="col">Tax rate</th>
          <th scope="col">Threshold</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {taxBands.map((taxBand, i) => (
          <tr key={taxBand.id}>
            <td>
              <div className="control has-icons-right">
                <input
                  className="input"
                  style={{ minWidth: "6em" }}
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
                  style={{ minWidth: "8em" }}
                  type="number"
                  step={100}
                  value={taxBand.threshold}
                  onChange={(ev) => {
                    const newTaxBands = taxBands.map((taxBand) => ({ ...taxBand }));
                    newTaxBands[i].threshold = parseInt(ev.currentTarget.value, 10);
                    newTaxBands.sort((a, b) => a.threshold - b.threshold);
                    onChange(newTaxBands);
                  }}
                />
                <span className="icon is-small is-left">£</span>
              </div>
            </td>
            <td>
              <button
                className="delete"
                title="remove band"
                onClick={() => {
                  const newTaxBands = taxBands.filter((_, j) => i !== j);
                  onChange(newTaxBands);
                }}
              />
            </td>
          </tr>
        ))}
        <NewTaxBand
          onAdd={(newTaxBand: TaxBand) => {
            const newTaxBands = taxBands.map((taxBand) => ({ ...taxBand }));
            if (taxBands.some((taxBand) => taxBand.threshold === newTaxBand.threshold)) {
              newTaxBands.find((taxBand) => taxBand.threshold === newTaxBand.threshold)!.rate =
                newTaxBand.rate;
            } else {
              newTaxBands.push(newTaxBand);
              newTaxBands.sort((a, b) => a.threshold - b.threshold);
            }
            onChange(newTaxBands);
          }}
        />
      </tbody>
    </table>
  </div>
);

export default TaxBandEditor;
