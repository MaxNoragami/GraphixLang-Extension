const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('GraphixLang extension is now active');

    let runCommand = vscode.commands.registerCommand('graphixlang.run', async () => {
        
        const activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            vscode.window.showErrorMessage('No active editor found');
            return;
        }

        const document = activeEditor.document;
        
        
        if (path.extname(document.fileName) !== '.pixil') {
            vscode.window.showErrorMessage('Current file is not a GraphixLang file');
            return;
        }

        try {
            
            if (document.isDirty) {
                await document.save();
            }
            
            
            const filePath = document.fileName;
            
            
            const config = vscode.workspace.getConfiguration('graphixlang');
            let executablePath = config.get('executablePath');
            
            
            if (!executablePath) {
                
                const extensionPath = context.extensionPath;
                
                
                let platformFolder;
                if (process.platform === 'win32') {
                    platformFolder = 'win';
                } else if (process.platform === 'darwin') {
                    platformFolder = 'mac';
                } else {
                    platformFolder = 'linux';
                }
                
                
                executablePath = path.join(extensionPath, 'executable', platformFolder, 
                    process.platform === 'win32' ? 'GraphixLang.Presentation.exe' : 'GraphixLang.Presentation');
            }
            
            else if (executablePath.includes('${workspaceFolder}') && vscode.workspace.workspaceFolders) {
                const workspacePath = vscode.workspace.workspaceFolders[0].uri.fsPath;
                executablePath = executablePath.replace('${workspaceFolder}', workspacePath);
            }

            
            if (!fs.existsSync(executablePath)) {
                throw new Error(`GraphixLang executable not found at: ${executablePath}\n` +
                                `Make sure to place the executable in the 'executable' folder of the extension, ` +
                                `which should be at: ${path.join(context.extensionPath, 'executable')}`);
            }
            
            
            const terminal = vscode.window.createTerminal('GraphixLang');
            terminal.show();
            
            
            let command;
            if (process.platform === 'win32') {
                
                command = `& '${executablePath}' '${filePath}'`;
            } else {
                
                command = `"${executablePath}" "${filePath}"`;
            }
            
            vscode.window.showInformationMessage(`Running: GraphixLang on ${path.basename(filePath)}`);
            terminal.sendText(command);
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to run GraphixLang: ${error.message}`);
        }
    });

    context.subscriptions.push(runCommand);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};
