import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import Header from "./Header/Header";
import Cards from "./Cards/Cards";
import AddExpense from "./Modals/AddExpense";
import AddIncome from "./Modals/AddIncome";
import Table from "./Table/Table";

export default function Dashboard() {
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [incomeData, setIncomeData] = useState([]);
  const [expenseData, setExpenseData] = useState([]);

  // Pie chart colors
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  useEffect(() => {
    fetch("http://localhost:8080/getBalanceInfo")
      .then((response) => response.json())
      .then((data) => {
        setIncome(data.totalIncome);
        setExpense(data.totalExpense);
        setCurrentBalance(data.currentBalance);
        setIsInitialLoad(false);
      })
      .catch((error) => console.log("Error from useState : ", error));

    fetch("http://localhost:8080/transactions")
      .then((response) => response.json())
      .then((data) => {
        setTableData(data);
        processChartData(data);
      })
      .catch((error) =>
        console.log("Error in retrieving transaction data", error)
      );
  }, []);

  useEffect(() => {
    if (
      !isInitialLoad &&
      (income !== 0 || expense !== 0 || currentBalance !== 0)
    ) {
      handleAddBalanceInfo();
    }
  }, [income, expense, currentBalance]);

  const processChartData = (data) => {
    const incomeCategories = {};
    const expenseCategories = {};

    data.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeCategories[transaction.tag] =
          (incomeCategories[transaction.tag] || 0) +
          parseFloat(transaction.amount);
      } else {
        expenseCategories[transaction.tag] =
          (expenseCategories[transaction.tag] || 0) +
          parseFloat(transaction.amount);
      }
    });

    setIncomeData(
      Object.keys(incomeCategories).map((key) => ({
        name: key,
        value: incomeCategories[key],
      }))
    );

    setExpenseData(
      Object.keys(expenseCategories).map((key) => ({
        name: key,
        value: expenseCategories[key],
      }))
    );
  };

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
        processChartData([...tableData, data]); // update pie chart data
        calculateBalance();
      })
      .catch((error) => console.error("Error  : ", error));
  };

  const handleAddBalanceInfo = () => {
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
      />

      <AddExpense
        isExpenseModalVisible={isExpenseModalVisible}
        handleExpenseCancel={handleExpenseCancel}
        onFinish={onFinish}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          // marginTop: "20px",
        }}
      >
        {incomeData.length > 0 && (
          <PieChart width={600} height={400}>
            <Pie
              data={incomeData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#82ca9d"
              label
            >
              {incomeData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}

        {expenseData.length > 0 && (
          <PieChart width={600} height={400}>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={150}
              fill="#8884d8"
              label
            >
              {expenseData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        )}
      </div>

      <Table tableData={tableData} />
    </div>
  );
}
