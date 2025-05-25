import { WebflowService } from './webflow.service';

export const exportWorkflowService = async (id: string) => {
  const webflowService = new WebflowService();
  try {
    const workflow = await webflowService.getWebflowById(id) as any;
    delete workflow.createdAt;
    delete workflow.createdBy;
    const name = workflow.name || 'Untitled Workflow';
    const json = JSON.stringify(workflow, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error fetching workflow:', error);
  }
};

export const importWorkflowService = async (file: File) => {
  const webflowService = new WebflowService();
  try {
    const text = await file.text();
    const workflow = JSON.parse(text);
    if (!workflow.name || !workflow.data) {
      throw new Error('Invalid workflow format');
    }
    const newWorkflow = await webflowService.createWebflow({
      name: workflow.name,
      description: workflow.description || '',
      data: workflow.data,
      tags: workflow.tags || [],
      icon: workflow.icon || '',
    });
    return newWorkflow;
  } catch (error) {
    console.error('Error importing workflow:', error);
    throw error;
  }
};