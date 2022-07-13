package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
@Table(uniqueConstraints = {
    @UniqueConstraint(name = "unique_username_constraint", columnNames = "username"),
    @UniqueConstraint(name = "unique_email_constraint2", columnNames = "email"),
    //@UniqueConstraint(name = "unique_phone_constraint2", columnNames = "phone")
}, name = "users")
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "user_id")
  private int userId;

  private String avatar;

  private String username;

  private String address;

  @Nationalized
  private String fullName;

  private String email;

  private String password;

  private String phone;

  private boolean isDelete = Boolean.FALSE;

  @Column(name = "token_reset_password")
  @JsonIgnore
  private String tokenResetPass;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user")
  @JsonIgnore
  private Set<Cart> cart;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user")
  @JsonIgnore
  private Set<Orders> orders;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "user")
  @JsonIgnore
  private Set<Reviews> reviews;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "role_id", referencedColumnName = "role_id")
  private Role role;

  public User(String username, String email, String password, String fullName) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
  }

  public User(String username, String email, String password, String fullName, String phone, String address) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.fullName = fullName;
    this.phone = phone;
    this.address = address;
  }

}
