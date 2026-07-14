import React from 'react';

type InvoiceData = {
  templateId: number;
  brandName: string;
  billingAddress: string;
  gstin?: string;
  pan?: string;
  contact?: string;
  igUserName: string;
  liveDate: string;
  currency: string;
  campaignName: string;
  deliverables?: string;
};

type LineItem = {
  no: number;
  type: string;
  name: string;
  quantity: number;
  price: number;
};

type CreatorSettings = {
  creatorName?: string;
  creatorEmail?: string;
  creatorAddress?: string;
  payoutDetails?: any;
  name?: string;
  address?: string;
  email?: string;
  phone?: string;
  accountName?: string;
  accountNumber?: string;
  ifscCode?: string;
  bankName?: string;
  upiId?: string;
  accountType?: string;
};

interface Props {
  invoiceData: InvoiceData;
  lineItems: LineItem[];
  creatorSettings: CreatorSettings | null;
}

const getCurrencySymbol = (currency: string) => {
  return currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '₹';
};

const calculateTotal = (items: LineItem[]) => {
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0).toFixed(2);
};

// Universal Components
const Watermark = () => {
  const url = process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL || 'https://invoice-microservice.vercel.app';
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      <img src={`${url}/watermark.png`} alt="Watermark" className="w-3/5 opacity-15 select-none" />
    </div>
  );
};

const LoomingoFooter = ({ color = "text-gray-500" }: { color?: string }) => {
  return (
    <div className={`text-[8px] text-center mt-8 z-10 relative ${color}`}>
      <p>© {new Date().getFullYear()} Loomingo. All Rights Reserved.</p>
      <p className="mt-0.5">Built with ❤️</p>
    </div>
  );
};

