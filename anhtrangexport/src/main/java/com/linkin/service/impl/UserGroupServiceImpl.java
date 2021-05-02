package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.linkin.dao.UserGroupDao;
import com.linkin.entity.User;
import com.linkin.entity.UserGroup;
import com.linkin.entity.UserGroupUser;
import com.linkin.model.SearchUserGroupDTO;
import com.linkin.model.UserDTO;
import com.linkin.model.UserGroupDTO;
import com.linkin.model.UserGroupUserDTO;
import com.linkin.service.UserGroupService;

@Service
@Transactional
public class UserGroupServiceImpl implements UserGroupService {
	@Autowired
	UserGroupDao userGroupDao;

	@Override
	public void add(UserGroupDTO userGroupDTO) {
		UserGroup userGroup = new UserGroup();
		userGroup.setName(userGroupDTO.getName());
		userGroupDao.add(userGroup);

	}

	@Override
	public void update(UserGroupDTO userGroupDTO) {
		UserGroup userGroup = userGroupDao.get(userGroupDTO.getId());
		if (userGroup != null) {
			userGroup.setId(userGroupDTO.getId());
			userGroup.setName(userGroupDTO.getName());
			userGroupDao.update(userGroup);
		}

	}

	@Override
	public void delete(Long id) {
		UserGroup userGroup = userGroupDao.get(id);
		if (userGroup != null) {
			userGroupDao.delete(userGroup);
		}

	}

	@Override
	public List<UserGroupDTO> find(SearchUserGroupDTO searchUserGroupDTO) {
		List<UserGroupDTO> list = new ArrayList<UserGroupDTO>();
		List<UserGroup> listGroups = userGroupDao.find(searchUserGroupDTO);
		for (UserGroup userGroup : listGroups) {
			list.add(convertToDTO(userGroup));
		}

		return list;
	}

	@Override
	public long count(SearchUserGroupDTO searchUserGroupDTO) {
		return userGroupDao.count(searchUserGroupDTO);
	}

	@Override
	public long countTotal(SearchUserGroupDTO searchUserGroupDTO) {
		return userGroupDao.countTotal(searchUserGroupDTO);
	}

	private UserGroupDTO convertToDTO(UserGroup userGroup) {
		UserGroupDTO userGroupDTO = new UserGroupDTO();
		userGroupDTO.setId(userGroup.getId());
		userGroupDTO.setName(userGroup.getName());
		List<UserGroupUser> userGroupUsers =userGroup.getUserGroupUsers();
		List<UserGroupUserDTO> groupUserDTOs= new ArrayList<UserGroupUserDTO>();
		for(UserGroupUser userGroupUser:userGroupUsers) {
			User user= userGroupUser.getUser();
			UserDTO userDTO= new UserDTO();
			userDTO.setId(user.getId());
			UserGroupUserDTO userGroupUserDTO= new UserGroupUserDTO();
			userGroupUserDTO.setUserDTO(userDTO);
			groupUserDTOs.add(userGroupUserDTO);
		}
		return userGroupDTO;
	}

	@Override
	public UserGroupDTO get(Long id) {
		UserGroup userGroup = userGroupDao.get(id);
		if (userGroup != null) {
			return convertToDTO(userGroup);
		}
		return null;
	}

}
