package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "carts")
public class Cart {
  @EmbeddedId
  private CartIDKey id;

  private Integer quantity;

  private boolean isDelete;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id", nullable = false, referencedColumnName = "user_id", insertable = false, updatable =
      false)
  @JsonBackReference
  private User user;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "product_id", nullable = false, referencedColumnName = "product_id", insertable = false,
      updatable = false)
  @JsonBackReference
  private Product product;

}
