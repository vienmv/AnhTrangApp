package com.linkin.model;

import java.io.Serializable;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.annotation.JsonIgnore;

import lombok.Data;

@Data
public class UserDTO implements Serializable {

	private static final long serialVersionUID = 1L;

	private Long id;
	private String name;
	private String password;
	private String phone;
	private String repassword;
	private String address;
	private Boolean enabled;
	private String deviceId;
	private String createdDate;
	private String createdBy;
	private List<String> roles;
	private Long userGroupId;
	private String userGroupName;
	private String cityName;
	private String districtName;
	private String wardsName;
	private List<Long> listUserId;
	private List<String> images;
	private Long createdById;
	private List<String> userGroupNames;
	private List<Long> userGroupIds;

	@JsonIgnore
	private List<MultipartFile> imageFiles;

	public UserDTO() {
		super();
	}

	public UserDTO(Long id) {
		super();
		this.id = id;
	}
	
}
