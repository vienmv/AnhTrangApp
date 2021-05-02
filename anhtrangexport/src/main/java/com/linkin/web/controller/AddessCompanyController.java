package com.linkin.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class AddessCompanyController {

	@GetMapping("/admin/address-company/list")
	public String list() {
		return "admin/address-company/list-address-company";
	}

	
}
