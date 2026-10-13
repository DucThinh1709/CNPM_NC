# Storix — Web demo quản lý sản phẩm, kho và bãi

Bản demo độc lập, không cần database, không cần npm. Giao diện tiếng Việt, co giãn cho điện thoại. Nguồn yêu cầu: project CN trên https://trantran14082006.atlassian.net/browse/CN-1, đọc ngày 13/10/2026. File tasks-jira.json chứa 219 mục epic/story (không bao gồm subtask); các task chỉ có tiêu đề, không có mô tả chi tiết được trả về. Demo diễn giải nghiệp vụ từ tiêu đề, không đại diện cho toàn bộ backlog đã hoàn thành.

## Chạy ngay trên Windows

Giải nén toàn bộ thư mục. Mở dist/index.html bằng Chrome hoặc Edge. Chọn vai trò Quản lý để thao tác đầy đủ. Không có tài khoản/mật khẩu thật. Nếu trình duyệt không cho lưu dữ liệu khi mở file, dùng Docker hoặc máy chủ HTTP local.

## Đưa lên VPS Linux bằng Docker

Điều kiện: VPS đã có Docker Engine và Docker Compose, cổng 8080 được phép truy cập trong firewall của VPS và nhà cung cấp.

1. Chép cả thư mục storix-demo lên VPS (ví dụ /opt/storix-demo).
2. SSH vào VPS và chạy:

```bash
cd /opt/storix-demo
docker compose up -d --build
docker compose ps
```

3. Truy cập http://IP_VPS:8080 (thay IP_VPS bằng IP máy chủ).
4. Kiểm tra health: http://IP_VPS:8080/health trả về ok.

Dừng: `docker compose down`. Cập nhật: thay source rồi chạy lại `docker compose up -d --build`.

Nếu muốn cổng 80, đổi `8080:80` thành `80:80` khi cổng 80 chưa được dịch vụ khác dùng. Nếu có tên miền/HTTPS, đặt Nginx hoặc Caddy của VPS làm reverse proxy tới 127.0.0.1:8080 và cấu hình chứng chỉ theo tên miền thực. Chưa tự triển khai vì chưa có thông tin VPS.

Không dùng Docker: đưa các file trong dist vào document root của Nginx/Apache. Đây là web tĩnh; không cần runtime Node trên VPS. Docker chỉ phục vụ file tĩnh, không lưu dữ liệu nghiệp vụ.

## Kịch bản thuyết trình 5 phút

1. Vào vai trò Quản lý, xem Dashboard và tồn kho ban đầu.
2. Thêm sản phẩm, chỉnh giá/danh mục/đơn vị và tồn tối thiểu.
3. Tạo phiếu Nhập hàng cho sản phẩm, chọn kho, số lượng 10. Duyệt rồi Hoàn thành. Kiểm tra tồn tăng 10.
4. Tạo phiếu Xuất hàng vượt tồn, duyệt và thử hoàn thành: hệ thống báo không đủ tồn, không thay đổi dữ liệu.
5. Tạo điều chuyển từ Kho trung tâm sang Cửa hàng Quận 1, duyệt rồi hoàn thành: nguồn giảm và đích tăng cùng số lượng.
6. Tạo Kiểm kê: nhập số thực tế; duyệt và hoàn thành sẽ điều chỉnh tồn về số đã đếm.
7. Tạo đơn Bán hàng, chọn giảm giá và phương thức thanh toán mô phỏng. Hoàn thành giảm tồn và cộng doanh thu báo cáo.
8. Xem Cảnh báo, Nhật ký; xuất CSV hoặc In/Lưu PDF ở trang Báo cáo.
9. Đăng xuất, vào vai trò Chỉ xem để xem giao diện hạn chế thao tác.

## Phạm vi đã làm

