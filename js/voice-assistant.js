// This file handles speech recognition and text-to-speech functionality for the voice assistant interface

document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voiceBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const aiResponse = document.getElementById('aiResponse');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use a supported browser.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Set to false to stop recognition when the user pauses
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        console.log('Transcript:', transcript);
        aiResponse.textContent = transcript;
        // Stop any ongoing speech synthesis when the user starts speaking
        speechSynthesis.cancel();
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        voiceBtn.classList.remove('recording');
        alert(`Speech recognition error: ${event.error}`);
    };

    recognition.onend = () => {
        console.log('Speech recognition ended');
        voiceBtn.classList.remove('recording');
        // Automatically send the message after speech recognition ends
        if (aiResponse.textContent.trim()) {
            if (window.sendMessage && typeof window.sendMessage === 'function') {
                window.sendMessage(aiResponse.textContent);
            }
        }
    };

    voiceBtn.addEventListener('click', () => {
        if (voiceBtn.classList.contains('recording')) {
            recognition.stop();
            console.log('Speech recognition stopped');
            voiceBtn.classList.remove('recording');
            voiceBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>';
        } else {
            // Stop any ongoing speech synthesis
            speechSynthesis.cancel();
            recognition.start();
            console.log('Speech recognition started');
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
        }
    });

    cancelBtn.addEventListener('click', () => {
        recognition.stop();
        console.log('Speech recognition stopped');
        voiceBtn.classList.remove('recording');
        // Stop any ongoing speech synthesis
        speechSynthesis.cancel();
        // Navigate back to the chat screen
        window.location.href = 'index.html';
    });

    // Initialize text-to-speech voices
    function initVoices() {
        const voices = speechSynthesis.getVoices();
        // Try to select a male voice for "Dad"
        aiVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('David') || voice.name.includes('James'));
        if (!aiVoice) {
            // Fallback to any voice
            aiVoice = voices[0];
        }
    }

    speechSynthesis.onvoiceschanged = initVoices;
    initVoices();

    // Function to speak text using text-to-speech
    function speakText(text) {
        if (!speechSynthesis) return;
        
        // Stop any ongoing speech
        speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = aiVoice;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
        
        utterance.onend = () => {
            // Restart speech recognition after AI finishes replying
            recognition.start();
            console.log('Speech recognition restarted');
            voiceBtn.classList.add('recording');
            voiceBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
        };
        
        speechSynthesis.speak(utterance);
    }

    // Expose speakText globally so it can be called from other files
    window.speakText = speakText;

    // Function to send message to WebSocket server
    function sendMessage(message) {
        if (window.socket && window.socket.readyState === WebSocket.OPEN) {
            window.socket.send(message);
        } else {
            console.error("WebSocket is not connected!");
            alert("Not connected to server. Please check your connection and try again.");
        }
    }

    // Expose sendMessage globally so it can be called from other files
    window.sendMessage = sendMessage;

    // Establish WebSocket connection if not already connected
    if (!window.socket || window.socket.readyState !== WebSocket.OPEN) {
        window.socket = new WebSocket('ws://localhost:8765');
        
        window.socket.onopen = () => {
            console.log('WebSocket connection established');
        };
        
        window.socket.onmessage = (event) => {
            console.log('Received message:', event.data);
            aiResponse.textContent = event.data;
            // Speak the AI response
            if (window.speakText && typeof window.speakText === 'function') {
                window.speakText(event.data);
            }
        };
        
        window.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
        
        window.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    // Automatically start speech recognition when the page loads
    recognition.start();
    console.log('Speech recognition started automatically');
    voiceBtn.classList.add('recording');
    voiceBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
});