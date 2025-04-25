/**
 * Twig data definitions for autocompletion 
 * Contains data from Twig documentation: https://twig.symfony.com/doc/3.x/
 */

// Twig block templates (snippets) for autocomplete
const twigBlockTemplates = {
    "if": "{% if ${1:condition} %}\n    ${2:content}\n{% endif %}",
    "if-else": "{% if ${1:condition} %}\n    ${2:content}\n{% else %}\n    ${3:else_content}\n{% endif %}",
    "for": "{% for ${1:item} in ${2:items} %}\n    ${3:content}\n{% endfor %}",
    "for-else": "{% for ${1:item} in ${2:items} %}\n    ${3:content}\n{% else %}\n    ${4:empty_content}\n{% endfor %}",
    "set": "{% set ${1:variable} = ${2:value} %}",
    "set-block": "{% set ${1:variable} %}\n    ${2:content}\n{% endset %}",
    "block": "{% block ${1:name} %}\n    ${2:content}\n{% endblock %}",
    "extends": "{% extends '${1:template}' %}",
    "include": "{% include '${1:template}' %}",
    "embed": "{% embed '${1:template}' %}\n    {% block ${2:name} %}\n        ${3:content}\n    {% endblock %}\n{% endembed %}",
    "macro": "{% macro ${1:name}(${2:params}) %}\n    ${3:content}\n{% endmacro %}",
    "import": "{% import '${1:template}' as ${2:macros} %}",
    "from": "{% from '${1:template}' import ${2:macros} %}",
    "with": "{% with ${1:vars} %}\n    ${2:content}\n{% endwith %}",
    "apply": "{% apply ${1:filter} %}\n    ${2:content}\n{% endapply %}",
    "verbatim": "{% verbatim %}\n    ${1:content}\n{% endverbatim %}"
};

// Complete Twig tag suggestions based on documentation
const twigTags = [
    { text: "if", displayText: "if - Conditional block", template: twigBlockTemplates["if"] },
    { text: "if-else", displayText: "if-else - Conditional with else", template: twigBlockTemplates["if-else"] },
    { text: "for", displayText: "for - Loop block", template: twigBlockTemplates["for"] },
    { text: "for-else", displayText: "for-else - Loop with empty case", template: twigBlockTemplates["for-else"] },
    { text: "set", displayText: "set - Set variable", template: twigBlockTemplates["set"] },
    { text: "set-block", displayText: "set-block - Set with content block", template: twigBlockTemplates["set-block"] },
    { text: "block", displayText: "block - Define template block", template: twigBlockTemplates["block"] },
    { text: "extends", displayText: "extends - Inherit from template", template: twigBlockTemplates["extends"] },
    { text: "include", displayText: "include - Include template", template: twigBlockTemplates["include"] },
    { text: "embed", displayText: "embed - Embed template with blocks", template: twigBlockTemplates["embed"] },
    { text: "macro", displayText: "macro - Define reusable content", template: twigBlockTemplates["macro"] },
    { text: "import", displayText: "import - Import macros", template: twigBlockTemplates["import"] },
    { text: "from", displayText: "from - Import specific macros", template: twigBlockTemplates["from"] },
    { text: "with", displayText: "with - Isolated variable scope", template: twigBlockTemplates["with"] },
    { text: "apply", displayText: "apply - Apply filter to content", template: twigBlockTemplates["apply"] },
    { text: "verbatim", displayText: "verbatim - Display raw content", template: twigBlockTemplates["verbatim"] },
    { text: 'autoescape', displayText: 'autoescape - Auto-escape variables' },
    { text: 'cache', displayText: 'cache - Cache a template fragment' },
    { text: 'deprecated', displayText: 'deprecated - Mark as deprecated' },
    { text: 'do', displayText: 'do - Evaluate an expression' },
    { text: 'flush', displayText: 'flush - Flush the output' },
    { text: 'sandbox', displayText: 'sandbox - Sandbox untrusted code' },
    { text: 'use', displayText: 'use - Use a template horizontally' },
    // Related end tags
    { text: 'endapply', displayText: 'endapply - End apply block' },
    { text: 'endautoescape', displayText: 'endautoescape - End autoescape block' },
    { text: 'endblock', displayText: 'endblock - End block definition' },
    { text: 'endcache', displayText: 'endcache - End cache block' },
    { text: 'enddeprecated', displayText: 'enddeprecated - End deprecated block' },
    { text: 'endembed', displayText: 'endembed - End embed block' },
    { text: 'endfor', displayText: 'endfor - End for loop' },
    { text: 'endif', displayText: 'endif - End if statement' },
    { text: 'endmacro', displayText: 'endmacro - End macro definition' },
    { text: 'endsandbox', displayText: 'endsandbox - End sandbox block' },
    { text: 'endset', displayText: 'endset - End set block' },
    { text: 'endverbatim', displayText: 'endverbatim - End verbatim block' },
    { text: 'endwith', displayText: 'endwith - End with block' },
    // Additional keywords
    { text: 'else', displayText: 'else - Alternative for if' },
    { text: 'elseif', displayText: 'elseif - Additional condition' },
    { text: 'in', displayText: 'in - Used in for loops' },
    { text: 'as', displayText: 'as - Used in for loops' },
    { text: 'only', displayText: 'only - Include without context' },
    { text: 'ignore missing', displayText: 'ignore missing - Skip missing files' }
];

