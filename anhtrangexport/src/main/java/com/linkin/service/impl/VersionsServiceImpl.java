package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.linkin.dao.VersionsDao;
import com.linkin.entity.Versions;
import com.linkin.model.SearchVersionsDTO;
import com.linkin.model.VersionsDTO;
import com.linkin.service.VersionService;

@Service
@Transactional
public class VersionsServiceImpl implements VersionService {

	@Autowired
	private VersionsDao versionsDao;

	@Override
	public void edit(VersionsDTO versionsDTO) {
		Versions versions = versionsDao.get(versionsDTO.getId());
		if (versions != null) {
			versions.setVersion(versionsDTO.getVersion());
			;
		}
		versionsDao.edit(versions);

	}

	@Override
	public List<VersionsDTO> find(SearchVersionsDTO searchVersionsDTO) {
		List<Versions> versions = versionsDao.find(searchVersionsDTO);
		List<VersionsDTO> versionsDTOs = new ArrayList<VersionsDTO>();
		versions.forEach(version -> {
			versionsDTOs.add(convertToDTO(version));
		});
		return versionsDTOs;
	}

	private VersionsDTO convertToDTO(Versions version) {
		VersionsDTO versionsDTO = new VersionsDTO();
		versionsDTO.setId(version.getId());
		versionsDTO.setVersion(version.getVersion());
		;
		return versionsDTO;
	}

	@Override
	public Long count(SearchVersionsDTO searchVersionsDTO) {

		return versionsDao.cout(searchVersionsDTO);
	}

	@Override
	public Long countTotal(SearchVersionsDTO searchVersionsDTO) {
		// TODO Auto-generated method stub
		return versionsDao.coutTotal(searchVersionsDTO);
	}

	@Override
	public VersionsDTO get(int id) {
		Versions versions = versionsDao.get(id);
		if (versions != null) {
			return convertToDTO(versions);
		}
		return null;
	}

}
