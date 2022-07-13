package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "order_detail")
public class OrderDetail {

  @EmbeddedId
  private OrderDetailIDKey id;

  private Integer quantity;

  private Long amount;

  private boolean isDelete;

  private String isReview;// trạng thái đánh giá sản phẩm được mua

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "orders_id", nullable = false, referencedColumnName = "orders_id", insertable = false, updatable = false)
  @JsonBackReference
  @JsonIgnore
  private Orders orders;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "product_id", nullable = false, referencedColumnName = "product_id", insertable = false, updatable = false)
  @JsonBackReference
  private Product product;

}
