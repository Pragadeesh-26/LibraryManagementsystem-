package com.Project.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Project.model.School;
import com.Project.repository.SchoolRepository;

@RestController
@RequestMapping("/api/school")
@CrossOrigin(origins = "http://localhost:5173")
public class SchoolController {

    @Autowired
    private SchoolRepository sr;

    @GetMapping
    public List<School> getAllSchool() {
        return sr.findAll();
    }

    @PostMapping
    public ResponseEntity<School> createSchool(@RequestBody School s) {
        // If 'name' is null in the JSON, Spring throws a 400. 
        // We save and return the object.
        School savedSchool = sr.save(s);
        return ResponseEntity.ok(savedSchool);
    }

    @PutMapping("/{id}")
    public ResponseEntity<School> updateSchool(@PathVariable int id, @RequestBody School s) {
        return sr.findById(id)
                .map(cs -> {
                    cs.setName(s.getName()); // Use the correct setter
                    return ResponseEntity.ok(sr.save(cs));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchool(@PathVariable int id) {
        sr.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}