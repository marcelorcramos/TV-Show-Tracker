import { jsPDF } from 'jspdf';

export const exportService = {
  exportToCSV(data, filename = 'data.csv') {
    if (!data || data.length === 0) {
      console.warn('⚠️ Nenhum dado para exportar');
      return;
    }
    
    try {
      const headers = Object.keys(data[0]);
      const csvContent = [
        headers.join(','),
        ...data.map(row => 
          headers.map(header => 
            `"${String(row[header] || '').replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      this.downloadFile(blob, filename);
      console.log(`✅ CSV exportado: ${filename}`);
    } catch (error) {
      console.error('❌ Erro ao exportar CSV:', error);
      throw error;
    }
  },

  exportToPDF(data, filename = 'data.pdf') {
    if (!data || data.length === 0) {
      console.warn('⚠️ Nenhum dado para exportar');
      return;
    }
    
    try {
      const doc = new jsPDF();
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      
      // Título
      doc.setFontSize(16);
      doc.setTextColor(30, 41, 59);
      doc.text('TV Show Tracker - Exportação de Dados', 20, yPosition);
      yPosition += 10;
      
      // Data da exportação
      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Exportado em: ${new Date().toLocaleDateString('pt-BR')}`, 20, yPosition);
      yPosition += 15;
      
      // Dados
      doc.setFontSize(10);
      doc.setTextColor(30, 41, 59);
      
      data.forEach((item, index) => {
        // Verificar se precisa de nova página
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }
        
        // Item header
        doc.setFont(undefined, 'bold');
        doc.text(`${index + 1}. ${item.Título || 'Item'}`, 20, yPosition);
        yPosition += 7;
        
        // Item details
        doc.setFont(undefined, 'normal');
        Object.entries(item).forEach(([key, value]) => {
          if (key !== 'Título' && yPosition < pageHeight - 20) {
            doc.text(`   ${key}: ${value}`, 25, yPosition);
            yPosition += 5;
          }
        });
        
        yPosition += 8; // Espaço entre itens
      });
      
      doc.save(filename);
      console.log(`✅ PDF exportado: ${filename}`);
    } catch (error) {
      console.error('❌ Erro ao exportar PDF:', error);
      throw error;
    }
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