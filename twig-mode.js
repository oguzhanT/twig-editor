/**
 * Twig mode for CodeMirror
 * Defines syntax highlighting for Twig templates
 */

// Define Twig mode based on HTML mixed
CodeMirror.defineMode("twig", function(config) {
    const htmlMixedMode = CodeMirror.getMode(config, "htmlmixed");
    
    return {
        name: "twig",
        startState: function() {
            return {
                htmlState: CodeMirror.startState(htmlMixedMode),
                twigOutputStart: false,
                twigBlockStart: false,
                twigCommentStart: false
            };
        },
        copyState: function(state) {
            return {
                htmlState: CodeMirror.copyState(htmlMixedMode, state.htmlState),
                twigOutputStart: state.twigOutputStart,
                twigBlockStart: state.twigBlockStart,
                twigCommentStart: state.twigCommentStart
            };
        },
        token: function(stream, state) {
            // Check for Twig output syntax
            if (stream.match("{{")) {
                state.twigOutputStart = true;
                return "keyword twig-delimiter";
            }
            
            if (state.twigOutputStart) {
                if (stream.match("}}")) {
                    state.twigOutputStart = false;
                    return "keyword twig-delimiter";
                }
                
                // Enhanced keyword detection
                if (stream.match(/\b(true|false|null|not|and|or|is|in|as|filter|do)\b/)) {
                    return "atom twig-keyword";
                }
                
                // Improved function detection
                if (stream.match(/\b[a-zA-Z_][a-zA-Z0-9_]*(?=\()/)) {
                    return "def twig-function";
                }
                
                // Better variable detection
                if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
                    return "variable-2 twig-variable";
                }
                
                stream.next();
                return null;
            }
            
            // Enhance block syntax detection
            if (stream.match("{%")) {
                state.twigBlockStart = true;
                return "keyword twig-block-delimiter";
            }
            
            if (state.twigBlockStart) {
                if (stream.match("%}")) {
                    state.twigBlockStart = false;
                    return "keyword";
                }
                
                if (stream.match(/\b(if|else|elseif|for|endfor|in|not|and|or|is|as|endif|block|endblock|extends|include|set|endset|macro|endmacro|import|from|embed|endembed|with|endwith|filter|endfilter|verbatim|endverbatim|apply|endapply|autoescape|endautoescape|do|flush|cache|endcache)\b/)) {
                    return "keyword";
                }
                
                if (stream.match(/"[^"]*"|'[^']*'/)) {
                    return "string";
                }
                
                if (stream.match(/\b\d+\b/)) {
                    return "number";
                }
                
                if (stream.match(/[a-zA-Z_][a-zA-Z0-9_]*/)) {
                    return "variable-2";
                }
                
                stream.next();
                return null;
            }
            
            // Check for Twig comments
            if (stream.match("{#")) {
                state.twigCommentStart = true;
                return "comment";
            }
            
            if (state.twigCommentStart) {
                if (stream.match("#}")) {
                    state.twigCommentStart = false;
                    return "comment";
                }
                
                stream.next();
                return "comment";
            }
            
            // Default to HTML mixed mode
            return htmlMixedMode.token(stream, state.htmlState);
        }
    };
});

// Register the MIME type
CodeMirror.defineMIME("text/x-twig", "twig");

// Define custom folding for Twig templates
// Replace the current twigFold function in twig-mode.js with this improved version

