const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function deleteUserWithAccounts(userEmail) {
  try {
    console.log(`正在删除用户: ${userEmail}`);
    
    // 先查找用户
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        accounts: true,
        sessions: true,
        posts: true,
        comments: true
      }
    });

    if (!user) {
      console.log('用户不存在');
      return;
    }

    console.log('用户信息:', {
      id: user.id,
      email: user.email,
      accounts: user.accounts.length,
      sessions: user.sessions.length,
      posts: user.posts.length,
      comments: user.comments.length
    });

    // 手动删除所有关联的记录
    console.log('删除关联的 accounts...');
    await prisma.account.deleteMany({
      where: { userId: user.id }
    });

    console.log('删除关联的 sessions...');
    await prisma.session.deleteMany({
      where: { userId: user.id }
    });

    console.log('删除关联的 comments...');
    await prisma.comment.deleteMany({
      where: { userEmail: user.email }
    });

    console.log('更新关联的 posts...');
    await prisma.post.updateMany({
      where: { userEmail: user.email },
      data: { userEmail: null }
    });

    console.log('删除用户...');
    await prisma.user.delete({
      where: { email: userEmail }
    });

    console.log('✅ 用户删除成功！');
  } catch (error) {
    console.error('❌ 删除失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// 使用方法：将下面的邮箱替换为你要删除的用户邮箱
const userEmailToDelete = process.argv[2];

if (!userEmailToDelete) {
  console.log('使用方法: node scripts/deleteUserWithAccounts.js <用户邮箱>');
  process.exit(1);
}

deleteUserWithAccounts(userEmailToDelete);
