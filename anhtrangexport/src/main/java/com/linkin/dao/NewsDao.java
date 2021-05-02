package com.linkin.dao;

import java.util.List;

import com.linkin.entity.News;
import com.linkin.model.SearchNewsDTO;

public interface NewsDao {

	void add(News news);

	void delete(News news);
	
	void deleteAll();

	void update(News news);

	List<News> find(SearchNewsDTO searchNewsDTO);

	Long count(SearchNewsDTO searchNewsDTO);

	Long countTotal(SearchNewsDTO searchNewsDTO);

	News get(Long id);

}
