const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanupOrphanedAccounts() {
  try {
    console.log('查找孤立的Account记录...');
    
    // 查找所有Account
    const accounts = await prisma.account.findMany({
      include: {
        user: true
      }
    });
    
    console.log(`找到 ${accounts.length} 个Account记录`);
    
    // 删除没有关联用户的Account
    const orphanedAccounts = accounts.filter(acc => !acc.user);
    
    if (orphanedAccounts.length > 0) {
      console.log(`发现 ${orphanedAccounts.length} 个孤立的Account记录，开始删除...`);
      
      for (const acc of orphanedAccounts) {
        console.log(`删除: ${acc.provider} - ${acc.providerAccountId}`);
        await prisma.account.delete({
          where: { id: acc.id }
        });
      }
      
      console.log('✅ 清理完成！');
    } else {
      console.log('✅ 没有发现孤立的Account记录');
    }
    
  } catch (error) {
    console.error('❌ 清理失败:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupOrphanedAccounts();
