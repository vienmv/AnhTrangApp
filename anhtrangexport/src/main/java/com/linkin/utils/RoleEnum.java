package com.linkin.utils;

public enum RoleEnum {
	ADMIN(1, "ADMIN"), STAFF(2,"STAFF") , MEMBER(3, "MEMBER"), SHIPPER(4, "SHIPPER"), SELLER(5, "SELLER");
	private int roleId;
	private String roleName;

	RoleEnum(int roleId, String roleName) {
		this.roleId = roleId;
		this.roleName = roleName;
	}

	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}
}
