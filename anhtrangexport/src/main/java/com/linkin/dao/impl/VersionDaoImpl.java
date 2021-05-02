package com.linkin.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.linkin.dao.VersionsDao;
import com.linkin.entity.Versions;
import com.linkin.model.SearchVersionsDTO;

@Transactional
@Repository
public class VersionDaoImpl implements VersionsDao {

	@Autowired
	EntityManager entityManager;

	@Override
	public void edit(Versions versions) {
		entityManager.merge(versions);

	}

	@Override
	public List<Versions> find(SearchVersionsDTO searchVersionsDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Versions> criteriaQuery = builder.createQuery(Versions.class);
		Root<Versions> root = criteriaQuery.from(Versions.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (StringUtils.isNotBlank(searchVersionsDTO.getKeyword())) {
			Predicate predicate1 = builder.like(builder.lower(root.get("version")),
					"%" + searchVersionsDTO.getKeyword().toLowerCase() + "%");

			predicates.add(builder.or(predicate1));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Versions> typedQuery = entityManager.createQuery(criteriaQuery.select(root));

		if (searchVersionsDTO.getStart() != null) {
			typedQuery.setFirstResult((searchVersionsDTO.getStart()));
			typedQuery.setMaxResults(searchVersionsDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public Long cout(SearchVersionsDTO searchVersionsDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<Versions> root = criteriaQuery.from(Versions.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (StringUtils.isNotBlank(searchVersionsDTO.getKeyword())) {
			Predicate predicate1 = builder.like(builder.lower(root.get("version")),
					"%" + searchVersionsDTO.getKeyword().toLowerCase() + "%");

			predicates.add(builder.or(predicate1));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public Long coutTotal(SearchVersionsDTO searchVersionsDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<Versions> root = criteriaQuery.from(Versions.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public Versions get(int id) {
		// TODO Auto-generated method stub
		return entityManager.find(Versions.class, id);
	}

}
