// // Import the core gRPC library from Google to handle high-performance binary networking
// import * as grpc from '@grpc/grpc-js';
// // Import the loader to read our '.proto' text file and convert it into a JavaScript object
// import * as protoLoader from '@grpc/proto-loader';

// // --- ESM PATH RESOLUTION ---
// // Import tools to reconstruct __dirname in an ES Module environment
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// // Reconstruct __filename and __dirname
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// // ---------------------------

// // ---------------------------------------------------------
// // 1. LOAD THE CONTRACT (The Blueprint)
// // ---------------------------------------------------------

// // Define the exact path to the protobuf file using our newly created __dirname
// const PROTO_PATH = join(__dirname, './grpc/protos/identity.proto');

// // Load the .proto file with specific enterprise configuration options
// const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
//   keepCase: true,     // Preserve exactly how we typed the variable names in the proto file
//   longs: String,      // Convert large numbers to Strings to prevent JavaScript memory overflow
//   enums: String,      // Keep Enums as readable strings rather than obscure integers
//   defaults: true,     // Populate default values if the BFF forgets to send a field
//   oneofs: true,       // Support 'oneof' fields for complex enterprise data models
// });

// // Convert the raw package definition into an executable gRPC object
// const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
// // Extract our specific 'identity' namespace from the loaded package
// const identityProto = protoDescriptor.identity;

// // ---------------------------------------------------------
// // 2. DEFINE THE BUSINESS LOGIC (The Kitchen)
// // ---------------------------------------------------------

// // This function actually processes the request. It acts just like a GraphQL Resolver or REST Controller.
// const validateUserAccess = (
//   call: grpc.ServerUnaryCall<any, any>, // The incoming binary request from the BFF
//   callback: grpc.sendUnaryData<any>     // The callback function to send binary data back to the BFF
// ) => {
//   // Extract the variables the BFF sent us (These match the 'AccessRequest' message in our .proto)
//   const { userId, requiredRole } = call.request;

//   // Simulate checking a PostgreSQL database
//   console.log(`[gRPC] BFF requested access check for User: ${userId}, Role: ${requiredRole}`);

//   // Simulate a business rule: Only user 'admin_999' is allowed to upload documents
//   if (userId === 'admin_999' && requiredRole === 'Admin') {
//     // Send a SUCCESS response back to the BFF
//     callback(null, { isAuthorized: true, message: "Access Granted." });
//   } else {
//     // Send a REJECTION response back to the BFF
//     callback(null, { isAuthorized: false, message: "Access Denied. Insufficient privileges." });
//   }
// };

// // ---------------------------------------------------------
// // 3. BOOT UP THE SERVER (The Engine)
// // ---------------------------------------------------------

// // Define the central function to start our microservice
// const main = () => {
//   // Instantiate a new, secure gRPC server
//   const server = new grpc.Server();

//   // Bind our business logic function to the 'IdentityService' defined in our .proto file
//   server.addService(identityProto.IdentityService.service, {
//     ValidateUserAccess: validateUserAccess,
//   });

//   // Define the enterprise port for this service (50051 is the standard gRPC default)
//   const PORT = '0.0.0.0:50051';

//   // Tell the server to listen on this port.
//   server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (error, port) => {
//     if (error) {
//       console.error('Failed to bind server:', error);
//       return;
//     }
//     // 👉 THE MISSING LINE: Actually turn the engine on!
//     server.start();
//     // Start accepting incoming traffic
//     console.log(`🚀 Identity Microservice running via gRPC on ${PORT}`);
//   });
// };

// // Execute the main function to turn the key in the ignition
// main();

import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import * as path from 'path';

console.log("🟢 STEP 1: Booting up script...");

// Use process.cwd() to look from the root folder directly into src
const PROTO_PATH = path.join(process.cwd(), 'src/grpc/protos/identity.proto');
console.log(`🟢 STEP 2: Looking for Proto file at -> ${PROTO_PATH}`);

try {
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true, longs: String, enums: String, defaults: true, oneofs: true,
  });
  console.log("🟢 STEP 3: Proto file loaded successfully.");

  const protoDescriptor = grpc.loadPackageDefinition(packageDefinition) as any;
  const identityProto = protoDescriptor.identity;

  const validateUserAccess = (call: any, callback: any) => {
    const { userId, requiredRole } = call.request;
    console.log(`[gRPC] BFF requested access check for User: ${userId}, Role: ${requiredRole}`);
    if (userId === 'admin_999' && requiredRole === 'Admin') {
      callback(null, { isAuthorized: true, message: "Access Granted." });
    } else {
      callback(null, { isAuthorized: false, message: "Access Denied." });
    }
  };

  const main = () => {
    const server = new grpc.Server();
    server.addService(identityProto.IdentityService.service, {
      ValidateUserAccess: validateUserAccess,
    });

    const PORT = '0.0.0.0:50051';
    server.bindAsync(PORT, grpc.ServerCredentials.createInsecure(), (error, port) => {
      if (error) {
        console.error('🔴 CRITICAL ERROR: Failed to bind server:', error);
        return;
      }
      server.start(); 
      console.log(`🚀 SUCCESS! Identity Microservice running via gRPC on ${PORT}`);
    });
  };

  main();

} catch (error) {
  console.error("🔴 CRITICAL ERROR during startup:", error);
}