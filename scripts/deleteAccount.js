const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const result = await prisma.account.deleteMany({
      where: {
        provider: 'google',
        providerAccountId: '111703332346913709701'
      }
    });
    console.log('✅ 删除了', result.count, '条Account记录');
  } catch (error) {
    console.error('❌ 错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
