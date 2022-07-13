package com.project.beweb.service;

import com.project.beweb.dto.SupplierDTO;
import com.project.beweb.model.Supplier;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface SupplierService {
    Supplier getSupplierById(Integer id);
    List<Supplier> getAllSupplier(Integer page);
    Supplier createNewSupplier(SupplierDTO supplierDTO);
    Supplier editInformationById(Integer id, SupplierDTO supplierDTO, MultipartFile file);
    Supplier editAvt(Integer id, MultipartFile file);
    Supplier save(Supplier supplier);
    void deleteById(Integer id);
}