// ------------------------------------------
// TEMPLATE 1: Modern Teal
// ------------------------------------------
const Template1 = ({ invoiceData, lineItems, creatorSettings }: Props) => {
  const symbol = getCurrencySymbol(invoiceData.currency);
  const payout = creatorSettings?.payoutDetails || {};
  const cs = creatorSettings || {};

  return (
    <div className="bg-white p-8 relative min-h-full font-sans text-gray-800 text-xs">
      <Watermark />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-4xl font-light text-[#129b9e] tracking-widest">INVOICE</h1>
          <div className="border border-gray-800 w-40 text-[10px]">
            <div className="border-b border-gray-800 px-2 py-1">
              Date: {invoiceData.liveDate ? new Date(invoiceData.liveDate).toLocaleDateString() : new Date().toLocaleDateString()}
            </div>
            <div className="px-2 py-1">
              Invoice No: {invoiceData.igUserName ? `${invoiceData.igUserName.substring(0,3).toUpperCase()}-001` : 'INV-001'}
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-6">
          <div className="w-[45%]">
            <div className="bg-[#edf6f7] px-2 py-1 font-bold text-[10px] inline-block mb-2">FROM</div>
            <p className="font-bold mb-1 uppercase">{cs.creatorName || cs.name || 'Your Name'}</p>
            <p className="text-[10px] text-gray-600 leading-tight">Address: {cs.creatorAddress || cs.address || 'Your Address'}</p>
            <p className="text-[10px] text-gray-600 leading-tight">Email: {cs.creatorEmail || cs.email || 'Your Email'}</p>
            <p className="text-[10px] text-gray-600 leading-tight">Contact: {cs.phone || 'Your Phone'}</p>
            {payout.pan && <p className="text-[10px] text-gray-600 leading-tight">PAN: {payout.pan}</p>}
          </div>
          <div className="w-[45%]">
            <div className="bg-[#edf6f7] px-2 py-1 font-bold text-[10px] inline-block mb-2">BILL TO</div>
            <p className="font-bold mb-1 uppercase">{invoiceData.brandName || 'Brand Name'}</p>
            <p className="text-[10px] text-gray-600 leading-tight">{invoiceData.billingAddress || 'Brand Address'}</p>
            {invoiceData.pan && <p className="text-[10px] text-gray-600 leading-tight">PAN: {invoiceData.pan}</p>}
            {invoiceData.gstin && <p className="text-[10px] text-gray-600 leading-tight">GSTIN: {invoiceData.gstin}</p>}
          </div>
        </div>

        <div className="border border-gray-800 mb-6">
          <div className="flex bg-[#edf6f7] border-b border-gray-800 font-bold text-center py-1.5 text-[10px]">
            <div className="w-[10%] border-r border-gray-800">SL</div>
            <div className="w-[65%] border-r border-gray-800 text-left px-2">Description</div>
            <div className="w-[25%]">Amount</div>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex border-b border-gray-800 py-1.5 text-[10px]">
              <div className="w-[10%] border-r border-gray-800 text-center">{i + 1}</div>
              <div className="w-[65%] border-r border-gray-800 px-2">
                <p className="font-bold">{item.name}</p>
                {item.quantity > 1 && <p className="text-[9px] text-gray-500">Qty: {item.quantity}</p>}
              </div>
              <div className="w-[25%] text-center">{symbol}{(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
          <div className="flex bg-[#edf6f7] font-bold py-1.5 text-[10px]">
            <div className="w-[75%] border-r border-gray-800 px-2 text-right">Total</div>
            <div className="w-[25%] text-center">{symbol}{calculateTotal(lineItems)}</div>
          </div>
        </div>

        <div className="border border-gray-800 mb-6">
          <div className="bg-[#edf6f7] border-b border-gray-800 text-center py-1 font-bold text-[10px]">Details & Information</div>
          <div className="flex p-2">
            <div className="w-1/2 border-r border-gray-300 pr-2">
              <p className="font-bold text-[#129b9e] text-[10px] mb-1">Campaign Details</p>
              {invoiceData.campaignName && <p className="text-[9px] text-gray-600 leading-tight">Name: {invoiceData.campaignName}</p>}
              <p className="text-[9px] text-gray-600 leading-tight">Instagram Handle: @{invoiceData.igUserName || 'username'}</p>
              <p className="text-[9px] text-gray-600 leading-tight">Deliverables: {invoiceData.deliverables || 'N/A'}</p>
              <p className="text-[9px] text-gray-600 leading-tight">Live date: {invoiceData.liveDate ? new Date(invoiceData.liveDate).toLocaleDateString() : 'TBD'}</p>
            </div>
            <div className="w-1/2 pl-2">
              <p className="font-bold text-[#129b9e] text-[10px] mb-1">Bank Details</p>
              <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold">Bank:</span> {payout.bankName || cs.bankName || 'N/A'}</p>
              <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold">Bank Holder:</span> {payout.accountName || cs.accountName || 'N/A'}</p>
              <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold">A/C no:</span> {payout.accountNumber || cs.accountNumber || 'N/A'}</p>
              <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold">IFSC:</span> {payout.ifscCode || cs.ifscCode || 'N/A'}</p>
              <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold">A/C Type:</span> {payout.accountType || cs.accountType || 'Savings'}</p>
              {(payout.upiId || cs.upiId) && <p className="text-[9px] text-gray-600 leading-tight"><span className="font-bold">UPI ID:</span> {payout.upiId || cs.upiId}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 mb-2">
          <div className="w-32 text-center">
            {payout.signatureUrl ? (
              <img src={payout.signatureUrl} alt="Signature" className="h-10 w-full object-contain border-b border-gray-800 mb-1" />
            ) : (
              <div className="h-10 border-b border-gray-800 mb-1"></div>
            )}
            <p className="text-[10px] font-bold">Signature</p>
          </div>
        </div>

        <p className="text-center text-[9px] italic text-gray-500 mt-2">Please send payment within 30 days of receiving this invoice. 100% amount payable after the reel going live.</p>
        
        <LoomingoFooter />
      </div>
    </div>
  );
};

// ------------------------------------------
// TEMPLATE 2: Retro Beige
// ------------------------------------------
const Template2 = ({ invoiceData, lineItems, creatorSettings }: Props) => {
  const symbol = getCurrencySymbol(invoiceData.currency);
  const payout = creatorSettings?.payoutDetails || {};
  const cs = creatorSettings || {};

  return (
    <div className="bg-[#f7f4ec] p-8 relative min-h-full font-sans text-gray-900 text-xs">
      <Watermark />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="relative w-48 h-12">
            <div className="absolute top-3 left-2 right-[-8px] bottom-[-8px] bg-gray-400 z-0"></div>
            <div className="absolute top-1 left-[-4px] right-0 bottom-0 bg-[#fcd116] z-10"></div>
            <h1 className="absolute z-20 text-3xl font-bold p-1">Invoice</h1>
          </div>
          <p className="text-xl font-bold text-right uppercase w-48 leading-tight">{cs.creatorName || cs.name || 'CREATOR NAME'}</p>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-[45%]">
            <p className="text-[10px] font-bold tracking-wider mb-1">ISSUED TO:</p>
            <p className="text-[10px] leading-relaxed">{invoiceData.brandName || 'Brand Name'}</p>
            <p className="text-[10px] leading-relaxed">{invoiceData.billingAddress || 'Brand Address'}</p>
            {invoiceData.gstin && <p className="text-[10px] leading-relaxed">GSTIN: {invoiceData.gstin}</p>}
          </div>
          <div className="w-[45%] text-right">
            <p className="text-[10px] leading-relaxed">INVOICE NO: {invoiceData.igUserName ? `${invoiceData.igUserName.substring(0,3).toUpperCase()}-001` : 'INV-001'}</p>
            <p className="text-[10px] leading-relaxed">DATE: {new Date().toLocaleDateString()}</p>
            <p className="text-[10px] leading-relaxed">DUE DATE: Upon Receipt</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-[45%]">
            <p className="text-[10px] font-bold tracking-wider mb-1">FROM:</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Name:</span> {cs.creatorName || cs.name || 'Your Name'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Address:</span> {cs.creatorAddress || cs.address || 'Your Address'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Email:</span> {cs.creatorEmail || cs.email || 'Your Email'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Contact:</span> {cs.phone || 'Your Phone'}</p>
          </div>
          <div className="w-[45%]">
            <p className="text-[10px] font-bold tracking-wider mb-1">PAY TO:</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Bank:</span> {payout.bankName || cs.bankName || 'N/A'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Bank Holder:</span> {payout.accountName || cs.accountName || 'N/A'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">A/C no:</span> {payout.accountNumber || cs.accountNumber || 'N/A'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">IFSC:</span> {payout.ifscCode || cs.ifscCode || 'N/A'}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">A/C Type:</span> {payout.accountType || cs.accountType || 'Savings'}</p>
            {(payout.upiId || cs.upiId) && <p className="text-[10px] leading-relaxed"><span className="font-bold">UPI ID:</span> {payout.upiId || cs.upiId}</p>}
          </div>
        </div>

        <div className="w-full mb-6">
          <div className="flex border-b border-gray-900 pb-1 mb-2">
            <div className="w-[50%] text-[10px] font-bold tracking-wider">DESCRIPTION</div>
            <div className="w-[16%] text-[10px] font-bold tracking-wider text-center">UNIT PRICE</div>
            <div className="w-[16%] text-[10px] font-bold tracking-wider text-center">QTY</div>
            <div className="w-[18%] text-[10px] font-bold tracking-wider text-right">TOTAL</div>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex py-1">
              <div className="w-[50%] text-[10px]">{item.name}</div>
              <div className="w-[16%] text-[10px] text-center">{item.price}</div>
              <div className="w-[16%] text-[10px] text-center">{item.quantity || 1}</div>
              <div className="w-[18%] text-[10px] text-right">{symbol}{(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-900 pt-2 flex flex-col items-end">
          <div className="flex justify-end w-48 mb-1">
            <div className="w-24 text-[10px] text-right pr-4">SUBTOTAL</div>
            <div className="w-24 text-[10px] text-right">{symbol}{calculateTotal(lineItems)}</div>
          </div>
          <div className="flex justify-end w-48 mb-1">
            <div className="w-24 text-[10px] text-right pr-4">Tax</div>
            <div className="w-24 text-[10px] text-right">0%</div>
          </div>
          <div className="flex justify-end w-48 font-bold">
            <div className="w-24 text-[10px] text-right pr-4">TOTAL</div>
            <div className="w-24 text-[10px] text-right">{symbol}{calculateTotal(lineItems)}</div>
          </div>
        </div>

        <div className="flex justify-end mt-8 mb-10">
          <div className="w-32 text-center">
            {payout.signatureUrl ? (
              <img src={payout.signatureUrl} alt="Signature" className="h-10 w-full object-contain border-b border-gray-900 mb-1" />
            ) : (
              <div className="h-10 border-b border-gray-900 mb-1"></div>
            )}
            <p className="text-[10px] font-bold text-gray-900">Signature</p>
          </div>
        </div>

        <p className="text-[10px] font-bold tracking-wider text-left mb-4">THANK YOU FOR YOUR BUSINESS!</p>
        
        <LoomingoFooter color="text-gray-600" />
      </div>
    </div>
  );
};


// ------------------------------------------
// TEMPLATE 3: Teal Ribbon
// ------------------------------------------
const Template3 = ({ invoiceData, lineItems, creatorSettings }: Props) => {
  const symbol = getCurrencySymbol(invoiceData.currency);
  const payout = creatorSettings?.payoutDetails || {};
  const cs = creatorSettings || {};

  return (
    <div className="bg-white px-12 pt-20 pb-16 relative min-h-full font-sans text-gray-800 text-xs">
      <Watermark />
      
      {/* Top Ribbons */}
      <div className="absolute top-5 left-0 w-full h-8 z-0">
        <div className="absolute top-0 left-0 w-[90%] h-4 bg-[#008b8b]"></div>
        <div className="absolute top-4 left-0 w-[70%] h-4 bg-[#222]"></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 rounded-full bg-[#008b8b] mr-3 shrink-0"></div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">{cs.creatorName || cs.name || 'Creator'}</h1>
            <p className="text-[10px] text-gray-500">Digital Creator & Partner</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-[45%]">
            <p className="text-[10px] font-bold tracking-wider mb-1">ISSUED TO:</p>
            <p className="text-[10px] leading-relaxed">{invoiceData.brandName || 'Brand Name'}</p>
            <p className="text-[10px] leading-relaxed">{invoiceData.billingAddress || 'Brand Address'}</p>
          </div>
          <div className="w-[45%] text-right">
            <p className="text-[10px] leading-relaxed">INVOICE NO: {invoiceData.igUserName ? `${invoiceData.igUserName.substring(0,3).toUpperCase()}-001` : 'INV-001'}</p>
            <p className="text-[10px] leading-relaxed">DATE: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-[45%]">
            <p className="text-[10px] font-bold tracking-wider mb-1">FROM:</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Name:</span> {cs.creatorName || cs.name}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Address:</span> {cs.creatorAddress || cs.address}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Email:</span> {cs.creatorEmail || cs.email}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Contact:</span> {cs.phone}</p>
          </div>
          <div className="w-[45%]">
            <p className="text-[10px] font-bold tracking-wider mb-1">PAY TO:</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Bank:</span> {payout.bankName || cs.bankName}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">Bank Holder:</span> {payout.accountName || cs.accountName}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">A/C no:</span> {payout.accountNumber || cs.accountNumber}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">IFSC:</span> {payout.ifscCode || cs.ifscCode}</p>
            <p className="text-[10px] leading-relaxed"><span className="font-bold">A/C Type:</span> {payout.accountType || cs.accountType || 'Savings'}</p>
          </div>
        </div>

        <div className="w-full mt-5">
          <div className="flex border-t-2 border-b border-gray-900 py-2">
            <div className="w-[50%] text-[10px] font-bold tracking-wider">DESCRIPTION</div>
            <div className="w-[20%] text-[10px] font-bold tracking-wider text-center">UNIT PRICE</div>
            <div className="w-[20%] text-[10px] font-bold tracking-wider text-center">QTY</div>
            <div className="w-[30%] text-[10px] font-bold tracking-wider text-right">TOTAL</div>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex py-2">
              <div className="w-[50%] text-[10px] text-gray-700">{item.name}</div>
              <div className="w-[20%] text-[10px] text-center text-gray-700">{item.price}</div>
              <div className="w-[20%] text-[10px] text-center text-gray-700">{item.quantity || 1}</div>
              <div className="w-[30%] text-[10px] text-right text-gray-700">{symbol}{(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-gray-900 pt-3 mt-3 flex flex-col items-end">
          <div className="flex justify-end w-48 mb-1">
            <div className="w-24 text-[10px] text-right pr-4">SUBTOTAL</div>
            <div className="w-24 text-[10px] text-right font-bold">{symbol}{calculateTotal(lineItems)}</div>
          </div>
          <div className="flex justify-end w-48 mb-1">
            <div className="w-24 text-[10px] text-right pr-4">Tax</div>
            <div className="w-24 text-[10px] text-right font-bold">0%</div>
          </div>
          <div className="flex justify-end w-48">
            <div className="w-24 text-[10px] text-right pr-4 font-bold">TOTAL</div>
            <div className="w-24 text-[10px] text-right font-bold">{symbol}{calculateTotal(lineItems)}</div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-10">
          <p className="text-base text-gray-900 w-1/2 font-serif italic">Thank you for your<br/>business!</p>
          <div className="w-[40%] text-center flex flex-col items-center">
            {payout.signatureUrl ? (
              <img src={payout.signatureUrl} alt="Signature" className="h-10 w-32 object-contain border-b border-gray-900 mb-1" />
            ) : (
              <div className="h-10 w-32 border-b border-gray-900 mb-1"></div>
            )}
            <p className="text-[10px] font-bold">Signature</p>
          </div>
        </div>
        
        <LoomingoFooter color="text-gray-500" />
      </div>

      {/* Bottom Ribbons */}
      <div className="absolute bottom-5 right-0 w-full h-8 z-0 flex flex-col items-end">
        <div className="w-[70%] h-4 bg-[#222]"></div>
        <div className="w-[90%] h-4 bg-[#008b8b]"></div>
      </div>
    </div>
  );
};


// ------------------------------------------
// TEMPLATE 4: Blue Wave
// ------------------------------------------
const Template4 = ({ invoiceData, lineItems, creatorSettings }: Props) => {
  const symbol = getCurrencySymbol(invoiceData.currency);
  const payout = creatorSettings?.payoutDetails || {};
  const cs = creatorSettings || {};

  return (
    <div className="bg-white relative min-h-full font-sans text-gray-800 text-xs flex flex-col">
      <Watermark />
      
      {/* Wave Header */}
      <div className="w-full h-44 relative bg-[#0f4c81] shrink-0 overflow-hidden">
        <div className="absolute top-10 left-10 right-10 flex justify-between z-10">
          <h1 className="text-4xl text-white font-bold tracking-wider">INVOICE</h1>
          <p className="text-white text-base mt-4">NO: {invoiceData.invoiceNumber || 'INV-001'}</p>
        </div>
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full h-full preserve-3d" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L80,85.3C160,107,320,149,480,144C640,139,800,85,960,69.3C1120,53,1280,75,1360,85.3L1440,96L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <div className="px-10 pt-4 flex-1 relative z-10 pb-10">
        <div className="flex justify-between mb-5">
          <div className="w-[45%]">
            <p className="text-base font-bold text-gray-900 mb-1">Bill To:</p>
            <p className="text-[11px] text-gray-600 leading-relaxed">{invoiceData.brandName}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed">{invoiceData.billingAddress}</p>
          </div>
          <div className="w-[45%] text-right">
            <p className="text-base font-bold text-gray-900 mb-1">From:</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">Name: </span>{cs.creatorName || cs.name}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">Address: </span>{cs.creatorAddress || cs.address}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">Email: </span>{cs.creatorEmail || cs.email}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">Contact: </span>{cs.phone}</p>
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-5">Date: {new Date().toLocaleDateString()}</p>

        <div className="w-full border-t border-gray-300 mb-8">
          <div className="flex bg-[#0f4c81] text-white py-2 px-2">
            <div className="w-[50%] text-[10px] font-bold">Description</div>
            <div className="w-[15%] text-[10px] font-bold text-center">Qty</div>
            <div className="w-[20%] text-[10px] font-bold text-center">Price</div>
            <div className="w-[15%] text-[10px] font-bold text-right">Total</div>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex py-2 px-2 border-b border-gray-300">
              <div className="w-[50%] text-[10px] text-gray-600">{item.name}</div>
              <div className="w-[15%] text-[10px] text-gray-600 text-center">{item.quantity || 1}</div>
              <div className="w-[20%] text-[10px] text-gray-600 text-center">{symbol}{item.price}</div>
              <div className="w-[15%] text-[10px] text-gray-600 text-right">{symbol}{(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mb-10">
          <div className="w-[40%] bg-[#0f4c81] p-3 flex justify-between text-white font-bold rounded-sm">
            <span>Sub Total</span>
            <span>{symbol}{calculateTotal(lineItems)}</span>
          </div>
        </div>

        <div className="flex justify-between items-end">
          <div className="w-[45%]">
            <p className="text-xs font-bold mb-1">Payment Information:</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">Bank: </span>{payout.bankName || cs.bankName}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">Bank Holder: </span>{payout.accountName || cs.accountName}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">A/C no: </span>{payout.accountNumber || cs.accountNumber}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">IFSC: </span>{payout.ifscCode || cs.ifscCode}</p>
            <p className="text-[11px] text-gray-600 leading-relaxed"><span className="font-bold">A/C Type: </span>{payout.accountType || cs.accountType}</p>
          </div>
          <div className="w-[45%] flex flex-col items-center">
            <div className="w-32 text-center">
              {payout.signatureUrl ? (
                <img src={payout.signatureUrl} alt="Signature" className="h-10 w-full object-contain border-b border-[#0f4c81] mb-1" />
              ) : (
                <div className="h-10 border-b border-[#0f4c81] mb-1"></div>
              )}
              <p className="text-[10px] font-bold text-[#0f4c81]">Signature</p>
            </div>
            <p className="text-2xl text-[#0f4c81] mt-4 font-serif italic">Thank You!</p>
          </div>
        </div>
        
        <LoomingoFooter color="text-gray-500" />
      </div>
    </div>
  );
};

// ------------------------------------------
// TEMPLATE 5: Minimal Gold
// ------------------------------------------
const Template5 = ({ invoiceData, lineItems, creatorSettings }: Props) => {
  const symbol = getCurrencySymbol(invoiceData.currency);
  const payout = creatorSettings?.payoutDetails || {};
  const cs = creatorSettings || {};

  return (
    <div className="bg-white p-10 pb-20 relative min-h-full font-sans text-gray-800 text-xs">
      <Watermark />
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center">
            {/* Simple Flower/Logo CSS */}
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute top-0 w-3 h-3 bg-[#e3c565] rounded-full"></div>
              <div className="absolute bottom-0 w-3 h-3 bg-[#e3c565] rounded-full"></div>
              <div className="absolute left-0 w-3 h-3 bg-[#e3c565] rounded-full"></div>
              <div className="absolute right-0 w-3 h-3 bg-[#e3c565] rounded-full"></div>
              <div className="absolute w-3 h-3 bg-[#d0af44] rounded-full z-10"></div>
            </div>
            <h1 className="text-xl font-bold ml-3 text-gray-900">{cs.creatorName || cs.name || 'Creator'}</h1>
          </div>
          <h1 className="text-3xl font-light tracking-widest text-gray-800">INVOICE</h1>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-[45%]">
            <p className="text-xs font-bold mb-2">Invoice to:</p>
            <p className="text-[11px] font-bold leading-relaxed">{invoiceData.brandName}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed">{invoiceData.billingAddress}</p>
          </div>
          <div className="w-[45%] flex flex-col items-end">
            <div className="flex mb-1">
              <p className="text-xs font-bold w-20">Invoice#</p>
              <p className="text-[10px] text-gray-700 w-20 text-right">{invoiceData.invoiceNumber || 'INV-001'}</p>
            </div>
            <div className="flex">
              <p className="text-xs font-bold w-20">Date</p>
              <p className="text-[10px] text-gray-700 w-20 text-right">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between mb-8">
          <div className="w-[45%]">
            <p className="text-xs font-bold mb-2">Billing From:</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Name: </span>{cs.creatorName || cs.name}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Address: </span>{cs.creatorAddress || cs.address}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Email: </span>{cs.creatorEmail || cs.email}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Contact: </span>{cs.phone}</p>
          </div>
        </div>

        <div className="w-full mb-8">
          <div className="flex border-y border-gray-900 py-2.5">
            <div className="w-[50%] text-[10px] font-bold">Item</div>
            <div className="w-[20%] text-[10px] font-bold text-center">Quantity</div>
            <div className="w-[20%] text-[10px] font-bold text-center">Unit Price</div>
            <div className="w-[30%] text-[10px] font-bold text-right">Total</div>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex py-2.5 border-b border-gray-200">
              <div className="w-[50%] text-[10px] text-gray-700">{item.name}</div>
              <div className="w-[20%] text-[10px] text-gray-700 text-center">{item.quantity || 1}</div>
              <div className="w-[20%] text-[10px] text-gray-700 text-center">{symbol}{item.price}</div>
              <div className="w-[30%] text-[10px] text-gray-700 text-right">{symbol}{(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <div className="w-[50%]">
            <p className="text-xs font-bold mb-2">PAYMENT METHOD</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Bank: </span>{payout.bankName || cs.bankName}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Bank Holder: </span>{payout.accountName || cs.accountName}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">A/C no: </span>{payout.accountNumber || cs.accountNumber}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">IFSC: </span>{payout.ifscCode || cs.ifscCode}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">A/C Type: </span>{payout.accountType || cs.accountType}</p>
          </div>
          <div className="w-[40%]">
            <div className="flex justify-between py-1">
              <span className="text-[10px] font-bold">Subtotal</span>
              <span className="text-[10px]">{symbol}{calculateTotal(lineItems)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-gray-900 pb-2.5">
              <span className="text-[10px] font-bold">Tax (0%)</span>
              <span className="text-[10px]">{symbol}0.00</span>
            </div>
            <div className="flex justify-between pt-2.5">
              <span className="text-base font-bold text-gray-900">Total</span>
              <span className="text-base font-bold text-gray-900">{symbol}{calculateTotal(lineItems)}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-end mt-10">
          <p className="text-sm text-gray-900 font-serif italic">Thank you for your business!</p>
          <div className="w-36 text-center">
            {payout.signatureUrl ? (
              <img src={payout.signatureUrl} alt="Signature" className="h-10 w-full object-contain border-b border-[#cca63f] mb-1" />
            ) : (
              <div className="h-10 border-b border-[#cca63f] mb-1"></div>
            )}
            <p className="text-[10px] font-bold text-[#cca63f]">Signature</p>
          </div>
        </div>
        
        <LoomingoFooter color="text-gray-500" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-[#e3c565] flex justify-center items-center text-white text-[10px] z-20">
        <span>Phone: {cs.phone || '+123-456-7890'}</span>
        <span className="mx-4">|</span>
        <span>{cs.creatorEmail || cs.email || 'hello@creator.com'}</span>
      </div>
    </div>
  );
};


// ------------------------------------------
// TEMPLATE 6: Dark Professional
// ------------------------------------------
const Template6 = ({ invoiceData, lineItems, creatorSettings }: Props) => {
  const symbol = getCurrencySymbol(invoiceData.currency);
  const payout = creatorSettings?.payoutDetails || {};
  const cs = creatorSettings || {};

  return (
    <div className="bg-white relative min-h-full font-sans text-gray-800 text-xs">
      <Watermark />
      
      {/* Top Wave Placeholder */}
      <div className="w-full h-20 bg-[#d9d9d9] shrink-0 overflow-hidden relative">
        <svg viewBox="0 0 1440 320" className="absolute top-0 w-full h-[200px]" preserveAspectRatio="none">
          <path fill="#ffffff" fillOpacity="1" d="M0,64L80,74.7C160,85,320,107,480,101.3C640,96,800,64,960,64C1120,64,1280,96,1360,112L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </div>

      <div className="px-10 pb-10 relative z-10 pt-4">
        <div className="flex justify-between items-end mb-5 -mt-5">
          <h1 className="text-3xl font-black tracking-tighter text-gray-900">INVOICE</h1>
          <p className="text-base font-bold text-gray-900 tracking-wider">#{invoiceData.invoiceNumber || 'INV-001'}</p>
        </div>

        <p className="text-[10px] mb-5"><span className="font-bold">Date:</span> {new Date().toLocaleDateString()}</p>

        <div className="flex justify-between mb-5">
          <div className="w-[45%]">
            <p className="text-[11px] font-bold mb-1.5">Billed to:</p>
            <p className="text-[10px] font-bold text-gray-800">{invoiceData.brandName}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed">{invoiceData.billingAddress}</p>
            {invoiceData.pan && <p className="text-[10px] text-gray-700 leading-relaxed">PAN: {invoiceData.pan}</p>}
            {invoiceData.gstin && <p className="text-[10px] text-gray-700 leading-relaxed">GSTIN: {invoiceData.gstin}</p>}
          </div>
          <div className="w-[45%]">
            <p className="text-[11px] font-bold mb-1.5">From:</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Name: </span>{cs.creatorName || cs.name}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Address: </span>{cs.creatorAddress || cs.address}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Email: </span>{cs.creatorEmail || cs.email}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Contact: </span>{cs.phone}</p>
          </div>
        </div>

        <div className="flex justify-between mb-5 gap-4">
          <div className="w-1/2 bg-[#fbfbfb] border-l-4 border-gray-900 p-2.5">
            <p className="text-[11px] font-bold mb-1">Campaign Details</p>
            {invoiceData.campaignName && <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Name:</span> {invoiceData.campaignName}</p>}
            <p className="text-[10px] text-gray-700 leading-relaxed">Instagram Handle: <span className="font-bold">@{invoiceData.igUserName}</span></p>
            <p className="text-[10px] text-gray-700 leading-relaxed">Deliverables: {invoiceData.deliverables}</p>
          </div>
          <div className="w-1/2 bg-[#fbfbfb] border-l-4 border-gray-900 p-2.5">
            <p className="text-[11px] font-bold mb-1">Bank Details</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Bank: </span>{payout.bankName || cs.bankName}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">Bank Holder: </span>{payout.accountName || cs.accountName}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">A/C no: </span>{payout.accountNumber || cs.accountNumber}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">IFSC: </span>{payout.ifscCode || cs.ifscCode}</p>
            <p className="text-[10px] text-gray-700 leading-relaxed"><span className="font-bold">A/C Type: </span>{payout.accountType || cs.accountType}</p>
          </div>
        </div>

        <div className="w-full mb-5">
          <div className="flex bg-[#ebebeb] py-2 px-2.5">
            <div className="w-[60%] text-[10px] font-bold">Item</div>
            <div className="w-[15%] text-[10px] font-bold text-center">Quantity</div>
            <div className="w-[25%] text-[10px] font-bold text-right">Amount</div>
          </div>
          {lineItems.map((item, i) => (
            <div key={i} className="flex py-2.5 px-2.5 border-b border-gray-300">
              <div className="w-[60%] text-[10px] text-gray-800">{item.name}</div>
              <div className="w-[15%] text-[10px] text-gray-800 text-center">{item.quantity || 1}</div>
              <div className="w-[25%] text-[10px] text-gray-800 text-right">{symbol}{(item.price * (item.quantity || 1)).toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="flex justify-end items-center py-2.5 px-2.5 border-b border-gray-300 mb-5">
          <p className="text-xs font-bold mr-10">Total</p>
          <p className="text-xs font-bold">{symbol}{calculateTotal(lineItems)}</p>
        </div>

        <div className="flex justify-end mb-8">
          <div className="w-32 text-center">
            {payout.signatureUrl ? (
              <img src={payout.signatureUrl} alt="Signature" className="h-10 w-full object-contain border-b border-gray-800 mb-1" />
            ) : (
              <div className="h-10 border-b border-gray-800 mb-1"></div>
            )}
            <p className="text-[10px] font-bold">Signature</p>
          </div>
        </div>

        <div className="mb-8">
          <p className="text-[9px] font-bold mb-0.5">Payment Terms</p>
          <p className="text-[8px] text-gray-800 leading-relaxed">• 100% amount payable after the reel going live.</p>
        </div>
        
        <LoomingoFooter color="text-gray-500" />
      </div>
    </div>
  );
};

// ------------------------------------------
// MAIN COMPONENT
// ------------------------------------------
export const InvoiceHtmlPreview = (props: Props) => {
  const { templateId } = props.invoiceData;
  
  switch(templateId) {
    case 1: return <Template1 {...props} />;
    case 2: return <Template2 {...props} />;
    case 3: return <Template3 {...props} />;
    case 4: return <Template4 {...props} />;
    case 5: return <Template5 {...props} />;
    case 6: return <Template6 {...props} />;
    default: return <Template1 {...props} />;
  }
};
