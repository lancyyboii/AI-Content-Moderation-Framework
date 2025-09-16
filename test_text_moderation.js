/**
 * Test script for text moderation with Groq API
 * Tests the "you are fat" text that's failing
 */

// Set Groq API key from environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY environment variable is required');
  process.exit(1);
}
process.env.GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

const AIService = require('./backend/services/aiService');
const axios = require('axios');

async function testTextModeration() {
  console.log('🧪 Testing Text Moderation with Groq API');
  console.log('========================================\n');

  try {
    // Initialize AI service
    const aiService = new AIService();
    
    console.log('1. Testing AI Service Health Check...');
    const healthCheck = await aiService.checkHealth();
    console.log('   Health check result:', healthCheck ? '✅ Healthy' : '❌ Unhealthy');
    
    console.log('\n2. Testing Direct Text Moderation...');
    
    const testText = "you are fat";
    
    try {
      const directResult = await aiService.moderateText(testText);
      console.log('   Direct Text Moderation Result:');
      console.log('   - Decision:', directResult.decision);
      console.log('   - Confidence:', directResult.confidence);
      console.log('   - Categories:', directResult.categories);
      console.log('   - Explanation:', directResult.explanation);
      console.log('   - Model Used:', directResult.model_used);
    } catch (directError) {
      console.log('   ❌ Direct text moderation failed:', directError.message);
    }
    
    console.log('\n3. Testing via API Endpoint...');
    
    try {
      const apiResponse = await axios.post('http://localhost:3000/api/moderate', {
        content: testText,
        type: 'text'
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });
      
      console.log('   API Response:');
      console.log('   - Decision:', apiResponse.data.decision);
      console.log('   - Confidence:', apiResponse.data.confidence);
      console.log('   - Categories:', apiResponse.data.categories);
      console.log('   - Explanation:', apiResponse.data.explanation);
      console.log('   - Model Used:', apiResponse.data.model_used);
      
      if (apiResponse.data.decision !== 'safe') {
        console.log('\n🎉 SUCCESS: Text moderation is working!');
      } else {
        console.log('\n⚠️  WARNING: Text was marked as safe, may need adjustment');
      }
      
    } catch (apiError) {
      console.log('   ❌ API test failed:', apiError.response?.data || apiError.message);
    }
    
    console.log('\n✅ Text Moderation Test Completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testTextModeration().then(() => {
  console.log('\n🏁 Test execution finished.');
}).catch(error => {
  console.error('💥 Test execution failed:', error);
});