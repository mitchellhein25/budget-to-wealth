import { SessionData } from "@auth0/nextjs-auth0/types";

export interface NavItem {
  href: string;
  label: string;
}

export interface NavBarProps {
  session: SessionData | null;
}

export interface LogoProps {
  className?: string;
}

export interface UserProfileProps {
  session: SessionData | null;
  pathname: string;
}

export interface MobileDrawerProps {
  navItems: NavItem[];
  pathname: string;
  onClose: () => void;
}

export interface DesktopNavProps {
  navItems: NavItem[];
  pathname: string;
} 