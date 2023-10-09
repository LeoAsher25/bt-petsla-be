import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailerService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      // Cấu hình transporter, ví dụ: SMTP hoặc service như Gmail
      // Chi tiết cấu hình xem trong tài liệu nodemailer
      service: 'Gmail', // Tên dịch vụ email, ví dụ: Gmail
      auth: {
        user: process.env.SOUND_PAY_EMAIL, // Địa chỉ email của bạn
        pass: process.env.SOUND_PAY_EMAIL_PASSWORD, // Mật khẩu email của bạn, mật khẩu app nếu sử dụng Gmail
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
    verificationToken: string,
  ): Promise<void> {
    const linkVerify = `${process.env.PETSLA_URL}/verify-email?token=${verificationToken}`;
    const mailOptions: nodemailer.SendMailOptions = {
      to: email, // Địa chỉ email đích
      subject: 'PetsLa: Please confirm your email address', // Chủ đề email
      html: `
      <h4>Dear ${firstName + ' ' + lastName}</h4>
      <p>This is your final step to complete setting up your PetsLa account. Click this link below to verify your email and enjoy moments with PetsLa:</p>
      <a href="${linkVerify}">Confirm your email here</a>
      <p>Verification link only validates in 30 minutes.</p>
      <p>Best regards,</p>
      <p>PetsLa team</p>
      `, // Nội dung email dạng HTML
    };
    await this.transporter.sendMail(mailOptions);
  }

  async sendPasswordResetEmail(
    email: string,
    firstName: string,
    lastName: string,
    resetPasswordToken: string,
  ) {
    const linkResetPassword = `${process.env.PETSLA_URL}/reset-password?token=${resetPasswordToken}`;
    const mailOptions: nodemailer.SendMailOptions = {
      to: email, // Địa chỉ email đích
      subject: 'Password change request', // Chủ đề email
      html: `
      <h4>Dear ${firstName + ' ' + lastName}</h4>
      <p>We’ve received your password change request. Click the below link to set up your new password:</p>
      <a href="${linkResetPassword}">Confirm your email here</a>
      <p>Verification link only validates in 30 minutes.</p>
      <p>Best regards,</p>
      <p>PetsLa team</p>
      `, // Nội dung email dạng HTML
    };
    await this.transporter.sendMail(mailOptions);
  }
}
