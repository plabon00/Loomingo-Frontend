"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { InvoiceHtmlPreview } from "./InvoiceHtmlPreview";

// A4 at 96dpi
export const A4_WIDTH = 794;
export const A4_HEIGHT = 1123;

/**
 * Renders children designed at fixed A4 size (794x1123) and scales them
 * to fit the container width. The container keeps the A4 aspect ratio,
 * so previews always fit without zoom or crop on any device.
 */
export function ScaledA4({ children, className = "" }: { children: ReactNode; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / A4_WIDTH);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden bg-white ${className}`}
      style={{ aspectRatio: `${A4_WIDTH} / ${A4_HEIGHT}` }}
    >
      {scale > 0 && (
        <div
          style={{
            width: A4_WIDTH,
            height: A4_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <div className="w-full h-full overflow-hidden bg-white">{children}</div>
        </div>
      )}
    </div>
  );
}

// ------------------------------------------------------------------
// Sample data used only to render template thumbnails (mock values)
// ------------------------------------------------------------------
const SAMPLE_INVOICE_DATA = {
  brandName: "Aurelia Skincare",
  billingAddress: "2nd Floor, 100ft Road, Indiranagar, Bengaluru 560038",
  gstin: "29ABCDE1234F1Z5",
  pan: "",
  contact: "",
  igUserName: "ananya.creates",
  invoiceNumber: "ANA-014",
  liveDate: "2026-07-01",
  currency: "INR",
  campaignName: "Monsoon Glow Launch",
  deliverables: "Instagram Reel, Instagram Story",
};

const SAMPLE_LINE_ITEMS = [
  { no: 1, type: "Reels", name: "Instagram Reel Content & Promotion", quantity: 1, price: 18500 },
  { no: 2, type: "Story", name: "Instagram Story Content & Promotion", quantity: 2, price: 4500 },
];

const SAMPLE_CREATOR_SETTINGS = {
  creatorName: "Ananya Verma",
  creatorEmail: "hello@ananyaverma.in",
  creatorAddress: "Flat 4B, Palm Meadows, Whitefield, Bengaluru",
  phone: "+91 98452 17390",
  payoutDetails: {
    bankName: "HDFC Bank",
    accountName: "Ananya Verma",
    accountNumber: "50100234871265",
    ifscCode: "HDFC0001234",
    accountType: "Savings",
    upiId: "ananya@okhdfcbank",
  },
};

/** Exact, scaled-down render of a template using sample data. */
export function TemplateThumbnail({ templateId, className = "" }: { templateId: number; className?: string }) {
  return (
    <ScaledA4 className={`pointer-events-none select-none ${className}`}>
      <InvoiceHtmlPreview
        invoiceData={{ ...SAMPLE_INVOICE_DATA, templateId }}
        lineItems={SAMPLE_LINE_ITEMS}
        creatorSettings={SAMPLE_CREATOR_SETTINGS}
      />
    </ScaledA4>
  );
}

/**
 * Builds InvoiceHtmlPreview props from a saved invoice record when the
 * record carries enough data. Returns null when a client-side render
 * is not possible (caller should fall back to the PDF).
 */
export function buildInvoicePreviewData(inv: any): { invoiceData: any; lineItems: any[] } | null {
  if (!inv) return null;
  const d = inv.invoiceData || inv;
  const lineItems = Array.isArray(d.lineItems) ? d.lineItems : Array.isArray(inv.lineItems) ? inv.lineItems : null;
  if (!lineItems || lineItems.length === 0) return null;
  return {
    invoiceData: {
      templateId: Number(d.templateId) || 1,
      brandName: d.brandName || inv.brandName || "",
      billingAddress: d.billingAddress || "",
      gstin: d.gstin || "",
      pan: d.pan || "",
      contact: d.contact || "",
      brandEmail: d.brandEmail || d.email || "",
      igUserName: d.igUserName || "",
      invoiceNumber: inv.invoiceNumber || d.invoiceNumber || "",
      liveDate: d.liveDate || "",
      currency: d.currency || "INR",
      campaignName: d.campaignName || inv.campaignName || "",
      deliverables: d.deliverables || "",
    },
    lineItems,
  };
}
