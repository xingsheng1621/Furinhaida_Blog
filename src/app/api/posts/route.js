import prisma from "@/utils/connect";
import { NextResponse } from "next/server";
import { getAuthSession } from "@/utils/auth";

export const GET = async (req) => {

  const { searchParams } = new URL(req.url);

  const page = searchParams.get("page");
  const cat = searchParams.get("cat");


  const POST_PER_PAGE = 4;

  const query = {
      skip: POST_PER_PAGE * (page - 1),
      take: POST_PER_PAGE,
      where:{
        ...(cat && {catSlug: cat }),
      },
      orderBy: {
        createdAt: 'desc'
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

    // 验证必需字段
    if (!body.title || !body.title.trim()) {
      return new NextResponse(
        JSON.stringify({ message: "标题不能为空" }),
        { status: 400 }
      );
    }

    if (!body.slug || !body.slug.trim()) {
      return new NextResponse(
        JSON.stringify({ message: "无法生成有效的slug" }),
        { status: 400 }
      );
    }

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
    console.error("Error creating post:", err);
    
    // 处理Prisma唯一约束错误
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0];
      if (field === 'slug') {
        return new NextResponse(
          JSON.stringify({ message: "此标题已存在，请更改标题" }),
          { status: 400 }
        );
      }
    }

    return new NextResponse(
      JSON.stringify({ message: err.message || "Something went wrong!" }),
      { status: 500 }
    );
  }
};

