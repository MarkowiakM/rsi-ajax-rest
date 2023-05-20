package com.example.personserver.app;

import java.util.List;

public interface PersonRepository {
    List<Person> getAllPeople();
    List<Person> getPeopleByName(String name);
    Person getPersonById(int id);
    Person addPerson(PersonDTO person);
    Person updatePerson(int personID, PersonDTO updatedPerson);
    boolean deletePerson(int id);
    int peopleInSystem();
}
