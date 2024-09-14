import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Cards from "./Cards/Cards";
import AddExpense from "./Modals/AddExpense";
import AddIncome from "./Modals/AddIncome";
import Table from "./Table/Table";
import { Card, Row } from "antd";
import Line from "./Charts/Line";

export default function () {
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    console.log("first UseEffect is called");
    fetch("http://localhost:8080/getBalanceInfo")
      .then((response) => response.json())
      .then((data) => {
        setIncome(data.totalIncome);
        setExpense(data.totalExpense);
        setCurrentBalance(data.currentBalance);
        setIsInitialLoad(false);
        console.log("data from useState : ", data);
      })
      .catch((error) => console.log("Error from useState : ", error));

    fetch("http://localhost:8080/transactions")
      .then((response) => response.json())
      .then((data) => {
        console.log("transactions data : ", data);
        setTableData(data);
      })
      .catch((error) =>
        console.log("Error in retrieving transaction data", error)
      );
  }, []);

  useEffect(() => {
    console.log(
      "Income : ",
      income,
      " Expense : ",
      expense,
      " CUrrent Balance : ",
      currentBalance
    );
    if (
      !isInitialLoad &&
      (income !== 0 || expense !== 0 || currentBalance !== 0)
    ) {
      console.log("second UseEffect is called");
      handleAddBalanceInfo();
    }
  }, [income, expense, currentBalance]);

  const showIncomeModal = () => {
    setIsIncomeModalVisible(true);
  };

  const showExpenseModal = () => {
    setIsExpenseModalVisible(true);
  };

  const handleIncomeCancel = () => {
    setIsIncomeModalVisible(false);
  };

  const handleExpenseCancel = () => {
    setIsExpenseModalVisible(false);
  };

  const onFinish = (values, type) => {
    const newTransaction = {
      name: values.name,
      amount: values.amount.toString(),
      date: values.date.format("YYYY-MM-DD"),
      tag: values.tag,
      type: type,
    };

    setTransactions([...transactions, newTransaction]);
    setIsIncomeModalVisible(false);
    setIsExpenseModalVisible(false);
    handleAddTransaction(newTransaction);
  };

  const handleAddTransaction = (newTransaction) => {
    const formattedDate = new Date(newTransaction.date)
      .toISOString()
      .split("T")[0]; // Ensure correct format

    const queryParams = new URLSearchParams({
      name: newTransaction.name,
      amount: parseFloat(newTransaction.amount).toFixed(2),
      date: formattedDate,
      tag: newTransaction.tag || "",
      type: newTransaction.type,
    });

    fetch(`http://localhost:8080/addTransaction?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTransaction),
    })
      .then((response) => response.json())
      .then((data) => {
        setTableData([...tableData, data]);
        calculateBalance();
      })
      .catch((error) => console.error("Error  : ", error));
  };

  const handleAddBalanceInfo = () => {
    console.log("handleAddBalanceInfo is called");
    const safeCurrentBalance =
      currentBalance !== undefined ? currentBalance.toString() : "0";
    const safeIncome = income !== undefined ? income.toString() : "0";
    const safeExpense = expense !== undefined ? expense.toString() : "0";

    const queryParams = new URLSearchParams({
      current_balance: safeCurrentBalance,
      total_income: safeIncome,
      total_expense: safeExpense,
    });

    fetch(`http://localhost:8080/addBalanceInfo?${queryParams.toString()}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setIncome(data.totalIncome);
        setExpense(data.totalExpense);
        setCurrentBalance(data.currentBalance);
      })
      .catch((error) => console.error("Error  : ", error));
  };

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += parseFloat(transaction.amount);
      } else {
        expenseTotal += parseFloat(transaction.amount);
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);
  };

  const cardStyle = {
    boxShadow: "0px 0px 30px 8px rgba(227, 227, 227, 0.75)",
    margin: "2rem",
    borderRadius: "0.5rem",
    minWidth: "400px",
    flex: 1,
  };

  return (
    <div>
      <Header />

      <Cards
        showExpenseModal={showExpenseModal}
        showIncomeModal={showIncomeModal}
        income={income}
        expense={expense}
        currentBalance={currentBalance}
      />

      <AddIncome
        isIncomeModalVisible={isIncomeModalVisible}
        handleIncomeCancel={handleIncomeCancel}
        onFinish={onFinish}
        // handleChange={handleChange}
      />

      <AddExpense
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
        // handleChange={handleChange}
      />

      <Line 
        date={tableData.date}
        amount={tableData.amount}
      />

      {/* <Row gutter={16}>
        <Card bordered={true} style={cardStyle}>
          <h2>Financial Statistics</h2>
          <Line
        </Card>
      </Row> */}

      <Table tableData={tableData} />
    </div>
  );
}
