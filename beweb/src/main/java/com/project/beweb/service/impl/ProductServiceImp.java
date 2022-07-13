package com.project.beweb.service.impl;

import com.project.beweb.dto.ProductDTO;
import com.project.beweb.exception.DuplicateException;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.Category;
import com.project.beweb.model.Product;
import com.project.beweb.model.Supplier;
import com.project.beweb.repository.ProductRepository;
import com.project.beweb.service.AmazonClientService;
import com.project.beweb.service.CategoryService;
import com.project.beweb.service.ProductService;
import com.project.beweb.service.SupplierService;
import com.project.beweb.utils.Constants;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImp implements ProductService {
  @Autowired
  private ProductRepository productRepository;

  @Autowired
  private CategoryService categoryService;

  @Autowired
  private SupplierService supplierService;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired
  private AmazonClientService amazonClientService;

  @Override
  public Product getProductById(Integer id) {
    return productRepository.findById(id).orElse(null);
  }

  private List<Product> split(List<Product> products, Integer page) {
    int totalPage = (int) Math.ceil((double)products.size() / Constants.SIZE_OF_PAGE);
    if (totalPage <= page) {
      return new ArrayList<>();
    }
    if((page+1) * Constants.SIZE_OF_PAGE >= products.size()) {
      return products.subList(page * Constants.SIZE_OF_PAGE, products.size());
    }
    return products.subList(page * Constants.SIZE_OF_PAGE, (page+1) * Constants.SIZE_OF_PAGE);
  }

  @Override
  public List<Product> getAllProduct(Integer page) {
    List<Product> products =
        productRepository.findAll(Sort.by("productId")).stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    if (page != null) {
      return split(products, page);
    }
    return products;
  }

  @Override
  public List<Product> getAllProductByCategoryId(Integer categoryId, Integer page) {
    List<Product> products = productRepository.findAllByCategory_CategoryIdAndIsDeleteFalse(categoryId);
    if(page != null) {
      return split(products, page);
    }
    return products;
  }

  @Override
  public List<Product> getAllProductByCategoryId(Integer categoryId) {
    List<Product> products = productRepository.findAllByCategory_CategoryIdAndIsDeleteFalse(categoryId);
    return products;
  }

  @Override
  public List<Product> getAllProductByPrice(Integer start, Integer end, Integer page) {
    List<Product> products = productRepository.findAllByUnitPriceBetween(start, end)
        .stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    if(page != null) {
      return split(products, page);
    }
    return products;
  }

  @Override
  public List<Product> searchProduct(String key) {
    return productRepository.findAllByProductNameContainingAndIsDeleteFalse(key);
  }

  @Override
  public Product createNewProduct(Integer categoryId, Integer supplierId, ProductDTO productDTO, MultipartFile file) {
    Product product = productRepository.findByProductName(productDTO.getProductName());

    Category category = categoryService.getCategoryById(categoryId);

    Supplier supplier = supplierService.getSupplierById(supplierId);

    if (product != null) {
      throw new DuplicateException("Sản phẩm: " + productDTO.getProductName() + "đã tồn tại");
    }

    if (file != null) {
      productDTO.setProductImage(amazonClientService.uploadFile(file));
    }
    product = modelMapper.map(productDTO, Product.class);
    product.setCategory(category);
    product.setSupplier(supplier);

    return save(product);
  }

  @Override
  public Product changeInformationById(Integer id, ProductDTO productDTO, MultipartFile file) {
    Product product = getProductById(id);
    if (product == null) {
      throw new NotFoundException("Can not find by id: " + id);
    }

//    Product productNew = ConvertObject.convertProductDTOToProduct(product, productDTO);
    product.setProductName(productDTO.getProductName());
    product.setQuantity(productDTO.getQuantity());
    product.setDiscount(productDTO.getDiscount());
    product.setUnitPrice(productDTO.getUnitPrice());
    product.setDescriptionProduct(productDTO.getDescriptionProduct());
    if (file != null) {
      product.setProductImage(amazonClientService.uploadFile(file));
    }

    return save(product);
  }

  @Override
  public Product changeAvtById(Integer id, MultipartFile file) {
    Product product = getProductById(id);
    if (product == null) {
      throw new NotFoundException("Can not find by id: " + id);
    }

    if (file != null) {
      product.setProductImage(amazonClientService.uploadFile(file));
    }

    return save(product);
  }

  @Override
  public Product save(Product product) {
    return productRepository.save(product);
  }

  @Override
  public void deleteById(Integer id) {
    Product product = getProductById(id);
    if (product == null) {
      throw new NotFoundException("Can not find by id: " + id);
    }

    product.setDelete(true);
    save(product);
  }

  @Override
  public List<Product> search(Integer categoryId, Integer supplierId, Integer page) {
    List<Product> products = productRepository.findAll().stream().
        filter(item -> item.getCategory().getCategoryId().equals(categoryId) &&
            item.getSupplier().getSupplierId().equals(supplierId)).collect(Collectors.toList());
    return page != null ? split(products, page) : products  ;
  }

  @Override
  public List<Product> getAllProductBySupplierId(Integer supplierId, Integer page) {
    List<Product> products = productRepository.findAllBySupplier_SupplierId(supplierId);
    products = products.stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    if(page != null) {
      return split(products, page);
    }
    return products;
  }

  // loc 3 cai
  @Override
  public List<Product> searchMore(Integer categoryId, Integer supplierId,Integer start, Integer end, Integer page) {

    List<Product> products = new ArrayList();
    // loc gia
    if (categoryId == 0 && supplierId == 0 && start != 0 && end != 0 ) {
      products = productRepository.fitterPrice(start, end)
              .stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    }
    // loc hang
    else if (categoryId == 0 && supplierId != 0 && start == 0 && end == 0) {

      products = productRepository.findAll().stream().
              filter(item -> !item.isDelete() && item.getSupplier().getSupplierId().equals(supplierId)).collect(Collectors.toList());
    }

    // loc cate
    else if (categoryId != 0 && supplierId == 0 && start == 0 && end == 0) {

      products = productRepository.findAll().stream().
              filter(item -> !item.isDelete() && item.getCategory().getCategoryId().equals(categoryId)).collect(Collectors.toList());
    }


    // loc gia, cate
    else if (categoryId != 0 && supplierId == 0 && start != 0 && end != 0) {

      products = productRepository.fitterPrice(start, end)
              .stream().filter(item -> !item.isDelete() && item.getCategory().getCategoryId().equals(categoryId)).collect(Collectors.toList());
    }

    // loc hang, gia
    else if (categoryId == 0 && supplierId != 0 && start != 0 && end != 0) {

      products = productRepository.fitterPrice(start, end)
              .stream().filter(item -> !item.isDelete() && item.getSupplier().getSupplierId().equals(supplierId)).collect(Collectors.toList());
    }

    // loc cate, hang

    else if (categoryId != 0 && supplierId != 0 && start == 0 && end == 0) {

      products = productRepository.findAll().stream().
              filter(item -> item.getCategory().getCategoryId().equals(categoryId) &&
                      item.getSupplier().getSupplierId().equals(supplierId)).collect(Collectors.toList());
    }

    // loc ca 3
    else if (categoryId != 0 && supplierId != 0 && start != 0 && end != 0) {

      //products1 = productRepository.findAllByUnitPriceBetweenAndCategory_CategoryIdAndSupplier_SupplierIdAndIsDeleteFalse(categoryId,supplierId,start,end);
      List<Product>  products1 = productRepository.fitterPrice(start, end);
      products =  products1.stream().filter(item -> item.getCategory().getCategoryId().equals(categoryId) &&
              item.getSupplier().getSupplierId().equals(supplierId)).collect(Collectors.toList());
    }

    else
    {
      return products;
    }

    return page != null ? split(products, page) : products;
  }

  @Override
  public List<Product> getAllProductBySupplierId(Integer supplierId) {
    return productRepository.findAllBySupplier_SupplierId(supplierId);
  }



}
