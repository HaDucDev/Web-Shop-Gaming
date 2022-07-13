package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Reviews {
  @EmbeddedId
  private ReviewsIdKey id;

  @Nationalized
  private String comments;

  private Integer rating;// lượt đánh giá của khách hàng

  private String dateCreate;

  private Boolean delete = Boolean.FALSE;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JsonBackReference
  @JoinColumn(name = "orders_id", nullable = false,referencedColumnName = "orders_id",insertable=false, updatable=false)
  private Orders orders;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JsonBackReference
  @JoinColumn (name = "product_id", nullable = false,referencedColumnName = "product_id",insertable=false, updatable=false)
  private Product product;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JsonBackReference
  @JoinColumn(name = "user_id",nullable = false,referencedColumnName = "user_id",insertable = false,updatable = false)
  private User user;

}
