import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    userType: 'customer' | 'admin' | 'moderator';
    role?: string;
    firstName?: string;
    lastName?: string;
    preferredLocale?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      userType: 'customer' | 'admin' | 'moderator';
      role?: string;
      firstName?: string;
      lastName?: string;
      preferredLocale?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    userType: 'customer' | 'admin' | 'moderator';
    role?: string;
    firstName?: string;
    lastName?: string;
    preferredLocale?: string;
  }
}
