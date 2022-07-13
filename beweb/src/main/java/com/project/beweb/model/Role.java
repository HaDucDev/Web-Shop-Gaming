package com.project.beweb.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.project.beweb.enumeration.ERole;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Role {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "role_id")
  private int id;

  @Enumerated(EnumType.STRING)
  @Column(length = 20, unique = true)
  private ERole name;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "role")
  @JsonIgnore
  private Set<User> users;

  public Role(ERole eRole) {
    this.name = eRole;
  }
}
