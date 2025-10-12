// src/services/exportService.js
import { jsPDF } from 'jspdf';

export const exportService = {
  exportToCSV(data, filename = 'data.csv') {
    if (!data || data.length === 0) return;
    
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    this.downloadFile(blob, filename);
  },

  exportToPDF(data, filename = 'data.pdf') {
    if (!data || data.length === 0) return;
    
    const doc = new jsPDF();
    let yPosition = 20;
    
    // Título
    doc.setFontSize(16);
    doc.text('TV Show Tracker - Meus Dados', 20, yPosition);
    yPosition += 15;
    
    // Dados
    doc.setFontSize(10);
    data.forEach((item, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.text(`${index + 1}. ${item.title || 'Item'}`, 20, yPosition);
      yPosition += 7;
      
      Object.entries(item).forEach(([key, value]) => {
        if (key !== 'title' && yPosition < 280) {
          doc.text(`   ${key}: ${value}`, 25, yPosition);
          yPosition += 5;
        }
      });
      
      yPosition += 5;
    });
    
    doc.save(filename);
  },

  downloadFile(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};