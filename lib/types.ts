// Tipos compartidos del dominio (espejo de las entidades del backend).

export type Role = "ROLE_ADMIN" | "ROLE_USER";

export type LeadStatus = "NEW" | "CONTACTED" | "WON" | "LOST";

export interface SessionUser {
  id: number;
  email: string;
  name: string;
  roles: Role[];
}

export interface CardTheme {
  colors?: { primary?: string; bg?: string; text?: string };
  logoUrl?: string;
  photoUrl?: string;
  /** Punto focal de la foto (object-position) en % 0–100; defecto centrado. */
  photoPosition?: { x: number; y: number };
  /** Encaje de la foto: "cover" recorta (defecto); "contain" la muestra entera sobre fondo difuminado. */
  photoFit?: "cover" | "contain";
  layout?: string;
  visibleFields?: string[];
}

export interface CardPublic {
  id: number;
  slug: string;
  displayName: string;
  company?: string | null;
  jobTitle?: string | null;
  phone?: string | null;
  mobile?: string | null;
  email?: string | null;
  website?: string | null;
  addressLine?: string | null;
  city?: string | null;
  postalCode?: string | null;
  country?: string | null;
  linkedin?: string | null;
  template?: string | Template | null;
  empresa?: Empresa | string | null;
  config: CardTheme;
}

export interface Card extends CardPublic {
  isPublished: boolean;
  user?: string | { id: number; name: string } | null;
  viewCount?: number;
  saveCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Template {
  id: number;
  key?: string | null;
  name: string;
  description?: string | null;
  previewImageUrl?: string | null;
  defaultConfig: CardTheme;
  isActive: boolean;
  empresa?: Empresa | string | null;
}

export interface Empresa {
  id: number;
  name: string;
  slug?: string;
  logoUrl?: string | null;
  isActive?: boolean;
}

export interface LeadNote {
  id: number;
  body: string;
  createdAt: string;
  author?: { id: number; name: string } | null;
}

export interface Lead {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  message?: string | null;
  status: LeadStatus;
  source?: string | null;
  createdAt: string;
  consentAt?: string | null;
  card?: { id: number; slug?: string } | string | null;
  empresa?: Empresa | string | null;
  assignedUser?: { id: number; name: string } | string | null;
  notes?: LeadNote[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  roles: Role[];
  phone?: string | null;
  jobTitle?: string | null;
  photoUrl?: string | null;
  isActive?: boolean;
}
