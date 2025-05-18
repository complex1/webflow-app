import { Request, Response } from 'express';
import { WebflowService } from '../services/webflow.service';
import { WebflowDto } from '../models/webflow.model';

export class WebflowController {
  private webflowService = new WebflowService();

  public getAllWebflows = async (req: Request, res: Response): Promise<void> => {
    try {
      const webflows = await this.webflowService.findAll();
      res.status(200).json(webflows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching webflows', error });
    }
  };

  public getWebflowById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const webflow = await this.webflowService.findById(id);
      
      if (!webflow) {
        res.status(404).json({ message: `Webflow with id ${id} not found` });
        return;
      }
      
      res.status(200).json(webflow);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching webflow', error });
    }
  };

  public getUserWebflows = async (req: Request, res: Response): Promise<void> => {
    try {
      // Assuming user ID is available in req.user from auth middleware
      const userId = (req as any).user.id;
      const webflows = await this.webflowService.findByUser(userId);
      res.status(200).json(webflows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user webflows', error });
    }
  };

  public createWebflow = async (req: Request, res: Response): Promise<void> => {
    try {
      const webflowData: WebflowDto = req.body;
      
      // Assuming user ID is available in req.user from auth middleware
      webflowData.createdBy = (req as any).user.id;
      
      const newWebflow = await this.webflowService.create(webflowData);
      res.status(201).json(newWebflow);
    } catch (error) {
      res.status(500).json({ message: 'Error creating webflow', error });
    }
  };

  public updateWebflow = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const webflowData: Partial<WebflowDto> = req.body;
      
      // Ensure user can't change the createdBy field
      delete webflowData.createdBy;
      
      const updatedWebflow = await this.webflowService.update(id, webflowData);
      
      if (!updatedWebflow) {
        res.status(404).json({ message: `Webflow with id ${id} not found` });
        return;
      }
      
      res.status(200).json(updatedWebflow);
    } catch (error) {
      res.status(500).json({ message: 'Error updating webflow', error });
    }
  };

  public deleteWebflow = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const isDeleted = await this.webflowService.delete(id);
      
      if (!isDeleted) {
        res.status(404).json({ message: `Webflow with id ${id} not found` });
        return;
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting webflow', error });
    }
  };

  public getWebflowsByTags = async (req: Request, res: Response): Promise<void> => {
    try {
      const { tags } = req.query;
      
      if (!tags || !Array.isArray(tags)) {
        res.status(400).json({ message: 'Tags parameter must be an array' });
        return;
      }
      
      const webflows = await this.webflowService.findByTags(tags as string[]);
      res.status(200).json(webflows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching webflows by tags', error });
    }
  };
}
