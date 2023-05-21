package com.example.personserver.app;

import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/people")
@AllArgsConstructor
public class PersonController {
    private final PersonRepository personRepository;

    @GetMapping( produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<List<Person>> getAllPeople() {
        List<Person> people = personRepository.getAllPeople();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(people);
    }

    @GetMapping(value = "/name/{name}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<List<Person>> getPeopleByName(@PathVariable String name) {
        List<Person> people = personRepository.getPeopleByName(name);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(people);
    }

    @GetMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Person> getPersonById(@PathVariable int id) {
        Person person = personRepository.getPersonById(id);
        if (person != null) {
            return ResponseEntity
                    .status(HttpStatus.OK)
                    .body(person);
        } else {
            throw new PersonNotFoundException("Person not found with ID: " + id);
        }
    }

    @PostMapping(produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_XML_VALUE})
    public ResponseEntity<Person> addPerson(@RequestBody PersonDTO person) {
        Person newPerson = personRepository.addPerson(person);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(newPerson);
    }

    @PutMapping(value = "/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE},
            consumes = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE, MediaType.TEXT_XML_VALUE})
    public ResponseEntity<Person> updatePerson(@PathVariable int id, @RequestBody PersonDTO updatedPerson) {
        Person person = personRepository.updatePerson(id, updatedPerson);
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(person);
    }

    // tu nic nie zwraca?
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePerson(@PathVariable int id) {
        boolean deleted = personRepository.deletePerson(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            throw new PersonNotFoundException("Person not found with ID: " + id);
        }
    }

    @GetMapping(value = "/size", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<Integer> getSize() {
        int size = personRepository.peopleInSystem();
        return ResponseEntity
                .status(HttpStatus.OK)
                .body(size);
    }
}