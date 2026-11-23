package com.priyanshu.request;

import lombok.Data;

@Data
public class VerifyTwoFactorLoginRequest {
    private String id;
    private String otp;
}
