package com.linkin.model;

import java.util.List;

import lombok.Data;

@Data
public class RoadDTO {

	private Long id;
	private String cityName;
	private Long userId;
	private List<String> cities;
}
