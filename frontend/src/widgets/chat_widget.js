/**
 * ChatKit Widget for RAG Chatbot Integration
 * Implements the floating chatbot button and widget functionality
 */

class ChatWidget {
  constructor(agentId) {
    this.agentId = agentId;
    this.isOpen = false;
    this.apiUrl = "https://fast-api-backend-alpha.vercel.app/";
    this.initializeWidget();
  }

  initializeWidget() {
    // Create the floating chat button
    this.createFloatingButton();

    // Create the chat widget container (hidden by default)
    this.createChatContainer();
  }

  createFloatingButton() {
    const button = document.createElement('div');
    button.id = 'chatbot-button';
    button.setAttribute('aria-label', 'Open chatbot');
    button.setAttribute('role', 'button');
    button.tabIndex = 0;

    button.innerHTML = `
      <div style="
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 60px;
        height: 60px;
        background-color: #4f46e5;
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        z-index: 10000;
        font-size: 24px;
      ">&#128172;</div>
    `;

    // Add click event
    button.addEventListener('click', () => this.toggleChat());
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        this.toggleChat();
      }
    });

    document.body.appendChild(button);
  }

  createChatContainer() {
    const container = document.createElement('div');
    container.id = 'chatbot-container';

    container.innerHTML = `
      <div id="chatbot-header" style="
        background-color: #4f46e5;
        color: white;
        padding: 15px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <h3 style="margin: 0; font-size: 16px;">AI Assistant</h3>
        <button id="close-chat" style="
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        ">&times;</button>
      </div>
      <div id="chat-messages" style="
        height: 400px;
        overflow-y: auto;
        padding: 15px;
        background-color: #f9fafb;
        border: 1px solid #e5e7eb;
      "></div>
      <div id="chat-input-container" style="
        display: flex;
        padding: 15px;
        border: 1px solid #e5e7eb;
        border-top: none;
      ">
        <input
          type="text"
          id="chat-input"
          placeholder="Ask about the book content..."
          style="
            flex: 1;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            margin-right: 10px;
          "
        >
        <button id="send-message" style="
          background-color: #4f46e5;
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 4px;
          cursor: pointer;
        ">Send</button>
      </div>
    `;

    // Initially hide the container
    container.style.display = 'none';
    container.style.position = 'fixed';
    container.style.bottom = '90px';
    container.style.right = '20px';
    container.style.width = '350px';
    container.style.height = '500px';
    container.style.zIndex = '10000';
    container.style.backgroundColor = 'white';
    container.style.borderRadius = '10px';
    container.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';

    document.body.appendChild(container);

    // Add event listeners
    document.getElementById('close-chat').addEventListener('click', () => this.closeChat());
    document.getElementById('send-message').addEventListener('click', () => this.sendMessage());
    document.getElementById('chat-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.sendMessage();
      }
    });
  }

  toggleChat() {
    const container = document.getElementById('chatbot-container');
    const button = document.getElementById('chatbot-button');

    if (this.isOpen) {
      this.closeChat();
    } else {
      container.style.display = 'block';
      button.style.display = 'none';
      this.isOpen = true;

      // Focus on input when opening
      document.getElementById('chat-input').focus();
    }
  }

  closeChat() {
    const container = document.getElementById('chatbot-container');
    const button = document.getElementById('chatbot-button');

    container.style.display = 'none';
    button.style.display = 'block';
    this.isOpen = false;
  }

  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    this.addMessageToChat('user', message);
    input.value = '';

    try {
      // Show typing indicator
      const typingIndicator = this.addMessageToChat('assistant', '...');

      // Call the backend RAG endpoint
      const response = await fetch(`${this.apiUrl}/rag`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Remove typing indicator and add actual response
      this.removeMessage(typingIndicator);
      this.addMessageToChat('assistant', data.answer);

    } catch (error) {
      console.error('Error sending message:', error);
      this.removeMessage(document.querySelector('.typing-indicator'));
      this.addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
    }
  }

  addMessageToChat(role, content) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');

    messageDiv.className = `message ${role}`;
    messageDiv.style.marginBottom = '15px';
    messageDiv.style.maxWidth = '80%';

    if (role === 'user') {
      messageDiv.style.alignSelf = 'flex-end';
      messageDiv.style.backgroundColor = '#dbeafe';
      messageDiv.style.borderRadius = '10px 0 10px 10px';
      messageDiv.style.padding = '10px';
      messageDiv.style.marginLeft = 'auto';
    } else if (role === 'system') {
      messageDiv.style.alignSelf = 'center';
      messageDiv.style.backgroundColor = '#e0e7ff';
      messageDiv.style.borderRadius = '10px';
      messageDiv.style.padding = '8px 12px';
      messageDiv.style.margin = '10px auto';
      messageDiv.style.fontSize = '12px';
      messageDiv.style.color = '#4f46e5';
      messageDiv.style.textAlign = 'center';
      messageDiv.style.maxWidth = '90%';
    } else {
      messageDiv.style.alignSelf = 'flex-start';
      messageDiv.style.backgroundColor = '#f3f4f6';
      messageDiv.style.borderRadius = '0 10px 10px 10px';
      messageDiv.style.padding = '10px';
    }

    messageDiv.innerHTML = `<div style="font-size: 14px;">${content}</div>`;
    messagesContainer.appendChild(messageDiv);

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    return messageDiv;
  }

  removeMessage(messageElement) {
    if (messageElement && messageElement.parentNode) {
      messageElement.parentNode.removeChild(messageElement);
    }
  }

  // Method to handle selected text functionality
  enableSelectedTextFunctionality() {
    // Listen for the custom text selection event from the text selection service
    document.addEventListener('textSelected', (event) => {
      if (event.detail.selectedText) {
        // Store selected text for potential use
        this.selectedText = event.detail.selectedText;
        console.log('Selected text captured:', this.selectedText);
      }
    });
  }

  // Method to enable selected text mode in the chat widget
  enableSelectedTextMode(selectedText) {
    this.selectedTextMode = true;
    this.currentSelectedText = selectedText || this.selectedText;

    // Update the UI to indicate selected text mode
    const header = document.getElementById('chatbot-header');
    if (header) {
      header.innerHTML = `
        <div style="display: flex; align-items: center;">
          <h3 style="margin: 0; font-size: 16px;">AI Assistant (Selected Text)</h3>
          <span style="margin-left: 10px; font-size: 12px; background-color: #6366f1; color: white; padding: 2px 6px; border-radius: 10px;">Mode</span>
        </div>
        <div style="display: flex; align-items: center;">
          <button id="exit-selected-mode" style="
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            margin-right: 10px;
          ">Exit</button>
          <button id="close-chat" style="
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
          ">&times;</button>
        </div>
      `;

      // Add event listener for exit button
      document.getElementById('exit-selected-mode').addEventListener('click', () => {
        this.exitSelectedTextMode();
      });

      // Re-add close chat event listener
      document.getElementById('close-chat').addEventListener('click', () => this.closeChat());
    }

    // Add a message indicating selected text mode
    this.addMessageToChat('system', `You're in selected text mode. I'll answer questions based only on the selected text: "${this.currentSelectedText.substring(0, 100)}${this.currentSelectedText.length > 100 ? '...' : ''}"`);
  }

  // Method to exit selected text mode
  exitSelectedTextMode() {
    this.selectedTextMode = false;
    this.currentSelectedText = null;

    // Reset the header to normal mode
    const header = document.getElementById('chatbot-header');
    if (header) {
      header.innerHTML = `
        <h3 style="margin: 0; font-size: 16px;">AI Assistant</h3>
        <button id="close-chat" style="
          background: none;
          border: none;
          color: white;
          font-size: 20px;
          cursor: pointer;
        ">&times;</button>
      `;

      // Re-add close chat event listener
      document.getElementById('close-chat').addEventListener('click', () => this.closeChat());
    }

    // Add a message indicating exit from selected text mode
    this.addMessageToChat('system', 'Exited selected text mode. Now using full knowledge base.');
  }

  // Override the sendMessage method to handle selected text mode
  async sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();

    if (!message) return;

    // Add user message to chat
    this.addMessageToChat('user', message);
    input.value = '';

    try {
      // Show typing indicator
      const typingIndicator = this.addMessageToChat('assistant', '...');

      let response;
      if (this.selectedTextMode && this.currentSelectedText) {
        // Use the selected text endpoint
        response = await fetch(`${this.apiUrl}/rag/selected`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: message,
            selected_text: this.currentSelectedText
          })
        });
      } else {
        // Use the regular RAG endpoint
        response = await fetch(`${this.apiUrl}/rag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message })
        });
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Remove typing indicator and add actual response
      this.removeMessage(typingIndicator);
      this.addMessageToChat('assistant', data.answer);

    } catch (error) {
      console.error('Error sending message:', error);
      this.removeMessage(document.querySelector('.typing-indicator'));
      this.addMessageToChat('assistant', 'Sorry, I encountered an error. Please try again.');
    }
  }

  // Initialize the widget
  static init(agentId) {
    const widget = new ChatWidget(agentId);
    widget.enableSelectedTextFunctionality();
    return widget;
  }
}

// Initialize the widget when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Use a default agent ID or get from configuration
  const agentId = window.CHATBOT_AGENT_ID || 'default-agent-id';
  window.chatWidget = ChatWidget.init(agentId);
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChatWidget;
}