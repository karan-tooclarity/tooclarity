// Admin-specific API configuration and methods for dashboard operations

import { apiRequest, ApiResponse } from "./api";

export type AdminApiResponse<T = unknown> = ApiResponse<T>;

// Reuse shared request helper by wrapping endpoint with admin routes
async function adminApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<AdminApiResponse<T>> {
  // Delegate to shared apiRequest to keep behavior consistent
  return apiRequest<T>(endpoint, options);
}

// ===== Admin Dashboard Types =====
export interface AdminInstitution {
  id: string;
  name: string;
}

export type PlanType = "monthly" | "yearly";

export interface CreateCouponPayload {
  code: string;
  discountedPercentage: number; // 0-100
  planType: PlanType;
  institutionIds: string[];
  maxUses: number; // >= 1
  expiresAt?: string; // ISO date (optional)
}

export interface Coupon {
  id: string;
  code: string;
  discountedPercentage: number;
  planType: PlanType;
  institutionIds: string[];
  maxUses: number;
  usedCount: number;
  enabled: boolean;
  createdAt: string;
  expiresAt?: string | null;
}

export interface ListParams {
  search?: string;
  page?: number;
  limit?: number;
}

// ===== Admin Dashboard API =====
export const adminDashboardAPI = {
  // List institutions for multi-select
  listInstitutions: async (params: ListParams = {}): Promise<AdminApiResponse<AdminInstitution[]>> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return adminApiRequest(`/v1/admin/coupon/institutions${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  // Create a coupon
  createCoupon: async (payload: CreateCouponPayload): Promise<AdminApiResponse<Coupon>> => {
    return adminApiRequest("/v1/admin/coupon/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // List coupons
  listCoupons: async (params: ListParams = {}): Promise<AdminApiResponse<{ items: Coupon[]; total: number }>> => {
    const query = new URLSearchParams();
    if (params.search) query.set("search", params.search);
    if (params.page) query.set("page", String(params.page));
    if (params.limit) query.set("limit", String(params.limit));
    const qs = query.toString();
    return adminApiRequest(`/v1/admin/coupons${qs ? `?${qs}` : ""}`, {
      method: "GET",
    });
  },

  // Enable/disable a coupon
  toggleCouponStatus: async (id: string, enabled: boolean): Promise<AdminApiResponse<Coupon>> => {
    return adminApiRequest(`/v1/admin/coupons/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ enabled }),
    });
  },

  // Delete a coupon
  deleteCoupon: async (id: string): Promise<AdminApiResponse<{ id: string }>> => {
    return adminApiRequest(`/v1/admin/coupons/${id}`, {
      method: "DELETE",
    });
  },
};