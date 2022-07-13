package com.project.beweb.repository;

import com.project.beweb.enumeration.ERole;
import com.project.beweb.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    User findByUsername(String username);
    User findByEmail(String email);

    User findByPassword(String password);
    List<User> findAllByRole_Name(ERole eRole);
}
