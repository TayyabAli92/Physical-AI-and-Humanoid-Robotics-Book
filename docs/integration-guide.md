# RAG Chatbot Integration Guide

## Overview
This guide explains how to integrate the RAG Chatbot widget into your Docusaurus or other web-based book site.

## Quick Integration

### Method 1: Script Tag (Recommended)
Add the following script tag to your HTML pages, preferably before the closing `</body>` tag:

```html
<script src="path/to/chatbot-widget.js"></script>
```

Make sure to update the API URL if your backend is hosted elsewhere:
```html
<script>
  window.RAG_CHATBOT_API_URL = 'https://your-backend-url.com/api/v1';
</script>
<script src="path/to/chatbot-widget.js"></script>
```

### Method 2: Module Import
If using a module system:
```javascript
import 'path/to/chatbot-widget.js';
// The widget will initialize automatically
```

## Configuration

### API Endpoint
By default, the widget connects to `http://localhost:8000/api/v1`. To change this, set the global variable before loading the script:

```html
<script>
  window.RAG_CHATBOT_API_URL = 'https://your-actual-backend.com/api/v1';
</script>
```

### Customization
The widget supports basic customization through CSS variables. You can override the default theme by adding custom CSS:

```css
:root {
  --primary-color: #your-color;
  --text-color: #your-text-color;
  --bg-color: #your-bg-color;
}
```

## Features

### Highlight-to-Answer
Users can select/highlight text on the page and ask questions about it. The widget will send the highlighted text as additional context to the backend.

### Dark/Light Theme
The widget automatically adapts to the site's theme if your site uses the `data-theme` attribute:
- Light theme: `data-theme="light"`
- Dark theme: `data-theme="dark"`

## API Endpoints Used

The widget communicates with these backend endpoints:
- `POST /api/v1/ask-agent` - Main Q&A functionality
- `POST /api/v1/embed` - Embedding generation (if needed)
- `POST /api/v1/search` - Content search (if needed)
- `GET /api/v1/health` - Health checks

## Troubleshooting

### Widget Not Appearing
- Ensure the script is loaded
- Check browser console for errors
- Verify the API endpoint is accessible

### API Connection Issues
- Verify your backend is running
- Check CORS settings on your backend
- Ensure the API URL is correctly configured

### Highlight Feature Not Working
- Make sure users are properly selecting text
- Check that the selection event is not being intercepted by other scripts

## Security Considerations

- Ensure proper CORS configuration for production
- Use HTTPS for API connections in production
- Implement proper authentication if required for your use case