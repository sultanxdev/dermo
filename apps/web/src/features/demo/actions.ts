import { DemoFormData } from './types';
import { api } from '@/lib/api';

export async function submitDemoRequest(formData: DemoFormData): Promise<{ success: boolean; message: string }> {
  try {
    let doctorCount = 1;
    if (formData.providerCount.includes('2-4')) {
      doctorCount = 3;
    } else if (formData.providerCount.includes('5+')) {
      doctorCount = 5;
    }

    const requirementsList = [
      formData.preferredTime ? `Preferred Demo Time: ${formData.preferredTime}` : '',
      formData.automationNotes ? `Automation Needs: ${formData.automationNotes}` : '',
    ].filter(Boolean);

    await api.createDemoRequest({
      name: formData.name.trim(),
      clinicName: formData.clinicName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      clinicType: formData.clinicType,
      doctorCount,
      city: formData.city.trim() || undefined,
      requirements: requirementsList.length > 0 ? requirementsList.join('\n') : undefined,
    });

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

