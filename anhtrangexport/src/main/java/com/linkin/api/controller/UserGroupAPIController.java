package com.linkin.api.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.ResponseDTO;
import com.linkin.model.SearchUserGroupDTO;
import com.linkin.model.SearchUserGroupUserDTO;
import com.linkin.model.UserDTO;
import com.linkin.model.UserGroupDTO;
import com.linkin.model.UserGroupUserDTO;
import com.linkin.service.UserGroupService;
import com.linkin.service.UserGroupUserService;
import com.linkin.service.UserService;
import com.linkin.utils.RoleEnum;

@CrossOrigin(origins = "*", maxAge = -1)
@RestController
@RequestMapping("/api")
public class UserGroupAPIController {

	@Autowired
	UserGroupService userGroupService;

	@Autowired
	UserService userService;

	@Autowired
	UserGroupUserService userGroupUserService;

	@PostMapping("/admin/user-group/add")
	public UserGroupDTO addUserGroup(@RequestBody UserGroupDTO userGroupDTO) {
		userGroupService.add(userGroupDTO);
		return userGroupDTO;
	}

	@PutMapping(value = "/admin/user-group/update")
	public void updateUserGroup(@RequestBody UserGroupDTO userGroupDTO) {
		userGroupService.update(userGroupDTO);
	}

	@DeleteMapping(value = "/admin/user-group/delete/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		userGroupService.delete(id);
	}

