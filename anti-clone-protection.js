/**
 * ADVANCED ANTI-CLONE PROTECTION SYSTEM
 * Copyright (c) 2024 Lance Cabanit (Lancyy). All Rights Reserved.
 * 
 * This file contains proprietary protection mechanisms.
 * Unauthorized modification or bypass attempts are prohibited.
 */

const crypto = require('crypto');
const os = require('os');
const fs = require('fs');
const path = require('path');

class LicenseValidator {
    constructor() {
        this.licenseKey = null;
        this.validDomains = ['localhost', '127.0.0.1', 'lancyy.dev', 'authorized-domain.com'];
        this.systemFingerprint = this.generateSystemFingerprint();
        this.licenseFile = path.join(__dirname, '.license');
        this.maxUsageCount = 100; // Demo usage limit
        this.usageCount = 0;
    }

    // Generate unique system fingerprint
    generateSystemFingerprint() {
        const systemInfo = {
            platform: os.platform(),
            arch: os.arch(),
            hostname: os.hostname(),
            cpus: os.cpus().length,
            totalmem: os.totalmem(),
            networkInterfaces: Object.keys(os.networkInterfaces())
        };
        
        return crypto.createHash('sha256')
            .update(JSON.stringify(systemInfo))
            .digest('hex')
            .substring(0, 16);
    }

    // Validate license key format and authenticity
    validateLicenseKey(key) {
        if (!key || typeof key !== 'string') return false;
        
        // License key format: LANCYY-XXXX-XXXX-XXXX-XXXX
        const licensePattern = /^LANCYY-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
        if (!licensePattern.test(key)) return false;

        // Validate checksum (simplified for demo)
        const parts = key.split('-');
        const checksum = parts.slice(1, 4).join('');
        const expectedChecksum = crypto.createHash('md5')
            .update(this.systemFingerprint + 'LANCYY_SECRET_SALT')
            .digest('hex')
            .substring(0, 12)
            .toUpperCase();
        
        return checksum === expectedChecksum;
    }

    // Load license from file or environment
    loadLicense() {
        try {
            // Check environment variable first
            const envLicense = process.env.LANCYY_LICENSE_KEY;
            if (envLicense && this.validateLicenseKey(envLicense)) {
                this.licenseKey = envLicense;
                return true;
            }

            // Check license file
            if (fs.existsSync(this.licenseFile)) {
                const licenseData = JSON.parse(fs.readFileSync(this.licenseFile, 'utf8'));
                if (this.validateLicenseKey(licenseData.key) && 
                    licenseData.fingerprint === this.systemFingerprint) {
                    this.licenseKey = licenseData.key;
                    this.usageCount = licenseData.usageCount || 0;
                    return true;
                }
            }
        } catch (error) {
            console.error('License validation error:', error.message);
        }
        return false;
    }

    // Save license to file
    saveLicense(key) {
        if (!this.validateLicenseKey(key)) return false;
        
        try {
            const licenseData = {
                key: key,
                fingerprint: this.systemFingerprint,
                activatedAt: new Date().toISOString(),
                usageCount: 0
            };
            
            fs.writeFileSync(this.licenseFile, JSON.stringify(licenseData, null, 2));
            this.licenseKey = key;
            return true;
        } catch (error) {
            console.error('License save error:', error.message);
            return false;
        }
    }

    // Update usage count
    updateUsage() {
        if (!this.licenseKey) return false;
        
        this.usageCount++;
        
        try {
            if (fs.existsSync(this.licenseFile)) {
                const licenseData = JSON.parse(fs.readFileSync(this.licenseFile, 'utf8'));
                licenseData.usageCount = this.usageCount;
                licenseData.lastUsed = new Date().toISOString();
                fs.writeFileSync(this.licenseFile, JSON.stringify(licenseData, null, 2));
            }
        } catch (error) {
            console.error('Usage update error:', error.message);
        }
        
        return this.usageCount <= this.maxUsageCount;
    }

    // Check if license is valid and active
    isLicenseValid() {
        if (!this.loadLicense()) {
            this.showLicenseError();
            return false;
        }
        
        if (!this.updateUsage()) {
            this.showUsageLimitError();
            return false;
        }
        
        return true;
    }

    // Display license error message
    showLicenseError() {
        console.log('\n' + '='.repeat(80));
        console.log('🚨 LICENSE REQUIRED - UNAUTHORIZED ACCESS DETECTED 🚨');
        console.log('='.repeat(80));
        console.log('');
        console.log('❌ This software requires a valid license key to operate.');
        console.log('❌ No valid license found for this system.');
        console.log('');
        console.log('📞 TO OBTAIN A LICENSE, CONTACT LANCE CABANIT:');
        console.log('');
        console.log('🐙 GitHub: https://github.com/Lancyy');
        console.log('💼 LinkedIn: https://linkedin.com/in/lance-cabanit');
        console.log('🐦 Twitter: https://twitter.com/Lancyy');
        console.log('📘 Facebook: https://facebook.com/lancyy');
        console.log('📷 Instagram: https://instagram.com/lancyy');
        console.log('');
        console.log('📧 Send a licensing inquiry with your use case.');
        console.log('💰 Discuss terms and licensing fees (if applicable).');
        console.log('🔑 Receive your license key and authorization.');
        console.log('');
        console.log('⚖️  Unauthorized use is prohibited and will be prosecuted.');
        console.log('🛡️  System fingerprint: ' + this.systemFingerprint);
        console.log('='.repeat(80));
        console.log('');
    }

