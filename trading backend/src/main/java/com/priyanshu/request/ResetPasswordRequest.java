package com.priyanshu.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {

    private String id;
    private String otp;
    private String password;
}
