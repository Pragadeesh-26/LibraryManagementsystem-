package com.Project.model;

import jakarta.persistence.*;

@Entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    private int rating;
    private String comment;

    // Standard Getters and Setters...
    public School getSchool() { return school; }
    public void setSchool(School school) { this.school = school; }
    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
}
