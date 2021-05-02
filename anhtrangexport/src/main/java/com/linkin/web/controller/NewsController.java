package com.linkin.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class NewsController {
	
	@GetMapping("/admin/news/list")
	public String listNews(Model model) {
		return "admin/news/list-news";
	}

}
