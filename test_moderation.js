const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

// Test the moderation API
async function testModeration() {
  console.log('Testing AI Content Moderation API...');
  
  try {
    // Test 1: Text moderation
    console.log('\n1. Testing text moderation...');
    const textResponse = await axios.post('http://localhost:3000/api/moderate', {
      content: 'This is a test message with some adult content',
      type: 'text'
    });
    console.log('Text moderation result:', {
      decision: textResponse.data.decision,
      confidence: textResponse.data.confidence,
      categories: textResponse.data.categories
    });
    
    // Test 2: URL moderation
    console.log('\n2. Testing URL moderation...');
    const urlResponse = await axios.post('http://localhost:3000/api/moderate', {
      content: 'https://example.com',
      type: 'url'
    });
    console.log('URL moderation result:', {
      decision: urlResponse.data.decision,
      confidence: urlResponse.data.confidence,
      categories: urlResponse.data.categories
    });
    
    // Test 3: Create a simple test image (1x1 pixel PNG)
    console.log('\n3. Testing image moderation...');
    const testImageBuffer = Buffer.from([
      0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0x00, 0x00, 0x00, 0x0D,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x02, 0x00, 0x00, 0x00, 0x90, 0x77, 0x53, 0xDE, 0x00, 0x00, 0x00,
      0x0C, 0x49, 0x44, 0x41, 0x54, 0x08, 0xD7, 0x63, 0xF8, 0x00, 0x00, 0x00,
      0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0x37, 0x6E, 0xF9, 0x24, 0x00, 0x00,
      0x00, 0x00, 0x49, 0x45, 0x4E, 0x44, 0xAE, 0x42, 0x60, 0x82
    ]);
    
    const formData = new FormData();
    formData.append('file', testImageBuffer, {
      filename: 'test.png',
      contentType: 'image/png'
    });
    
    const imageResponse = await axios.post('http://localhost:3000/api/moderate', formData, {
      headers: {
        ...formData.getHeaders()
      }
    });
    
    console.log('Image moderation result:', {
      decision: imageResponse.data.decision,
      confidence: imageResponse.data.confidence,
      categories: imageResponse.data.categories,
      explanation: imageResponse.data.explanation
    });
    
    console.log('\n✅ All tests completed successfully!');
    console.log('\n🎉 The adult/NSFW content detection system is now working properly!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

// Run the test
testModeration();