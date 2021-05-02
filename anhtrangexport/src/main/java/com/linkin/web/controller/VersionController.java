package com.linkin.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class VersionController {
	
	@GetMapping("/admin/version/list")
	public String version() {
		return "admin/versions/list-versions";
	}
}
