package com.linkin.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaDelete;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.linkin.dao.NewsDao;
import com.linkin.entity.News;
import com.linkin.entity.User;
import com.linkin.entity.UserGroup;
import com.linkin.entity.UserGroupUser;
import com.linkin.model.SearchNewsDTO;

@Repository
@Transactional
public class NewsDaoImpl extends JPARepository<News> implements NewsDao {

	@Autowired
	EntityManager entityManager;

	@Override
	public void deleteAll() {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaDelete<News> criteriaDelete = criteriaBuilder.createCriteriaDelete(News.class);
		criteriaDelete.from(News.class);
		entityManager.createQuery(criteriaDelete).executeUpdate();

	}

	@Override
	public void update(News news) {
		entityManager.merge(news);

	}

	@Override
	public List<News> find(SearchNewsDTO searchNewsDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<News> criteriaQuery = criteriaBuilder.createQuery(News.class);
		Root<News> root = criteriaQuery.from(News.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (StringUtils.isNotBlank(searchNewsDTO.getKeyword())) {
			Predicate predicate1 = criteriaBuilder.like(criteriaBuilder.lower(root.get("content")),
					"%" + searchNewsDTO.getKeyword().toLowerCase() + "%");
			Predicate predicate2 = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),
					"%" + searchNewsDTO.getKeyword().toLowerCase() + "%");

			predicates.add(criteriaBuilder.or(predicate1, predicate2));
		}

		if (searchNewsDTO.getUserGroupId() != null) {
			Join<News, UserGroup> userGroup = root.join("userGroup");

			Predicate predicate = criteriaBuilder.equal(userGroup.get("id"), searchNewsDTO.getUserGroupId());
			predicates.add(predicate);
		}

		if (searchNewsDTO.getUserId() != null) {
			Join<News, UserGroup> userGroup = root.join("userGroup");
			Join<UserGroup, UserGroupUser> userGroupUser = userGroup.join("userGroupUsers");
			Join<UserGroupUser, User> user = userGroupUser.join("user");
			Predicate predicate = criteriaBuilder.equal(user.get("id"), searchNewsDTO.getUserId());
			predicates.add(predicate);
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		// order
		if (StringUtils.equals(searchNewsDTO.getSortBy().getData(), "id")) {
			if (searchNewsDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(criteriaBuilder.asc(root.get("id")));
			} else {
				criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
			}
		} else if (StringUtils.equals(searchNewsDTO.getSortBy().getData(), "createdDate")) {
			if (searchNewsDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(criteriaBuilder.asc(root.get("createdDate")));
			} else {
				criteriaQuery.orderBy(criteriaBuilder.desc(root.get("createdDate")));
			}
		}

		TypedQuery<News> typedQuery = entityManager.createQuery(criteriaQuery.select(root));
		if (searchNewsDTO.getStart() != null) {
			typedQuery.setFirstResult((searchNewsDTO.getStart()));
			typedQuery.setMaxResults(searchNewsDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public Long count(SearchNewsDTO searchNewsDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<News> root = criteriaQuery.from(News.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (StringUtils.isNotBlank(searchNewsDTO.getKeyword())) {
			Predicate predicate1 = criteriaBuilder.like(criteriaBuilder.lower(root.get("content")),
					"%" + searchNewsDTO.getKeyword().toLowerCase() + "%");
			Predicate predicate2 = criteriaBuilder.like(criteriaBuilder.lower(root.get("title")),
					"%" + searchNewsDTO.getKeyword().toLowerCase() + "%");

			predicates.add(criteriaBuilder.or(predicate1, predicate2));
		}

		if (searchNewsDTO.getUserGroupId() != null) {
			Join<News, UserGroup> userGroup = root.join("userGroup");

			Predicate predicate = criteriaBuilder.equal(userGroup.get("id"), searchNewsDTO.getUserGroupId());
			predicates.add(predicate);
		}

		if (searchNewsDTO.getUserId() != null) {
			Join<News, UserGroup> userGroup = root.join("userGroup");
			Join<UserGroup, UserGroupUser> userGroupUser = userGroup.join("userGroupUsers");
			Join<UserGroupUser, User> user = userGroupUser.join("user");

			Predicate predicate = criteriaBuilder.equal(user.get("id"), searchNewsDTO.getUserId());
			predicates.add(predicate);
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(criteriaBuilder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public Long countTotal(SearchNewsDTO searchNewsDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<News> root = criteriaQuery.from(News.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (searchNewsDTO.getUserGroupId() != null) {
			Join<News, UserGroup> userGroup = root.join("userGroup");

			Predicate predicate = criteriaBuilder.equal(userGroup.get("id"), searchNewsDTO.getUserGroupId());
			predicates.add(predicate);
		}

		if (searchNewsDTO.getUserId() != null) {
			Join<News, UserGroup> userGroup = root.join("userGroup");
			Join<UserGroup, UserGroupUser> userGroupUser = userGroup.join("userGroupUsers");
			Join<UserGroupUser, User> user = userGroupUser.join("user");

			Predicate predicate = criteriaBuilder.equal(user.get("id"), searchNewsDTO.getUserId());
			predicates.add(predicate);
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(criteriaBuilder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public News get(Long id) {
		return entityManager.find(News.class, id);
	}

}
