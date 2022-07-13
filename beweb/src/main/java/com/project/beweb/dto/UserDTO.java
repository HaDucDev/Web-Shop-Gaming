package com.project.beweb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UserDTO {
  private String avatar;
  private String username;
  private String address;
  private String fullName;
  private String email;
  private String phone;
  private Integer roleId;
}
