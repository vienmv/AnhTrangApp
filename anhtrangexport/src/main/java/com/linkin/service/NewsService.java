package com.linkin.service;

import java.util.List;

import com.linkin.model.NewsDTO;
import com.linkin.model.SearchNewsDTO;

public interface NewsService {

	void add(NewsDTO newsDTO);

	void delete(Long id);

	void deleteAll();

	void update(NewsDTO newsDTO);

	List<NewsDTO> find(SearchNewsDTO searchNewsDTO);

	Long count(SearchNewsDTO searchNewsDTO);

	Long countTotal(SearchNewsDTO searchNewsDTO);

	NewsDTO get(Long id);

}
