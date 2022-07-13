package com.project.beweb.service;

import com.project.beweb.dto.UserDTO;
import com.project.beweb.exception.LoginException;
import com.project.beweb.model.User;
import com.project.beweb.payload.request.AuthenticationRequest;
import com.project.beweb.payload.request.ChangePasswordRequest;
import com.project.beweb.payload.request.NewPasswordRequest;
import com.project.beweb.payload.response.AuthenticationResponse;
import com.project.beweb.payload.response.TrueFalseResponse;

import java.io.InvalidObjectException;

public interface AuthService {
    //Đăng nhập
    AuthenticationResponse login(AuthenticationRequest request) throws LoginException;

    //Kiểm tra token
    Boolean validateToken(AuthenticationResponse authenticationResponse);

    //Đăng ký tài khoản mới
    AuthenticationResponse signup(UserDTO userDTO) throws InvalidObjectException;

    //sét password mới sau khi đã có mã gửi về mail
    User setNewPassword(NewPasswordRequest newPasswordRequest);

    //Tạo mã gửi về mail
    TrueFalseResponse generateForgotTokenPass(String email);

    //Kiểm tra mã gửi về mail xem có hợp lệ không -> có thì gửi mail password mới
    User forgotPassword(String username, String token);

    TrueFalseResponse changePassword(ChangePasswordRequest request);
}
