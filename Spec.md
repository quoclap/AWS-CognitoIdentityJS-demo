- Đã thực hiện được phần query dữ liệu trong 1 giờ: vì thời gian gửi dữ liệu lên là mỗi 5phút một lần nên trong giờ cuối cùng chỉ cần query những mẫu mới nhất với giới hạn số mẫu là 12 là được.
- Tiếp theo cần thực hiện chức năng hiển thị dữ liệu cho các khoảng thời gian là :
  + 1 last hour: đã xong
  + Last 24h: thực hiện lấy trung bình của các giá trị trong mỗi giờ. sau đó lưu vào một table khác, các lệnh lấy dữ liệu trong 24 h qua được thực hiện trên database này.
  + Last week: tương tự như last 24h
  + Khách hàng có thể chọn khoảng thời gian cụ thể. Trong trường hợp này ta có thể để cho khách hàng lựa chọn database vì mỗi DB có khoảng thời gian giữa các item là khác nhau, database raw thì mới có đủ nhất dữ liệu thô từ gateway gửi lên. còn các database khác thì chỉ là các dữ liệu trung bình mà thôi.
  md
  
