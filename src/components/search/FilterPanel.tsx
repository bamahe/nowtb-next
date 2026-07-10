// src/components/search/FilterPanel.tsx
// Slide-out overlay panel from the right edge. Contains accordion sections for
// status, property details, price reduction, other attributes, and keyword search.
// Changes are batched locally and only applied when the user clicks "Apply".
"use client";

import { useState } from "react";
import { X, ChevronDown } from "lucide-react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  /** Current active URL search params as key-value pairs */
  currentFilters: Record<string, string>;
  /** Called with the updated filter delta when user clicks Apply */
  onApply: (filters: Record<string, string | null>) => void;
  /** Called when user clicks Reset — clears everything */
  onReset: () => void;
}

// ── Accordion section wrapper — each section expands/collapses independently ──
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left
                   font-body text-sm font-semibold text-primary hover:bg-light transition-colors"
        aria-expanded={open}
      >
        {title}
        {/* Arrow rotates 180° when open */}
        <ChevronDown className={`w-4 h-4 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </div>
  );
}

// ── Checkbox filter row — controlled checkbox with label ──
function CheckFilter({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm font-body text-primary/80">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-accent"
      />
      {label}
    </label>
  );
}

export default function FilterPanel({ isOpen, onClose, currentFilters, onApply, onReset }: FilterPanelProps) {
  // Local state holds pending changes — nothing updates the URL until Apply is clicked
  const [local, setLocal] = useState<Record<string, string | null>>({});

  /**
   * Read a filter value: prefer the pending local change, fall back to current URL param.
   * Returns empty string if neither is set.
   */
  function getVal(key: string): string {
    return (local[key] !== undefined ? local[key] : currentFilters[key]) || "";
  }

  /** Read a boolean filter — returns true only if value is the string "true" */
  function getBool(key: string): boolean {
    const v = local[key] !== undefined ? local[key] : currentFilters[key];
    return v === "true";
  }

  /** Stage a filter change locally (won't apply until Apply button is clicked) */
  function set(key: string, val: string | null) {
    setLocal((prev) => ({ ...prev, [key]: val || null }));
  }

  /** Apply all staged changes to the URL and close the panel */
  function handleApply() {
    onApply(local);
    setLocal({});
    onClose();
  }

  /** Clear all staged changes and all active filters, then close the panel */
  function handleReset() {
    setLocal({});
    onReset();
    onClose();
  }

  // Don't render anything when panel is closed (keeps DOM clean)
  if (!isOpen) return null;

  return (
    <>
      {/* ── Backdrop — clicking it closes the panel ── */}
      <div className="fixed inset-0 bg-black/40 z-[100]" onClick={onClose} aria-hidden="true" />

      {/* ── Slide-in panel — comes in from the right ── */}
      <div
        className="fixed top-0 right-0 bottom-0 w-full max-w-[400px] bg-white z-[101]
                   shadow-2xl flex flex-col animate-slide-in-right"
        role="dialog"
        aria-label="More Filters"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-body text-sm font-semibold text-primary">More Filters</span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-light rounded transition-colors"
            aria-label="Close filters"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>

        {/* ── Scrollable accordion sections ── */}
        <div className="flex-1 overflow-y-auto">

          {/* Listing Status & Activity */}
          <Section title="Listing Status &amp; Activity">
            <CheckFilter
              label="Active"
              checked={getVal("status") === "" || getVal("status") === "Active"}
              onChange={() => set("status", "Active")}
            />
            <CheckFilter
              label="Pending"
              checked={getVal("status") === "Pending"}
              onChange={() => set("status", "Pending")}
            />
            <CheckFilter
              label="Coming Soon"
              checked={getVal("status") === "Coming Soon"}
              onChange={() => set("status", "Coming Soon")}
            />
          </Section>

          {/* Property Details */}
          <Section title="Property Details">
            <CheckFilter
              label="Pool"
              checked={getBool("pool")}
              onChange={(v) => set("pool", v ? "true" : null)}
            />
            <CheckFilter
              label="Waterfront"
              checked={getBool("waterfront")}
              onChange={(v) => set("waterfront", v ? "true" : null)}
            />
            <CheckFilter
              label="New Construction"
              checked={getBool("new_construction")}
              onChange={(v) => set("new_construction", v ? "true" : null)}
            />
            <CheckFilter
              label="Single Story"
              checked={getBool("single_story")}
              onChange={(v) => set("single_story", v ? "true" : null)}
            />
            {/* Sq ft range inputs */}
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Min Sq Ft</label>
              <input
                type="number"
                value={getVal("min_sqft")}
                onChange={(e) => set("min_sqft", e.target.value || null)}
                placeholder="No minimum"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body
                           focus:outline-none focus:border-accent"
              />
            </div>
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Max Sq Ft</label>
              <input
                type="number"
                value={getVal("max_sqft")}
                onChange={(e) => set("max_sqft", e.target.value || null)}
                placeholder="No maximum"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body
                           focus:outline-none focus:border-accent"
              />
            </div>
            {/* Year built minimum */}
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Year Built (min)</label>
              <input
                type="number"
                value={getVal("min_year")}
                onChange={(e) => set("min_year", e.target.value || null)}
                placeholder="Any year"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body
                           focus:outline-none focus:border-accent"
              />
            </div>
          </Section>

          {/* Price Reduction */}
          <Section title="Price Reduction">
            <CheckFilter
              label="Price reduced only"
              checked={getBool("price_reduced")}
              onChange={(v) => set("price_reduced", v ? "true" : null)}
            />
          </Section>

          {/* Other Property Attributes */}
          <Section title="Other Property Attributes">
            <CheckFilter
              label="55+ Community"
              checked={getBool("senior")}
              onChange={(v) => set("senior", v ? "true" : null)}
            />
            <CheckFilter
              label="Garage"
              checked={getBool("garage")}
              onChange={(v) => set("garage", v ? "true" : null)}
            />
            <CheckFilter
              label="Open House"
              checked={getBool("open_house")}
              onChange={(v) => set("open_house", v ? "true" : null)}
            />
          </Section>

          {/* Keyword Search */}
          <Section title="Keyword Search">
            <div className="space-y-1">
              <label className="font-body text-xs text-muted">Search listing remarks</label>
              <input
                type="text"
                value={getVal("keyword")}
                onChange={(e) => set("keyword", e.target.value || null)}
                placeholder="e.g. renovated, lake view, chef kitchen"
                className="w-full border border-border rounded px-3 py-1.5 text-sm font-body
                           focus:outline-none focus:border-accent"
              />
            </div>
          </Section>
        </div>

        {/* ── Footer: Reset and Apply buttons ── */}
        <div className="border-t border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={handleReset}
            className="flex-1 font-body text-sm font-semibold text-muted hover:text-primary
                       py-2.5 border border-border rounded transition-colors"
          >
            Reset All Filters
          </button>
          <button
            onClick={handleApply}
            className="flex-1 font-body text-sm font-semibold text-white bg-primary
                       py-2.5 rounded hover:bg-primary/90 transition-colors"
          >
            Apply and View Results
          </button>
        </div>
      </div>
    </>
  );
}
