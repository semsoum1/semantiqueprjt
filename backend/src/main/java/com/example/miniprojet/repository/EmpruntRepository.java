package com.example.miniprojet.repository;

import com.example.miniprojet.model.Emprunt;
import com.example.miniprojet.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmpruntRepository extends JpaRepository<Emprunt, Long> {

    List<Emprunt> findEmpruntByUser(User user);

    List<Emprunt> findByUserUsernameAndLivreIdAndRetourDateIsNull(String username, Long livreId);

    List<Emprunt> findByLivreId(Long livreId);
}
