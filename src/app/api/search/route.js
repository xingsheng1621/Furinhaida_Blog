import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const keyword = searchParams.get("keyword");

  if (!keyword || keyword.trim() === "") {
    return new NextResponse(
      JSON.stringify({ posts: [] }),
      { status: 200 }
    );
  }

  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            title: {
              contains: keyword,
              mode: "insensitive"
            }
          },
          {
            desc: {
              contains: keyword,
              mode: "insensitive"
            }
          }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
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
