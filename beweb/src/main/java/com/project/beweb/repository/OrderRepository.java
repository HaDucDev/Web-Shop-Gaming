package com.project.beweb.repository;

import com.project.beweb.model.Orders;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Orders, Integer> {
    List<Orders> findAllByCreateDateIsBetween(Date start, Date end);

    List<Orders> findAllByStatusOrder(String statusOrder);

    List<Orders> findAllByShipperId(Integer shipperId);
}
