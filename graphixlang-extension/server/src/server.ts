import * as vscode from 'vscode';
import * as path from 'path';
import { createConnection, ProposedFeatures } from 'vscode-languageserver/node';
import { TextDocuments } from 'vscode-languageserver/node';
import { initializeGraphixLangService } from './graphixLangService';

const connection = createConnection(ProposedFeatures.all);
const documents = new TextDocuments();

connection.onInitialize(() => {
    return {
        capabilities: {
            textDocumentSync: documents.syncKind,
            // Add more capabilities as needed
        }
    };
});

documents.onDidChangeContent(change => {
    // Handle document changes for language features
});

initializeGraphixLangService(connection, documents);

documents.listen(connection);
connection.listen();