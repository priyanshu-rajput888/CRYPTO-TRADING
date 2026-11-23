package com.priyanshu.service;

import com.priyanshu.modal.Coin;
import com.priyanshu.modal.User;
import com.priyanshu.modal.Watchlist;

public interface WatchlistService {

    Watchlist findUserWatchlist(Long userId) throws Exception;
    Watchlist createWatchList(User user);
    Watchlist findById(Long id) throws Exception;

    Coin addItemToWatchlist(Coin coin, User user) throws Exception;
}
