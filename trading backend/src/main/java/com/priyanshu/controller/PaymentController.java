package com.priyanshu.controller;

import com.priyanshu.domain.PaymentMethod;
import com.priyanshu.modal.PaymentOrder;
import com.priyanshu.modal.User;
import com.priyanshu.response.PaymentResponse;
import com.priyanshu.service.PaymentService;
import com.priyanshu.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class PaymentController {

    @Autowired
    private UserService userService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/payment/{paymentMethod}/amount/{amount}")
    public ResponseEntity<PaymentResponse> paymentHandler(
            @PathVariable PaymentMethod paymentMethod,
            @PathVariable Long amount,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        PaymentResponse paymentResponse;

        PaymentOrder order = paymentService.createOrder(user, amount, paymentMethod);

        if(!paymentMethod.equals(PaymentMethod.RAZORPAY))
            throw new IllegalArgumentException("Unsupported payment method");

        paymentResponse = paymentService.createRazorpayPaymentLink(user, amount, order.getId());

        return new ResponseEntity<>(paymentResponse, HttpStatus.CREATED);
    }
}
