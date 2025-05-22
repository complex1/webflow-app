import { Repository } from 'typeorm';
import { Webflow } from '../entities/webflow.entity';
import { WebflowDto } from '../models/webflow.model';
import { AppDataSource } from '../db';

// Interface for the public webflow data (without internal entity fields)
export interface WebflowPublic {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  tags?: string[];
  createdAt: Date;
}

export class WebflowService {
  private webflowRepository: Repository<Webflow>;

  constructor() {
    this.webflowRepository = AppDataSource.getRepository(Webflow);
  }
  
  // Helper method to transform entity to public DTO
  private toPublic(webflow: Webflow): WebflowPublic {
    return {
      id: webflow.id,
      name: webflow.name,
      description: webflow.description,
      icon: webflow.icon,
      tags: webflow.tags,
      createdAt: webflow.createdAt
    };
  }

  async findAll(): Promise<WebflowPublic[]> {
    const webflows = await this.webflowRepository.find();
    return webflows.map(webflow => this.toPublic(webflow));
  }

  async findById(id: string): Promise<Webflow | null> {
    const webflow = await this.webflowRepository.findOne({ where: { id } });
    if (!webflow) return null;
    
    return webflow; // Return the full entity for internal use
  }

  async findByUser(userId: string): Promise<WebflowPublic[]> {
    const webflows = await this.webflowRepository.find({ where: { createdBy: userId } });
    
    // Transform entities to public objects, excluding sensitive or unnecessary data
    return webflows.map(webflow => this.toPublic(webflow));
  }

  async create(webflowDto: WebflowDto): Promise<WebflowPublic> {
    const webflow = this.webflowRepository.create(webflowDto);
    const savedWebflow = await this.webflowRepository.save(webflow);
    
    return this.toPublic(savedWebflow);
  }

  async update(id: string, webflowDto: Partial<WebflowDto>): Promise<WebflowPublic | null> {
    await this.webflowRepository.update(id, webflowDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.webflowRepository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async findByTags(tags: string[]): Promise<WebflowPublic[]> {
    // This is a simplified approach - in a real app, you might want to use a more sophisticated query
    const webflows = await this.webflowRepository.find();
    
    // Filter by tags and transform to public format
    return webflows
      .filter(webflow => {
        if (!webflow.tags) return false;
        return tags.some(tag => webflow.tags.includes(tag));
      })
      .map(webflow => this.toPublic(webflow));
  }
}
