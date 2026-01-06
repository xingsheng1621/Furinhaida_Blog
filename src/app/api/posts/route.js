import prisma from "@/utils/connect";
import { NextResponse } from "next/server";

export const GET = async (req) => {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || 1;
  const POST_PER_PAGE = 2;

  try {
    const posts = await prisma.post.findMany({
      take: POST_PER_PAGE,
      skip: (page - 1) * POST_PER_PAGE,
    });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};
