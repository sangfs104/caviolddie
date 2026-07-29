import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Email nhận thông tin liên hệ / hỏi đáp từ khách hàng.
const NOTIFY_EMAIL = "tcongc3@gmail.com";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message } = await req.json();

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập họ tên" },
        { status: 400 },
      );
    }

    if (typeof email !== "string" || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Email không hợp lệ" },
        { status: 400 },
      );
    }

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Vui lòng nhập nội dung" },
        { status: 400 },
      );
    }

    // Cấu hình SMTP qua biến môi trường (.env.local) — dùng chung
    // với API newsletter, KHÔNG hard-code mật khẩu trong code.
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
      replyTo: email, // Bấm "Trả lời" trong Gmail sẽ trả lời thẳng cho khách
      subject: `[Liên hệ website] ${name}`,
      text: `Họ tên: ${name}\nEmail: ${email}\nSĐT: ${phone || "Không cung cấp"}\n\nNội dung:\n${message}`,
      html: `
        <p><strong>Họ tên:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>SĐT:</strong> ${phone || "Không cung cấp"}</p>
        <p><strong>Nội dung:</strong></p>
        <p>${message.replace(/\n/g, "<br/>")}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Lỗi gửi email liên hệ:", err);
    return NextResponse.json(
      { error: "Không thể gửi yêu cầu, vui lòng thử lại sau" },
      { status: 500 },
    );
  }
}