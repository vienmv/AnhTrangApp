package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.session.SessionInformation;
import org.springframework.security.core.session.SessionRegistry;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.linkin.dao.UserDao;
import com.linkin.entity.User;
import com.linkin.entity.UserGroup;
import com.linkin.entity.UserGroupUser;
import com.linkin.exception.NotMatchPasswordException;
import com.linkin.model.SMSDTO;
import com.linkin.model.SearchUserDTO;
import com.linkin.model.UserDTO;
import com.linkin.model.UserPrincipal;
import com.linkin.service.SMSService;
import com.linkin.service.UserService;
import com.linkin.utils.DateTimeUtils;
import com.linkin.utils.FileStore;
import com.linkin.utils.PasswordGenerator;
import com.linkin.utils.RoleEnum;
import com.linkin.utils.SMSMessage;

@Service
@Transactional
public class UserServiceImpl implements UserService, UserDetailsService {

	@Autowired
	private UserDao userDao;

	@Autowired
	private SessionRegistry sessionRegistry;

	@Autowired
	private SMSService sMSService;

	@Override
	public void addUser(UserDTO userDTO) {
		User user = new User();
		user.setName(userDTO.getName());
		user.setPhone(userDTO.getPhone());
		user.setPassword(PasswordGenerator.getHashString(userDTO.getPassword()));
		user.setEnabled(userDTO.getEnabled());
		if (userDTO.getRoles() != null) {
			user.setRoles(userDTO.getRoles());
		}
		user.setAddress(userDTO.getAddress());
		user.setCityName(userDTO.getCityName());
		user.setDistrictName(userDTO.getDistrictName());
		user.setWardsName(userDTO.getWardsName());
		user.setImages(userDTO.getImages());

		user.setUserGroupUsers(new ArrayList<>());

		if (userDTO.getUserGroupIds() != null) {
			for (Long userGroupId : userDTO.getUserGroupIds()) {
				UserGroupUser userGroupUser = new UserGroupUser();
				userGroupUser.setUser(user);
				userGroupUser.setUserGroup(new UserGroup(userGroupId));

				user.getUserGroupUsers().add(userGroupUser);
			}
		}

		userDao.add(user);
		userDTO.setId(user.getId());
	}

