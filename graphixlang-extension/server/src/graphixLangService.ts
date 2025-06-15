import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

export class GraphixLangService {
    private client: LanguageClient;

    constructor() {
        const serverModule = require.resolve('./server');
        const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

        const serverOptions: ServerOptions = {
            run: { module: serverModule, transport: TransportKind.ipc },
            debug: { module: serverModule, transport: TransportKind.ipc, options: debugOptions }
        };

        const clientOptions: LanguageClientOptions = {
            documentSelector: [{ scheme: 'file', language: 'graphixlang' }],
            synchronize: {
                fileEvents: vscode.workspace.createFileSystemWatcher('**/.clientrc')
            }
        };

        this.client = new LanguageClient('graphixLang', 'GraphixLang Language Server', serverOptions, clientOptions);
    }

    public start() {
        this.client.start();
    }

    public highlightKeywords(document: vscode.TextDocument): void {
        const text = document.getText();
        const keywords = ['if', 'else', 'for', 'while']; // Example keywords
        const decorations: vscode.TextEditorDecorationType[] = [];

        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
            let match;
            while ((match = regex.exec(text)) !== null) {
                const decoration = {
                    range: new vscode.Range(document.positionAt(match.index), document.positionAt(match.index + keyword.length)),
                    renderOptions: {
                        after: {
                            contentText: ' ',
                            color: 'blue'
                        }
                    }
                };
                decorations.push(decoration);
            }
        });

        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === document) {
            editor.setDecorations(decorations);
        }
    }

    public executeScript(script: string): void {
        // Logic to execute the script
        console.log(`Executing script: ${script}`);
    }
}