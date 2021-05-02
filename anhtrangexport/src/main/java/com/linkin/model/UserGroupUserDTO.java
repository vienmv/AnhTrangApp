package com.linkin.model;

import lombok.Data;

@Data
public class UserGroupUserDTO {
	private Long id;
	private UserDTO userDTO;
	private UserGroupDTO userGroupDTO;

	public UserGroupUserDTO(Long id) {
		super();
		this.id = id;
	}

	public UserGroupUserDTO() {
		super();
	}

}
