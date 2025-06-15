import * as vscode from 'vscode';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'vscode-languageclient/node';

export function activate(context: vscode.ExtensionContext) {
    const serverModule = context.asAbsolutePath(
        vscode.Uri.joinPath(context.extensionUri, 'server', 'dist', 'server.js').fsPath
    );

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

    const disposable = new LanguageClient('GraphixLang', 'GraphixLang Language Server', serverOptions, clientOptions).start();

    context.subscriptions.push(disposable);
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}