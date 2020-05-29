import React, { FunctionComponent } from "react";

const TakeHomeComparison: FunctionComponent<{
  income: number;
  newTakeHome: number;
  oldTakeHome: number;
  label?: string;
}> = ({ income, oldTakeHome, newTakeHome, label }) => (
  <tr>
    <td>
      £{income.toLocaleString()}
      {label ? <span className="help">{label}</span> : null}
    </td>
    <td>£{Math.round(oldTakeHome).toLocaleString()}</td>
    <td>
      £{Math.round(newTakeHome).toLocaleString()}
      <div className="is-hidden-mobile">
        {newTakeHome > oldTakeHome ? (
          <span className="tag is-medium is-success">
            £{Math.round(newTakeHome - oldTakeHome)} better off
          </span>
        ) : (
          <span className="tag is-medium is-danger">
            £{Math.round(oldTakeHome - newTakeHome)} worse off
          </span>
        )}
      </div>
    </td>
  </tr>
);

export default TakeHomeComparison;
