# 🔐 Identity & IAM Service (Node.js)

This repository contains the core Identity microservice for the Enterprise Internal Developer Portal. It is the authoritative source for user authentication, Role-Based Access Control (RBAC), and tenant isolation.

> **Architectural Source of Truth:** > For system blueprints and capability maps, refer to the central [Engineering Platform Repository](https://github.com/abhishekchaturvedi07/engineering-platform).

---

## 🏗️ Tech Stack

- **Runtime:** Node.js (TypeScript)
- **API Protocol:** gRPC (Internal) / REST (External Webhooks)
- **Database:** PostgreSQL (Primary Write Database)
- **Event Broker:** Kafka / RabbitMQ (Publisher)
- **ORM:** Prisma / TypeORM

## 📂 Project Structure

- `/src/grpc` - Protobuf definitions and gRPC service handlers.
- `/src/db` - PostgreSQL connection pools and schema migrations.
- `/src/events` - Message queue publishers (e.g., emitting `UserCreated` events).
- `/src/domain` - Core business logic and JWT validation rules.
