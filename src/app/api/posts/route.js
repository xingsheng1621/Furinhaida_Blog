import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {

  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page") || 1;

  const POST_PER_PAGE = 2;

  const query = {
      skip: POST_PER_PAGE * (page - 1),
      take: POST_PER_PAGE,
  }

  try {
    const [posts,count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count()
    ]);

    return new NextResponse(JSON.stringify({posts, count}), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
