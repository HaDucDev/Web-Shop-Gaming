package com.project.beweb.service;

import com.project.beweb.dto.ReviewDTO;
import com.project.beweb.model.Reviews;
import com.project.beweb.model.ReviewsIdKey;

import java.util.List;

public interface ReviewService {
    Reviews save(Reviews reviews);
    Reviews getReviewById(ReviewsIdKey id);
    List<ReviewDTO> getAllReviewByProductId(Integer productId);
    List<Reviews> getAllReview(Integer page);
    Reviews createNewReviews(ReviewDTO reviewDTO);
    Reviews editReview(ReviewDTO reviewDTO);
    void deleteReviewById(ReviewsIdKey id);
}
