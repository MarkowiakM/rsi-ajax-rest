const ENDPOINT = "http://localhost:7070/people";
const FORMATS = {
  JSON: "application/json",
  XML: "text/xml",
};

const TABLE_HEADERS = `
            <tr>
              <th>Id</th>
              <th>Imię</th>
              <th>Wiek</th>
              <th>Email</th>
            </tr>`;

let FORMAT = FORMATS.JSON;

function myInfo() {
  console.log("Maria Markowiak, 260417");
  console.log("Remigiusz Pisarski, 260364");
  var now = new Date();
  var formatter = new Intl.DateTimeFormat("default", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
  console.log(formatter.format(now));
  console.log("JavaScript version: " + navigator.userAgent); // wersja silnika przeglądarki
  // navigator.userAgent.match(/Chrome\/(\S+)/)[1];
  console.log("User: " + window.navigator.platform);
  console.log("User: " + window.navigator.userAgent);
  console.log("OS: " + window.navigator.platform);
}

// myInfo();

$(document).ready(function () {
  function getPeople() {
    $.ajax({
      async: false,
      url: ENDPOINT,
      type: "GET",
      dataType: FORMAT === FORMATS.XML ? "xml" : "json",
      success: function (response, _, xhr) {
        console.log("getting people", FORMAT, response);
        $("#response").text(
          "Znaleziono osoby w bazie, " +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
        let parsedPeople = [];
        if (FORMAT === FORMATS.XML) {
          const people = $(response).find("item");
          people.each(function () {
            parsedPeople.push(parseXML($(this)));
          });
        } else {
          parsedPeople = response;
        }
        parsedPeople.forEach((person) => {
          appendPerson(person);
        });
      },
      error: (xhr, _, error) => {
        console.log(error);
        $("#response").text(
          "Nie znaleziono osób w bazie, " +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "red");
      },
    });
  }

  function getPeopleByName(name) {
    $.ajax({
      async: false,
      url: `${ENDPOINT}/name/${name}`,
      type: "GET",
      dataType: FORMAT === FORMATS.XML ? "xml" : "json",
      success: function (response, _, xhr) {
        console.log("getting people by name, ", FORMAT, response);
        $("#response").text(
          `Znaleziono osoby o imieniu: ${name}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
        let parsedPeople = [];
        if (FORMAT === FORMATS.XML) {
          const people = $(response).find("item");
          people.each(function () {
            parsedPeople.push(parseXML($(this)));
          });
        } else {
          parsedPeople = response;
        }
        parsedPeople.forEach((person) => {
          appendPerson(person);
        });
      },
      error: (xhr, _, error) => {
        console.log(error);
        $("#response").text(
          `Nie znaleziono osób o imieniu: ${name}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "red");
      },
    });
  }

  function getPerson(id) {
    $.ajax({
      url: `${ENDPOINT}/${id}`,
      type: "GET",
      dataType: FORMAT === FORMATS.XML ? "xml" : "json",
      success: function (response, _, xhr) {
        console.log(`Getting person with id: ${id}`, FORMAT, response);
        $("#response").text(
          `Znaleziono osobę o id: ${id}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
        let parsedPerson;
        if (FORMAT === FORMATS.XML) {
          parsedPerson = parseXML($(response).find("Person"));
          console.log(parsedPerson);
        } else {
          parsedPerson = response;
        }
        appendPerson(parsedPerson);
      },
      error: function (xhr, status, error) {
        console.log(error);
        $("#response").text(
          `Nie znaleziono osoby o id: ${id}` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "red");
      },
    });
  }

  function addPerson(person) {
    $.ajax({
      async: false,
      url: ENDPOINT,
      type: "POST",
      data:
        FORMAT === FORMATS.XML ? stringifyXML(person) : JSON.stringify(person),
      contentType: FORMAT,
      success: function (response, _, xhr) {
        console.log(response);
        $("#response").css("color", "green");
        $("#response").text(
          `Dodano nową osobę, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
      },
      error: function (xhr, _, error) {
        console.log(error);
        $("#response").css("color", "red");
        $("#response").text(
          "Nie udało dodać się nowej osoby, " +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "red");
      },
    });
  }

  function updatePerson(id, person) {
    $.ajax({
      async: false,
      url: `${ENDPOINT}/${id}`,
      type: "PUT",
      data:
        FORMAT === FORMATS.XML ? stringifyXML(person) : JSON.stringify(person),
      contentType: FORMAT,
      success: function (response, _, xhr) {
        console.log(response);
        $("#response").text(
          `Edytowano osobę o id: ${id}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
      },
      error: function (xhr, _, error) {
        console.log(error);
        $("#response").css("color", "red");
        $("#response").text(
          `Nie ma w bazie osoby o id: ${id}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
      },
    });
  }

  async function deletePerson(id) {
    $.ajax({
      async: false,
      url: `${ENDPOINT}/${id}`,
      type: "DELETE",
      success: function (response, _, xhr) {
        console.log(response);
        $("#response").text(
          `Usunięto osobę o id: ${id}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
      },
      error: function (xhr, _, error) {
        console.log(error);
        $("#response").text(
          `W bazie nie ma osoby o id: ${id}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "red");
      },
    });
  }

  async function countPeople() {
    $.ajax({
      url: `${ENDPOINT}/size`,
      type: "GET",
      dataType: FORMAT === FORMATS.XML ? "xml" : "json",
      success: function (response, _, xhr) {
        console.log(`Getting size `, FORMAT, response);
        const numberOfPeople =
          FORMAT === FORMATS.XML
            ? $(response).find("Integer").text()
            : response;
        $("#response").text(
          `Liczba osób: ${numberOfPeople}, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "green");
      },
      error: function (xhr, _, error) {
        console.log(error);
        $("#response").text(
          `Nie pobrano liczby osób, ` +
            xhr.statusText +
            " - Status Code: " +
            xhr.status
        );
        $("#response").css("color", "red");
      },
    });
  }

  function stringifyXML(person) {
    console.log(person);
    const personXML = `<Person>
                          <name>${person.name}</name>
                          <age>${person.age}</age>
                          <email>${person.email}</email>    
                        </Person>`;
    console.log(personXML);
    return personXML;
  }

  function parseXML(person) {
    const id = person.find("id").text();
    const name = person.find("name").text();
    const age = person.find("age").text();
    const email = person.find("email").text();
    return { id, name, age, email };
  }

  function clear() {
    $("#result-table").empty();
    $("#response").empty();
    $("#result-table").append(TABLE_HEADERS);
  }

  function appendPerson({ id, name, age, email }) {
    $("#result-table").append(
      `<tr> 
          <td>${id}</td>
          <td>${name}</td>
          <td>${age}</td>
          <td>${email}</td>
        </tr>`
    );
  }

  $("#format-json").click(function () {
    FORMAT = FORMATS.JSON;
    document.getElementById("format").innerHTML = "Format: JSON";
  });

  $("#format-xml").click(function () {
    FORMAT = FORMATS.XML;
    document.getElementById("format").innerHTML = "Format: XML";
  });

  $("#get-all").click(function () {
    clear();
    getPeople();
  });

  $("#count-people").click(function () {
    countPeople();
  });

  $("#show-person-form-submit").click(function (e) {
    e.preventDefault();
    clear();
    const id = $("#show-person").val();
    if (id) {
      getPerson(id);
    } else {
      $("#response").text("Nie podano id osoby!");
      $("#response").css("color", "red");
    }
  });

  $("#find-by-name-form-submit").click(function (e) {
    e.preventDefault();
    clear();
    const name = $("#find-name").val();
    if (name) {
      getPeopleByName(name);
    } else {
      $("#response").text("Nie podano imienia osoby!");
      $("#response").css("color", "red");
    }
  });

  $("#delete-form-submit").click(function (e) {
    e.preventDefault();
    clear();
    const id = $("#delete-id").val();
    if (id) {
      deletePerson(id);
    } else {
      $("#response").text("Nie podano id osoby!");
      $("#response").css("color", "red");
    }
  });

  $("#add-form-submit").click(function (e) {
    e.preventDefault();
    clear();

    const name = $("#add-name").val();
    const age = $("#add-age").val();
    const email = $("#add-email").val();

    if (name && age && email) {
      const person = {
        name: name,
        age: age,
        email: email,
      };
      addPerson(person);
    } else {
      $("#response").text("Nie podano wszystkich danych!");
      $("#response").css("color", "red");
    }
  });

  $("#update-form-submit").click(function (e) {
    e.preventDefault();
    clear();
    const id = $("#update-id").val();
    const name = $("#update-name").val();
    const age = $("#update-age").val();
    const email = $("#update-email").val();

    if (id && name && age && email) {
      const person = {
        name: name,
        age: age,
        email: email,
      };
      updatePerson(id, person);
    } else {
      $("#response").text("Nie podano wszystkich danych!");
      $("#response").css("color", "red");
    }
  });
});
