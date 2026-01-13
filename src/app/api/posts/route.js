import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utils/auth";

export const GET = async (req) => {

  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");
  const cat = searchParams.get("cat");


  const POST_PER_PAGE = 2;

  const query = {
      skip: POST_PER_PAGE * (page - 1),
      take: POST_PER_PAGE,
      where:{
        ...(cat && {catSlug: cat }),
      }
  }

  try {
    const [posts,count] = await prisma.$transaction([
      prisma.post.findMany(query),
      prisma.post.count({where:query.where})
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


// CREATE A POST
export const POST = async (req) => {
  const session = await getAuthSession();
  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    let slug = body.slug;
    if (slug) {
      try {
        slug = decodeURIComponent(slug);
      } catch (e) {
        console.warn("Failed to decode slug:", e);
      }
    }

    const postData = { ...body, slug, userEmail: session.user.email };

    const post = await prisma.post.create({
      data: postData,
      include: { user: true },
    });

    return new NextResponse(JSON.stringify(post), { status: 200 });
  } catch (err) {
    return new NextResponse(
      JSON.stringify({ message: err.message || "Something went wrong!" }),
      { status: 500 }
    );
  }
};

