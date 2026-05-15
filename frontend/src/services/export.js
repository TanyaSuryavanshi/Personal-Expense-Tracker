import jsPDF from 'jspdf'

export function exportTransactionsAsCSV(transactions) {
  const header = ['Date', 'Type', 'Category', 'Amount', 'Description']
  const rows = transactions.map(tx => [tx.date, tx.type, tx.category, tx.amount, tx.description])
  const csvContent = [header, ...rows].map(e => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', 'transactions.csv')
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportTransactionsAsPDF(transactions) {
  const doc = new jsPDF({ orientation: 'landscape' })
  doc.setFontSize(12)
  doc.text('Expense Tracker Transactions', 14, 20)
  const lineHeight = 8
  let y = 30
  const header = ['Date', 'Type', 'Category', 'Amount', 'Description']
  doc.text(header.join(' | '), 14, y)
  y += lineHeight
  transactions.forEach(tx => {
    const text = [tx.date, tx.type, tx.category, `$${tx.amount}`, tx.description || '-'].join(' | ')
    doc.text(text.slice(0, 240), 14, y)
    y += lineHeight
    if (y > 260) {
      doc.addPage()
      y = 20
    }
  })
  doc.save('transactions.pdf')
}
