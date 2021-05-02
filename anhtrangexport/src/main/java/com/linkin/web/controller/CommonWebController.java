package com.linkin.web.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class CommonWebController extends BaseWebController {
	
	@RequestMapping(value = "/")
	private String index(HttpServletRequest request) {
		return "redirect:/dang-nhap";
	}

	@RequestMapping(value = "/member/home")
	private String home(Model model) {
		return "admin/index";
	}

	@RequestMapping(value = { "/access-deny" })
	private String deny(HttpServletRequest request) {
		return getViewName(request, "admin/error/deny");
	}

}
