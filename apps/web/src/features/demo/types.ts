export interface DemoFormData {
  name: string;
  clinicName: string;
  email: string;
  phone: string;
  clinicType: string;
  providerCount: string;
  city: string;
  preferredTime: string;
  automationNotes: string;
}

export interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultClinicType?: string;
}
