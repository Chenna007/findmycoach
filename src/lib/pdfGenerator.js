import jsPDF from 'jspdf';

export const downloadReceipt = (booking) => {
  const doc = new jsPDF();

  // Branding & Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(173, 255, 47); // Brand Yellow/Green highlight color conceptually (though hard to see on white PDF)
  doc.text("Find", 20, 30);
  doc.setTextColor(20, 20, 20);
  doc.text("MyCoach", 42, 30);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(100, 100, 100);
  doc.text("Official Payment Receipt", 20, 40);
  
  const receiptNo = `#FMC-${(booking.id || Date.now()).toString().slice(-6)}`;
  doc.text(`Receipt No: ${receiptNo}`, 140, 40);

  doc.setLineWidth(0.5);
  doc.setDrawColor(220, 220, 220);
  doc.line(20, 50, 190, 50);

  // Booking Summary Section
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.setFont("helvetica", "bold");
  doc.text("Booking Summary", 20, 65);

  doc.setFontSize(12);
  let y = 80;
  
  const addRow = (label, value) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(label, 20, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text(String(value || "Not provided"), 70, y);
    y += 12;
  };

  addRow("Client Name:", booking.user_name);
  addRow("Client Email:", booking.user_email);
  addRow("Trainer name:", booking.trainer?.name);
  addRow("Training Goal:", booking.goal);
  addRow("Session Date:", booking.date);
  addRow("Session Time:", booking.time);
  addRow("Status:", "Paid Confirmed");

  // Payment Section Rectangle
  y += 10;
  doc.setFillColor(248, 248, 248);
  doc.roundedRect(20, y, 170, 40, 3, 3, 'F');
  
  y += 15;
  doc.setFontSize(14);
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.text("Total Paid:", 30, y);
  
  doc.setFontSize(22);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text(`${booking.trainer?.price || 0} AED`, 140, y);

  // Footer Disclaimer
  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for choosing FindMyCoach. For any queries, please reply to our support email.", 20, 280);

  // Trigger file download
  doc.save(`FMC_Receipt_${receiptNo}.pdf`);
};
