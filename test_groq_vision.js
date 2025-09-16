/**
 * Test script for Groq Vision API integration
 * Tests nude content detection capabilities
 */

// Set environment variables for Groq API
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY environment variable is required');
  process.exit(1);
}
process.env.GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

const AIService = require('./backend/services/aiService');
const axios = require('axios');
const FormData = require('form-data');

async function testGroqVision() {
  console.log('🧪 Testing Groq Vision API Integration');
  console.log('=====================================\n');

  try {
    // Initialize AI service
    const aiService = new AIService();
    
    console.log('1. Testing AI Service Health Check...');
    const healthCheck = await aiService.checkHealth();
    console.log('   Health check result:', healthCheck ? '✅ Healthy' : '❌ Unhealthy');
    
    console.log('\n2. Testing Direct Groq Vision Analysis...');
    
    // Create a test image buffer (small PNG with suspicious content simulation)
    // This is a minimal PNG that we'll analyze
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x37, 0x6E, 0xF9, 0x24, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    try {
      const directResult = await aiService.analyzeImageWithGroq(testImageBuffer);
      console.log('   Direct Groq Vision Result:');
      console.log('   - Decision:', directResult.decision);
      console.log('   - Confidence:', directResult.confidence);
      console.log('   - Categories:', directResult.categories);
      console.log('   - Service:', directResult.service);
      console.log('   - Model:', directResult.model_used);
      console.log('   - Explanation:', directResult.explanation);
    } catch (directError) {
      console.log('   ❌ Direct Groq Vision failed:', directError.message);
    }
    
    console.log('\n3. Testing Full Image Moderation Pipeline...');
    
    const moderationResult = await aiService.moderateImage(testImageBuffer);
    console.log('   Full Pipeline Result:');
    console.log('   - Decision:', moderationResult.decision);
    console.log('   - Confidence:', moderationResult.confidence);
    console.log('   - Categories:', moderationResult.categories);
    console.log('   - Service:', moderationResult.service || moderationResult.model_used);
    console.log('   - Explanation:', moderationResult.explanation);
    
    console.log('\n4. Testing via API Endpoint...');
    
    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test_nude_image.png',
      contentType: 'image/png'
    });
    
    try {
      const apiResponse = await axios.post('http://localhost:3000/api/moderate', formData, {
        headers: {
          ...formData.getHeaders()
        },
        timeout: 30000
      });
      
      console.log('   API Response:');
      console.log('   - Decision:', apiResponse.data.decision);
      console.log('   - Confidence:', apiResponse.data.confidence);
      console.log('   - Categories:', apiResponse.data.categories);
      console.log('   - Explanation:', apiResponse.data.explanation);
      console.log('   - Model Used:', apiResponse.data.model_used);
      
      if (apiResponse.data.service === 'groq_vision') {
        console.log('\n🎉 SUCCESS: Groq Vision API is working!');
      } else {
        console.log('\n⚠️  WARNING: Using fallback service:', apiResponse.data.service || 'unknown');
      }
      
    } catch (apiError) {
      console.log('   ❌ API test failed:', apiError.response?.data || apiError.message);
    }
    
    console.log('\n✅ Groq Vision Integration Test Completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testGroqVision().then(() => {
  console.log('\n🏁 Test execution finished.');
}).catch(error => {
  console.error('💥 Test execution failed:', error);
});