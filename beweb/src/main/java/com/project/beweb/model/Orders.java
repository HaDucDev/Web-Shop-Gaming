package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.sql.Timestamp;
import java.util.Set;

@Entity
@Table(name = "orders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Orders {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "orders_id", nullable = false)
  private Integer ordersId;

  @Nationalized
  private String address;

  private String phoneNumber;

  private Long totalAmount;

  @Nationalized
  private String note;

  @Nationalized
  private String statusOrder;

  private boolean isDelete;

  private Integer shipperId;

  @CreationTimestamp
  private Timestamp createDate;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "orders")
  @JsonIgnore
  private Set<OrderDetail> orderDetailEntities;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "orders")
  @JsonIgnore
  private Set<Reviews> reviewsEntities;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "user_id")
  private User user;

}
