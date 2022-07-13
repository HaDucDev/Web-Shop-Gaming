package com.project.beweb.service.impl;

import com.project.beweb.dto.SupplierDTO;
import com.project.beweb.exception.DuplicateException;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.Product;
import com.project.beweb.model.Supplier;
import com.project.beweb.repository.SupplierRepository;
import com.project.beweb.service.AmazonClientService;
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
public class SupplierServiceImp implements SupplierService {
  @Autowired
  private SupplierRepository supplierRepository;

  @Autowired
  private ModelMapper modelMapper;

  @Autowired private ProductService productService;

  @Autowired
  private AmazonClientService amazonClientService;

  @Override
  public Supplier getSupplierById(Integer id) {
    Supplier supplier = supplierRepository.findById(id).orElse(null);
    if (supplier == null) {
      throw new NotFoundException("Can not find Supplier by id: " + id);
    }
    return supplier;
  }

  private List<Supplier> split(List<Supplier> suppliers, Integer page) {
    int totalPage = (int) Math.ceil((double) suppliers.size() / Constants.SIZE_OF_PAGE);
    if (totalPage <= page) {
      return new ArrayList<>();
    }
    if ((page + 1) * Constants.SIZE_OF_PAGE >= suppliers.size()) {
      return suppliers.subList(page * Constants.SIZE_OF_PAGE, suppliers.size());
    }
    return suppliers.subList(page * Constants.SIZE_OF_PAGE, (page + 1) * Constants.SIZE_OF_PAGE);
  }

  @Override
  public List<Supplier> getAllSupplier(Integer page) {
    List<Supplier> suppliers =
        supplierRepository.findAll(Sort.by("supplierId")).stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    if (page != null) {
      return split(suppliers, page);
    }
    return suppliers;
  }

  @Override
  public Supplier createNewSupplier(SupplierDTO supplierDTO) {
    Supplier supplier = supplierRepository.findBySupplierName(supplierDTO.getSupplierName());
    if (supplier != null) {
      throw new DuplicateException("Duplicate Supplier name: " + supplierDTO.getSupplierName());
    }

    return save(modelMapper.map(supplierDTO, Supplier.class));
  }

  @Override
  public Supplier editInformationById(Integer id, SupplierDTO supplierDTO, MultipartFile file) {
    Supplier supplier = getSupplierById(id);

    if (file != null) {
      supplier.setSupplierImage(amazonClientService.uploadFile(file));
    }
    supplier.setSupplierName(supplierDTO.getSupplierName());

    return save(supplier);
  }

  @Override
  public Supplier editAvt(Integer id, MultipartFile file) {
    Supplier supplier = getSupplierById(id);
    if (file != null) {
      supplier.setSupplierImage(amazonClientService.uploadFile(file));
    }
    return save(supplier);
  }

  @Override
  public Supplier save(Supplier supplier) {
    return supplierRepository.save(supplier);
  }

  @Override
  public void deleteById(Integer id) {
    Supplier supplier = getSupplierById(id);

    for (Product product : productService.getAllProductBySupplierId(id)) {
      productService.deleteById(product.getProductId());// cai nay ko can phan trang vi tim tat ca de xoa thoi
      // con get kia co phan trang vi loc o menu ma.
    }

    supplier.setDelete(true);
    save(supplier);
  }
}
