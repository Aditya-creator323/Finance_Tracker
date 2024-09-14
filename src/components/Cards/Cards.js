import { Button, Card, Row, Col } from "antd";
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
    <div className="cards-container">
      <Row gutter={[16, 16]} className="my-row">
        <Col xs={24} md={8}>
          <Card className="my-card current-balance" title="Current Balance">
            <p className="balance-amount">₹ {currentBalance}</p>
            <Button type="primary" className="reset-btn">
              Reset Balance
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="my-card income-card" title="Income">
            <p className="income-amount">₹ {income}</p>
            <Button type="primary" onClick={showIncomeModal} className="income-btn">
              Add Income
            </Button>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card className="my-card expense-card" title="Expenses">
            <p className="expense-amount">₹ {expense}</p>
            <Button type="primary" onClick={showExpenseModal} className="expense-btn">
              Add Expenses
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

