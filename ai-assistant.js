class AIAssistant {
    constructor(editor) {
        this.editor = editor;
        this.messages = [];
        this.currentModel = 'chatgpt';
        
        // Initialize Twig documentation data
        this.twigDocs = {
            tags: [
                'apply', 'autoescape', 'block', 'cache', 'deprecated', 'do', 'embed',
                'extends', 'guard', 'flush', 'for', 'from', 'if', 'import', 'include',
                'macro', 'sandbox', 'set', 'use', 'verbatim', 'with'
            ],
            filters: [
                'abs', 'batch', 'capitalize', 'column', 'convert_encoding', 'country_name',
                'currency_name', 'currency_symbol', 'data_uri', 'date', 'date_modify',
                'default', 'escape', 'filter', 'first', 'format', 'format_currency',
                'format_date', 'format_datetime', 'format_number', 'format_time',
                'html_to_markdown', 'inline_css', 'join', 'json_encode', 'keys',
                'language_name', 'last', 'length', 'locale_name', 'lower', 'map',
                'markdown_to_html', 'merge', 'nl2br', 'number_format', 'raw', 'reduce',
                'replace', 'reverse', 'round', 'slice', 'slug', 'sort', 'spaceless',
                'split', 'striptags', 'title', 'trim', 'u', 'upper', 'url_encode'
            ],
            functions: [
                'attribute', 'block', 'constant', 'cycle', 'date', 'dump', 'include',
                'max', 'min', 'parent', 'random', 'range', 'source',
                'template_from_string', 'country_timezones', 'html_classes'
            ]
        };

        // Initialize UI elements
        this.initializeUI();
    }
    
    initializeUI() {
        this.aiPrompt = document.getElementById('aiPrompt');
        this.aiMessages = document.getElementById('aiMessages');
        this.sendButton = document.getElementById('sendToAi');
        this.modelSelect = document.getElementById('aiModel');
        this.clearButton = document.getElementById('clearAiChat');
        
        // Bind events
        this.sendButton.addEventListener('click', () => this.sendPrompt());
        this.modelSelect.addEventListener('change', (e) => this.currentModel = e.target.value);
        this.clearButton.addEventListener('click', () => this.clearChat());
        this.aiPrompt.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                this.sendPrompt();
            }
        });
    }
    
    async sendPrompt() {
        const prompt = this.aiPrompt.value.trim();
        if (!prompt) return;
        
        // Add user message to chat
        this.addMessage('user', prompt);
        this.aiPrompt.value = '';
        
        try {
            // Show loading state
            this.sendButton.disabled = true;
            this.sendButton.textContent = 'Sending...';
            
            // Get AI response
            const response = await this.getAIResponse(prompt);
            
            // Add AI response to chat
            this.addMessage('assistant', response);
            
        } catch (error) {
            this.addMessage('assistant', 'Error: ' + error.message);
        } finally {
            this.sendButton.disabled = false;
            this.sendButton.textContent = 'Send';
        }
    }
    
    async getAIResponse(prompt) {
        // This is where you'd implement the actual API calls to the AI models
        // For now, we'll simulate a response
        const twigContext = "You are a Twig template expert. Provide only the Twig code snippet without explanation unless asked specifically for explanation. Format code with proper indentation.";
        const fullPrompt = `${twigContext}\n\nUser: ${prompt}\n\nAssistant:`;
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Example response - replace this with actual API calls
        return this.generateTwigExample(prompt);
    }
    
    generateTwigExample(prompt) {
        const promptLower = prompt.toLowerCase();
        
        // First, check if the prompt is asking about specific Twig elements
        const tagMatch = this.twigDocs.tags.find(tag => promptLower.includes(tag));
        const filterMatch = this.twigDocs.filters.find(filter => promptLower.includes(filter));
        const functionMatch = this.twigDocs.functions.find(func => promptLower.includes(func));

        // Generate appropriate example based on the match
        if (tagMatch) {
            return this.generateTagExample(tagMatch, promptLower);
        } else if (filterMatch) {
            return this.generateFilterExample(filterMatch, promptLower);
        } else if (functionMatch) {
            return this.generateFunctionExample(functionMatch, promptLower);
        }

        // If no specific match, use existing templates or generate custom examples
        return this.generateCustomExample(promptLower);
    }
    
    generateTagExample(tag, prompt) {
        const templates = {
            'if': `{% if condition %}
    <div class="content">{{ content }}</div>
{% elseif other_condition %}
    <div class="alternative">{{ alternative }}</div>
{% else %}
    <div class="empty-state">No content available</div>
{% endif %}`,

            'for': `{% for item in items %}
    <div class="item" id="item-{{ loop.index }}">
        {{ item.name }}
        {% if loop.first %}(First item){% endif %}
        {% if loop.last %}(Last item){% endif %}
    </div>
{% else %}
    <div class="empty">No items found</div>
{% endfor %}`,

            'set': `{% set variables = {
    title: 'Page Title',
    items: ['item1', 'item2'],
    config: {
        theme: 'dark',
        layout: 'default'
    }
} %}`,

            'block': `{% block content %}
    <section class="content">
        {{ content|raw }}
        {% block nested %}
            Nested content
        {% endblock %}
    </section>
{% endblock %}`,

            'embed': `{% embed "layout.twig" with {'title': 'Page Title'} %}
    {% block content %}
        Custom content
    {% endblock %}
    
    {% block sidebar %}
        {{ parent() }}
        Additional sidebar content
    {% endblock %}
{% endembed %}`,

            'include': `{% include 'header.twig' with {
    title: page_title,
    navigation: nav_items
} only %}`,

            'macro': `{% macro input(name, value, type = 'text', options = {}) %}
    <input 
        type="{{ type }}"
        name="{{ name }}"
        value="{{ value }}"
        {% for key, value in options %}
            {{ key }}="{{ value }}"
        {% endfor %}
    >
{% endmacro %}`
        };

        return templates[tag] || this.generateGenericTagExample(tag);
    }
    
    generateFilterExample(filter, prompt) {
        const examples = {
            'upper': `{{ title|upper }}`,
            'lower': `{{ description|lower }}`,
            'date': `{{ created_at|date('Y-m-d H:i:s') }}`,
            'length': `{% if items|length > 0 %}
    Items found: {{ items|length }}
{% endif %}`,
            'default': `{{ user.name|default('Anonymous') }}`,
            'json_encode': `<script>
    const data = {{ items|json_encode|raw }};
</script>`,
            'raw': `{{ content|raw }}`,
            'escape': `{{ user_input|escape }}`,
            'format_currency': `{{ price|format_currency('USD', {rounding_mode: 'floor'}) }}`
        };

        return examples[filter] || `{{ variable|${filter} }}`;
    }
    
    generateFunctionExample(func, prompt) {
        const examples = {
            'date': `{{ date('now')|date('Y-m-d') }}`,
            'random': `{{ random(['apple', 'banana', 'orange']) }}`,
            'range': `{% for i in range(0, 10, 2) %}
    {{ i }}
{% endfor %}`,
            'dump': `{{ dump(user) }}`,
            'include': `{{ include('template.html.twig', {foo: 'bar'}) }}`,
            'max': `{{ max([1, 2, 3]) }}`,
            'min': `{{ min([1, 2, 3]) }}`
        };

        return examples[func] || `{{ ${func}() }}`;
    }
    
    generateCustomExample(prompt) {
        // Handle complex examples
        if (prompt.includes('navigation') || prompt.includes('menu')) {
            return this.generateNavigationExample();
        }
        if (prompt.includes('form')) {
            return this.generateFormExample();
        }
        if (prompt.includes('product') || prompt.includes('list')) {
            return this.generateProductListExample();
        }
        
        // Default response with available options
        return `Please ask about:
- Twig tags: ${this.twigDocs.tags.join(', ')}
- Filters: ${this.twigDocs.filters.join(', ')}
- Functions: ${this.twigDocs.functions.join(', ')}
- Or common patterns (navigation, forms, product lists)`;
    }
    
    // Add helper methods for complex examples
    generateNavigationExample() {
        return `{% set navigation = {
    main: [
        {title: 'Home', url: '/', active: true},
        {title: 'Products', url: '/products'},
        {title: 'About', url: '/about'}
    ],
    footer: [
        {title: 'Privacy', url: '/privacy'},
        {title: 'Terms', url: '/terms'}
    ]
} %}

<nav class="main-nav">
    {% for item in navigation.main %}
        <a href="{{ item.url }}" 
           class="nav-item {% if item.active %}active{% endif %}">
            {{ item.title }}
        </a>
    {% endfor %}
</nav>`;
    }
    
    generateFormExample() {
        return `{% form_theme form 'bootstrap_5_layout.html.twig' %}

<form method="post" class="form">
    {{ form_start(form) }}
        {{ form_row(form.email, {
            label: 'Email Address',
            attr: {
                placeholder: 'Enter your email'
            }
        }) }}
        
        {{ form_row(form.password, {
            label: 'Password',
            help: 'Must be at least 8 characters'
        }) }}
        
        <button type="submit" class="btn btn-primary">
            {{ button_text|default('Submit') }}
        </button>
    {{ form_end(form) }}
</form>`;
    }
    
    generateProductListExample() {
        return `{% if products %}
    <div class="product-grid">
        {% for product in products %}
            <div class="product-card">
                {% if product.image %}
                    <img src="{{ product.image }}" alt="{{ product.name }}">
                {% endif %}
                
                <div class="product-info">
                    <h3>{{ product.name }}</h3>
                    <p class="price">{{ product.price|currency }}</p>
                    
                    {% if product.description %}
                        <p class="description">{{ product.description|truncate(100) }}</p>
                    {% endif %}
                    
                    {% if product.inStock %}
                        <button class="buy-button">Add to Cart</button>
                    {% else %}
                        <span class="out-of-stock">Out of Stock</span>
                    {% endif %}
                </div>
            </div>
        {% else %}
            <div class="empty-state">
                <p>No products available</p>
            </div>
        {% endfor %}
    </div>
{% endif %}`;
    }
    
    addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${role}`;
        
        if (role === 'assistant' && content.includes('{%')) {
            // Format code response
            const codeBlock = document.createElement('pre');
            codeBlock.textContent = content;
            
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'Copy & Insert';
            copyButton.onclick = () => this.insertCodeToEditor(content);
            
            messageDiv.appendChild(copyButton);
            messageDiv.appendChild(codeBlock);
        } else {
            messageDiv.textContent = content;
        }
        
        this.aiMessages.appendChild(messageDiv);
        this.aiMessages.scrollTop = this.aiMessages.scrollHeight;
        this.messages.push({ role, content });
    }
    
    insertCodeToEditor(code) {
        const cursor = this.editor.getCursor();
        const line = this.editor.getLine(cursor.line);
        const indent = line.match(/^\s*/)[0];
        
        // Format code with proper indentation
        const formattedCode = code
            .split('\n')
            .map((line, index) => index === 0 ? line : indent + line)
            .join('\n');
        
        this.editor.replaceRange(formattedCode, cursor);
    }
    
    clearChat() {
        this.aiMessages.innerHTML = '';
        this.messages = [];
    }
} 