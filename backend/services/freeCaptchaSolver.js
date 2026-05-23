const Tesseract = require('tesseract.js');
const sharp = require('sharp');
class FreeCaptchaSolver {
  async solveImageCaptcha(imageBuffer) {
    try {
      const processed = await sharp(imageBuffer).greyscale().normalize().toBuffer();
      const { data: { text } } = await Tesseract.recognize(processed, 'eng');
      return text.replace(/\s/g, '').toUpperCase();
    } catch(e){ return null; }
  }
  async solveSimpleCaptcha(captchaText) {
    const mathMatch = captchaText.match(/(\d+)\s*[\+\-\*]\s*(\d+)/);
    if(mathMatch) {
      const [_, a, b] = mathMatch;
      if(captchaText.includes('+')) return (parseInt(a)+parseInt(b)).toString();
      if(captchaText.includes('-')) return (parseInt(a)-parseInt(b)).toString();
      if(captchaText.includes('*')) return (parseInt(a)*parseInt(b)).toString();
    }
    return captchaText;
  }
}
module.exports = new FreeCaptchaSolver();
