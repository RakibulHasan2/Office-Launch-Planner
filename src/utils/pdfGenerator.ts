import jsPDF from 'jspdf';
import { LaunchItem } from '../types';
import { format } from 'date-fns';

export const generateInvoicePDF = (
  date: string,
  items: LaunchItem[],
  totalBudget: number,
  notes?: string
): void => {
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Daily Office Launch Invoice', 105, 30, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${format(new Date(date), 'dd MMMM yyyy')}`, 20, 50);
  doc.text(`Generated: ${format(new Date(), 'dd MMM yyyy, hh:mm a')}`, 20, 60);
  
  // Line separator
  doc.setDrawColor(0, 0, 0);
  doc.line(20, 75, 190, 75);
  
  // Table header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  let yPosition = 90;
  
  doc.text('Item Name', 20, yPosition);
  doc.text('Unit Price', 80, yPosition);
  doc.text('Quantity', 120, yPosition);
  doc.text('Subtotal', 160, yPosition);
  
  // Line under header
  doc.line(20, yPosition + 5, 190, yPosition + 5);
  
  // Table rows
  doc.setFont('helvetica', 'normal');
  yPosition += 15;
  
  items.forEach((item) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 30;
    }
    
    doc.text(item.name, 20, yPosition);
    doc.text(`৳${item.unitPrice.toFixed(2)}`, 80, yPosition);
    doc.text(`${item.quantity} ${item.unit}`, 120, yPosition);
    doc.text(`৳${item.subtotal.toFixed(2)}`, 160, yPosition);
    
    yPosition += 12;
  });
  
  // Total section
  yPosition += 10;
  doc.line(20, yPosition, 190, yPosition);
  yPosition += 15;
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Budget: ৳${totalBudget.toFixed(2)}`, 20, yPosition);
  
  // Notes section
  if (notes) {
    yPosition += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 20, yPosition);
    yPosition += 10;
    doc.setFont('helvetica', 'normal');
    
    const splitNotes = doc.splitTextToSize(notes, 170);
    doc.text(splitNotes, 20, yPosition);
  }
  
  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(
      'Office Launch Planning System - Generated automatically',
      105,
      280,
      { align: 'center' }
    );
  }
  
  // Save the PDF
  const fileName = `launch-invoice-${format(new Date(date), 'yyyy-MM-dd')}.pdf`;
  doc.save(fileName);
};