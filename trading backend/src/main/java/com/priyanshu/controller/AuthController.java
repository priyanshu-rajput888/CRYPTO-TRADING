package com.priyanshu.controller;

import com.priyanshu.config.JwtProvider;
import com.priyanshu.modal.TwoFactorOTP;
import com.priyanshu.modal.User;
import com.priyanshu.repository.UserRepository;
import com.priyanshu.request.VerifyTwoFactorLoginRequest;
import com.priyanshu.response.AuthResponse;
import com.priyanshu.service.CustomUserDetailsService;
import com.priyanshu.service.EmailService;
import com.priyanshu.service.TwoFactorOtpService;
import com.priyanshu.service.WatchlistService;
import com.priyanshu.utils.OtpUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private TwoFactorOtpService twoFactorOtpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> register(@RequestBody User user) throws Exception {


        User isEmailExist = userRepository.findByEmail(user.getEmail());

        if(isEmailExist != null)
            throw new Exception("Email is already used with another account");

        User newUser = new User();
        newUser.setEmail(user.getEmail());
        newUser.setPassword(user.getPassword());
        newUser.setEmail(user.getEmail());
        newUser.setFullName(user.getFullName());

        User savedUser = userRepository.save(newUser);

        watchlistService.createWatchList(savedUser);

        Authentication auth = new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword());

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Register success");

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> login(@RequestBody User user) throws Exception {

        String userName = user.getEmail();
        String password = user.getPassword();

        Authentication auth = authenticate(userName, password);

        SecurityContextHolder.getContext().setAuthentication(auth);

        String jwt = JwtProvider.generateToken(auth);

        User authUser = userRepository.findByEmail(userName);

        if(authUser.getTwoFactorAuth() != null && authUser.getTwoFactorAuth().isEnable()){
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor auth is enabled");
            res.setTwoFactorAuthEnabled(true);
            String otp = OtpUtils.generateOtp();

            TwoFactorOTP oldTwoFactorOTP = twoFactorOtpService.findByUser(authUser.getId());
            if(oldTwoFactorOTP != null)
                twoFactorOtpService.deleteTwoFactorOtp(oldTwoFactorOTP);

            TwoFactorOTP newTwoFactorOtp = twoFactorOtpService.createTwoFactorOtp(authUser, otp, jwt);

            emailService.sendVerificationOtpMail(userName, otp);

            res.setSession(newTwoFactorOtp.getId());
            return new ResponseEntity<>(res, HttpStatus.ACCEPTED);
        }

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setStatus(true);
        res.setMessage("Login success");

        return new ResponseEntity<>(res, HttpStatus.CREATED);
    }

    private Authentication authenticate(String userName, String password) {
        UserDetails userDetails;
        try {
            userDetails = customUserDetailsService.loadUserByUsername(userName);
        } catch (UsernameNotFoundException exception) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        if (password == null || !password.equals(userDetails.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return new UsernamePasswordAuthenticationToken(userDetails, password, userDetails.getAuthorities());
    }

    @PostMapping("/two-factor/otp")
    public ResponseEntity<AuthResponse> verifySigningOTp(
            @RequestBody VerifyTwoFactorLoginRequest request) throws Exception {

        TwoFactorOTP twoFactorOTP = twoFactorOtpService.findById(request.getId());

        if(twoFactorOTP != null && twoFactorOtpService.verifyTwoFactorOtp(twoFactorOTP, request.getOtp())){
            AuthResponse res = new AuthResponse();
            res.setMessage("Two factor authentication verified");
            res.setTwoFactorAuthEnabled(true);
            res.setJwt(twoFactorOTP.getJwt());
            twoFactorOtpService.deleteTwoFactorOtp(twoFactorOTP);
            return new ResponseEntity<>(res, HttpStatus.OK);
        }

        throw new org.springframework.web.server.ResponseStatusException(
                HttpStatus.BAD_REQUEST, "Invalid or expired verification code");
    }

}
