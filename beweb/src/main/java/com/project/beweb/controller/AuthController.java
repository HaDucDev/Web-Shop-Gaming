package com.project.beweb.controller;

import com.project.beweb.dto.UserDTO;
import com.project.beweb.payload.request.AuthenticationRequest;
import com.project.beweb.payload.request.ChangePasswordRequest;
import com.project.beweb.payload.request.NewPasswordRequest;
import com.project.beweb.service.AuthService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.InvalidObjectException;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(Constants.BASE_URI_V1 + "auth")
public class AuthController {
  @Autowired
  private AuthService authService;

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
    return ResponseEntity.status(200).body(authService.login(request));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> signup(@RequestBody UserDTO userDTO) throws InvalidObjectException {
    return ResponseEntity.status(201).body(authService.signup(userDTO));
  }

  @GetMapping("/generate-token-pass")// nhan button sau khi nhap ten email
  public ResponseEntity<?> generateForgotTokenPass(@RequestParam("email") String email) {
    return ResponseEntity.status(200).body(authService.generateForgotTokenPass(email));
  }

  @PostMapping("/new-password") // thong tin xac nhan khi quen mat khau
  public ResponseEntity<?> setNewPassword(@RequestBody NewPasswordRequest newPasswordRequest) {
    return ResponseEntity.status(200).body(authService.setNewPassword(newPasswordRequest));
  }

  //Cái này trước mình dùng để đổi maart khẩu dùng mã xác thực nhưng hiện tại ko dùng nó. mình để là dự phòng vì có thể update tiếp
  @PostMapping("/random-new-pass")
  public ResponseEntity<?> randomNewPassword(@RequestBody NewPasswordRequest newPasswordRequest) {
    return ResponseEntity.status(200).body(
        authService.forgotPassword(newPasswordRequest.getUsername(), newPasswordRequest.getToken())
    );
  }

  @PostMapping("/change-password")
  public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
    return ResponseEntity.status(200).body(
        authService.changePassword(request)
    );
  }

}
