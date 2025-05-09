# Twig Editor

A powerful browser-based editor for Twig templates with syntax highlighting, code formatting, error checking, intelligent autocomplete, and AI assistance.

## Features

### Core Features
- **Syntax Highlighting**: Full support for Twig template syntax with color coding
- **Code Formatting**: Format both HTML and Twig-specific syntax with correct indentation
- **Syntax Checking**: Validate Twig syntax with detailed error messages
- **Smart Autocomplete**: Context-aware suggestions from the complete Twig documentation
- **Enhanced Code Folding**: Improved folding for both HTML and Twig blocks with visual indicators
- **Dark/Light Mode**: Choose your preferred theme with a single click
- **Keyboard Shortcuts**: Improve productivity with helpful shortcuts
- **Mobile Responsive**: Works on various screen sizes and devices

### AI Assistant
- **Smart Suggestions**: Get context-aware code examples and explanations
- **Code Generation**: Generate Twig templates based on natural language descriptions
- **Syntax Help**: Get instant help with Twig syntax and best practices
- **Multiple AI Models**: Support for ChatGPT and Gemini (simulated offline)
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

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/twig-editor.git
cd twig-editor
```

2. Open `index.html` in your browser or serve it with any static file server.

For local development with direct file access (no server):
- Open the file directly in your browser using `file://` protocol
- All dependencies are loaded via CDN links, so no build step is required

For deployment:
- Upload all files to a web server
- No additional configuration required

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
2. Select your preferred AI model (ChatGPT or Gemini)
3. Click "Send" or press Cmd/Ctrl + Enter
4. Click "Copy & Insert" to add the generated code to your editor

## Project Structure

- `index.html`: Main HTML file with editor structure
- `styles.css`: CSS styling for the editor interface
- `twig-mode.js`: Custom CodeMirror mode for Twig syntax highlighting and folding
- `twig-data.js`: Data for autocompletion from Twig documentation
- `twig-editor.js`: Main editor implementation with all core features
- `ai-assistant.js`: AI integration for code assistance

## Dependencies

- [CodeMirror](https://codemirror.net/) (v5.65.3) for the editor component
- [js-beautify](https://github.com/beautify-web/js-beautify) for code formatting

## Browser Compatibility

Tested and working in:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Recent Improvements

- **Enhanced Code Folding**: Improved handling of nested blocks and HTML tags
- **Better Mobile Support**: Responsive design for smaller screens
- **Error Recovery**: Smart suggestions for fixing syntax errors
- **Performance Optimizations**: Debouncing for expensive operations
- **Simplified AI Assistant**: Works offline with pre-defined examples
- **Better UI Feedback**: Loading indicators and improved error messages

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