package com.project.beweb.service;

import com.project.beweb.dto.CartDTO;
import com.project.beweb.model.Cart;
import com.project.beweb.model.CartIDKey;
import com.project.beweb.model.Product;

import java.util.List;

public interface CartService {
    Cart createNewCart(CartDTO cartDTO);
    Cart getCartById(CartIDKey cartIDKey);
    Cart save(Cart cart);
    List<Cart> getAllCartByUserId(Integer userId);
    List<Product> getAllCartByUserId2(Integer userId);
    void deleteCartById(CartIDKey cartIDKey);
}
