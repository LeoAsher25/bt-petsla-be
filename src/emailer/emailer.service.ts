import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { CreateOrderDto } from 'src/order/dto/create-order.dto';

@Injectable()
export class EmailerService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      // Cấu hình transporter, ví dụ: SMTP hoặc service như Gmail
      // Chi tiết cấu hình xem trong tài liệu nodemailer
      service: 'Gmail', // Tên dịch vụ email, ví dụ: Gmail
      auth: {
        user: process.env.PETSLA_EMAIL, // Địa chỉ email của bạn
        pass: process.env.PETSLA_EMAIL_PASSWORD, // Mật khẩu email của bạn, mật khẩu app nếu sử dụng Gmail
      },
      // Cấu hình thêm (tuỳ chọn):
      // secureConnection: true, // Sử dụng kết nối bảo mật SSL/TLS
      // port: 465, // Port sử dụng cho kết nối SMTP
    });
  }

  async sendRegistrationEmail(
    email: string,
    firstName: string,
    lastName: string,
  ): Promise<void> {
    const mailOptions: nodemailer.SendMailOptions = {
      to: email, // Địa chỉ email đích
      subject: 'PetsLa: Đăng ký tài khoản thành công', // Chủ đề email
      html: `
      <h4>Xin chào ${lastName} ${firstName}</h4>
      <p>Bạn nhận được mail này khi đã đăng ký thành công tài khoản tại PetsLa. Chúng tôi xin cảm ơn bạn đã lựa chọn PetsLa. Chúc bạn sẽ lựa chọn được những sản phẩm ưng ý</p>
      <p>Trân trọng,</p>
      <p>PetsLa Shop</p>
      `, // Nội dung email dạng HTML
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendOrderSuccessEmail(
    email: string,
    totalCost: number,
    createOrderDto: CreateOrderDto,
  ): Promise<void> {
    const trList = createOrderDto.orderItems.map(
      (item, index) =>
        `
        <tr>
          <td style="padding: 4px 8px; text-align: center"> ${index} </td>
          <td style="padding: 4px 8px"> ${item.name} </td>
          <td style="padding: 4px 8px"> ${item.price}đ </td>
          <td style="padding: 4px 8px"> ${item.quantity} </td>
          <td style="padding: 4px 8px"> ${item.quantity * item.price}đ </td>
        </tr>
        `,
    );

    const mailOptions: nodemailer.SendMailOptions = {
      to: email, // Địa chỉ email đích
      subject: 'PetsLa: Đặt hàng thành công', // Chủ đề email
      html: `
      <h4>Xin chào ${createOrderDto.fullName}</h4>
      <p>Chúng tôi xin cảm ơn bạn đã lựa chọn mua sản phẩm tại PetsLa. Dưới đây là danh sách chi tiết:</p>
      <table border="1" style="border-spacing: 0">
        <thead>
          <tr>
            <th style="padding: 4px 8px">STT</th>
            <th style="padding: 4px 8px; text-align: left">Tên</th>
            <th style="padding: 4px 8px">Đơn giá</th>
            <th style="padding: 4px 8px">Số lượng</th>
            <th style="padding: 4px 8px">Thành tiền</th>
          </tr>
        </thead>

        <tbody>
          ${trList.join('')}
        </tbody>
      </table>

      <p> Tổng tiền: ${totalCost}đ </p>

      <p> Chúng tôi sẽ sớm đóng gói sản phẩm và chuyển đến bạn sớm nhất có thể. </p>

      <p>Trân trọng,</p>
      <p>PetsLa Shop</p>
      `, // Nội dung email dạng HTML
    };

    await this.transporter.sendMail(mailOptions);
  }
}
