const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Installing minimal GraphixLang extension...');

// Determine user's VS Code extensions folder
const homeDir = process.env.USERPROFILE || process.env.HOME;
const extensionsDir = path.join(homeDir, '.vscode', 'extensions');

// Create extension directory
const extensionName = 'graphixlang-minimal-0.1.0';
const targetDir = path.join(extensionsDir, extensionName);

// Remove existing extension if it exists
if (fs.existsSync(targetDir)) {
    console.log('Removing existing extension...');
    fs.rmSync(targetDir, { recursive: true, force: true });
}

// Create extension directory
fs.mkdirSync(targetDir, { recursive: true });
fs.mkdirSync(path.join(targetDir, 'syntaxes'), { recursive: true });

// Copy files to extension directory
fs.copyFileSync(
    path.join(__dirname, 'package.json'), 
    path.join(targetDir, 'package.json')
);
fs.copyFileSync(
    path.join(__dirname, 'language-configuration.json'), 
    path.join(targetDir, 'language-configuration.json')
);
fs.copyFileSync(
    path.join(__dirname, 'syntaxes', 'graphixlang.tmLanguage.json'), 
    path.join(targetDir, 'syntaxes', 'graphixlang.tmLanguage.json')
);

console.log(`Extension installed to ${targetDir}`);
console.log('');
console.log('To test:');
console.log('1. Close ALL VS Code instances');
console.log('2. Open VS Code');
console.log(`3. Open the test.pixil file in this directory`);
console.log('4. If syntax highlighting isn\'t working, run:');
console.log('   - Press Ctrl+K M');
console.log('   - Type "GraphixLang" and select it');
