package com.linkin.dao;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Table;
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

import com.linkin.dao.impl.JPARepository;
import com.linkin.entity.User;
import com.linkin.entity.UserGroup;
import com.linkin.entity.UserGroupUser;
import com.linkin.model.SearchUserDTO;
import com.linkin.model.SearchUserGroupUserDTO;

public interface UserGroupUserDao {
	void add(UserGroupUser userGroupUser);

	void update(UserGroupUser userGroupUser);

	void delete(UserGroupUser userGroupUser);
	
	UserGroupUser getById(Long id);
	
	List<UserGroupUser> find(SearchUserGroupUserDTO searchUserGroupUserDTO);

	long count(SearchUserGroupUserDTO searchUserGroupUserDTO);

	long countTotal(SearchUserGroupUserDTO searchUserGroupUserDTO);
}
@Transactional
@Repository
class UserGroupUserDaoImpl extends JPARepository<UserGroupUser> implements UserGroupUserDao {
	
	@Override
	public UserGroupUser getById(Long id) {
		return entityManager.find(UserGroupUser.class, id);
	}

	@Override
	public List<UserGroupUser> find(SearchUserGroupUserDTO searchUserGroupUserDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<UserGroupUser> criteriaQuery = builder.createQuery(UserGroupUser.class);
		Root<UserGroupUser> root = criteriaQuery.from(UserGroupUser.class);

		// Constructing list of parameters
		List<Predicate> predicates = new ArrayList<Predicate>();
		

		if (searchUserGroupUserDTO.getUserGroupId() != null) {
			Join<UserGroupUser, UserGroup> userGroup = root.join("userGroup");
			predicates.add(builder.equal(userGroup.get("id"), searchUserGroupUserDTO.getUserGroupId()));
		}

		criteriaQuery.where(predicates.toArray(new Predicate[] {}));
		// order
		
		TypedQuery<UserGroupUser> typedQuery = entityManager.createQuery(criteriaQuery.select(root).distinct(true));
		if (searchUserGroupUserDTO.getStart() != null) {
			typedQuery.setFirstResult(searchUserGroupUserDTO.getStart());
			typedQuery.setMaxResults(searchUserGroupUserDTO.getLength());
		}
		return typedQuery.getResultList();
	}

	@Override
	public long count(SearchUserGroupUserDTO searchUserGroupUserDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<UserGroupUser> root = criteriaQuery.from(UserGroupUser.class);

		// Constructing list of parameters
		List<Predicate> predicates = new ArrayList<Predicate>();
		

		if (searchUserGroupUserDTO.getUserGroupId() != null) {
			Join<UserGroupUser, UserGroup> userGroup = root.join("userGroup");
			predicates.add(builder.equal(userGroup.get("id"), searchUserGroupUserDTO.getUserGroupId()));
		}

		
		criteriaQuery.where(predicates.toArray(new Predicate[] {}));
		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.count(root)));
		return typedQuery.getSingleResult();
	}

	@Override
	public long countTotal(SearchUserGroupUserDTO searchUserGroupUserDTO) {
		CriteriaBuilder builder = entityManager.getCriteriaBuilder();
		CriteriaQuery<Long> criteriaQuery = builder.createQuery(Long.class);
		Root<UserGroupUser> root = criteriaQuery.from(UserGroupUser.class);

		List<Predicate> predicates = new ArrayList<Predicate>();

		if (searchUserGroupUserDTO.getUserGroupId() != null) {
			Join<UserGroupUser, UserGroup> userGroup = root.join("userGroup");
			predicates.add(builder.equal(userGroup.get("id"), searchUserGroupUserDTO.getUserGroupId()));
		}


		criteriaQuery.where(predicates.toArray(new Predicate[] {}));

		TypedQuery<Long> typedQuery = entityManager.createQuery(criteriaQuery.select(builder.count(root)));
		return typedQuery.getSingleResult();
	}

}