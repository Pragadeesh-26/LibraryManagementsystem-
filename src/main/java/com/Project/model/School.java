package com.Project.model;
import jakarta.persistence.*;

@Entity
@Table(name = "schools") // Good practice to specify table name
public class School {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String name;

    // MANDATORY: Default constructor for Jackson (JSON parser)
    public School() {}

    // Constructor for easy object creation
    public School(String name) {
        this.name = name;
    }

    // Getters and Setters (CRITICAL for Spring to "see" the data)
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
}