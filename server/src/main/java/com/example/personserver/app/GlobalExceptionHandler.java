package com.example.personserver.app;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(PersonNotFoundException.class)
    public ResponseEntity<CustomErrorResponse> handleYourException(PersonNotFoundException ex) {
        var errorResponse = new CustomErrorResponse(404, "PERSON_NOT_FOUND", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
    }

    @ExceptionHandler(PersonAlreadyExistsException.class)
    public ResponseEntity<CustomErrorResponse> handleYourException(PersonAlreadyExistsException ex) {
        var errorResponse = new CustomErrorResponse(406, "PERSON_ALREADY_EXISTS", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body(errorResponse);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<CustomErrorResponse> handleYourException(BadRequestException ex) {
        var errorResponse = new CustomErrorResponse(400, "BAD REQUEST", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }
}
