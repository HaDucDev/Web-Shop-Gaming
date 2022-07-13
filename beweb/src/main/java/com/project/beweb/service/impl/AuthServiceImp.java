package com.project.beweb.service.impl;

import com.project.beweb.dto.UserDTO;
import com.project.beweb.enumeration.ERole;
import com.project.beweb.exception.DuplicateException;
import com.project.beweb.exception.LoginException;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.exception.TokenInvalid;
import com.project.beweb.model.Role;
import com.project.beweb.model.User;
import com.project.beweb.payload.request.AuthenticationRequest;
import com.project.beweb.payload.request.ChangePasswordRequest;
import com.project.beweb.payload.request.NewPasswordRequest;
import com.project.beweb.payload.response.AuthenticationResponse;
import com.project.beweb.payload.response.TrueFalseResponse;
import com.project.beweb.service.*;
import com.project.beweb.utils.JwtUtil;
import com.project.beweb.utils.Util;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.InvalidObjectException;

@Service
public class AuthServiceImp implements AuthService {
    @Autowired private JwtUtil jwtUtil;

    @Autowired private MyUserDetailsService myUserDetailsService;

    @Autowired private AuthenticationManager authenticationManager;

    @Autowired private PasswordEncoder passwordEncoder;

    @Autowired private UserService userService;

    @Autowired private ModelMapper modelMapper;

    @Autowired private RoleService roleService;

    @Autowired private SendMailService sendMailService;

    @Override
    public AuthenticationResponse login(AuthenticationRequest request) throws LoginException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    request.getUsername(), request.getPassword()
            ));
        }catch (BadCredentialsException e) {
            throw new LoginException("Incorrect username or password");
        }

        final UserDetails userDetails = myUserDetailsService.loadUserByUsername(request.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        User user = userService.getUserByUsername(request.getUsername());

        return new AuthenticationResponse(jwt, user.getUserId(), user.getUsername(),
            user.getRole().getName().name(), user.getRole().getId());
    }


    //-	Đăng kí tài khoản. Khi đăng kí tài khoản sẽ gửi mật khẩu qua mail và người dùng sẽ vào đổi mật khẩu sau
    @Override
    public AuthenticationResponse signup(UserDTO userDTO) throws InvalidObjectException {
        User oldUser = userService.getUserByEmail(userDTO.getEmail());
        User oldUser1 = userService.getUserByUsername(userDTO.getUsername());
        if(oldUser != null) {
            throw new DuplicateException("Địa chỉ email đã tồn tại");
        }
        if(oldUser1 != null) {
            throw new DuplicateException("Tên đăng nhập đã tồn tại");
        }
        User user = modelMapper.map(userDTO, User.class);
        if(user == null) {
            throw new InvalidObjectException("Invalid user");
        }

        String password = Util.generateString();
        //send mail
        sendMailService.sendMailWithText("Đăng ký tài khoản", "Đây là password của bạn: " + password, user.getEmail());

        user.setPassword(passwordEncoder.encode(password));

        //gán ROLE_CUSTOMER cho user mới lập
        Role role = roleService.getRoleByName(ERole.ROLE_CUSTOMER.toString());
        user.setRole(role);

        User newUser = userService.save(user);

        final UserDetails userDetails = myUserDetailsService.loadUserByUsername(newUser.getUsername());
        final String jwt = jwtUtil.generateToken(userDetails);

        return new AuthenticationResponse(jwt, newUser.getUserId(), newUser.getUsername(), role.getName().toString(),
            role.getId());
    }


    //Quên mật khẩu
    @Override
    public User setNewPassword(NewPasswordRequest newPasswordRequest) {
        User user = userService.getUserByUsername(newPasswordRequest.getUsername());
        if(user == null) {
            throw new NotFoundException("Can not find user by username: " + newPasswordRequest.getNewPassword());
        }

        if(!user.getTokenResetPass().equals(newPasswordRequest.getToken())) {
            throw new TokenInvalid("This token invalid, can not change password");
        }

        user.setPassword(passwordEncoder.encode(newPasswordRequest.getNewPassword()));
        user.setTokenResetPass(null);

        return userService.save(user);
    }

    @Override
    public TrueFalseResponse generateForgotTokenPass(String email) {// nhan button de gui ma bao mat ve email
        User user = userService.getUserByEmail(email);
        if(user == null) {
            throw new NotFoundException("Can not find user by email: " + email);
        }
        String token = Util.generateString();
        user.setTokenResetPass(token);

        //Send mail
        try {
            sendMailService.sendMailWithText("Mã bảo mật", "Đây là mã bảo mật của bạn: " + token, user.getEmail());
        } catch (Exception ex) {
            return new TrueFalseResponse(false);
        }

        userService.save(user);

        return new TrueFalseResponse(true);
    }

    @Override
    public User forgotPassword(String username, String token) {
        // //Cái này trước mình dùng để đổi mật khẩu sau khi đăng nhâp dùng mã xác thực nhưng hiện tại ko dùng nó. mình để là dự phòng vì có thể update tiếp
        //Gửi mail với token trước rồi check
        User user = userService.getUserByUsername(username);
        if(user == null) {
            throw new NotFoundException("Can not find user by username: " + username);
        }

        if(user.getTokenResetPass() == null) {
            throw new TokenInvalid("This token invalid, can not find token");
        }

        if(!user.getTokenResetPass().equals(token)) {
            throw new TokenInvalid("This token invalid, can not change password");
        }

        String newPassword = Util.generateString();
        user.setPassword(passwordEncoder.encode(newPassword));

        sendMailService.sendMailWithText("Quên mật khẩu", "Đây là mật khẩu mới của bạn: " + newPassword, user.getEmail());
        user.setTokenResetPass(null);

        return userService.save(user);
    }

    @Override
    public TrueFalseResponse changePassword(ChangePasswordRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                request.getUsername(), request.getPassword()
            ));

            User user = userService.getUserByUsername(request.getUsername());

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));

            userService.save(user);
            return new TrueFalseResponse(true);

        }catch (BadCredentialsException e) {
            return new TrueFalseResponse(false);
        }
    }

    @Override
    public Boolean validateToken(AuthenticationResponse authenticationResponse) {
        try {
            String jwt = authenticationResponse.getJwt();
            String username = jwtUtil.extractUsername(jwt);
            UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);

            return jwtUtil.validateToken(jwt, userDetails);
        } catch (Exception e) {
            return false;
        }
    }

}
