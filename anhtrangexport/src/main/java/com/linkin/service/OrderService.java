package com.linkin.service;

import java.util.List;

import com.linkin.model.OrderDTO;
import com.linkin.model.SearchOrderDTO;

public interface OrderService {
	
	void add(OrderDTO orderDTO);

	void update(OrderDTO orderDTO);
	
	void assignShipper(OrderDTO orderDTO);

	void updateOfTheShipper(OrderDTO orderDTO);
	
	void acceptShipper(Long id , Long shipperId);
	
	void updateOfMember(OrderDTO orderDTO);

	void delete(Long id);

	OrderDTO getById(Long id);

	List<OrderDTO> find(SearchOrderDTO searchOrderDTO);
	
	Long count (SearchOrderDTO searchOrderDTO);
	
	Long countTotal(SearchOrderDTO searchOrderDTO);
	
	void updateCheckSendNoti(OrderDTO orderDTO);
	
	void updateCost(OrderDTO orderDTO);
	
	void updateReviewAndCounter(OrderDTO orderDTO);
	
}
