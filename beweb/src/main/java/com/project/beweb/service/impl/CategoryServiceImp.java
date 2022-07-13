package com.project.beweb.service.impl;

import com.project.beweb.dto.CategoryDTO;
import com.project.beweb.exception.DuplicateException;
import com.project.beweb.exception.NotFoundException;
import com.project.beweb.model.Category;
import com.project.beweb.model.Product;
import com.project.beweb.repository.CategoryRepository;
import com.project.beweb.service.CategoryService;
import com.project.beweb.service.ProductService;
import com.project.beweb.utils.Constants;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImp implements CategoryService {
    @Autowired private CategoryRepository categoryRepository;

    @Autowired private ModelMapper modelMapper;

    @Autowired private ProductService productService;

    @Override
    public Category getCategoryById(Integer id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @Override
    public List<Category> getAllCategory() {
        return categoryRepository.findAll(Sort.by("categoryId")).stream().filter(item -> !item.isDelete()).collect(Collectors.toList());
    }

    @Override
    public List<Category> getAllCategoryAndDelete() {
        return categoryRepository.findAll();
    }

    @Override
    public Category createNewCategory(CategoryDTO categoryDTO) {
        Category category = categoryRepository.findByCategoryName(categoryDTO.getCategoryName());
        if(category != null) {
            throw new DuplicateException("Duplicate name of category: " + categoryDTO.getCategoryName());
        }
        return save(modelMapper.map(categoryDTO, Category.class));
    }

    @Override
    public Category save(Category category) {
        return categoryRepository.save(category);
    }

    @Override
    public void deleteById(Integer id) {
        Category category = getCategoryById(id);
        if(category == null) {
            throw new NotFoundException("Can not find category id: " + id);
        }
        for (Product product : productService.getAllProductByCategoryId(id)) {
            productService.deleteById(product.getProductId());
        }

        category.setDelete(true);
        save(category);
    }

    @Override
    public Category editCategory(Integer id, CategoryDTO categoryDTO) {
        Category category = getCategoryById(id);
        category.setCategoryName(categoryDTO.getCategoryName());
        return save(category);
    }
}
