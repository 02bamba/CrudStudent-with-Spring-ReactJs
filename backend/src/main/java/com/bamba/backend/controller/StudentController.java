package com.bamba.backend.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import com.bamba.backend.model.Student;
import com.bamba.backend.service.StudentService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/student")
public class StudentController {

    @Autowired
    private StudentService studentService;

    
    @PostMapping("/add")
    public ResponseEntity<Student> add(@RequestBody Student student) {
        Student savedStudent =  studentService.saveStudent(student);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStudent);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Student>> getAllStudents() {
        
        List<Student> students = studentService.getAllStudents();
        if (students != null) {
            return ResponseEntity.status(HttpStatus.OK).body(students);
        }else return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable String id) {

        Optional<Student> Student = studentService.getStudentById(id);
        if (Student == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Etudiant non trouvé");
        }
        return ResponseEntity.status(HttpStatus.OK).body(Student);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateStudent(@RequestBody Student student, @PathVariable String id) {

        Optional<Student> existingStudent = studentService.getStudentById(id);
        if (existingStudent == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Etudiant non trouvé");
        }
        Student updatedStudent = studentService.updateStudent(student);

        if (updatedStudent == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur de mise à jour");
        }
        return ResponseEntity.status(HttpStatus.OK).body("Mise à jours réussie !");
    }


    @DeleteMapping("/delete/{id}")
public ResponseEntity<?> deleteStudent(@PathVariable String id) {
    
    Optional<Student> existingStudent = studentService.getStudentById(id);
    if (existingStudent == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Étudiant avec l'ID " + id + " non trouvé.");
    }

    studentService.deleteStudent(id);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body("Suppression réussie");
}
}
