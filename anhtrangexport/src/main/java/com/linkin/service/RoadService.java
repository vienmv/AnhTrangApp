package com.linkin.service;

import java.util.List;

import com.linkin.model.RoadDTO;
import com.linkin.model.SearchRoadDTO;

public interface RoadService {
	void add(RoadDTO roadDTO);
	
	void update(RoadDTO roadDTO);

	void delete(Long id);

	RoadDTO getByid(Long id);

	List<RoadDTO> find(SearchRoadDTO searchRoadDTO);

	Long count(SearchRoadDTO searchRoadDTO);

	Long countTotal(SearchRoadDTO serachRoadDTO);

}
