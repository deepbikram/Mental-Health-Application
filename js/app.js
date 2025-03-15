// This file handles application initialization and event binding

document.addEventListener('DOMContentLoaded', () => {
    console.log('App initializing...');
    
    // Add welcome message
    if (window.addMessage && typeof window.addMessage === 'function') {
        window.addMessage("Hello, I'm here for you. What would you like to talk about today?", false);
    }

    // DOM elements
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    
    let socket;
    
    // Connect to WebSocket on page load
    if (window.connectWebSocket && typeof window.connectWebSocket === 'function') {
        window.connectWebSocket();
    }
    
    // Event listeners
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (window.sendMessage && typeof window.sendMessage === 'function') {
                window.sendMessage();
            }
        });
    }
    
    if (messageInput) {
        // Auto-resize the textarea as user types
        messageInput.addEventListener('input', () => {
            messageInput.style.height = 'auto';
            messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
        });
        
        // Send message on Enter (but allow Shift+Enter for new lines)
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (window.sendMessage && typeof window.sendMessage === 'function') {
                    window.sendMessage();
                }
            }
        });
    }
    
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            const chatMessages = document.getElementById('chatMessages');
            if (chatMessages) {
                // Clear the chat
                chatMessages.innerHTML = '';
                
                // Add welcome message
                if (window.addMessage && typeof window.addMessage === 'function') {
                    window.addMessage("Hello, I'm here for you. What would you like to talk about today?", false);
                }
            }
        });
    }
    
    console.log('App initialized');
});