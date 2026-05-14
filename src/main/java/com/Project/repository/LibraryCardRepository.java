package com.Project.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.Project.Entity.LibraryCard;

@Repository
public interface LibraryCardRepository extends JpaRepository<LibraryCard, Integer> {
}
