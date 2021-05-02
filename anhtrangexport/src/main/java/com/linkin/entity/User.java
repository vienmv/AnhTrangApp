package com.linkin.entity;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.PreRemove;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

import com.linkin.utils.FileStore;

import lombok.Getter;
import lombok.Setter;

@Entity
@Setter
@Getter
@Table(name = "user")
public class User extends CreateAuditable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "name")
	private String name;

	@Column(name = "password")
	private String password;

	@Column(name = "phone", unique = true)
	private String phone;

	@Column(name = "address")
	private String address;

	@Column(name = "device_id", length = 1000)
	private String deviceId;

	@Column(name = "enabled")
	private Boolean enabled;

	@ElementCollection
	@CollectionTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), uniqueConstraints = {
			@UniqueConstraint(columnNames = { "user_id", "role" }) })
	@Column(name = "role")
	private List<String> roles;

	@ElementCollection
	@CollectionTable(name = "users_images")
	private List<String> images;

	@Column(name = "city_name")
	private String cityName;

	@Column(name = "district_name")
	private String districtName;

	@Column(name = "wards_name")
	private String wardsName;

	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
	private List<Road> roads;
	
	@OneToMany(cascade = CascadeType.ALL, mappedBy = "user", orphanRemoval = true)
	private List<UserGroupUser> userGroupUsers;

	public User() {
		super();
	}

	public User(Long id) {
		super();
		this.id = id;
	}

	@PreRemove
	public void removeFiles() {
		FileStore.deleteFiles(this.images);
	}

}
