import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';
import useIsBrowser from '@docusaurus/useIsBrowser';

interface RootProps {
  children: React.ReactNode;
}

// Define the Root component type for Docusaurus v3
const Root: React.FC<RootProps> = ({ children }) => {
  const isBrowser = useIsBrowser();
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); // Used to force iframe reload
  const [selectedText, setSelectedText] = useState<string>('');
  const themeConfig = useThemeConfig();
  const agentButtonRef = useRef<HTMLButtonElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleAgent = () => {
    if (isAgentOpen) {
      setIsAgentOpen(false);
      // Reset iframe to prevent issues when reopening
      setIframeKey(prev => prev + 1);
      // Return focus to the button after closing
      setTimeout(() => agentButtonRef.current?.focus(), 0);
    } else {
      setIsAgentOpen(true);
    }
  };

  const closeAgent = () => {
    setIsAgentOpen(false);
    setIframeKey(prev => prev + 1); // Force iframe reload on close
    // Return focus to the button after closing
    setTimeout(() => agentButtonRef.current?.focus(), 0);
  };

  // Function to send selected text to the agent iframe
  const sendSelectedTextToAgent = useCallback((text: string) => {
    if (text && text.length > 3) { // Only send if text is substantial
      setSelectedText(text);
      if (!isAgentOpen) {
        // Open the agent if it's not already open
        setIsAgentOpen(true);
      }

      // Send the selected text to the iframe once it's loaded
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          try {
            iframeRef.current.contentWindow.postMessage({
              type: 'SELECTED_TEXT',
              text: text
            }, '*');
          } catch (error) {
            console.error('Error sending message to iframe:', error);
          }
        }
      }, 300); // Wait a bit for iframe to potentially load
    }
  }, [isAgentOpen]);

  // Handle text selection
  const handleTextSelection = useCallback(() => {
    // Use setTimeout to ensure selection is complete
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const selection = window.getSelection();
        if (selection) {
          const selectedText = selection.toString().trim();

          // Only process if text is substantial and not just whitespace
          if (selectedText && selectedText.length > 3 && !/^\s+$/.test(selectedText)) {
            sendSelectedTextToAgent(selectedText);
          }
        }
      }
    }, 0);
  }, [sendSelectedTextToAgent]);

  // Add event listeners for text selection
  useEffect(() => {
    if (isBrowser) {
      // Add event listeners for text selection
      document.addEventListener('mouseup', handleTextSelection);
      document.addEventListener('touchend', handleTextSelection);

      // Also handle keyboard selections (like Shift+Arrow keys)
      document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
          handleTextSelection();
        }
      });

      // Listen for messages from the iframe
      const handleMessage = (event: MessageEvent) => {
        if (event.data && event.data.type === 'READY') {
          // If we have selected text waiting to be sent, send it now
          if (selectedText) {
            setTimeout(() => {
              if (iframeRef.current && iframeRef.current.contentWindow) {
                try {
                  iframeRef.current.contentWindow.postMessage({
                    type: 'SELECTED_TEXT',
                    text: selectedText
                  }, '*');
                  setSelectedText(''); // Clear the selected text after sending
                } catch (error) {
                  console.error('Error sending message to iframe:', error);
                }
              }
            }, 100);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup function
      return () => {
        document.removeEventListener('mouseup', handleTextSelection);
        document.removeEventListener('touchend', handleTextSelection);
        document.removeEventListener('keyup', (e) => {
          if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Meta') {
            handleTextSelection();
          }
        });
        window.removeEventListener('message', handleMessage);
      };
    }
  }, [isBrowser, handleTextSelection, selectedText]);

  // Handle Escape key to close agent
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAgentOpen) {
        closeAgent();
      }
    };

    if (isAgentOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll when agent is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isAgentOpen]);

  return (
    <>
      {children}

      {/* Floating AI Agent Button */}
      {isBrowser && (
        <button
          ref={agentButtonRef}
          onClick={toggleAgent}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            zIndex: 10000,
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#25c2a0',
            color: 'white',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.2s ease',
            outline: isAgentOpen ? '2px solid #25c2a0' : 'none',
          }}
          aria-label={isAgentOpen ? "Close AI Agent" : "Open AI Agent"}
          aria-expanded={isAgentOpen}
        >
          {isAgentOpen ? '×' : '🤖'}
        </button>
      )}

      {/* AI Agent Popup */}
      {isBrowser && isAgentOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(2px)',
          }}
          onClick={closeAgent}
          role="dialog"
          aria-modal="true"
          aria-labelledby="ai-agent-title"
        >
          <div
            style={{
              width: '90%',
              height: '80%',
              maxWidth: '800px',
              maxHeight: '700px',
              backgroundColor: 'white',
              borderRadius: '12px',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
              display: 'flex',
              flexDirection: 'column',
            }}
            onClick={(e) => e.stopPropagation()} // Prevent click from closing the popup
          >
            {/* Header */}
            <div
              id="ai-agent-title"
              style={{
                backgroundColor: '#25c2a0',
                color: 'white',
                padding: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
              tabIndex={-1} // Make it focusable for a11y
            >
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>AI Assistant</h3>
              <button
                onClick={closeAgent}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  fontSize: '24px',
                  cursor: 'pointer',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  transition: 'background-color 0.2s',
                }}
                onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                aria-label="Close AI Agent"
              >
                ×
              </button>
            </div>

            {/* Iframe Container */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <iframe
                ref={iframeRef}
                key={iframeKey} // Force reload when key changes
                src="/chat.html" // Points to the chat interface in the static directory
                title="AI Assistant"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                }}
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-top-navigation-by-user-activation"
                loading="eager" // Changed to eager for better initial load
                allow="microphone"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Root;