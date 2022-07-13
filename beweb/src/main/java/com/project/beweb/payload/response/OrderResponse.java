package com.project.beweb.payload.response;

import com.project.beweb.model.Product;
import com.project.beweb.model.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class OrderResponse {

  private Integer orderId;

  private List<Product> products;

  private Long totalAmount;

  private String address;

  private String phoneNumber;

  private User user;

  private String note;

  private String statusOrder;

  private String date;

  private String nameShipper;

}
