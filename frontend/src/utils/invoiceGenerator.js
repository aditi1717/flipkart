import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Generate and download invoice PDF for an order
 * @param {Object} order - Order object containing all order details
 */
export const generateInvoice = (order) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Colors
    const primaryColor = [41, 98, 255]; // Blue
    const darkColor = [31, 41, 55]; // Dark gray
    const lightColor = [107, 114, 128]; // Light gray

    // Header Section
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');

    // Company Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('INDIANKART', 15, 20);

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Your Trusted Shopping Partner', 15, 28);

    // Invoice Title
    doc.setFontSize(16);
    doc.setFont(undefined, 'bold');
    doc.text('TAX INVOICE', pageWidth - 15, 25, { align: 'right' });

    // Reset text color
    doc.setTextColor(...darkColor);

    // Invoice Details Box
    let yPos = 50;

    // Invoice Number and Date
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Invoice Number:', 15, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(`INV-${order._id?.slice(-8).toUpperCase() || 'N/A'}`, 55, yPos);

    doc.setFont(undefined, 'bold');
    doc.text('Invoice Date:', pageWidth - 80, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(new Date().toLocaleDateString('en-IN'), pageWidth - 15, yPos, { align: 'right' });

    yPos += 7;
    doc.setFont(undefined, 'bold');
    doc.text('Order Date:', 15, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(new Date(order.createdAt).toLocaleDateString('en-IN'), 55, yPos);

    doc.setFont(undefined, 'bold');
    doc.text('Order ID:', pageWidth - 80, yPos);
    doc.setFont(undefined, 'normal');
    doc.text(`#${order._id?.slice(-8).toUpperCase() || 'N/A'}`, pageWidth - 15, yPos, { align: 'right' });

    yPos += 15;

    // Billing and Shipping Information
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    // Two column layout for addresses
    const leftCol = 15;
    const rightCol = pageWidth / 2 + 5;

    // Billing Address (Left)
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Bill To:', leftCol, yPos);

    yPos += 7;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(order.user?.name || 'Customer', leftCol, yPos);
    yPos += 5;
    if (order.user?.email) {
        doc.text(order.user.email, leftCol, yPos);
        yPos += 5;
    }
    if (order.user?.phone) {
        doc.text(order.user.phone, leftCol, yPos);
        yPos += 5;
    }

    // Shipping Address (Right)
    const startYPos = yPos - (order.user?.email ? 17 : 12) - (order.user?.phone ? 5 : 0);
    let rightYPos = startYPos;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Ship To:', rightCol, rightYPos);

    rightYPos += 7;
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(order.shippingAddress?.street || 'N/A', rightCol, rightYPos, { maxWidth: pageWidth / 2 - 20 });
    rightYPos += 5;
    doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.postalCode || ''}`, rightCol, rightYPos);
    rightYPos += 5;
    doc.text(order.shippingAddress?.country || '', rightCol, rightYPos);

    yPos = Math.max(yPos, rightYPos) + 10;

    // Items Table
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Order Items', 15, yPos);
    yPos += 5;

    // Prepare table data
    const tableData = order.orderItems.map((item, index) => {
        const variantText = item.variant
            ? Object.entries(item.variant).map(([key, value]) => `${key}: ${value}`).join(', ')
            : '';

        return [
            index + 1,
            item.name + (variantText ? `\n(${variantText})` : ''),
            item.qty,
            `₹${item.price.toLocaleString('en-IN')}`,
            `₹${(item.price * item.qty).toLocaleString('en-IN')}`
        ];
    });

    autoTable(doc, {
        startY: yPos,
        head: [['#', 'Product', 'Qty', 'Price', 'Total']],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontSize: 10,
            fontStyle: 'bold',
            halign: 'center'
        },
        bodyStyles: {
            fontSize: 9,
            textColor: darkColor
        },
        columnStyles: {
            0: { halign: 'center', cellWidth: 15 },
            1: { cellWidth: 'auto' },
            2: { halign: 'center', cellWidth: 20 },
            3: { halign: 'right', cellWidth: 35 },
            4: { halign: 'right', cellWidth: 35 }
        },
        margin: { left: 15, right: 15 }
    });

    // Price Summary
    yPos = doc.lastAutoTable.finalY + 15;

    const summaryX = pageWidth - 80;
    const valueX = pageWidth - 15;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightColor);
    doc.text('Subtotal:', summaryX, yPos);
    doc.text(`₹${order.itemsPrice.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });

    yPos += 6;
    doc.text('Shipping:', summaryX, yPos);
    doc.text(order.shippingPrice > 0 ? `₹${order.shippingPrice.toLocaleString('en-IN')}` : 'FREE', valueX, yPos, { align: 'right' });

    yPos += 6;
    doc.text('Tax:', summaryX, yPos);
    doc.text(`₹${order.taxPrice.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });

    yPos += 8;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(summaryX - 5, yPos - 3, valueX, yPos - 3);

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(...darkColor);
    doc.text('Total Amount:', summaryX, yPos);
    doc.text(`₹${order.totalPrice.toLocaleString('en-IN')}`, valueX, yPos, { align: 'right' });

    yPos += 10;

    // Payment Information
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(...lightColor);
    doc.text('Payment Method:', summaryX, yPos);
    doc.setTextColor(...darkColor);
    doc.text(order.paymentMethod || 'COD', valueX, yPos, { align: 'right' });

    yPos += 6;
    doc.setTextColor(...lightColor);
    doc.text('Payment Status:', summaryX, yPos);
    const statusColor = order.isPaid ? [16, 185, 129] : [245, 158, 11];
    doc.setTextColor(...statusColor);
    doc.text(order.isPaid ? 'Paid' : 'Pending', valueX, yPos, { align: 'right' });

    // Footer
    yPos = pageHeight - 30;
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos, pageWidth - 15, yPos);

    yPos += 7;
    doc.setFontSize(8);
    doc.setTextColor(...lightColor);
    doc.setFont(undefined, 'italic');
    doc.text('Thank you for shopping with IndianKart!', pageWidth / 2, yPos, { align: 'center' });

    yPos += 5;
    doc.text('For any queries, contact us at support@indiankart.com | +91 1800-123-4567', pageWidth / 2, yPos, { align: 'center' });

    yPos += 10;
    doc.setFontSize(7);
    doc.text('This is a computer-generated invoice and does not require a signature.', pageWidth / 2, yPos, { align: 'center' });

    // Save the PDF
    const fileName = `Invoice_${order._id?.slice(-8).toUpperCase() || 'Order'}.pdf`;
    doc.save(fileName);
};
