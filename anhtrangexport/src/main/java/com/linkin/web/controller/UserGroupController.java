package com.linkin.web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.linkin.model.UserGroupDTO;
import com.linkin.service.UserGroupService;
@Controller
public class UserGroupController {
	
	@Autowired
	UserGroupService userGroupService;
	
	@GetMapping("/admin/user-group/list")
	public String list() {
		return "admin/user-group/list-user-group";
	}
	
	@GetMapping("/admin/user-group-infor/{id}")
	public String userGroupInfor(@PathVariable(name = "id") Long idUserGroup, Model model) {
		
		UserGroupDTO userGroupDTO = userGroupService.get(idUserGroup);
		model.addAttribute("userGroup", userGroupDTO);
		return "admin/user-group/user-group-infor";
	}
}
