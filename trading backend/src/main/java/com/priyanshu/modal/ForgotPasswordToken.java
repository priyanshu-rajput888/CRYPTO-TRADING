package com.priyanshu.modal;

import com.priyanshu.domain.VerificationType;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Entity
@Data
public class ForgotPasswordToken {

    @Id
    private String id;

    @OneToOne
    private User user;

    private String otp;

    private VerificationType verificationType;

    private String sendTo;

    private Instant expiresAt;

}
