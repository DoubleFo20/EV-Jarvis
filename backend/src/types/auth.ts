export const systemRoles = ['user', 'admin', 'super_admin'] as const;

export type SystemRole = (typeof systemRoles)[number];

export interface AuthPrincipal {
  id: string;
  email?: string;
  role: SystemRole;
}
