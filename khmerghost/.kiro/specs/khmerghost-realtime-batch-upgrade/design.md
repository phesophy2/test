# KhmerGhost Realtime Batch Upgrade - Design

## System Architecture

### Current Architecture
```
[Frontend React] → [Express REST API] → [SQLite Database]
                    ↓
              [External APIs]
```

### New Architecture
```
[Frontend React + WebSocket] ↔ [WebSocket Server] → [SQLite Database]
         ↓                              ↓
  [REST API Calls]              [External APIs]
                                 ↓
                    [Batch Service Queue]
```

## Component Design

### 1. WebSocket Server (`server.js`)
**Purpose**: Handle real-time bidirectional communication

**Key Changes**:
- Replace current Express-only server with HTTP + WebSocket server
- Integrate Socket.io with Express
- Make Socket.io instance accessible to routes

**Code Structure**:
```javascript
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
// ... existing imports

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: allowedOrigins } });

// Make io accessible to routes
app.set('io', io);

// WebSocket event handlers
io.on('connection', (socket) => {
  // Handle connection, disconnection, stats requests
});
```

### 2. Batch Service (`services/batchService.js`)
**Purpose**: Manage queue-based batch account creation

**Class Design**:
```javascript
class BatchService {
  constructor() {
    this.queue = [];          // Pending tasks
    this.isProcessing = false; // Processing state
    this.results = [];        // Completed/failed tasks
  }
  
  async addToQueue(count, options) {}    // Add tasks to queue
  async processQueue() {}                // Process queue items
  getQueueStatus() {}                    // Get current status
  getResults() {}                        // Get batch results
}
```

**Queue Processing Flow**:
1. User requests batch creation → `addToQueue()`
2. If not processing, start `processQueue()`
3. For each task in queue:
   - Mark as processing
   - Call `createFacebookAccount()`
   - Emit WebSocket event on success/failure
   - Wait 30 seconds (rate limiting)
4. Mark batch as complete

### 3. Enhanced Mail Service (`services/mailService.js`)
**Purpose**: Provide resilient email generation with multiple providers

**Provider Rotation Strategy**:
- Maintain array of provider functions
- Rotate through providers using round-robin
- Fallback to next provider on failure
- Throw error only if all providers fail

**Providers**:
1. **Mail.tm** - Primary provider
2. **Guerrilla Mail** - Secondary provider  
3. **Temp-Mail** - Tertiary provider

### 4. AdsPower Service (`services/adspowerService.js`)
**Purpose**: Integrate with AdsPower for browser fingerprint management

**Features**:
- Check AdsPower API availability on startup
- Create browser profiles with custom fingerprints
- Configure proxy settings per profile
- Open profiles programmatically
- Graceful fallback if AdsPower not available

### 5. Enhanced Farm Routes (`routes/farmRoutes.js`)
**New Endpoints**:
- `POST /api/farm/batch` - Create batch of accounts
- `GET /api/farm/batch/status` - Get batch queue status
- `GET /api/farm/batch/results` - Get batch results

### 6. Frontend WebSocket Integration (`App.js` + `FarmDashboard.js`)
**Components**:
- **App.js**: Global WebSocket connection, real-time stats display
- **FarmDashboard.js**: Batch creation interface, status monitoring

**WebSocket Events**:
- `stats-update` - Real-time statistics
- `account-created` - Account creation success
- `account-failed` - Account creation failure

## Data Models

### Batch Task Schema
```javascript
{
  id: number,           // Unique task ID
  options: object,      // Creation options
  status: string,       // 'pending' | 'processing' | 'completed' | 'failed'
  startTime: number,    // Timestamp when processing started
  endTime: number,      // Timestamp when completed/failed
  result: object,       // Account data on success
  error: string         // Error message on failure
}
```

### WebSocket Event Payloads
```javascript
// stats-update
{ total: number, active: number, banned: number }

// account-created  
{ success: true, email: string, password: string, duration: number }

// account-failed
{ error: string, taskId: number }
```

## Database Considerations

### Existing Tables (No Changes Required)
- `accounts` - Store created accounts
- `proxies` - Proxy configurations
- `logs` - System logs

### In-Memory Storage
- Batch queue and results stored in memory (restart-safe)
- Consider Redis for persistence in future

## Error Handling

### WebSocket Errors
- Handle connection failures gracefully
- Implement reconnection logic
- Fallback to polling if WebSocket unavailable

### Batch Processing Errors
- Individual task failures don't stop batch
- Failed tasks logged with error details
- User notified via WebSocket events

### External API Errors
- Email provider failures trigger fallback
- AdsPower unavailable uses existing fingerprint system
- Rate limiting prevents API abuse

## Performance Considerations

### Rate Limiting
- 30 seconds between account creations
- Prevents Facebook detection
- Configurable via environment variables

### Memory Management
- Batch results limited to last 100 tasks
- Queue processing uses streaming approach
- WebSocket connections cleaned up on disconnect

### Database Optimization
- Statistics queries use indexes
- Batch operations don't block other queries
- Connection pooling maintained

## Security Considerations

### CORS Configuration
- Restrict WebSocket origins to known frontend URLs
- Prevent cross-origin attacks

### Input Validation
- Batch count limited to 1-50
- Sanitize all user inputs
- Validate email provider responses

### API Protection
- Rate limiting on batch endpoints
- Request size limits
- Error messages don't expose sensitive data

## Deployment Considerations

### Dependencies
```bash
# Backend
npm install socket.io

# Frontend  
npm install socket.io-client
```

### Configuration
- WebSocket port same as HTTP port (3000)
- CORS origins configurable via environment
- Rate limit duration configurable

### Monitoring
- WebSocket connection counts
- Batch processing metrics
- Email provider success rates
- Error rates and types

## Testing Strategy

### Unit Tests
- Batch service queue operations
- Email provider fallback logic
- WebSocket event handling

### Integration Tests
- End-to-end batch creation flow
- WebSocket connection and events
- External API integrations

### Performance Tests
- Concurrent WebSocket connections
- Batch processing under load
- Memory usage during large batches

## Rollback Plan
1. Revert to original `server.js` if WebSocket issues
2. Disable batch endpoints if unstable
3. Fallback to single email provider if multi-provider fails
4. Disable AdsPower integration if causing issues