function twigFold(cm, start) {
    const line = cm.getLine(start.line);
    const maxLines = cm.lineCount();
    
    // Handle Twig blocks with improved detection and nesting support
    const twigMatch = line.match(/{%[-\s]*(\w+)(?:\s|%})/);
    if (twigMatch) {
        const blockType = twigMatch[1];
        if (!blockType.startsWith('end') && 
            ['if', 'for', 'block', 'macro', 'embed', 'set', 'apply', 'verbatim', 'with'].includes(blockType)) {
            let depth = 1;
            let endLine = -1;
            
            for (let i = start.line + 1; i < maxLines; i++) {
                const nextLine = cm.getLine(i);
                
                // Count opening tags of the same type
                const openTagRegex = new RegExp(`{%[-\\s]*${blockType}\\b`, 'g');
                const openTags = (nextLine.match(openTagRegex) || []).length;
                depth += openTags;
                
                // Count closing tags
                const closeTagRegex = new RegExp(`{%[-\\s]*end${blockType}\\b`, 'g');
                const closeTags = (nextLine.match(closeTagRegex) || []).length;
                depth -= closeTags;
                
                if (depth === 0) {
                    endLine = i;
                    break;
                }
            }
            
            if (endLine !== -1) {
                return {
                    from: CodeMirror.Pos(start.line, 0),
                    to: CodeMirror.Pos(endLine, cm.getLine(endLine).length)
                };
            }
        }
    }
    
    // Handle HTML tags with improved nesting support
    const htmlMatch = line.match(/<([a-zA-Z][a-zA-Z0-9]*)(?:\s[^>]*)?>/);
    if (htmlMatch && !line.match(new RegExp(`</${htmlMatch[1]}>`, 'i')) && !line.match(/<[^>]*\/>/)) {
        const tagName = htmlMatch[1].toLowerCase();
        
        // Skip self-closing tags
        const selfClosingTags = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
                               'link', 'meta', 'param', 'source', 'track', 'wbr'];
        if (selfClosingTags.includes(tagName)) {
            return null;
        }
        
        let depth = 1;
        let endLine = -1;
        
        for (let i = start.line + 1; i < maxLines; i++) {
            const nextLine = cm.getLine(i);
            
            // Count opening tags of the same type (properly handle attributes with spaces)
            const openTagRegex = new RegExp(`<${tagName}(?:\\s[^>]*)?(?<!/)>`, 'gi');
            const openTags = (nextLine.match(openTagRegex) || []).length;
            depth += openTags;
            
            // Count closing tags
            const closeTagRegex = new RegExp(`</${tagName}>`, 'gi');
            const closeTags = (nextLine.match(closeTagRegex) || []).length;
            depth -= closeTags;
            
            if (depth === 0) {
                endLine = i;
                break;
            }
        }
        
        if (endLine !== -1) {
            return {
                from: CodeMirror.Pos(start.line, 0),
                to: CodeMirror.Pos(endLine, cm.getLine(endLine).length)
            };
        }
    }
    
    // Handle div/section/main blocks
    if (/^\s*<(div|section|main|article|header|footer|aside|nav)/.test(line)) {
        const blockMatch = line.match(/<(div|section|main|article|header|footer|aside|nav)/);
        if (blockMatch) {
            const blockType = blockMatch[1];
            let depth = 1;
            let endLine = -1;
            
            for (let i = start.line + 1; i < maxLines; i++) {
                const nextLine = cm.getLine(i);
                
                // Count opening block tags
                const openTagRegex = new RegExp(`<${blockType}(?:\\s|>)`, 'g');
                const openTags = (nextLine.match(openTagRegex) || []).length;
                depth += openTags;
                
                // Count closing block tags
                const closeTagRegex = new RegExp(`</${blockType}>`, 'g');
                const closeTags = (nextLine.match(closeTagRegex) || []).length;
                depth -= closeTags;
                
                if (depth === 0) {
                    endLine = i;
                    break;
                }
            }
            
            if (endLine !== -1) {
                return {
                    from: CodeMirror.Pos(start.line, 0),
                    to: CodeMirror.Pos(endLine, cm.getLine(endLine).length)
                };
            }
        }
    }
    
    // Add special support for common paired tags
    const pairedTags = {
        '<ul>': '</ul>',
        '<ol>': '</ol>',
        '<table>': '</table>',
        '<tr>': '</tr>',
        '<form>': '</form>',
        '<head>': '</head>',
        '<body>': '</body>',
        '<style>': '</style>',
        '<script>': '</script>'
    };
    
    for (const [openTag, closeTag] of Object.entries(pairedTags)) {
        if (line.includes(openTag) && !line.includes(closeTag)) {
            // Look for matching close tag
            for (let i = start.line + 1; i < maxLines; i++) {
                if (cm.getLine(i).includes(closeTag)) {
                    return {
                        from: CodeMirror.Pos(start.line, 0),
                        to: CodeMirror.Pos(i, cm.getLine(i).length)
                    };
                }
            }
        }
    }
    
    return null;
}

// Register the fold function
CodeMirror.registerHelper("fold", "twig", twigFold);