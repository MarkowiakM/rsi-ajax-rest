package com.example.personserver.app;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Repository
public class PersonRepositoryImpl implements PersonRepository {
    private final List<Person> people;
    private int idController = 4;

    public PersonRepositoryImpl() {
        people = new ArrayList<>();
        // Initialize with some data
        people.add(new Person(1, "Maria", 22, "maria@example.com"));
        people.add(new Person(2, "Remigiusz", 22, "remek@example.com"));
        people.add(new Person(3, "Izabela", 20, "iza@example.com"));
    }

    public List<Person> getAllPeople() {
        log.info("Getting all people");
        return people;
    }

    public List<Person> getPeopleByName(String name) {
        log.info("Getting people by name {}", name);
        List<Person> peopleFound =  people.stream().filter(n -> n.getName().equals(name)).toList();
        if(peopleFound.size() > 0) {
            return peopleFound;
        }
        else {
            throw new PersonNotFoundException("Person with name " + name + " don't exist!");
        }
    }

    public Person getPersonById(int id) {
        log.info("Getting person with id {}", id);
        var found = people.stream().filter(p -> p.getId() == id).findAny();
        if (found.isPresent())
            return found.get();
        else
            throw new PersonNotFoundException("Person with id " + id + " doesn't exists!");
    }

    public Person addPerson(PersonDTO person) {
        log.info("" + person + person.toString());
        boolean personExists = people.stream()
                .anyMatch(
                        p -> p.getName().equals(person.getName()) &&
                        p.getAge() == person.getAge() &&
                        p.getEmail().equals(person.getEmail())
                );

        if (personExists) {
            throw new PersonAlreadyExistsException("Ta osoba już istnieje w systemie!");
        }
        Person newPerson = new Person(idController++, person.getName(), person.getAge(), person.getEmail());
        log.info("Adding new person with id: {}", newPerson.getId());
        people.add(newPerson);
        return newPerson;
    }


    public Person updatePerson(int personID, PersonDTO updatedPerson) {
        log.info("Updating person with id {}", personID);
        var found = people.stream().filter(p -> p.getId() == personID).findAny();
        if (found.isPresent()) {
            var person = found.get();
            person.setName(updatedPerson.getName());
            person.setAge(updatedPerson.getAge());
            person.setEmail(updatedPerson.getEmail());
            return person;
        } else {
            throw new PersonNotFoundException("Person with id " + personID + " doesn't exists!");
        }
    }

    public boolean deletePerson(int id) {
        log.info("Deleting person with id {}", id);
        var found = people.stream().filter(p -> p.getId() == id).findAny();
        if (found.isPresent()) {
            people.remove(found.get());
            return true;
        } else {
            throw new PersonNotFoundException("Person with id " + id + " doesn't exists!");
        }
    }

    public int peopleInSystem() {
        return people.size();
    }
}

