package com.project.beweb.service.impl;

import com.project.beweb.dto.CartDTO;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.Cart;
import com.project.beweb.model.CartIDKey;
import com.project.beweb.model.Product;
import com.project.beweb.repository.CartRepository;
import com.project.beweb.service.CartService;
import com.project.beweb.service.ProductService;
import com.project.beweb.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImp implements CartService {
  @Autowired
  private CartRepository cartRepository;
  @Autowired
  private UserService userService;
  @Autowired
  private ProductService productService;

  @Override
  public Cart createNewCart(CartDTO cartDTO) {
    CartIDKey id = new CartIDKey(cartDTO.getUserId(), cartDTO.getProductId());
    Optional<Cart> cart = cartRepository.findById(id);
    if (!cart.isPresent()) {
      Cart cart1 = new Cart();

      cart1.setId(id);
      cart1.setQuantity(cartDTO.getQuantity());
      cart1.setUser(userService.getUserById(cartDTO.getUserId()));
      cart1.setProduct(productService.getProductById(cartDTO.getProductId()));
      return cartRepository.save(cart1);
    }
    Cart newCart = cart.get();

    if (newCart.isDelete()) {
      newCart.setQuantity(cartDTO.getQuantity());
      newCart.setDelete(false);
    } else {
      newCart.setQuantity(cart.get().getQuantity() + cartDTO.getQuantity());
    }

    newCart.setUser(userService.getUserById(cartDTO.getUserId()));
    newCart.setProduct(productService.getProductById(cartDTO.getProductId()));

    return cartRepository.save(newCart);
  }

  @Override
  public Cart getCartById(CartIDKey cartIDKey) {
    Cart cart = cartRepository.findById(cartIDKey).orElse(null);
    if (cart == null) {
      throw new NotFoundException("Can not find cart");
    }

    return cart;
  }

  @Override
  public Cart save(Cart cart) {
    return cartRepository.save(cart);
  }

  @Override
  public List<Cart> getAllCartByUserId(Integer userId) {
    return cartRepository.findAllById_UserId(userId)
        .stream().filter(item -> !item.isDelete())
        .collect(Collectors.toList());
  }

  @Override
  public List<Product> getAllCartByUserId2(Integer userId) {
    List<Cart> carts = cartRepository.findAllById_UserId(userId)
        .stream().filter(item -> !item.isDelete())
        .collect(Collectors.toList());
    List<Product> products = new ArrayList<>();
    carts.forEach(item -> {
      Product product = productService.getProductById(item.getId().getProductId());
      Product newProduct = new Product();
      newProduct.setProductId(product.getProductId());
      newProduct.setProductName(product.getProductName());
      newProduct.setQuantity(item.getQuantity());
      newProduct.setProductImage(product.getProductImage());
      newProduct.setDiscount(product.getDiscount());
      newProduct.setUnitPrice(product.getUnitPrice());
      newProduct.setDescriptionProduct(product.getDescriptionProduct());
      newProduct.setCategory(product.getCategory());
      newProduct.setSupplier(product.getSupplier());
      newProduct.setCartEntities(product.getCartEntities());
      newProduct.setProductEntities(product.getProductEntities());
      newProduct.setReviewsEntities(product.getReviewsEntities());
      products.add(newProduct);
    });


    return products;
  }

  @Override
  public void deleteCartById(CartIDKey cartIDKey) {
    Cart cart = cartRepository.findById(cartIDKey).orElse(null);
    if (cart == null) {
      throw new NotFoundException("Can not find cart");
    }

    cart.setDelete(true);
    cartRepository.save(cart);
  }
}
