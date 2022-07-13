package com.project.beweb.service;

import com.project.beweb.dto.OrderDetailDTO;
import com.project.beweb.model.OrderDetail;
import com.project.beweb.model.OrderDetailIDKey;

import java.util.List;

public interface OrderDetailService {
    OrderDetail save(OrderDetail orderDetail);
    OrderDetail getOrderDetailById(OrderDetailIDKey id);
    List<OrderDetail> getAllOrderDetail();
    OrderDetail createNewOrderDetail(Integer ordersId, Integer productId, OrderDetailDTO orderDetailDTO);
    void deleteOrderDetailById(OrderDetailIDKey id);
}