// Complete Twig functions based on documentation
const twigFunctions = [
    { text: 'attribute', displayText: 'attribute(object, method) - Access dynamic attributes' },
    { text: 'block', displayText: 'block(name) - Render a block' },
    { text: 'constant', displayText: 'constant(name) - Get a constant value' },
    { text: 'cycle', displayText: 'cycle(array, position) - Cycle through values' },
    { text: 'date', displayText: 'date(date, timezone) - Create a date' },
    { text: 'dump', displayText: 'dump(var) - Debug a variable' },
    { text: 'html_classes', displayText: 'html_classes(class1, class2) - Generate HTML classes' },
    { text: 'include', displayText: 'include(template, variables) - Include a template' },
    { text: 'line', displayText: 'line(number) - Get current line number' },
    { text: 'max', displayText: 'max(values) - Get maximum value' },
    { text: 'min', displayText: 'min(values) - Get minimum value' },
    { text: 'parent', displayText: 'parent() - Render parent block' },
    { text: 'random', displayText: 'random(values) - Get random value' },
    { text: 'range', displayText: 'range(low, high, step) - Create a range' },
    { text: 'source', displayText: 'source(name) - Get template source' },
    { text: 'template_from_string', displayText: 'template_from_string(template) - Create template' },
    { text: 'country_select', displayText: 'country_select(countries) - Generate country selector' },
    { text: 'country_timezones', displayText: 'country_timezones(country) - Get country timezones' },
    { text: 'format_args_as_text', displayText: 'format_args_as_text(args) - Format arguments' },
    { text: 'get_debug_type', displayText: 'get_debug_type(value) - Get debug type of value' },
    { text: 'profiler_dump', displayText: 'profiler_dump(value) - Dump for profiler' },
    { text: 'language_names', displayText: 'language_names() - Get available languages' },
    { text: 'locale_names', displayText: 'locale_names() - Get available locales' },
    { text: 'script_names', displayText: 'script_names() - Get available scripts' },
    { text: 'timezone_names', displayText: 'timezone_names() - Get available timezones' },
    // Array-specific functions
    { text: 'array_keys', displayText: 'array_keys(array) - Get all keys of an array' },
    { text: 'array_merge', displayText: 'array_merge(array1, array2) - Merge two arrays' },
    { text: 'array_slice', displayText: 'array_slice(array, start, length) - Extract part of array' },
    { text: 'array_filter', displayText: 'array_filter(array, callback) - Filter array elements' },
    { text: 'array_map', displayText: 'array_map(callback, array) - Apply callback to array' },
    { text: 'array_reduce', displayText: 'array_reduce(array, callback) - Reduce array to value' },
    // Form functions
    { text: 'form_widget', displayText: 'form_widget(form) - Render entire form' },
    { text: 'form_errors', displayText: 'form_errors(form) - Render form errors' },
    { text: 'form_label', displayText: 'form_label(form) - Render form label' },
    { text: 'form_row', displayText: 'form_row(form) - Render form row' },
    { text: 'form_rest', displayText: 'form_rest(form) - Render remaining form' },
    { text: 'form_start', displayText: 'form_start(form) - Begin form tag' },
    { text: 'form_end', displayText: 'form_end(form) - End form tag' },
    { text: 'csrf_token', displayText: 'csrf_token(intention) - Get CSRF token' }
];

