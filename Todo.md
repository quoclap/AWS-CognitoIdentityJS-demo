- Đưa các chương trình trong file entry.js vào một hàm trên Lambda nhằm đảm bảo tính đóng của chương trình.
- Tạo layout cho web app gồm tất cả các function cần thiết. có thể tham khảo layout từ các nguồn khác.
- Tạo các hàm Lambda cập nhật vào các database của ngày, tuần, tháng, năm với trigger source có thể là từ phía khách hàng, từ phía công ty, từ DynamoDB Stream.
	+ Các hàm Lambda dùng để trigger các function query dữ liệu database và cập nhật dữ liệu cho các bảng đảm bảo tính đóng.
	+ Trên web app nhận dữ liệu từ các hàm Lambda, thực hiện chức năng chủ yếu là hiển thị sử dụng các thư viện như Chart.js, React Native , ...
- Tạo một cơ chế để Log tất cả các event liên quan đến hệ thống, từ các thông số thụ động của các thiết bị cũng như các actions được tạo ra từ các rule, các command từ user.
- Tạo cơ chế phản hồi từ khách hàng: khách hàng có thể gửi về công ty các yêu cầu tuỳ biến về hệ thống cũng như giao diện, về phía công ty có thể đưa ra trước các example để khách hàng dựa vào đó để có những đề xuất chỉnh sửa, muốn có nhiều ý kiến phản hồi nâng cao chất lượng sản phẩm và dịch vụ thì cũng nên đầu tư thời gian tạo ra nhiều example cho mỗi đối tượng khách hàng.
- Tạo cơ chế lưu cookies của mỗi senssion , User mỗi lần đăng nhâp vô app sẽ được lưu các thông tin tạm thời về username password, token...
- Thêm repo này vào redmine trong EC2 instance trên AWS
- Test chuc nang tu dong cap nhat repo 29/11/2016 9:10