// This file handles chat-related functionality, including sending and receiving messages, displaying messages in the chat interface, and managing the typing indicator.

document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const newChatBtn = document.getElementById('newChatBtn');
    
    let socket;
    let isTyping = false;
    
    // Expose isTyping globally for other modules to use
    window.isTyping = isTyping;

    // Connect to WebSocket server
    function connectWebSocket() {
        socket = new WebSocket('ws://localhost:8765');
        
        socket.onopen = () => {
            console.log('WebSocket connection established');
            sendBtn.disabled = false;
        };
        
        socket.onmessage = (event) => {
            if (isTyping) {
                const typingIndicator = document.querySelector('.typing-indicator');
                if (typingIndicator) {
                    typingIndicator.remove();
                }
                isTyping = false;
            }
            addMessage(event.data, false);
            // Speak the AI response
            if (window.speakText && typeof window.speakText === 'function') {
                window.speakText(event.data);
            }
        };
        
        socket.onclose = () => {
            console.log('WebSocket connection closed');
            sendBtn.disabled = true;
            setTimeout(connectWebSocket, 3000);
        };
        
        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            sendBtn.disabled = true;
        };
    }

    // Function to add messages to chat
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        const formattedText = text.replace(/\n/g, '<br>');
        messageDiv.innerHTML = formattedText;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Make addMessage available globally
    window.addMessage = addMessage;

    // Function to show typing indicator
    function showTypingIndicator() {
        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('span');
            indicatorDiv.appendChild(dot);
        }
        chatMessages.appendChild(indicatorDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        window.isTyping = true;
    }

    // Function to send message
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && socket && socket.readyState === WebSocket.OPEN) {
            addMessage(message, true);
            showTypingIndicator();
            socket.send(message);
            messageInput.value = '';
            messageInput.style.height = 'auto';
        } else if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected!");
            alert("Not connected to server. Please check your connection and try again.");
        }
    }
    
    // Make sendMessage available globally so it can be called
    window.sendMessage = sendMessage;
    window.connectWebSocket = connectWebSocket;

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    newChatBtn.addEventListener('click', () => {
        chatMessages.innerHTML = '';
        addMessage("Hello, I'm here for you. What would you like to talk about today?", false);
    });

    // Auto-resize textarea as user types
    messageInput.addEventListener('input', () => {
        messageInput.style.height = 'auto';
        messageInput.style.height = Math.min(messageInput.scrollHeight, 150) + 'px';
    });

    // Initialize WebSocket connection
    connectWebSocket();
});