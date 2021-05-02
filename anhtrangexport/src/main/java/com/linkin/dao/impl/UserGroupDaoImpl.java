package com.linkin.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.linkin.dao.UserGroupDao;
import com.linkin.entity.UserGroup;
import com.linkin.model.SearchUserGroupDTO;

@Repository
@Transactional
public class UserGroupDaoImpl extends JPARepository<UserGroup> implements UserGroupDao {

	@PersistenceContext
	EntityManager entityManager;

	@Override
	public List<UserGroup> find(SearchUserGroupDTO searchUserGroupDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<UserGroup> criteriaQuery = builder.createQuery(UserGroup.class);
		Root<UserGroup> root = criteriaQuery.from(UserGroup.class);

		// Constructing list of parameters
		List<Predicate> predicates = new ArrayList<Predicate>();
		if (StringUtils.isNotBlank(searchUserGroupDTO.getKeyword())) {
			Predicate predicate1 = builder.like(builder.lower(root.get("name")),
					"%" + searchUserGroupDTO.getKeyword().toLowerCase() + "%");

			predicates.add(predicate1);
		}
		criteriaQuery.where(predicates.toArray(new Predicate[] {}));
		// order
		if (StringUtils.equals(searchUserGroupDTO.getSortBy().getData(), "id")) {
			if (searchUserGroupDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(builder.asc(root.get("id")));
			} else {
				criteriaQuery.orderBy(builder.desc(root.get("id")));
			}
		} else if (StringUtils.equals(searchUserGroupDTO.getSortBy().getData(), "name")) {
			if (searchUserGroupDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(builder.asc(root.get("name")));
			} else {
				criteriaQuery.orderBy(builder.desc(root.get("name")));
			}
		}

		TypedQuery<UserGroup> typedQuery = entityManager.createQuery(criteriaQuery.select(root));
		if (searchUserGroupDTO.getStart() != null) {
			typedQuery.setFirstResult(searchUserGroupDTO.getStart());
			typedQuery.setMaxResults(searchUserGroupDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public long count(SearchUserGroupDTO searchUserGroupDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<UserGroup> root = criteriaQuery.from(UserGroup.class);

		// Constructing list of parameters
		List<Predicate> predicates = new ArrayList<Predicate>();
		if (StringUtils.isNotBlank(searchUserGroupDTO.getKeyword())) {
			Predicate predicate1 = builder.like(builder.lower(root.get("name")),
					"%" + searchUserGroupDTO.getKeyword().toLowerCase() + "%");
			predicates.add(predicate1);
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));
		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public long countTotal(SearchUserGroupDTO searchUserGroupDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<UserGroup> root = criteriaQuery.from(UserGroup.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public UserGroup get(Long id) {
		return entityManager.find(UserGroup.class, id);
	}

}
