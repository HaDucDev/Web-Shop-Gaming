package com.project.beweb.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.Nationalized;

import javax.persistence.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "category")
public class Category {
  //sản phẩm gồm máy tính, chuột, bàn phím, tai nghe
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "category_id")
  private Integer categoryId;

  @Nationalized
  private String categoryName;

  private boolean isDelete;

  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "category")
  @JsonManagedReference
  private Set<Product> productList;

  public Category(String categoryName) {
    this.categoryName = categoryName;
  }

  @Override
  public String toString() {
    return "CategoryEntity{" +
        "categoryId=" + categoryId +
        ", categoryName='" + categoryName + '\'' +
        ", productEntityList=" + productList +
        '}';
  }


}
