package com.linkin.web.controller;

import java.io.FileInputStream;
import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.apache.poi.util.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@Controller
public class DownloadController {
	@RequestMapping(value = "/admin/file/{file:.+}")
	public void download(@PathVariable(value = "file") String fileName, HttpServletResponse response) {
		try {
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", String.format("inline; filename=\"" + fileName + "\""));

			FileInputStream fileInputStream = new FileInputStream(fileName);
			IOUtils.copy(fileInputStream, response.getOutputStream());
		} catch (IOException e) {
		}
	}
	
	@RequestMapping(value = "/staff/file/{file:.+}")
	public void staffDownload(@PathVariable(value = "file") String fileName, HttpServletResponse response) {
		try {
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", String.format("inline; filename=\"" + fileName + "\""));

			FileInputStream fileInputStream = new FileInputStream(fileName);
			IOUtils.copy(fileInputStream, response.getOutputStream());
		} catch (IOException e) {
		}
	}
}
