package com.Project.repository;

import com.Project.Entity.User;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
	boolean existsByEmail(String email);
    // Add this to search by the name typed in the Login Page
    Optional<User> findByName(String name);
}