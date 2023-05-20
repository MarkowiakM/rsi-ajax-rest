// var isXML = true;

const ENDPOINT = "http://localhost:7070/people";
const FORMATS = {
  JSON: "application/json",
  XML: "text/xml",
};

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

myInfo();

$(document).ready(function () {
  function getPeople() {
    console.log(endpoint);
    $.ajax({
      async: false,
      url: ENDPOINT,
      type: "GET",
      dataType: isXML ? "xml" : "json",
      success: function (response, status, xhr) {
        // Handle the response from the server
        console.log(response); // You can perform actions with the response here

        // Clear the table
        $("#personresult").empty();
        // Append the table headers
        $("#personresult").append(
          "<tr><th>Id</th><th>Name</th><th>Email</th><th>Age</th></tr>"
        );

        if (isXML) {
          // Parse XML response
          var persons = $(response).find("Person");
          persons.each(function () {
            var person = $(this);
            var id = person.find("Id").text();
            var name = person.find("Name").text();
            var email = person.find("Email").text();
            var age = person.find("Age").text();

            $("#personresult").append(
              "<tr><td>" +
                id +
                "</td><td>" +
                name +
                "</td><td>" +
                email +
                "</td><td>" +
                age +
                "</td></tr>"
            );
          });
        } else {
          // Loop through the JSON response and append the data to the table
          for (var i = 0; i < response.length; i++) {
            var person = response[i];
            // add id to the table
            $("#personresult").append(
              "<tr><td>" +
                person.Id +
                "</td><td>" +
                person.Name +
                "</td><td>" +
                person.Email +
                "</td><td>" +
                person.Age +
                "</td></tr>"
            );
          }
        }
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.log(error);
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
      },
    });
  }

  $("#getAll").click(function () {
    getPeople();
  });

  function addPerson(person) {
    $.ajax({
      async: false,
      url: ENDPOINT,
      type: "POST",
      data:
        FORMAT === FORMATS.XML ? personToXml(person) : JSON.stringify(person),
      contentType: FORMAT,
      success: function (response, status, xhr) {
        // Handle the response from the server
        console.log(response); // You can perform actions with the response here
        // get the response message from the server and insert it to #responde element in html
        $("#response").css("color", "green");
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.log(personToXml(person));
        console.log(error);
        $("#response").css("color", "red");
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
      },
    });
  }

  function updatePerson(id, person) {
    $.ajax({
      async: false,
      url: `${ENDPOINT}/${id}`,
      type: "PUT",
      data:
        FORMAT === FORMATS.XML ? personToXml(person) : JSON.stringify(person),
      contentType: FORMAT,
      success: function (response, status, xhr) {
        // Handle the response from the server
        console.log(response); // You can perform actions with the response here
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
        $("#response").css("color", "green");
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.log(error);
        // make response text color red
        $("#response").css("color", "red");
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
      },
    });
  }

  $("#add").click(function () {
    // when adding get the values from the input fields
    var name = $("#name").val();
    var email = $("#email").val();
    var age = $("#age").val();

    //create a new person json object like this :
    var newPerson = {
      Name: name,
      Email: email,
      Age: age,
    };

    //console log the new person object
    console.log(newPerson);

    //call the addPerson function and pass the new person object
    addPerson(newPerson);

    // clear the input fields
    $("#name").val("");
    $("#email").val("");
    $("#age").val("");

    getPersons();
  });

  $("#update").click(function () {
    // Implement your logic here to update a person\
    var id = $("#id").val();
    var name = $("#name").val();
    var email = $("#email").val();
    var age = $("#age").val();

    var updatedPerson = {
      Id: id,
      Name: name,
      Email: email,
      Age: age,
    };

    updatePerson(id, updatedPerson);

    getPersons();
  });

  async function deletePerson(id) {
    $.ajax({
      async: false,
      url: `${ENDPOINT}/${id}`,
      type: "DELETE",
      success: function (response, status, xhr) {
        // Handle the response from the server
        console.log(response); // You can perform actions with the response here
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
        $("#response").css("color", "green");
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.log(error);
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
        $("#response").css("color", "red");
      },
    });
  }

  // Add an event listener to the "Delete" button
  $("#delete").click(async function () {
    // Implement your logic here to delete a person
    var id = $("#id").val();

    // make sure to call the getPersons function after deleting a person
    deletePerson(id);
    getPersons();
  });

  function getPerson(id) {
    $.ajax({
      url: `${ENDPOINT}/${id}`,
      type: "GET",
      dataType: FORMAT === FORMATS.XML ? "xml" : "json",
      success: function (response, status, xhr) {
        // Handle the response from the server
        console.log(response); // You can perform actions with the response here
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
        $("#response").css("color", "green");

        if (isXML) {
          var person = $(response).find("Person");
          var id = person.find("Id").text();
          var name = person.find("Name").text();
          var email = person.find("Email").text();
          var age = person.find("Age").text();

          // insert get person values to input fields
          $("#id").val(id);
          $("#name").val(name);
          $("#email").val(email);
          $("#age").val(age);
        } else {
          var person = response;
          // insert get person values to input fields
          $("#id").val(person.Id);
          $("#name").val(person.Name);
          $("#email").val(person.Email);
          $("#age").val(person.Age);
        }
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.log(error);
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
        $("#response").css("color", "red");
      },
    });
  }
  // Add an event listener to the "Search" button
  $("#search").click(function () {
    // get id from input
    var id = $("#id").val();

    getPerson(id);
  });

  $("#clear").click(function () {
    // clear input fields
    $("#response").empty();
    $("#id").val("");
    $("#name").val("");
    $("#email").val("");
    $("#age").val("");
  });

  function filterPersons(person) {
    var endpoint = isXML
      ? "http://localhost:50985/MyRestService.svc/filter"
      : "http://localhost:50985/MyRestService.svc/json/filter";

    $.ajax({
      url: endpoint,
      type: "POST",
      data: isXML ? personToXml(person) : JSON.stringify(person),
      contentType: isXML ? "application/xml" : "application/json",
      success: function (response, status, xhr) {
        // Handle the response from the server
        console.log(response); // You can perform actions with the response here
        // Clear the table
        $("#personresult").empty();
        // Append the table headers
        $("#personresult").append(
          "<tr><th>Id</th><th>Name</th><th>Email</th><th>Age</th></tr>"
        );

        $("#response").css("color", "green");
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);

        if (isXML) {
          var persons = $(response).find("Person");
          persons.each(function () {
            var person = $(this);
            var id = person.find("Id").text();
            var name = person.find("Name").text();
            var email = person.find("Email").text();
            var age = person.find("Age").text();

            $("#personresult").append(
              "<tr><td>" +
                id +
                "</td><td>" +
                name +
                "</td><td>" +
                email +
                "</td><td>" +
                age +
                "</td></tr>"
            );
          });
        } else {
          for (var i = 0; i < response.length; i++) {
            var person = response[i];
            // add id to the table
            $("#personresult").append(
              "<tr><td>" +
                person.Id +
                "</td><td>" +
                person.Name +
                "</td><td>" +
                person.Email +
                "</td><td>" +
                person.Age +
                "</td></tr>"
            );
          }
        }
      },
      error: function (xhr, status, error) {
        // Handle errors
        console.log(error);

        $("#response").css("color", "red");
        $("#response").text(xhr.statusText + " - Status Code: " + xhr.status);
      },
    });
  }

  // add event listener to the "filter"   button
  $("#filter").click(function () {
    // get values from input fields
    var name = $("#name").val();
    var email = $("#email").val();
    var age = $("#age").val();

    // if age input is empty do not include Age in the json object
    if (age == "") {
      var newPerson = {
        Name: name,
        Email: email,
      };
    }
    // else include Age in the json object
    else {
      var newPerson = {
        Name: name,
        Email: email,
        Age: age,
      };
    }

    //console log the new person object
    console.log(newPerson);

    // call filterPersons function and pass the new person object
    filterPersons(newPerson);
  });

  function personToXml(person) {
    console.log(person);
    var xml =
      '<Person xmlns="http://schemas.datacontract.org/2004/07/MyWebService">';
    xml += "<Name>" + person.Name + "</Name>";
    // xml += "<Id>" + person.Id + "</Id>";

    // if person has no age, set age to 0
    if (person.Age == null) {
      xml += "<Age>0</Age>";
    } else {
      xml += "<Age>" + person.Age + "</Age>";
    }
    xml += "<Email>" + person.Email + "</Email>";
    xml += "</Person>";
    console.log(xml);
    return xml;
  }

  $("#jsonbutton").click(function () {
    // when adding get the values from the input fields
    FORMAT = FORMATS.JSON;
    document.getElementById("dataformat").innerHTML = "JSON";
  });

  $("#xmlbutton").click(function () {
    // when adding get the values from the input fields
    FORMAT = FORMATS.XML;
    document.getElementById("dataformat").innerHTML = "XML";
  });

  getPersons();
});
