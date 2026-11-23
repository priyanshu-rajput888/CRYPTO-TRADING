package com.priyanshu.controller;

import com.priyanshu.request.ForgotPasswordTokenRequest;
import com.priyanshu.request.VerifyOtpRequest;
import com.priyanshu.domain.VerificationType;
import com.priyanshu.modal.ForgotPasswordToken;
import com.priyanshu.modal.User;
import com.priyanshu.modal.VerificationCode;
import com.priyanshu.request.ResetPasswordRequest;
import com.priyanshu.response.ApiResponse;
import com.priyanshu.response.AuthResponse;
import com.priyanshu.service.EmailService;
import com.priyanshu.service.ForgotPasswordService;
import com.priyanshu.service.UserService;
import com.priyanshu.service.VerificationCodeService;
import com.priyanshu.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private VerificationCodeService verificationCodeService;

    @Autowired
    private ForgotPasswordService forgotPasswordService;

    @Autowired
    private EmailService emailService;
    private String jwt;

    @GetMapping("/api/users/profile")
    public ResponseEntity<User> getUserProfile(@RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        return new ResponseEntity<User>(user, HttpStatus.OK);
    }

    @PostMapping("/api/users/verification/{verificationType}/send-otp")
    public ResponseEntity<String> sendVerificationOtp(
            @RequestHeader("Authorization") String jwt,
            @PathVariable VerificationType verificationType) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);

        if (!VerificationType.EMAIL.equals(verificationType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only email verification is supported");
        }

        VerificationCode previousCode = verificationCodeService.getVerificationCodeByUser(user.getId());
        if (previousCode != null) {
            verificationCodeService.deleteVerificationCodeById(previousCode);
        }

        VerificationCode verificationCode = verificationCodeService.sendVerificationCode(user, verificationType);
        emailService.sendVerificationOtpMail(user.getEmail(), verificationCode.getOtp());

        return new ResponseEntity<>("Verification OTP sent successfully", HttpStatus.OK);
    }

    @PatchMapping("/api/users/enable-two-factor/verify-otp")
    public ResponseEntity<User> enableTwoFactorAuthentication(
            @RequestBody VerifyOtpRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        VerificationCode verificationCode = getVerifiedEmailCode(user, request.getOtp());
        User updatedUser = userService.enableTwoFactorAuthentication(
                verificationCode.getVerificationType(), user.getEmail(), user);
        verificationCodeService.deleteVerificationCodeById(verificationCode);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @PatchMapping("/api/users/disable-two-factor/verify-otp")
    public ResponseEntity<User> disableTwoFactorAuthentication(
            @RequestBody VerifyOtpRequest request,
            @RequestHeader("Authorization") String jwt) throws Exception {
        User user = userService.findUserProfileByJwt(jwt);
        VerificationCode verificationCode = getVerifiedEmailCode(user, request.getOtp());
        User updatedUser = userService.disableTwoFactorAuthentication(user);
        verificationCodeService.deleteVerificationCodeById(verificationCode);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    private VerificationCode getVerifiedEmailCode(User user, String otp) {
        VerificationCode verificationCode = verificationCodeService.getVerificationCodeByUser(user.getId());
        if (verificationCode == null ||
                !VerificationType.EMAIL.equals(verificationCode.getVerificationType())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request an email verification code first");
        }
        if (verificationCode.getExpiresAt() == null ||
                !verificationCode.getExpiresAt().isAfter(java.time.Instant.now())) {
            verificationCodeService.deleteVerificationCodeById(verificationCode);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Verification code expired. Request a new code");
        }
        if (!verificationCode.getOtp().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid verification code");
        }
        return verificationCode;
    }

    @PostMapping("/auth/users/reset-password/send-otp")
    public ResponseEntity<AuthResponse> sendForgotPasswordOtp(
            @RequestBody ForgotPasswordTokenRequest req) throws Exception {
            if (req.getVerificationType() != VerificationType.EMAIL) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only email password recovery is supported");
            }

        User user = userService.findUserByEmail(req.getSendTo());
        String otp = OtpUtils.generateOtp();
        UUID uuid = UUID.randomUUID();
        String id = uuid.toString();

        ForgotPasswordToken token = forgotPasswordService.findByUser(user.getId());
            if (token != null) {
                forgotPasswordService.deleteToken(token);
            }
            token = forgotPasswordService.createToken(
                    user, id, otp, req.getVerificationType(), user.getEmail());
            emailService.sendVerificationOtpMail(user.getEmail(), otp);

        AuthResponse response = new AuthResponse();
        response.setSession(token.getId());
        response.setMessage("Password reset OTP sent successfully");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/auth/users/reset-password/verify-otp")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestBody ResetPasswordRequest req) throws Exception {

        ForgotPasswordToken forgotPasswordToken = forgotPasswordService.findById(req.getId());
        if (forgotPasswordToken == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Request a password reset code first");
        }

        if (forgotPasswordToken.getExpiresAt() == null ||
                !forgotPasswordToken.getExpiresAt().isAfter(java.time.Instant.now())) {
            forgotPasswordService.deleteToken(forgotPasswordToken);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Reset code expired. Request a new code");
        }

        if (!forgotPasswordToken.getOtp().equals(req.getOtp())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid reset code");
        }
        if (req.getPassword() == null || req.getPassword().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password is required");
        }

        userService.updatePassword(forgotPasswordToken.getUser(), req.getPassword());
        forgotPasswordService.deleteToken(forgotPasswordToken);
        ApiResponse res = new ApiResponse();
        res.setMessage("Password updated successfully");
        return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
    }
}
