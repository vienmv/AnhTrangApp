package com.linkin.exception;

public class NotMatchPasswordException extends RuntimeException {
	private static final long serialVersionUID = 1L;
	
	public NotMatchPasswordException(String msg) {
		super(msg);
	}
	
}
