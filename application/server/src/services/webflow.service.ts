import { Repository } from 'typeorm';
import { Webflow } from '../entities/webflow.entity';
import { WebflowDto } from '../models/webflow.model';
import { AppDataSource } from '../db';

export class WebflowService {
  private webflowRepository: Repository<Webflow>;

  constructor() {
    this.webflowRepository = AppDataSource.getRepository(Webflow);
  }

  async findAll(): Promise<Webflow[]> {
    return this.webflowRepository.find();
  }

  async findById(id: string): Promise<Webflow | null> {
    return this.webflowRepository.findOne({ where: { id } });
  }

  async findByUser(userId: string): Promise<Webflow[]> {
    return this.webflowRepository.find({ where: { createdBy: userId } });
  }

  async create(webflowDto: WebflowDto): Promise<Webflow> {
    const webflow = this.webflowRepository.create(webflowDto);
    return this.webflowRepository.save(webflow);
  }

  async update(id: string, webflowDto: Partial<WebflowDto>): Promise<Webflow | null> {
    await this.webflowRepository.update(id, webflowDto);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.webflowRepository.delete(id);
    return typeof result.affected === 'number' && result.affected > 0;
  }

  async findByTags(tags: string[]): Promise<Webflow[]> {
    // This is a simplified approach - in a real app, you might want to use a more sophisticated query
    const webflows = await this.webflowRepository.find();
    return webflows.filter(webflow => {
      if (!webflow.tags) return false;
      return tags.some(tag => webflow.tags.includes(tag));
    });
  }
}
