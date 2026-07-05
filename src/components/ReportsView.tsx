import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { formatIDR, formatDate } from '../utils/format';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { 
  BarChart3, 
  Calendar, 
  FileSpreadsheet, 
  Printer, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight,
  Calculator,
  Percent,
  CheckCircle,
  HelpCircle,
  Clock,
  Loader2
} from 'lucide-react';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

export const ReportsView: React.FC = () => {
  const { sales, products, settings, addToast } = useApp();
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [isGenerating, setIsGenerating] = useState(false);

  const todayStr = '2026-07-04'; // Static reference
  const currentMonthIdx = 6; // July
  const currentYear = 2026;

  // --- Helpers to filter transactions by period ---
  const getPeriodSales = () => {
    const today = new Date(todayStr);
    
    return sales.filter((s) => {
      const saleDate = new Date(s.date);
      
      if (period === 'daily') {
        return s.date === todayStr;
      }
      
      if (period === 'weekly') {
        // Last 7 days including today
        const diffTime = today.getTime() - saleDate.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays < 7;
      }
      
      if (period === 'monthly') {
        return saleDate.getMonth() === currentMonthIdx && saleDate.getFullYear() === currentYear;
      }

      return false;
    });
  };

  const periodSales = getPeriodSales();

  // --- Key Financial Calculations ---
  const totalRevenue = periodSales.reduce((sum, s) => sum + (s.sellingPrice * s.quantity), 0);
  const totalProfit = periodSales.reduce((sum, s) => sum + s.profit, 0);
  const totalCOGS = totalRevenue - totalProfit;
  const transactionCount = periodSales.length;
  const averageOrderValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;
  const profitMarginPercent = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

  // --- Dynamic Ranking: Best-Selling & Lowest-Selling Products ---
  const getProductRankings = () => {
    const ranks: Record<string, { name: string; category: string; brand: string; qty: number; revenue: number; profit: number }> = {};
    
    // Seed with all products that exist
    products.forEach(p => {
      ranks[p.id] = {
        name: p.name,
        category: p.category,
        brand: p.brand,
        qty: 0,
        revenue: 0,
        profit: 0
      };
    });

    // Aggregate sales
    periodSales.forEach((s) => {
      if (!ranks[s.productId]) {
        ranks[s.productId] = {
          name: s.productName,
          category: s.category,
          brand: s.category, // Fallback
          qty: 0,
          revenue: 0,
          profit: 0
        };
      }
      ranks[s.productId].qty += s.quantity;
      ranks[s.productId].revenue += s.sellingPrice * s.quantity;
      ranks[s.productId].profit += s.profit;
    });

    // Convert to array and filter out products with 0 sales for ranking, but keep if we need to list them
    const rankedArray = Object.entries(ranks).map(([id, info]) => ({
      id,
      ...info
    }));

    // Sort by quantity sold descending
    return rankedArray.sort((a, b) => b.qty - a.qty);
  };

  const productRankings = getProductRankings();
  const soldProductsOnly = productRankings.filter(p => p.qty > 0);

  const bestPerformer = soldProductsOnly.length > 0 ? soldProductsOnly[0] : null;
  const lowestPerformer = soldProductsOnly.length > 0 ? soldProductsOnly[soldProductsOnly.length - 1] : null;

  // --- EXPORT TO EXCEL / CSV ---
  const handleExportCSV = () => {
    if (periodSales.length === 0) {
      addToast('error', 'Gagal ekspor: Tidak ada data transaksi untuk periode ini.');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Title & Header
    csvContent += `LAPORAN BISNIS KONTERIQ - ${settings.shopName.toUpperCase()}\n`;
    csvContent += `Pemilik,${settings.ownerName}\n`;
    csvContent += `Periode Laporan,${period.toUpperCase()} (${period === 'daily' ? 'Hari ini' : period === 'weekly' ? '7 Hari Terakhir' : 'Bulan Ini'})\n`;
    csvContent += `Tanggal Cetak,${new Date().toLocaleDateString('id-ID')}\n\n`;

    // Financial Summary
    csvContent += "RINGKASAN KEUANGAN\n";
    csvContent += `Total Omset (Revenue),${totalRevenue}\n`;
    csvContent += `Total Harga Pokok (COGS),${totalCOGS}\n`;
    csvContent += `Total Laba Bersih,${totalProfit}\n`;
    csvContent += `Profit Margin (%),${profitMarginPercent.toFixed(2)}%\n`;
    csvContent += `Total Transaksi,${transactionCount}\n`;
    csvContent += `Rata-rata Keranjang (AOV),${averageOrderValue.toFixed(0)}\n\n`;

    // Rankings Table
    csvContent += "PERFORMA PRODUK (URUTAN BEST SELLER)\n";
    csvContent += "Nama Produk,Kategori,Brand,Kuantitas Terjual,Omset Penjualan,Laba Bersih\n";
    
    productRankings.forEach((p) => {
      csvContent += `"${p.name}",${p.category},${p.brand},${p.qty},${p.revenue},${p.profit}\n`;
    });

    csvContent += "\nLOG TRANSAKSI DETAIL\n";
    csvContent += "ID Transaksi,Tanggal,Nama Produk,Kategori,Kuantitas,Harga Jual,Untung\n";
    periodSales.forEach((s) => {
      csvContent += `${s.id},${s.date},"${s.productName}",${s.category},${s.quantity},${s.sellingPrice},${s.profit}\n`;
    });

    // Trigger browser download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Laporan_${period}_${settings.shopName.replace(/\s+/g, '_')}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Laporan berhasil diekspor ke format Excel CSV!');
  };

  // --- PRINT PDF TEMPLATE TRIGGER (Functional Client-Side PDF Generation) ---
  const handlePrintPDF = () => {
    setIsGenerating(true);
    addToast('info', 'Preparing your report...');

    setTimeout(() => {
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const todayDate = new Date();
        const dateStr = todayDate.toISOString().split('T')[0];
        const timeStr = todayDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';

        // --- PDF COLORS & THEME ---
        const primaryColor = [30, 41, 59]; // Slate 800
        const accentColor = [37, 99, 235]; // Blue 600
        const lightGray = [248, 250, 252]; // Slate 50
        const darkGray = [71, 85, 105]; // Slate 600

        // Helper to format currency
        const formatCurrencyPDF = (amount: number) => {
          return 'Rp ' + Math.round(amount).toLocaleString('id-ID');
        };

        // --- FOOTER FUNCTION ---
        const drawFooter = (pdfDoc: jsPDF, pageNum: number, totalPages: number) => {
          pdfDoc.setFont('helvetica', 'normal');
          pdfDoc.setFontSize(8);
          pdfDoc.setTextColor(148, 163, 184); // Slate 400
          
          // Divider line above footer
          pdfDoc.setDrawColor(226, 232, 240); // Slate 200
          pdfDoc.setLineWidth(0.2);
          pdfDoc.line(15, 282, 195, 282);
          
          pdfDoc.text('Generated by KonterIQ • Smart Business Dashboard', 15, 287);
          pdfDoc.text(`Page ${pageNum} of ${totalPages}`, 195, 287, { align: 'right' });
        };

        // --- HEADER SECTION ---
        // Top Accent bar
        doc.setFillColor(37, 99, 235); // Blue 600
        doc.rect(15, 15, 180, 2.5, 'F');

        // Logo & Title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(30, 41, 59); // Slate 800
        doc.text('KonterIQ', 15, 27);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(37, 99, 235); // Blue 600
        doc.text('v1.0 • Smart Business Dashboard', 15, 31);

        // Right metadata
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text(settings.shopName.toUpperCase(), 195, 25, { align: 'right' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`Owner: ${settings.ownerName}`, 195, 29, { align: 'right' });
        doc.text(`Generated: ${dateStr} ${timeStr}`, 195, 33, { align: 'right' });

        // Divider
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.3);
        doc.line(15, 36, 195, 36);

        // Document Subtitle
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(30, 41, 59);
        doc.text('BUSINESS REPORT', 15, 43);

        const periodDescription = period === 'daily' 
          ? 'Daily Period (04 July 2026)' 
          : period === 'weekly' 
            ? 'Weekly Period (7 Days Ending 04 July 2026)' 
            : 'Monthly Period (July 2026)';
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Reporting Period: ${periodDescription}`, 15, 47);

        // --- SUMMARY CARDS GRID ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text('BUSINESS SUMMARY', 15, 56);

        // Summary metric values
        const totalProductsCount = products.length;
        const lowStockItemsCount = products.filter(p => p.stock <= p.minStock).length;

        const cards = [
          { label: 'TOTAL REVENUE', value: formatCurrencyPDF(totalRevenue), sub: 'Gross billings' },
          { label: 'TOTAL PROFIT', value: formatCurrencyPDF(totalProfit), sub: 'Net store earnings' },
          { label: 'TOTAL TRANS.', value: `${transactionCount} Sales`, sub: 'Purchase volume' },
          { label: 'LOW STOCK ITEMS', value: `${lowStockItemsCount} Item(s)`, sub: 'Requires refill' }
        ];

        let startX = 15;
        let startY = 60;
        let cardW = 42;
        let cardH = 22;
        let gap = 4;

        cards.forEach((card, index) => {
          const x = startX + (index * (cardW + gap));
          // Draw card background
          doc.setFillColor(248, 250, 252); // light slate background
          doc.rect(x, startY, cardW, cardH, 'F');
          
          // Draw thin border
          doc.setDrawColor(226, 232, 240);
          doc.setLineWidth(0.2);
          doc.rect(x, startY, cardW, cardH, 'S');

          // Left-accent color block for cards
          doc.setFillColor(37, 99, 235);
          doc.rect(x, startY, 1.5, cardH, 'F');

          // Text labels
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(100, 116, 139); // Slate 500
          doc.text(card.label, x + 4, startY + 5.5);

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.setTextColor(15, 23, 42); // Slate 900
          doc.text(card.value, x + 4, startY + 12);

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(7);
          doc.setTextColor(148, 163, 184); // Slate 400
          doc.text(card.sub, x + 4, startY + 17.5);
        });

        // --- FINANCIAL PERFORMANCE DETAILS SECTION ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text('FINANCIAL SUMMARY', 15, 91);

        // Draw background container
        doc.setFillColor(248, 250, 252);
        doc.rect(15, 95, 180, 24, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(15, 95, 180, 24, 'S');

        // Left column
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text('Total Revenue (Omset):', 20, 101);
        doc.text('Total COGS (Harga Pokok/Cost):', 20, 107);
        doc.text('Net Profit (Keuntungan):', 20, 113);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(formatCurrencyPDF(totalRevenue), 75, 101);
        doc.text(formatCurrencyPDF(totalCOGS), 75, 107);
        doc.setTextColor(16, 185, 129); // Emerald 600
        doc.text(formatCurrencyPDF(totalProfit), 75, 113);

        // Right column
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text('Average Order Value:', 110, 101);
        doc.text('Profit Margin Ratio:', 110, 107);
        doc.text('Total Catalog Products:', 110, 113);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(formatCurrencyPDF(averageOrderValue), 155, 101);
        doc.text(`${profitMarginPercent.toFixed(2)}%`, 155, 107);
        doc.text(`${totalProductsCount} Items`, 155, 113);

        // --- SALES DETAIL TABLE ---
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text('SALES REPORT LOG', 15, 128);

        // Build data for autoTable
        const salesTableHead = [['Date', 'Product Name', 'Quantity', 'Selling Price', 'Total']];
        const salesTableBody = periodSales.length === 0 
          ? [['-', 'No sales data available for the selected period.', '-', '-', '-']]
          : periodSales.map(s => [
              s.date,
              s.productName,
              `${s.quantity} pcs`,
              formatCurrencyPDF(s.sellingPrice),
              formatCurrencyPDF(s.sellingPrice * s.quantity)
            ]);

        autoTable(doc, {
          startY: 132,
          head: salesTableHead,
          body: salesTableBody,
          theme: 'striped',
          headStyles: {
            fillColor: [30, 41, 59],
            textColor: [255, 255, 255],
            fontSize: 8.5,
            fontStyle: 'bold',
            halign: 'left'
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [51, 65, 85]
          },
          columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 80 },
            2: { cellWidth: 20, halign: 'center' },
            3: { cellWidth: 27, halign: 'right' },
            4: { cellWidth: 28, halign: 'right' }
          },
          margin: { left: 15, right: 15 }
        });

        // Let's get the Y position after the sales table
        let finalY = (doc as any).lastAutoTable.finalY || 170;

        // --- STOCK STATUS REPORT TABLE ---
        // If finalY is too close to the page end, add a new page
        if (finalY > 210) {
          doc.addPage();
          finalY = 20; // top margin for new page
        } else {
          finalY += 10;
        }

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.setTextColor(30, 41, 59);
        doc.text('STOCK REPORT', 15, finalY);

        const stockTableHead = [['No', 'Product', 'Current Stock', 'Status']];
        const stockTableBody = products.map((p, idx) => {
          let statusText = 'Normal';
          if (p.stock === 0) {
            statusText = 'Critical';
          } else if (p.stock <= p.minStock) {
            statusText = 'Low Stock';
          }
          return [
            `${idx + 1}`,
            p.name,
            `${p.stock} pcs`,
            statusText
          ];
        });

        autoTable(doc, {
          startY: finalY + 4,
          head: stockTableHead,
          body: stockTableBody,
          theme: 'striped',
          headStyles: {
            fillColor: [15, 23, 42],
            textColor: [255, 255, 255],
            fontSize: 8.5,
            fontStyle: 'bold',
            halign: 'left'
          },
          bodyStyles: {
            fontSize: 8,
            textColor: [51, 65, 85]
          },
          columnStyles: {
            0: { cellWidth: 15, halign: 'center' },
            1: { cellWidth: 105 },
            2: { cellWidth: 30, halign: 'center' },
            3: { cellWidth: 30, halign: 'center', fontStyle: 'bold' }
          },
          margin: { left: 15, right: 15 },
          didParseCell: (data) => {
            if (data.section === 'body' && data.column.index === 3) {
              const val = data.cell.raw;
              if (val === 'Critical') {
                data.cell.styles.textColor = [239, 68, 68]; // Red 500
              } else if (val === 'Low Stock') {
                data.cell.styles.textColor = [245, 158, 11]; // Amber 500
              } else if (val === 'Normal') {
                data.cell.styles.textColor = [16, 185, 129]; // Emerald 500
              }
            }
          }
        });

        // --- DRAW FOOTERS FOR ALL PAGES ---
        const pageCount = (doc as any).internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
          doc.setPage(i);
          drawFooter(doc, i, pageCount);
        }

        // Save PDF with current date
        doc.save(`KonterIQ_Report_${dateStr}.pdf`);
        
        setIsGenerating(false);
        addToast('success', 'Report downloaded successfully.');
      } catch (err: any) {
        console.error('PDF Generation Error:', err);
        setIsGenerating(false);
        addToast('error', `Unexpected error: ${err.message || 'Could not generate report'}`);
      }
    }, 1200); // 1.2s delay to show loading state nicely
  };

  return (
    <div className="space-y-6">
      
      {/* Printable Area Wrapper for print optimizations */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-sans tracking-tight">
            Laporan Kinerja & Profitabilitas
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500">
            Dapatkan rekapitulasi penjualan, analisis laba kotor, serta peringkat barang laku harian hingga bulanan.
          </p>
        </div>

        {/* Period selection pills */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950/40 p-1 rounded-xl border border-slate-200/50 dark:border-slate-800">
          {(['daily', 'weekly', 'monthly'] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                period === p
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
              id={`report-period-pill-${p}`}
            >
              {p === 'daily' ? 'Harian' : p === 'weekly' ? 'Mingguan' : 'Bulanan'}
            </button>
          ))}
        </div>
      </div>

      {/* Export Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xs print:hidden">
        <div className="flex items-center gap-2">
          <Calendar className="h-4.5 w-4.5 text-blue-600" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
            Periode Laporan: {period === 'daily' ? 'Hari Ini (04 Juli 2026)' : period === 'weekly' ? '7 Hari Terakhir (28 Jun - 04 Jul 2026)' : 'Bulan Ini (Juli 2026)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-200/50 dark:border-slate-800 text-xs font-bold transition-all cursor-pointer"
            id="btn-report-export-csv"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" /> Ekspor ke Excel (.CSV)
          </button>
          <button
            onClick={handlePrintPDF}
            disabled={isGenerating}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer ${
              isGenerating 
                ? 'bg-blue-600/70 shadow-blue-500/5 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
            }`}
            id="btn-report-print-pdf"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Preparing PDF...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" /> Cetak Laporan / PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* PRINT-ONLY HEADER (Hidden on screen) */}
      <div className="hidden print:block text-slate-900 bg-white p-6 border-b border-slate-300 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2.5xl font-black tracking-tight">{settings.shopName}</h1>
            <p className="text-sm text-slate-500">Pemilik: {settings.ownerName} • Laporan Keuangan Ritel</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold text-blue-600">KonterIQ Report</h2>
            <p className="text-xs text-slate-500">Tanggal Cetak: 2026-07-04</p>
          </div>
        </div>
        <div className="mt-4 text-xs font-semibold py-2 bg-slate-50 border-y border-slate-200 capitalize">
          Lingkup Laporan: {period === 'daily' ? 'Harian (04 Juli 2026)' : period === 'weekly' ? 'Mingguan (7 Hari Terakhir)' : 'Bulanan (Juli 2026)'}
        </div>
      </div>

      {/* Financial KPIs row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4.5">
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Omset Kotor (Revenue)</span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white mt-1 font-mono">{formatIDR(totalRevenue)}</h3>
          <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Total tagihan ke pembeli</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Modal Terpakai (COGS)</span>
          <h3 className="text-lg sm:text-xl font-extrabold text-slate-950 dark:text-white mt-1 font-mono">{formatIDR(totalCOGS)}</h3>
          <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Total harga beli barang pokok</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Laba Bersih (Profit)</span>
          <h3 className="text-lg sm:text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 font-mono">{formatIDR(totalProfit)}</h3>
          <span className="text-[9.5px] text-emerald-500 font-semibold block mt-1">Uang bersih milik toko</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Rasio Keuntungan (Margin)</span>
          <h3 className="text-lg sm:text-xl font-extrabold text-indigo-600 dark:text-indigo-400 mt-1 font-mono">{profitMarginPercent.toFixed(1)}%</h3>
          <span className="text-[9.5px] text-slate-400 font-medium block mt-1">Rata-rata keuntungan per rupiah</span>
        </div>

      </div>

      {/* Top Performer vs Underperformer Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
        
        {/* Best selling */}
        <div className="bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/10 p-4.5 rounded-2xl flex items-start gap-3.5">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl shrink-0 mt-0.5">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Produk Terlaris (Best-Seller)</span>
            {bestPerformer ? (
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{bestPerformer.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Terjual: <span className="font-mono text-slate-800 dark:text-white font-bold">{bestPerformer.qty} unit</span> • Laba: <span className="font-mono text-emerald-600 font-bold">{formatIDR(bestPerformer.profit)}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-semibold">Belum ada transaksi terekam pada periode ini.</p>
            )}
          </div>
        </div>

        {/* Lowest selling */}
        <div className="bg-rose-50/20 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/10 p-4.5 rounded-2xl flex items-start gap-3.5">
          <div className="p-2.5 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-xl shrink-0 mt-0.5">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div className="space-y-1 min-w-0">
            <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">Laju Penjualan Terendah</span>
            {lowestPerformer ? (
              <div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{lowestPerformer.name}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  Terjual: <span className="font-mono text-slate-800 dark:text-white font-bold">{lowestPerformer.qty} unit</span> • Laba: <span className="font-mono text-rose-500 font-bold">{formatIDR(lowestPerformer.profit)}</span>
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-semibold">Belum ada transaksi terekam pada periode ini.</p>
            )}
          </div>
        </div>

      </div>

      {/* Detailed rankings ledger */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
            Peringkat Volume & Kontribusi Laba Produk ({soldProductsOnly.length} barang terjual)
          </h3>
          <span className="text-[10px] font-semibold text-slate-400">Diurutkan Berdasarkan Kuantitas</span>
        </div>

        {periodSales.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 dark:text-slate-500">
            Tidak ada transaksi terekam selama periode ini. Silakan catat transaksi di menu penjualan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/20 dark:bg-slate-950/10 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase border-b border-slate-100 dark:border-slate-800">
                  <th className="py-3 px-5">Peringkat & Nama Produk</th>
                  <th className="py-3 px-4">Kategori</th>
                  <th className="py-3 px-4 text-center">Qty Terjual</th>
                  <th className="py-3 px-4 text-right">Omset Kontribusi</th>
                  <th className="py-3 px-5 text-right">Keuntungan Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {productRankings.map((p, idx) => {
                  const isSold = p.qty > 0;
                  
                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/30 dark:hover:bg-slate-800/10 transition-colors ${!isSold ? 'opacity-40 print:hidden' : ''}`}>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            idx === 0 && isSold
                              ? 'bg-amber-100 text-amber-800' 
                              : idx === 1 && isSold
                                ? 'bg-slate-200 text-slate-700'
                                : idx === 2 && isSold
                                  ? 'bg-orange-100 text-orange-800'
                                  : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                          }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <p className="font-bold text-slate-800 dark:text-slate-100">{p.name}</p>
                            <p className="text-[10px] text-slate-400">Brand: {p.brand}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400">
                        {p.category}
                      </td>
                      <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-800 dark:text-slate-200">
                        {p.qty} Pcs
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold font-mono text-slate-900 dark:text-white">
                        {formatIDR(p.revenue)}
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <span className={`font-mono font-bold ${p.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'}`}>
                          {formatIDR(p.profit)}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Print Footer for Printable Layout (Hidden on screen) */}
      <div className="hidden print:block text-center mt-12 text-[10px] text-slate-400 border-t border-slate-200 pt-4">
        Laporan keuangan ini dibuat secara mandiri & aman oleh sistem asisten pintar KonterIQ.
      </div>

    </div>
  );
};
