const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

(async () => {
  try {
    const accounts = await prisma.account.findMany({
      include: { user: true }
    });
    
    console.log('Account总数:', accounts.length);
    console.log('\n详细信息:');
    accounts.forEach(a => {
      console.log('---');
      console.log('ID:', a.id);
      console.log('Provider:', a.provider);
      console.log('UserId:', a.userId);
      console.log('HasUser:', !!a.user);
    });
    
  } catch (error) {
    console.error('错误:', error.message);
  } finally {
    await prisma.$disconnect();
  }
})();
