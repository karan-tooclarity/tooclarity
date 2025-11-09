import { useQuery } from '@tanstack/react-query';
import { authAPI } from '@/lib/api';

export interface UserProfile {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  contactNumber?: string;
  designation?: string;
  linkedin?: string;
  institution?: string;
  role?: string;
  isPaymentDone?: boolean;
  isProfileCompleted?: boolean;
}

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async (): Promise<UserProfile | null> => {
      const res = await authAPI.getProfile();
      const d = (res as { data?: Partial<UserProfile> })?.data || null;
      if (!d) return null;
      return {
        id: d.id || d._id,
        _id: d._id || d.id,
        name: d.name,
        email: d.email,
        contactNumber: d.contactNumber,
        designation: d.designation,
        linkedin: d.linkedin,
        institution: d.institution as string | undefined,
        role: d.role,
        isPaymentDone: d.isPaymentDone,
        isProfileCompleted: d.isProfileCompleted,
      };
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
} 