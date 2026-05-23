import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../entities/Tenant.entity';

@Injectable()
export class TenantService {
  constructor(
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async getTenant(subdomain: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({
      where: [{ subdomain }, { customDomain: subdomain }]
    });
  }

  async createTenant(data: Partial<Tenant>): Promise<Tenant> {
    const tenant = this.tenantRepository.create(data);
    return this.tenantRepository.save(tenant);
  }

  async updateTenant(id: string, data: Partial<Tenant>): Promise<Tenant> {
    await this.tenantRepository.update(id, data);
    return this.tenantRepository.findOne({ where: { id } });
  }

  async getTenantSettings(id: string): Promise<any> {
    const tenant = await this.tenantRepository.findOne({ where: { id } });
    return tenant?.settings || {};
  }
}
