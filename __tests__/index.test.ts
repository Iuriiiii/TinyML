const { TinyML } = require('../common');

describe('Traduction tests', () => {

    test('Translation test I', () => {
        const html = TinyML.t`html{}`;

        expect(html).toBe(`<html/>`);
    });

    test('Translation test II', () => {
        const html = TinyML.t`html{content}`;

        expect(html).toBe(`<html>content</html>`);
    });

    test('Translation test III', () => {
        const html = TinyML.t`html{co;p{nte}nt}`;

        expect(html).toBe(`<html>co<p>nte</p>nt</html>`);
    });

    test('Translation test VI', () => {
        const html = TinyML.t`html{co;p{nte}nt}other{anotherocntent}`;

        expect(html).toBe(`<html>co<p>nte</p>nt</html><other>anotherocntent</other>`);
    });

    test('Translation test V', () => {
        const html = TinyML.t`html{co;p{nte}nt}other{anotherocntent hr;}`;

        expect(html).toBe(`<html>co<p>nte</p>nt</html><other>anotherocntent <hr/></other>`);
    });

    test('Translation test VI', () => {
        const html = TinyML.t`body{<Hello people>}`;

        expect(html).toBe(`<body>&lt;Hello people&gt;</body>`);
    });

    test('Translation test VII', () => {
        const html = TinyML.t`body{{<Hello people>}}`;

        expect(html).toBe(`<body><Hello people></body>`);
    });

    test('Translation test VIII', () => {
        const html = TinyML.t`{body{{<Hello people>}}}`;

        expect(html).toBe(`body{{<Hello people>}}`);
    });

    test('Translation test IX', () => {
        const html = TinyML.t`{body{{<Hello people>}}}`;

        expect(html).toBe(`body{{<Hello people>}}`);
    });

    test('Translation test X', () => {
        const html = TinyML.t`[{body{{<Hello people>}}}]`;

        expect(html).toBe(`<!--{body{{<Hello people>}}}-->`);
    });
});