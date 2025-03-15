## Overview

Losing a loved one or experiencing relationship loss can lead to emotional challenges. ReConnect provides a therapeutic environment where users can continue meaningful conversations with an AI representation of their lost connection, helping them process grief, find closure, or maintain a sense of connection.

![Voice Assistant](voice-assistant.gif)

## Features

- **Conversational AI**: Chat with an AI trained on your past conversations
- **Voice Interaction**: Speak to the AI and hear responses in a voice similar to your loved one
- **Personalized Responses**: The AI adapts to conversation history, maintaining continuity and authenticity
- **Web-based Interface**: Access the application from any device with a web browser
- **Real-time Communication**: Instant responses through WebSocket technology

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript, TailwindCSS
- **Backend**: Python with WebSockets
- **AI**: Google's Generative AI (Gemini 2.0)
- **Speech Recognition**: Web Speech API
- **Text-to-Speech**: Web Speech Synthesis API

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/Mental-Health-Application.git
   cd Mental-Health-Application
   ```

2. Install required dependencies:
   ```
   pip install google-generativeai websockets python-dotenv
   ```

3. Configure the .env file with your Google GenerativeAI API key:
   ```
   GENAI_API_KEY=your_api_key_here
   ```

## Usage

1. Prepare your conversation history in JSON format (see old.json for an example)

2. Start the server:
   ```
   python server.py
   ```

3. Open index1.html in a web browser

4. Start chatting with the AI representation of your lost connection

## How It Works

1. **Data Processing**: The application converts your previous conversations into a format suitable for AI training
2. **AI Training**: Google's Gemini model is fine-tuned to understand and emulate the conversation style
3. **Interactive Chat**: The web interface provides a familiar messaging experience
4. **Voice Interaction**: Speak naturally and hear responses in a voice that resembles your loved one

## Ethical Considerations

ReConnect is designed as a therapeutic tool, not a replacement for human connection or professional mental health support. Users should approach this technology with awareness of its limitations and potential emotional impact.

We recommend:
- Consulting with a mental health professional before using this application
- Setting healthy boundaries for usage
- Understanding that this is an AI representation, not the actual person
- Using the application as part of a broader grief or emotional processing journey

## Future Improvements

- Enhanced voice cloning capabilities
- Mobile application
- Expanded conversation history formats
- Integration with grief counseling resources
- More personalization options

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Disclaimer

This application is designed as a supportive tool for mental health and emotional processing. It is not a substitute for professional mental health treatment.
