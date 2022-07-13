package com.project.beweb.repository;

import com.project.beweb.model.Cart;
import com.project.beweb.model.CartIDKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartRepository extends JpaRepository<Cart, CartIDKey> {
    List<Cart> findAllById_UserId(Integer userId);
}
