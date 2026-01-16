import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  try {
    // 获取浏览量最高的前5篇文章
    const posts = await prisma.post.findMany({
      take: 5,
      orderBy: {
        views: 'desc'
      },
      include: {
        user: true,
      },
    });

    return new NextResponse(JSON.stringify({ posts }), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
