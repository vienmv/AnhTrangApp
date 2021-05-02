package com.linkin.api.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linkin.model.OrderDTO;
import com.linkin.model.ResponseDTO;
import com.linkin.model.SearchOrderDTO;
import com.linkin.model.UserPrincipal;
import com.linkin.service.OrderService;
import com.linkin.utils.RoleEnum;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*", maxAge = -1)
public class OrderAPIController {

	@Autowired
	private OrderService orderService;

	@PostMapping(value = "/member/order/add")
	public OrderDTO addOrder(@RequestBody OrderDTO orderDTO) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		
		if (currentUser.getRoles().contains("ROLE_" + RoleEnum.ADMIN.name())) {
			orderService.add(orderDTO);
		} else {
			orderDTO.setHideOrder(false);//mac dinh
			orderService.add(orderDTO);
		}
		
		return orderDTO;
	}

	@PostMapping(value = "/member/order/list")
	public ResponseDTO<OrderDTO> memberOrderList(@RequestBody SearchOrderDTO searchOrderDTO) {
		ResponseDTO<OrderDTO> responseDTO = new ResponseDTO<OrderDTO>();
		responseDTO.setData(orderService.find(searchOrderDTO));
		responseDTO.setRecordsFiltered(orderService.count(searchOrderDTO));
		responseDTO.setRecordsTotal(orderService.countTotal(searchOrderDTO));
		return responseDTO;
	}
	
	@GetMapping(value = "/member/order/{id}")
	public OrderDTO get(@PathVariable(name = "id") Long id) {
		return orderService.getById(id);
	}

	@DeleteMapping(value = "/admin/order/delete/{id}")
	public void delete(@PathVariable(name = "id") Long id) {
		orderService.delete(id);
	}

	@DeleteMapping(value = "/admin/order/delete-multi/{ids}")
	public void delete(@PathVariable(name = "ids") List<Long> ids) {
		for (Long id : ids) {
			try {
				orderService.delete(id);
			} catch (Exception e) {
			}
		}
	}

	@PutMapping("/admin/order/update")
	public void updateOrder(@RequestBody OrderDTO orderDTO) {
		orderService.update(orderDTO);
	}
	
	@PutMapping("/seller/order/assign-shipper")
	public void assignShipper(@RequestBody OrderDTO orderDTO) {
		orderService.assignShipper(orderDTO);
	}

	@PutMapping("/shipper/order/update/shipper")
	public void updateOrderShipper(@RequestBody OrderDTO orderDTO) {
		orderService.updateOfTheShipper(orderDTO);
	}

	@PutMapping(value = "/member/order/update")
	public void updateMemberOrder(@RequestBody OrderDTO orderDTO) {
		
		orderService.updateOfMember(orderDTO);
	}

	@PutMapping("/shipper/order/assignment/{id}")
	public void assign(@PathVariable(name = "id") Long id) {
		UserPrincipal currentUser = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication()
				.getPrincipal();
		orderService.acceptShipper(id, currentUser.getId());
	}

	@PutMapping("/admin/order/update-cost")
	public void updateCostOrder(@RequestBody OrderDTO orderDTO) {
		orderService.updateCost(orderDTO);
	}
	
	@PutMapping("/member/order/update-review")
	public void updateorderInfo(@RequestBody OrderDTO orderDTO) {
		orderService.updateReviewAndCounter(orderDTO);
	}
	
}
