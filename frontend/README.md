# Ephemeral Chat App Frontend

This is the frontend for the **Ephemeral Chat App**, built using [Next.js](https://nextjs.org/).

## Overview

The Ephemeral Chat App is a simple chat application that uses WebSockets to communicate with the backend in real-time. It provides a seamless and dynamic user experience by updating the UI instantly as messages are received.

## Features

1. **Unique Username**: Users can set a unique username to identify themselves in the chat.
2. **Real-Time Communication**: The app establishes a WebSocket connection with the backend for real-time message exchange.
3. **Dynamic UI Updates**: Messages received from the WebSocket are dynamically rendered in the UI without requiring a page refresh.

## Data Flow

1. **Set Username**: Users input a unique username to join the chat.
2. **WebSocket Connection**: A WebSocket connection is established with the backend server.
3. **Dynamic Updates**: Messages sent or received through the WebSocket are dynamically displayed in the chat interface.

## Technologies Used

- **Frontend Framework**: Next.js
- **Real-Time Communication**: WebSockets

## Getting Started

To run the frontend locally, follow these steps:

1. Clone the repository.
2. Install dependencies using `npm install` or `yarn`.
3. Start the development server with `npm run dev` or `yarn dev`.

Enjoy chatting in real-time!