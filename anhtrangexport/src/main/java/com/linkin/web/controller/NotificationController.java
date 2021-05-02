package com.linkin.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(value = "/admin")
public class NotificationController {

	@GetMapping("/notifications")
	public String listNotification(Model model) {
		return "admin/notification/list-notification";
	}
}
