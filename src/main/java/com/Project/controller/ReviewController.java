package com.Project.controller;

import com.Project.model.Review;
import com.Project.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews") // This MUST match the React fetch URL
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @GetMapping
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    @PostMapping
    public Review postReview(@RequestBody Review review) {
        // Spring handles mapping the school {id} and student {id} automatically
        return reviewRepository.save(review);
    }
}
