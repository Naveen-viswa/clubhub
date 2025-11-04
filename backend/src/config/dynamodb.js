const AWS = require('aws-sdk');
const dotenv = require('dotenv');

dotenv.config();

// Configure AWS SDK
AWS.config.update({
  region: process.env.AWS_REGION || 'ap-south-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Create DynamoDB client
const dynamoDB = new AWS.DynamoDB.DocumentClient();

// Table names from environment
const tables = {
  users: process.env.DYNAMODB_USERS_TABLE || 'ClubHub-Users',
  clubs: process.env.DYNAMODB_CLUBS_TABLE || 'ClubHub-Clubs',
  events: process.env.DYNAMODB_EVENTS_TABLE || 'ClubHub-Events',
  registrations: process.env.DYNAMODB_REGISTRATIONS_TABLE || 'ClubHub-EventRegistrations'
};

// Helper functions for DynamoDB operations
const dbHelpers = {
  // Get item by key
  async getItem(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key
    };
    try {
      const result = await dynamoDB.get(params).promise();
      return result.Item;
    } catch (error) {
      console.error('DynamoDB getItem error:', error);
      throw error;
    }
  },

  // Put (create or update) item
  async putItem(tableName, item) {
    const params = {
      TableName: tableName,
      Item: item
    };
    try {
      await dynamoDB.put(params).promise();
      return item;
    } catch (error) {
      console.error('DynamoDB putItem error:', error);
      throw error;
    }
  },

  // Delete item
  async deleteItem(tableName, key) {
    const params = {
      TableName: tableName,
      Key: key
    };
    try {
      await dynamoDB.delete(params).promise();
      return true;
    } catch (error) {
      console.error('DynamoDB deleteItem error:', error);
      throw error;
    }
  },

  // Scan (get all items - use carefully!)
  async scanTable(tableName, limit = 100) {
    const params = {
      TableName: tableName,
      Limit: limit
    };
    try {
      const result = await dynamoDB.scan(params).promise();
      return result.Items;
    } catch (error) {
      console.error('DynamoDB scan error:', error);
      throw error;
    }
  },

  // Query with conditions
  async queryItems(tableName, keyConditionExpression, expressionAttributeValues) {
    const params = {
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues
    };
    try {
      const result = await dynamoDB.query(params).promise();
      return result.Items;
    } catch (error) {
      console.error('DynamoDB query error:', error);
      throw error;
    }
  }
};

module.exports = {
  dynamoDB,
  tables,
  dbHelpers
};
