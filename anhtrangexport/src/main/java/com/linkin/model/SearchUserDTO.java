package com.linkin.model;

import java.util.List;

import lombok.Data;

@Data
public class SearchUserDTO extends SearchDTO {

	private Boolean enabled;
	private List<String> roleList;
	private Long createdById;
	private String createdBy;
	private Long userGroupId;
	private String checkNullUserGroup;
	private String searchCity;
	private String searchDistricts;
	private String searchWards;
	private Long customerId;
	private String searchRoad;
	
}
