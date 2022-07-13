package com.project.beweb.controller;

import com.project.beweb.dto.CartDTO;
import com.project.beweb.model.CartIDKey;
import com.project.beweb.service.CartService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(Constants.BASE_URI_V1 + "carts")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getAllCartByUserId(@PathVariable("userId") Integer userId) {
        return ResponseEntity.status(201).body(cartService.getAllCartByUserId(userId));
    }

    @GetMapping("/{userId}/product")
    public ResponseEntity<?> getAllProductInCartByUserId(@PathVariable("userId") Integer userId) {
        return ResponseEntity.status(201).body(cartService.getAllCartByUserId2(userId));
    }

    @GetMapping("/{userId}/{productId}")
    public ResponseEntity<?> getCartByUserIdAndProductId(
            @PathVariable("userId") Integer userId,
            @PathVariable("productId") Integer productId
    ) {
        return ResponseEntity.status(201).body(
                cartService.getCartById(new CartIDKey(userId, productId))
        );
    }

    @PostMapping
    public ResponseEntity<?> createNewCart(@RequestBody CartDTO cartDTO) {
        return ResponseEntity.status(201).body(cartService.createNewCart(cartDTO));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteCartById(@RequestBody CartIDKey cartIDKey) {
        cartService.deleteCartById(cartIDKey);

        return ResponseEntity.status(201).body("Success");
    }
}
