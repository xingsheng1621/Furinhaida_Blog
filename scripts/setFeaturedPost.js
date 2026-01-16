// 用于设置或取消文章的推荐状态
// 使用方法: node scripts/setFeaturedPost.js <文章slug> <true/false>

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function setFeaturedPost(slug, featured) {
  try {
    const post = await prisma.post.update({
      where: { slug },
      data: { featured: featured === 'true' },
    });
    
    console.log(`✅ 成功${featured === 'true' ? '设置' : '取消'}推荐文章: ${post.title}`);
    console.log(`   Slug: ${post.slug}`);
    console.log(`   推荐状态: ${post.featured}`);
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// 获取命令行参数
const slug = process.argv[2];
const featured = process.argv[3];

if (!slug || !featured) {
  console.log('使用方法: node scripts/setFeaturedPost.js <文章slug> <true/false>');
  console.log('示例: node scripts/setFeaturedPost.js my-article-slug true');
  process.exit(1);
}

setFeaturedPost(slug, featured);
