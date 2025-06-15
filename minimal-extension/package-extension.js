const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Packaging GraphixLang extension as VSIX...');

try {
    
    if (!fs.existsSync(path.join(__dirname, 'extension.js'))) {
        console.error('extension.js not found! Make sure you have created this file.');
        process.exit(1);
    }
    
    
    const executableDir = path.join(__dirname, 'executable');
    if (!fs.existsSync(executableDir)) {
        fs.mkdirSync(executableDir, { recursive: true });
        console.log('Created executable directory');
    }
    
    
    const readmePath = path.join(executableDir, 'README.md');
    if (!fs.existsSync(readmePath)) {
        console.log('Creating README.md in executable directory...');
        const readmeContent = `# GraphixLang Executable Directory

Place your GraphixLang executable here:

- For Windows: Put \`graphixlang.exe\` in this directory
- For macOS/Linux: Put \`graphixlang\` in this directory

The extension will automatically use the executable from this directory when running GraphixLang files.`;
        
        fs.writeFileSync(readmePath, readmeContent);
    }
    
    console.log('Checking for executable and dependencies...');
    const executableName = process.platform === 'win32' ? 'GraphixLang.Presentation.exe' : 'GraphixLang.Presentation';
    const executablePath = path.join(executableDir, executableName);
    const dllPath = path.join(executableDir, 'GraphixLang.Presentation.dll');
    const runtimeConfigPath = path.join(executableDir, 'GraphixLang.Presentation.runtimeconfig.json');
    
    if (!fs.existsSync(executablePath)) {
        console.warn(`\nWARNING: GraphixLang executable (${executableName}) not found in the executable directory.`);
        console.warn(`Please place the executable at: ${executablePath}`);
        console.warn('The extension will still be packaged, but the run button will not work without the executable.\n');
    } else {
        console.log(`Found executable: ${executablePath}`);
    }
    
    if (!fs.existsSync(dllPath)) {
        console.warn(`\nWARNING: GraphixLang.Presentation.dll not found in the executable directory.`);
        console.warn(`Please place this DLL at: ${dllPath}`);
        console.warn('The extension will still be packaged, but the run button will not work without this dependency.\n');
    } else {
        console.log(`Found dependency: ${dllPath}`);
    }
    
    if (!fs.existsSync(runtimeConfigPath)) {
        console.warn(`\nWARNING: GraphixLang.Presentation.runtimeconfig.json not found in the executable directory.`);
        console.warn(`Creating a default runtimeconfig.json file at: ${runtimeConfigPath}`);
        
        const runtimeConfig = {
            "runtimeOptions": {
                "tfm": "net6.0",
                "framework": {
                    "name": "Microsoft.NETCore.App",
                    "version": "6.0.0"
                }
            }
        };
        
        fs.writeFileSync(runtimeConfigPath, JSON.stringify(runtimeConfig, null, 2));
        console.log(`Created default runtimeconfig.json file`);
    } else {
        console.log(`Found runtime config: ${runtimeConfigPath}`);
    }
    
    
    const winDir = path.join(executableDir, 'win');
    const macDir = path.join(executableDir, 'mac');
    const linuxDir = path.join(executableDir, 'linux');
    
    [winDir, macDir, linuxDir].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });
    
    
    console.log('Checking for platform-specific executables...');
    
    const winExe = path.join(winDir, 'GraphixLang.Presentation.exe');
    const macExe = path.join(macDir, 'GraphixLang.Presentation');
    const linuxExe = path.join(linuxDir, 'GraphixLang.Presentation');
    
    let platformsFound = [];
    
    if (fs.existsSync(winExe)) {
        console.log(`Found Windows executable: ${winExe}`);
        platformsFound.push('Windows');
    }
    
    if (fs.existsSync(macExe)) {
        console.log(`Found macOS executable: ${macExe}`);
        platformsFound.push('macOS');
    }
    
    if (fs.existsSync(linuxExe)) {
        console.log(`Found Linux executable: ${linuxExe}`);
        platformsFound.push('Linux');
    }
    
    if (platformsFound.length === 0) {
        console.warn('\nWARNING: No platform-specific executables were found!');
        console.warn('Please publish for at least one platform and place the files in the appropriate directories:');
        console.warn(` - Windows: ${winDir}`);
        console.warn(` - macOS: ${macDir}`);
        console.warn(` - Linux: ${linuxDir}`);
        console.warn('See README.md for publishing instructions');
    } else {
        console.log(`\nExecutables found for: ${platformsFound.join(', ')}`);
    }

    
    try {
        execSync('vsce --version', { stdio: 'ignore' });
        console.log('vsce is already installed');
    } catch (error) {
        console.log('Installing vsce...');
        execSync('npm install -g @vscode/vsce', { stdio: 'inherit' });
    }

    
    console.log('Creating VSIX package...');
    execSync('vsce package', { stdio: 'inherit', cwd: __dirname });
    
    const vsixFile = 'graphixlang-minimal-0.1.0.vsix';
    const vsixPath = path.join(__dirname, vsixFile);
    
    if (fs.existsSync(vsixPath)) {
        console.log(`\nSuccess! Extension packaged as ${vsixFile}`);
        console.log('\nTo install:');
        console.log('1. Open VS Code');
        console.log('2. Go to Extensions (Ctrl+Shift+X)');
        console.log('3. Click on the "..." menu in the top-right of the Extensions view');
        console.log('4. Select "Install from VSIX..."');
        console.log(`5. Navigate to: ${vsixPath}`);
        console.log('6. Select the VSIX file and it will install properly');
        
        
        try {
            if (process.platform === 'win32') {
                execSync(`explorer "${path.dirname(vsixPath)}"`);
            } else if (process.platform === 'darwin') {
                execSync(`open "${path.dirname(vsixPath)}"`);
            } else {
                execSync(`xdg-open "${path.dirname(vsixPath)}"`);
            }
        } catch (error) {
            
        }
    } else {
        throw new Error('Failed to create VSIX package');
    }
} catch (error) {
    console.error('Failed to package extension:', error.message);
    process.exit(1);
}
