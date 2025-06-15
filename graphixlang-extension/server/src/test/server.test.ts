import { expect } from 'chai';
import { createConnection, ProposedFeatures } from 'vscode-languageserver';
import { GraphixLangService } from '../graphixLangService';

describe('GraphixLangService', () => {
    let connection: any;
    let service: GraphixLangService;

    beforeEach(() => {
        connection = createConnection(ProposedFeatures.all);
        service = new GraphixLangService(connection);
    });

    it('should highlight keywords correctly', () => {
        const code = 'let x = 10;';
        const expectedHighlights = [
            { start: 0, end: 3 }, // 'let'
            { start: 4, end: 5 }  // 'x'
        ];
        const highlights = service.getKeywordHighlights(code);
        expect(highlights).to.deep.equal(expectedHighlights);
    });

    it('should execute scripts correctly', async () => {
        const script = 'print("Hello, World!");';
        const result = await service.executeScript(script);
        expect(result).to.equal('Hello, World!');
    });
});