import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const exportMonthlyReportToPDF = async (data, selectedMonth, pieChartRef) => {
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  
  const formatMonthDisplay = (monthStr) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(year, month - 1);
    return date.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('lt-LT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  doc.setFillColor(37, 99, 235);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  const gradient = doc.setFillColor(235, 37, 99);
  doc.rect(pageWidth / 2, 0, pageWidth / 2, 50, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont(undefined, 'bold');
  doc.text('Mėnesio Ataskaita', pageWidth / 2, 20, { align: 'center' });
  
  doc.setFontSize(14);
  doc.setFont(undefined, 'normal');
  doc.text(formatMonthDisplay(selectedMonth), pageWidth / 2, 32, { align: 'center' });
  
  doc.setFontSize(10);
  doc.text(`Sugeneruota: ${new Date().toLocaleDateString('lt-LT')} ${new Date().toLocaleTimeString('lt-LT')}`, 
    pageWidth / 2, 42, { align: 'center' });

  let yPos = 60;

  const categories = Object.entries(data.categories);
  const totalFlow = data.inflow - data.outflow;
  const totalExpenses = categories
    .filter(([, amount]) => amount < 0)
    .reduce((sum, [, amount]) => sum + Math.abs(amount), 0);
  const totalIncome = categories
    .filter(([, amount]) => amount > 0)
    .reduce((sum, [, amount]) => sum + amount, 0);

  doc.setFillColor(240, 248, 255);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'F');
  
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, yPos, contentWidth, 35, 3, 3, 'S');

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('Finansinė apžvalga', margin + 5, yPos + 8);

  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  
  const col1X = margin + 5;
  const col2X = margin + contentWidth / 3 + 5;
  const col3X = margin + (2 * contentWidth / 3) + 5;
  const dataY = yPos + 18;

  doc.setTextColor(100, 100, 100);
  doc.text('Pajamos:', col1X, dataY);
  doc.text('Išlaidos:', col2X, dataY);
  doc.text('Balansas:', col3X, dataY);

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(37, 185, 99);
  doc.text(formatCurrency(data.inflow), col1X, dataY + 8);
  
  doc.setTextColor(235, 37, 99);
  doc.text(formatCurrency(data.outflow), col2X, dataY + 8);
  
  if (totalFlow >= 0) {
    doc.setTextColor(37, 185, 99);
  } else {
    doc.setTextColor(235, 37, 99);
  }
  doc.text(formatCurrency(Math.abs(totalFlow)), col3X, dataY + 8);

  yPos += 45;

  if (pieChartRef && pieChartRef.current) {
    try {
      const chartCanvas = await html2canvas(pieChartRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const chartImgData = chartCanvas.toDataURL('image/png');
      const chartWidth = 80;
      const chartHeight = 80;
      const chartX = pageWidth / 2 - chartWidth / 2;
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(30, 30, 30);
      doc.text('Išlaidų pasiskirstymas', pageWidth / 2, yPos + 5, { align: 'center' });
      
      doc.addImage(chartImgData, 'PNG', chartX, yPos + 10, chartWidth, chartHeight);
      yPos += 100;
    } catch (error) {
      console.error('Error capturing chart:', error);
      yPos += 10;
    }
  }

  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.setTextColor(30, 30, 30);
  doc.text('Kategorijų detalizacija', margin, yPos);
  
  yPos += 10;

  const sortedCategories = categories.sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]));
  const expenseCategories = sortedCategories.filter(([, amount]) => amount < 0);
  const incomeCategories = sortedCategories.filter(([, amount]) => amount > 0);

  if (expenseCategories.length > 0) {
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(235, 37, 99);
    doc.text('Išlaidos', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);

    expenseCategories.forEach(([category, amount], index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      const percentage = ((Math.abs(amount) / totalExpenses) * 100).toFixed(1);
      
      doc.setFillColor(index % 2 === 0 ? 250 : 245, 250, 250);
      doc.rect(margin, yPos - 5, contentWidth, 10, 'F');
      
      doc.setTextColor(30, 30, 30);
      doc.setFont(undefined, 'bold');
      doc.text(category, margin + 3, yPos);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`${percentage}%`, margin + contentWidth - 40, yPos, { align: 'right' });
      
      doc.setTextColor(235, 37, 99);
      doc.setFont(undefined, 'bold');
      doc.text(formatCurrency(Math.abs(amount)), margin + contentWidth - 3, yPos, { align: 'right' });
      
      const barWidth = (contentWidth - 6) * (parseFloat(percentage) / 100);
      doc.setFillColor(235, 37, 99, 0.3);
      doc.rect(margin + 3, yPos + 1, barWidth, 2, 'F');
      
      yPos += 10;
    });
  }

  if (incomeCategories.length > 0) {
    yPos += 5;
    
    if (yPos > pageHeight - 40) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(37, 185, 99);
    doc.text('Pajamos', margin, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100, 100, 100);

    incomeCategories.forEach(([category, amount], index) => {
      if (yPos > pageHeight - 30) {
        doc.addPage();
        yPos = margin;
      }

      const percentage = totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : 0;
      
      doc.setFillColor(index % 2 === 0 ? 240 : 245, 255, 240);
      doc.rect(margin, yPos - 5, contentWidth, 10, 'F');
      
      doc.setTextColor(30, 30, 30);
      doc.setFont(undefined, 'bold');
      doc.text(category, margin + 3, yPos);
      
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`${percentage}%`, margin + contentWidth - 40, yPos, { align: 'right' });
      
      doc.setTextColor(37, 185, 99);
      doc.setFont(undefined, 'bold');
      doc.text(formatCurrency(amount), margin + contentWidth - 3, yPos, { align: 'right' });
      
      const barWidth = (contentWidth - 6) * (parseFloat(percentage) / 100);
      doc.setFillColor(37, 185, 99, 0.3);
      doc.rect(margin + 3, yPos + 1, barWidth, 2, 'F');
      
      yPos += 10;
    });
  }

  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Sugeneruota naudojant Buget App', pageWidth / 2, pageHeight - 10, { align: 'center' });

  const fileName = `Ataskaita_${selectedMonth}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};

