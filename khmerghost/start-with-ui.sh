#!/bin/bash
# KhmerGhost — Start with VNC + Control UI
# Owner: JZYY (THE MASTER)

set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; BLUE='\033[0;34m'; NC='\033[0m'
log()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn() { echo -e "${YELLOW}[!]${NC} $1"; }
info() { echo -e "${BLUE}[ℹ]${NC} $1"; }

echo ""
echo "╔══════════════════════════════════════════════════╗"
echo "║  🔮 KHMERGHOST — Phone Preview + Control UI      ║"
echo "║  Owner: JZYY (THE MASTER) 🇰🇭                    ║"
echo "╚══════════════════════════════════════════════════╝"
echo ""

# Start core + control UI
log "Starting core services..."
docker-compose up -d backend frontend redis control-ui

sleep 8

if curl -s http://localhost:3000/health > /dev/null 2>&1; then
  log "Backend: http://localhost:3000"
else
  warn "Backend still starting..."
fi

log "Frontend:    http://localhost:3001"
log "Control UI:  http://localhost:3002"

echo ""
info "To also start Android emulator (Linux/KVM only):"
echo "   docker-compose --profile emulator up -d"
echo ""
info "Access points:"
echo "   🎮 Control Panel:  http://localhost:3002"
echo "   🌐 Frontend:       http://localhost:3001"
echo "   🔌 API:            http://localhost:3000"
echo "   🖥️  noVNC:          http://localhost:6080 (emulator only)"
echo ""
log "Done!"
