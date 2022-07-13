package com.project.beweb.exception;

public class TokenInvalid extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public TokenInvalid(String message){
        super(message);
    }
}
