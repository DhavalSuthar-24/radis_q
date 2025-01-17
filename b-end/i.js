// import express from "express";
// import { WebSocketServer } from "ws";
// import { createClient } from "redis";
// import { enqueueTicketRequest } from "./queue.js";

// const app = express();
// const port = 3000;

// // WebSocket Server
// const wss = new WebSocketServer({ noServer: true });
// let wsClients = [];

// // WebSocket Connection
// wss.on("connection", (ws) => {
//     console.log("New WebSocket connection established.");
//     wsClients.push(ws);

//     ws.on("close", () => {
//         console.log("WebSocket connection closed.");
//         wsClients = wsClients.filter(client => client !== ws);
//     });
// });

// // Notify all WebSocket clients about a new ticket
// const notifyClients = (ticket) => {
//     console.log("Notifying WebSocket clients about ticket update:", ticket.ticketId);
//     wsClients.forEach(client => {
//         if (client.readyState === WebSocket.OPEN) {
//             console.log(`Sending ticket update to client: ${ticket.ticketId}`);
//             client.send(JSON.stringify(ticket));
//         }
//     });
// };


// // Redis Subscriber for "ticketBooked"
// async function subscribeTicketBooked() {
//     const subscriber = createClient();

//     subscriber.on("error", (err) => {
//         console.error("Redis Subscriber Error:", err);
//     });

//     try {
//         await subscriber.connect();
//         console.log("Redis subscriber connected.");

//         subscriber.subscribe("ticketBooked", (message) => {
//             console.log("Received 'ticketBooked' message from Redis:", message);
//             const ticket = JSON.parse(message);
//             notifyClients(ticket);
//         });
//     } catch (error) {
//         console.error("Error connecting to Redis subscriber:", error);
//     }
// }

// subscribeTicketBooked();

// // Middleware
// app.use(express.json());

// // Ticket Request Endpoint
// app.post("/request-ticket", async (req, res) => {
//     const { userId } = req.body;
//     console.log(`Received ticket request for userId: ${userId}`);

//     if (!userId) {
//         return res.status(400).json({ error: "User ID is required" });
//     }

//     try {
//         await enqueueTicketRequest({ userId });
//         console.log(`Ticket request for user ${userId} added to the queue.`);
//         res.status(200).json({ message: "Ticket request received. Please wait for confirmation." });
//     } catch (error) {
//         console.error("Error enqueueing ticket request:", error);
//         res.status(500).json({ error: "Failed to process ticket request." });
//     }
// });

// // Start Server
// app.server = app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });

// // WebSocket upgrade handler
// app.server.on("upgrade", (request, socket, head) => {
//     console.log("Upgrading HTTP connection to WebSocket...");
//     wss.handleUpgrade(request, socket, head, (ws) => {
//         wss.emit("connection", ws, request);
//     });
// });



















// import express from 'express';
// import { WebSocketServer } from 'ws';
// import { createClient } from 'redis'; // Redis client for subscribing
// import { enqueueTicketRequest, dequeueTicketRequest, publishTicketBooked } from './queue.js';

// const app = express();

// // WebSocket Server
// const wss = new WebSocketServer({ noServer: true });
// let wsClients = [];

// wss.on('connection', (ws) => {
//   wsClients.push(ws);

//   ws.on('close', () => {
//     wsClients = wsClients.filter((client) => client !== ws);
//   });
// });

// // Notify all WebSocket clients about a new ticket
// const notifyClients = (ticket) => {
//   wsClients.forEach((client) => {
//     if (client.readyState === ws.OPEN) {
//       client.send(JSON.stringify(ticket));
//     }
//   });
// };

// // Subscribe to the "ticketBooked" channel
// async function subscribeTicketBooked() {
//   const subscriber = createClient();
//   await subscriber.connect();

//   subscriber.on('message', (channel, message) => {
//     if (channel === 'ticketBooked') {
//       const ticket = JSON.parse(message);
//       console.log('Received ticketBooked message:', ticket);
//       notifyClients(ticket);
//     }
//   });

//   await subscriber.subscribe('ticketBooked');
//   console.log('Redis subscriber connected.');
// }

// subscribeTicketBooked();

// // Express routes
// app.use(express.json());

// // Endpoint to handle ticket requests
// app.post('/request-ticket', async (req, res) => {
//   const { userId } = req.body;

//   if (!userId) {
//     return res.status(400).json({ error: 'User ID is required' });
//   }

//   try {
//     console.log(`Received ticket request for userId: ${userId}`);
//     await enqueueTicketRequest({ userId });
//     res.status(200).json({ message: 'Ticket request received. Please wait for confirmation.' });
//   } catch (error) {
//     console.error('Error processing ticket request:', error);
//     res.status(500).json({ error: 'Failed to process ticket request' });
//   }
// });

// // Start the server
// app.server = app.listen(3000, () => {
//   console.log('Server is running on port 3000');
// });

// // Handle WebSocket upgrades
// app.server.on('upgrade', (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit('connection', ws, request);
//   });
// });

// // Function to simulate ticket processing
// async function processTicketRequest() {
//     console.log('Checking for new ticket requests...');
//     const ticketRequest = await dequeueTicketRequest();
  
//     if (ticketRequest) {
//       console.log(`Processing ticket request for userId: ${ticketRequest.userId}`);
      
//       setTimeout(async () => {
//         try {
//           const ticketId = crypto.randomUUID();
//           const qrCode = `QR-Code-for-${ticketId}`;
  
//           const ticket = {
//             ticketId,
//             userId: ticketRequest.userId,
//             qrCode,
//             status: 'Booked',
//             timestamp: Date.now(),
//           };
  
//           await publishTicketBooked(ticket);
//           console.log(`Ticket booked: ${ticket.ticketId}`);
//         } catch (error) {
//           console.error('Error during ticket booking process:', error);
//         }
//       }, 2000); // Simulate a booking delay
//     } else {
//       console.log('No ticket request found.');
//     }
//   }

// // Continuously process tickets from the queue
// // setInterval(processTicketRequest, 5000); // Check for new tickets every 5 seconds




