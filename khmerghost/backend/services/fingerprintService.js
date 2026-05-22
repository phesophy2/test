// fingerprintService.js — សេវាបង្កើត Fingerprint ដែលមើលទៅពិត
const { v4: uuidv4 } = require('uuid');

class FingerprintService {
  constructor() {
    // Cambodia-specific device profiles
    this.deviceProfiles = [
      {
        name: 'Samsung Galaxy A14',
        userAgent: 'Mozilla/5.0 (Linux; Android 13; SM-A145F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        viewport: { width: 1080, height: 2408 },
        devicePixelRatio: 2.0,
        platform: 'Linux armv8l',
        hardwareConcurrency: 8,
        maxTouchPoints: 5,
        language: 'km-KH',
        languages: ['km-KH', 'km', 'en-US', 'en'],
        timezone: 'Asia/Phnom_Penh',
        timezoneOffset: -420,
        colorDepth: 24,
        pixelDepth: 24,
        screen: {
          width: 1080,
          height: 2408,
          availWidth: 1080,
          availHeight: 2327,
          colorDepth: 24,
          pixelDepth: 24
        },
        webgl: {
          vendor: 'ARM',
          renderer: 'Mali-G68 MC4'
        },
        fonts: ['Khmer OS', 'Khmer OS System', 'Noto Sans Khmer', 'Battambang', 'Bayon'],
        cpuClass: undefined,
        oscpu: undefined,
        product: 'Samsung Galaxy A14',
        productSub: '20030107',
        vendor: 'Google Inc.',
        vendorSub: ''
      },
      {
        name: 'Xiaomi Redmi Note 12',
        userAgent: 'Mozilla/5.0 (Linux; Android 13; 23021RAAEG) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        viewport: { width: 1080, height: 2400 },
        devicePixelRatio: 2.1,
        platform: 'Linux armv8l',
        hardwareConcurrency: 8,
        maxTouchPoints: 5,
        language: 'km-KH',
        languages: ['km-KH', 'km', 'en-US', 'en'],
        timezone: 'Asia/Phnom_Penh',
        timezoneOffset: -420,
        webgl: {
          vendor: 'Qualcomm',
          renderer: 'Adreno (TM) 610'
        },
        fonts: ['Khmer OS', 'Noto Sans Khmer', 'Battambang'],
        product: 'Xiaomi Redmi Note 12'
      },
      {
        name: 'OPPO A78',
        userAgent: 'Mozilla/5.0 (Linux; Android 13; CPH2481) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
        viewport: { width: 1080, height: 2400 },
        devicePixelRatio: 2.0,
        platform: 'Linux armv8l',
        hardwareConcurrency: 8,
        maxTouchPoints: 5,
        language: 'km-KH',
        languages: ['km-KH', 'km', 'en-US', 'en'],
        timezone: 'Asia/Phnom_Penh',
        timezoneOffset: -420,
        webgl: {
          vendor: 'ARM',
          renderer: 'Mali-G57 MC2'
        },
        fonts: ['Khmer OS', 'Noto Sans Khmer', 'Bayon'],
        product: 'OPPO A78'
      }
    ];
    
    // Cambodia locations (Phnom Penh, Siem Reap, Battambang, Sihanoukville)
    this.locations = [
      { city: 'Phnom Penh', lat: 11.5564, lng: 104.9282, accuracy: 100 },
      { city: 'Siem Reap', lat: 13.3633, lng: 103.8560, accuracy: 150 },
      { city: 'Battambang', lat: 13.0957, lng: 103.2022, accuracy: 120 },
      { city: 'Sihanoukville', lat: 10.6253, lng: 103.5234, accuracy: 200 },
      { city: 'Kampong Cham', lat: 11.9934, lng: 105.4635, accuracy: 180 }
    ];
  }
  
  generateFingerprint() {
    const profile = this.deviceProfiles[
      Math.floor(Math.random() * this.deviceProfiles.length)
    ];
    
    const location = this.locations[
      Math.floor(Math.random() * this.locations.length)
    ];
    
    const fingerprint = {
      id: uuidv4(),
      profile: profile.name,
      userAgent: profile.userAgent,
      viewport: profile.viewport,
      devicePixelRatio: profile.devicePixelRatio,
      platform: profile.platform,
      hardwareConcurrency: profile.hardwareConcurrency,
      maxTouchPoints: profile.maxTouchPoints,
      language: profile.language,
      languages: profile.languages,
      timezone: profile.timezone,
      timezoneOffset: profile.timezoneOffset,
      colorDepth: profile.colorDepth || 24,
      pixelDepth: profile.pixelDepth || 24,
      screen: profile.screen,
      webgl: profile.webgl,
      fonts: profile.fonts,
      product: profile.product,
      productSub: profile.productSub || '20030107',
      vendor: profile.vendor || 'Google Inc.',
      vendorSub: profile.vendorSub || '',
      
      // Location
      geolocation: {
        latitude: location.lat + (Math.random() - 0.5) * 0.01,
        longitude: location.lng + (Math.random() - 0.5) * 0.01,
        accuracy: location.accuracy + Math.floor(Math.random() * 50)
      },
      location: location.city,
      
      // Network
      connection: {
        effectiveType: ['4g', '3g'][Math.floor(Math.random() * 2)],
        downlink: 2 + Math.random() * 8,
        rtt: 50 + Math.floor(Math.random() * 150),
        saveData: false
      },
      
      // Battery (random but realistic)
      battery: {
        level: 0.2 + Math.random() * 0.75,
        charging: Math.random() > 0.7
      },
      
      // Canvas fingerprint (unique per profile)
      canvas: this.generateCanvasFingerprint(),
      
      // Audio fingerprint
      audio: this.generateAudioFingerprint(),
      
      // Generated timestamp
      created_at: new Date().toISOString()
    };
    
    return fingerprint;
  }
  
  generateCanvasFingerprint() {
    // Generate a unique canvas fingerprint based on device profile
    const canvas = {
      width: 300,
      height: 150,
      toDataURL: `data:image/png;base64,${Buffer.from(uuidv4()).toString('base64').substring(0, 100)}`,
      getImageData: {
        data: Array.from({ length: 300 * 150 * 4 }, () => Math.floor(Math.random() * 256))
      }
    };
    return canvas;
  }
  
  generateAudioFingerprint() {
    return {
      sampleRate: 48000,
      maxChannelCount: 2,
      numberOfInputs: 1,
      numberOfOutputs: 0,
      channelCount: 2,
      channelCountMode: 'max',
      channelInterpretation: 'speakers'
    };
  }
  
  getPlaywrightArgs(fingerprint) {
    return {
      args: [
        `--window-size=${fingerprint.viewport.width},${fingerprint.viewport.height}`,
        `--user-agent=${fingerprint.userAgent}`,
        `--lang=${fingerprint.language}`,
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--disable-blink-features=AutomationControlled',
        `--timezone=${fingerprint.timezone}`,
        `--geolocation=${fingerprint.geolocation.latitude},${fingerprint.geolocation.longitude}`
      ],
      viewport: {
        width: fingerprint.viewport.width,
        height: fingerprint.viewport.height
      },
      deviceScaleFactor: fingerprint.devicePixelRatio,
      locale: fingerprint.language,
      timezoneId: fingerprint.timezone,
      geolocation: {
        latitude: fingerprint.geolocation.latitude,
        longitude: fingerprint.geolocation.longitude,
        accuracy: fingerprint.geolocation.accuracy
      },
      permissions: ['geolocation'],
      colorScheme: 'light'
    };
  }
}

module.exports = new FingerprintService();
