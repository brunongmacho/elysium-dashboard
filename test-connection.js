/**
 * Simple MongoDB Connection Test
 * Run with: node test-connection.js
 */

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://elysium-bot:UMzH6WBKkE9Lrz6F@elysium-bot-cluster.ejvfuyc.mongodb.net/elysium-bot?retryWrites=true&w=majority";

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...');
  console.log('URI:', uri.replace(/:[^:@]+@/, ':***@')); // Hide password

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ Connected to MongoDB!');

    const db = client.db('elysium-bot');
    const collections = await db.listCollections().toArray();
    console.log('📊 Collections found:', collections.map(c => c.name).join(', '));

    const membersCount = await db.collection('members').countDocuments();
    console.log('👥 Members count:', membersCount);

    await client.close();
    console.log('✅ Test complete!');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Full error:', error);
  }
}

testConnection();