	@DeleteMapping(value = "/admin/user-group/delete-multi/{ids}")
	public void delete(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				userGroupService.delete(id);
			} catch (Exception e) {

			}
		}
	}

	@PostMapping(value = "/admin/user-group/search")
	public ResponseDTO<UserGroupDTO> find(@RequestBody SearchUserGroupDTO searchUserGroupDTO) {
		ResponseDTO<UserGroupDTO> responseDTO = new ResponseDTO<UserGroupDTO>();
		responseDTO.setData(userGroupService.find(searchUserGroupDTO));
		responseDTO.setRecordsFiltered(userGroupService.count(searchUserGroupDTO));
		responseDTO.setRecordsTotal(userGroupService.countTotal(searchUserGroupDTO));
		return responseDTO;
	}

	@PostMapping(value = "/admin/user-group-infor/search")
	public ResponseDTO<UserGroupUserDTO> findUserGroupInfor(
			@RequestBody SearchUserGroupUserDTO searchUserGroupUserDTO) {

		ResponseDTO<UserGroupUserDTO> responseDTO = new ResponseDTO<UserGroupUserDTO>();
		responseDTO.setData(userGroupUserService.find(searchUserGroupUserDTO));
		responseDTO.setRecordsFiltered(userGroupUserService.count(searchUserGroupUserDTO));
		responseDTO.setRecordsTotal(userGroupUserService.countTotal(searchUserGroupUserDTO));
		return responseDTO;
	}

	@GetMapping("/admin/user-group/{id}")
	public @ResponseBody UserGroupDTO get(@PathVariable(name = "id") Long id) {
		return userGroupService.get(id);
	}

	@PostMapping("/admin/user-group/add-user")
	public UserDTO addUserInToGroup(@RequestBody UserDTO userDTO) {
		
		UserGroupDTO userGroupDTO = new UserGroupDTO();
		userGroupDTO.setId(userDTO.getUserGroupId());
		for (Long id : userDTO.getListUserId()) {
			UserGroupUserDTO userGroupUserDTO = new UserGroupUserDTO();
			userGroupUserDTO.setUserDTO(new UserDTO(id));
			userGroupUserDTO.setUserGroupDTO(userGroupDTO);
			try {
				userGroupUserService.add(userGroupUserDTO);
			} catch (Exception e) {
				
			}
			
		}
		return userDTO;
	}

	@GetMapping("/admin/user-group-infor/{id}")
	public String userGroupInfor(@PathVariable(name = "id") Long idUserGroup, Model model) {

		UserGroupDTO userGroupDTO = userGroupService.get(idUserGroup);
		model.addAttribute("userGroup", userGroupDTO);
		return "admin/user-group/user-group-infor";
	}

	@DeleteMapping(value = "/admin/user-group/delete-user/{id}")
	public void deleteGroupForUser(@PathVariable(name = "id") Long id) {
		userGroupUserService.delete(id);
	}

	@DeleteMapping(value = "/admin/user-group/delete-user-multi/{ids}")
	public void deleteGroupForUser(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				// UserDTO userDTO = new UserDTO(id);
				userGroupUserService.delete(id);
			} catch (Exception e) {

			}
		}
	}

	@PostMapping("/admin/user-group/excel/export")
	public @ResponseBody String exportExcel(@RequestBody SearchUserGroupDTO searchUserGroupDTO) {
		searchUserGroupDTO.setStart(null);
		List<UserGroupDTO> userGroupDTOs = userGroupService.find(searchUserGroupDTO);

		// add date to name of exel file
		String fileName = "nhomNguoiDung.xlsx";

		System.out.println("Create file excel");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("nhomNguoiDung");

		int rowNum = 0;
		Row firstRow = sheet.createRow(rowNum++);
		firstRow.createCell(0).setCellValue("id");
		firstRow.createCell(1).setCellValue("Tên nhom");

		for (UserGroupDTO userGroupDTO : userGroupDTOs) {
			Row row = sheet.createRow(rowNum++);
			row.createCell(0).setCellValue(userGroupDTO.getId());
			row.createCell(1).setCellValue(userGroupDTO.getName());

		}
		try {
			FileOutputStream outputStream = new FileOutputStream(fileName);
			workbook.write(outputStream);
			workbook.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return fileName;
	}

	@PostMapping("/admin/user-group-infor/excel/export")
	public @ResponseBody String exportExcelUserGroup(@RequestBody SearchUserGroupDTO searchUserGroupDTO) {
//		searchUserGroupDTO.setStart(null);
//		SearchUserDTO searchUserDTO = new SearchUserDTO();
//		searchUserDTO.setUserGroupId(searchUserGroupDTO.getId());

		SearchUserGroupUserDTO searchUserGroupUserDTO = new SearchUserGroupUserDTO();
		searchUserGroupUserDTO.setUserGroupId(searchUserGroupDTO.getId());
		searchUserGroupUserDTO.setStart(null);
		List<UserGroupUserDTO> userGroupUserDTOs = userGroupUserService.find(searchUserGroupUserDTO);
		// add date to name of exel file
		String fileName = "chiTietNhomNguoiDung.xlsx";

		System.out.println("Create file excel");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("chiTietNhomNguoiDung #" + searchUserGroupDTO.getId());

		int rowNum = 0;
		Row firstRow = sheet.createRow(rowNum++);
		Cell c0 = firstRow.createCell(0);
		c0.setCellValue("id");
		Cell c1 = firstRow.createCell(1);
		c1.setCellValue("Tên");
		Cell c2 = firstRow.createCell(2);
		c2.setCellValue("số điện thoại");
		Cell c3 = firstRow.createCell(3);
		c3.setCellValue("địa chỉ");
		Cell c4 = firstRow.createCell(4);
		c4.setCellValue("vai trò");

		firstRow.createCell(5).setCellValue("Người tạo");
		firstRow.createCell(6).setCellValue("Nhóm người dùng");

		for (UserGroupUserDTO userGroupUserDTO : userGroupUserDTOs) {
			UserDTO userDTO= userService.getUserById(userGroupUserDTO.getUserDTO().getId());
			Row row = sheet.createRow(rowNum++);
			Cell cell0 = row.createCell(0);
			cell0.setCellValue(userDTO.getId());
			Cell cell1 = row.createCell(1);
			cell1.setCellValue(userDTO.getName());
			Cell cell2 = row.createCell(2);
			cell2.setCellValue(userDTO.getPhone());
			Cell cell3 = row.createCell(3);
			cell3.setCellValue(userDTO.getAddress());
			Cell cell4 = row.createCell(4);
			cell4.setCellValue(getStatus(userDTO.getRoles()).toString());

			row.createCell(5).setCellValue(userDTO.getCreatedBy());
			Cell cell6 = row.createCell(6);
			cell6.setCellValue(getUserGroupNames(userDTO.getUserGroupNames()).toString());
		}
		try {
			FileOutputStream outputStream = new FileOutputStream(fileName);
			workbook.write(outputStream);
			workbook.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		return fileName;
	}

	public List<String> getStatus(List<String> status) {
		List<String> list = new ArrayList<String>();
		for (String string : status) {
			if (string.equals("ROLE_" + RoleEnum.ADMIN.name())) {
				list.add(RoleEnum.ADMIN.name());
				// return "ADMIN";
			} else if (string.equals("ROLE_" + RoleEnum.SHIPPER.name())) {
				list.add(RoleEnum.SHIPPER.name());
			} else if (string.equals("ROLE_" + RoleEnum.SELLER.name())) {
				list.add(RoleEnum.SELLER.name());
			} else {
				list.add(RoleEnum.MEMBER.name());
			}
		}
		return list;
	}

	public List<String> getUserGroupNames(List<String> status) {
		List<String> list = new ArrayList<String>();
		for (String string : status) {
			list.add(string);
		}
		return list;
	}

}
