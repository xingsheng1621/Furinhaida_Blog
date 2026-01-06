import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addTestPosts() {
  try {
    // 添加测试 Post 数据（无需关联 User）
    const posts = await prisma.post.createMany({
      data: [
        {
          slug: 'first-post',
          title: '我的第一篇文章',
          desc: '这是一篇很好的文章',
          img: '/post1.png',
          views: 10,
        },
        {
          slug: 'second-post',
          title: '第二篇文章',
          desc: '这是第二篇文章，讨论更多有趣的话题',
          img: '/post2.png',
          views: 25,
        },
        {
          slug: 'third-post',
          title: '第三篇文章',
          desc: '探讨一些深度话题',
          img: '/post3.png',
          views: 5,
        },
      ],
    })
    console.log('✅ 成功添加了', posts.count, '条 Post 数据')
  } catch (error) {
    console.error('❌ 添加 Post 数据失败:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

addTestPosts()
