import { Button, Card, Row } from "antd";
import React from "react";
import "./Cards.css";

export default function Cards({
    showIncomeModal,
    showExpenseModal,
    income,
    expense,
    currentBalance,
}) {

  return (
    <div>
      <Row className="my-row">
        <Card className="my-card" title="Current Balance" >
          <p>₹ {currentBalance}</p>
          <Button type="primary" >Reset Balance</Button>
        </Card>
        <Card className="my-card" title="Income">
          <p>₹ {income}</p>
          <Button type="primary" onClick={showIncomeModal} >Add Income</Button>
        </Card>
        <Card className="my-card" title="Expenses">
          <p>₹ {expense}</p>
          <Button type="primary" onClick={showExpenseModal} >Add Expenses</Button>
        </Card>
      </Row>
    </div>
  );
}
