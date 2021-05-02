package com.linkin.api.controller;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.server.NotAcceptableStatusException;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.linkin.exception.NotMatchPasswordException;

@ControllerAdvice(basePackages = { "com.linkin.api.controller" })
public class RestExceptionController extends ResponseEntityExceptionHandler {

	@ExceptionHandler(value = { DataIntegrityViolationException.class, NotMatchPasswordException.class })
	protected ResponseEntity<Object> handleConflict(RuntimeException ex, WebRequest request) {
		logger.trace(ex);
		return handleExceptionInternal(ex, "Data conflict", new HttpHeaders(), HttpStatus.CONFLICT, request);
	}
	
	@ExceptionHandler(value = { NotAcceptableStatusException.class})
	protected ResponseEntity<Object> handleNotAcceptableStatusException(RuntimeException ex, WebRequest request) {
		logger.trace(ex);
		return handleExceptionInternal(ex, "Data not accept", new HttpHeaders(), HttpStatus.NOT_ACCEPTABLE, request);
	}

	@ExceptionHandler({ AccessDeniedException.class })
	public ResponseEntity<Object> handleAccessDeniedException(Exception ex, WebRequest request) {
		logger.info(ex);
		return handleExceptionInternal(ex, "Access denied message here", new HttpHeaders(), HttpStatus.FORBIDDEN,
				request);
	}

	@ExceptionHandler({ Exception.class })
	public ResponseEntity<Object> handleInternalException(Exception ex, WebRequest request) {
		logger.error(ex);
		return handleExceptionInternal(ex, "Internal server error", new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR,
				request);
	}
}
