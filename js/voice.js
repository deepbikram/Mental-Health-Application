// This file handles speech recognition and text-to-speech functionality

document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voiceBtn');
    const messageInput = document.getElementById('messageInput');
    const aiResponse = document.getElementById('aiResponse');

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert('Your browser does not support speech recognition. Please use a supported browser.');
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        console.log('Transcript:', transcript);
        messageInput.value = transcript;
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
        if (messageInput.value.trim()) {
            if (window.sendMessage && typeof window.sendMessage === 'function') {
                window.sendMessage();
            }
        }
    };

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        console.log('Speech recognition started');
        voiceBtn.classList.add('recording');
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
        
        speechSynthesis.speak(utterance);
    }

    // Expose speakText globally so it can be called from other files
    window.speakText = speakText;
});