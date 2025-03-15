// This file handles WebSocket communication

// Make the connectWebSocket function available globally
window.connectWebSocket = function() {
    const socket = new WebSocket('ws://localhost:8765');
    const sendBtn = document.getElementById('sendBtn');
    
    socket.onopen = () => {
        console.log('WebSocket connection established');
        if (sendBtn) sendBtn.disabled = false;
    };
    
    socket.onmessage = (event) => {
        // Check if typing indicator should be removed
        if (window.isTyping) {
            // Remove typing indicator
            const typingIndicator = document.querySelector('.typing-indicator');
            if (typingIndicator) {
                typingIndicator.remove();
            }
            window.isTyping = false;
        }
        
        // Add AI message
        if (window.addMessage && typeof window.addMessage === 'function') {
            window.addMessage(event.data, false);
        }
    };
    
    socket.onclose = () => {
        console.log('WebSocket connection closed');
        if (sendBtn) sendBtn.disabled = true;
        // Try to reconnect after a delay
        setTimeout(window.connectWebSocket, 3000);
    };
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        if (sendBtn) sendBtn.disabled = true;
    };
    
    return socket;
};

// Initialize WebSocket connection when the module loads
document.addEventListener('DOMContentLoaded', () => {
    window.socket = window.connectWebSocket();
});