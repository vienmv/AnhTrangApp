package com.linkin.model;

import java.io.Serializable;
import java.util.List;

import lombok.Data;

@Data
public class ResponseDTO<T> implements Serializable {
	private static final long serialVersionUID = 1L;
	private long recordsTotal;
	private long recordsFiltered;
	private List<T> data;
	

}
