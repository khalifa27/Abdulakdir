// Chat Functionality

let chatHistory = [];

// Initialize chat page
document.addEventListener('DOMContentLoaded', () => {
  // Listen for auth state changes
  onAuthStateChange((user) => {
    const authRequired = document.getElementById('auth-required');
    const chatContainer = document.getElementById('chat-container');

    if (user) {
      authRequired.style.display = 'none';
      chatContainer.style.display = 'flex';
    } else {
      authRequired.style.display = 'block';
      chatContainer.style.display = 'none';
    }
  });

  // Set up chat form
  const chatForm = document.getElementById('chat-form');
  chatForm.addEventListener('submit', handleChatSubmit);
});

// Check if we're running locally (no API available)
const isLocalMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Mock responses for local testing
const mockResponses = [
  "Hi! I'm the AI assistant for Abdulkadir Khalifa Mustapha. He's a Prompt Engineer and Software Engineer based in the UK, specializing in Healthcare AI, Productivity AI, and Media AI products.",
  "Abdulkadir works at the intersection of AI engineering and product development, crafting intelligent systems that solve real problems.",
  "His Healthcare AI work focuses on building AI-powered tools to improve healthcare workflows and patient outcomes.",
  "In Productivity AI, he creates intelligent systems that help teams work smarter and faster.",
  "For Media AI, he develops AI solutions for content creation and media production.",
  "Feel free to reach out via LinkedIn to discuss collaborations or opportunities!"
];

// Handle chat form submission
async function handleChatSubmit(e) {
  e.preventDefault();

  const input = document.getElementById('chat-input');
  const sendButton = document.getElementById('send-button');
  const message = input.value.trim();

  if (!message) return;

  // Disable input while processing
  input.disabled = true;
  sendButton.disabled = true;
  sendButton.textContent = '...';

  // Add user message to UI
  addMessage(message, 'user');
  input.value = '';

  // Local mode: use mock responses
  if (isLocalMode) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
    const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
    addMessage(randomResponse, 'ai');

    // Re-enable input
    input.disabled = false;
    sendButton.disabled = false;
    sendButton.textContent = 'Send';
    input.focus();
    return;
  }

  try {
    // Send message to API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: message,
        history: chatHistory
      })
    });

    const data = await response.json();

    if (data.success) {
      // Add AI response to UI
      addMessage(data.message, 'ai');

      // Update chat history
      chatHistory.push({ role: 'user', content: message });
      chatHistory.push({ role: 'assistant', content: data.message });

      // Keep history manageable (last 10 exchanges)
      if (chatHistory.length > 20) {
        chatHistory = chatHistory.slice(-20);
      }
    } else {
      addMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
  } catch (error) {
    console.error('Chat error:', error);
    addMessage('Sorry, I couldn\'t connect to the server. Please try again.', 'ai');
  }

  // Re-enable input
  input.disabled = false;
  sendButton.disabled = false;
  sendButton.textContent = 'Send';
  input.focus();
}

// Add message to chat UI
function addMessage(content, type) {
  const messagesContainer = document.getElementById('chat-messages');

  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${type}-message`;

  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = content;

  messageDiv.appendChild(contentDiv);
  messagesContainer.appendChild(messageDiv);

  // Scroll to bottom
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
