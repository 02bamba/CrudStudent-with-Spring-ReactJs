package com.bamba.backend.service;

import java.util.List;
import java.util.Optional;

import com.bamba.backend.model.Student;

public interface StudentService {

    public Student saveStudent(Student student);

    List <Student> getAllStudents();

    public Optional<Student> getStudentById(String id);

    public Student updateStudent(Student student);

    public void deleteStudent(String id);
}
