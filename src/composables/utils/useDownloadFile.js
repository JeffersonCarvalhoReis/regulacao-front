export function useDownloadFile() {

  const downloadFile = (file) => {
    const link = document.createElement('a')
    link.href = file
    link.setAttribute('download', '')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return {
    downloadFile
  }
}
