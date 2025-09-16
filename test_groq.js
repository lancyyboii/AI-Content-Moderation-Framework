/**
 * Test script for Groq API integration
 * This script tests the AI moderation functionality using Groq API
 */

// Set Groq API key from environment variables
if (!process.env.GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY environment variable is required');
  process.exit(1);
}
process.env.GROQ_MODEL = process.env.GROQ_MODEL || 'llama3-8b-8192';

const AIService = require('./backend/services/aiService');
const PromptTemplates = require('./backend/services/promptTemplates');

async function testGroqIntegration() {
  console.log('🚀 Testing Groq API Integration...');
  console.log('=' .repeat(50));
  
  try {
    // Initialize AI Service (should automatically detect Groq API key)
    const aiService = new AIService();
    
    // Test 1: Health Check
    console.log('\n📋 Test 1: Health Check');
    const isHealthy = await aiService.checkHealth();
    console.log(`Health Status: ${isHealthy ? '✅ Healthy' : '❌ Unhealthy'}`);
    
    if (!isHealthy) {
      console.log('❌ Groq API is not available. Please check your API key.');
      return;
    }
    
    // Test 2: Model Availability
    console.log('\n📋 Test 2: Model Availability');
    const modelAvailable = await aiService.ensureModel();
    console.log(`Model Status: ${modelAvailable ? '✅ Available' : '❌ Unavailable'}`);
    console.log(`Using Model: ${aiService.model}`);
    console.log(`Service Type: ${aiService.useGroq ? 'Groq API' : 'Ollama'}`);
    
    // Test 3: Text Moderation
    console.log('\n📋 Test 3: Text Moderation');
    const testTexts = [
      'Hello, this is a normal message.',
      'I hate everyone and everything!',
      'Check out this amazing product at https://example.com'
    ];
    
    for (let i = 0; i < testTexts.length; i++) {
      const text = testTexts[i];
      console.log(`\n  Testing text ${i + 1}: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`);
      
      try {
        const result = await aiService.moderateText(text, {
          sensitivity_level: 'medium',
          categories: ['hate_speech', 'spam', 'harassment']
        });
        
        console.log(`  ✅ Result: ${result.decision || 'unknown'} (Confidence: ${result.confidence || 'N/A'})`);
        if (result.categories && result.categories.length > 0) {
          console.log(`  📝 Categories: ${result.categories.join(', ')}`);
        }
        if (result.explanation) {
          console.log(`  💭 Explanation: ${result.explanation.substring(0, 100)}${result.explanation.length > 100 ? '...' : ''}`);
        }
      } catch (error) {
        console.log(`  ❌ Error: ${error.message}`);
      }
    }
    
    // Test 4: URL Moderation
    console.log('\n📋 Test 4: URL Moderation');
    const testUrl = 'https://example.com/suspicious-content';
    console.log(`  Testing URL: ${testUrl}`);
    
    try {
      const result = await aiService.moderateUrl(testUrl, {
        sensitivity_level: 'high'
      });
      
      console.log(`  ✅ Result: ${result.decision || 'unknown'} (Confidence: ${result.confidence || 'N/A'})`);
      if (result.categories && result.categories.length > 0) {
        console.log(`  📝 Categories: ${result.categories.join(', ')}`);
      }
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    
    console.log('\n🎉 Groq integration test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
if (require.main === module) {
  testGroqIntegration().then(() => {
    console.log('\n✨ Test execution finished.');
    process.exit(0);
  }).catch((error) => {
    console.error('\n💥 Test execution failed:', error.message);
    process.exit(1);
  });
}

module.exports = { testGroqIntegration };