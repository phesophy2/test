# KhmerGhost Realtime Batch Upgrade - Requirements

## Overview
Upgrade the KhmerGhost Facebook automation platform with real-time WebSocket communication, batch account creation, multiple email provider fallback, and AdsPower integration.

## Business Requirements
1. **Real-time Dashboard**: Users should see live updates of account creation, statistics, and batch processing status
2. **Batch Processing**: Users should be able to create multiple Facebook accounts in batches (1-50 accounts at once)
3. **Email Provider Resilience**: System should automatically fallback between multiple email providers when one fails
4. **Browser Fingerprint Management**: Integrate with AdsPower for advanced browser fingerprint management
5. **Performance**: Maintain system stability while processing multiple accounts with rate limiting

## Functional Requirements

### 1. WebSocket Server (Backend)
- **FR1.1**: Replace existing Express server with WebSocket-enabled server
- **FR1.2**: Support real-time statistics updates (total accounts, active, banned)
- **FR1.3**: Broadcast account creation events to all connected clients
- **FR1.4**: Handle client disconnections gracefully
- **FR1.5**: Maintain backward compatibility with existing REST API routes

### 2. Batch Creation Service
- **FR2.1**: Create queue-based batch processing system
- **FR2.2**: Support batch sizes from 1 to 50 accounts
- **FR2.3**: Implement rate limiting (30 seconds between accounts)
- **FR2.4**: Track batch processing status (pending, processing, completed, failed)
- **FR2.5**: Store batch results for later retrieval
- **FR2.6**: Emit real-time progress updates via WebSocket

### 3. Multiple Email Providers
- **FR3.1**: Implement fallback mechanism between email providers
- **FR3.2**: Support Mail.tm, Guerrilla Mail, and Temp-Mail providers
- **FR3.3**: Rotate providers to distribute load and increase success rate
- **FR3.4**: Handle provider failures gracefully with automatic fallback

### 4. AdsPower Integration
- **FR4.1**: Check AdsPower API connection on startup
- **FR4.2**: Create browser profiles with custom fingerprints
- **FR4.3**: Configure proxy settings for each profile
- **FR4.4**: Open browser profiles programmatically
- **FR4.5**: Fallback to existing fingerprint system if AdsPower unavailable

### 5. Frontend WebSocket Client
- **FR5.1**: Connect to WebSocket server on app load
- **FR5.2**: Display real-time statistics in dashboard header
- **FR5.3**: Show batch creation interface with count selector
- **FR5.4**: Display batch processing status and results
- **FR5.5**: Show recent account creation events
- **FR5.6**: Handle WebSocket disconnection and reconnection

## Non-Functional Requirements

### Performance
- **NFR1**: WebSocket connections should handle up to 100 concurrent clients
- **NFR2**: Batch processing should not block other API requests
- **NFR3**: Real-time updates should be delivered within 1 second
- **NFR4**: Database queries for statistics should be optimized

### Reliability
- **NFR5**: System should continue working if WebSocket fails (fallback to polling)
- **NFR6**: Batch processing should resume after server restart
- **NFR7**: Email provider failures should not stop account creation

### Security
- **NFR8**: WebSocket connections should be CORS-restricted to known origins
- **NFR9**: Batch size should be limited to prevent abuse
- **NFR10**: Rate limiting should prevent API abuse

### Usability
- **NFR11**: Real-time updates should be clearly visible in UI
- **NFR12**: Batch creation should have clear progress indicators
- **NFR13**: Error messages should be descriptive and actionable

## Technical Constraints
1. **Backend**: Node.js/Express with Socket.io
2. **Frontend**: React with socket.io-client
3. **Database**: SQLite (existing)
4. **External APIs**: Mail.tm, Guerrilla Mail, Temp-Mail, AdsPower
5. **Browser Automation**: Playwright (existing)

## Dependencies
1. **socket.io** (backend and frontend)
2. **axios** (already installed)
3. **AdsPower desktop application** (must be running locally)

## Success Criteria
1. ✅ Real-time statistics update within 1 second of account creation
2. ✅ Batch of 10 accounts processes successfully with rate limiting
3. ✅ Email provider fallback works when one provider fails
4. ✅ AdsPower integration creates profiles when available
5. ✅ Frontend shows live updates without page refresh
6. ✅ Existing functionality remains unchanged

## Out of Scope
1. Mobile app support
2. Multi-user authentication
3. Advanced batch scheduling
4. Email inbox monitoring
5. Proxy rotation service