// Complete Twig filters based on documentation
const twigFilters = [
    { text: 'abs', displayText: 'abs - Absolute value' },
    { text: 'batch', displayText: 'batch - Split into batches' },
    { text: 'capitalize', displayText: 'capitalize - Capitalize first letter' },
    { text: 'column', displayText: 'column - Extract array column' },
    { text: 'convert_encoding', displayText: 'convert_encoding - Convert encoding' },
    { text: 'country_name', displayText: 'country_name - Convert country code to name' },
    { text: 'currency_name', displayText: 'currency_name - Convert currency code to name' },
    { text: 'currency_symbol', displayText: 'currency_symbol - Get currency symbol' },
    { text: 'data_uri', displayText: 'data_uri - Create data URI' },
    { text: 'date', displayText: 'date - Format date' },
    { text: 'date_modify', displayText: 'date_modify - Modify date' },
    { text: 'default', displayText: 'default - Default value if empty' },
    { text: 'escape', displayText: 'escape (e) - HTML escape' },
    { text: 'filter', displayText: 'filter - Filter array elements' },
    { text: 'first', displayText: 'first - Get first item' },
    { text: 'format', displayText: 'format - Format string with placeholders' },
    { text: 'format_currency', displayText: 'format_currency - Format currency value' },
    { text: 'format_date', displayText: 'format_date - Format date with locale' },
    { text: 'format_datetime', displayText: 'format_datetime - Format date and time' },
    { text: 'format_number', displayText: 'format_number - Format number with locale' },
    { text: 'format_time', displayText: 'format_time - Format time with locale' },
    { text: 'html_to_markdown', displayText: 'html_to_markdown - Convert HTML to markdown' },
    { text: 'humanize', displayText: 'humanize - Humanize text (under_score to Under Score)' },
    { text: 'inky_to_html', displayText: 'inky_to_html - Convert Inky to HTML' },
    { text: 'inline_css', displayText: 'inline_css - Inline CSS styles' },
    { text: 'join', displayText: 'join - Join array items to string' },
    { text: 'json_encode', displayText: 'json_encode - Encode to JSON' },
    { text: 'keys', displayText: 'keys - Get array keys' },
    { text: 'language_name', displayText: 'language_name - Convert language code to name' },
    { text: 'last', displayText: 'last - Get last item' },
    { text: 'length', displayText: 'length - Get length of string or array' },
    { text: 'locale_name', displayText: 'locale_name - Convert locale code to name' },
    { text: 'lower', displayText: 'lower - Convert to lowercase' },
    { text: 'map', displayText: 'map - Apply function to array' },
    { text: 'markdown', displayText: 'markdown - Convert markdown to HTML' },
    { text: 'markdown_to_html', displayText: 'markdown_to_html - Convert markdown to HTML' },
    { text: 'merge', displayText: 'merge - Merge arrays or add to array' },
    { text: 'nl2br', displayText: 'nl2br - Convert newlines to <br>' },
    { text: 'number_format', displayText: 'number_format - Format number' },
    { text: 'raw', displayText: 'raw - Mark value as safe (no escaping)' },
    { text: 'reduce', displayText: 'reduce - Reduce array to single value' },
    { text: 'replace', displayText: 'replace - Replace text' },
    { text: 'reverse', displayText: 'reverse - Reverse string or array' },
    { text: 'round', displayText: 'round - Round number' },
    { text: 'slice', displayText: 'slice - Extract slice of array or string' },
    { text: 'slug', displayText: 'slug - Convert to URL slug' },
    { text: 'sort', displayText: 'sort - Sort array' },
    { text: 'spaceless', displayText: 'spaceless - Remove whitespace between HTML' },
    { text: 'split', displayText: 'split - Split string into array' },
    { text: 'striptags', displayText: 'striptags - Strip HTML tags' },
    { text: 'timezone_name', displayText: 'timezone_name - Convert timezone to name' },
    { text: 'title', displayText: 'title - Title case' },
    { text: 'trim', displayText: 'trim - Trim whitespace' },
    { text: 'u', displayText: 'u - Create Symfony UnicodeString' },
    { text: 'upper', displayText: 'upper - Convert to uppercase' },
    { text: 'url_encode', displayText: 'url_encode - Encode URL' },
    { text: 'yaml_dump', displayText: 'yaml_dump - Convert to YAML' },
    { text: 'yaml_encode', displayText: 'yaml_encode - Encode as YAML' }
];

// Twig tests from documentation
const twigTests = [
    { text: 'constant', displayText: 'constant - Is a constant' },
    { text: 'date', displayText: 'date - Is a valid date' },
    { text: 'defined', displayText: 'defined - Is variable defined' },
    { text: 'divisible by', displayText: 'divisible by - Is divisible by a number' },
    { text: 'empty', displayText: 'empty - Is empty' },
    { text: 'even', displayText: 'even - Is even number' },
    { text: 'iterable', displayText: 'iterable - Can be looped' },
    { text: 'null', displayText: 'null - Is null' },
    { text: 'odd', displayText: 'odd - Is odd number' },
    { text: 'same as', displayText: 'same as - Is the same as' },
    { text: 'none', displayText: 'none - Is null' },
    { text: 'starts with', displayText: 'starts with - String starts with' },
    { text: 'ends with', displayText: 'ends with - String ends with' },
    { text: 'in', displayText: 'in - Value is in array' },
    { text: 'json', displayText: 'json - Is valid JSON' }
];

// Helper to convert snippet templates with placeholders to usable text
function processTemplate(template, cm) {
    // Simple template expansion - replace placeholders with cursor positions or empty string
    let processed = template;
    let cursorPos = null;
    
    processed = processed.replace(/\${(\d+):(.*?)}/g, (match, order, placeholder) => {
        if (order === "1") {
            // First placeholder becomes cursor position
            cursorPos = placeholder;
        }
        return placeholder;
    });
    
    return {
        text: processed,
        cursorPos: cursorPos
    };
}