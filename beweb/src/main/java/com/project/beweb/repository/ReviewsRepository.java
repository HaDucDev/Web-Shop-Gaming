package com.project.beweb.repository;

import com.project.beweb.model.Reviews;
import com.project.beweb.model.ReviewsIdKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsRepository extends JpaRepository<Reviews, ReviewsIdKey> {
    List<Reviews> findAllByProduct_ProductId(Integer productId);
}
