package com.project.beweb.controller;

import com.project.beweb.dto.ProductDTO;
import com.project.beweb.service.ProductService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(Constants.BASE_URI_V1 + "products")
public class ProductController {
    @Autowired private ProductService productService;

    @GetMapping
    public ResponseEntity<?> getAllProduct(@RequestParam(value = "page", required = false) Integer page) {
        return ResponseEntity.status(200).body(productService.getAllProduct(page));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable("id") Integer id) {
        return ResponseEntity.status(200).body(productService.getProductById(id));
    }

    @GetMapping("/{categoryId}/category")
    public ResponseEntity<?> getProductByCategoryId2(@PathVariable("categoryId") Integer categoryId,
                                                    @RequestParam(value = "page", required = false) Integer page) {
        return ResponseEntity.status(200).body(productService.getAllProductByCategoryId(categoryId, page));
    }

    @GetMapping("/{supplierId}/supplier")
    public ResponseEntity<?> getProductBySupplierId(@PathVariable("supplierId") Integer supplierId,
                                                    @RequestParam("page") Integer page) {
        return ResponseEntity.status(200).body(productService.getAllProductBySupplierId(supplierId, page));
    }

    @GetMapping("/price")// cái này trước dùng lọc giá nhưng sau đó mình chuyển sang trang lọc luôn nên ko dùng đến nó nữa.
    public ResponseEntity<?> getProductByCategoryId(
        @RequestParam("start") Integer start,
        @RequestParam("end") Integer end,
        @RequestParam(value = "page", required = false) Integer page) {
        return ResponseEntity.status(200).body(productService.getAllProductByPrice(start, end, page));
    }
// loc 3 cai
    @GetMapping("/search/final/{categoryId}/{supplierId}/price")
    public ResponseEntity<?> searchMore(@PathVariable("categoryId") Integer categoryId,
                                        @PathVariable("supplierId") Integer supplierId,
                                        @RequestParam("start") Integer start,
                                        @RequestParam("end") Integer end,
                                        @RequestParam(name = "page", required = false) Integer page) {
        return ResponseEntity.status(200).body(productService.searchMore(categoryId, supplierId, start,end, page));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{cateId}/{supplierId}")
    public ResponseEntity<?> createNewProduct(
            @PathVariable("cateId") Integer cateId,
            @PathVariable("supplierId") Integer supplierId,
            @RequestBody ProductDTO productDTO,
            @RequestPart(value = "avt", required = false) MultipartFile file
    ) {
        return ResponseEntity.status(201).body(
                productService.createNewProduct(cateId, supplierId, productDTO, file));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/avt")
    public ResponseEntity<?> changeAvtById(
            @PathVariable("id") Integer id,
            @RequestPart(value = "file") MultipartFile file
    ) {
        return ResponseEntity.status(201).body(
                productService.changeAvtById(id, file));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}")
    public ResponseEntity<?> changeInfoById(
            @PathVariable("id") Integer id,
            @RequestBody ProductDTO productDTO,
            @RequestPart(value = "avt", required = false) MultipartFile file
    ) {
        return ResponseEntity.status(201).body(
                productService.changeInformationById(id, productDTO, file));
    }

//    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProductById(@PathVariable("id") Integer id) {
        productService.deleteById(id);

        return ResponseEntity.status(201).body("Success");
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchProduct(@RequestParam("q") String key) {
        return ResponseEntity.status(201).body(productService.searchProduct(key));
    }

    @GetMapping("/search/final/{categoryId}/{supplierId}")
    public ResponseEntity<?> search(@PathVariable("categoryId") Integer categoryId,
                                    @PathVariable("supplierId") Integer supplierId,
                                    @RequestParam(name = "page", required = false) Integer page) {
        return ResponseEntity.status(200).body(productService.search(categoryId, supplierId, page));
    }




}
