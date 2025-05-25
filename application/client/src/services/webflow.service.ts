import { HttpService } from "./http";
import type { WebflowDto } from "../model/index";

export class WebflowService {
  /**
   * Get all webflows
   */
  getAllWebflows() {
    const http = new HttpService();
    http.url = '/api/webflows';
    http.method = 'GET';
    return http.run();
  }

  /**
   * Get current user's webflows
   */
  getMyWebflows() {
    const http = new HttpService();
    http.url = '/api/webflows/my';
    http.method = 'GET';
    return http.run();
  }

  /**
   * Get webflow by ID
   * @param id The webflow ID
   */
  getWebflowById(id: string) {
    const http = new HttpService();
    http.url = `/api/webflows/${id}`;
    http.method = 'GET';
    return http.run();
  }

  /**
   * Create a new webflow
   * @param webflowData The webflow data
   */
  createWebflow(webflowData: Omit<WebflowDto, 'createdBy'>) {
    const http = new HttpService();
    http.url = '/api/webflows';
    http.method = 'POST';
    http.body = webflowData;
    return http.run();
  }

  /**
   * Update an existing webflow
   * @param id The webflow ID
   * @param webflowData The updated webflow data
   */
  updateWebflow(id: string, webflowData: Partial<WebflowDto>) {
    const http = new HttpService();
    http.url = `/api/webflows/${id}`;
    http.method = 'PUT';
    http.body = webflowData;
    return http.run();
  }

  /**
   * Delete a webflow
   * @param id The webflow ID
   */
  deleteWebflow(id: string) {
    const http = new HttpService();
    http.url = `/api/webflows/${id}`;
    http.method = 'DELETE';
    return http.run();
  }

  /**
   * Get webflows by tags
   * @param tags The tags to filter by
   */
  getWebflowsByTags(tags: string[]) {
    const http = new HttpService();
    http.url = `/api/webflows/tags?tags=${JSON.stringify(tags)}`;
    http.method = 'GET';
    return http.run();
  }
}
