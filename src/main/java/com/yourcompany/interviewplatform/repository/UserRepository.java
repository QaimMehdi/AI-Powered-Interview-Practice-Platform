package com.yourcompany.interviewplatform.repository;

import com.yourcompany.interviewplatform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByEmailAndProvider(String email, String provider);
} 