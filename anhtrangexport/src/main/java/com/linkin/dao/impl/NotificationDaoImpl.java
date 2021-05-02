package com.linkin.dao.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;
import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Join;
import javax.persistence.criteria.JoinType;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import javax.transaction.Transactional;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Repository;

import com.linkin.dao.NotificationDao;
import com.linkin.entity.Notification;
import com.linkin.entity.User;
import com.linkin.model.SearchNotificationDTO;

@Transactional
@Repository
public class NotificationDaoImpl implements NotificationDao {

	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public void add(Notification notification) {
		entityManager.persist(notification);
	}

	@Override
	public void update(Notification notification) {
		entityManager.merge(notification);
	}

	@Override
	public void delete(Long id) {
		entityManager.remove(getById(id));
	}

	@Override
	public Notification getById(Long id) {
		return entityManager.find(Notification.class, id);
	}

	@Override
	public List<Notification> find(SearchNotificationDTO searchNotificationDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Notification> criteriaQuery = criteriaBuilder.createQuery(Notification.class);
		Root<Notification> root = criteriaQuery.from(Notification.class);
		Join<Notification, User> user = root.join("user", JoinType.LEFT);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (StringUtils.isNotBlank(searchNotificationDTO.getKeyword())) {
			Predicate predicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("content")),
					"%" + searchNotificationDTO.getKeyword().toLowerCase() + "%");
			predicates.add(predicate);
		}

		if (searchNotificationDTO.getUserId() != null) {
			Predicate predicate1 = criteriaBuilder.equal(user.get("id"), searchNotificationDTO.getUserId());
			Predicate predicate2 = criteriaBuilder.isNull(user);

			predicates.add(criteriaBuilder.or(predicate1, predicate2));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		// order
		if (StringUtils.equals(searchNotificationDTO.getSortBy().getData(), "createdDate")) {
			if (searchNotificationDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(criteriaBuilder.asc(root.get("createdDate")));
			} else {
				criteriaQuery.orderBy(criteriaBuilder.desc(root.get("createdDate")));
			}
		} else if (StringUtils.equals(searchNotificationDTO.getSortBy().getData(), "id")) {
			if (searchNotificationDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(criteriaBuilder.asc(root.get("id")));
			} else {
				criteriaQuery.orderBy(criteriaBuilder.desc(root.get("id")));
			}
		} else {
			criteriaQuery.orderBy(criteriaBuilder.desc(root.get("createdDate")));
		}

		TypedQuery<Notification> typedQuery = entityManager.createQuery(criteriaQuery.select(root));
		if (searchNotificationDTO.getStart() != null) {
			typedQuery.setFirstResult((searchNotificationDTO.getStart()));
			typedQuery.setMaxResults(searchNotificationDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public Long count(SearchNotificationDTO searchNotificationDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Notification> root = criteriaQuery.from(Notification.class);
		Join<Notification, User> user = root.join("user", JoinType.LEFT);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (StringUtils.isNotBlank(searchNotificationDTO.getKeyword())) {
			Predicate predicate = criteriaBuilder.like(criteriaBuilder.lower(root.get("content")),
					"%" + searchNotificationDTO.getKeyword().toLowerCase() + "%");
			predicates.add(predicate);
		}

		if (searchNotificationDTO.getUserId() != null) {
			Predicate predicate1 = criteriaBuilder.equal(user.get("id"), searchNotificationDTO.getUserId());
			Predicate predicate2 = criteriaBuilder.isNull(user);

			predicates.add(criteriaBuilder.or(predicate1, predicate2));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(criteriaBuilder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public Long countTotal(SearchNotificationDTO searchNotificationDTO) {
		CriteriaBuilder criteriaBuilder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = criteriaBuilder.createQuery(Long.class);
		Root<Notification> root = criteriaQuery.from(Notification.class);

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(criteriaBuilder.count(root)));
		return typedQuery.getSingleResult();
	}

}
