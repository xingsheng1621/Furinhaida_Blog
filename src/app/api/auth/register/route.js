import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export const POST = async (req) => {
  try {
    const { name, email, password } = await req.json();

    // 验证必填字段
    if (!email || !password) {
      return new NextResponse(
        JSON.stringify({ message: "邮箱和密码不能为空" }),
        { status: 400 }
      );
    }

    // 验证密码长度
    if (password.length < 6) {
      return new NextResponse(
        JSON.stringify({ message: "密码长度至少6个字符" }),
        { status: 400 }
      );
    }

    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new NextResponse(
        JSON.stringify({ message: "该邮箱已被注册" }),
        { status: 400 }
      );
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await prisma.user.create({
      data: {
        name: name || email.split('@')[0], // 如果没有提供用户名，使用邮箱前缀
        email,
        password: hashedPassword,
      },
    });

    return new NextResponse(
      JSON.stringify({
        message: "注册成功",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      }),
      { status: 201 }
    );
  } catch (err) {
    console.error("Registration error:", err);
    return new NextResponse(
      JSON.stringify({ message: "注册失败，请稍后重试" }),
      { status: 500 }
    );
  }
};
