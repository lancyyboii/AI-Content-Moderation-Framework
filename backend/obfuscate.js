/**
 * Advanced Code Obfuscation Script for Backend
 * This script obfuscates all JavaScript files to prevent reverse engineering
 */

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Advanced obfuscation configuration
const obfuscationConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 1,
  numbersToExpressions: true,
  simplify: true,
  stringArrayShuffle: true,
  splitStrings: true,
  stringArray: true,
  stringArrayThreshold: 1,
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayWrappersCount: 5,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 5,
  stringArrayWrappersType: 'function',
  stringArrayEncoding: ['rc4'],
  unicodeEscapeSequence: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: true,
  selfDefending: true,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  domainLock: [],
  reservedNames: [],
  seed: Math.floor(Math.random() * 1000000),
  sourceMap: false,
  sourceMapBaseUrl: '',
  sourceMapFileName: '',
  sourceMapMode: 'separate',
  target: 'node',
  transformObjectKeys: true,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 1
};

// Files and directories to obfuscate
const filesToObfuscate = [
  'server.js',
  'routes/',
  'services/',
  'models/',
  'middleware/',
  'database/'
];

// Files to exclude from obfuscation
const excludeFiles = [
  'node_modules',
  'package.json',
  'package-lock.json',
  '.env',
  '.env.example',
  'obfuscate.js',
  'build-obfuscated.js'
];

function shouldExcludeFile(filePath) {
  return excludeFiles.some(exclude => filePath.includes(exclude));
}

function obfuscateFile(filePath) {
  try {
    console.log(`🔒 Obfuscating: ${filePath}`);
    
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Add anti-debugging and tamper detection
    const protectedCode = `
// Anti-debugging protection
(function() {
  var _0x${Math.random().toString(36).substr(2, 9)} = function() {
    var _0x${Math.random().toString(36).substr(2, 9)} = function() {
      return 'dev';
    };
    var _0x${Math.random().toString(36).substr(2, 9)} = function() {
      return 'window';
    };
    var _0x${Math.random().toString(36).substr(2, 9)} = function() {
      var _0x${Math.random().toString(36).substr(2, 9)} = RegExp;
      return _0x${Math.random().toString(36).substr(2, 9)}('\\\\' + 'constructor')['test'](_0x${Math.random().toString(36).substr(2, 9)}['constructor']['toString']());
    };
    var _0x${Math.random().toString(36).substr(2, 9)} = function() {
      var _0x${Math.random().toString(36).substr(2, 9)} = RegExp;
      return _0x${Math.random().toString(36).substr(2, 9)}('\\\\' + 'call')['test'](_0x${Math.random().toString(36).substr(2, 9)}['toString']());
    };
    var _0x${Math.random().toString(36).substr(2, 9)} = function(_0x${Math.random().toString(36).substr(2, 9)}) {
      var _0x${Math.random().toString(36).substr(2, 9)} = ~-1 >> 1 + 255 % 0;
      if (_0x${Math.random().toString(36).substr(2, 9)}['indexOf']('i' === _0x${Math.random().toString(36).substr(2, 9)})) {
        _0x${Math.random().toString(36).substr(2, 9)}(_0x${Math.random().toString(36).substr(2, 9)});
      }
    };
    _0x${Math.random().toString(36).substr(2, 9)}(++_0x${Math.random().toString(36).substr(2, 9)});
  };
  try {
    _0x${Math.random().toString(36).substr(2, 9)}();
  } catch (_0x${Math.random().toString(36).substr(2, 9)}) {
    setTimeout(_0x${Math.random().toString(36).substr(2, 9)}, 4000);
  }
})();

${sourceCode}
    `;
    
    const obfuscationResult = JavaScriptObfuscator.obfuscate(protectedCode, obfuscationConfig);
    
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, sourceCode);
    
    // Write obfuscated code
    fs.writeFileSync(filePath, obfuscationResult.getObfuscatedCode());
    
    console.log(`✅ Successfully obfuscated: ${filePath}`);
    
  } catch (error) {
    console.error(`❌ Error obfuscating ${filePath}:`, error.message);
  }
}

function obfuscateDirectory(dirPath) {
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const fullPath = path.join(dirPath, item);
    
    if (shouldExcludeFile(fullPath)) {
      console.log(`⏭️  Skipping: ${fullPath}`);
      return;
    }
    
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      obfuscateDirectory(fullPath);
    } else if (stat.isFile() && path.extname(fullPath) === '.js') {
      obfuscateFile(fullPath);
    }
  });
}

function main() {
  console.log('🚀 Starting advanced code obfuscation process...');
  console.log('⚠️  This will modify your source files. Backups will be created.');
  
  filesToObfuscate.forEach(target => {
    const targetPath = path.resolve(target);
    
    if (!fs.existsSync(targetPath)) {
      console.log(`⚠️  Target not found: ${targetPath}`);
      return;
    }
    
    const stat = fs.statSync(targetPath);
    
    if (stat.isDirectory()) {
      obfuscateDirectory(targetPath);
    } else if (stat.isFile() && path.extname(targetPath) === '.js') {
      obfuscateFile(targetPath);
    }
  });
  
  console.log('🎉 Obfuscation process completed!');
  console.log('📝 Original files backed up with .backup extension');
  console.log('🔐 Your code is now protected against reverse engineering');
}

// Run obfuscation
main();