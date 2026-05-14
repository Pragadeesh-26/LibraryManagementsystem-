package com.Project.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.Project.model.Book;
import com.Project.model.BorrowRecord;
import com.Project.repository.AuthorRepository;
import com.Project.repository.BookRepository;
import com.Project.repository.BorrowRecordRepository;
import com.Project.repository.CategoryRepository;
import com.Project.repository.PublisherRepository;

@RestController
@RequestMapping("/api/books")
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {

    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final CategoryRepository categoryRepository;
    private final BorrowRecordRepository borrowRecordRepository;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + "/uploads";

    public BookController(BookRepository bookRepository,
                          AuthorRepository authorRepository,
                          PublisherRepository publisherRepository,
                          CategoryRepository categoryRepository,
                          BorrowRecordRepository borrowRecordRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.categoryRepository = categoryRepository;
        this.borrowRecordRepository = borrowRecordRepository;
    }

    // ✅ UPDATED: Now returns books in Alphabetical Order (A-Z)
    @GetMapping
    public List<Book> getAllBooks() {
        return bookRepository.findAllByOrderByTitleAsc();
    }

    // ✅ Note: searchBooks in the Repository was also updated with ORDER BY b.title ASC
    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam("q") String keyword) {
        return bookRepository.searchBooks(keyword);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getBookById(@PathVariable int id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        BorrowRecord borrowed = borrowRecordRepository.findFirstByBookIdOrderByBorrowDateDesc(id);

        Map<String, Object> response = new HashMap<>();
        response.put("id", book.getId());
        response.put("title", book.getTitle());
        response.put("description", book.getDescription());
        response.put("image", book.getImage());
        response.put("shelf", book.getShelf());
        response.put("quantity", book.getQuantity()); 
        response.put("author", book.getAuthor());
        response.put("publisher", book.getPublisher());
        response.put("category", book.getCategory());
        
        response.put("status", book.getQuantity() > 0 ? "AVAILABLE" : "OUT OF STOCK");
        response.put("borrowedBy", borrowed != null ? borrowed.getMember().getName() : null);

        return ResponseEntity.ok(response);
    }

    @PostMapping(consumes = {"multipart/form-data"})
    public String addBook(@RequestParam String title,
                          @RequestParam(required = false) Integer authorId,
                          @RequestParam(required = false) Integer publisherId,
                          @RequestParam(required = false) Integer categoryId,
                          @RequestParam(required = false) String shelf,
                          @RequestParam(required = false) String description,
                          @RequestParam(required = false) Integer quantity,
                          @RequestParam(required = false) MultipartFile image) {
        Book book = new Book();
        book.setTitle(title);
        book.setShelf(shelf);
        book.setDescription(description);
        book.setQuantity(quantity != null ? quantity : 0); 

        setAuthorPublisherCategory(book, authorId, publisherId, categoryId);
        handleImageUpload(book, image);

        bookRepository.save(book);
        return "Book added successfully!";
    }

    @PutMapping(value = "/{id}", consumes = {"multipart/form-data"})
    public String updateBook(@PathVariable int id,
                             @RequestParam String title,
                             @RequestParam(required = false) Integer authorId,
                             @RequestParam(required = false) Integer publisherId,
                             @RequestParam(required = false) Integer categoryId,
                             @RequestParam(required = false) String shelf,
                             @RequestParam(required = false) String description,
                             @RequestParam(required = false) Integer quantity,
                             @RequestParam(required = false) MultipartFile image) {
        Book book = bookRepository.findById(id).orElse(null);
        if (book == null) return "Book not found!";

        book.setTitle(title);
        book.setShelf(shelf);
        book.setDescription(description);
        
        if (quantity != null) {
            book.setQuantity(quantity);
        }

        setAuthorPublisherCategory(book, authorId, publisherId, categoryId);
        handleImageUpload(book, image);

        bookRepository.save(book);
        return "Book updated successfully!";
    }
    
    @PutMapping("/{id}/return")
    public ResponseEntity<?> returnBook(
        @PathVariable int id, 
        @RequestParam(defaultValue = "RETURNED") String condition // Accepts RETURNED, LOST, or DAMAGED
    ) {
        // 1. Fetch the record
        BorrowRecord record = borrowRecordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Borrow record not found with ID: " + id));

        // 2. Set the return date
        LocalDate today = LocalDate.now();
        record.setReturnDate(today);

        // 3. Automated Fine Calculation (using the DueDate field we added)
        if (record.getDueDate() != null && today.isAfter(record.getDueDate())) {
            long daysLate = java.time.temporal.ChronoUnit.DAYS.between(record.getDueDate(), today);
            record.setFineAmount(daysLate * 5.0); // ₹5 per day
        } else {
            record.setFineAmount(0.0);
        }

        // 4. Update Status based on condition
        // Validates if the string matches your Enum (RETURNED, LOST, DAMAGED)
        try {
            record.setStatus(BorrowRecord.Status.valueOf(condition.toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid condition status provided.");
        }

        // 5. Inventory Management
        Book book = record.getBook();
        
        // Only put the book back in stock if it wasn't LOST
        if (record.getStatus() != BorrowRecord.Status.LOST) {
            book.setQuantity(book.getQuantity() + 1);
            bookRepository.save(book);
        }

        // 6. Save the record
        borrowRecordRepository.save(record);

        // 7. Response Map for React frontend
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Book processed successfully");
        response.put("fineAmount", record.getFineAmount());
        response.put("status", record.getStatus());
        
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public String deleteBook(@PathVariable int id) {
        if (!bookRepository.existsById(id)) return "Book not found!";
        bookRepository.deleteById(id);
        return "Book deleted successfully!";
    }

    private void setAuthorPublisherCategory(Book book, Integer authorId, Integer publisherId, Integer categoryId) {
        if (authorId != null) authorRepository.findById(authorId).ifPresent(book::setAuthor);
        if (publisherId != null) publisherRepository.findById(publisherId).ifPresent(book::setPublisher);
        if (categoryId != null) categoryRepository.findById(categoryId).ifPresent(book::setCategory);
    }

    private void handleImageUpload(Book book, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            try {
                Path uploadPath = Paths.get(UPLOAD_DIR);
                if (!Files.exists(uploadPath)) Files.createDirectories(uploadPath);

                String fileName = System.currentTimeMillis() + "_" + image.getOriginalFilename();
                Path filePath = uploadPath.resolve(fileName);
                Files.write(filePath, image.getBytes());
                book.setImage("/uploads/" + fileName);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload image!", e);
            }
        }
    }
}