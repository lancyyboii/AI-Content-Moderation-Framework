/**
 * Advanced Frontend Code Obfuscation Script
 * This script obfuscates React components and services to prevent reverse engineering
 */

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Advanced obfuscation configuration for React
const obfuscationConfig = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  numbersToExpressions: true,
  simplify: true,
  stringArrayShuffle: true,
  splitStrings: true,
  stringArray: true,
  stringArrayThreshold: 0.75,
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayWrappersCount: 3,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 3,
  stringArrayWrappersType: 'function',
  stringArrayEncoding: ['base64', 'rc4'],
  unicodeEscapeSequence: true,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false, // Keep false for React compatibility
  selfDefending: true,
  debugProtection: true,
  debugProtectionInterval: 4000,
  disableConsoleOutput: true,
  domainLock: [],
  reservedNames: [
    'React',
    'ReactDOM',
    'useState',
    'useEffect',
    'useContext',
    'useReducer',
    'useCallback',
    'useMemo',
    'useRef',
    'useImperativeHandle',
    'useLayoutEffect',
    'useDebugValue',
    'Component',
    'PureComponent',
    'createElement',
    'Fragment',
    'StrictMode',
    'Suspense',
    'lazy',
    'memo',
    'forwardRef',
    'createContext',
    'createRef',
    'isValidElement',
    'cloneElement',
    'Children',
    'render',
    'hydrate',
    'unmountComponentAtNode',
    'findDOMNode',
    'createPortal'
  ],
  seed: Math.floor(Math.random() * 1000000),
  sourceMap: false,
  target: 'browser',
  transformObjectKeys: true,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4
};

// Directories to obfuscate
const directoriesToObfuscate = [
  'src/components',
  'src/services',
  'src/hooks',
  'src/contexts',
  'src/lib'
];

// Files to exclude from obfuscation
const excludeFiles = [
  'node_modules',
  'package.json',
  'package-lock.json',
  'yarn.lock',
  '.env',
  '.env.example',
  'obfuscate-frontend.js',
  'build',
  'public',
  'index.js', // Keep main entry point readable for debugging
  'App.js',   // Keep main App component readable
  'reportWebVitals.js',
  'setupTests.js'
];

// File extensions to obfuscate
const targetExtensions = ['.js', '.jsx', '.ts', '.tsx'];

function shouldExcludeFile(filePath) {
  return excludeFiles.some(exclude => filePath.includes(exclude));
}

function isTargetFile(filePath) {
  return targetExtensions.includes(path.extname(filePath));
}

function addAntiDebuggingProtection() {
  return `
// Advanced Anti-Debugging Protection for React
(function() {
  'use strict';
  
  // Detect DevTools
  var devtools = {
    open: false,
    orientation: null
  };
  
  var threshold = 160;
  
  setInterval(function() {
    if (window.outerHeight - window.innerHeight > threshold || 
        window.outerWidth - window.innerWidth > threshold) {
      if (!devtools.open) {
        devtools.open = true;
        console.clear();
        console.log('%c🚫 Developer tools detected! This application is protected.', 
                   'color: red; font-size: 20px; font-weight: bold;');
        // Redirect or disable functionality
        if (typeof window !== 'undefined') {
          window.location.href = 'about:blank';
        }
      }
    } else {
      devtools.open = false;
    }
  }, 500);
  
  // Disable right-click context menu
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    return false;
  });
  
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123 || // F12
        (e.ctrlKey && e.shiftKey && e.keyCode === 73) || // Ctrl+Shift+I
        (e.ctrlKey && e.shiftKey && e.keyCode === 74) || // Ctrl+Shift+J
        (e.ctrlKey && e.keyCode === 85)) { // Ctrl+U
      e.preventDefault();
      return false;
    }
  });
  
  // Console warning
  console.log('%c⚠️ WARNING: This code is protected by advanced obfuscation.', 
             'color: orange; font-size: 16px; font-weight: bold;');
  console.log('%c🔒 Unauthorized access or reverse engineering is prohibited.', 
             'color: red; font-size: 14px;');
             
})();
`;
}

function obfuscateFile(filePath) {
  try {
    console.log(`🔒 Obfuscating: ${filePath}`);
    
    const sourceCode = fs.readFileSync(filePath, 'utf8');
    
    // Skip if file is too small or doesn't contain meaningful code
    if (sourceCode.trim().length < 50) {
      console.log(`⏭️  Skipping small file: ${filePath}`);
      return;
    }
    
    // Add protection only to main component files
    let protectedCode = sourceCode;
    if (filePath.includes('components') || filePath.includes('services')) {
      protectedCode = addAntiDebuggingProtection() + '\\n' + sourceCode;
    }
    
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
  if (!fs.existsSync(dirPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return;
  }
  
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
    } else if (stat.isFile() && isTargetFile(fullPath)) {
      obfuscateFile(fullPath);
    }
  });
}

function main() {
  console.log('🚀 Starting React frontend obfuscation process...');
  console.log('⚠️  This will modify your source files. Backups will be created.');
  
  directoriesToObfuscate.forEach(target => {
    const targetPath = path.resolve(target);
    console.log(`📁 Processing directory: ${targetPath}`);
    obfuscateDirectory(targetPath);
  });
  
  console.log('🎉 Frontend obfuscation process completed!');
  console.log('📝 Original files backed up with .backup extension');
  console.log('🔐 Your React code is now protected against reverse engineering');
  console.log('💡 Remember to test your application thoroughly after obfuscation');
}

// Run obfuscation
main();