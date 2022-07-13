package com.project.beweb.controller;

import com.project.beweb.dto.SupplierDTO;
import com.project.beweb.service.SupplierService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RequestMapping(Constants.BASE_URI_V1 + "suppliers")
@RestController
public class SupplierController {
  @Autowired
  private SupplierService supplierService;

  @GetMapping
  public ResponseEntity<?> getAllSupplier(@RequestParam(value = "page", required = false) Integer page) {
    return ResponseEntity.status(200).body(supplierService.getAllSupplier(page));
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getSupplierById(@PathVariable("id") Integer id) {
    return ResponseEntity.status(200).body(supplierService.getSupplierById(id));
  }

  @PostMapping
  public ResponseEntity<?> createNewSupplier(@RequestBody SupplierDTO supplierDTO) {
    return ResponseEntity.status(200).body(supplierService.createNewSupplier(supplierDTO));
  }

  @PatchMapping("/{id}")
  public ResponseEntity<?> editInformationSupplierById(
      @PathVariable("id") Integer id,
      @RequestBody SupplierDTO supplierDTO,
      @RequestPart(value = "avt", required = false) MultipartFile file
  ) {
    return ResponseEntity.status(200).body(supplierService.editInformationById(id, supplierDTO, file));
  }

  @PatchMapping("/{id}/avt")
  public ResponseEntity<?> changeAvt(@PathVariable("id") Integer id, @RequestPart("avt") MultipartFile file) {
    return ResponseEntity.status(200).body(supplierService.editAvt(id, file));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteSupplierById(@PathVariable("id") Integer id) {
    supplierService.deleteById(id);

    return ResponseEntity.status(200).body("Success");
  }
}
