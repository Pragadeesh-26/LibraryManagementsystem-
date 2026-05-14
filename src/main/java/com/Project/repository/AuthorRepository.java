package com.Project.repository;


import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.model.Author;


public interface AuthorRepository extends JpaRepository<Author,Integer>{

    
}
