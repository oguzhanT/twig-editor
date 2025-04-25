# Twig Editor

A powerful browser-based editor for Twig templates with syntax highlighting, code formatting, error checking, intelligent autocomplete, and AI assistance.

![Twig Editor Screenshot](screenshot.png)

## Features

### Core Features
- **Syntax Highlighting**: Full support for Twig template syntax with color coding
- **Code Formatting**: Format both HTML and Twig-specific syntax with correct indentation
- **Syntax Checking**: Validate Twig syntax with detailed error messages
- **Smart Autocomplete**: Context-aware suggestions from the complete Twig documentation
- **Code Folding**: Collapse HTML and Twig blocks for better readability
- **Dark/Light Mode**: Choose your preferred theme with a single click
- **Keyboard Shortcuts**: Improve productivity with helpful shortcuts

### AI Assistant
- **Smart Suggestions**: Get context-aware code examples and explanations
- **Code Generation**: Generate Twig templates based on natural language descriptions
- **Syntax Help**: Get instant help with Twig syntax and best practices
- **Multiple AI Models**: Support for different AI models (ChatGPT, Gemini, Claude)
- **Quick Insert**: Copy and insert AI-generated code directly into the editor

### Smart Autocomplete Features
- Complete suggestions for all Twig tags, functions, and filters
- Context-aware filtering:
  - After `{{` shows functions and variables
  - After `{%` shows Twig tags
  - After `|` shows available filters
  - After `is` shows test operators
- Type-based filtering (e.g., "array_" to see only array-related functions)
- Full block templates that expand into complete structures
- Multi-word tag support (e.g., "ignore missing")

### Syntax Validation
- Real-time error detection:
  - Unclosed Twig blocks and variable tags
  - Mismatched block names (if/endif, for/endfor, etc.)
  - Proper nesting validation
  - Missing quotes in include statements
  - Invalid filter usage
  - Operator spacing validation
- Visual error indicators:
  - Underlined error locations
  - Error messages in status bar
  - Quick navigation to errors
  - Error count display

### Code Formatting
- Smart indentation for nested Twig blocks
- Proper HTML formatting
- Consistent spacing around operators
- Clean delimiter spacing
- Preserved empty lines
- Proper handling of inline tags

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/twig-editor.git
cd twig-editor
```

2. Open `index.html` in your browser or serve it with any static file server.

## Usage

### Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Trigger Autocomplete | Ctrl+B | ⌘+B |
| Toggle Code Folding | Ctrl+/ | ⌘+/ |
| Format Code | Click "Format Code" button | Click "Format Code" button |
| Check Syntax | Click "Check Syntax" button | Click "Check Syntax" button |

### AI Assistant Usage
1. Type your question or request in the AI prompt area
2. Select your preferred AI model
3. Click "Send" or press Cmd/Ctrl + Enter
4. Click "Copy & Insert" to add the generated code to your editor

### Autocomplete Contexts

1. **Twig Tags** (after `{%`):
   - Type to see available tags
   - Supports multi-word tags
   - Expands into full block templates

2. **Functions** (after `{{`):
   - Shows available Twig functions
   - Includes function signatures
   - Filters by prefix

3. **Filters** (after `|`):
   - Shows all available filters
   - Includes filter descriptions
   - Context-aware suggestions

4. **Tests** (after `is`):
   - Shows available test operators
   - Includes usage examples

### Code Templates
When you start typing a Twig block name after `{%`, you'll get suggestions for complete block structures:

- `if` expands to a complete if-endif block
- `for` expands to a for-endfor loop with else case
- `block` expands to a named block definition
- `macro` expands to a macro definition with parameters

## Project Structure

The project is organized into several files:

- `index.html`: Main HTML file with editor structure
- `styles.css`: CSS styling for the editor interface
- `twig-mode.js`: Custom CodeMirror mode for Twig syntax highlighting and folding
- `twig-data.js`: Data for autocompletion from Twig documentation
- `twig-editor.js`: Main editor implementation with all core features

## Customization

### Changing Default Theme
Edit the CSS variables in `styles.css` to customize colors for both dark and light themes.

### Adding Custom Snippets
Add your own code templates by modifying the `twigBlockTemplates` object in `twig-data.js`.

### Extending Autocomplete
Add new Twig functions, filters, or tags by updating the corresponding arrays in `twig-data.js`.

## Dependencies

This project uses:
- [CodeMirror](https://codemirror.net/) (v5.65.3) for the editor component
- [js-beautify](https://github.com/beautify-web/js-beautify) for code formatting

## Browser Compatibility

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Twig](https://twig.symfony.com/) for the excellent template engine
- [CodeMirror](https://codemirror.net/) for the powerful editor component
- [js-beautify](https://github.com/beautify-web/js-beautify) for HTML formatting