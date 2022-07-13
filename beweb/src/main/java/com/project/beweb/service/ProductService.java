package com.project.beweb.service;

import com.project.beweb.dto.ProductDTO;
import com.project.beweb.model.Product;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProductService {
    Product getProductById(Integer id);
    List<Product> getAllProduct(Integer page);
    List<Product> getAllProductByCategoryId(Integer categoryId, Integer page);

    List<Product> getAllProductByCategoryId(Integer categoryId);
    List<Product> getAllProductByPrice(Integer start, Integer end, Integer page);
    List<Product> searchProduct(String key);
    Product createNewProduct(Integer categoryId, Integer supplierId, ProductDTO productDTO, MultipartFile file);
    Product changeInformationById(Integer id, ProductDTO productDTO, MultipartFile file);
    Product changeAvtById(Integer id, MultipartFile file);
    Product save(Product product);
    void deleteById(Integer id);

  List<Product> search(Integer categoryId, Integer supplierId, Integer page);

  List<Product> getAllProductBySupplierId(Integer supplierId, Integer page);

    List<Product> getAllProductBySupplierId(Integer supplierId);

  // loc 3 cai
  List<Product> searchMore(Integer categoryId, Integer supplierId,Integer start, Integer end, Integer page);
}
