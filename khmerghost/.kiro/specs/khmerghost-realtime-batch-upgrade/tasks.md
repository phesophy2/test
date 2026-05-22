# KhmerGhost Realtime Batch Upgrade - Tasks

## Phase 1: Dependencies and Setup

### Task 1.1: Install WebSocket Dependencies
**Description**: Install required Socket.io packages for backend and frontend
**Estimate**: 5 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] Backend: `socket.io` installed and added to package.json
- [x] Frontend: `socket.io-client` installed and added to package.json
- [x] Dependencies verified with `npm list`

**Implementation Steps**:
```bash
cd /Users/anbschool0016/Farm/khmerghost/backend
npm install socket.io

cd /Users/anbschool0016/Farm/khmerghost/frontend  
npm install socket.io-client
```

### Task 1.2: Create Spec Documentation
**Description**: Create spec folder structure and documentation
**Estimate**: 10 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] Spec folder created at `.kiro/specs/khmerghost-realtime-batch-upgrade/`
- [x] Requirements document created
- [x] Design document created
- [x] Tasks document created

## Phase 2: Backend WebSocket Server

### Task 2.1: Replace Server.js with WebSocket Server
**Description**: Update main server file to support WebSocket connections
**Estimate**: 15 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] Express server wrapped with HTTP server
- [x] Socket.io integrated with CORS configuration
- [x] WebSocket connection events logged
- [x] Socket.io instance made available to routes
- [x] Health check endpoint maintained
- [x] Server starts successfully on port 3000

**Implementation Steps**:
1. Replace current `server.js` with WebSocket version
2. Test server startup: `npm start`
3. Verify WebSocket endpoint available

### Task 2.2: Implement WebSocket Event Handlers
**Description**: Add WebSocket event handlers for real-time communication
**Estimate**: 10 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] Connection/disconnection events handled
- [ ] `request-stats` event queries database
- [ ] `stats-update` event emitted with statistics
- [ ] Error handling for database queries
- [ ] Console logging for debugging

**Implementation Steps**:
1. Add `io.on('connection', ...)` handler
2. Implement `request-stats` event listener
3. Test with WebSocket client

## Phase 3: Batch Creation Service

### Task 3.1: Create Batch Service Class
**Description**: Implement queue-based batch processing service
**Estimate**: 20 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] `BatchService` class created in `services/batchService.js`
- [x] Queue management methods implemented
- [x] Processing state tracking
- [x] Results storage
- [x] Rate limiting (30 seconds between accounts)
- [x] WebSocket event emission

**Implementation Steps**:
1. Create `services/batchService.js`
2. Implement class constructor and methods
3. Add rate limiting with `setTimeout`
4. Test queue operations

### Task 3.2: Add Batch Routes
**Description**: Add REST API endpoints for batch operations
**Estimate**: 15 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] `POST /api/farm/batch` endpoint added
- [x] `GET /api/farm/batch/status` endpoint added
- [x] `GET /api/farm/batch/results` endpoint added
- [x] Input validation (count 1-50)
- [x] Error handling
- [x] Integration with batch service

**Implementation Steps**:
1. Update `routes/farmRoutes.js`
2. Add batch service import
3. Implement three new route handlers
4. Test with Postman/curl

## Phase 4: Enhanced Email Service

### Task 4.1: Update Mail Service with Multiple Providers
**Description**: Enhance email service with provider fallback mechanism
**Estimate**: 15 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] Multiple provider functions implemented
- [x] Round-robin provider rotation
- [x] Fallback on provider failure
- [x] Error handling for all providers
- [x] Maintain backward compatibility

**Implementation Steps**:
1. Replace `services/mailService.js`
2. Implement three provider methods
3. Add rotation logic
4. Test each provider independently

### Task 4.2: Create AdsPower Integration Service
**Description**: Implement AdsPower browser fingerprint management
**Estimate**: 20 minutes
**Status**: completed
**Acceptance Criteria**:
- [x] `AdsPowerService` class created
- [x] Connection checking on startup
- [x] Profile creation with fingerprints
- [x] Proxy configuration support
- [x] Graceful fallback if unavailable
- [x] Profile opening functionality

**Implementation Steps**:
1. Create `services/adspowerService.js`
2. Implement API client methods
3. Add fingerprint configuration
4. Test with AdsPower running/not running