	@Override
	public void updateUser(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null) {
			user.setName(userDTO.getName());
			user.setPhone(userDTO.getPhone());
			user.setAddress(userDTO.getAddress());
			user.setCityName(userDTO.getCityName());
			user.setDistrictName(userDTO.getDistrictName());
			user.setWardsName(userDTO.getWardsName());

			if (userDTO.getImages() != null) {
				List<String> images = user.getImages();
				images.removeAll(userDTO.getImages());
				FileStore.deleteFiles(images);

				user.setImages(userDTO.getImages());
			}
			userDao.update(user);
			expireUserSessions(user.getPhone());
		}
	}

	@Override
	public void updateProfile(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null) {
			user.setName(userDTO.getName());
			user.setCityName(userDTO.getCityName());
			user.setWardsName(userDTO.getWardsName());
			user.setDistrictName(userDTO.getDistrictName());
			user.setAddress(userDTO.getAddress());
			userDao.update(user);
		}
	}

	@Override
	public void deleteUser(Long id) {
		User user = userDao.getById(id);
		if (user != null) {
			userDao.delete(user);
			expireUserSessions(user.getPhone());
		}
	}

	@Override
	public List<UserDTO> find(SearchUserDTO searchUserDTO) {
		List<User> users = userDao.find(searchUserDTO);
		List<UserDTO> userDTOs = new ArrayList<UserDTO>();
		users.forEach(user -> {
			userDTOs.add(convertToDTO(user));
		});

		return userDTOs;
	}

	@Override
	public long count(SearchUserDTO searchUserDTO) {
		return userDao.count(searchUserDTO);
	}

	@Override
	public long countTotal(SearchUserDTO searchUserDTO) {
		return userDao.countTotal(searchUserDTO);
	}

	@Override
	public UserDTO getUserById(Long id) {
		User user = userDao.getById(id);
		if (user != null) {
			return convertToDTO(user);
		}
		return null;
	}

	private UserDTO convertToDTO(User user) {
		UserDTO userDTO = new UserDTO();
		userDTO.setId(user.getId());
		userDTO.setName(user.getName());
		userDTO.setPhone(user.getPhone());
		// userDTO.setRoleId(user.getRole().getId());
		userDTO.setAddress(user.getAddress());
		userDTO.setEnabled(user.getEnabled());
		userDTO.setRoles(new ArrayList<>(user.getRoles()));
		userDTO.setCreatedDate(DateTimeUtils.formatDate(user.getCreatedDate(), DateTimeUtils.DD_MM_YYYY_HH_MM));
		if (user.getCreatedBy() != null) {
			userDTO.setCreatedBy(user.getCreatedBy().getName());
		}

		userDTO.setImages(new ArrayList<>(user.getImages()));

		userDTO.setUserGroupNames(new ArrayList<String>());
		userDTO.setUserGroupIds(new ArrayList<Long>());

		for (UserGroupUser userGroupUser : user.getUserGroupUsers()) {
			userDTO.getUserGroupNames().add(userGroupUser.getUserGroup().getName());
			userDTO.getUserGroupIds().add(userGroupUser.getUserGroup().getId());
		}

		userDTO.setCityName(user.getCityName());
		userDTO.setDistrictName(user.getDistrictName());
		userDTO.setWardsName(user.getWardsName());

		return userDTO;
	}

	@Override
	public void changeAccountLock(long id) {
		User user = userDao.getById(id);
		if (user != null) {
			user.setEnabled(!user.getEnabled());
			userDao.update(user);

			expireUserSessions(user.getPhone());
		}
	}

	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = userDao.getByPhone(username.trim());
		if (user == null) {
			throw new UsernameNotFoundException("not found");
		}
		List<SimpleGrantedAuthority> authorities = new ArrayList<SimpleGrantedAuthority>();

		for (String role : user.getRoles()) {
			authorities.add(new SimpleGrantedAuthority(role));
		}

		UserPrincipal userPrincipal = new UserPrincipal(user.getPhone(), user.getPassword(), user.getEnabled(), true,
				true, true, authorities);
		userPrincipal.setId(user.getId());
		userPrincipal.setName(user.getName());
		userPrincipal.setRoles(user.getRoles());
		return userPrincipal;
	}

	@Override
	public void changePassword(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null && PasswordGenerator.checkHashStrings(userDTO.getPassword(), user.getPassword())) {
			user.setPassword(PasswordGenerator.getHashString(userDTO.getRepassword()));
			userDao.update(user);
			expireUserSessions(user.getPhone());
		} else {
			throw new NotMatchPasswordException("wrong password");
		}
	}

	@Override
	public void resetPassword(UserDTO userDTO) {
		User user = userDao.getByPhone(userDTO.getPhone());
		if (user != null) {
			String password = PasswordGenerator.generateRandomPassword();
			user.setPassword(PasswordGenerator.getHashString(password));

			userDao.update(user);

			SMSDTO smsDTO = new SMSDTO();
			smsDTO.setContent(SMSMessage.NEW_PASSWORD.replaceAll("\\{password\\}", password));
			smsDTO.setCustomerPhone(user.getPhone());
			sMSService.sendSMS(smsDTO);

			expireUserSessions(user.getPhone());
		} else {
			throw new NotMatchPasswordException("wrong phone");
		}
	}

	@Override
	public void setupUserPassword(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null) {
			user.setPassword(PasswordGenerator.getHashString(userDTO.getPassword()));
			userDao.update(user);

			SMSDTO smsDTO = new SMSDTO();
			smsDTO.setContent(SMSMessage.NEW_PASSWORD.replaceAll("\\{password\\}", userDTO.getPassword()));
			smsDTO.setCustomerPhone(user.getPhone());
			sMSService.sendSMS(smsDTO);

			expireUserSessions(user.getPhone());
		}
	}

	private void expireUserSessions(String username) {
		for (Object principal : sessionRegistry.getAllPrincipals()) {
			if (principal instanceof UserPrincipal) {
				UserPrincipal userDetails = (UserPrincipal) principal;
				if (userDetails.getUsername().equals(username)) {
					for (SessionInformation information : sessionRegistry.getAllSessions(userDetails, true)) {
						information.expireNow();
					}
				}
			}
		}
	}

	@Override
	public void updateToken(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null && userDTO.getDeviceId() != null) {
			String playerIds = user.getDeviceId();
			if (StringUtils.isNotBlank(playerIds)) {
				if (!playerIds.contains(userDTO.getDeviceId())) {
					playerIds += ";" + userDTO.getDeviceId();
					user.setDeviceId(playerIds);
				}
			} else {
				user.setDeviceId(userDTO.getDeviceId());
			}
			userDao.update(user);
		}
	}

	@Override
	public void deleteToken(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null && userDTO.getDeviceId() != null) {
			String playerIds = user.getDeviceId();
			if (playerIds != null) {
				if (playerIds.contains(";" + userDTO.getDeviceId())) {
					playerIds = playerIds.replace(";" + userDTO.getDeviceId(), "");
					user.setDeviceId(playerIds);
				} else if (playerIds.contains(userDTO.getDeviceId())) {
					playerIds = playerIds.replace(userDTO.getDeviceId(), "");
					user.setDeviceId(playerIds);
				}
				userDao.update(user);
			}
		}

	}

	@Override
	public void updateUserRoles(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		if (user != null) {
			if (userDTO.getRoles() != null) {
				user.setRoles(userDTO.getRoles());

				// thay doi role thi gui password moi
				String password = PasswordGenerator.generateRandomPassword();
				user.setPassword(PasswordGenerator.getHashString(password));
				SMSDTO smsDTO = new SMSDTO();
				smsDTO.setContent(SMSMessage.CHANGE_ROLE.replaceAll("\\{password\\}", password));
				smsDTO.setCustomerPhone(user.getPhone());
				sMSService.sendSMS(smsDTO);
			}
		}
	}

	@Override
	public void updateCreatedBy(UserDTO userDTO) {
		User user = userDao.getById(userDTO.getId());
		User createdBy = userDao.getById(userDTO.getCreatedById());

		if (user != null && createdBy != null) {
			user.setCreatedBy(createdBy);
			userDao.update(user);

			if (!createdBy.getRoles().contains("ROLE_" + RoleEnum.ADMIN.name())
					&& !createdBy.getRoles().contains("ROLE_" + RoleEnum.SELLER.name())
					&& createdBy.getRoles().get(0).equals("ROLE_" + RoleEnum.MEMBER.name())
					|| createdBy.getRoles().get(0).equals("ROLE_" + RoleEnum.SHIPPER.name())) {
				createdBy.getRoles().add("ROLE_" + RoleEnum.SELLER.name());

				// thay doi role thi gui password moi
				String password = PasswordGenerator.generateRandomPassword();
				createdBy.setPassword(PasswordGenerator.getHashString(password));

				userDao.update(createdBy);

				// gui tin nhan yeu cau dan nhap
				SMSDTO smsDTO = new SMSDTO();
				smsDTO.setContent(SMSMessage.CHANGE_ROLE.replaceAll("\\{password\\}", password));
				smsDTO.setCustomerPhone(createdBy.getPhone());
				sMSService.sendSMS(smsDTO);
			}
		}
	}
}
