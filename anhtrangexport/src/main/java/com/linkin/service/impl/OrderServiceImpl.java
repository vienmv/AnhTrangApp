package com.linkin.service.impl;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.linkin.dao.NotificationDao;
import com.linkin.dao.OrderDao;
import com.linkin.dao.UserDao;
import com.linkin.entity.Notification;
import com.linkin.entity.Order;
import com.linkin.entity.User;
import com.linkin.model.NotificationDTO;
import com.linkin.model.OrderDTO;
import com.linkin.model.SearchNotificationDTO;
import com.linkin.model.SearchOrderDTO;
import com.linkin.model.SearchUserDTO;
import com.linkin.service.NotificationService;
import com.linkin.service.OrderService;
import com.linkin.utils.DateTimeUtils;
import com.linkin.utils.NotificationEnum;
import com.linkin.utils.RoleEnum;
import com.linkin.utils.SMSMessage;

@Transactional
@Service
public class OrderServiceImpl implements OrderService {

	@Autowired
	private OrderDao orderDao;

	@Autowired
	private UserDao userDao;

	@Autowired
	private NotificationService notificationService;

	@Autowired
	private NotificationDao notificationDao;

	@Override
	public void add(OrderDTO orderDTO) {
		Order order = new Order();
		order.setWeight(orderDTO.getWeight());
		order.setUnit(orderDTO.getUnit());
		order.setDescription(orderDTO.getDescription());
		order.setStatus(1); // moi tao-chua xet duyet
		order.setHideOrder(orderDTO.getHideOrder());
		order.setCost(orderDTO.getCost());
		order.setCheckSendNoti(false);

		User customer = userDao.getById(orderDTO.getCustomerId());
		order.setCustomer(customer);

		if (customer.getCreatedBy() != null) {
			order.setSeller(customer.getCreatedBy());
		}

		orderDao.add(order);
		orderDTO.setId(order.getId());

		// send noti to each user in order
		if (order.getCustomer() != null) {
			sendNotification(order.getCustomer(), order);
		}

		if (order.getSeller() != null) {
			if (!order.getHideOrder()) {
				sendNotification(order.getSeller(), order);
			}
		}

		/// SEND NOTI TO AMDIN
		SearchUserDTO searchUserDTO = new SearchUserDTO();
		searchUserDTO.setStart(null);
		searchUserDTO.setRoleList(Arrays.asList("ROLE_" + RoleEnum.ADMIN.name()));

		List<User> users = userDao.find(searchUserDTO);

		for (User user : users) {
			// send notification
			this.sendNotification(user, order);
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public void update(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());

		if (order != null) {
			order.setWeight(orderDTO.getWeight());
			order.setUnit(orderDTO.getUnit());
			order.setDescription(orderDTO.getDescription());
			order.setNote(orderDTO.getNote());
			order.setPrice(orderDTO.getPrice());
			order.setRealWeight(orderDTO.getRealWeight());
			order.setHideOrder(orderDTO.getHideOrder());
			order.setCost(orderDTO.getCost());

			if (order.getCustomer() == null || (order.getCustomer().getId().longValue() != orderDTO.getCustomerId())) {
				User customer = userDao.getById(orderDTO.getCustomerId());
				order.setCustomer(customer);

				if (customer.getCreatedBy() != null) {
					order.setSeller(customer.getCreatedBy());
				}

				if (order.getCustomer() != null) {
					sendNotification(order.getCustomer(), order);
				}

				if (order.getSeller() != null) {
					if (!order.getHideOrder()) {
						sendNotification(order.getSeller(), order);
					}
				}
			}

			if (order.getStatus() != 1 && orderDTO.getStatus() == 1) {
				order.setShippers(new HashSet(orderDTO.getShippers()));
				order.setShipper(null);
			} else {
				if (order.getShipper() == null) {
					order.setShippers(new HashSet(orderDTO.getShippers()));
					for (Long id : orderDTO.getShippers()) {
						User shipper = userDao.getById(id);
						// send notification
						sendNotification(shipper, order);
					}
				}
			}
			order.setStatus(orderDTO.getStatus());

			orderDao.update(order);

			if (order.getStatus() == 3 || order.getStatus() == 4) {
				/// delete old
				try {
					SearchNotificationDTO searchNotificationDTO = new SearchNotificationDTO();
					searchNotificationDTO.setStart(null);
					searchNotificationDTO.setKeyword(order.getId().toString());
					List<Notification> notifications = notificationDao.find(searchNotificationDTO);
					for (Notification notification : notifications) {
						notificationDao.delete(notification.getId());
					}
				} catch (Exception e) {
				}

				// add new
				if (order.getCustomer() != null) {
					sendNotification(order.getCustomer(), order);
				}

				if (order.getSeller() != null && !order.getHideOrder()) {
					sendNotification(order.getSeller(), order);
				}

				/// SEND NOTI TO AMDIN
				SearchUserDTO searchUserDTO = new SearchUserDTO();
				searchUserDTO.setStart(null);
				searchUserDTO.setRoleList(Arrays.asList("ROLE_" + RoleEnum.ADMIN.name()));

				List<User> users = userDao.find(searchUserDTO);

				for (User user : users) {
					// send notification
					this.sendNotification(user, order);
				}
			}
		}

	}

	@Override
	public void assignShipper(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());

		if (order != null) {
			if (order.getStatus() != 1 && orderDTO.getStatus() == 1) {
				order.setShippers(new HashSet(orderDTO.getShippers()));
				order.setShipper(null);
			} else {
				if (order.getShipper() == null) {
					order.setShippers(new HashSet(orderDTO.getShippers()));
					for (Long id : orderDTO.getShippers()) {
						User shipper = userDao.getById(id);
						// send notification
						sendNotification(shipper, order);
					}
				}
			}
			order.setStatus(orderDTO.getStatus());

			orderDao.update(order);
		}

	}

