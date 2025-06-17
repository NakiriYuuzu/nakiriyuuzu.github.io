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
      
      // 強制轉換所有顏色為標準格式
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
        logging: false
      })

      // 還原原始樣式並清理臨時樣式
      element.style.cssText = originalStyle
      document.head.removeChild(printStyles)

      // 建立 PDF
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight

      let position = 0

      // 第一頁
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      // 如果內容超過一頁，添加更多頁面
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
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