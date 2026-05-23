import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*', credentials: true },
  namespace: '/',
})
export class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedClients: Map<string, { userId: string; tenantId: string }> = new Map();

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.connectedClients.delete(client.id);
  }

  @SubscribeMessage('auth')
  handleAuth(@ConnectedSocket() client: Socket, @MessageBody() data: { userId: string; tenantId: string }) {
    this.connectedClients.set(client.id, { userId: data.userId, tenantId: data.tenantId });
    client.join(`tenant_${data.tenantId}`);
    client.join(`user_${data.userId}`);
    return { event: 'auth', data: { success: true } };
  }

  @SubscribeMessage('subscribe')
  handleSubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { channel: string }) {
    client.join(data.channel);
    return { event: 'subscribed', data: { channel: data.channel } };
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(@ConnectedSocket() client: Socket, @MessageBody() data: { channel: string }) {
    client.leave(data.channel);
    return { event: 'unsubscribed', data: { channel: data.channel } };
  }

  // Broadcast methods
  broadcastToTenant(tenantId: string, event: string, data: any) {
    this.server.to(`tenant_${tenantId}`).emit(event, data);
  }

  broadcastToUser(userId: string, event: string, data: any) {
    this.server.to(`user_${userId}`).emit(event, data);
  }

  broadcastToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  // Specific events
  notifyPostCreated(tenantId: string, userId: string, postData: any) {
    this.broadcastToUser(userId, 'post:created', postData);
    this.broadcastToTenant(tenantId, 'post:new', postData);
  }

  notifyPostPublished(tenantId: string, userId: string, postData: any) {
    this.broadcastToUser(userId, 'post:published', postData);
  }

  notifyAccountStatus(tenantId: string, userId: string, accountData: any) {
    this.broadcastToUser(userId, 'account:status', accountData);
  }

  notifyFarmingProgress(tenantId: string, userId: string, progress: any) {
    this.broadcastToUser(userId, 'farming:progress', progress);
  }

  notifyPaymentReceived(tenantId: string, userId: string, paymentData: any) {
    this.broadcastToUser(userId, 'payment:received', paymentData);
  }

  notifyAchievementUnlocked(tenantId: string, userId: string, achievement: any) {
    this.broadcastToUser(userId, 'achievement:unlocked', achievement);
  }

  notifyAlert(tenantId: string, userId: string, alert: any) {
    this.broadcastToUser(userId, 'alert:new', alert);
  }
}
