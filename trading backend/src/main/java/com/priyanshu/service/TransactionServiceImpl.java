package com.priyanshu.service;

import com.priyanshu.modal.Wallet;
import com.priyanshu.modal.WalletTransaction;
import com.priyanshu.repository.WalletTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TransactionServiceImpl implements TransactionService {

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    @Override
    public List<WalletTransaction> getTransactionByWallet(Wallet wallet) {

        return walletTransactionRepository.findByWallet(wallet);
    }
}