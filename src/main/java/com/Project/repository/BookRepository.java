package com.Project.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Project.model.Book;

public interface BookRepository extends JpaRepository<Book, Integer> {

    // Standard method to fetch all books in alphabetical order
    List<Book> findAllByOrderByTitleAsc();

    @Query("SELECT b FROM Book b " +
           "WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(b.author.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(b.publisher.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "   OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY b.title ASC") // Added alphabetical sorting here
    List<Book> searchBooks(@Param("keyword") String keyword);
}