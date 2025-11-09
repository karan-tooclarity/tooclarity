"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { adminDashboardAPI, type AdminInstitution, type PlanType } from "@/lib/admin-api";

export default function AdminDashboard() {
  // Form fields
  const [code, setCode] = React.useState("");
  const [discountedPercentage, setDiscountedPercentage] = React.useState<number | "">("");
  const [planType, setPlanType] = React.useState<PlanType | "">("");
  const [institutionsSelected, setInstitutionsSelected] = React.useState<string[]>([]);
  const [maxUses, setMaxUses] = React.useState<number | "">("");

  // Map for displaying selected institution names by id
  const [selectedInstitutionNames, setSelectedInstitutionNames] = React.useState<Record<string, string>>({});

  // UX states
  const [message, setMessage] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Institution search (debounced typeahead)
  const [institutionQuery, setInstitutionQuery] = React.useState("");
  const [institutionResults, setInstitutionResults] = React.useState<AdminInstitution[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchError, setSearchError] = React.useState<string | null>(null);

  const resetMessageSoon = () => setTimeout(() => setMessage(null), 3000);

  // Debounced search effect
  React.useEffect(() => {
    const runSearch = async () => {
      const term = institutionQuery.trim();
      setSearchError(null);

      if (term.length < 2) {
        setInstitutionResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      const res = await adminDashboardAPI.listInstitutions({ search: term, limit: 10, page: 1 });

      if (res.success) {
        const raw: unknown = res.data;
        let items: AdminInstitution[] = [];

        // Handle different backend response shapes
        // 1) Array of institutions
        // 2) Object with { institutions: [...] }
        if (Array.isArray(raw)) {
          // Try to normalize fields if needed
          items = (raw as Array<Record<string, unknown>>).map((i) => ({
            id: String(i.id || i._id || i.uuid || ""),
            name: String(i.name || i.instituteName || ""),
          }));
        } else if (raw && Array.isArray((raw as { institutions?: unknown[] }).institutions)) {
          items = ((raw as { institutions: Array<Record<string, unknown>> }).institutions).map((i) => ({
            id: String(i.id || i._id || i.uuid || ""),
            name: String(i.name || i.instituteName || ""),
          }));
        }

        setInstitutionResults(items.filter((x) => x.id && x.name));
      } else {
        setInstitutionResults([]);
        setSearchError(res.message || "Failed to search institutions");
      }
      setIsSearching(false);
    };

    // debounce 400ms
    const timer = window.setTimeout(runSearch, 400);
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [institutionQuery]);

  const handleSelectInstitution = (inst: AdminInstitution) => {
    setInstitutionsSelected((prev) => (prev.includes(inst.id) ? prev : [...prev, inst.id]));
    setSelectedInstitutionNames((prev) => ({ ...prev, [inst.id]: inst.name }));
    // Optionally clear the query after selection
    setInstitutionQuery("");
    setInstitutionResults([]);
  };

  const handleRemoveInstitution = (id: string) => {
    setInstitutionsSelected((prev) => prev.filter((x) => x !== id));
    setSelectedInstitutionNames((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const getSelectedInstitutionName = React.useCallback(
    (id: string) => selectedInstitutionNames[id] || institutionResults.find((x) => x.id === id)?.name,
    [selectedInstitutionNames, institutionResults]
  );

  const validate = (): string | null => {
    if (!code.trim()) return "Enter coupon code.";
    if (discountedPercentage === "" || discountedPercentage < 0 || discountedPercentage > 100)
      return "Discount percent must be between 0 and 100.";
    if (!planType) return "Select a plan type.";
    if (!institutionsSelected.length) return "Select at least one institution.";
    if (maxUses === "" || maxUses <= 0) return "Enter valid max uses (>=1).";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const err = validate();
    if (err) {
      setMessage(err);
      return resetMessageSoon();
    }

    const payload = {
      code: code.trim(),
      discountedPercentage: Number(discountedPercentage),
      planType: planType as PlanType,
      institutionIds: institutionsSelected, // send IDs only
      maxUses: Number(maxUses),
    };

    setIsSubmitting(true);
    const res = await adminDashboardAPI.createCoupon(payload);
    setIsSubmitting(false);

    if (res.success) {
      setMessage("Coupon created successfully.");
      // Optional: Reset form
      setCode("");
      setDiscountedPercentage("");
      setPlanType("");
      setInstitutionsSelected([]);
      setSelectedInstitutionNames({});
      setInstitutionQuery("");
      setInstitutionResults([]);
      setMaxUses("");
    } else {
      setMessage(res.message || "Failed to create coupon.");
    }
    resetMessageSoon();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Generate Coupon</h1>

          {message && (
            <div className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-2">
              {message}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Coupon Code */}
            <div className="space-y-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                placeholder="e.g., WELCOME25"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                maxLength={32}
                required
              />
            </div>

            {/* Discount Percentage */}
            <div className="space-y-2">
              <Label htmlFor="discount">Discounted Percentage</Label>
              <Input
                id="discount"
                type="number"
                placeholder="0 - 100"
                min={0}
                max={100}
                value={discountedPercentage}
                onChange={(e) => setDiscountedPercentage(e.target.value === "" ? "" : Number(e.target.value))}
                required
              />
            </div>

            {/* Plan Type */}
            <div className="space-y-2">
              <Label>Plan Type</Label>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="planType"
                    value="monthly"
                    checked={planType === "monthly"}
                    onChange={() => setPlanType("monthly")}
                  />
                  <span>Monthly</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="planType"
                    value="yearly"
                    checked={planType === "yearly"}
                    onChange={() => setPlanType("yearly")}
                  />
                  <span>Yearly</span>
                </label>
              </div>
            </div>

            {/* Institutions Search (Debounced Typeahead + Multi-select) */}
            <div className="space-y-2 relative">
              <Label htmlFor="institutions">Institutions</Label>

              {/* Search input */}
              <Input
                id="institutions"
                placeholder="Type to search institutions (min 2 chars)"
                value={institutionQuery}
                onChange={(e) => setInstitutionQuery(e.target.value)}
                autoComplete="off"
              />

              {/* Suggestions dropdown */}
              {institutionQuery.trim().length >= 2 && (
                <div className="absolute z-10 mt-1 w-full bg-white shadow-md rounded-[12px] border border-[#DADADD] max-h-60 overflow-auto">
                  {isSearching && (
                    <div className="px-4 py-2 text-sm text-gray-500">Searching...</div>
                  )}
                  {searchError && !isSearching && (
                    <div className="px-4 py-2 text-sm text-red-600">{searchError}</div>
                  )}
                  {!isSearching && !searchError && institutionResults.length === 0 && (
                    <div className="px-4 py-2 text-sm text-gray-500">No results</div>
                  )}

                  {!isSearching && !searchError && institutionResults.map((i) => {
                    const selected = institutionsSelected.includes(i.id);
                    return (
                      <button
                        key={i.id}
                        type="button"
                        className={`w-full text-left px-4 py-2 hover:bg-[#F5F6F9] ${selected ? "text-gray-400" : "text-black"}`}
                        onClick={() => !selected && handleSelectInstitution(i)}
                        disabled={selected}
                        aria-disabled={selected}
                        title={selected ? "Already selected" : "Add institution"}
                      >
                        {i.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Selected chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {institutionsSelected.map((id) => (
                  <span
                    key={id}
                    className="inline-flex items-center gap-2 px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                  >
                    {getSelectedInstitutionName(id) || id}
                    <button
                      type="button"
                      className="text-blue-700 hover:text-blue-900"
                      onClick={() => handleRemoveInstitution(id)}
                      aria-label={`Remove ${getSelectedInstitutionName(id) || id}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Max Uses */}
            <div className="space-y-2">
              <Label htmlFor="maxUses">Max Uses</Label>
              <Input
                id="maxUses"
                type="number"
                min={1}
                placeholder="e.g., 100"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value === "" ? "" : Number(e.target.value))}
                required
              />
            </div>

            <div className="pt-2">
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Coupon"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}