package com.linkin.dao.impl;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public abstract class JPARepository<T>  {
	
	@PersistenceContext
	protected EntityManager entityManager;

	public void add(T t) {
		entityManager.persist(t);
	}

	public void update(T t) {
		entityManager.merge(t);
	}

	public void delete(T t) {
		entityManager.remove(t);
	}
}