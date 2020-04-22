import { request } from 'express';
import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionDTO {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

interface BalanceTransaction {
  transactions: Transaction[];
  balance: Balance;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): BalanceTransaction {
    const transactionsBalance = {
      transactions: this.transactions,
      balance: this.getBalance(),
    };

    return transactionsBalance;
  }

  public getBalance(): Balance {
    const totalIncome = this.transactions.reduce(
      (acc, transaction) =>
        transaction.type === 'income' ? acc + transaction.value : acc,
      0,
    );
    const totalOutcome = this.transactions.reduce(
      (acc, transaction) =>
        transaction.type === 'outcome' ? acc + transaction.value : acc,
      0,
    );
    const balance = {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalIncome - totalOutcome,
    };
    return balance;
  }

  public create({ title, value, type }: CreateTransactionDTO): Transaction {
    const transaction = new Transaction({ title, value, type });
    this.transactions.push(transaction);
    return transaction;
  }
}

export default TransactionsRepository;
