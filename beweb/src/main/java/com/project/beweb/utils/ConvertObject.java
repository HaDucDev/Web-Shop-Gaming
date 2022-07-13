package com.project.beweb.utils;


import com.project.beweb.dto.ProductDTO;
import com.project.beweb.dto.ReviewDTO;
import com.project.beweb.dto.UserDTO;
import com.project.beweb.model.Product;
import com.project.beweb.model.Reviews;
import com.project.beweb.model.ReviewsIdKey;
import com.project.beweb.model.User;

public class ConvertObject {

  public static User convertUserDTOToUser(User user, UserDTO userDTO) {
    user.setUsername(userDTO.getUsername());
    user.setEmail(userDTO.getEmail());
    user.setPhone(userDTO.getPhone());
    user.setAddress(userDTO.getAddress());
    user.setFullName(userDTO.getFullName());
    return user;
  }

  public static Product convertProductDTOToProduct(Product product, ProductDTO productDTO) {
    product.setProductName(productDTO.getProductName());
    product.setQuantity(productDTO.getQuantity());
    product.setDiscount(productDTO.getDiscount());
    product.setUnitPrice(productDTO.getUnitPrice());
    product.setDescriptionProduct(productDTO.getDescriptionProduct());
    return product;
  }

  public static Reviews convertReviewDTOToReview(ReviewDTO reviewDTO) {
    Reviews reviews = new Reviews();
    reviews.setId(new ReviewsIdKey(reviewDTO.getOrderId(), reviewDTO.getProductId(), reviewDTO.getUserId()));
    reviews.setComments(reviewDTO.getComments());
    reviews.setRating(reviewDTO.getRating());

    return reviews;
  }

}
