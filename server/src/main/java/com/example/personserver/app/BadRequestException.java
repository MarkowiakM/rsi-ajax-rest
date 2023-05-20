package com.example.personserver.app;

public class BadRequestException extends Exception{
    public BadRequestException(String message) {
        super(message);
    }
}
