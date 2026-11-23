package com.priyanshu.service;

import com.priyanshu.modal.Wallet;
import com.priyanshu.modal.WalletTransaction;

import java.util.List;

public interface TransactionService {

    List<WalletTransaction> getTransactionByWallet(Wallet wallet);
}