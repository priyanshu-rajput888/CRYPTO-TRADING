package com.priyanshu.service;

import com.priyanshu.domain.PaymentMethod;
import com.priyanshu.modal.PaymentOrder;
import com.priyanshu.modal.User;
import com.priyanshu.response.PaymentResponse;
import com.razorpay.RazorpayException;

public interface PaymentService {

    PaymentOrder createOrder(User user, Long amount, PaymentMethod paymentMethod);

    PaymentOrder getPaymentOrderById(Long id) throws Exception;

    Boolean proceedPaymentOrder(PaymentOrder paymentOrder, String paymentId) throws RazorpayException;

    PaymentResponse createRazorpayPaymentLink(User user, Long amount, Long orderId);

}
