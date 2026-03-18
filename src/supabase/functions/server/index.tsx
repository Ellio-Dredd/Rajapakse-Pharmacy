import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";

// Import modular route handlers
import products from "./products.tsx";
import orders from "./orders.tsx";
import doctors from "./doctors.tsx";
import appointments from "./appointments.tsx";
import prescriptions from "./prescriptions.tsx";
import users from "./users.tsx";
import analytics from "./analytics.tsx";
import auth from "./auth.tsx";
import categories from "./categories.tsx";
import databaseSetup from "./database-setup.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-18234cd5/health", (c) => {
  return c.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    message: "Healthcare Platform API is running"
  });
});

// Mount route modules with proper prefixes
app.route("/make-server-18234cd5/products", products);
app.route("/make-server-18234cd5/orders", orders);
app.route("/make-server-18234cd5/doctors", doctors);
app.route("/make-server-18234cd5/appointments", appointments);
app.route("/make-server-18234cd5/prescriptions", prescriptions);
app.route("/make-server-18234cd5/users", users);
app.route("/make-server-18234cd5/analytics", analytics);
app.route("/make-server-18234cd5/auth", auth);
app.route("/make-server-18234cd5/categories", categories);

// 404 handler for undefined routes
app.notFound((c) => {
  return c.json({
    success: false,
    error: "Endpoint not found",
    path: c.req.path,
  }, 404);
});

// Global error handler
app.onError((err, c) => {
  console.error('Global error handler:', err);
  return c.json({
    success: false,
    error: err.message || "Internal server error",
  }, 500);
});

// Start the server
Deno.serve(app.fetch);