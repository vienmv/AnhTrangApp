package com.linkin.api.controller;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.ResponseDTO;
import com.linkin.model.SearchUserDTO;
import com.linkin.model.UserDTO;
import com.linkin.model.UserGroupDTO;
import com.linkin.model.UserGroupUserDTO;
import com.linkin.model.UserPrincipal;
import com.linkin.service.UserGroupUserService;
import com.linkin.service.UserService;
import com.linkin.utils.FileStore;
import com.linkin.utils.RoleEnum;

@CrossOrigin(origins = "*", maxAge = -1)
@RestController
@RequestMapping("/api")
public class UserAPIController {

	@Autowired
	private UserService userService;

	@Autowired
	private UserGroupUserService userGroupUserService;

	// login me
	@PostMapping(value = "/member/me")
	private UserDTO me(@RequestParam(name = "token", required = false) String token) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		UserDTO userDTO = new UserDTO();
		userDTO.setId(currentUser.getId());
		userDTO.setDeviceId(token);
		userService.updateToken(userDTO);

		return userService.getUserById(currentUser.getId());
	}

	@PostMapping("/user/register")
	public UserDTO register(@RequestBody UserDTO userDTO) {
		userDTO.setEnabled(true);
		userDTO.setRoles(Arrays.asList("ROLE_" + RoleEnum.MEMBER.name()));
		userService.addUser(userDTO);
		// send email
		return userDTO;
	}

	@PostMapping("/seller/user/add")
	public UserDTO addStaffUser(@ModelAttribute UserDTO userDTO) {
		userDTO.setRoles(Arrays.asList("ROLE_" + RoleEnum.MEMBER.name()));
		userDTO.setImages(FileStore.getFilePaths(userDTO.getImageFiles(), "user-"));
		userDTO.setEnabled(true);
		userService.addUser(userDTO);
		
		// send email
		return userDTO;
	}

	@PostMapping(value = "/seller/user/list")
	public ResponseDTO<UserDTO> staffUserList(@RequestBody SearchUserDTO searchUserDTO) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		if (!currentUser.getRoles().contains("ROLE_" + RoleEnum.ADMIN.name())) {
			searchUserDTO.setCreatedById(currentUser.getId());
		}

		ResponseDTO<UserDTO> responseDTO = new ResponseDTO<>();
		responseDTO.setData(userService.find(searchUserDTO));
		responseDTO.setRecordsFiltered(userService.count(searchUserDTO));
		responseDTO.setRecordsTotal(userService.countTotal(searchUserDTO));
		return responseDTO;
	}

	@PostMapping(value = "/seller/user/update")
	public void updateStaffUser(@ModelAttribute UserDTO userDTO) {

		List<String> images = userDTO.getImages();
		List<String> newImages = FileStore.getFilePaths(userDTO.getImageFiles(), "user-");
		if (images != null) {
			newImages.addAll(images);
		}
		userDTO.setImages(newImages);
		userService.updateUser(userDTO);

	}

	@PostMapping("/admin/user/add")
	public UserDTO addUser(@RequestBody UserDTO userDTO) {
		userDTO.setEnabled(true);
		userService.addUser(userDTO);
		// send email
		return userDTO;
	}

	@PutMapping(value = "/admin/user/update")
	public void updateUser(@RequestBody UserDTO userDTO) {

		userGroupUserService.deleteUserGroupUser(userDTO);
		for (Long userGroupId : userDTO.getUserGroupIds()) {
			UserGroupUserDTO userGroupUserDTO = new UserGroupUserDTO();
			UserGroupDTO userGroupDTO = new UserGroupDTO();
			userGroupDTO.setId(userGroupId);
			userGroupUserDTO.setUserDTO(userDTO);
			userGroupUserDTO.setUserGroupDTO(userGroupDTO);
			userGroupUserService.add(userGroupUserDTO);
		}
		userService.updateUser(userDTO);
	}

	@PutMapping(value = "/admin/user/update-group")
	public void updateUserGroup(@RequestBody UserDTO userDTO) {

		userGroupUserService.deleteUserGroupUser(userDTO);
		for (Long userGroupId : userDTO.getUserGroupIds()) {
			UserGroupUserDTO userGroupUserDTO = new UserGroupUserDTO();
			UserGroupDTO userGroupDTO = new UserGroupDTO();
			userGroupDTO.setId(userGroupId);
			userGroupUserDTO.setUserDTO(userDTO);
			userGroupUserDTO.setUserGroupDTO(userGroupDTO);
			userGroupUserService.add(userGroupUserDTO);
		}

	}

	@DeleteMapping(value = "/admin/user/delete/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		userService.deleteUser(id);
	}

	@DeleteMapping(value = "/admin/user/delete-multi/{ids}")
	public void delete(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				userService.deleteUser(id);
			} catch (Exception e) {

			}
		}
	}

	@PutMapping("/admin/user/change-lock/{id}")
	public void changeLockedUserStatus(@PathVariable(name = "id") Long id) {
		userService.changeAccountLock(id);
	}

	@PostMapping(value = "/admin/accounts")
	public ResponseDTO<UserDTO> findCustomers(@RequestBody SearchUserDTO searchUserDTO) {
		ResponseDTO<UserDTO> responseDTO = new ResponseDTO<UserDTO>();
		responseDTO.setData(userService.find(searchUserDTO));
		responseDTO.setRecordsFiltered(userService.count(searchUserDTO));
		responseDTO.setRecordsTotal(userService.countTotal(searchUserDTO));
		return responseDTO;
	}

	@PostMapping(value = "/seller/accounts")
	public ResponseDTO<UserDTO> findAccounts(@RequestBody SearchUserDTO searchUserDTO) {
		ResponseDTO<UserDTO> responseDTO = new ResponseDTO<UserDTO>();
		responseDTO.setData(userService.find(searchUserDTO));
		responseDTO.setRecordsFiltered(userService.count(searchUserDTO));
		responseDTO.setRecordsTotal(userService.countTotal(searchUserDTO));
		return responseDTO;
	}

	@PutMapping("/member/profile")
	public void profile(@RequestBody UserDTO userDTO) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		userDTO.setId(currentUser.getId());
		userService.updateProfile(userDTO);
	}

	@PutMapping("/member/password")
	public void changePassword(@RequestBody UserDTO userDTO) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		userDTO.setId(currentUser.getId());
		userService.changePassword(userDTO);
	}

	@PutMapping(value = "/member/logout")
	public void logout(@RequestBody String token) {
		if (token != null) {
			UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
					.getPrincipal();
			UserDTO userDTO = new UserDTO(currentUser.getId());
			userDTO.setDeviceId(token.split("=")[1]);
			userService.deleteToken(userDTO);
		}
	}

	@PutMapping(value = "/admin/user/update-roles")
	public void updateUserRole(@RequestBody UserDTO userDTO) {
		userService.updateUserRoles(userDTO);
	}

	@PutMapping(value = "/admin/update-created-by")
	public UserDTO updateCreatedBy(@RequestBody UserDTO userDTO) {
		userService.updateCreatedBy(userDTO);
		return userDTO;
	}

	@PutMapping("/resetpassword/{phone}")
	public void resetPassword(@PathVariable(name = "phone") String phone) {
		UserDTO dto = new UserDTO();
		dto.setPhone(phone);
		userService.resetPassword(dto);
	}

}
