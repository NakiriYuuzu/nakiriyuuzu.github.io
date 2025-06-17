import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function usePdfGenerator() {
  const generatePDF = async (elementId: string, filename: string = 'resume') => {
    try {
      const element = document.getElementById(elementId)
      if (!element) {
        throw new Error(`Element with id "${elementId}" not found`)
      }

      // 臨時修改樣式以優化 PDF 生成，避免 OKLCH 顏色函數
      const originalStyle = element.style.cssText
      
      // 強制轉換所有顏色為標準格式並優化文字顯示
      const printStyles = document.createElement('style')
      printStyles.textContent = `
        #${elementId}, #${elementId} * {
          color: #000000 !important;
          background-color: #ffffff !important;
          border-color: #333333 !important;
          outline-color: #333333 !important;
          text-decoration-color: #000000 !important;
          fill: #000000 !important;
          stroke: #000000 !important;
          word-wrap: break-word !important;
          overflow-wrap: break-word !important;
          hyphens: auto !important;
          line-height: 1.4 !important;
        }
        #${elementId} .text-gray-900, #${elementId} .text-gray-700, #${elementId} .text-gray-600 {
          color: #000000 !important;
        }
        #${elementId} .border-gray-900, #${elementId} .border-gray-300 {
          border-color: #333333 !important;
        }
        #${elementId} .bg-white {
          background-color: #ffffff !important;
        }
        #${elementId} section {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 20px !important;
        }
        #${elementId} .mb-6, #${elementId} .mb-4, #${elementId} .mb-3 {
          page-break-after: avoid !important;
          break-after: avoid !important;
        }
        #${elementId} p, #${elementId} li {
          margin-bottom: 0.5em !important;
          orphans: 3 !important;
          widows: 3 !important;
        }
        #${elementId} ul {
          margin-top: 0.5em !important;
        }
      `
      document.head.appendChild(printStyles)
      
      element.style.cssText = `
        width: 210mm;
        min-height: 297mm;
        padding: 20mm;
        margin: 0;
        background: #ffffff !important;
        color: #000000 !important;
        font-family: Arial, sans-serif;
        box-shadow: none;
        transform: scale(1);
      `

      // 等待一下讓樣式生效
      await new Promise(resolve => setTimeout(resolve, 100))

      // 生成 canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight
      })

      // 還原原始樣式並清理臨時樣式
      element.style.cssText = originalStyle
      document.head.removeChild(printStyles)

      // 建立 PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const pdfWidth = 210 // A4 width in mm
      const pdfHeight = 297 // A4 height in mm
      const imgWidth = pdfWidth
      const imgHeight = (canvas.height * pdfWidth) / canvas.width
      
      // 計算需要多少頁
      const totalPages = Math.ceil(imgHeight / pdfHeight)
      
      for (let page = 0; page < totalPages; page++) {
        if (page > 0) {
          pdf.addPage()
        }
        
        const yPosition = -(page * pdfHeight)
        pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidth, imgHeight)
      }

      // 下載 PDF
      pdf.save(`${filename}.pdf`)
      
      return true
    } catch (error) {
      console.error('PDF generation failed:', error)
      throw error
    }
  }

  return {
    generatePDF
  }
}