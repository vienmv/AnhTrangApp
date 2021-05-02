package com.linkin.dao;

import java.util.List;

import com.linkin.entity.Road;
import com.linkin.model.SearchRoadDTO;

public interface RoadDao {

	void add(Road road);

	void update(Road road);

	void delete(Long id);

	Road getById(Long id);

	List<Road> find(SearchRoadDTO searchRoadDTO);

	Long count(SearchRoadDTO searchRoadDTO);

	Long countTotal(SearchRoadDTO searchRoadDTO);

}
