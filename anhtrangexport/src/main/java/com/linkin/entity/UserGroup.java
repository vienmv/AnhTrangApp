package com.linkin.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import lombok.Data;

@Entity
@Table(name = "user_group")
@Data
public class UserGroup {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name")
	private String name;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "userGroup", orphanRemoval = true)
	private List<UserGroupUser> userGroupUsers;

	public UserGroup(Long id) {
		super();
		this.id = id;
	}

	public UserGroup() {
		super();
	}

}
