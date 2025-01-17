package com.bamba.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bamba.backend.model.Student;

@Repository
public interface StudentRepository extends JpaRepository<Student, String> {

    Optional<Student> findById(String id);

}
