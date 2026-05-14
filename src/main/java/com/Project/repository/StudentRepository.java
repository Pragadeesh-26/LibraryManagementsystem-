package com.Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.Project.model.Student;

public interface StudentRepository extends JpaRepository<Student,Integer>{
    
}
