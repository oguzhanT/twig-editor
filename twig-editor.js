/**
 * Main Twig Editor implementation
 */
document.addEventListener('DOMContentLoaded', function() {
    // Detect if the user is on a Mac
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    
    // Update the hint handler to use data from twig-data.js
    const twigComplete = {
        functions: twigFunctions.map(f => ({
            text: f.text.split('(')[0],
            displayText: f.displayText
        })),
        filters: twigFilters.map(f => ({
            text: f.text.split(' ')[0],
            displayText: f.displayText
        })),
        tags: twigTags.map(t => ({
            text: t.text,
            displayText: t.displayText,
            template: twigBlockTemplates[t.text]
        })),
        blockTemplates: twigBlockTemplates  // Use the templates from twig-data.js
    };
    
    // Initialize the editor
    const editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
        mode: "twig",  // Make sure this is set to twig
        theme: "default",
        lineNumbers: true,
        autoCloseBrackets: true,
        matchBrackets: true,
        indentUnit: 4,
        tabSize: 4,
        indentWithTabs: false,
        foldGutter: true,  // This must be true to enable folding
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],  // Must include the fold gutter
        extraKeys: {
            "Cmd-B": (cm) => {
                showTwigCompletions(cm);
            },
            "Ctrl-B": (cm) => {
                showTwigCompletions(cm);
            },
            "Cmd-/": cm => cm.foldCode(cm.getCursor()),  // Fold at cursor
            "Ctrl-/": cm => cm.foldCode(cm.getCursor()), // Fold at cursor
            // Rest of your extraKeys...
        },
        fold: "twig",  // Use the custom twig folding mode
        foldOptions: {
            widget: '...',
            rangeFinder: twigFold,  // Make sure this is set to your twigFold function
            minFoldSize: 2
        }
    });
    // Make sure fold gutter is defined correctly in CodeMirror
