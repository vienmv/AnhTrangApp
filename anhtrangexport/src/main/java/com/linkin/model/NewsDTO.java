package com.linkin.model;

import lombok.Data;

@Data
public class NewsDTO {

	private Long id;
	private String content;
	private String title;
	private String createdDate;
	private Long userGroupId;
	private String userGroupName;

	public NewsDTO() {
		super();
	}

	public NewsDTO(Long id) {
		super();
		this.id = id;
	}

}
