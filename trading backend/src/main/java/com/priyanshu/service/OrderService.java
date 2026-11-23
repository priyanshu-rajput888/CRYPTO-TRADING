package com.priyanshu.service;

import com.priyanshu.domain.OrderType;
import com.priyanshu.modal.Coin;
import com.priyanshu.modal.Order;
import com.priyanshu.modal.OrderItem;
import com.priyanshu.modal.User;

import java.util.List;

public interface OrderService {

    Order createOrder(User user, OrderItem orderItem, OrderType orderType);

    Order getOrderById(Long orderId) throws Exception;

    List<Order> getAllOrdersOfUser(Long userId, OrderType orderType, String assetSymbol);

    Order processOrder(Coin coin, double quantity, OrderType orderType, User user) throws Exception;
}
