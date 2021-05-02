package com.linkin.model;

import lombok.Data;

@Data
public class SearchNewsDTO extends SearchDTO {
	private Long userId;
	private Long userGroupId;

}
