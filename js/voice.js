// This file handles speech recognition functionality

document.addEventListener('DOMContentLoaded', () => {
    const voiceBtn = document.getElementById('voiceBtn');
    const messageInput = document.getElementById('messageInput');

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
    };

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        console.log('Speech recognition started');
        voiceBtn.classList.add('recording');
    });
});