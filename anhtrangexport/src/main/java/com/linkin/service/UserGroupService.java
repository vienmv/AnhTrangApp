package com.linkin.service;

import java.util.List;

import com.linkin.model.SearchUserGroupDTO;
import com.linkin.model.UserGroupDTO;

public interface UserGroupService {
	void add(UserGroupDTO userGroupDTO);

	void update(UserGroupDTO userGroupDTO);

	void delete(Long id);

	List<UserGroupDTO> find(SearchUserGroupDTO searchUserGroupDTO);

	long count(SearchUserGroupDTO searchUserGroupDTO);

	long countTotal(SearchUserGroupDTO searchUserGroupDTO);
	
	UserGroupDTO get(Long id);
}
