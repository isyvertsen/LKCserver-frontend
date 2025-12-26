/**
 * BrowserPrint Service Wrapper
 *
 * Provides integration with Zebra BrowserPrint SDK for printing to ZT510 printers.
 * Requires Zebra Browser Print application to be running locally.
 */
import type { ZebraPrinter } from '@/types/labels'

declare global {
  interface Window {
    BrowserPrint: {
      getLocalDevices: (
        callback: (devices: ZebraPrinter[]) => void,
        errorCallback: (error: string) => void,
        deviceType?: string
      ) => void
      getDefaultDevice: (
        deviceType: string,
        callback: (device: ZebraPrinter | null) => void,
        errorCallback: (error: string) => void
      ) => void
    }
  }
}

const BROWSERPRINT_URL = 'http://127.0.0.1:9100/'
const SDK_URL = '/lib/BrowserPrint.min.js'

export class BrowserPrintService {
  private initialized = false
  private initPromise: Promise<void> | null = null

  /**
   * Initialize the BrowserPrint SDK by loading it dynamically
   */
  async init(): Promise<void> {
    if (this.initialized) return
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise((resolve, reject) => {
      // Check if already loaded
      if (typeof window !== 'undefined' && window.BrowserPrint) {
        this.initialized = true
        resolve()
        return
      }

      // Check if we're in a browser
      if (typeof window === 'undefined') {
        reject(new Error('BrowserPrint kan kun brukes i nettleser'))
        return
      }

      // Load SDK dynamically
      const script = document.createElement('script')
      script.src = SDK_URL
      script.onload = () => {
        this.initialized = true
        resolve()
      }
      script.onerror = () => {
        this.initPromise = null
        reject(new Error('Kunne ikke laste BrowserPrint SDK. Er Zebra Browser Print kjorende?'))
      }
      document.head.appendChild(script)
    })

    return this.initPromise
  }

  /**
   * Check if BrowserPrint is available (SDK loaded and service running)
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.init()
      return true
    } catch {
      return false
    }
  }

  /**
   * Get all locally available printers
   */
  async getLocalPrinters(): Promise<ZebraPrinter[]> {
    await this.init()

    return new Promise((resolve, reject) => {
      window.BrowserPrint.getLocalDevices(
        (devices) => resolve(devices),
        (error) => reject(new Error(error)),
        'printer'
      )
    })
  }

  /**
   * Get the default printer
   */
  async getDefaultPrinter(): Promise<ZebraPrinter | null> {
    await this.init()

    return new Promise((resolve, reject) => {
      window.BrowserPrint.getDefaultDevice(
        'printer',
        (device) => resolve(device),
        (error) => reject(new Error(error))
      )
    })
  }

  /**
   * Print PDF data to a printer
   */
  async print(printer: ZebraPrinter, pdfData: ArrayBuffer): Promise<void> {
    const response = await fetch(`${BROWSERPRINT_URL}write`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/pdf',
        'X-Printer-UID': printer.uid,
      },
      body: pdfData,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Utskrift feilet: ${text}`)
    }
  }

  /**
   * Print raw ZPL data to a printer
   */
  async printRaw(printer: ZebraPrinter, data: string): Promise<void> {
    const response = await fetch(`${BROWSERPRINT_URL}write`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'X-Printer-UID': printer.uid,
      },
      body: data,
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Utskrift feilet: ${text}`)
    }
  }

  /**
   * Get printer status
   */
  async getPrinterStatus(printer: ZebraPrinter): Promise<string> {
    const response = await fetch(`${BROWSERPRINT_URL}read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
        'X-Printer-UID': printer.uid,
      },
      body: '~HQES',
    })

    if (!response.ok) {
      throw new Error('Kunne ikke hente printerstatus')
    }

    return response.text()
  }

  /**
   * Parse printer status response
   */
  parsePrinterStatus(statusResponse: string): PrinterStatus {
    const defaultStatus: PrinterStatus = {
      isReady: true,
      isPaused: false,
      hasError: false,
      headOpen: false,
      ribbonOut: false,
      mediaOut: false,
      message: 'Klar',
    }

    if (!statusResponse || statusResponse.length < 3) {
      return { ...defaultStatus, message: 'Ukjent status' }
    }

    const status = statusResponse.toLowerCase()

    if (status.includes('error') || status.includes('feil')) {
      return { ...defaultStatus, isReady: false, hasError: true, message: 'Printerfeil' }
    }
    if (status.includes('pause')) {
      return { ...defaultStatus, isPaused: true, message: 'Printer pauset' }
    }
    if (status.includes('head') || status.includes('open')) {
      return { ...defaultStatus, isReady: false, headOpen: true, message: 'Printerhode åpent' }
    }
    if (status.includes('ribbon')) {
      return { ...defaultStatus, isReady: false, ribbonOut: true, message: 'Ribbon tom' }
    }
    if (status.includes('media') || status.includes('paper')) {
      return { ...defaultStatus, isReady: false, mediaOut: true, message: 'Media tom' }
    }

    return defaultStatus
  }

  /**
   * Print a test label (ZPL)
   */
  async printTestLabel(printer: ZebraPrinter): Promise<void> {
    const testZpl = `^XA
^FO50,50^A0N,50,50^FDTest Label^FS
^FO50,120^A0N,30,30^FDPrinter: ${printer.name}^FS
^FO50,160^A0N,30,30^FD${new Date().toLocaleString('nb-NO')}^FS
^FO50,220^BY3^BCN,100,Y,N,N^FD123456789^FS
^XZ`
    await this.printRaw(printer, testZpl)
  }

  /**
   * Check if BrowserPrint service is reachable
   */
  async checkServiceHealth(): Promise<boolean> {
    try {
      await fetch(BROWSERPRINT_URL, {
        method: 'GET',
        mode: 'no-cors',
      })
      return true
    } catch {
      return false
    }
  }
}

export interface PrinterStatus {
  isReady: boolean
  isPaused: boolean
  hasError: boolean
  headOpen: boolean
  ribbonOut: boolean
  mediaOut: boolean
  message: string
}

// Singleton instance
export const browserPrintService = new BrowserPrintService()
