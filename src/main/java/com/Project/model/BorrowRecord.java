package com.Project.model;

import java.time.LocalDate;
import jakarta.persistence.*;

@Entity
@Table(name = "borrow_records")
public class BorrowRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne
    @JoinColumn(name = "member_id", nullable = true)
    private Member member;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = true)
    private Student student;

    private String borrowerType; // "MEMBER" or "STUDENT"
    
    private LocalDate borrowDate;
    private LocalDate dueDate;   // NEW: Required for fine calculation
    private LocalDate returnDate;

    // NEW: Financial Tracking
    private Double fineAmount = 0.0;
    private Boolean isFinePaid = false;

    @Enumerated(EnumType.STRING)
    private Status status;

    // UPDATED: Expanded statuses for school accountability
    public enum Status {
        BORROWED, 
        RETURNED, 
        LOST,      // NEW: For loss tracking
        DAMAGED    // NEW: For condition tracking
    }

    // --- NEW GETTERS AND SETTERS ---

    public LocalDate getDueDate() { return dueDate; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }

    public Double getFineAmount() { return fineAmount; }
    public void setFineAmount(Double fineAmount) { this.fineAmount = fineAmount; }

    public Boolean getIsFinePaid() { return isFinePaid; }
    public void setIsFinePaid(Boolean isFinePaid) { this.isFinePaid = isFinePaid; }

    // --- EXISTING GETTERS AND SETTERS ---

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Book getBook() { return book; }
    public void setBook(Book book) { this.book = book; }

    public Member getMember() { return member; }
    public void setMember(Member member) { this.member = member; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public String getBorrowerType() { return borrowerType; }
    public void setBorrowerType(String borrowerType) { this.borrowerType = borrowerType; }

    public LocalDate getBorrowDate() { return borrowDate; }
    public void setBorrowDate(LocalDate borrowDate) { this.borrowDate = borrowDate; }

    public LocalDate getReturnDate() { return returnDate; }
    public void setReturnDate(LocalDate returnDate) { this.returnDate = returnDate; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }
}

