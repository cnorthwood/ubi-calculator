import React, { FunctionComponent, useState } from "react";
import { TaxBand } from "./data";

const NewTaxBand: FunctionComponent<{ onAdd: (taxBand: TaxBand) => void }> = ({ onAdd }) => {
  const [newRate, setNewRate] = useState<number>(0);
  const [newStartBand, setNewStartBand] = useState<number>(0);

  return (
    <tr>
      <td>
        <div className="control has-icons-right">
          <input
            className="input"
            type="number"
            min={0}
            max={100}
            value={newRate}
            onChange={(ev) => {
              setNewRate(parseInt(ev.currentTarget.value, 10));
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
            value={newStartBand}
            onChange={(ev) => {
              setNewStartBand(parseInt(ev.currentTarget.value, 10));
            }}
          />
          <span className="icon is-small is-left">£</span>
        </div>
      </td>
      <td />
      <td>
        <button
          className="button is-text"
          title="add band"
          onClick={() => {
            onAdd({ rate: newRate / 100, bandStart: newStartBand });
            setNewRate(0);
            setNewStartBand(0);
          }}
        >
          ➕
        </button>
      </td>
    </tr>
  );
};

export default NewTaxBand;
