package com.project.beweb.controller;

import com.project.beweb.dto.CategoryDTO;
import com.project.beweb.service.CategoryService;
import com.project.beweb.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping(Constants.BASE_URI_V1 + "categories")
public class CategoryController {
  @Autowired
  private CategoryService categoryService;

  @GetMapping
  public ResponseEntity<?> getAllCategory(@RequestParam(value = "all", required = false) String all) {
    if (all != null && all.equals("true")) {
      return ResponseEntity.status(200).body(categoryService.getAllCategoryAndDelete());
    }
    return ResponseEntity.status(200).body(categoryService.getAllCategory());
  }

  @GetMapping("/{id}")
  public ResponseEntity<?> getCategoryById(@PathVariable("id") Integer id) {
    return ResponseEntity.status(200).body(categoryService.getCategoryById(id));
  }

  //  @PreAuthorize("hasAnyRole('ADMIN')")
  @PostMapping
  public ResponseEntity<?> createNewCategory(@RequestBody CategoryDTO categoryDTO) {
    return ResponseEntity.status(201).body(categoryService.createNewCategory(categoryDTO));
  }

  //    @PreAuthorize("hasAnyRole('ADMIN')")
  @DeleteMapping("/{id}")
  public ResponseEntity<?> deleteCategoryById(@PathVariable("id") Integer id) {
    categoryService.deleteById(id);
    return ResponseEntity.status(200).body("Success");
  }

  @PatchMapping("/{id}")
  public ResponseEntity<?> editCategory(@PathVariable("id") Integer id, @RequestBody CategoryDTO categoryDTO) {
    return ResponseEntity.status(201).body(categoryService.editCategory(id, categoryDTO));
  }

}
