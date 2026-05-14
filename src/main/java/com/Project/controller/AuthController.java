package com.Project.controller;

import com.Project.Entity.User;
import com.Project.Entity.LibraryCard;
import com.Project.repository.UserRepository;
import com.Project.repository.LibraryCardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LibraryCardRepository libraryCardRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already registered!");
        }

        try {
            LibraryCard newCard = new LibraryCard();
            newCard.setIssueDate(LocalDate.now());
            newCard.setExpiryDate(LocalDate.now().plusYears(1));
            LibraryCard savedCard = libraryCardRepository.save(newCard);

            user.setLibraryCardsId(savedCard.getId());
            
            // SECURITY: Encrypt the password correctly
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // ✅ CHANGE: Force role to ADMIN
            user.setRole("ADMIN"); 

            userRepository.save(user);
            return ResponseEntity.ok(user); // Return user so React can log them in immediately
            
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody User loginRequest) {
        return userRepository.findByName(loginRequest.getName())
                .map(user -> {
                    // Verify password
                    if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        
                        // ✅ SAFETY CHECK: If for some reason role is null or USER, force it to ADMIN here
                        if (!"ADMIN".equals(user.getRole())) {
                            user.setRole("ADMIN");
                            userRepository.save(user);
                        }
                        
                        return ResponseEntity.ok(user);
                    }
                    return ResponseEntity.status(401).body("Invalid password");
                })
                .orElse(ResponseEntity.status(401).body("User not found"));
    }
}