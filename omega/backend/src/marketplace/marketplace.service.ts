import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes } from 'crypto';
import { Product } from '../entities/Product.entity';
import { Order } from '../entities/Order.entity';

@Injectable()
export class MarketplaceService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Products
  async getProducts(tenantId: string, category?: string) {
    const where: any = { tenantId, status: 'active' };
    if (category) where.category = category;
    return this.productRepository.find({ where, order: { createdAt: 'DESC' } });
  }

  async getProduct(id: string) {
    return this.productRepository.findOne({ where: { id } });
  }

  async createProduct(tenantId: string, userId: string, data: any) {
    const product = this.productRepository.create({ tenantId, userId, ...data });
    return this.productRepository.save(product);
  }

  async updateProduct(id: string, data: any) {
    await this.productRepository.update(id, data);
    return this.productRepository.findOne({ where: { id } });
  }

  async deleteProduct(id: string) {
    await this.productRepository.delete(id);
    return { success: true };
  }

  // Orders
  async createOrder(tenantId: string, userId: string, productId: string, paymentMethod: string) {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new Error('Product not found');
    if (product.quantity <= 0) throw new Error('Product out of stock');

    const orderId = `ORD_${randomBytes(8).toString('hex').toUpperCase()}`;
    const order = this.orderRepository.create({
      tenantId,
      userId,
      productId,
      productName: product.name,
      amount: product.price,
      currency: product.currency,
      paymentMethod,
      orderId,
    });

    await this.orderRepository.save(order);
    return { orderId, amount: product.price, productName: product.name };
  }

  async confirmOrder(orderId: string, transactionId: string) {
    const order = await this.orderRepository.findOne({ where: { orderId } });
    if (!order) throw new Error('Order not found');

    const product = await this.productRepository.findOne({ where: { id: order.productId } });
    if (product) {
      await this.productRepository.update(product.id, {
        quantity: product.quantity - 1,
        salesCount: product.salesCount + 1,
      });
    }

    const deliveryData = this.generateDeliveryData(product);

    await this.orderRepository.update(order.id, {
      status: 'delivered',
      paidAt: new Date(),
      deliveredAt: new Date(),
    });

    return { success: true, deliveryData };
  }

  private generateDeliveryData(product: Product) {
    if (product.category === 'email_account') {
      const email = `user${Date.now()}@${product.deliveryData?.domain || 'khmerghost.com'}`;
      const password = randomBytes(8).toString('hex');
      return { email, password };
    }
    if (product.category === 'proxy') {
      return {
        proxy: `proxy${Math.floor(Math.random() * 1000)}.khmerghost.com:8080`,
        username: `user_${randomBytes(4).toString('hex')}`,
        password: randomBytes(8).toString('hex'),
      };
    }
    if (product.category === 'software') {
      return { licenseKey: `KHG-${randomBytes(16).toString('hex').toUpperCase()}`, downloadUrl: product.deliveryData?.downloadUrl };
    }
    return { message: 'Check your email for delivery instructions' };
  }

  async getUserOrders(tenantId: string, userId: string) {
    return this.orderRepository.find({ where: { tenantId, userId }, order: { createdAt: 'DESC' } });
  }

  async getOrder(orderId: string) {
    return this.orderRepository.findOne({ where: { orderId } });
  }

  async cancelOrder(orderId: string) {
    await this.orderRepository.update({ orderId }, { status: 'cancelled' });
    return { success: true };
  }

  // Categories
  getCategories() {
    return [
      { id: 'email_account', name: 'Email Accounts', icon: '📧', description: 'Gmail, Outlook, Custom domain emails' },
      { id: 'proxy', name: 'Proxies', icon: '🌐', description: 'Residential, Datacenter, Mobile proxies' },
      { id: 'software', name: 'Software', icon: '💻', description: 'Automation tools, Scripts, Bots' },
      { id: 'service', name: 'Services', icon: '⚙️', description: 'Account creation, Posting services' },
      { id: 'template', name: 'Templates', icon: '📝', description: 'Post templates, Caption templates' },
      { id: 'script', name: 'Scripts', icon: '📜', description: 'Automation scripts, Code snippets' },
    ];
  }
}
