import { MarkedOptions, Renderer } from 'marked';
import MentionReplacer from '../replacer/mention-replacer';

class MarktoneRendererHelper {
    static escapeHTML(html: string): string {
        const escapeTest = /[&<>"']/;
        const escapeReplace = /[&<>"']/g;
        const replacements: { [key: string]: string } = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
        };

        if (escapeTest.test(html)) {
            return html.replace(escapeReplace, ch => replacements[ch]);
        }

        return html;
    }
}

interface Render {
    options: MarkedOptions;
}

/* eslint-disable class-methods-use-this */
class MarktoneRenderer extends Renderer {
    private mentionReplacer: MentionReplacer;

    constructor(mentionReplacer: MentionReplacer, options?: MarkedOptions) {
        super(options);
        this.mentionReplacer = mentionReplacer;
    }

    //
    // Block level renderer methods
    //

    heading(text: string, level: number): string {
        const fontSize = 2.0 - (0.2 * level);
        const lineHeight = 1.6 - (0.05 * level);
        const margin = 12 - level;
        let style = `font-size: ${fontSize}em; font-weight: bold; line-height: ${lineHeight}em; margin: ${margin}px 0;`;
        if (level <= 2) {
            style += ' border-bottom: 1px solid #ddd;';
        }

        return `<h${level} style="${style}">${text}</h${level}>`;
    }

    html(html: string): string {
        return this.mentionReplacer.replaceMention(html);
    }

    code(code: string, language: string, isEscaped: boolean): string {
        const escapedCode = isEscaped ? code : MarktoneRendererHelper.escapeHTML(code);
        const style = 'background-color: #f6f8fa; border-radius: 3px; padding: 8px 16px;';

        return `<pre style="${style}"><code>${escapedCode}</code></pre>`;
    }

    blockquote(quote: string): string {
        const style = 'border-left: .25em solid #dfe2e5; color: #6a737d; margin: 0; padding: 0 1em;';
        return `<blockquote style="${style}">${quote}</blockquote>`;
    }

    paragraph(text: string): string {
        const style = 'margin: 0 0 6px;';
        return `<p style="${style}">${text}</p>`;
    }

    table(header: string, body: string): string {
        const tableBody = body ? `<tbody>${body}</tbody>` : '';
        const style = 'border-collapse: collapse; border-spacing: 0; margin: 0 0 16px;';
        return `<table style="${style}"><thead>${header}</thead>${tableBody}</table>`;
    }

    tablerow(content: string): string {
        const style = 'background-color: #fff; border-top: 1px solid #c6cbd1;';
        return `<tr style="${style}">${content}</tr>`;
    }

    tablecell(content: string, flags: { header: boolean; align: 'center' | 'left' | 'right' | null }): string {
        const type = flags.header ? 'th' : 'td';
        const style = 'border: 1px solid #dfe2e5; padding: 6px 13px;';
        const tag = flags.align
            ? `<${type} align="${flags.align}" style="${style}">`
            : `<${type} style="${style}">`;
        return `${tag}${content}</${type}>`;
    }

    //
    // Inline level renderer methods
    //

    text(text: string): string {
        return this.mentionReplacer.replaceMention(text);
    }

    codespan(code: string): string {
        const style = 'background-color: rgba(27,31,35,.05); border-radius: 3px; margin: 0 1px; padding: .2em .4em;';
        return `<code style="${style}">${code}</code>`;
    }
}
/* eslint-enable class-methods-use-this */

export default MarktoneRenderer;
