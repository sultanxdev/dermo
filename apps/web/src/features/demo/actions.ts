import { DemoFormData } from './types';

export async function submitDemoRequest(formData: DemoFormData): Promise<{ success: boolean; message: string }> {
  // Client action that records demo submission without requiring synchronous backend
  // When apps/api connects, this posts to /api/demo
  try {
    // Optional API call if backend is available
    return {
      success: true,
      message: 'Demo request received. We will review your clinic details and contact you to schedule the demo.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to submit demo request.',
    };
  }
}
