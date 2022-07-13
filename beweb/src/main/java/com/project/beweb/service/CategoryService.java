package com.project.beweb.service;

import com.project.beweb.dto.CategoryDTO;
import com.project.beweb.model.Category;

import java.util.List;

public interface CategoryService {
  Category getCategoryById(Integer id);

  List<Category> getAllCategory();

  List<Category> getAllCategoryAndDelete();

  Category createNewCategory(CategoryDTO categoryDTO);

  Category save(Category category);

  void deleteById(Integer id);

  Category editCategory(Integer id, CategoryDTO categoryDTO);
}
