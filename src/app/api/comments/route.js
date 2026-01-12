import { getAuthSession } from "@/utils/auth";
import prisma from "@/utils/connect";
import { NextResponse } from "next/server";


// GET ALL COMMENTS OF A POST
export const GET = async (req) => {

  const { searchParams } = new URL(req.url);

  let postSlug = searchParams.get("postSlug");
  
  // 解码 postSlug（处理中文等特殊字符）
  if (postSlug) {
    try {
      postSlug = decodeURIComponent(postSlug);
    } catch (e) {
      console.warn('Failed to decode postSlug:', e);
    }
  }

  console.log('Getting comments for postSlug:', postSlug);

  try {
    const comments = await prisma.comment.findMany({
      where:{
        ...(postSlug && { postSlug })
      },
      include:{ user: true }
    })
    return new NextResponse(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    console.log('GET comments error:', err);
    return new NextResponse(
      JSON.stringify({ message: "Something went wrong!" }),
      { status: 500 }
    );
  }
};

// CREATE A COMMENT FOR A POST
export const POST = async (req) => {

  const session = await getAuthSession();
  if (!session){
    return new NextResponse(
      JSON.stringify({ message: "Not Authenticated" }),
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    
    // 解码 postSlug，确保存储的是中文形式
    let postSlug = body.postSlug;
    if (postSlug) {
      try {
        postSlug = decodeURIComponent(postSlug);
      } catch (e) {
        console.warn('Failed to decode postSlug:', e);
      }
    }
    
    const commentData = { ...body, postSlug, userEmail: session.user.email };
    // console.log('Creating comment with:', commentData);
    const comment = await prisma.comment.create({
      data: commentData,
      include: { user: true }
    });
    // console.log('Comment created successfully:', comment);
    return new NextResponse(JSON.stringify(comment), { status: 200 });
  } catch (err) {
    // console.log('POST comment error:', err);
    return new NextResponse(
      JSON.stringify({ message: err.message || "Something went wrong!" }),
      { status: 500 }
    );
  }
};
