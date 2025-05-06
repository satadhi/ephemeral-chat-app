# WhisperRooms — Ephemeral Group Chat with Kafka & WebSockets

WhisperRooms is a real-time, **ephemeral group chat app** built with **Node.js**, **Kafka**, and **WebSockets**. It allows users to create and join unlimited chat groups, send messages that **auto-expire after a few minutes**, and experience true real-time communication — without storing any messages permanently.

---

## What This Project Demonstrates

This project is designed to showcase a deep understanding of **Node.js stream/event architecture**, **Kafka messaging**, and **ephemeral data handling** in a real-time application context. It integrates multiple powerful concepts:

- **Event-driven systems** using Kafka (producers/consumers)
- **WebSockets** for live, bidirectional communication
- **Ephemeral messaging** with TTL-based in-memory queues
- **Memory-safe design** with auto-cleanup and efficient broadcast
- **Node.js Streams & Transform pipelines** (used optionally for message enrichment or filtering)
- **Scalable architecture** using Kafka topics to decouple WebSocket producers/consumers
- Real-time system testing and state isolation without permanent databases

---

## App Functionality

- 🔹 Users can **create or join unlimited chat groups**
- 🔹 Messages are **broadcast live** via WebSockets
- 🔹 Messages are **pushed to Kafka**, then consumed and rebroadcast
- 🔹 All messages **auto-expire** (2–5 mins) and are then removed from memory
- 🔹 No message is ever stored on disk or in a database

---

## Tech Stack

| Layer      | Technology             | Purpose                            |
| ---------- | ---------------------- | ---------------------------------- |
| Backend    | Node.js                | WebSocket server, Kafka bridge     |
| Messaging  | Kafka (via KafkaJS)    | Pub/sub messaging bus              |
| Streaming  | Node.js Streams        | Message transformations (optional) |
| Frontend   | React.js               | Chat UI, WebSocket client          |
| Deployment | Docker, Docker Compose | Local Kafka + Zookeeper            |

## Possible Enhancements

- Redis-based TTL store for distributed expiry handling

- Kafka topic compaction for real ephemeral stream retention
- Authentication via tokens
- Auto-reconnect + retry mechanisms
- Show active users in group
  -Push-style desktop notifications
