package com.linkin.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import com.linkin.dao.RoadDao;
import com.linkin.entity.Road;
import com.linkin.entity.User;
import com.linkin.model.SearchRoadDTO;

@Transactional
@Repository
public class RoadDaoImpl implements RoadDao {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public void add(Road road) {
		entityManager.persist(road);
	}

	@Override
	public void update(Road road) {
		entityManager.merge(road);
	}

	@Override
	public void delete(Long id) {
		entityManager.remove(getById(id));
	}

	@Override
	public Road getById(Long id) {
		return entityManager.find(Road.class, id);
	}

	@Override
	public List<Road> find(SearchRoadDTO searchRoadDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Road> criteriaQuery = criteriaBuilder.createQuery(Road.class);
		Root<Road> root = criteriaQuery.from(Road.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (searchRoadDTO.getUserId() != null) {
			Join<Road, User> user = root.join("user");
			Predicate predicate = criteriaBuilder.equal(user.get("id"), searchRoadDTO.getUserId());
			predicates.add(predicate);
		}


		if (StringUtils.isNotBlank(searchRoadDTO.getKeyword())) {
			Predicate predicate1 = criteriaBuilder.like(criteriaBuilder.lower(root.get("cityName")),
					"%" + searchRoadDTO.getKeyword().toLowerCase() + "%");
			predicates.add(criteriaBuilder.or(predicate1));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		// order
		if (StringUtils.equals(searchRoadDTO.getSortBy().getData(), "id")) {
			if (searchRoadDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(criteriaBuilder.asc(root.get("id")));
			} else {
				criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
			}
		} else if (StringUtils.equals(searchRoadDTO.getSortBy().getData(), "cityName")) {
			if (searchRoadDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(criteriaBuilder.asc(root.get("cityName")));
			} else {
				criteriaQuery.orderBy(criteriaBuilder.desc(root.get("cityName")));
			}
		}
		TypedQuery<Road> typedQuery = entityManager.createQuery(criteriaQuery.select(root));

		if (searchRoadDTO.getStart() != null) {
			typedQuery.setFirstResult((searchRoadDTO.getStart()));
			typedQuery.setMaxResults(searchRoadDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public Long count(SearchRoadDTO searchRoadDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Road> root = criteriaQuery.from(Road.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (searchRoadDTO.getUserId() != null) {
			Join<Road, User> user = root.join("user");
			Predicate predicate = criteriaBuilder.equal(user.get("id"), searchRoadDTO.getUserId());
			predicates.add(predicate);
		}


		if (StringUtils.isNotBlank(searchRoadDTO.getKeyword())) {
			Predicate predicate1 = criteriaBuilder.like(criteriaBuilder.lower(root.get("cityName")),
					"%" + searchRoadDTO.getKeyword().toLowerCase() + "%");
			predicates.add(criteriaBuilder.or(predicate1));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));
		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(criteriaBuilder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public Long countTotal(SearchRoadDTO searchRoadDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Road> root = criteriaQuery.from(Road.class);

		List<Predicate> predicates = new ArrayList<Predicate>();
		
		if (searchRoadDTO.getUserId() != null) {
			Join<Road, User> user = root.join("user");
			Predicate predicate = criteriaBuilder.equal(user.get("id"), searchRoadDTO.getUserId());
			predicates.add(predicate);
		}
		
		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(criteriaBuilder.count(root)));
		return typedQuery.getSingleResult();
	}

}
