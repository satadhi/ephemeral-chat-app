##  Backend High-Level Design: Ephemeral Chat App (Distributed, Real-Time, Non-Persistent)

---

###  Overview

This is a real-time ephemeral group chat system where:

- Users can create or join any number of chat rooms.
- Messages are **ephemeral** and auto-expire after a set TTL (e.g., 2 minutes).
- Backend is **horizontally scalable**, **fault-tolerant**, and **distributed**.
- Uses **Kafka for messaging**, **WebSockets for live delivery**, and **Node.js Streams** for processing.
- No database is used for persisting chat data (truly ephemeral).

---

###  Core Components

1. **Kafka Cluster**

   - **Topic**: `chat-messages`

     - Partitioned by `roomId` using **consistent hashing**.
     - Total partitions: fixed (e.g., 50).

   - Kafka ensures ordering within partitions, durability (but messages are TTL-bound).
   - Retention policy: `2m` via topic config (`retention.ms`).

2. **Node.js WebSocket Gateway(s)** (multiple instances)

   - Handles client connections.
   - Manages user room joins/leaves.
   - Subscribes to Kafka partitions using a consumer group.
   - On receiving messages from Kafka, **broadcasts via WebSocket** to subscribed users.

3. **Partition Mapping (Consistent Hashing)**

   - `partition = hash(roomId) % 50`
   - Ensures all messages of a room go to the same partition.

4. **Room-to-User In-Memory Map**

   - Maintained inside each gateway instance.
   - `Map<roomId, Set<socketId>>`
   - Tracks which clients are subscribed to which rooms.

5. **Message Lifecycle**

   - Client sends message → WebSocket Gateway publishes to Kafka (correct partition).
   - Kafka sends to consumer → Gateway receives → broadcasts to all connected users in that room.
   - Kafka auto-deletes the message after TTL.

6. **Ephemeral Message History**

   - On user join, server reads **last N messages** (within TTL) from Kafka using `fromBeginning: true`.
   - Filters based on `roomId`.

---

### Functional Flow

**1. Create Room / Join Room**

- User connects → joins a room → socket is registered under `roomId`.

**2. Send Message**

- WebSocket message → produce to Kafka partition for `roomId`.

**3. Receive Message**

- Kafka consumer (in same or another instance) receives → checks room → broadcasts.

**4. Leave Room / Disconnect**

- Remove socket from in-memory `roomId` set.
- Stop sending messages to that client.

---

### Scalability & Fault Tolerance

- WebSocket Gateway is **stateless** and can scale horizontally.
- Kafka provides **message durability**, **ordering**, and **partition-based scaling** using **consistent hashing**
- Consumers in same group balance partitions automatically.
- In-memory maps are **local**, so no cross-instance sync is needed.


###  Optional Enhancements

- Redis pub-sub for synchronizing room list across nodes (if needed).
- Use Kafka message keys for better partition routing.
- TTL auto-cleaning using Kafka `retention.ms`.
- Monitoring with Kafka UI, Prometheus, and custom metrics on gateway.


