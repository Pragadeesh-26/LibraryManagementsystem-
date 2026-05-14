package com.Project.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.model.Category;

public interface CategoryRepository extends JpaRepository<Category,Integer>{
    
}