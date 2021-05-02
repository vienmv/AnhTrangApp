package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.linkin.dao.RoadDao;
import com.linkin.dao.UserDao;
import com.linkin.entity.Road;
import com.linkin.entity.User;
import com.linkin.model.RoadDTO;
import com.linkin.model.SearchRoadDTO;
import com.linkin.service.RoadService;

@Service
@Transactional
public class RoadServiceImpl implements RoadService {

	@Autowired
	private RoadDao roadDao;
	
	@Autowired
	private UserDao userDao;

	@Override
	public void add(RoadDTO roadDTO) {
		User user  = userDao.getById(roadDTO.getUserId());
		if (roadDTO.getCities() != null) {
			List<Road> roads = new ArrayList<Road>(); 

			for (String roadName : new HashSet<String>(roadDTO.getCities())) {
				
				Road road = new Road();
				road.setCityName(roadName);
				road.setUser(user);
				roads.add(road);
				
			}
			
			user.getRoads().clear();
			user.getRoads().addAll(roads);

			userDao.update(user);
		}
		
	}

	@Override
	public void update(RoadDTO roadDTO) {
		Road road = roadDao.getById(roadDTO.getId());
		if (road != null) {
			BeanUtils.copyProperties(roadDTO, road);
			roadDao.update(road);
		}
	}

	@Override
	public void delete(Long id) {
		Road road = roadDao.getById(id);
		if (road != null) {
			roadDao.delete(id);
		}

	}

	@Override
	public RoadDTO getByid(Long id) {
		Road road = roadDao.getById(id);
		if (road != null) {
			return converDTO(road);
		}
		return null;
	}

	@Override
	public List<RoadDTO> find(SearchRoadDTO searchRoadDTO) {
		List<Road> roads = roadDao.find(searchRoadDTO);
		List<RoadDTO> roadDTOs = new ArrayList<RoadDTO>();
		roads.forEach(road -> {
			roadDTOs.add(converDTO(road));
		});

		return roadDTOs;
	}

	@Override
	public Long count(SearchRoadDTO searchRoadDTO) {
		return roadDao.count(searchRoadDTO);
	}

	@Override
	public Long countTotal(SearchRoadDTO serachRoadDTO) {
		return roadDao.countTotal(serachRoadDTO);
	}

	private RoadDTO converDTO(Road road) {
		RoadDTO roadDTO = new RoadDTO();
		BeanUtils.copyProperties(road, roadDTO);
		roadDTO.setUserId(road.getUser().getId());
		return roadDTO;

	}

}
