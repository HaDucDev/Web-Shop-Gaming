package com.project.beweb.repository;

import com.project.beweb.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findAllByProductNameContainingAndIsDeleteFalse(String key);
    List<Product> findAllByCategory_CategoryIdAndIsDeleteFalse(Integer categoryId);
    List<Product> findAllBySupplier_SupplierId(Integer supplierId);
    List<Product> findAllByUnitPriceBetween(Integer start, Integer end);
    Product findByProductName(String name);

    @Modifying
    @Query("SELECT p FROM Product p WHERE p.unitPrice-p.unitPrice*(p.discount/100) >= :start AND p.unitPrice-p.unitPrice*(p.discount/100) <= :end1 ")
    List<Product> fitterPrice(@Param("start")Integer start, @Param("end1") Integer end);// AND p.isDelete = false
}