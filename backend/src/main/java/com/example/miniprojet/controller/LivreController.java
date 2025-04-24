package com.example.miniprojet.controller;

import com.example.miniprojet.config.ApiEndpoints;
import com.example.miniprojet.model.Livre;
import com.example.miniprojet.service.LivreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(ApiEndpoints.LIVRES_BASE_URL)
@RequiredArgsConstructor
public class LivreController {
    private final LivreService livreService;

    @GetMapping
    public List<Livre> getAvailableLivres() {
        return livreService.getAvailableLivres();
    }

    @GetMapping("/{id}")
    public Livre getLivreById(@PathVariable Long id) {
        return livreService.getLivreById(id);
    }

    @GetMapping("/emprunts")
    public List<Livre> getEmprunts() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return null;
        }
        String username = auth.getName();
        return livreService.getEmprunts(username);
    }

    @PostMapping("/{livreId}/emprunt")
    public ResponseEntity<String> empruntLivre(@PathVariable Long livreId, Authentication auth) {
        return livreService.empruntLivre(livreId, auth.getName());
    }

    @PostMapping(path = "/{livreId}/retour")
    public ResponseEntity<String> retourLivre(@PathVariable Long livreId, Authentication auth) {
        return livreService.retourLivre(livreId, auth.getName());
    }

    @PostMapping
    public Livre createLivre(@RequestBody Livre livre) {
        return livreService.save(livre);
    }

    @PutMapping("/{id}")
    public Livre updateLivre(@PathVariable Long id, @RequestBody Livre livre) {
        return livreService.update(id, livre);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteLivre(@PathVariable Long id) {
        return livreService.delete(id);
    }
}
