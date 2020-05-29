import React, { FunctionComponent, useState } from "react";
import { id, TaxBand } from "./data";

const NewTaxBand: FunctionComponent<{ onAdd: (taxBand: TaxBand) => void }> = ({ onAdd }) => {
  const [rate, setRate] = useState<number>(0);
  const [threshold, setThreshold] = useState<number>(0);

  return (
    <tr>
      <td>
        <div className="control has-icons-right">
          <input
            className="input"
            style={{ minWidth: "6em" }}
            type="number"
            min={0}
            max={100}
            value={rate}
            onChange={(ev) => {
              setRate(parseInt(ev.currentTarget.value, 10));
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
            value={threshold}
            onChange={(ev) => {
              setThreshold(parseInt(ev.currentTarget.value, 10));
            }}
          />
          <span className="icon is-small is-left">£</span>
        </div>
      </td>
      <td>
        <button
          className="button is-white is-paddingless"
          title="add band"
          onClick={() => {
            onAdd({ id: id(), rate: rate / 100, threshold });
            setRate(0);
            setThreshold(0);
          }}
        >
          ➕
        </button>
      </td>
    </tr>
  );
};

export default NewTaxBand;
