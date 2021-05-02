package com.linkin.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import lombok.Data;

@Data
@Entity
@Table(name = "user_group_user", uniqueConstraints = {
		@UniqueConstraint(columnNames = { "user_id", "user_group_id" }) })
public class UserGroupUser {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;

	@ManyToOne
	@JoinColumn(name = "user_group_id")
	private UserGroup userGroup;

	public UserGroupUser() {
		super();
	}

	public UserGroupUser(Long id) {
		super();
		this.id = id;
	}

}
