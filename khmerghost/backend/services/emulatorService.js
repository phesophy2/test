// emulatorService.js — Android Emulator Control via ADB
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class EmulatorService {
  constructor() {
    this.adbHost = process.env.ADB_HOST || 'adb-server';
    this.adbPort = process.env.ADB_PORT || 5037;
    this.emulatorHost = process.env.EMULATOR_HOST || 'emulator-android';
    this.emulatorPort = process.env.EMULATOR_PORT || 5555;
    this.connected = false;
  }

  async adb(cmd) {
    try {
      const { stdout } = await execPromise(
        `adb -H ${this.adbHost} -P ${this.adbPort} ${cmd}`
      );
      return stdout.trim();
    } catch (e) {
      return '';
    }
  }

  async connect() {
    try {
      const result = await this.adb(`connect ${this.emulatorHost}:${this.emulatorPort}`);
      if (result.includes('connected') || result.includes('already connected')) {
        this.connected = true;
        await this.setKhmerLocale();
        return { success: true, message: result };
      }
      return { success: false, message: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async getStatus() {
    try {
      const devices = await this.adb('devices');
      const model = await this.adb('shell getprop ro.product.model');
      const android = await this.adb('shell getprop ro.build.version.release');
      const sdk = await this.adb('shell getprop ro.build.version.sdk');
      const timezone = await this.adb('shell getprop persist.sys.timezone');
      const screen = await this.adb('shell wm size');

      return {
        connected: this.connected,
        devices: devices.split('\n').filter(l => l && !l.includes('List')),
        model: model || 'Redroid Android',
        android: android || '11',
        sdk: sdk || '30',
        timezone: timezone || 'Asia/Phnom_Penh',
        screen: screen || '720x1280',
      };
    } catch (e) {
      return { connected: false, error: e.message };
    }
  }

  async setKhmerLocale() {
    const cmds = [
      'shell setprop persist.sys.timezone Asia/Phnom_Penh',
      'shell setprop persist.sys.language km',
      'shell setprop persist.sys.country KH',
      'shell setprop persist.sys.locale km-KH',
      'shell settings put system screen_off_timeout 1800000',
    ];
    for (const cmd of cmds) await this.adb(cmd);
    return true;
  }

  async tap(x, y) {
    await this.adb(`shell input tap ${x} ${y}`);
    return { success: true, x, y };
  }

  async swipe(x1, y1, x2, y2, duration = 300) {
    await this.adb(`shell input swipe ${x1} ${y1} ${x2} ${y2} ${duration}`);
    return { success: true };
  }

  async typeText(text) {
    const safe = text.replace(/ /g, '%s').replace(/&/g, '\\&');
    await this.adb(`shell input text '${safe}'`);
    return { success: true };
  }

  async takeScreenshot() {
    const path = `/app/logs/screenshot_${Date.now()}.png`;
    await this.adb('shell screencap -p /sdcard/screen.png');
    await this.adb(`pull /sdcard/screen.png ${path}`);
    return { success: true, path };
  }

  async startFacebook() {
    await this.adb('shell am start -n com.facebook.katana/.LoginActivity');
    await new Promise(r => setTimeout(r, 5000));
    return { success: true };
  }

  async loginFacebook(email, password) {
    await this.startFacebook();
    await new Promise(r => setTimeout(r, 3000));
    await this.tap(360, 650);
    await new Promise(r => setTimeout(r, 1000));
    await this.typeText(email);
    await new Promise(r => setTimeout(r, 1500));
    await this.tap(360, 750);
    await new Promise(r => setTimeout(r, 1000));
    await this.typeText(password);
    await new Promise(r => setTimeout(r, 2000));
    await this.tap(360, 850);
    return { success: true, email };
  }

  async clearFacebook() {
    await this.adb('shell pm clear com.facebook.katana');
    await this.adb('shell pm clear com.facebook.orca');
    return { success: true };
  }

  async installApk(apkPath) {
    const result = await this.adb(`install -r ${apkPath}`);
    return { success: result.includes('Success'), result };
  }

  async scroll() {
    const x = 360;
    const startY = 900 + Math.floor(Math.random() * 100);
    const endY = 200 + Math.floor(Math.random() * 100);
    const dur = 300 + Math.floor(Math.random() * 400);
    await this.swipe(x, startY, x, endY, dur);
    return { success: true };
  }
}

module.exports = new EmulatorService();
