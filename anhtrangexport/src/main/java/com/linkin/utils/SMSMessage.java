package com.linkin.utils;

public interface SMSMessage {
	public static final String title = "Thông báo";
	public static final String NEW_ORDER = "Có đơn hàng mới mã {id}";
	public static final String SHIP_ORDER = "Đơn hàng {id} đang chờ ship";
	public static final String DONE_ORDER = "Đơn hàng {id} đã hoàn thành";
	public static final String CANCEL_ORDER = "Đơn hàng {id} đã hủy";
	public static final String NEW_PASSWORD = "ANHTRANG mật khẩu mới của bạn là {password}";
	public static final String CHANGE_ROLE = "Vai trò của bạn vừa được thay đổi. Bạn vui lòng đăng nhập lại bằng mật khẩu mới. Mật khẩu mới của bạn {password}";
	public static final String NHA_CUNG_CAP_REMINDER = "Quý Nhà cung cấp đã được bộ phận vận chuyển liên hệ lấy hàng chưa? Nếu chưa được liên hệ vui lòng gọi đến hotline 0943949083 để được hỗ trợ tốt nhất";
}
