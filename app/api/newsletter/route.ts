import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email nhận thông báo đăng ký nhận tin.
const NOTIFY_EMAIL = "tcongc3@gmail.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 },
      );
    }

    // Cấu hình SMTP qua biến môi trường (.env.local), KHÔNG hard-code
    // mật khẩu trong code. Ví dụ dùng Gmail SMTP với "App password":
    //   SMTP_HOST=smtp.gmail.com
    //   SMTP_PORT=465
    //   SMTP_USER=your-sending-address@gmail.com
    //   SMTP_PASS=app-password-16-ky-tu
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: NOTIFY_EMAIL,
      subject: "Đăng ký nhận tin mới — CAVIOLDDIE",
      text: `Có người vừa đăng ký nhận tin với email: ${email}`,
      html: `<p>Có người vừa đăng ký nhận tin với email: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lỗi gửi email đăng ký nhận tin:", err);
    return NextResponse.json(
      { error: "Không thể gửi yêu cầu, vui lòng thử lại sau" },
      { status: 500 },
    );
  }
}