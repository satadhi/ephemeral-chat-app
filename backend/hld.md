## High Level data flow (Attempt 1)

```scss
[Client] <-> [WebSocket Gateway] --> [Kafka Producer]
--> Kafka Topic (per room or global)
[Kafka Consumer] --> [Send to sockets in room]
```

## High Level data flow (Attempt 2)

```scss
                   +----------------------+
                   |   Frontend Clients   |
                   +----------------------+
                            |
                            V
                    (WebSocket Connection)
                            |
                            V
                   +----------------------+
                   |   WebSocket Gateway  |
                   +----------------------+
                            |
                            V
                     (Send Message to) ??
                            |
                            V
                 +-------------------------+
                      |  Backend-1   |
                      | (Producer)   | 
                 +-------------------------+
                            |
                            V
                     (Consumer from Kafka)
                            |
                            V
                 +-------------------------+
                      |  Backend-2   |
                      | (Consumer)   | 
                 +-------------------------+
                            |
                         what protocal ??
                            |
                            V
                   +----------------------+
                   |   WebSocket Gateway  |
                   +----------------------+
                            |
                            V
                     (Send Message to)
                            |
                            V
                   +----------------------+
                   |   Frontend Clients   |
                   +----------------------+

```

## Todo list 

- ❌ implement a `ping` & `pong` to check if the socket is alive else remove user.
- ❌ set the websocket api contracts which will be used.
- ❌ Handle the case when the user socket gets disconnected and then reconnects with a new connection that should be treated as new user. 
- ✅ setup the socket.io connection to publish messages and create and join room  