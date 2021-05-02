package com.linkin.service;

import java.util.List;

import com.linkin.model.SearchVersionsDTO;
import com.linkin.model.VersionsDTO;

public interface VersionService  {

	void edit(VersionsDTO versionsDTO);

	List<VersionsDTO> find(SearchVersionsDTO searchVersionsDTO);
	
	Long count(SearchVersionsDTO searchVersionsDTO);
	
	Long countTotal(SearchVersionsDTO searchVersionsDTO);

	VersionsDTO get(int id);
}
