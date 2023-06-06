package com.hodophilia.backend.exceptions;

public class ObjectNotFoundException extends RuntimeException {

    public ObjectNotFoundException(String exception) {
        super(exception);
    }
}