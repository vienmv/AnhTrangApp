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

import com.linkin.dao.OrderDao;
import com.linkin.entity.Order;
import com.linkin.entity.User;
import com.linkin.model.SearchOrderDTO;
import com.linkin.utils.DateTimeUtils;

@Transactional
@Repository
public class OrderDaoImpl implements OrderDao {
	@PersistenceContext
	private EntityManager entityManager;

	@Override
	public void add(Order order) {
		entityManager.persist(order);
	}

	@Override
	public void update(Order order) {
		entityManager.merge(order);
	}

	@Override
	public void delete(Long id) {
		entityManager.remove(getById(id));
	}

	@Override
	public Order getById(Long id) {
		return entityManager.find(Order.class, id);
	}

	@Override
	public List<Order> find(SearchOrderDTO searchOrderDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Order> criteriaQuery = builder.createQuery(Order.class);
		Root<Order> root = criteriaQuery.from(Order.class);

		List<Predicate> predicates = new ArrayList<>();

		if (StringUtils.isNotBlank(searchOrderDTO.getKeyword())) {
			Predicate predicate1 = builder.like(builder.lower(root.get("description")),
					"%" + searchOrderDTO.getKeyword().toLowerCase() + "%");
			Predicate predicate2 = builder.like(builder.lower(root.get("note")),
					"%" + searchOrderDTO.getKeyword().toLowerCase() + "%");

			predicates.add(builder.or(predicate1, predicate2));
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getSellerName()) || searchOrderDTO.getSellerId() != null) {
			Join<Order, User> seller = root.join("seller", JoinType.LEFT);

			if (StringUtils.isNotBlank(searchOrderDTO.getSellerName())) {
				Predicate predicate = builder.like(builder.lower(seller.get("name")),
						"%" + searchOrderDTO.getSellerName().toLowerCase() + "%");
				predicates.add(predicate);
			}

			if (searchOrderDTO.getSellerId() != null) {
				Predicate predicate = builder.equal(seller.get("id"), searchOrderDTO.getSellerId());
				predicates.add(predicate);
			}
		}

		if (searchOrderDTO.getHideOrder() != null) {
			predicates.add(builder.equal(root.get("hideOrder"), searchOrderDTO.getHideOrder()));
		}

