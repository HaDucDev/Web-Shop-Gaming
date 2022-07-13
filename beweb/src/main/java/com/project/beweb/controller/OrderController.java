package com.project.beweb.controller;

import com.project.beweb.dto.OrderDTO;
import com.project.beweb.service.OrderService;
import com.project.beweb.utils.Constants;
import io.swagger.models.auth.In;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Date;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(Constants.BASE_URI_V1 + "orders")
@RestController
public class OrderController {
  @Autowired
  private OrderService orderService;

  @GetMapping
  public ResponseEntity<?> getAllOrder(@RequestParam(value = "page", required = false) Integer page) {
    return ResponseEntity.status(200).body(orderService.getAllOrder(page));
  }

  @GetMapping("/filter")
  public ResponseEntity<?> getAllOrderFilter(@RequestParam(value = "page", required = false) Integer page,
                                             @RequestParam(value = "type", required = false) Integer type) {
    return ResponseEntity.status(200).body(orderService.filter(page, type));
  }

  @GetMapping("/{userId}/user")
  public ResponseEntity<?> getAllOrderByUserId(
      @PathVariable("userId") Integer userId
  ) {
    return ResponseEntity.status(200).body(orderService.getAllOrderByUserId(userId));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getOrderById(
      @PathVariable("id") Integer id
  ) {
    return ResponseEntity.status(200).body(orderService.getOrderById(id));
  }

  //lấy tất cả order cho shipper
  @GetMapping("/shipper/{userId}")
  public ResponseEntity<?> getAllOrderForShipper(
      @PathVariable("userId") Integer userId
  ) {
    return ResponseEntity.status(200).body(orderService.getAllOrderForShipper(userId));
  }

  //phân công cho shipper này giao hàng, hàm này thứa, cần xóa
  @PostMapping("/shipper/{ordersId}/{shipperId}")
  public ResponseEntity<?> setShipper(
      @PathVariable("ordersId") Integer ordersId,
      @PathVariable("shipperId") Integer shipperId
  ) {
    return ResponseEntity.status(200).body(orderService.setShipperForOrder(ordersId, shipperId));
  }

  @PostMapping("/{userId}")
  public ResponseEntity<?> createNewOrders(
      @PathVariable("userId") Integer userId,
      @RequestBody OrderDTO orderDTO
  ) {
    return ResponseEntity.status(200).body(orderService.createNewOrder(userId, orderDTO));
  }

  @PostMapping("/{userId}/order")
  public ResponseEntity<?> createNewOrder2(@PathVariable("userId") Integer userId, @RequestBody OrderDTO orderDTO) {
    return ResponseEntity.status(200).body(orderService.createNewOrder2(userId, orderDTO));
  }

  @PatchMapping("/{userId}/{ordersId}")
  public ResponseEntity<?> editNewOrderById(
      @PathVariable("userId") Integer userId,
      @PathVariable("ordersId") Integer ordersId,
      @RequestBody OrderDTO orderDTO
  ) {
    return ResponseEntity.status(200).body(orderService.editNewOrderById(userId, ordersId, orderDTO));
  }

  @PostMapping("/{id}/status")
//    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER')")
  public ResponseEntity<?> nextStatusCodeById(
      @PathVariable("id") Integer id
  ) {
    return ResponseEntity.status(200).body(orderService.nextStatusOrderById(id));
  }

  @PostMapping("/{ordersId}/remove-shipper")
//    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER')")
  public ResponseEntity<?> removeCurrentShipperById(
      @PathVariable("ordersId") Integer orderId
  ) {
    return ResponseEntity.status(200).body(orderService.removeCurrentShipper(orderId));
  }

  //sét đã thanh toán cho hóa đơn, cái này thừa mà hiện tại ko dùng
//    @PreAuthorize("hasAnyRole('ADMIN', 'SHIPPER')")
  @PostMapping("/{id}/note")
  public ResponseEntity<?> setNotePaidById(
      @PathVariable("id") Integer id
  ) {
    orderService.setStatusOrderPaidById(id);

    return ResponseEntity.status(200).body("Success");
  }

  @PostMapping("/{id}/status-cancel")
  public ResponseEntity<?> setCancelledStatusOrderById(
      @PathVariable("id") Integer id
  ) {
    return ResponseEntity.status(200).body(orderService.setCancelledStatusOrderById(id));
  }


//  @DeleteMapping("/{id}")
//  public ResponseEntity<?> deleteOrdersById(
//      @PathVariable("id") Integer id
//  ) {
//    orderService.deleteOrderById(id);
//
//    return ResponseEntity.status(200).body("Success");
//  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/{start}/{end}")
  public ResponseEntity<?> getAllOrderByDate(
      @PathVariable("start") String start,
      @PathVariable("end") String end
  ) {// cái này mình chưa dùng vì không kịp
    return ResponseEntity.status(200).body(orderService.getAllOrdersByDate(Date.valueOf(start), Date.valueOf(end)));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/year")
  public ResponseEntity<?> getAllOrderByYear(
      @RequestParam("year") Integer year
  ) {// cái này cx ko kịp nên mình để tạm vậy
    return ResponseEntity.status(200).body(orderService.getAllOrdersByYear(year));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/date-revenue/{start}/{end}")
  public ResponseEntity<?> getRevenueByDate(
      @PathVariable("start") String start,
      @PathVariable("end") String end
  ) {
    return ResponseEntity.status(200).body(orderService.getRevenueByDate(Date.valueOf(start), Date.valueOf(end)));
  }

  //    @PreAuthorize("hasRole('ADMIN')")
  @GetMapping("/year-revenue")
  public ResponseEntity<?> getRevenueByYear(
      @RequestParam("year") Integer year
  ) {
    return ResponseEntity.status(200).body(orderService.getRevenueByYear(year));
  }

  @DeleteMapping("/delete/{id}")
  public ResponseEntity<?> deleteOrder(@PathVariable("id")Integer id) {
    return ResponseEntity.status(201).body(orderService.deleteOrderById(id));
  }
}
