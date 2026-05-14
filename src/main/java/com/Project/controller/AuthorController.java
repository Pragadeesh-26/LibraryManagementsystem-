package com.Project.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.Project.model.Author;
import com.Project.repository.AuthorRepository;

@RestController
@RequestMapping("/api/authors")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthorController {

    private final AuthorRepository authorRepository;

    public AuthorController(AuthorRepository authorRepository) {
        this.authorRepository = authorRepository;
    }

    // GET all authors
    @GetMapping
    public List<Author> getAllAuthors() {
        return authorRepository.findAll();
    }

    // GET author by ID
    @GetMapping("/{id}")
    public Author getAuthorById(@PathVariable int id) {
        return authorRepository.findById(id).orElse(null);
    }

    // POST a new author
    @PostMapping
    public Author addAuthor(@RequestBody Author author) {
        return authorRepository.save(author);
        
    }

    // PUT update author
    @PutMapping("/{id}")
    public Author updateAuthor(@PathVariable int id, @RequestBody Author author) {
        Author eauthor = authorRepository.findById(id).orElse(null);
        if(eauthor!=null){
            eauthor.setId(author.getId());
            eauthor.setName(author.getName());
            eauthor.setBio(author.getBio());
            return authorRepository.save(eauthor);
        }else{
            return null;
        }
    }

    // DELETE an author
    @DeleteMapping("/{id}")
    public void deleteAuthor(@PathVariable int id) {
        authorRepository.deleteById(id);
    }
}
