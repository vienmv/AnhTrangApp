package com.linkin.model;

import java.io.Serializable;

import lombok.Data;

@Data
public class SMSDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String content;
	private String customerPhone;

}
