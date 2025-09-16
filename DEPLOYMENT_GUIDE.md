# AI Content Moderation Framework - Deployment Guide

## 🔒 Security Notice
This repository contains **PROTECTED CODE** that has been obfuscated and encrypted to prevent unauthorized cloning and reverse engineering.

## 📋 Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database
- GROQ API access

## 🚀 Deployment Instructions

### 1. Environment Setup
Before deploying, you need to decrypt and configure the environment files:

#### Backend Environment (.env)
Replace the encrypted placeholders in `backend/.env` with your actual values:
```
MONGO_URL=[YOUR_MONGODB_CONNECTION_STRING]
DB_NAME=[YOUR_DATABASE_NAME]
CORS_ORIGIN=[YOUR_FRONTEND_URL]
GROQ_API_KEY=[YOUR_GROQ_API_KEY]
GROQ_MODEL=[YOUR_GROQ_MODEL_NAME]
```

#### Frontend Environment (.env)
Replace the encrypted placeholders in `frontend/.env` with your actual values:
```
PORT=[YOUR_PORT_NUMBER]
REACT_APP_API_URL=[YOUR_BACKEND_API_URL]
WDS_SOCKET_PORT=[YOUR_WEBSOCKET_PORT]
```

### 2. Installation & Build

#### Backend
```bash
cd backend
npm install
npm start
```

#### Frontend
```bash
cd frontend
npm install
npm run build:win  # For Windows
npm run build      # For Linux/Mac
npm run serve      # To serve the built application
```

### 3. Protection Features
This codebase includes:
- ✅ **Code Obfuscation**: All JavaScript files are obfuscated
- ✅ **Anti-Debugging**: Protection against reverse engineering
- ✅ **Environment Encryption**: Sensitive data is encrypted
- ✅ **Anti-Cloning Protection**: Domain and system validation
- ✅ **Code Integrity Checks**: Tamper detection

### 4. Build Scripts
Use the automated build script for complete protection:
```bash
node build-protected.js
```

### 5. Security Considerations
- Never commit the original `.env` files
- Keep backup files (`.backup` extension) secure
- Regularly update obfuscation keys
- Monitor for unauthorized access attempts

## 🛡️ Anti-Clone Protection
The system includes advanced protection measures:
- Domain validation
- System fingerprinting
- License validation
- Network monitoring
- Code integrity verification

## 📞 Support
For deployment issues or security concerns, contact the development team.

---
**⚠️ WARNING**: This code is protected by advanced obfuscation and anti-cloning measures. Unauthorized copying, distribution, or reverse engineering is prohibited.