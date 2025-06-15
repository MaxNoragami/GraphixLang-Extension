import { expect } from 'chai';
import { describe, it } from 'mocha';
import { activate } from '../extension';

describe('GraphixLang Extension', () => {
    it('should activate the extension', async () => {
        const context = await activate();
        expect(context).to.exist;
    });

    // Additional tests can be added here
});