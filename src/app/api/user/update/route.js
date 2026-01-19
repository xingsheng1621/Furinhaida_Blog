import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utils/auth";

export const PUT = async (req) => {
  const session = await getAuthSession();
  
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    const { image, name } = body;

    // 构建更新数据对象
    const updateData = {};
    if (image !== undefined) {
      updateData.image = image;
    }
    if (name !== undefined) {
      updateData.name = name;
    }

    // 验证至少有一个字段需要更新
    if (Object.keys(updateData).length === 0) {
      return new NextResponse(
        JSON.stringify({ message: "没有需要更新的数据" }),
        { status: 400 }
      );
    }

    // 更新用户信息
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: updateData,
    });

    return new NextResponse(
      JSON.stringify({ 
        message: "更新成功",
        user: {
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
        }
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Update user error:", err);
    
    // 处理用户不存在的情况
    if (err.code === 'P2025') {
      return new NextResponse(
        JSON.stringify({ message: "用户不存在" }),
        { status: 404 }
      );
    }

    return new NextResponse(
      JSON.stringify({ message: err.message || "更新失败" }),
      { status: 500 }
    );
  }
};