## Phase 5: Frontend Integration

### Task 5.1: Add WebSocket to App.js
**Description**: Integrate WebSocket client into main React app
**Estimate**: 15 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] Socket.io-client imported
- [ ] WebSocket connection on component mount
- [ ] Real-time stats display in header
- [ ] Event handlers for account creation
- [ ] Connection status indicator
- [ ] Cleanup on component unmount

**Implementation Steps**:
1. Update `frontend/src/App.js`
2. Add WebSocket connection logic
3. Implement event handlers
4. Add real-time stats display
5. Test connection

### Task 5.2: Enhance FarmDashboard with Batch Features
**Description**: Add batch creation interface to farm dashboard
**Estimate**: 20 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] Batch count input with validation
- [ ] Batch creation button
- [ ] Real-time status display
- [ ] Results listing
- [ ] Polling for batch updates
- [ ] Integration with existing single-account form

**Implementation Steps**:
1. Update `frontend/src/components/FarmDashboard.js`
2. Add batch state and methods
3. Implement batch creation UI
4. Add status polling
5. Test batch creation flow

## Phase 6: Testing and Validation

### Task 6.1: Backend Integration Testing
**Description**: Test complete backend functionality
**Estimate**: 15 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] WebSocket server accepts connections
- [ ] Batch creation works end-to-end
- [ ] Email provider fallback works
- [ ] AdsPower integration tested
- [ ] All API endpoints respond correctly
- [ ] Error handling works as expected

**Implementation Steps**:
1. Start backend server
2. Test WebSocket connection with client
3. Test batch creation via API
4. Test email provider rotation
5. Verify AdsPower integration

### Task 6.2: Frontend Integration Testing
**Description**: Test complete frontend functionality
**Estimate**: 15 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] WebSocket connects on page load
- [ ] Real-time stats update
- [ ] Batch creation interface works
- [ ] Status updates display correctly
- [ ] Error messages shown appropriately
- [ ] Existing functionality unchanged

**Implementation Steps**:
1. Start frontend development server
2. Test WebSocket connection
3. Create single account (existing feature)
4. Create batch of accounts (new feature)
5. Verify real-time updates

### Task 6.3: End-to-End Testing
**Description**: Test complete system workflow
**Estimate**: 10 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] Complete batch creation workflow successful
- [ ] Real-time updates visible in UI
- [ ] Database records created correctly
- [ ] Rate limiting enforced
- [ ] System stable under load

**Implementation Steps**:
1. Start both backend and frontend
2. Create batch of 5 accounts
3. Monitor real-time updates
4. Verify database entries
5. Check console for errors

## Phase 7: Documentation and Cleanup

### Task 7.1: Update Project Documentation
**Description**: Update README and other documentation
**Estimate**: 10 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] README.md updated with new features
- [ ] API_EXAMPLES.md updated with batch endpoints
- [ ] SETUP.md updated with new dependencies
- [ ] UPDATES.md entry added

**Implementation Steps**:
1. Update `README.md` with WebSocket features
2. Add batch API examples to `API_EXAMPLES.md`
3. Update dependency instructions in `SETUP.md`
4. Add changelog entry to `UPDATES.md`

### Task 7.2: Code Review and Optimization
**Description**: Review code for improvements and optimizations
**Estimate**: 10 minutes
**Status**: pending
**Acceptance Criteria**:
- [ ] Code follows project conventions
- [ ] Error handling consistent
- [ ] Performance considerations addressed
- [ ] Security considerations addressed
- [ ] Comments added where necessary

**Implementation Steps**:
1. Review all new code files
2. Check error handling patterns
3. Verify rate limiting implementation
4. Ensure security best practices
5. Add code comments

## Success Metrics
- [ ] WebSocket connection established within 2 seconds
- [ ] Batch of 10 accounts completes within 5 minutes (with rate limiting)
- [ ] Email provider fallback works on first provider failure
- [ ] Real-time updates visible within 1 second
- [ ] No regression in existing functionality
- [ ] System memory stable during batch processing

## Rollback Checklist
If issues occur, revert in this order:
1. Disable batch routes in `farmRoutes.js`
2. Revert `server.js` to non-WebSocket version
3. Revert `mailService.js` to single provider
4. Remove AdsPower service import
5. Revert frontend WebSocket changes
6. Uninstall Socket.io dependencies