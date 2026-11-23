package com.priyanshu.service;

import com.priyanshu.config.JwtProvider;
import com.priyanshu.domain.VerificationType;
import com.priyanshu.modal.TwoFactorAuth;
import com.priyanshu.modal.User;
import com.priyanshu.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public User findUserProfileByJwt(String jwt) throws Exception {
        String email = JwtProvider.getEmailFromToken(jwt);
        User user = userRepository.findByEmail(email);

        if(user == null)
            throw new Exception("User not found");

        return user;
    }

    @Override
    public User findUserByEmail(String email) throws Exception {
        User user = userRepository.findByEmail(email);

        if(user == null)
            throw new Exception("User not found");

        return user;
    }

    @Override
    public User findUserById(String userId) throws Exception {
        Optional<User> user = userRepository.findById(Long.valueOf(userId));
        if(user.isEmpty())
            throw new Exception("User not found");

        return user.get();
    }

    @Override
    public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user) {
        TwoFactorAuth twoFactorAuth = new TwoFactorAuth();
        twoFactorAuth.setEnable(true);
        twoFactorAuth.setSendTo(verificationType);

        user.setTwoFactorAuth(twoFactorAuth);

        return userRepository.save(user);
    }

    @Override
    public User disableTwoFactorAuthentication(User user) {
        user.setTwoFactorAuth(new TwoFactorAuth());
        return userRepository.save(user);
    }

    @Override
    public User updatePassword(User user, String newPassword) {
        user.setPassword(newPassword);
        return userRepository.save(user);
    }
}
