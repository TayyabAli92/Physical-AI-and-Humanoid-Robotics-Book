(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        API_BASE_URL: window.RAG_CHATBOT_API_URL || 'https://tayyab92-fastapi-chatbot-backend.hf.space/ask-agent',
        CHATBOT_ID: 'rag-chatbot',
        IS_INITIALIZED: false
    };

    // DOM Elements
    let chatbotContainer, chatbotHeader, chatbotMessages, chatbotInput, chatbotSendBtn;
    let chatbotLauncher, chatbotMinimize, chatbotClose, chatbotInputArea;

    // State
    let isOpen = false;
    let isMinimized = false;
    let currentSessionId = null;
    let selectedText = null;

    // Initialize the chatbot widget
    function initialize() {
        if (CONFIG.IS_INITIALIZED) return;

        createChatbotElements();
        bindEvents();
        setupTextSelectionListener();
        CONFIG.IS_INITIALIZED = true;

        console.log('RAG Chatbot widget initialized');
    }

    // Create chatbot elements if they don't exist
    function createChatbotElements() {
        // Check if elements already exist
        if (document.getElementById('chatbot-container')) return;

        // Create launcher button if it doesn't exist
        if (!document.getElementById('chatbot-launcher')) {
            const launcher = document.createElement('button');
            launcher.id = 'chatbot-launcher';
            launcher.className = 'chatbot-launcher';
            launcher.innerHTML = '<span>💬</span>';
            launcher.title = 'Open Book Assistant';
            document.body.appendChild(launcher);
        }

        // Create container if it doesn't exist
        if (!document.getElementById('chatbot-container')) {
            const container = document.createElement('div');
            container.id = 'chatbot-container';
            container.className = 'chatbot-container';
            container.innerHTML = `
                <div id="chatbot-header" class="chatbot-header">
                    <div class="chatbot-title">Book Assistant</div>
                    <div class="chatbot-controls">
                        <button id="chatbot-minimize" class="chatbot-control-btn">−</button>
                        <button id="chatbot-close" class="chatbot-control-btn">×</button>
                    </div>
                </div>
                <div id="chatbot-messages" class="chatbot-messages">
                    <div class="message bot-message">Hello! I'm your book assistant. Ask me anything about this book, or highlight text and ask questions about it.</div>
                </div>
                <div id="chatbot-input-area" class="chatbot-input-area">
                    <textarea id="chatbot-input" class="chatbot-input" placeholder="Ask a question about the book..." rows="1"></textarea>
                    <button id="chatbot-send" class="chatbot-send-btn">Send</button>
                </div>
            `;
            document.body.appendChild(container);
        }

        // Cache DOM elements
        chatbotContainer = document.getElementById('chatbot-container');
        chatbotHeader = document.getElementById('chatbot-header');
        chatbotMessages = document.getElementById('chatbot-messages');
        chatbotInput = document.getElementById('chatbot-input');
        chatbotSendBtn = document.getElementById('chatbot-send');
        chatbotLauncher = document.getElementById('chatbot-launcher');
        chatbotMinimize = document.getElementById('chatbot-minimize');
        chatbotClose = document.getElementById('chatbot-close');
        chatbotInputArea = document.getElementById('chatbot-input-area');
    }

    // Bind event listeners
    function bindEvents() {
        // Launcher button
        chatbotLauncher.addEventListener('click', toggleChatbot);

        // Control buttons
        chatbotClose.addEventListener('click', closeChatbot);
        chatbotMinimize.addEventListener('click', toggleMinimize);

        // Send button
        chatbotSendBtn.addEventListener('click', sendMessage);

        // Enter key in input (with Shift+Enter for new line)
        chatbotInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Auto-resize textarea
        chatbotInput.addEventListener('input', autoResizeTextarea);
    }

    // Set up text selection listener for highlight-to-answer feature
    function setupTextSelectionListener() {
        document.addEventListener('mouseup', function() {
            const selection = window.getSelection();
            if (selection.toString().trim() !== '') {
                selectedText = selection.toString().trim();
                // Optionally show a hint to the user that text has been selected
                console.log('Selected text:', selectedText);
            }
        });
    }

    // Toggle chatbot visibility
    function toggleChatbot() {
        if (isOpen) {
            closeChatbot();
        } else {
            openChatbot();
        }
    }

    // Open chatbot
    function openChatbot() {
        chatbotContainer.classList.add('open');
        chatbotLauncher.style.display = 'none';
        isOpen = true;
        chatbotInput.focus();
    }

    // Close chatbot
    function closeChatbot() {
        chatbotContainer.classList.remove('open');
        chatbotLauncher.style.display = 'flex';
        isOpen = false;
        isMinimized = false;
    }

    // Toggle minimize/maximize
    function toggleMinimize() {
        if (isMinimized) {
            // maximize
            chatbotContainer.style.height = '500px';
            chatbotInputArea.style.display = 'flex';
            isMinimized = false;
        } else {
            // minimize - just show header
            chatbotContainer.style.height = '50px';
            chatbotInputArea.style.display = 'none';
            isMinimized = true;
        }
    }

    // Auto-resize textarea
    function autoResizeTextarea() {
        chatbotInput.style.height = 'auto';
        chatbotInput.style.height = (chatbotInput.scrollHeight > 100 ? 100 : chatbotInput.scrollHeight) + 'px';
    }

    // Add message to chat
    function addMessage(message, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageElement.textContent = message;
        chatbotMessages.appendChild(messageElement);

        // Scroll to bottom
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Show loading indicator
    function showTypingIndicator() {
        const typingElement = document.createElement('div');
        typingElement.id = 'typing-indicator';
        typingElement.className = 'message bot-message';
        typingElement.innerHTML = `
            <div class="loading-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        chatbotMessages.appendChild(typingElement);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Hide loading indicator
    function hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Send message to backend
    async function sendMessage() {
        const message = chatbotInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        chatbotInput.value = '';
        autoResizeTextarea();

        // Show typing indicator
        showTypingIndicator();

        try {
            // Disable send button while processing
            chatbotSendBtn.disabled = true;

            // Prepare request payload
            const payload = {
                query: message,
                chat_session_id: currentSessionId || null,
                highlighted_text: selectedText || null,
                context: {
                    use_highlighted_text: !!selectedText
                }
            };

            // Send request to backend
            const response = await fetch(`${CONFIG.API_BASE_URL}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const data = await response.json();

            // Update session ID if new one was provided
            if (data.chat_session_id && !currentSessionId) {
                currentSessionId = data.chat_session_id;
            }

            // Hide typing indicator and add bot response
            hideTypingIndicator();
            addMessage(data.answer || data.response);

            // Clear selected text after using it
            selectedText = null;
        } catch (error) {
            console.error('Error sending message:', error);
            hideTypingIndicator();
            addMessage('Sorry, I encountered an error processing your request. Please try again.');
        } finally {
            chatbotSendBtn.disabled = false;
        }
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Also initialize on window load in case DOMContentLoaded has already fired
    window.addEventListener('load', initialize);

    // Expose public methods
    window.RAGChatbot = {
        initialize: initialize,
        open: openChatbot,
        close: closeChatbot,
        sendMessage: sendMessage
    };

})();