import { SessionData } from '@auth0/nextjs-auth0/types';
import { unauthorized } from '@/app/lib/auth';

interface UnauthorizedWrapperProps {
  session: SessionData | null;
  children: React.ReactNode;
}

export default function UnauthorizedWrapper({ session, children }: UnauthorizedWrapperProps) {
  const unauthorizedComponent = unauthorized(session);
  
  if (unauthorizedComponent) {
    return unauthorizedComponent;
  }
  
  return <>{children}</>;
}
