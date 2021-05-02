package com.linkin.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class RoadController {

	@GetMapping("/shipper/road/list")
	public String list() {
		return "admin/road/list-road";
	}
	
}
