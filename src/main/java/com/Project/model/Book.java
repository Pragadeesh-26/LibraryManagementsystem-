package com.Project.model;

import java.time.LocalDateTime;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "books")
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id; // Changed to Integer to fix JSON mapping errors

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "author_id")
    private Author author;

    @ManyToOne
    @JoinColumn(name = "publisher_id")
    private Publisher publisher;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    private String shelf;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image")
    private String image;

    // ✅ ADDED: Inventory Fields
    @Column(nullable = false)
    private int quantity = 0; 

    @Column(nullable = false)
    private String status = "NOT AVAILABLE";

    @Column(name = "created_at", columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    // Default constructor
    public Book() {}

    // Parameterized constructor
    public Book(String title, Author author, Publisher publisher, Category category, String shelf, String description, String image) {
        this.title = title;
        this.author = author;
        this.publisher = publisher;
        this.category = category;
        this.shelf = shelf;
        this.description = description;
        this.image = image;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    // ✅ ADDED: Logic-driven Getters and Setters
    public int getQuantity() { return quantity; }

    public void setQuantity(int quantity) { 
        this.quantity = quantity;
        // Automatically update status based on stock level
        this.status = (this.quantity > 0) ? "AVAILABLE" : "NOT AVAILABLE";
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Author getAuthor() { return author; }
    public void setAuthor(Author author) { this.author = author; }

    public Publisher getPublisher() { return publisher; }
    public void setPublisher(Publisher publisher) { this.publisher = publisher; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getShelf() { return shelf; }
    public void setShelf(String shelf) { this.shelf = shelf; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImage() { return image; }
    public void setImage(String image) { this.image = image; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}