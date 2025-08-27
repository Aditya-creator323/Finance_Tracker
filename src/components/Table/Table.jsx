import React from "react";
import "./Table.css";

export default function Table({ tableData }) {
  return (
    <div>
      <h2>Transaction Details</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Tag</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.amount}</td>
              <td>{item.date}</td>
              <td>{item.tag}</td>
              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
