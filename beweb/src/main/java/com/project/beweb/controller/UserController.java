package com.project.beweb.controller;

import com.project.beweb.dto.UserDTO;
import com.project.beweb.service.UserService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(Constants.BASE_URI_V1 + "users")
@RestController
public class UserController {
  @Autowired
  private UserService userService;

  //    @PreAuthorize("hasRole('ADMIN')")
  @GetMapping
  public ResponseEntity<?> getAllUser(@RequestParam(value = "page", required = false) Integer page) {
    return ResponseEntity.status(200).body(userService.getAllUser(page));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/{id}")
  public ResponseEntity<?> getUserById(@PathVariable("id") Integer id) {
    return ResponseEntity.status(200).body(userService.getUserById(id));
  }

  @PostMapping("/{id}")
  public ResponseEntity<?> changeAvt(
      @PathVariable("id") Integer id,
      @RequestPart(value = "avt") MultipartFile file) {
    return ResponseEntity.status(201).body(userService.changeAvtById(id, file));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @PostMapping
  public ResponseEntity<?> createNewUser(@RequestBody UserDTO userDTO) {
    return ResponseEntity.status(201).body(userService.createNewUser(userDTO));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/{id}/shipper")
  public ResponseEntity<?> setShipperRoleForUser(@PathVariable("id") Integer id) {
    return ResponseEntity.status(201).body(userService.setShipperRoleById(id));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/{id}/admin")
  public ResponseEntity<?> setAdminRoleForUser(@PathVariable("id") Integer id) {
    return ResponseEntity.status(201).body(userService.setAdminRoleById(id));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @PostMapping("/{id}/customer")
  public ResponseEntity<?> setCustomerRoleForUser(@PathVariable("id") Integer id) {
    return ResponseEntity.status(201).body(userService.setCustomerRoleById(id));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @PatchMapping("/{id}")
  public ResponseEntity<?> changeInformation(
      @PathVariable("id") Integer id,
      @RequestBody UserDTO userDTO,
      @RequestPart(value = "avt", required = false) MultipartFile file
  ) {
    return ResponseEntity.status(201).body(userService.changeInformation(id, userDTO, file));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteUserById(@PathVariable("id") Integer id) {
    userService.deleteUserById(id);
    return ResponseEntity.status(200).body("Success");
  }


  @GetMapping("/aaaaaaaaaaaa")
  public void aaaaa() {
    userService.aaaaa();
  }
}