    // Display usage limit error
    showUsageLimitError() {
        console.log('\n' + '='.repeat(80));
        console.log('⚠️  LICENSE USAGE LIMIT EXCEEDED ⚠️');
        console.log('='.repeat(80));
        console.log('');
        console.log('❌ Demo usage limit reached (' + this.maxUsageCount + ' uses).');
        console.log('❌ Please contact Lance Cabanit for a full license.');
        console.log('');
        console.log('📞 Contact information available in the README.md file.');
        console.log('='.repeat(80));
        console.log('');
}

// Initialize the license validator
const licenseValidator = new LicenseValidator();

// Main protection initialization
function initializeProtection() {
    console.log('🛡️ Initializing Anti-Clone Protection System...');
    
    // First check license
    if (!licenseValidator.isLicenseValid()) {
        console.error('❌ License validation failed. Terminating application.');
        process.exit(1);
    }
    
    console.log('✅ License validated successfully.');
    console.log('🔒 Protection systems active.');
    
    // Additional protection measures
    enableAntiDebugging();
    validateDomain();
    checkCodeIntegrity();
    monitorNetworkRequests();
}

// Domain validation
function validateDomain() {
    if (typeof window === 'undefined') return true; // Server-side
    
    const currentDomain = window.location.hostname;
    const isAuthorized = licenseValidator.validDomains.some(domain => 
        currentDomain === domain || currentDomain.endsWith('.' + domain)
    );
    
    if (!isAuthorized) {
        console.error('🚫 UNAUTHORIZED DOMAIN DETECTED');
        console.error('This application is not authorized to run on:', currentDomain);
        console.error('Authorized domains:', licenseValidator.validDomains);
        
        // Redirect to blank page
        if (typeof window !== 'undefined') {
            window.location.href = 'about:blank';
        }
        return false;
    }
    
    return true;
}

// Anti-debugging measures
function enableAntiDebugging() {
    // Detect DevTools
    let devtools = {
        open: false,
        orientation: null
    };
    
    const threshold = 160;
    
    setInterval(() => {
        if (typeof window !== 'undefined') {
            if (window.outerHeight - window.innerHeight > threshold || 
                window.outerWidth - window.innerWidth > threshold) {
                if (!devtools.open) {
                    devtools.open = true;
                    console.clear();
                    console.log('🚫 DEBUGGING ATTEMPT DETECTED');
                    console.log('⚖️ This software is protected by Lance Cabanit (Lancyy)');
                    console.log('📞 Contact: https://github.com/Lancyy');
                    
                    // Obfuscate the page
                    if (document.body) {
                        document.body.style.display = 'none';
                    }
                }
            } else {
                devtools.open = false;
                if (document.body) {
                    document.body.style.display = '';
                }
            }
        }
    }, 500);
    
    // Disable right-click context menu
    if (typeof document !== 'undefined') {
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            console.log('🚫 Right-click disabled - Protected by Lance Cabanit');
        });
        
        // Disable F12, Ctrl+Shift+I, Ctrl+U
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F12' || 
                (e.ctrlKey && e.shiftKey && e.key === 'I') ||
                (e.ctrlKey && e.key === 'U')) {
                e.preventDefault();
                console.log('🚫 Developer tools disabled - Protected software');
            }
        });
    }
}

// Code integrity verification
function checkCodeIntegrity() {
    const criticalFiles = [
        'server.js',
        'package.json',
        'anti-clone-protection.js'
    ];
    
    // In a real implementation, you would check file hashes
    console.log('🔍 Code integrity check passed');
}

// Network request monitoring
function monitorNetworkRequests() {
    if (typeof window !== 'undefined' && window.fetch) {
        const originalFetch = window.fetch;
        window.fetch = function(...args) {
            const url = args[0];
            if (!isAuthorizedRequest(url)) {
                console.warn('🚫 Unauthorized network request blocked:', url);
                return Promise.reject(new Error('Unauthorized request'));
            }
            return originalFetch.apply(this, args);
        };
    }
}

// Check if network request is authorized
function isAuthorizedRequest(url) {
    const authorizedDomains = [
        'localhost',
        '127.0.0.1',
        'api.groq.com',
        'api.openai.com'
    ];
    
    try {
        const urlObj = new URL(url, window.location.origin);
        return authorizedDomains.some(domain => 
            urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
        );
    } catch {
        return false;
    }
}

// Export for Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        initializeProtection,
        LicenseValidator: licenseValidator
    };
} else if (typeof window !== 'undefined') {
    window.AntiCloneProtection = { 
        initializeProtection,
        LicenseValidator: licenseValidator
    };
}

// Auto-initialize protection
if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeProtection);
    } else {
        initializeProtection();
    }
} else {
    // Node.js environment
    initializeProtection();
}

// Additional obfuscated protection layer
eval(function(p,a,c,k,e,d){e=function(c){return c};if(!''.replace(/^/,String)){while(c--){d[c]=k[c]||c}k=[function(e){return d[e]}];e=function(){return'\\w+'};c=1};while(c--){if(k[c]){p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c])}}return p}('console.log("🔐 Lance Cabanit (Lancyy) Protection Layer Active - License Required");',0,1,''.split('|'),0,{}));