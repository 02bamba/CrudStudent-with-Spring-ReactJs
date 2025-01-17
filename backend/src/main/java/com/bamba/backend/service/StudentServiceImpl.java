package com.bamba.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bamba.backend.model.Student;
import com.bamba.backend.repository.StudentRepository;

@Service
public class StudentServiceImpl implements  StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public Student saveStudent(Student student) {
       return studentRepository.save(student);
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public Optional getStudentById(String id) {
        return Optional.of(studentRepository.findById(id).orElse(null));
    }

    @Override
    public Student updateStudent(Student student) {
        return studentRepository.saveAndFlush(student);
    }

    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }
    

}
