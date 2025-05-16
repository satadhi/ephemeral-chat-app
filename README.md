# WhisperRooms — Ephemeral Group Chat with Kafka & WebSockets

WhisperRooms is a real-time, **ephemeral group chat app** built with **Nestjs**, **Nextjs**, **Kafka**, and **WebSockets**. It allows users to create and join unlimited chat groups, send messages that **auto-expire after a few minutes**.

---

## Getting Started for Development

To set up the project for development, follow these steps:

1. Start the required services using Docker Compose:
  ```bash
  docker-compose up --build -d
  ```

2. Start the backend server:
  ```bash
  npm run start:dev
  ```

3. Start the frontend application:
  ```bash
  npm run dev
  ```

## What This Project Demonstrates

This project is designed to showcase a deep understanding of **Node.js event architecture**, **Kafka messaging**, **In Memory Task Queue** and **ephemeral data handling** in a real-time application context. It integrates multiple concepts:

- **Event-driven systems** using Kafka (producers/consumers)
- **WebSockets** for live, bidirectional communication
- **Ephemeral messaging** with TTL-based in-memory queues
- **Scalable architecture** using Kafka topics to decouple WebSocket producers/consumers
---

## App Functionality

- Create or join unlimited chat rooms instantly — no friction, no limits.

- Real-time messaging powered by WebSockets for blazing-fast delivery.

- Messages flow through Kafka pipelines, ensuring scalable, reliable distribution.

- No message lasts forever — all chats auto-expire within 2–5 minutes, keeping conversations fresh and memory-light.

- Zero storage footprint — we don’t store messages on disk or in any database.

- Instantly see a live list of active chat rooms — join any ongoing conversation with a click.

- When a room dies, it disappears — inactive rooms are auto-cleaned for a clutter-free experience.

- A built-in status bar shows real-time system events, helping users and devs alike understand what’s happening under the hood.

- Accidentally refreshed the page? No problem — you’re still connected. Just pull the latest chat state manually to get back in sync.
---

## Tech Stack

| Layer      | Technology             | Purpose                            |
| ---------- | ---------------------- | ---------------------------------- |
| Backend    | Nest.js                | WebSocket, Kafka, Task Queue       |
| Messaging  | Kafka (via KafkaJS)    | Pub/sub messaging bus              |
| Frontend   | Next.js, tailwind      | WebSocket client                   |
| Deployment | Docker, Docker Compose | Local Kafka with KRaft             |

## Possible Enhancements

-Use a Redis-based TTL store to automatically delete a room after a period of inactivity, measured from the time of the last message
- Authentication via tokens
- Auto-reconnect + retry mechanisms
- Show active users in group
- Push-style desktop notifications
- Add a LRU cache to not fetch chat history everytime a new user joins a high traffic chat room.
- Show List of available users for a group Chat.