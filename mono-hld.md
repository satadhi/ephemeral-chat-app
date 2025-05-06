
# 🧠 High-Level Design: Ephemeral Chat App (Single Node.js Instance)

---

## 🎯 **Goals**

* Support **unlimited ephemeral chat rooms**.
* Messages persist only for a **short duration** (e.g., 2–5 minutes).
* Users can **join/leave** rooms.
* Messages are broadcast in **real-time** via **WebSockets**.
* Use **Kafka** for message ingestion, distribution, and temporary storage.

---

## 🧱 **System Components**

### 1. **Client (ReactJS or Web UI)**

* Connects to WebSocket.
* Joins a room.
* Sends/receives chat messages.
* Displays live chat and ephemeral history.

---

### 2. **Node.js Server**

* Runs a single instance.
* Manages WebSocket connections.
* Acts as a Kafka producer and consumer.
* Maintains an **in-memory room registry**:

  ```
  Map<roomId, Set<socket>>
  ```

#### Key Responsibilities:

* Accept new WebSocket connections.
* Handle room join/leave events.
* Accept chat messages and push to Kafka.
* Consume messages from Kafka and route them to appropriate clients.
* Enforce TTL logic using Kafka's retention config.

---

### 3. **Apache Kafka**

* Used for **decoupling producers/consumers** and storing ephemeral chat messages.

#### Topic: `chat-messages`

* Single topic.
* Partitioned by `roomId` (to maintain ordering within rooms).
* `retention.ms` set to \~2–5 minutes.

---

## 🔁 **Data Flow**

### ➕ 1. **User Joins a Room**

* Client sends `joinRoom(roomId)` via WebSocket.
* Server:

  * Adds socket to in-memory `roomId → Set<socket>` map.
  * Optionally **seeks recent Kafka messages** from that room’s partition (if history fetch is needed).

---

### 💬 2. **User Sends a Message**

* Client emits `chatMessage` via WebSocket.
* Server:

  * Receives message with metadata (`roomId`, `userId`, `text`).
  * Pushes it to Kafka (`chat-messages` topic, keyed by `roomId`).

---

### 📥 3. **Kafka Handles the Message**

* Message gets stored in Kafka with retention of X minutes.
* Kafka ensures partition-based ordering.

---

### 🔁 4. **Message Is Broadcast to Room**

* Kafka consumer (within same Node.js instance):

  * Reads from `chat-messages`.
  * Looks up the room’s socket set in memory.
  * Emits message via WebSocket to all connected clients in that room.

---

### ❌ 5. **User Leaves the Room**

* Client sends `leaveRoom(roomId)` or disconnects.
* Server removes the socket from the corresponding room map.

---

## 🧠 Key Design Considerations

### ⚡ Ephemerality

* Kafka’s topic has `retention.ms` configured for X minutes (e.g., 5 minutes).
* No separate DB required for message persistence.
* No manual TTL management needed — Kafka handles it.

---

### 🕸 WebSocket Room Isolation

* Only sockets subscribed to a room receive its messages.
* When a user leaves or disconnects, they’re removed from the map.
* No unauthorized message delivery.

---

### 🧠 In-Memory Room Registry

* Lightweight and sufficient for single instance.
* `Map<roomId, Set<socket>>` enables fast lookups for broadcasting.
* Cleared when no users are present.

---

## 🔐 Security & Validation (Optional Add-ons)

* Validate users on connection (JWT or token).
* Rate-limit messages per user to avoid spam.
* Prevent room ID spoofing or injection.

---

## 📊 Metrics & Observability (Optional)

* Track number of active rooms and users.
* Log message throughput.
* Alert if Kafka lags or crashes.

---

## 🧼 Clean-up Logic (Optional)

* Periodically check for empty rooms.
* Remove entries from in-memory map when no sockets remain.

---

## ✅ Summary

| Area                | Design                                  |
| ------------------- | --------------------------------------- |
| Real-time Messaging | WebSocket (`ws` or `socket.io`)         |
| Message Storage     | Kafka with TTL (`retention.ms`)         |
| Message Broadcast   | Kafka consumer → socket broadcast       |
| Room Management     | In-memory map (lightweight)             |
| Scaling             | Single server — no Kafka adapter needed |
| Persistence         | Ephemeral only (no DB)                  |

---

Let me know if you want a **Low-Level Design**, **Kafka config example**, or an **architecture diagram** next.
