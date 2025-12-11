/**
 * Text Selection Service for RAG Chatbot
 * Handles capturing and managing selected text from the book content
 */

class TextSelectionService {
  constructor() {
    this.selectedText = '';
    this.selectionRange = null;
    this.initializeSelectionHandling();
  }

  /**
   * Initialize event listeners for text selection
   */
  initializeSelectionHandling() {
    // Listen for mouseup event to capture text selection
    document.addEventListener('mouseup', (event) => {
      this.handleTextSelection(event);
    });

    // Listen for touchend event for mobile devices
    document.addEventListener('touchend', (event) => {
      this.handleTextSelection(event);
    });
  }

  /**
   * Handle the text selection event
   */
  handleTextSelection(event) {
    const selectedText = this.getSelectedText();

    if (selectedText && selectedText.trim().length > 0) {
      this.selectedText = selectedText.trim();
      this.selectionRange = this.getSelectionRange();

      // Dispatch a custom event so other components can react to text selection
      this.dispatchSelectionEvent();
    } else {
      // Clear selection if no text is selected
      this.clearSelection();
    }
  }

  /**
   * Get the currently selected text
   */
  getSelectedText() {
    if (window.getSelection) {
      return window.getSelection().toString();
    } else if (document.selection && document.selection.type !== 'Control') {
      return document.selection.createRange().text;
    }
    return '';
  }

  /**
   * Get the range of the current selection
   */
  getSelectionRange() {
    if (window.getSelection) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        return selection.getRangeAt(0);
      }
    } else if (document.selection && document.selection.type !== 'Control') {
      return document.selection.createRange();
    }
    return null;
  }

  /**
   * Dispatch a custom event when text is selected
   */
  dispatchSelectionEvent() {
    const selectionEvent = new CustomEvent('textSelected', {
      detail: {
        selectedText: this.selectedText,
        range: this.selectionRange
      }
    });

    document.dispatchEvent(selectionEvent);
  }

  /**
   * Clear the current selection
   */
  clearSelection() {
    this.selectedText = '';
    this.selectionRange = null;
  }

  /**
   * Get the currently selected text
   */
  getCurrentSelection() {
    return this.selectedText;
  }

  /**
   * Create a context menu for selected text (optional enhancement)
   */
  createContextMenu(x, y, selectedText) {
    // Remove any existing context menu
    const existingMenu = document.getElementById('text-selection-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    // Create context menu
    const contextMenu = document.createElement('div');
    contextMenu.id = 'text-selection-context-menu';
    contextMenu.style.position = 'fixed';
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
    contextMenu.style.backgroundColor = '#4f46e5';
    contextMenu.style.color = 'white';
    contextMenu.style.padding = '10px';
    contextMenu.style.borderRadius = '5px';
    contextMenu.style.zIndex = '10001';
    contextMenu.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
    contextMenu.style.cursor = 'pointer';
    contextMenu.style.fontSize = '14px';
    contextMenu.innerHTML = 'Ask Chatbot';

    // Add click event to open chat with selected text
    contextMenu.addEventListener('click', () => {
      if (window.chatWidget) {
        // Store the selected text in the chat widget for potential use
        window.chatWidget.selectedText = selectedText;
        // Open the chat widget
        window.chatWidget.toggleChat();
        // Optionally pre-fill a question or show a special mode
        window.chatWidget.enableSelectedTextMode(selectedText);
      }
      contextMenu.remove();
    });

    // Add context menu to document
    document.body.appendChild(contextMenu);

    // Remove context menu after a delay or on click outside
    setTimeout(() => {
      if (document.getElementById('text-selection-context-menu')) {
        contextMenu.remove();
      }
    }, 5000); // Remove after 5 seconds
  }

  /**
   * Enable context menu on text selection
   */
  enableContextMenu() {
    document.addEventListener('mouseup', (event) => {
      const selectedText = this.getSelectedText();
      if (selectedText && selectedText.trim().length > 0) {
        // Show context menu near the selection
        this.createContextMenu(event.clientX, event.clientY, selectedText);
      }
    });
  }

  /**
   * Get summary information about the selection
   */
  getSelectionSummary() {
    return {
      text: this.selectedText,
      length: this.selectedText.length,
      wordCount: this.selectedText.split(/\s+/).filter(word => word.length > 0).length,
      hasSelection: this.selectedText.length > 0
    };
  }
}

// Initialize the text selection service when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.textSelectionService = new TextSelectionService();

  // Optionally enable context menu
  // window.textSelectionService.enableContextMenu();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TextSelectionService;
}