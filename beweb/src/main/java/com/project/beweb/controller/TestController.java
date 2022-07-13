package com.project.beweb.controller;

import com.project.beweb.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
public class TestController {

  private final OrderService orderService;

  public TestController(OrderService orderService) {
    this.orderService = orderService;
  }
  @GetMapping("/hi")
  public ResponseEntity<?> test() {
    return ResponseEntity.ok(orderService.getTheLeastSingleShipper(null));
  }

}