- Dashboard đếm sản phẩm/tồn/phiếu chờ/cảnh báo, biểu đồ từ tồn hiện tại: CN-34–41.
- Thêm/sửa/tra cứu/ngừng kinh doanh sản phẩm, giá và ngưỡng tồn: CN-45–49, CN-52.
- Tạo kho/bãi/cửa hàng; hiển thị sức chứa theo đơn vị quy ước: CN-54–57, CN-65.
- Thêm/tra cứu nhà cung cấp và khách hàng: CN-66, CN-68, CN-174, CN-176.
- Phiếu nhập/xuất/điều chuyển/trả NCC, duyệt/hủy/hoàn thành và biến động tồn: tập con CN-79–131.
- Tồn theo sản phẩm/nơi lưu trữ, kiểm kê thực tế và điều chỉnh tồn: tập con CN-139–165.
- Đơn bán một sản phẩm, tính tiền/giảm giá và giảm tồn: tập con CN-178–188.
- Cảnh báo tồn thấp/sức chứa, báo cáo tồn và tổng chứng từ, nhật ký: tập con CN-196–228.

## Giới hạn cần biết

- Dữ liệu ở localStorage của từng trình duyệt. Tải lại trang vẫn giữ dữ liệu nếu trình duyệt cho phép. Xóa dữ liệu trang sẽ đưa về dữ liệu mẫu. Đổi trình duyệt, thiết bị, cổng hoặc tên miền sẽ dùng bộ dữ liệu riêng. Không có đồng bộ giữa các thành viên; tránh thao tác đồng thời trên nhiều tab.
- Vai trò/đăng nhập chỉ mô phỏng phía client, không phải bảo mật. Không dùng dữ liệu thật hoặc coi đây là hệ thống production.
- Chứng từ chỉ có 1 dòng hàng. Chờ duyệt và đã duyệt chưa giữ hàng; tồn kiểm tra lại lúc hoàn thành. Hoàn thành cập nhật tức thời, chưa có giai đoạn vận chuyển một phần.
- Chưa có database/API, tài khoản nhân viên thật, phân quyền theo kho, quên mật khẩu, lô/hạn dùng, FIFO/FEFO, hàng hỏng, barcode/QR, vị trí kệ/ô, quy đổi đơn vị, yêu cầu bổ sung, trả hàng khách, ngân hàng/VietQR hoặc upload Excel.
- Thanh toán chỉ ghi nhận lựa chọn mô phỏng, không chuyển tiền. Trả NCC chỉ giảm tồn, chưa có đối soát nhà cung cấp.
- Sức chứa tính theo số lượng đơn vị quy ước; chưa quy đổi thể tích/khối lượng giữa sản phẩm.
- Xuất CSV mở được trong Excel, không phải file XLSX. PDF qua chức năng In của trình duyệt.
- Không tự đổi trạng thái ticket Jira. Chưa triển khai trên VPS, chưa chạy Docker tại môi trường thực.

## Khi database hoàn thành

`dist/core.js` chứa quy tắc cập nhật tồn; `dist/app.js` chứa giao diện và lưu localStorage. Thay việc đọc/ghi localStorage bằng lớp gọi API. Backend cần xác thực/phân quyền thật, transaction cập nhật tồn, chống hoàn thành lặp và kiểm soát cạnh tranh trước khi nhiều người dùng. Không tin số tiền/quyền/tồn gửi từ trình duyệt.

## Kiểm tra

`node test.cjs` kiểm tra nghiệp vụ nhập, xuất, điều chuyển, kiểm kê về 0, bán hàng, chặn số không hợp lệ/vượt tồn/vượt sức chứa và hoàn thành lặp. Cú pháp JS đã kiểm tra bằng node --check. Chưa kiểm thử trực quan trong trình duyệt tại môi trường tạo file.

## Bản sửa đăng nhập v2

Sửa xung đột biến role với thuộc tính role của nút HTML trong inline handler. Đăng nhập/đăng xuất dùng hàm riêng; kiểm tra vai trò hợp lệ và xử lý khi sessionStorage bị chặn. Đã chạy test-login.cjs mô phỏng phạm vi inline handler cho ba vai trò, quyền thao tác và đăng xuất. Chưa kiểm thử trực quan trên trình duyệt.

Cập nhật Docker: thay các file bản mới, chạy `docker compose up -d --build`, rồi Ctrl+F5 ở http://localhost:8080. Nếu mở trực tiếp, mở dist/index.html trong thư mục mới giải nén. Không cần xóa dữ liệu sản phẩm.
