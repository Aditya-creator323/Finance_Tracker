import React, { useEffect, useState } from "react";
import Header from "./Header/Header";
import Cards from "./Cards/Cards";
import AddExpense from "./Modals/AddExpense";
import AddIncome from "./Modals/AddIncome";

export default function () {
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

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
    console.log(`values : ${JSON.stringify(values)}, type: ${type}`);
    const newTransaction = {
        type: type,
        amount: parseFloat(values.amount),
    };
    
    setTransactions([...transactions, newTransaction]);
    setIsIncomeModalVisible(false);
    setIsExpenseModalVisible(false);
    calculateBalance(values, type);
  }

  const calculateBalance = (values, type) => {
    console.log(`transactions : ${transactions}`);
    let incomeTotal = 0;
    let expenseTotal = 0;

    if(type === 'income'){
        incomeTotal += parseFloat(values.amount);
    }
    else{
        expenseTotal += parseFloat(values.amount);
    }

    // transactions.forEach((transaction) => {
    //     if(transaction.type === "income"){
    //         incomeTotal += transaction.amount;
    //     }
    //     else{
    //         expenseTotal += transaction.amount;
    //     }
    // })

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setCurrentBalance(incomeTotal - expenseTotal);
    console.log(`Income : ${income}`)
    console.log(`Expense : ${expense}`)
    console.log(`current Balance : ${currentBalance}`)
  }

//   useEffect(() => {
//     calculateBalance();
//   }, [transactions])

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
    </div>
  );
}
