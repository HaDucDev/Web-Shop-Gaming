package com.project.beweb.controller;

import com.project.beweb.dto.ReviewDTO;
import com.project.beweb.model.ReviewsIdKey;
import com.project.beweb.payload.response.TrueFalseResponse;
import com.project.beweb.service.ReviewService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(Constants.BASE_URI_V1 + "reviews")
@RestController
public class ReviewsController {
  @Autowired
  private ReviewService reviewService;

  @GetMapping
  private ResponseEntity<?> getAllReviews(@RequestParam(value = "page", required = false) Integer page) {
    return ResponseEntity.status(200).body(reviewService.getAllReview(page));
  }

  @GetMapping("/{productId}")
  private ResponseEntity<?> getAllReviewsByProductId(@PathVariable("productId") Integer productId) {
    return ResponseEntity.status(200).body(reviewService.getAllReviewByProductId(productId));
  }

  @PostMapping("")
  private ResponseEntity<?> createNewReview(@RequestBody ReviewDTO reviewDTO) {
    return ResponseEntity.status(200).body(reviewService.createNewReviews(reviewDTO));
  }

  @PatchMapping("")
  private ResponseEntity<?> editReviewById(@RequestBody ReviewDTO reviewDTO) {
    return ResponseEntity.status(200).body(reviewService.editReview(reviewDTO));
  }

  @DeleteMapping("")
  private ResponseEntity<?> deleteReview(@RequestBody ReviewDTO reviewDTO) {
    reviewService.deleteReviewById(new ReviewsIdKey(reviewDTO.getOrderId(), reviewDTO.getProductId(),
        reviewDTO.getUserId()));
    return ResponseEntity.status(200).body(new TrueFalseResponse(true));
  }

}
