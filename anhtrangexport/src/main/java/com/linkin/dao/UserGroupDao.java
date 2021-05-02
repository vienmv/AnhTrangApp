package com.linkin.dao;

import java.util.List;

import com.linkin.entity.UserGroup;
import com.linkin.model.SearchUserGroupDTO;

public interface UserGroupDao {
	void add(UserGroup userGroup);

	void update(UserGroup userGroup);

	void delete(UserGroup userGroup);

	List<UserGroup> find( SearchUserGroupDTO searchUserGroupDTO);

	long count(SearchUserGroupDTO searchUserGroupDTO);

	long countTotal(SearchUserGroupDTO searchUserGroupDTO);
	
	UserGroup get (Long id );
}
