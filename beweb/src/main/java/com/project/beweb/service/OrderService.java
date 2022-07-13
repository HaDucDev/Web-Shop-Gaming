package com.project.beweb.service;

import com.project.beweb.dto.OrderDTO;
import com.project.beweb.model.Orders;
import com.project.beweb.model.Product;
import com.project.beweb.model.User;
import com.project.beweb.payload.response.OrderResponse;
import com.project.beweb.payload.response.RevenueResponse;
import com.project.beweb.payload.response.TrueFalseResponse;

import java.sql.Date;
import java.util.List;

public interface OrderService {
     Orders getOrderById(Integer id);
     Orders save(Orders order);
     TrueFalseResponse createNewOrder(Integer userId, OrderDTO orderDTO);
     TrueFalseResponse createNewOrder2(Integer userId, OrderDTO orderDTO);
     Orders editNewOrderById(Integer userId, Integer orderId, OrderDTO orderDTO);
     Orders nextStatusOrderById(Integer id);
     Orders setCancelledStatusOrderById(Integer id);
     List<OrderResponse> getAllOrder(Integer page);
     List<OrderResponse> getAllOrderByUserId(Integer userId);
     List<Orders> getAllOrderForShipper(Integer userId);
     Orders setShipperForOrder(Integer orderId, Integer shipperId);

     Orders removeCurrentShipper(Integer orderId);

     TrueFalseResponse deleteOrderById(Integer id);
     void setStatusOrderPaidById(Integer id); //đã thanh toán

     User getTheLeastSingleShipper(Integer toExcludeShipper);

     List<Orders> getAllOrdersByDate(Date start, Date end);
     List<Orders> getAllOrdersByYear(Integer year);
     RevenueResponse getRevenueByOrdersList(List<Orders> orders);
     RevenueResponse getRevenueByDate(Date start, Date end);
     RevenueResponse getRevenueByYear(Integer year);

     List<OrderResponse> filter(Integer page, Integer type);
}
