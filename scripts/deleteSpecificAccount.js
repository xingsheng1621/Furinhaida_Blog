const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const accountId = '6953a0889758e153278f7d94';
    
    console.log('尝试删除Account ID:', accountId);
    
    // 直接删除，不管是否有关联用户
    const result = await prisma.$runCommandRaw({
      delete: 'Account',
      deletes: [{
        q: { _id: accountId },
        limit: 1
      }]
    });
    
    console.log('✅ 删除成功！结果:', result);
    
  } catch (error) {
    console.error('❌ 删除失败:', error.message);
    
    // 尝试另一种方法
    try {
      console.log('\n尝试使用deleteMany...');
      const result2 = await prisma.account.deleteMany({
        where: { id: accountId }
      });
      console.log('✅ deleteMany成功！删除了', result2.count, '条记录');
    } catch (err2) {
      console.error('❌ deleteMany也失败:', err2.message);
    }
  } finally {
    await prisma.$disconnect();
  }
})();
