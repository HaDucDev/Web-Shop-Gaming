package com.project.beweb.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
  private String productName;
  private Integer quantity;
  private String productImage;
  private Integer discount;
  private Integer unitPrice;
  private String descriptionProduct;
}
