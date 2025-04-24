package com.example.miniprojet.service;

import com.example.miniprojet.model.User;
import com.example.miniprojet.repository.UserRepository;
import com.example.miniprojet.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.*;
import java.util.Collections;


@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder encoder;
    private final JwtUtil jwtUtil;

    public ResponseEntity<?> register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        userRepo.save(user);
        return ResponseEntity.ok("User enregistré");
    }

    public ResponseEntity<?> login(User user) {
        return userRepo.findByUsername(user.getUsername()).map(u -> {
            if (!encoder.matches(user.getPassword(), u.getPassword())) {
                return ResponseEntity.status(401).body("Informations incorrectes");
            }
            String token = jwtUtil.generateToken(u.getUsername());
            return ResponseEntity.ok(Collections.singletonMap("token", token));
        }).orElseGet(() -> ResponseEntity.status(401).body("Nom d'utilisateur incorrect"));
    }

    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Déconnexion réussie");
    }
}