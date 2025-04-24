package com.example.miniprojet.service;

import com.example.miniprojet.model.*;
import com.example.miniprojet.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LivreService {
    private final LivreRepository livreRepo;
    private final EmpruntRepository empruntRepo;
    private final UserRepository userRepo;

    public List<Livre> getAvailableLivres() {
        return livreRepo.findByAvailableTrue();
    }

    public List<Livre> getEmprunts(String username) {
        return userRepo.findByUsername(username)
                .map(user -> empruntRepo.findEmpruntByUser(user).stream()
                        .filter(emprunt -> emprunt.getRetourDate() == null)
                        .map(Emprunt::getLivre)
                        .collect(Collectors.toList()))
                .orElse(Collections.emptyList());
    }

    public Livre getLivreById(Long id) {
        return livreRepo.findById(id).orElseThrow();
    }

    public ResponseEntity<String> empruntLivre(Long livreId, String username) {
        Optional<Livre> livreOpt = livreRepo.findById(livreId);
        if (livreOpt.isEmpty() || !livreOpt.get().isAvailable())
            return ResponseEntity.badRequest().body("non disponible");
        Livre livre = livreOpt.get();
        User user = userRepo.findByUsername(username).orElseThrow();
        livre.setAvailable(false);
        Emprunt emprunt = new Emprunt();
        emprunt.setLivre(livre);
        emprunt.setUser(user);
        emprunt.setEmpruntDate(LocalDate.now());
        empruntRepo.save(emprunt);
        livreRepo.save(livre);
        return ResponseEntity.ok("Book borrowed");
    }

    public ResponseEntity<String> retourLivre(Long livreId, String username) {
        List<Emprunt> emprunts = empruntRepo.findByUserUsernameAndLivreIdAndRetourDateIsNull(username, livreId);

        if (emprunts.isEmpty()) {
            return ResponseEntity.badRequest().body("disponible");
        }

        Emprunt emprunt = emprunts.stream()
                .max(Comparator.comparing(Emprunt::getEmpruntDate))
                .orElseThrow();

        emprunt.getLivre().setAvailable(true);
        emprunt.setRetourDate(LocalDate.now());
        empruntRepo.save(emprunt);
        livreRepo.save(emprunt.getLivre());

        return ResponseEntity.ok("Book returned");
    }

    public Livre save(Livre livre) {
        return livreRepo.save(livre);
    }

    public Livre update(Long id, Livre livre) {
        Livre existing = livreRepo.findById(id).orElseThrow();
        existing.setTitle(livre.getTitle());
        existing.setAuthor(livre.getAuthor());
        return livreRepo.save(existing);
    }

    public ResponseEntity<String> delete(Long id) {
        List<Emprunt> emprunts = empruntRepo.findByLivreId(id);
        if (!emprunts.isEmpty()) {
            empruntRepo.deleteAll(emprunts);
        }
        livreRepo.deleteById(id);
        return ResponseEntity.ok("Book deleted successfully");
    }
}
