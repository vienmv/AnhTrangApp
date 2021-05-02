package com.linkin.web.controller;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.ValidationUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.linkin.exception.NotMatchPasswordException;
import com.linkin.model.SearchUserDTO;
import com.linkin.model.UserDTO;
import com.linkin.model.UserPrincipal;
import com.linkin.service.UserService;
import com.linkin.utils.RoleEnum;

@Controller
public class UserWebController extends BaseWebController {
	@Autowired
	private UserService userService;

	@GetMapping("/dang-ky")
	public String register(HttpServletRequest request) {
		request.setAttribute("code", request.getParameter("code"));
		return "client/user/register";
	}

	@RequestMapping(value = "/dang-nhap")
	private String login(HttpSession httpSession, HttpServletRequest request,
			@RequestParam(required = false, name = "e") String error) {

		if (isLogin()) {
			return "redirect:/member/profile";
		}

		if (error != null) {
			Exception e = (Exception) httpSession.getAttribute("SPRING_SECURITY_LAST_EXCEPTION");
			request.setAttribute("msg", getLoginFailMessage(e));
		}

		return getViewName(request, "client/user/login");
	}

	public String getLoginFailMessage(Exception e) {
		if (e instanceof UsernameNotFoundException) {
			return getMessage("user.not.found");
		}
		if (e instanceof DisabledException) {
			return getMessage("user.disabled");
		}
		if (e instanceof BadCredentialsException) {
			return getMessage("user.bad.password");
		}

		return getMessage("user.not.found");
	}

	@GetMapping(value = "/member/doi-mat-khau")
	private String changePassword(Model model) {
		model.addAttribute("userAccountDTO", new UserDTO());
		return "admin/userAccount/changePassword";
	}

	@PostMapping(value = "/member/doi-mat-khau")
	private String changePassword(Model model, @ModelAttribute(name = "userAccountDTO") UserDTO userDTO,
			BindingResult bindingResult) {
		validateUserPassword(userDTO, bindingResult);
		if (bindingResult.hasErrors()) {
			return "admin/userAccount/changePassword";
		}
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		userDTO.setId(currentUser.getId());
		try {
			userService.changePassword(userDTO);
		} catch (NotMatchPasswordException ex) {
			bindingResult.rejectValue("password", "user.bad.password");
			return "admin/userAccount/changePassword";
		}
		return "redirect:/dang-xuat";
	}

	@GetMapping(value = "/member/profile")
	private String profile(Model model) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		UserDTO accountDTO = userService.getUserById(currentUser.getId());
		model.addAttribute("userAccountDTO", accountDTO);

		return "admin/userAccount/profile";
	}

	@PostMapping(value = "/member/profile")
	private String profile(Model model, @ModelAttribute(name = "userAccountDTO") UserDTO userDTO,
			BindingResult bindingResult) {
		ValidationUtils.rejectIfEmptyOrWhitespace(bindingResult, "name", "error.msg.empty.account.name");
		if (bindingResult.hasErrors()) {
			return "admin/userAccount/profile";
		}
		// save database
		userService.updateProfile(userDTO);
		return "redirect:/member/profile";
	}

	private void validateUserPassword(Object object, Errors errors) {
		UserDTO accountDTO = (UserDTO) object;
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "password", "error.msg.empty.account.password");
		if (accountDTO.getPassword().length() < 6 && StringUtils.isNotBlank(accountDTO.getPassword())) {
			errors.rejectValue("password", "error.msg.empty.account.password");
		}
		ValidationUtils.rejectIfEmptyOrWhitespace(errors, "repassword", "error.msg.empty.account.password");
		if (accountDTO.getRepassword().length() < 6 && StringUtils.isNotBlank(accountDTO.getRepassword())) {
			errors.rejectValue("repassword", "error.msg.empty.account.password");
		}
	}

	@PostMapping("/admin/user/excel/export")
	public @ResponseBody String exportExcel(@RequestBody SearchUserDTO searchUserDTO) {
		searchUserDTO.setStart(null);
		List<UserDTO> userDTOs = userService.find(searchUserDTO);

		// add date to name of exel file
		String fileName = "nguoiDung.xlsx";

		System.out.println("Create file excel");
		XSSFWorkbook workbook = new XSSFWorkbook();
		XSSFSheet sheet = workbook.createSheet("nguoiDung");

		int rowNum = 0;
		Row firstRow = sheet.createRow(rowNum++);
		Cell c0 = firstRow.createCell(0);
		c0.setCellValue("id");
		Cell c1 = firstRow.createCell(1);
		c1.setCellValue("Tên nhà cung cấp");
		Cell c2 = firstRow.createCell(2);
		c2.setCellValue("Địa chỉ");
		Cell c3 = firstRow.createCell(3);
		c3.setCellValue("Số điện thoại");
		Cell c4 = firstRow.createCell(4);
		c4.setCellValue("Vai trò");
		firstRow.createCell(5).setCellValue("Sale");
		firstRow.createCell(6).setCellValue("Nhóm người dùng");
		
		for (UserDTO userDTO : userDTOs) {
			Row row = sheet.createRow(rowNum++);
			Cell cell0 = row.createCell(0);
			cell0.setCellValue(userDTO.getId());
			Cell cell1 = row.createCell(1);
			cell1.setCellValue(userDTO.getName());
			Cell cell2 = row.createCell(2);
			cell2.setCellValue(userDTO.getAddress() + ", " + userDTO.getWardsName()
				+ ", " + userDTO.getDistrictName() + ", " + userDTO.getCityName());
			Cell cell3 = row.createCell(3);
			cell3.setCellValue(userDTO.getPhone());
			Cell cell4 = row.createCell(4);
			cell4.setCellValue(getStatus(userDTO.getRoles()).toString());
			row.createCell(5).setCellValue(userDTO.getCreatedBy());
			Cell cell6 = row.createCell(6);
			cell6.setCellValue(getUserGroupNames(userDTO.getUserGroupNames()).toString());
			//row.createCell(6).setCellValue();
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

	public String getTypes(List<Integer> types) {
		StringBuilder str = new StringBuilder();
		types.forEach((v) -> {
			if (v == 1) {
				str.append("- Seller ");
			} else if (v == 2) {
				str.append("- Shipper ");
			}
		});

		return str.toString();
	}

	public List<String> getStatus(List<String> status) {
		List<String> list = new ArrayList<String>();
		for (String string : status) {
			if (string.equals("ROLE_" + RoleEnum.ADMIN.name())) {
				list.add(RoleEnum.ADMIN.name());
				//return "ADMIN";
			} else if (string.equals("ROLE_" + RoleEnum.SHIPPER.name())) {
				list.add(RoleEnum.SHIPPER.name());
			} else if (string.equals("ROLE_" + RoleEnum.SELLER.name())) {
				list.add(RoleEnum.SELLER.name());
			} else if (string.equals("ROLE_" + RoleEnum.MEMBER.name())){
				list.add("Nhà cung cấp");
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
