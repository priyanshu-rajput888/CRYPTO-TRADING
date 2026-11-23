package com.priyanshu.service;

import com.priyanshu.domain.VerificationType;
import com.priyanshu.modal.User;

public interface UserService {

    public User findUserProfileByJwt(String jwt) throws Exception;
    public User findUserByEmail(String email) throws Exception;
    public User findUserById(String userId) throws Exception;

    public User enableTwoFactorAuthentication(VerificationType verificationType, String sendTo, User user);

    public User disableTwoFactorAuthentication(User user);

    User updatePassword(User user, String newPassword);
}
