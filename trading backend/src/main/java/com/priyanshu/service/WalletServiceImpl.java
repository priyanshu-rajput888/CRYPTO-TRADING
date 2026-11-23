
package com.priyanshu.service;

import com.priyanshu.domain.OrderType;
import com.priyanshu.domain.WalletTransactionType;
import com.priyanshu.modal.Order;
import com.priyanshu.modal.User;
import com.priyanshu.modal.Wallet;
import com.priyanshu.modal.WalletTransaction;
import com.priyanshu.repository.WalletRepository;
import com.priyanshu.repository.WalletTransactionRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class WalletServiceImpl implements WalletService {

    @Autowired
    private WalletRepository walletRepository;

    @Autowired
    private WalletTransactionRepository walletTransactionRepository;

    private void saveTransaction(
            Wallet wallet,
            WalletTransactionType type,
            Long amount,
            String purpose
    ) {
        WalletTransaction transaction = new WalletTransaction();

        transaction.setWallet(wallet);
        transaction.setType(type);
        transaction.setAmount(amount);
        transaction.setDate(LocalDate.now());
        transaction.setPurpose(purpose);

        walletTransactionRepository.save(transaction);
    }

    @Override
    public Wallet getUserWallet(User user) {

        Wallet wallet = walletRepository.findByUserId(user.getId());

        if (wallet == null) {
            wallet = new Wallet();
            wallet.setUser(user);
            wallet = walletRepository.save(wallet);
        }

        return wallet;
    }

    @Override
    @Transactional
    public Wallet addBalance(Wallet wallet, Long money) {

        BigDecimal balance = wallet.getBalance();
        BigDecimal newBalance = balance.add(BigDecimal.valueOf(money));

        wallet.setBalance(newBalance);

        Wallet savedWallet = walletRepository.save(wallet);
        boolean isWithdrawal = money < 0;

        saveTransaction(
                savedWallet,
                isWithdrawal ? WalletTransactionType.WITHDRAWAL : WalletTransactionType.ADD_MONEY,
                Math.abs(money),
                isWithdrawal ? "Wallet Withdrawal" : "Wallet Deposit"
        );

        return savedWallet;
    }

    @Override
    public Wallet findWalletById(Long id) throws Exception {

        return walletRepository.findById(id)
                .orElseThrow(() -> new Exception("Wallet not found"));
    }

    @Override
    @Transactional
    public Wallet walletToWalletTransfer(
            User sender,
            Wallet receiverWallet,
            Long amount
    ) throws Exception {

        Wallet senderWallet = getUserWallet(sender);

        if (senderWallet.getBalance().compareTo(BigDecimal.valueOf(amount)) < 0) {
            throw new Exception("Insufficient balance...");
        }

        BigDecimal senderBalance =
                senderWallet.getBalance().subtract(BigDecimal.valueOf(amount));

        senderWallet.setBalance(senderBalance);
        walletRepository.save(senderWallet);

        BigDecimal receiverBalance =
                receiverWallet.getBalance().add(BigDecimal.valueOf(amount));

        receiverWallet.setBalance(receiverBalance);
        walletRepository.save(receiverWallet);

        saveTransaction(
                senderWallet,
                WalletTransactionType.WITHDRAWAL,
                amount,
                "Wallet Transfer Sent"
        );

        saveTransaction(
                receiverWallet,
                WalletTransactionType.ADD_MONEY,
                amount,
                "Wallet Transfer Received"
        );

        return senderWallet;
    }

    @Override
    @Transactional
    public Wallet payOrderPayment(Order order, User user) throws Exception {

        Wallet wallet = getUserWallet(user);

        if (order.getOrderType().equals(OrderType.BUY)) {

            BigDecimal newBalance =
                    wallet.getBalance().subtract(order.getPrice());

            if (newBalance.compareTo(BigDecimal.ZERO) < 0) {
                throw new Exception("Insufficient funds for this transaction");
            }

            wallet.setBalance(newBalance);

            saveTransaction(
                    wallet,
                    WalletTransactionType.WITHDRAWAL,
                    order.getPrice().longValue(),
                    "Order Payment - BUY"
            );

        } else {

            BigDecimal newBalance =
                    wallet.getBalance().add(order.getPrice());

            wallet.setBalance(newBalance);

            saveTransaction(
                    wallet,
                    WalletTransactionType.ADD_MONEY,
                    order.getPrice().longValue(),
                    "Order Payment - SELL"
            );
        }

        return walletRepository.save(wallet);
    }
}
