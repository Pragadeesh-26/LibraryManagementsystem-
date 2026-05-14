package com.Project.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.Project.model.BorrowRecord;

public interface BorrowRecordRepository extends JpaRepository<BorrowRecord, Integer> {
    @Query("SELECT b FROM BorrowRecord b WHERE b.book.id = :bookId AND b.status = 'BORROWED' ORDER BY b.borrowDate DESC")
    BorrowRecord findFirstByBookIdOrderByBorrowDateDesc(@Param("bookId") int bookId);
    @Query("SELECT b FROM BorrowRecord b WHERE b.status = 'BORROWED' AND b.dueDate < CURRENT_DATE")
    List<BorrowRecord> findOverdueBooks();
}
