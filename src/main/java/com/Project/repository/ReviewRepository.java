package com.Project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.Project.model.Review;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    
}
