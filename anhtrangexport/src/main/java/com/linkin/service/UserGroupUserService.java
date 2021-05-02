package com.linkin.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.linkin.dao.UserDao;
import com.linkin.dao.UserGroupDao;
import com.linkin.dao.UserGroupUserDao;
import com.linkin.entity.User;
import com.linkin.entity.UserGroup;
import com.linkin.entity.UserGroupUser;
import com.linkin.model.SearchUserGroupUserDTO;
import com.linkin.model.UserDTO;
import com.linkin.model.UserGroupDTO;
import com.linkin.model.UserGroupUserDTO;

public interface UserGroupUserService {
	void add(UserGroupUserDTO userGroupUserDTO);

	void update(UserDTO userDTO);

	void delete(Long id);

	void deleteUserGroupUser(UserDTO userDTO);

	UserGroupUserDTO getById(Long id);

	List<UserGroupUserDTO> find(SearchUserGroupUserDTO searchUserGroupUserDTO);

	long count(SearchUserGroupUserDTO searchUserGroupUserDTO);

	long countTotal(SearchUserGroupUserDTO searchUserGroupUserDTO);
}

@Transactional
@Service
class UserGroupUserServiceImpl implements UserGroupUserService {
	@Autowired
	private UserDao userDao;

	@Autowired
	private UserGroupDao userGroupDao;

	@Autowired
	private UserGroupUserDao userGroupUserDao;

	@Override
	public void add(UserGroupUserDTO userGroupUserDTO) {
		UserGroupUser userGroupUser = new UserGroupUser();
		User user = userDao.getById(userGroupUserDTO.getUserDTO().getId());
		userGroupUser.setUser(user);
		UserGroup userGroup = userGroupDao.get(userGroupUserDTO.getUserGroupDTO().getId());
		userGroupUser.setUserGroup(userGroup);
		userGroupUserDao.add(userGroupUser);
		userGroupUserDTO.setId(userGroupUser.getId());
	}

	@Override
	public void update(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		List<UserGroupUser> groupUsers = new ArrayList<UserGroupUser>();
		for (Long long1 : userDTO.getUserGroupIds()) {
			UserGroupUser userGroupUser = new UserGroupUser();
			userGroupUser.setUser(user);
			userGroupUser.setUserGroup(new UserGroup(long1));
			groupUsers.add(userGroupUser);
		}
		userDao.update(user);
	}

	@Override
	public void delete(Long id) {
		UserGroupUser userGroupUser = userGroupUserDao.getById(id);
		if (userGroupUser != null) {
			userGroupUserDao.delete(userGroupUser);
		}

	}

	@Override
	public UserGroupUserDTO getById(Long id) {
		UserGroupUserDTO userGroupUserDTO = new UserGroupUserDTO();
		UserGroupUser userGroupUser = userGroupUserDao.getById(id);
		if (userGroupUser != null) {
			userGroupUserDTO.setId(userGroupUser.getId());
			UserDTO userDTO = new UserDTO();
			User user = userDao.getById(userGroupUser.getUser().getId());
			userDTO.setId(user.getId());
			userDTO.setName(user.getName());
			userDTO.setAddress(user.getAddress());
			userDTO.setCityName(user.getCityName());
			userDTO.setDistrictName(user.getDistrictName());
			user.setWardsName(user.getWardsName());
			userDTO.setPhone(user.getPhone());
			UserGroupDTO userGroupDTO = new UserGroupDTO();
			userGroupDTO.setId(userGroupUser.getUserGroup().getId());
			userGroupUserDTO.setUserDTO(userDTO);
			userGroupUserDTO.setUserGroupDTO(userGroupDTO);
		}
		return userGroupUserDTO;
	}

	@Override
	public List<UserGroupUserDTO> find(SearchUserGroupUserDTO searchUserGroupUserDTO) {
		List<UserGroupUserDTO> list = new ArrayList<UserGroupUserDTO>();
		List<UserGroupUser> listGroups = userGroupUserDao.find(searchUserGroupUserDTO);
		for (UserGroupUser userGroupUser : listGroups) {
			UserGroupUserDTO userGroupUserDTO = new UserGroupUserDTO();
			userGroupUserDTO.setId(userGroupUser.getId());
			UserDTO userDTO = new UserDTO();
			User user = userDao.getById(userGroupUser.getUser().getId());
			userDTO.setId(user.getId());
			userDTO.setName(user.getName());
			userDTO.setAddress(user.getAddress());
			userDTO.setCityName(user.getCityName());
			userDTO.setDistrictName(user.getDistrictName());
			userDTO.setWardsName(user.getWardsName());
			userDTO.setPhone(user.getPhone());
			userDTO.setImages(new ArrayList<>(user.getImages()));
			if (user.getCreatedBy() != null) {
				userDTO.setCreatedBy(user.getCreatedBy().getName());
			}
			userDTO.setUserGroupNames(new ArrayList<String>());
			userDTO.setUserGroupIds(new ArrayList<Long>());

			for (UserGroupUser userGroupUsers : user.getUserGroupUsers()) {
				userDTO.getUserGroupNames().add(userGroupUsers.getUserGroup().getName());
				userDTO.getUserGroupIds().add(userGroupUsers.getUserGroup().getId());
			}

			UserGroupDTO userGroupDTO = new UserGroupDTO();
			userGroupDTO.setId(userGroupUser.getUserGroup().getId());
			userGroupDTO.setName(userGroupUser.getUserGroup().getName());
			userGroupUserDTO.setUserDTO(userDTO);
			userGroupUserDTO.setUserGroupDTO(userGroupDTO);
			list.add(userGroupUserDTO);
		}

		return list;

	}

	@Override
	public long count(SearchUserGroupUserDTO searchUserGroupUserDTO) {
		return userGroupUserDao.count(searchUserGroupUserDTO);
	}

	@Override
	public long countTotal(SearchUserGroupUserDTO searchUserGroupUserDTO) {
		return userGroupUserDao.countTotal(searchUserGroupUserDTO);
	}

	@Override
	public void deleteUserGroupUser(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		user.getUserGroupUsers().clear();
		userDao.update(user);

	}

}
