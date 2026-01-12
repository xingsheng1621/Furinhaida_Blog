const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    // MongoDB的ObjectId格式
    const result = await prisma.$runCommandRaw({
      delete: 'Account',
      deletes: [{
        q: { _id: { $oid: '6953a0889758e153278f7d94' } },
        limit: 0
      }]
    });
    
    console.log('✅ 删除结果:', result);
    
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
