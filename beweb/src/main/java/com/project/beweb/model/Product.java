package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.util.Objects;
import java.util.Set;

@Table(name = "product")
@Entity
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Product {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "product_id")
  private Integer productId;

  @Nationalized
  private String productName;

  private Integer quantity;

  private String productImage;

  private Integer discount;

  private Integer unitPrice;

  @Nationalized
  private String descriptionProduct;

  private boolean isDelete;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "category_id")
  @JsonBackReference
  private Category category;

  @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
  @JoinColumn(name = "supplier_id")
  @JsonBackReference
  private Supplier supplier;

  @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
  @JsonManagedReference
  @JsonIgnore
  private Set<Cart> cartEntities;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "product")
  @JsonBackReference
  @JsonIgnore
  private Set<OrderDetail> productEntities;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "product")
  @JsonManagedReference
  @JsonIgnore
  private Set<Reviews> reviewsEntities;

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;

    Product product = (Product) o;

    return Objects.equals(productId, product.productId);
  }

  @Override
  public int hashCode() {
    return productId != null ? productId.hashCode() : 0;
  }
}
