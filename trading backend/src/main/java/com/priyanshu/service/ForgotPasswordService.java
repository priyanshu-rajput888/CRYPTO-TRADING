package com.priyanshu.service;

import com.priyanshu.domain.VerificationType;
import com.priyanshu.modal.ForgotPasswordToken;
import com.priyanshu.modal.User;

public interface ForgotPasswordService {

    ForgotPasswordToken createToken(User user, String id, String otp, VerificationType verificationType, String sendTo);

    ForgotPasswordToken findById(String id);

    ForgotPasswordToken findByUser(Long userId);

    void deleteToken(ForgotPasswordToken token);
}