		if (searchOrderDTO.getCheckSendNoti() != null) {
			predicates.add(builder.equal(root.get("checkSendNoti"), searchOrderDTO.getCheckSendNoti()));
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getCustomerName()) || searchOrderDTO.getCustomerId() != null) {
			Join<Order, User> customer = root.join("customer", JoinType.LEFT);

			if (searchOrderDTO.getCustomerId() != null) {
				Predicate predicate = builder.equal(customer.get("id"), searchOrderDTO.getCustomerId());
				predicates.add(predicate);
			}

			if (StringUtils.isNotBlank(searchOrderDTO.getCustomerName())) {
				Predicate predicate = builder.like(builder.lower(customer.get("name")),
						"%" + searchOrderDTO.getCustomerName().toLowerCase() + "%");
				predicates.add(predicate);
			}
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getShiperName()) || searchOrderDTO.getShipperId() != null) {
			Join<Order, User> shipper = root.join("shipper", JoinType.LEFT);

			if (StringUtils.isNotBlank(searchOrderDTO.getShiperName())) {
				Predicate predicate = builder.like(builder.lower(shipper.get("name")),
						"%" + searchOrderDTO.getShiperName().toLowerCase() + "%");
				predicates.add(predicate);
			}

			if (searchOrderDTO.getShipperId() != null) {
				Predicate predicate1 = builder.equal(shipper.get("id"), searchOrderDTO.getShipperId());
				Predicate predicate2 = builder.equal(root.join("shippers", JoinType.LEFT),
						searchOrderDTO.getShipperId());

				predicates.add(builder.or(predicate1, predicate2));
			}
		}

		if (searchOrderDTO.getStatus() != null) {
			Predicate predicate = builder.equal(root.get("status"), searchOrderDTO.getStatus());
			predicates.add(predicate);
		}

		if (searchOrderDTO.getStatusList() != null) {
			Predicate predicate = root.get("status").in(searchOrderDTO.getStatusList());
			predicates.add(predicate);
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getFromDate())) {
			try {
				Predicate predicate = builder.greaterThanOrEqualTo(root.get("createdDate"), DateTimeUtils.getStartOfDay(
						DateTimeUtils.parseDate(searchOrderDTO.getFromDate(), DateTimeUtils.DD_MM_YYYY)));
				predicates.add(predicate);
			} catch (RuntimeException ignored) {

			}
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getToDate())) {
			try {
				Predicate predicate = builder.lessThanOrEqualTo(root.get("createdDate"), DateTimeUtils
						.getEndOfDay(DateTimeUtils.parseDate(searchOrderDTO.getToDate(), DateTimeUtils.DD_MM_YYYY)));

				predicates.add(predicate);
			} catch (RuntimeException ignored) {

			}
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getCreatedDate())) {
			Predicate predicate = builder.lessThanOrEqualTo(root.get("createdDate"),
					DateTimeUtils.parseDate(searchOrderDTO.getCreatedDate(), DateTimeUtils.DD_MM_YYYY_HH_MM));
			predicates.add(predicate);
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getSearchCity())) {
			Join<Order, User> user = root.join("customer");
			predicates.add(builder.equal(builder.lower(user.get("cityName")),
					searchOrderDTO.getSearchCity().toLowerCase()));
			
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		if (StringUtils.equals(searchOrderDTO.getSortBy().getData(), "id")) {
			if (searchOrderDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(builder.asc(root.get("id")));
			} else {
				criteriaQuery.orderBy(builder.desc(root.get("id")));
			}
		} else if (StringUtils.equals(searchOrderDTO.getSortBy().getData(), "createdDate")) {
			if (searchOrderDTO.getSortBy().isAsc()) {
				criteriaQuery.orderBy(builder.asc(root.get("createdDate")));
			} else {
				criteriaQuery.orderBy(builder.desc(root.get("createdDate")));
			}
		}

		TypedQuery<Order> typedQuery = entityManager.createQuery(criteriaQuery.select(root).distinct(true));
		if (searchOrderDTO.getStart() != null) {
			typedQuery.setFirstResult((searchOrderDTO.getStart()));
			typedQuery.setMaxResults(searchOrderDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public Long count(SearchOrderDTO searchOrderDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<Order> root = criteriaQuery.from(Order.class);

		List<Predicate> predicates = new ArrayList<>();

		if (StringUtils.isNotBlank(searchOrderDTO.getKeyword())) {
			Predicate predicate1 = builder.like(builder.lower(root.get("description")),
					"%" + searchOrderDTO.getKeyword().toLowerCase() + "%");
			Predicate predicate2 = builder.like(builder.lower(root.get("note")),
					"%" + searchOrderDTO.getKeyword().toLowerCase() + "%");
			predicates.add(builder.or(predicate1, predicate2));
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getSellerName()) || searchOrderDTO.getSellerId() != null) {
			Join<Order, User> seller = root.join("seller", JoinType.LEFT);

			if (StringUtils.isNotBlank(searchOrderDTO.getSellerName())) {
				Predicate predicate = builder.like(builder.lower(seller.get("name")),
						"%" + searchOrderDTO.getSellerName().toLowerCase() + "%");
				predicates.add(predicate);
			}

			if (searchOrderDTO.getSellerId() != null) {
				Predicate predicate = builder.equal(seller.get("id"), searchOrderDTO.getSellerId());
				predicates.add(predicate);
			}
		}

		if (searchOrderDTO.getHideOrder() != null) {
			predicates.add(builder.equal(root.get("hideOrder"), searchOrderDTO.getHideOrder()));
		}

		if (searchOrderDTO.getCheckSendNoti() != null) {
			predicates.add(builder.equal(root.get("checkSendNoti"), searchOrderDTO.getCheckSendNoti()));
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getCustomerName()) || searchOrderDTO.getCustomerId() != null) {
			Join<Order, User> customer = root.join("customer", JoinType.LEFT);

			if (searchOrderDTO.getCustomerId() != null) {
				Predicate predicate = builder.equal(customer.get("id"), searchOrderDTO.getCustomerId());
				predicates.add(predicate);
			}

			if (StringUtils.isNotBlank(searchOrderDTO.getCustomerName())) {
				Predicate predicate = builder.like(builder.lower(customer.get("name")),
						"%" + searchOrderDTO.getCustomerName().toLowerCase() + "%");
				predicates.add(predicate);
			}
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getShiperName()) || searchOrderDTO.getShipperId() != null) {
			Join<Order, User> shipper = root.join("shipper", JoinType.LEFT);

			if (StringUtils.isNotBlank(searchOrderDTO.getShiperName())) {
				Predicate predicate = builder.like(builder.lower(shipper.get("name")),
						"%" + searchOrderDTO.getShiperName().toLowerCase() + "%");
				predicates.add(predicate);
			}

			if (searchOrderDTO.getShipperId() != null) {
				Predicate predicate1 = builder.equal(shipper.get("id"), searchOrderDTO.getShipperId());
				Predicate predicate2 = builder.equal(root.join("shippers", JoinType.LEFT),
						searchOrderDTO.getShipperId());

				predicates.add(builder.or(predicate1, predicate2));
			}
		}

		if (searchOrderDTO.getStatus() != null) {
			Predicate predicate = builder.equal(root.get("status"), searchOrderDTO.getStatus());
			predicates.add(predicate);
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getFromDate())) {
			try {
				Predicate predicate = builder.greaterThanOrEqualTo(root.get("createdDate"), DateTimeUtils.getStartOfDay(
						DateTimeUtils.parseDate(searchOrderDTO.getFromDate(), DateTimeUtils.DD_MM_YYYY)));
				predicates.add(predicate);
			} catch (RuntimeException ignored) {

			}
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getToDate())) {
			try {
				Predicate predicate = builder.lessThanOrEqualTo(root.get("createdDate"), DateTimeUtils
						.getEndOfDay(DateTimeUtils.parseDate(searchOrderDTO.getToDate(), DateTimeUtils.DD_MM_YYYY)));

				predicates.add(predicate);
			} catch (RuntimeException ignored) {

			}
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getCreatedDate())) {
			Predicate predicate = builder.lessThanOrEqualTo(root.get("createdDate"),
					DateTimeUtils.parseDate(searchOrderDTO.getCreatedDate(), DateTimeUtils.DD_MM_YYYY));
			predicates.add(predicate);
		}

		if (StringUtils.isNotBlank(searchOrderDTO.getSearchCity())) {
			Join<Order, User> user = root.join("customer");
			predicates.add(builder.equal(builder.lower(user.get("cityName")),
					searchOrderDTO.getSearchCity().toLowerCase()));

		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));
		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.countDistinct(root)));
		return typedQuery.getSingleResult();

	}

	@Override
	public Long counntTotal(SearchOrderDTO searchOrderDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<Order> root = criteriaQuery.from(Order.class);

		List<Predicate> predicates = new ArrayList<>();

		if (searchOrderDTO.getSellerId() != null) {
			Join<Order, User> seller = root.join("seller", JoinType.LEFT);
			Predicate predicate = builder.equal(seller.get("id"), searchOrderDTO.getSellerId());
			predicates.add(predicate);
		}

		if (searchOrderDTO.getShipperId() != null) {
			Join<Order, User> shipper = root.join("shipper", JoinType.LEFT);

			Predicate predicate1 = builder.equal(shipper.get("id"), searchOrderDTO.getShipperId());
			Predicate predicate2 = builder.equal(root.join("shippers", JoinType.LEFT), searchOrderDTO.getShipperId());

			predicates.add(builder.or(predicate1, predicate2));
		}

		if (searchOrderDTO.getCustomerId() != null) {
			Join<Order, User> customer = root.join("customer", JoinType.LEFT);

			Predicate predicate = builder.equal(customer.get("id"), searchOrderDTO.getCustomerId());
			predicates.add(predicate);
		}

		if (searchOrderDTO.getHideOrder() != null) {
			predicates.add(builder.equal(root.get("hideOrder"), searchOrderDTO.getHideOrder()));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.countDistinct(root)));
		return typedQuery.getSingleResult();
	}

}
