import os
import google.generativeai as genai
import asyncio
import websockets
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get API key from .env file
api_key = os.getenv("GENAI_API_KEY")
if not api_key:
    raise ValueError("API key not found. Please set GENAI_API_KEY in the .env file.")

# Configure Generative AI
genai.configure(api_key=api_key)


new_format_history = []

def process_json_messages(json_filename):
    try:
        # Open and read the JSON file
        with open(json_filename, 'r') as json_file:
            data = json.load(json_file)
         # List to store the new formatted messages
        
        # Process each message in the 'messages' array
        for message in data['messages']:
            # Determine the role based on the sender_id
            if message['sender_id'] == 'son':
                role = 'user'
            elif message['sender_id'] == 'dad':
                role = 'model'
            else:
                continue  # If the sender is unknown, skip this message
            
            # Create the new message structure with 'role' and 'parts'
            new_message = {
                'role': role,
                'parts': [
                    {'text': message['content'] + '\n'}  # Add newline as required in the format
                ]
            }
            new_format_history.append(new_message)
            # Append the new message to the formatted history list
           
        
        # Output the processed data to console (or use as needed)
        
    except Exception as e:
        print(f"Error: {e}")

# Specify the filename
json_filename = 'old.json'  # The JSON file you want to process

# Call the function to process the JSON messages
process_json_messages(json_filename)


# Set generation config
generation_config = {
    "temperature": 0.95,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

# Create the model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp", 
    generation_config=generation_config,
    system_instruction="follow the chat history and the conversation should be done so that you should impersonate the history no change of things and always try to ask questions that initiate conversation"
)

# Chat session
chat_session = model.start_chat(history= new_format_history)

async def chat_with_enotes(websocket):
    try:
        while True:
            user_input = await websocket.recv()  # Receive input from client
            print(f"User: {user_input}")  # Log user input

            # Generate response
            response = chat_session.send_message(user_input)
            print(f"User: {response.text}")   
            await websocket.send(response.text)  # Send AI response

            # Save chat history
            chat_session.history.append({"role": "user", "parts": [user_input]})
            chat_session.history.append({"role": "Assistant", "parts": [response.text]})

            await asyncio.sleep(1)  # Prevent excessive looping

    except websockets.ConnectionClosed:
        print("Client disconnected. Waiting for a new connection...")
    except Exception as e:
        print(f"Error: {e}")

async def main():
    print("WebSocket server running on ws://localhost:8765")
    async with websockets.serve(chat_with_enotes, "0.0.0.0", 8765):
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    asyncio.run(main())
