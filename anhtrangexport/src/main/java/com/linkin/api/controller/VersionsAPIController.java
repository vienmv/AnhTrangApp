package com.linkin.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.ResponseDTO;
import com.linkin.model.SearchVersionsDTO;
import com.linkin.model.VersionsDTO;
import com.linkin.service.VersionService;

@CrossOrigin(origins = "*", maxAge = -1)
@RestController
@RequestMapping("/api")
public class VersionsAPIController {

	@Autowired
	private VersionService versionService;

	@PostMapping(value = "/admin/version/search")
	public ResponseDTO<VersionsDTO> find(@RequestBody SearchVersionsDTO searchVersionsDTO) {
		ResponseDTO<VersionsDTO> responseDTO = new ResponseDTO<VersionsDTO>();
		responseDTO.setData(versionService.find(searchVersionsDTO));
		responseDTO.setRecordsFiltered(versionService.count(searchVersionsDTO));
		responseDTO.setRecordsTotal(versionService.countTotal(searchVersionsDTO));
		return responseDTO;
	}

	@PutMapping("/admin/version/edit")
	public void update(@RequestBody VersionsDTO versionsDTO) {
		versionService.edit(versionsDTO);
	}

	@GetMapping("/version/get")
	public VersionsDTO getById() {
		return versionService.get(1);
	}

}
