package com.project.beweb.service.impl;

import com.project.beweb.dto.OrderDetailDTO;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.OrderDetail;
import com.project.beweb.model.OrderDetailIDKey;
import com.project.beweb.model.Orders;
import com.project.beweb.model.Product;
import com.project.beweb.repository.OrderDetailRepository;
import com.project.beweb.service.OrderDetailService;
import com.project.beweb.service.OrderService;
import com.project.beweb.service.ProductService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderDetailServiceImp implements OrderDetailService {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public OrderDetail save(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public OrderDetail getOrderDetailById(OrderDetailIDKey id) {
        Optional<OrderDetail> orderDetail = orderDetailRepository.findById(id);
        if(!orderDetail.isPresent()) {
            throw new NotFoundException("Can not find this order detail");
        }

        return orderDetail.get();
    }

    @Override
    public List<OrderDetail> getAllOrderDetail() {
        return orderDetailRepository.findAll()
                .stream().filter(item -> !item.isDelete())
                .collect(Collectors.toList());
    }

    @Override
    public OrderDetail createNewOrderDetail(Integer ordersId, Integer productId, OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = modelMapper.map(orderDetailDTO, OrderDetail.class);

        Orders orders = orderService.getOrderById(ordersId);
        Product product = productService.getProductById(productId);

        orderDetail.setOrders(orders);
        orderDetail.setProduct(product);
        orderDetail.setId(new OrderDetailIDKey(ordersId, productId));

        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public void deleteOrderDetailById(OrderDetailIDKey id) {
        OrderDetail orderDetail = getOrderDetailById(id);

        orderDetail.setDelete(true);

        orderDetailRepository.save(orderDetail);
    }
}
