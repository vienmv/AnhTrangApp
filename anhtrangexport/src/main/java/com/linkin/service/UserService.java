package com.linkin.service;

import java.util.List;

import com.linkin.model.SearchUserDTO;
import com.linkin.model.UserDTO;

public interface UserService {
	
	void addUser(UserDTO userDTO);

	void updateUser(UserDTO userDTO);

	void updateProfile(UserDTO userDTO);

	void deleteUser(Long id);

	List<UserDTO> find(SearchUserDTO searchUserDTO);
	
	UserDTO getUserById(Long id);

	void changeAccountLock(long id);

	long count(SearchUserDTO searchUserDTO);

	long countTotal(SearchUserDTO searchUserDTO);

	void changePassword(UserDTO accountDTO);

	void resetPassword(UserDTO accountDTO);

	void setupUserPassword(UserDTO accountDTO);
	
	void updateToken(UserDTO userDTO);

	void deleteToken(UserDTO userDTO);
	
	void updateUserRoles(UserDTO userDTO);
	
	void updateCreatedBy(UserDTO userDTO);
	
}
