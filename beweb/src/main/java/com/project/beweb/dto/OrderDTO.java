package com.project.beweb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Integer statusCode;
    private String address;
    private String phoneNumber;
    private String note;
    private String statusOrder;
    private List<OrderProductDTO> orderProductDTOS;
}
