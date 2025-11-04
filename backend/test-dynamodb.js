const { dynamoDB, tables, dbHelpers } = require('./src/config/dynamodb');

async function testDynamoDB() {
  console.log('Testing DynamoDB connection...');
  console.log('Table names:', tables);

  try {
    // Test: Create a test user
    console.log('\n1. Creating test user...');
    const testUser = {
      userId: 'test-user-' + Date.now(),
      email: 'test@example.com',
      fullName: 'Test User',
      createdAt: new Date().toISOString()
    };
    
    await dbHelpers.putItem(tables.users, testUser);
    console.log('✅ User created:', testUser);

    // Test: Retrieve the user
    console.log('\n2. Retrieving user...');
    const retrievedUser = await dbHelpers.getItem(tables.users, { userId: testUser.userId });
    console.log('✅ User retrieved:', retrievedUser);

    // Test: Delete the user
    console.log('\n3. Deleting test user...');
    await dbHelpers.deleteItem(tables.users, { userId: testUser.userId });
    console.log('✅ User deleted');

    console.log('\n✅ All DynamoDB tests passed!');
  } catch (error) {
    console.error('❌ DynamoDB test failed:', error);
  }
}

testDynamoDB();
