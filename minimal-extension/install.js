const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const os = require('os');

console.log('IMPORTANT: The manual file copying approach is unreliable in recent VS Code versions.');
console.log('Using the new package-extension.js script is recommended!\n');
console.log('Run: node package-extension.js\n');


function findExtensionsDirectory() {
    const homeDir = os.homedir();
    const platform = process.platform;
    
    let possibleLocations = [];
    
    
    if (platform === 'win32') {
        possibleLocations = [
            path.join(homeDir, '.vscode', 'extensions'),
            path.join(homeDir, '.vscode-insiders', 'extensions'),
            path.join(process.env.APPDATA || '', 'Code', 'User', 'extensions'),
            path.join(process.env.APPDATA || '', 'Code - Insiders', 'User', 'extensions')
        ];
    } else if (platform === 'darwin') { 
        possibleLocations = [
            path.join(homeDir, '.vscode', 'extensions'),
            path.join(homeDir, '.vscode-insiders', 'extensions'),
            path.join(homeDir, 'Library', 'Application Support', 'Code', 'User', 'extensions'),
            path.join(homeDir, 'Library', 'Application Support', 'Code - Insiders', 'User', 'extensions')
        ];
    } else { 
        possibleLocations = [
            path.join(homeDir, '.vscode', 'extensions'),
            path.join(homeDir, '.vscode-insiders', 'extensions'),
            path.join(homeDir, '.config', 'Code', 'User', 'extensions'),
            path.join(homeDir, '.config', 'Code - Insiders', 'User', 'extensions')
        ];
    }
    
    
    const existingLocations = possibleLocations.filter(loc => {
        try {
            return fs.existsSync(loc) && fs.statSync(loc).isDirectory();
        } catch (err) {
            return false;
        }
    });
    
    if (existingLocations.length === 0) {
        console.error('Could not find VS Code extensions directory!');
        console.log('Examined locations:');
        possibleLocations.forEach(loc => console.log(` - ${loc}`));
        throw new Error('VS Code extensions directory not found');
    }
    
    console.log(`Found VS Code extensions directory: ${existingLocations[0]}`);
    return existingLocations[0];
}

try {
    
    const extensionsDir = findExtensionsDirectory();
    
    
    const extensionName = 'graphixlang-minimal-0.1.0';
    const targetDir = path.join(extensionsDir, extensionName);
    
    console.log(`Installing to: ${targetDir}`);
    
    
    if (fs.existsSync(targetDir)) {
        console.log('Removing existing extension...');
        fs.rmSync(targetDir, { recursive: true, force: true });
    }
    
    
    fs.mkdirSync(targetDir, { recursive: true });
    fs.mkdirSync(path.join(targetDir, 'syntaxes'), { recursive: true });
    
    
    console.log('Copying files...');
    try {
        fs.copyFileSync(
            path.join(__dirname, 'package.json'), 
            path.join(targetDir, 'package.json')
        );
        console.log('- Copied package.json');
        
        fs.copyFileSync(
            path.join(__dirname, 'language-configuration.json'), 
            path.join(targetDir, 'language-configuration.json')
        );
        console.log('- Copied language-configuration.json');
        
        fs.copyFileSync(
            path.join(__dirname, 'syntaxes', 'graphixlang.tmLanguage.json'), 
            path.join(targetDir, 'syntaxes', 'graphixlang.tmLanguage.json')
        );
        console.log('- Copied graphixlang.tmLanguage.json');
    } catch (err) {
        console.error('Error copying files:', err);
        throw err;
    }
    
    console.log('\nWARNING: This installation method may not register with VS Code properly.');
    console.log('If the extension does not appear in VS Code, please use:');
    console.log('node package-extension.js');
    console.log('This will create a proper VSIX file that you can install through VS Code.');
    
} catch (error) {
    console.error('Installation failed:', error);
    console.log('');
    console.log('Manual installation steps:');
    console.log('1. Open VS Code');
    console.log('2. Press Ctrl+Shift+X to open Extensions');
    console.log('3. Click the ... menu and select "Install from VSIX..."');
    console.log('4. Navigate to the directory containing this script');
    console.log('5. Run: npm i -g @vscode/vsce');
    console.log('6. Run: vsce package');
    console.log('7. Select the created .vsix file');
    process.exit(1);
}
