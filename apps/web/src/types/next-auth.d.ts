import 'next-auth';
import { UserRole } from '@dermo/types';

declare module 'next-auth' {
  interface User {
    id: string;
    role: UserRole;
    clinicId: string;
    apiToken: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: UserRole;
      clinicId: string;
      apiToken: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
    clinicId: string;
    apiToken: string;
  }
}
