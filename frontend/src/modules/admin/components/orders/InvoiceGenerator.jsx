import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

export const InvoiceDisplay = React.forwardRef(({ order, item, items, settings }, ref) => {
    // Helper to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString, time = false) => {
        if (!dateString) return '';
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        if (time) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Date(dateString).toLocaleDateString('en-IN', options);
    };

    const displayItems = items || (item ? [item] : []);
    
    // Calculate totals
    let subtotal = 0;
    displayItems.forEach(i => {
        const price = i.price || 0;
        const qty = i.quantity || i.qty || 1;
        subtotal += price * qty;
    });

    const taxRate = 18;
    const taxableValue = (subtotal / (1 + taxRate/100));
    const igst = subtotal - taxableValue;

    return (
        <div ref={ref} className="p-8 bg-white text-black font-sans max-w-[210mm] mx-auto" style={{ fontSize: '12px', minHeight: '297mm' }}>
             {/* SHIPPING LABEL SECTION */}
             <div className="border-2 border-black mb-8 p-0">
                <div className="grid grid-cols-2 border-b-2 border-black">
                     <div className="p-2 border-r-2 border-black">
                         <div className="font-bold text-lg">STD</div>
                         <div className="text-sm">E-Kart Logistics</div>
                     </div>
                     <div className="p-2 flex justify-between items-center">
                         <div className="font-bold">PREPAID</div>
                         <div className="font-bold text-xl border-l-2 border-black pl-2">E</div>
                     </div>
                </div>
                
                <div className="grid grid-cols-[1fr_2fr] border-b-2 border-black h-32">
                    <div className="p-2 border-r-2 border-black flex flex-col justify-between">
                         <div className="text-xs">Ordered through</div>
                         <div className="font-bold text-lg">IndianKart</div>
                         <div className="flex-1 flex items-center justify-center text-xs mt-2">
                             <div className="font-bold text-sm tracking-widest break-all text-center">{order.paymentResult?.id || order._id?.substring(0, 10) || order.id?.substring(0, 10)}</div>
                         </div>
                    </div>
                    <div className="p-4 flex items-center justify-center">
                        <div className="text-center">
                            <div className="text-[10px] font-bold mb-1 uppercase tracking-tight">Order Tracking ID</div>
                            <div className="font-mono text-lg font-black border-2 border-black px-4 py-2 bg-gray-50 uppercase">
                                {order.id || order._id}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-2 border-b-2 border-black">
                    <div className="font-bold text-xs uppercase text-gray-400 mb-1 tracking-widest">Shipping/Customer address:</div>
                    <div className="font-bold text-sm uppercase">{order.shippingAddress?.name || order.user?.name || 'Unknown'}</div>
                    <div className="text-[10px] text-gray-500 font-medium mb-1">{order.shippingAddress?.email || order.user?.email}</div>
                    <div className="text-sm mb-1">
                        {order.address?.line || order.shippingAddress?.address || order.shippingAddress?.street}, {order.address?.city || order.shippingAddress?.city}, {order.address?.state || order.shippingAddress?.state || order.shippingAddress?.country} - <b>{order.address?.pincode || order.shippingAddress?.postalCode || order.shippingAddress?.pincode}</b>
                    </div>
                    <div>Phone: <b>{order.shippingAddress?.phone || order.user?.phone || 'N/A'}</b></div>
                </div>

                <div className="p-2 border-b-2 border-black text-xs bg-gray-50/50">
                     Sold By: <b>{settings.sellerName}</b>, {settings.sellerAddress}
                </div>
                
                <div className="border-b-2 border-black">
                     <table className="w-full text-left text-xs">
                         <thead>
                             <tr className="border-b border-black bg-gray-100">
                                 <th className="p-1 border-r border-black w-24">GSTIN</th>
                                 <th className="p-1 border-r border-black">Product Details</th>
                                 <th className="p-1 w-12 text-center">QTY</th>
                             </tr>
                         </thead>
                         <tbody>
                            {displayItems.map((i, idx) => (
                                <tr key={idx} className={idx < displayItems.length - 1 ? "border-b border-black" : ""}>
                                    <td className="p-1 border-r border-black align-top font-bold">{settings.gstNumber}</td>
                                    <td className="p-1 border-r border-black align-top">
                                        <div className="font-bold uppercase leading-tight">{i.name}</div>
                                        <div className="text-[9px] text-gray-500 mt-0.5">ID: {i.product || i.id} {i.serialNumber ? `| ${i.serialType === 'IMEI' ? 'IMEI' : 'SN'}: ${i.serialNumber}` : ''}</div>
                                    </td>
                                    <td className="p-1 text-center align-top font-bold">{i.quantity || i.qty}</td>
                                </tr>
                            ))}
                         </tbody>
                     </table>
                </div>

                 <div className="p-3 flex justify-between items-center">
                     <div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Package Sort Code</div>
                         <div className="text-4xl font-black p-2 border-4 border-black inline-block mt-1">B2-02</div>
                     </div>
                     <div className="text-right">
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Print Generation</div>
                         <div className="text-xs font-mono">{formatDate(new Date(), true)}</div>
                     </div>
                 </div>
                 
                 <div className="p-1 bg-black text-white text-center text-[10px] font-black uppercase tracking-[0.2em]">
                     Internal Label • Not for resale • IndianKart Logistics
                 </div>
             </div>
             
             {/* INVOICE SECTION */}
             <div className="border-t-2 border-dashed border-gray-300 pt-12 mt-12 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 py-1 border border-gray-300 text-[10px] font-black uppercase text-gray-400 tracking-widest rounded-full">Official Tax Invoice</div>
                 
                 <div className="flex justify-between items-start mb-10">
                     <div className="space-y-4">
                        {settings.logoUrl && (
                             <img src={settings.logoUrl} alt="Store Logo" className="h-14 object-contain" />
                        )}
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900 leading-none">Tax Invoice</h1>
                            <div className="mt-3 text-[11px] space-y-0.5 text-gray-500">
                                <div>Order Ref: <b className="text-black font-mono">{order.id || order._id}</b></div>
                                <div>Payment ID: <b className="text-black font-mono">{order.payment?.transactionId || 'COD'}</b></div>
                                <div>Placed At: <b className="text-black">{formatDate(order.createdAt || order.date, true)}</b></div>
                                <div>Invoice Date: <b className="text-black">{formatDate(new Date())}</b></div>
                            </div>
                        </div>
                     </div>
                     <div className="text-right bg-gray-50 p-4 rounded-xl border border-gray-100">
                         <div className="text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Seller Compliance</div>
                         <div className="text-xs space-y-1">
                             <div className="flex justify-between gap-8"><span className="text-gray-500 font-bold uppercase">GSTIN</span> <b className="text-black">{settings.gstNumber}</b></div>
                             <div className="flex justify-between gap-8"><span className="text-gray-500 font-bold uppercase">PAN</span> <b className="text-black">{settings.panNumber}</b></div>
                             <div className="flex justify-between gap-8"><span className="text-gray-500 font-bold uppercase">Email</span> <b className="text-black">{settings.contactEmail}</b></div>
                         </div>
                     </div>
                 </div>

                 <div className="grid grid-cols-2 gap-12 mb-10 text-xs">
                     <div className="space-y-2">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Sold By</div>
                         <div className="font-black text-sm text-gray-900 uppercase">{settings.sellerName}</div>
                         <div className="text-gray-600 leading-relaxed">{settings.sellerAddress}</div>
                         <div className="text-[10px] font-bold text-gray-400 uppercase">Registered Business Hub</div>
                     </div>
                     <div className="space-y-2">
                         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b pb-1">Billing & Shipping</div>
                         <div className="font-black text-sm text-gray-900 uppercase">{order.shippingAddress?.name || order.user?.name || 'Unknown'}</div>
                         <div className="text-gray-600 leading-relaxed">
                            {order.address?.line || order.shippingAddress?.address || order.shippingAddress?.street},<br />
                            {order.address?.city || order.shippingAddress?.city}, {order.address?.state || order.shippingAddress?.state || order.shippingAddress?.country} - {order.address?.pincode || order.shippingAddress?.postalCode || order.shippingAddress?.pincode}
                         </div>
                         <div className="font-black text-gray-900">Mob: {order.shippingAddress?.phone || order.user?.phone || 'N/A'}</div>
                     </div>
                 </div>

                 <table className="w-full text-xs mb-10 border-collapse border border-gray-200">
                     <thead>
                         <tr className="bg-gray-100 border-b border-gray-200">
                             <th className="p-3 text-left font-black uppercase tracking-widest text-[10px]">Product / HSN</th>
                             <th className="p-3 text-center font-black uppercase tracking-widest text-[10px]">Qty</th>
                             <th className="p-3 text-right font-black uppercase tracking-widest text-[10px]">Taxable</th>
                             <th className="p-3 text-right font-black uppercase tracking-widest text-[10px]">GST (18%)</th>
                             <th className="p-3 text-right font-black uppercase tracking-widest text-[10px]">Subtotal</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                         {displayItems.map((i, idx) => {
                             const p = i.price || 0;
                             const q = i.quantity || i.qty || 1;
                             const t = p * q;
                             const tv = t / (1 + 18/100);
                             const tax = t - tv;
                             
                             return (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                    <td className="p-3">
                                        <div className="font-black text-gray-900 uppercase">{i.name}</div>
                                        <div className="text-[9px] text-gray-400 font-bold mt-0.5">HSN: 90029000 | SKU: {i.product || i.id}</div>
                                    </td>
                                    <td className="p-3 text-center font-bold text-gray-600">{q}</td>
                                    <td className="p-3 text-right text-gray-600">{formatCurrency(tv)}</td>
                                    <td className="p-3 text-right text-gray-600">{formatCurrency(tax)}</td>
                                    <td className="p-3 text-right font-black text-gray-900">{formatCurrency(t)}</td>
                                </tr>
                             );
                         })}
                     </tbody>
                     <tfoot>
                        <tr className="border-t-2 border-gray-900 bg-gray-50">
                             <td colSpan="4" className="p-3 text-right font-black text-gray-400 uppercase tracking-widest text-[10px]">Pre-Tax Total</td>
                             <td className="p-3 text-right font-bold text-gray-600">{formatCurrency(taxableValue)}</td>
                         </tr>
                         <tr className="bg-gray-50">
                             <td colSpan="4" className="p-3 text-right font-black text-gray-400 uppercase tracking-widest text-[10px]">Integrated Tax (18%)</td>
                             <td className="p-3 text-right font-bold text-gray-600">{formatCurrency(igst)}</td>
                         </tr>
                         <tr className="bg-blue-600 text-white">
                             <td colSpan="4" className="p-4 text-right font-black uppercase tracking-[0.2em] text-[11px]">Grand Total (Inclusive of all taxes)</td>
                             <td className="p-4 text-right font-black text-lg">{formatCurrency(subtotal)}</td>
                         </tr>
                     </tfoot>
                 </table>

                 <div className="flex justify-between items-end mt-12 bg-gray-50/50 p-6 rounded-2xl border border-dashed border-gray-200">
                     <div className="text-[11px] max-w-[50%] space-y-4">
                         <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <p className="font-bold text-black mb-1 italic underline">Declaration / T&C:</p>
                            <p className="text-gray-500 leading-relaxed text-[9px]">We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct. Goods once sold will not be taken back or exchanged. Interest @18% p.a. will be charged if payment is not made within the due date.</p>
                         </div>
                         <p className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">Currency: Indian Rupee (INR)</p>
                     </div>
                     {settings.signatureUrl && (
                         <div className="text-right">
                             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Authorized Signatory</p>
                             <img src={settings.signatureUrl} alt="Signature" className="h-14 ml-auto object-contain mix-blend-multiply" />
                             <div className="mt-2 pt-2 border-t border-gray-200">
                                <p className="text-[11px] font-black text-gray-900 uppercase tracking-tight">For {settings.sellerName}</p>
                                <p className="text-[9px] text-gray-500 font-bold uppercase">Store Manager / Proprietor</p>
                             </div>
                         </div>
                     )}
                 </div>
                 
                 <div className="mt-12 pt-6 border-t border-gray-100 text-[10px] text-gray-400 text-center uppercase tracking-[0.3em] font-black">
                     • Electronic Invoice • No Signature Required •
                 </div>
             </div>
        </div>
    );
});


const InvoiceGenerator = ({ order, item, items, settings, customTrigger }) => {
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        contentRef: componentRef,
    });

    return (
        <div>
            <div style={{ display: 'none' }}>
                <InvoiceDisplay ref={componentRef} order={order} item={item} items={items} settings={settings || {}} />
            </div>
            
            {customTrigger ? (
                React.cloneElement(customTrigger, { onClick: handlePrint })
            ) : (
                <button 
                    onClick={handlePrint}
                    className="text-blue-600 hover:text-blue-800 text-xs font-bold underline flex items-center gap-1"
                >
                    <span className="material-icons text-[14px]">print</span> Print Invoice
                </button>
            )}
        </div>
    );
};

export default InvoiceGenerator;
