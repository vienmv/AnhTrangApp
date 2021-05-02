package com.linkin.dao;

import java.util.List;

import com.linkin.entity.Versions;
import com.linkin.model.SearchVersionsDTO;

public interface VersionsDao {

	void edit(Versions versions);

	List<Versions> find(SearchVersionsDTO searchVersionsDTO);

	Long cout(SearchVersionsDTO searchVersionsDTO);

	Long coutTotal(SearchVersionsDTO searchVersionsDTO);

	Versions get(int id);

}
