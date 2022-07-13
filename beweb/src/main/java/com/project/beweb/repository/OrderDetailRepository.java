package com.project.beweb.repository;

import com.project.beweb.model.OrderDetail;
import com.project.beweb.model.OrderDetailIDKey;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, OrderDetailIDKey> {
}
