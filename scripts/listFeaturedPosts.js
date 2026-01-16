// 列出所有推荐文章
// 使用方法: node scripts/listFeaturedPosts.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listFeaturedPosts() {
  try {
    const posts = await prisma.post.findMany({
      where: { featured: true },
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
    
    if (posts.length === 0) {
      console.log('📝 当前没有推荐文章');
    } else {
      console.log(`📌 推荐文章列表 (共 ${posts.length} 篇):\n`);
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Slug: ${post.slug}`);
        console.log(`   作者: ${post.user?.name || '未知'}`);
        console.log(`   创建时间: ${post.createdAt.toLocaleDateString('zh-CN')}`);
        console.log(`   浏览量: ${post.views}`);
        console.log('');
      });
    }
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

listFeaturedPosts();
