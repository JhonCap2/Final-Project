#!/usr/bin/env node

/**
 * Quick Test Script for OAuth Endpoints
 * Run from AllergySafety-Server directory: node test-oauth.js
 */

const axios = require('axios');

const API_URL = 'http://localhost:3001/api/auth';

// Mock Google JWT Token (in real use, this would be from Google)
const mockGoogleToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEifQ.eyJlbWFpbCI6InRlc3RAZ29vZ2xlLmNvbSIsIm5hbWUiOiJUZXN0IFVzZXIiLCJzdWIiOiIxMjM0NTY3ODkwIiwiaWF0IjoxNjgwNDQwMDAwLCJleHAiOjE2ODA0NDM2MDB9.mock_signature';

// Mock Facebook Token (in real use, this would come from Facebook SDK)
const mockFacebookToken = 'EABCDEFGHIJKLMNOPmock_facebook_access_token';

async function testGoogleLogin() {
  try {
    console.log('\n🔵 Testing Google OAuth Endpoint...');
    console.log('POST /api/auth/google');
    
    const response = await axios.post(`${API_URL}/google`, {
      token: mockGoogleToken
    });
    
    console.log('✅ Success:', response.status);
    console.log('Token received:', response.data.token.substring(0, 30) + '...');
    console.log('User:', response.data.user.email);
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
  }
}

async function testFacebookLogin() {
  try {
    console.log('\n🔵 Testing Facebook OAuth Endpoint...');
    console.log('POST /api/auth/facebook');
    
    const response = await axios.post(`${API_URL}/facebook`, {
      token: mockFacebookToken
    });
    
    console.log('✅ Success:', response.status);
    console.log('Token received:', response.data.token.substring(0, 30) + '...');
    console.log('User:', response.data.user.email);
  } catch (error) {
    console.log('❌ Error:', error.response?.status, error.response?.data?.message || error.message);
  }
}

async function testNormalLogin() {
  try {
    console.log('\n🔵 Testing Normal Email/Password Login...');
    console.log('POST /api/auth/login');
    
    const response = await axios.post(`${API_URL}/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Success:', response.status);
    console.log('Token received:', response.data.token.substring(0, 30) + '...');
  } catch (error) {
    console.log('⚠️ Expected error (no user created):', error.response?.status, error.response?.data?.message);
  }
}

async function runTests() {
  console.log('🚀 OAuth Endpoint Tests');
  console.log('=======================\n');
  
  try {
    await testNormalLogin();
    await testGoogleLogin();
    await testFacebookLogin();
    
    console.log('\n\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error.message);
  }
}

// Run tests
runTests().catch(console.error);
