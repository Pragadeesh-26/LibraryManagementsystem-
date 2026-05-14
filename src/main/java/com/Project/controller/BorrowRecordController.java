package com.Project.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional; // Added for data safety
import org.springframework.web.bind.annotation.*;

import com.Project.model.Book;
import com.Project.model.BorrowRecord;
import com.Project.repository.BorrowRecordRepository;
import com.Project.repository.BookRepository; // Added this repository

@RestController
@RequestMapping("/api/borrow")
@CrossOrigin(origins = "http://localhost:5173")
public class BorrowRecordController {

    @Autowired
    private BorrowRecordRepository borrowRecordRepository;

    @Autowired
    private BookRepository bookRepository; // Added to access book quantity

    @GetMapping
    public List<BorrowRecord> getAllBorrowRecords() {
        return borrowRecordRepository.findAll();
    }

    @PostMapping
    @Transactional // Ensures both record saving and quantity update happen together
    public BorrowRecord createBorrowRecord(@RequestBody BorrowRecord record) {
    	
        Book book = bookRepository.findById(record.getBook().getId()).orElseThrow();
        if (book.getQuantity() > 0) {
            book.setQuantity(book.getQuantity() - 1);
            bookRepository.save(book);
        }

        record.setBorrowDate(LocalDate.now());
        record.setStatus(BorrowRecord.Status.BORROWED);
        return borrowRecordRepository.save(record);
    }

    @PutMapping("/{id}/return")
    @Transactional
    public BorrowRecord returnBook(@PathVariable int id) {
        BorrowRecord record = borrowRecordRepository.findById(id).orElseThrow();
        
        if (record.getStatus() == BorrowRecord.Status.BORROWED) {
            Book book = record.getBook();
            book.setQuantity(book.getQuantity() + 1);
            bookRepository.save(book);
            // This records the ACTUAL day they brought it back
            record.setReturnDate(LocalDate.now()); 
            record.setStatus(BorrowRecord.Status.RETURNED);
        }
        return borrowRecordRepository.save(record);
    }
    @GetMapping("/overdue")
    public ResponseEntity<List<BorrowRecord>> getOverdueBooks() {
        // This assumes you have the custom query in your Repository
        List<BorrowRecord> overdueRecords = borrowRecordRepository.findOverdueBooks();
        return ResponseEntity.ok(overdueRecords);
    }
}