CodeMirror.defineOption("foldGutter", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
        cm.clearGutter("CodeMirror-foldgutter");
        cm.state.foldGutter = null;
        cm.off("gutterClick", onGutterClick);
        cm.off("change", onChange);
        cm.off("viewportChange", onViewportChange);
        cm.off("fold", onFold);
        cm.off("unfold", onFold);
        cm.off("swapDoc", onChange);
    }
    if (val) {
        cm.state.foldGutter = new CodeMirror.FoldGutter();
        updateInViewport(cm);
        cm.on("gutterClick", onGutterClick);
        cm.on("change", onChange);
        cm.on("viewportChange", onViewportChange);
        cm.on("fold", onFold);
        cm.on("unfold", onFold);
        cm.on("swapDoc", onChange);
    }
});
    
    // Set default content
    editor.setValue(`<!DOCTYPE html>
<html>
    <head>
        <title>{{ page_title }}</title>
    </head>
    <body>
        <h1>{{ page_title }}</h1>
        
        <nav>
            {% include 'partials/navigation.twig' %}
        </nav>
        
        <main>
            {% set name = 'Fabien' %}
            
            <p>Hello {{ name }}!</p>
            
            {% if content %}
                <div class="content">
                    {{ content|raw }}
                </div>
            {% else %}
                <p>No content available.</p>
            {% endif %}
            
            {% for item in items %}
                <div class="item">
                    <h2>{{ item.title }}</h2>
                    <p>{{ item.description }}</p>
                </div>
            {% endfor %}
        </main>
        
        <footer>
            {{ footer_text }}
        </footer>
    </body>
</html>`);
    
    // Update cursor position
    editor.on('cursorActivity', function() {
        const cursor = editor.getCursor();
        document.getElementById('cursorPosition').textContent = `Line: ${cursor.line + 1}, Column: ${cursor.ch + 1}`;
    });
    
    // Add better fold markers on line numbers
    editor.on("renderLine", function(cm, line, el) {
        const lineContent = line.text;
        
        // Check if line has foldable content
        if (
            /<(\w+)[^>]*>/.test(lineContent) ||
            /{%\s*(if|for|block|macro|embed|set|apply|verbatim|with)\s+/.test(lineContent)
        ) {
            el.classList.add("foldable");
        }
    });
    
    // Automatically show folding markers
    setTimeout(function() {
        for (let i = 0; i < editor.lineCount(); i++) {
            const line = editor.getLine(i);
            if (
                /<(\w+)[^>]*>/.test(line) ||
                /{%\s*(if|for|block|macro|embed|set|apply|verbatim|with)\s+/.test(line)
            ) {
                editor.addLineClass(i, "background", "foldable-line");
            }
        }
    }, 100);
    
    // Register gutter click handler for folding
    editor.on("gutterClick", function(cm, line, gutter, clickEvent) {
        if (gutter === "CodeMirror-foldgutter") {
            const lineContent = cm.getLine(line);
            if (/{%.*?%}/.test(lineContent) || /<[^>]+>/.test(lineContent)) {
                cm.foldCode(CodeMirror.Pos(line, 0));
            }
        }
    });
    
    // Register Twig autocomplete with complete documentation and filtering
    CodeMirror.registerHelper('hint', 'twig', function(cm) {
        const cursor = cm.getCursor();
        const token = cm.getTokenAt(cursor);
        const line = cm.getLine(cursor.line);
        
        // Detect context and filter suggestions
        let list = [];
        let start = token.start;
        let end = token.end;
        
        // Inside a Twig block or output?
        const isTwigBlock = line.indexOf("{%") !== -1 && line.indexOf("%}") === -1;
        const isTwigOutput = line.indexOf("{{") !== -1 && line.indexOf("}}") === -1;
        
        // Are we after a pipe character? (filter context)
        if (line.substring(0, cursor.ch).includes('|')) {
            list = twigComplete.filters;
            // Find the position of the pipe
            const pipePos = line.substring(0, cursor.ch).lastIndexOf('|');
            if (pipePos !== -1) {
                start = pipePos + 1;
                // Trim any whitespace
                while (line.charAt(start) === ' ' && start < cursor.ch) {
                    start++;
                }
                end = cursor.ch;
            }
        } 
        // Are we after "is" keyword? (test context)
        else if (line.substring(0, cursor.ch).match(/\bis\s+\w*$/)) {
            list = twigTests;
            const isMatch = line.substring(0, cursor.ch).match(/\bis\s+(\w*)$/);
            if (isMatch) {
                start = cursor.ch - isMatch[1].length;
                end = cursor.ch;
            }
        }
        // Check for block tags context right after {%
        else if (line.match(/{%\s*\w*$/) || line.match(/{%\s+\w*$/)) {
            list = twigComplete.tags;
            // Find start position after {% and any spaces
            const match = line.match(/{%\s*(\w*)$/);
            if (match) {
                start = cursor.ch - match[1].length;
                end = cursor.ch;
            }
        }
        // Inside Twig block but after a tag?
        else if (isTwigBlock) {
            // Handle special cases like "set"
            if (line.match(/{%\s*set\s+\w*$/)) {
                // We're in a set statement, let users complete variable names
                return null; // No specific completions for var names
            } else {
                list = twigComplete.functions;
            }
        }
        // Inside a Twig output but not a filter?
        else if (isTwigOutput) {
            list = twigComplete.functions;
        }
        
        // Filter suggestions based on current prefix
        if (token.string) {
            const prefix = token.string.toLowerCase();
            
            // Special handling for array_* prefix
            if (prefix.startsWith('array_')) {
                // Only show array functions
                list = twigComplete.functions.filter(item => 
                    item.text.toLowerCase().startsWith('array_')
                );
            } else {
                // Normal filtering based on prefix
                list = list.filter(item => {
                    const itemText = item.text.toLowerCase();
                    return itemText.startsWith(prefix) || itemText.includes(prefix);
                });
            }
        }
        
        // Special handling for block-style completions with templates
        const result = {
            list: list,
            from: CodeMirror.Pos(cursor.line, start),
            to: CodeMirror.Pos(cursor.line, end)
        };
        
        // Override the pick function to handle templates for blocks
        result.pick = function(completion, element) {
            const item = completion;
            
            if (item.template) {
                // This is a block template, insert with proper formatting
                const { text, cursorPos } = processTemplate(item.template, cm);
                
                // Calculate indent level
                const lineContent = cm.getLine(cursor.line);
                const indent = lineContent.match(/^\s*/)[0];
                
                // Format each line with proper indentation
                const formattedTemplate = text
                    .split('\n')
                    .map((line, index) => index === 0 ? line : indent + line)
                    .join('\n');
                
                // Replace the entire line
                const lineStart = { line: cursor.line, ch: 0 };
                const lineEnd = { line: cursor.line, ch: lineContent.length };
                cm.replaceRange(formattedTemplate, lineStart, lineEnd);
                
                // Set cursor to a sensible position
                if (cursorPos) {
                    const cursorIndex = formattedTemplate.indexOf(cursorPos);
                    if (cursorIndex >= 0) {
                        const lines = formattedTemplate.substring(0, cursorIndex).split('\n');
                        const lastLine = lines.length - 1;
                        const lastLinePos = lines[lastLine].length;
                        cm.setCursor({ line: cursor.line + lastLine, ch: lastLinePos });
                    }
                }
            } else {
                // Default behavior for non-template items
                const from = CodeMirror.Pos(cursor.line, start);
                const to = CodeMirror.Pos(cursor.line, end);
                cm.replaceRange(item.text, from, to);
            }
            
            if (twigComplete.blockTemplates && twigComplete.blockTemplates[item.text]) {
                const template = twigComplete.blockTemplates[item.text];
                // ... rest of template handling code ...
            }
        };
        
        return result;
    });
    
    // Format code button
    document.getElementById('formatBtn').addEventListener('click', function() {
        formatCode(editor);
    });
    
    // Check syntax button
    document.getElementById('checkSyntaxBtn').addEventListener('click', function() {
        checkSyntax(editor);
    });
    
    // Dark mode toggle
    document.getElementById('darkModeToggle').addEventListener('click', function() {
        toggleDarkMode(editor);
    });
    
    /**
     * Format Twig code
     */
    function formatCode(editor) {
        try {
            const code = editor.getValue();
            const cursor = editor.getCursor();
            
            // Format the code
            const formattedCode = improvedTwigFormatting(code);
            
            editor.setValue(formattedCode);
            editor.setCursor(cursor);
            
            showSuccessMessage("Code formatted successfully");
        } catch (error) {
            showErrorMessage("Error formatting code: " + error.message);
        }
    }
    
    /**
     * Improved Twig formatting - handles indentation properly and respects set tags
     */
    function improvedTwigFormatting(code) {
        // First, preserve all Twig tags
        const twigTags = [];
        let preservedCode = code.replace(/({%[\s\S]*?%}|{{[\s\S]*?}}|{#[\s\S]*?#})/g, function(match) {
            // Clean up internal spacing in Twig tags
            const cleanedTag = match
                .replace(/{{\s+/g, "{{ ")
                .replace(/\s+}}/g, " }}")
                .replace(/{%\s+/g, "{% ")
                .replace(/\s+%}/g, " %}")
                .replace(/{#\s+/g, "{# ")
                .replace(/\s+#}/g, " #}");
            
            const placeholder = `__TWIG_PLACEHOLDER_${twigTags.length}__`;
            twigTags.push(cleanedTag);
            return placeholder;
        });
        
        // Format HTML with js-beautify
        const beautifyOptions = {
            indent_size: 4,
            indent_char: ' ',
            max_preserve_newlines: 2,
            preserve_newlines: true,
            keep_array_indentation: false,
            break_chained_methods: false,
            indent_scripts: "normal",
            brace_style: "collapse",
            space_before_conditional: true,
            unescape_strings: false,
            jslint_happy: false,
            end_with_newline: true,
            wrap_line_length: 0,
            indent_inner_html: true,
            comma_first: false,
            e4x: false,
            indent_empty_lines: false
        };
        
        let formattedHtml = html_beautify(preservedCode, beautifyOptions);
        
        // Restore Twig tags
        let resultCode = formattedHtml;
        for (let i = 0; i < twigTags.length; i++) {
            resultCode = resultCode.replace(`__TWIG_PLACEHOLDER_${i}__`, twigTags[i]);
        }
        
        // Handle indentation for Twig control structures
        const lines = resultCode.split('\n');
        const resultLines = [];
        let indentLevel = 0;
        
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            const trimmedLine = line.trim();
            
            // Check if this line has a closing tag that should reduce indent
            const hasClosingTag = /{%\s*end(if|for|block|set|macro|embed|apply|verbatim|with)\s*%}/.test(trimmedLine);
            
            // Check if this line has Twig else/elseif (same indentation level)
            const hasElseTag = /{%\s*(else|elseif)\s+.*?%}/.test(trimmedLine);
            
            if (hasClosingTag || hasElseTag) {
                indentLevel = Math.max(0, indentLevel - 1);
            }
            
            // Get the current indentation and determine proper indent
            const currentIndent = line.match(/^\s*/)[0];
            const properIndent = ' '.repeat(4 * indentLevel);
            
            // Replace the current indentation with the proper one
            if (trimmedLine.length > 0) {  // Only modify non-empty lines
                resultLines.push(properIndent + trimmedLine);
            } else {
                resultLines.push('');  // Keep empty lines as-is
            }
            
            // Check if this line opens a new block that should increase indent
            const hasOpeningTag = /{%\s*(if|for|block|set|macro|embed|apply|verbatim|with)\s+.*?%}/.test(trimmedLine) &&
                                !/{%\s*end(if|for|block|set|macro|embed|apply|verbatim|with)\s*%}/.test(trimmedLine);
            
            // Skip increasing indent for inline set with assignment
            const isInlineSet = /{%\s*set\s+.*?=.*?%}/.test(trimmedLine);
            
            if ((hasOpeningTag && !isInlineSet) || hasElseTag) {
                indentLevel++;
            }
        }
        
        return resultLines.join('\n');
    }
    
    // Add these Twig coding standard rules
    const twigCodingStandards = {
        // Delimiter spacing rules
        delimiterSpacing: {
            pattern: /{%\s+|\s+%}|{{\s+|\s+}}|{#\s+|\s+#}/,
            fix: (match) => match.replace(/\s+(%}|}}|#})/g, '$1')
                                .replace(/({{|{%|{#)\s+/g, '$1 ')
        },
        
        // Operator spacing rules
        operatorSpacing: {
            pattern: /\s*(==|!=|<|>|>=|<=|\+|-|\/|\*|%|\/\/|\*\*|not|and|or|~|is|in)\s*/g,
            fix: (match, operator) => ` ${operator} `
        },
        
        // Punctuation spacing rules
        punctuationSpacing: {
            colonInHash: /:\s*/g,
            commaInArray: /,\s*/g,
            parentheses: /\(\s+|\s+\)/g,
            fix: {
                colon: (match) => ': ',
                comma: (match) => ', ',
                parentheses: (match) => match.replace(/\s+/g, '')
            }
        }
    };

    // Add HTML validation rules
    const htmlValidation = {
        voidElements: new Set([
            'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 
            'link', 'meta', 'param', 'source', 'track', 'wbr'
        ]),
        
        requiredAttributes: {
            img: ['src', 'alt'],
            a: ['href'],
            link: ['href'],
            script: ['src'],
            input: ['type'],
            meta: ['content']
        },
        
        validElements: new Set([
            'html', 'head', 'body', 'div', 'span', 'p', 'a', 'img', 'ul', 'ol', 'li',
            'table', 'tr', 'td', 'th', 'thead', 'tbody', 'form', 'input', 'button',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section', 'article', 'nav', 'aside',
            'footer', 'header', 'main', 'label', 'select', 'option', 'textarea'
        ])
    };

    // Add HTML suggestions
    const htmlSuggestions = {
        elements: [
            { text: 'div', displayText: 'div - Generic container' },
            { text: 'span', displayText: 'span - Inline container' },
            { text: 'p', displayText: 'p - Paragraph' },
            { text: 'a', displayText: 'a - Link', template: '<a href="">${1}</a>' },
            { text: 'img', displayText: 'img - Image', template: '<img src="" alt="" />' },
            { text: 'ul', displayText: 'ul - Unordered list', template: '<ul>\n    <li>${1}</li>\n</ul>' },
            { text: 'ol', displayText: 'ol - Ordered list', template: '<ol>\n    <li>${1}</li>\n</ol>' },
            { text: 'li', displayText: 'li - List item' },
            { text: 'table', displayText: 'table - Table', template: '<table>\n    <tr>\n        <td>${1}</td>\n    </tr>\n</table>' }
        ],
        
        attributes: {
            global: ['class', 'id', 'style', 'title', 'data-'],
            a: ['href', 'target', 'rel'],
            img: ['src', 'alt', 'width', 'height'],
            input: ['type', 'name', 'value', 'placeholder'],
            form: ['action', 'method', 'enctype']
        }
    };

    /**
 * Add these functions to your twig-editor.js file
 * to improve fold gutter functionality
 */

// Add this after editor initialization
function enhanceFoldGutters() {
    // Add better fold markers on line numbers
    editor.on("renderLine", function(cm, line, el) {
        const lineContent = line.text;
        
        // Check if line has foldable content with improved detection
        if (
            // HTML tag patterns
            /<(div|section|main|article|header|footer|aside|nav|ul|ol|table|form|head|body|style|script)(\s|>)/.test(lineContent) ||
            // Twig block patterns with more precise detection
            /{%\s*(if|for|block|macro|embed|set|apply|verbatim|with)(\s+|\s*%})/.test(lineContent)
        ) {
            el.classList.add("foldable");
            
            // Add a small indicator on the line itself
            if (!el.querySelector('.fold-indicator')) {
                const foldIndicator = document.createElement('span');
                foldIndicator.className = 'fold-indicator';
                foldIndicator.textContent = '▶';
                foldIndicator.style.position = 'absolute';
                foldIndicator.style.left = '-5px';
                foldIndicator.style.color = 'var(--fold-color)';
                foldIndicator.style.fontSize = '10px';
                foldIndicator.style.opacity = '0.7';
                foldIndicator.style.cursor = 'pointer';
                el.appendChild(foldIndicator);
            }
        }
    });
    
    // Force refresh of gutters
    setTimeout(function() {
        editor.refresh();
        
        // Mark all potentially foldable lines
        for (let i = 0; i < editor.lineCount(); i++) {
            const line = editor.getLine(i);
            if (
                // HTML tag patterns
                /<(div|section|main|article|header|footer|aside|nav|ul|ol|table|form|head|body|style|script)(\s|>)/.test(line) ||
                // Twig block patterns
                /{%\s*(if|for|block|macro|embed|set|apply|verbatim|with)(\s+|\s*%})/.test(line)
            ) {
                editor.addLineClass(i, "background", "foldable-line");
            }
        }
    }, 100);
    
    // Make fold gutters more visible
    const gutters = document.querySelectorAll('.CodeMirror-foldgutter-open, .CodeMirror-foldgutter-folded');
    gutters.forEach(gutter => {
        gutter.style.color = 'var(--fold-color)';
        gutter.style.fontSize = '14px';
        gutter.style.opacity = '1';
        gutter.style.cursor = 'pointer';
    });
}

// Ensure fold gutter is working
function setupFoldHandlers() {
    // Make fold gutter more interactive and visible
    document.addEventListener('click', function(event) {
        // Check if the click target is a fold gutter or indicator
        if (
            event.target.classList.contains('CodeMirror-foldgutter-open') ||
            event.target.classList.contains('CodeMirror-foldgutter-folded') ||
            event.target.classList.contains('fold-indicator')
        ) {
            const cm = editor;
            const lineIndex = event.target.closest('.CodeMirror-line') ? 
                cm.getLineNumber(event.target.closest('.CodeMirror-line')) : 
                parseInt(event.target.closest('.CodeMirror-gutter-wrapper').getAttribute('data-line-number'));
            
            if (!isNaN(lineIndex)) {
                cm.foldCode(CodeMirror.Pos(lineIndex, 0));
            }
        }
    });
    
    // Add style for fold gutters
    const style = document.createElement('style');
    style.textContent = `
        .CodeMirror-foldgutter-open,
        .CodeMirror-foldgutter-folded {
            color: var(--fold-color);
            cursor: pointer;
            transition: transform 0.2s;
        }
        
        .CodeMirror-foldgutter-open:hover,
        .CodeMirror-foldgutter-folded:hover {
            transform: scale(1.2);
        }
        
        .CodeMirror-foldgutter-open:after {
            content: "▼";
        }
        
        .CodeMirror-foldgutter-folded:after {
            content: "▶";
        }
        
        .foldable-line {
            background-color: rgba(114, 135, 253, 0.05);
        }
        
        .fold-indicator {
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .CodeMirror-line:hover .fold-indicator {
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
}

// Call these functions after editor initialization
// Add these lines at the end of your editor initialization code
enhanceFoldGutters();
setupFoldHandlers();
    // Update the analyzeTwigSyntax function with comprehensive Twig checks
    function analyzeTwigSyntax(code) {
        const errors = [];
        const openBlocks = [];
        const validTags = [
            'apply', 'autoescape', 'block', 'cache', 'deprecated', 'do', 'embed',
            'extends', 'flush', 'for', 'from', 'if', 'import', 'include', 'macro',
            'sandbox', 'set', 'use', 'verbatim', 'with'
        ];
        
        const validFilters = [
            'abs', 'batch', 'capitalize', 'column', 'convert_encoding', 'date',
            'date_modify', 'default', 'escape', 'filter', 'first', 'format',
            'join', 'json_encode', 'keys', 'last', 'length', 'lower', 'map',
            'merge', 'nl2br', 'number_format', 'raw', 'reduce', 'replace',
            'reverse', 'round', 'slice', 'sort', 'split', 'striptags', 'title',
            'trim', 'upper', 'url_encode'
        ];

        const validOperators = [
            'in', 'not in', 'is', 'is not', 'and', 'or', 'matches', '==', '!=',
            '<', '>', '>=', '<=', '\\+', '-', '\\/', '\\*', '%', '\\/\\/', '\\*\\*'
        ];

        // Split code into lines
        const lines = code.split('\n');
        
        lines.forEach((line, index) => {
            const lineNumber = index + 1;
            
            // 1. Check for Twig syntax
            const twigMatches = line.match(/({%[\s\S]*?%}|{{[\s\S]*?}}|{#[\s\S]*?#})/g) || [];
            
            twigMatches.forEach(match => {
                // Check variable syntax
                if (match.startsWith('{{')) {
                    if (!match.endsWith('}}')) {
                        errors.push({
                            line: lineNumber,
                            message: 'Unclosed variable output',
                            type: 'twig'
                        });
                    } else {
                        // Check variable expression syntax
                        const varContent = match.slice(2, -2).trim();
                        if (!varContent) {
                            errors.push({
                                line: lineNumber,
                                message: 'Empty variable expression',
                                type: 'twig'
                            });
                        }
                        
                        // Check filter syntax
                        if (varContent.includes('|')) {
                            const filters = varContent.split('|').slice(1);
                            filters.forEach(filter => {
                                const filterName = filter.trim().split('(')[0];
                                if (!validFilters.includes(filterName)) {
                                    errors.push({
                                        line: lineNumber,
                                        message: `Unknown filter "${filterName}"`,
                                        type: 'twig'
                                    });
                                }
                            });
                        }
                    }
                }
                
                // Check block syntax
                if (match.startsWith('{%')) {
                    if (!match.endsWith('%}')) {
                        errors.push({
                            line: lineNumber,
                            message: 'Unclosed block statement',
                            type: 'twig'
                        });
                    } else {
                        const blockContent = match.slice(2, -2).trim();
                        const blockWords = blockContent.split(/\s+/);
                        const blockType = blockWords[0];
                        
                        // Check if it's a valid tag
                        if (!blockType.startsWith('end') && !validTags.includes(blockType)) {
                            errors.push({
                                line: lineNumber,
                                message: `Unknown tag "${blockType}"`,
                                type: 'twig'
                            });
                        }
                        
                        // Track block opening/closing
                        if (!blockType.startsWith('end')) {
                            // Special checks for specific tags
                            switch (blockType) {
                                case 'for':
                                    if (!blockContent.includes(' in ')) {
                                        errors.push({
                                            line: lineNumber,
                                            message: 'Invalid for loop syntax: missing "in" keyword',
                                            type: 'twig'
                                        });
                                    }
                                    break;
                                case 'set':
                                    if (!blockContent.includes('=') && !blockContent.endsWith('%}')) {
                                        errors.push({
                                            line: lineNumber,
                                            message: 'Invalid set syntax',
                                            type: 'twig'
                                        });
                                    }
                                    break;
                                case 'include':
                                    if (!blockContent.includes("'") && !blockContent.includes('"')) {
                                        errors.push({
                                            line: lineNumber,
                                            message: 'Include path must be a string literal',
                                            type: 'twig'
                                        });
                                    }
                                    break;
                            }
                            
                            if (['if', 'for', 'block', 'macro', 'embed', 'set', 'apply', 'verbatim', 'with'].includes(blockType)) {
                                openBlocks.push({
                                    type: blockType,
                                    line: lineNumber
                                });
                            }
                        } else {
                            const endType = blockType.substring(3);
                            const lastBlock = openBlocks.pop();
                            
                            if (!lastBlock) {
                                errors.push({
                                    line: lineNumber,
                                    message: `Unexpected "${blockType}" with no opening tag`,
                                    type: 'twig'
                                });
                            } else if (endType !== lastBlock.type) {
                                errors.push({
                                    line: lineNumber,
                                    message: `Mismatched Twig tags: expected "end${lastBlock.type}", found "${blockType}"`,
                                    type: 'twig'
                                });
                            }
                        }
                    }
                }
                
                // Check comment syntax
                if (match.startsWith('{#')) {
                    if (!match.endsWith('#}')) {
                        errors.push({
                            line: lineNumber,
                            message: 'Unclosed comment',
                            type: 'twig'
                        });
                    }
                }
                
                // Check operator syntax
                validOperators.forEach(operator => {
                    const escapedOperator = operator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp(`\\s${escapedOperator}\\s`);
                    if (match.match(regex)) {
                        const operatorContext = match.slice(Math.max(0, match.indexOf(operator) - 10), 
                                                          Math.min(match.length, match.indexOf(operator) + 10));
                        if (!operatorContext.match(new RegExp(`[\\w\\s]${escapedOperator}[\\w\\s]`))) {
                            errors.push({
                                line: lineNumber,
                                message: `Invalid operator usage: "${operator}" must have spaces around it`,
                                type: 'twig'
                            });
                        }
                    }
                });
            });
        });
        
        // Check for unclosed blocks at end of file
        openBlocks.forEach(block => {
            errors.push({
                line: block.line,
                message: `Unclosed Twig "${block.type}" block`,
                type: 'twig'
            });
        });
        
        return errors;
    }

    // Update the checkSyntax function
    function checkSyntax(editor) {
        // Clear any existing error markers
        clearErrorMarkers(editor);
        
        const code = editor.getValue();
        const errors = analyzeTwigSyntax(code);
        
        if (errors.length === 0) {
            showSuccessMessage("Twig syntax check passed: No errors found");
            document.getElementById('errorCount').textContent = '';
        } else {
            // Mark errors in the editor
            errors.forEach(error => {
                const lineNum = error.line - 1;
                
                // Add error line background
                editor.addLineClass(lineNum, 'background', 'error-line');
                
                // Add error marker
                const marker = editor.markText(
                    {line: lineNum, ch: 0},
                    {line: lineNum, ch: editor.getLine(lineNum).length},
                    {
                        className: 'error-mark',
                        title: error.message
                    }
                );
                
                // Store marker for later cleanup
                if (!window.errorMarkers) window.errorMarkers = [];
                window.errorMarkers.push(marker);
            });
            
            // Update error count display
            document.getElementById('errorCount').textContent = `Found ${errors.length} Twig syntax error(s)`;
            
            // Show first error and scroll to it
            const firstError = errors[0];
            showErrorMessage(`${firstError.message} (Line ${firstError.line})`);
            editor.scrollIntoView({line: firstError.line - 1, ch: 0});
        }
    }
    
    /**
     * Mark errors in the editor
     */
    function markErrors(editor, errors) {
        window.errorMarkers = window.errorMarkers || [];
        
        errors.forEach(error => {
            const lineNum = Math.min(Math.max(error.line - 1, 0), editor.lineCount() - 1);
            
            // Add background highlight to the entire line
            const lineHandle = editor.addLineClass(lineNum, 'background', 'error-line');
            
            // Add wavy underline to the specific error
            const marker = editor.markText(
                {line: lineNum, ch: 0},
                {line: lineNum, ch: editor.getLine(lineNum).length},
                {
                    className: 'error-mark',
                    title: error.message,
                    css: 'border-bottom: 2px wavy var(--error-color)'
                }
            );
            
            window.errorMarkers.push(marker, lineHandle);
            
            // Add error gutter marker
            editor.setGutterMarker(lineNum, 'CodeMirror-linenumbers', makeErrorMarker(error.message));
        });
    }
    
    /**
     * Clear all error markers
     */
    function clearErrorMarkers(editor) {
        // Clear existing markers
        if (window.errorMarkers) {
            window.errorMarkers.forEach(marker => marker.clear());
            window.errorMarkers = [];
        }
        
        // Clear line backgrounds
        for (let i = 0; i < editor.lineCount(); i++) {
            editor.removeLineClass(i, 'background', 'error-line');
        }
        
        // Clear error messages
        document.getElementById('errorCount').textContent = '';
        document.getElementById('errorMessage').style.display = 'none';
    }
    
    /**
     * Toggle dark/light mode
     */
    function toggleDarkMode(editor) {
        const body = document.body;
        const darkModeToggle = document.getElementById('darkModeToggle');
        
        if (body.classList.contains('light-mode')) {
            // Switch to dark mode
            body.classList.remove('light-mode');
            editor.setOption('theme', 'dracula');
            darkModeToggle.textContent = '☀️';
        } else {
            // Switch to light mode
            body.classList.add('light-mode');
            editor.setOption('theme', 'default');
            darkModeToggle.textContent = '🌙';
        }
    }
    
    /**
     * Show success message
     */
    function showSuccessMessage(message) {
        const element = document.getElementById('successMessage');
        element.textContent = message;
        element.style.display = 'block';
        
        document.getElementById('errorMessage').style.display = 'none';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 3000);
    }
    
    /**
     * Show error message
     */
    function showErrorMessage(message) {
        const element = document.getElementById('errorMessage');
        element.textContent = message;
        element.style.display = 'block';
        
        document.getElementById('successMessage').style.display = 'none';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
    
    // Add this after editor initialization
    const aiAssistant = new AIAssistant(editor);

    // Update the keyup event handler
    editor.on('keyup', function(cm, event) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const beforeCursor = line.slice(0, cursor.ch);
        
        // Show completions after typing |
        if (event.key === '|') {
            showFilterCompletions(cm);
        }
        // Also show completions if typing after |
        else if (beforeCursor.includes('|')) {
            const afterPipe = beforeCursor.slice(beforeCursor.lastIndexOf('|') + 1);
            if (afterPipe.length > 0) {
                showFilterCompletions(cm);
            }
        }
    });

    // Add this new function for filter completions
    function showFilterCompletions(cm) {
        CodeMirror.commands.autocomplete(cm, null, {
            completeSingle: false,
            alignWithWord: true,
            hint: function(editor, options) {
                const cursor = editor.getCursor();
                const line = editor.getLine(cursor.line);
                const beforeCursor = line.slice(0, cursor.ch);
                
                // Find the last pipe character
                const pipePos = beforeCursor.lastIndexOf('|');
                if (pipePos === -1) return;
                
                const typed = beforeCursor.slice(pipePos + 1).trim().toLowerCase();
                const from = CodeMirror.Pos(cursor.line, pipePos + 1);
                const to = cursor.ch === pipePos + 1 ? from : cursor;
                
                // Filter the list based on what's typed after the pipe
                const list = twigComplete.filters
                    .map(item => ({
                        text: item.text,
                        displayText: item.displayText,
                        type: 'filter'
                    }))
                    .filter(item => !typed || item.text.toLowerCase().includes(typed));
                
                return {
                    list: list,
                    from: from,
                    to: to
                };
            }
        });
    }

    // Update the showTwigCompletions function to handle filters
    function showTwigCompletions(cm) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const beforeCursor = line.slice(0, cursor.ch);
        
        if (beforeCursor.includes('|')) {
            showFilterCompletions(cm);
        }
        else if (beforeCursor.includes('{%')) {
            CodeMirror.commands.autocomplete(cm, null, {
                completeSingle: false,
                twigTagContext: true
            });
        }
        else if (beforeCursor.includes('{{')) {
            CodeMirror.commands.autocomplete(cm, null, {
                completeSingle: false,
                twigVarContext: true
            });
        }
    }

    // Add these example templates
    const exampleTemplates = {
        dummy: {
            text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
            paragraph: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            date: '2024-03-21',
            time: '14:30',
            price: '$99.99',
            url: 'https://example.com'
        },
        twig: {
            basic: {
                variables: `{{ page_title }}
{{ user.name }}
{{ product.price|number_format(2, '.', ',') }}`,
                conditions: `{% if user.isLoggedIn %}
    <p>Welcome back, {{ user.name }}!</p>
{% else %}
    <p>Please log in</p>
{% endif %}`,
                loops: `{% for product in products %}
    <div class="product">
        <h2>{{ product.name }}</h2>
        <p>{{ product.description }}</p>
        <span>{{ product.price|currency }}</span>
    </div>
{% endfor %}`,
                filters: `{{ title|upper }}
{{ content|striptags|slice(0, 100) }}
{{ date|date('Y-m-d') }}`
            },
            advanced: {
                macros: `{% macro input(name, value, type = "text", size = 20) %}
    <input type="{{ type }}" name="{{ name }}" value="{{ value|e }}" size="{{ size }}" />
{% endmacro %}`,
                includes: `{% include 'header.html.twig' with {'title': page_title} %}
{% include 'sidebar.html.twig' ignore missing %}`,
                blocks: `{% extends "base.html.twig" %}

{% block title %}{{ page_title }}{% endblock %}

{% block content %}
    <h1>{{ page_title }}</h1>
    {{ content|raw }}
{% endblock %}`
            }
        },
        html: {
            basic: {
                structure: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title</title>
</head>
<body>
    <header>
        <h1>Welcome</h1>
    </header>
    <main>
        <p>Content goes here</p>
    </main>
    <footer>
        <p>&copy; 2024</p>
    </footer>
</body>
</html>`,
                form: `<form action="/submit" method="post">
    <div class="form-group">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
    </div>
    <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>
    <button type="submit">Submit</button>
</form>`,
                table: `<table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Admin</td>
        </tr>
    </tbody>
</table>`
            }
        }
    };

    // Update the generateAIPrompt function
    function generateAIPrompt(completion) {
        const type = completion.type;
        const name = completion.text;
        
        // Handle special commands
        if (name.toLowerCase().includes('dummy')) {
            if (name.toLowerCase().includes('text')) {
                return exampleTemplates.dummy.text;
            } else if (name.toLowerCase().includes('paragraph')) {
                return exampleTemplates.dummy.paragraph;
            } else if (name.toLowerCase().includes('name')) {
                return exampleTemplates.dummy.name;
            } else if (name.toLowerCase().includes('email')) {
                return exampleTemplates.dummy.email;
            } else if (name.toLowerCase().includes('phone')) {
                return exampleTemplates.dummy.phone;
            } else if (name.toLowerCase().includes('date')) {
                return exampleTemplates.dummy.date;
            }
        }

        // Handle Twig and HTML examples
        if (type === 'html-tag') {
            const example = htmlSuggestions.elements.find(el => el.text === name);
            if (example && example.template) {
                return example.template;
            }
        }

        let prompt = '';
        
        if (completion.template) {
            // For block templates, provide example with context
            const blockExample = exampleTemplates.twig.advanced.blocks;
            prompt = `Here's how to use the "${name}" block:\n\n${blockExample}`;
        } else {
            switch (type) {
                case 'function':
                    prompt = `Here's how to use the "${name}" function:\n\n`;
                    if (name.includes('date')) {
                        prompt += `{{ ${name}(user.created_at, 'Y-m-d H:i:s') }}`;
                    } else if (name.includes('include')) {
                        prompt += exampleTemplates.twig.advanced.includes;
                    } else {
                        prompt += `{{ ${name}(parameter) }}`;
                    }
                    break;

                case 'filter':
                    prompt = `Here's how to use the "${name}" filter:\n\n`;
                    if (name === 'date') {
                        prompt += `{{ user.created_at|${name}('Y-m-d') }}`;
                    } else if (name === 'slice') {
                        prompt += `{{ text|${name}(0, 100) }}...`;
                    } else if (name === 'default') {
                        prompt += `{{ user.name|${name}('Guest') }}`;
                    } else {
                        prompt += `{{ variable|${name} }}`;
                    }
                    break;

                case 'tag':
                    prompt = `Here's how to use the "${name}" tag:\n\n`;
                    if (name === 'for') {
                        prompt += exampleTemplates.twig.basic.loops;
                    } else if (name === 'if') {
                        prompt += exampleTemplates.twig.basic.conditions;
                    } else if (name === 'macro') {
                        prompt += exampleTemplates.twig.advanced.macros;
                    } else {
                        prompt += `{% ${name} %}
    // Your content here
{% end${name} %}`;
                    }
                    break;

                case 'html-tag':
                    prompt = `Here's an example of the "${name}" tag:\n\n`;
                    if (name === 'form') {
                        prompt += exampleTemplates.html.basic.form;
                    } else if (name === 'table') {
                        prompt += exampleTemplates.html.basic.table;
                    } else {
                        prompt += `<${name}>Your content</${name}>`;
                    }
                    break;

                default:
                    if (name.toLowerCase().includes('html')) {
                        prompt = exampleTemplates.html.basic.structure;
                    } else {
                        prompt = `Here's a basic Twig template:\n\n${exampleTemplates.twig.basic.variables}`;
                    }
            }
        }
        
        return prompt;
    }

    // Add event listener for AI commands
    editor.on('keyup', function(cm, event) {
        const cursor = cm.getCursor();
        const line = cm.getLine(cursor.line);
        const beforeCursor = line.slice(0, cursor.ch);
        
        // Check for dummy text commands
        if (beforeCursor.match(/dummy(text|paragraph|name|email|phone|date)/i)) {
            const command = beforeCursor.match(/dummy(\w+)/i)[0].toLowerCase();
            const dummyText = exampleTemplates.dummy[command.replace('dummy', '')] || exampleTemplates.dummy.text;
            
            // Replace the command with the dummy text
            const from = {
                line: cursor.line,
                ch: beforeCursor.lastIndexOf('dummy')
            };
            const to = {
                line: cursor.line,
                ch: cursor.ch
            };
            
            cm.replaceRange(dummyText, from, to);
        }
    });

    // Add this right after editor initialization
    document.body.classList.add('light-mode'); // Add light mode class by default
    document.getElementById('darkModeToggle').textContent = '🌙'; // Set moon icon for dark mode toggle
});

// Add this helper function to create error markers in the gutter
function makeErrorMarker(message) {
    const marker = document.createElement('div');
    marker.style.color = 'var(--error-color)';
    marker.style.marginLeft = '5px';
    marker.innerHTML = '●';
    marker.title = message;
    return marker;
}