	@Override
	public void updateOfTheShipper(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());
		if (order != null) {
			order.setPrice(orderDTO.getPrice());
			order.setRealWeight(orderDTO.getRealWeight());
			order.setNote(orderDTO.getNote());
			order.setStatus(orderDTO.getStatus());
			orderDao.update(order);

			/// delete old
			try {
				SearchNotificationDTO searchNotificationDTO = new SearchNotificationDTO();
				searchNotificationDTO.setStart(null);
				searchNotificationDTO.setKeyword(order.getId().toString());
				List<Notification> notifications = notificationDao.find(searchNotificationDTO);
				for (Notification notification : notifications) {
					notificationDao.delete(notification.getId());
				}
			} catch (Exception e) {
			}

			// add new
			if (order.getCustomer() != null) {
				sendNotification(order.getCustomer(), order);
			}

			if (order.getSeller() != null && !order.getHideOrder()) {
				sendNotification(order.getSeller(), order);
			}

//			if (order.getShipper() != null) {
//				sendNotification(order.getShipper(), order);
//			}

			/// SEND NOTI TO AMDIN
			SearchUserDTO searchUserDTO = new SearchUserDTO();
			searchUserDTO.setStart(null);
			searchUserDTO.setRoleList(Arrays.asList("ROLE_" + RoleEnum.ADMIN.name()));

			List<User> users = userDao.find(searchUserDTO);

			for (User user : users) {
				// send notification
				this.sendNotification(user, order);
			}

		}
	}

	@Override
	public void updateOfMember(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());

		// trang thai moi & nguoi tao = customer id
		if (order != null && order.getStatus() == 1
				&& order.getCustomer().getId() == orderDTO.getCustomerId().longValue()) {
			order.setWeight(orderDTO.getWeight());
			order.setUnit(orderDTO.getUnit());
			order.setDescription(orderDTO.getDescription());
			orderDao.update(order);
		}
	}

	@Override
	public void delete(Long id) {
		Order order = orderDao.getById(id);
		if (order != null) {
			orderDao.delete(id);
		}
	}

	@Override
	public OrderDTO getById(Long id) {
		Order order = orderDao.getById(id);
		if (order != null) {
			return convert(order);
		}
		return null;
	}

	@Override
	public List<OrderDTO> find(SearchOrderDTO searchOrderDTO) {
		List<Order> orders = orderDao.find(searchOrderDTO);
		List<OrderDTO> orderDTOs = new ArrayList<OrderDTO>();
		orders.forEach(order -> {
			orderDTOs.add(convert(order));
		});
		return orderDTOs;
	}

	@Override
	public Long count(SearchOrderDTO searchOrderDTO) {
		return orderDao.count(searchOrderDTO);
	}

	@Override
	public Long countTotal(SearchOrderDTO searchOrderDTO) {
		return orderDao.counntTotal(searchOrderDTO);
	}

	private OrderDTO convert(Order order) {
		OrderDTO orderDTO = new OrderDTO();
		orderDTO.setId(order.getId());
		orderDTO.setNote(order.getNote());
		orderDTO.setUnit(order.getUnit());
		orderDTO.setRealWeight(order.getRealWeight());
		orderDTO.setWeight(order.getWeight());
		orderDTO.setStatus(order.getStatus());
		orderDTO.setDescription(order.getDescription());
		orderDTO.setHideOrder(order.getHideOrder());
		orderDTO.setCheckSendNoti(order.getCheckSendNoti());
		orderDTO.setCost(order.getCost());

		orderDTO.setReview(order.getReview());
		orderDTO.setStarRating(order.getStarRating());

		if (order.getCreatedBy() != null) {
			orderDTO.setCreatedBy(order.getCreatedBy().getName());
		}
		orderDTO.setPrice(order.getPrice());
		if (order.getSeller() != null) {
			orderDTO.setSellerId(order.getSeller().getId());
			orderDTO.setSellerName(order.getSeller().getName());
		}
		if (order.getShipper() != null) {
			orderDTO.setShipperId(order.getShipper().getId());
			orderDTO.setShipperName(order.getShipper().getName());
		}
		if (order.getCustomer() != null) {
			orderDTO.setCustomerName(order.getCustomer().getName());
			orderDTO.setCustomerId(order.getCustomer().getId());
			orderDTO.setPhoneCustomer(order.getCustomer().getPhone());
			orderDTO.setCityName(order.getCustomer().getCityName());
			orderDTO.setDistrictName(order.getCustomer().getDistrictName());
			orderDTO.setWardsName(order.getCustomer().getWardsName());
			orderDTO.setAddress(order.getCustomer().getAddress());
		}

		if (order.getUpdatedDate() != null) {
			orderDTO.setUpdatedDate(DateTimeUtils.formatDate(order.getUpdatedDate(), DateTimeUtils.DD_MM_YYYY_HH_MM));
		}

		if (order.getCreatedDate() != null) {
			orderDTO.setCreatedDate(DateTimeUtils.formatDate(order.getCreatedDate(), DateTimeUtils.DD_MM_YYYY_HH_MM));
		}

		if (order.getShippers() != null) {
			orderDTO.setShippers(new ArrayList<>(order.getShippers()));
		}

		if (order.getCost() != null) {
			orderDTO.setCost(order.getCost());
		}
		orderDTO.setShippers(new ArrayList<>(order.getShippers()));

		return orderDTO;
	}

	@Override
	public void acceptShipper(Long id, Long shipperId) {
		Order order = orderDao.getById(id);
		if (order != null && order.getShipper() == null) {
			order.setShipper(new User(shipperId));
			order.setStatus(2);
			order.getShippers().clear();
			orderDao.update(order);

			/// SEND NOTI TO AMDIN
			SearchUserDTO searchUserDTO = new SearchUserDTO();
			searchUserDTO.setStart(null);
			searchUserDTO.setRoleList(Arrays.asList("ROLE_" + RoleEnum.ADMIN.name()));

			List<User> users = userDao.find(searchUserDTO);

			for (User user : users) {
				// send notification
				this.sendNotification(user, order);
			}
			try {
				SearchNotificationDTO searchNotificationDTO = new SearchNotificationDTO();
				searchNotificationDTO.setStart(null);
				searchNotificationDTO.setKeyword(SMSMessage.NEW_ORDER.replaceAll("\\{id\\}", order.getId() + ""));
				List<Notification> notifications = notificationDao.find(searchNotificationDTO);
				for (Notification notification : notifications) {
					if (notification.getUser().getRoles().contains("ROLE_" + RoleEnum.ADMIN.name())
							|| (notification.getUser().getRoles().contains("ROLE_" + RoleEnum.SHIPPER.name())
									&& notification.getUser().getId() != shipperId.longValue())) {
						notificationDao.delete(notification.getId());
					}
				}
			} catch (Exception e) {
				System.out.println(e);
			}
		} else {
			throw new DataIntegrityViolationException("Not/Available");
		}
	}

	private void sendNotification(User user, Order order) {
		// send notification
		NotificationDTO notificationDTO = new NotificationDTO();
		notificationDTO.setTitle(SMSMessage.title);
		notificationDTO.setToUserId(user.getId());
		notificationDTO.setType(NotificationEnum.ORDER.name());
		notificationDTO.setItem(String.valueOf(order.getId()));

		if (order.getStatus() == 1) {
			notificationDTO.setContent(SMSMessage.NEW_ORDER.replaceAll("\\{id\\}", order.getId() + ""));
		} else if (order.getStatus() == 2) {
			notificationDTO.setContent(SMSMessage.SHIP_ORDER.replaceAll("\\{id\\}", order.getId() + ""));
		} else if (order.getStatus() == 3) {
			notificationDTO.setContent(SMSMessage.DONE_ORDER.replaceAll("\\{id\\}", order.getId() + ""));
		} else if (order.getStatus() == 4) {
			notificationDTO.setContent(SMSMessage.CANCEL_ORDER.replaceAll("\\{id\\}", order.getId() + ""));
		}
		try {
			notificationService.addNotification(notificationDTO);
		} catch (Exception e) {

		}
	}

	@Override
	public void updateCheckSendNoti(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());
		if (order != null) {
			order.setCheckSendNoti(orderDTO.getCheckSendNoti());
			orderDao.update(order);
		}
	}

	@Override
	public void updateCost(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());
		if (order != null) {
			order.setCost(orderDTO.getCost());
			orderDao.update(order);
		}
	}

	@Override
	public void updateReviewAndCounter(OrderDTO orderDTO) {
		Order order = orderDao.getById(orderDTO.getId());
		if (order != null) {
			order.setReview(orderDTO.getReview());
			order.setStarRating(orderDTO.getStarRating());
			orderDao.update(order);
		}
	}

}
