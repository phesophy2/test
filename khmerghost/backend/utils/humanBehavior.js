// humanBehavior.js — ឧបករណ៍ត្រាប់តាមឥរិយាបថមនុស្ស
class HumanBehavior {
  constructor() {
    // Khmer users tend to scroll slower
    this.scrollSpeeds = {
      fast: { min: 800, max: 1500 },
      normal: { min: 1500, max: 3000 },
      slow: { min: 3000, max: 6000 } // Khmer style
    };
  }
  
  async randomDelay(min, max) {
    const delay = Math.floor(Math.random() * (max - min + 1)) + min;
    await new Promise(resolve => setTimeout(resolve, delay));
    return delay;
  }
  
  async typeLikeHuman(page, selector, text) {
    const element = await page.$(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);
    
    // Focus with random delay
    await element.click();
    await this.randomDelay(100, 300);
    
    // Type each character with random delay
    for (const char of text) {
      await element.type(char, { delay: 0 });
      // Khmer typing: 50-200ms between keys
      await this.randomDelay(50, 200);
    }
    
    // Pause after typing
    await this.randomDelay(200, 500);
  }
  
  async focusField(page, selector) {
    const element = await page.$(selector);
    if (!element) return;
    
    // Move mouse to field with slight random offset
    const box = await element.boundingBox();
    const x = box.x + box.width / 2 + (Math.random() - 0.5) * 10;
    const y = box.y + box.height / 2 + (Math.random() - 0.5) * 10;
    
    await page.mouse.move(x, y);
    await this.randomDelay(200, 500);
    await page.mouse.click(x, y);
    await this.randomDelay(100, 300);
  }
  
  async randomScroll(page) {
    const scrollAmount = Math.floor(Math.random() * 500) + 200;
    const direction = Math.random() > 0.1 ? 'down' : 'up'; // 90% down
    
    await page.evaluate((amount, dir) => {
      window.scrollBy({
        top: dir === 'down' ? amount : -amount,
        behavior: 'smooth'
      });
    }, scrollAmount, direction);
    
    // Khmer users pause longer between scrolls
    await this.randomDelay(2000, 5000);
  }
  
  async randomMouseMovement(page) {
    const viewport = page.viewportSize();
    const x = Math.random() * viewport.width;
    const y = Math.random() * viewport.height;
    
    await page.mouse.move(x, y, { steps: 10 });
    await this.randomDelay(300, 800);
  }
  
  async simulateReading(page) {
    // Humans pause to "read" content
    const readTime = Math.floor(Math.random() * 20000) + 5000; // 5-25 seconds
    await this.randomDelay(readTime, readTime + 3000);
  }
  
  async randomTabSwitch(page) {
    // Simulate switching tabs (rare)
    if (Math.random() > 0.8) {
      await this.randomDelay(3000, 7000);
    }
  }
  
  async simulateKhmerSession(page, durationMinutes) {
    const endTime = Date.now() + durationMinutes * 60000;
    
    while (Date.now() < endTime) {
      const action = Math.random();
      
      if (action < 0.6) {
        // 60% chance: scroll
        await this.randomScroll(page);
      } else if (action < 0.8) {
        // 20% chance: pause to read
        await this.simulateReading(page);
      } else if (action < 0.9) {
        // 10% chance: mouse movement
        await this.randomMouseMovement(page);
      } else {
        // 10% chance: tab switch
        await this.randomTabSwitch(page);
      }
    }
  }
  
  generateKhmerTypingPattern() {
    // Khmer users type slower, make more mistakes
    return {
      wpm: 20 + Math.floor(Math.random() * 15), // 20-35 WPM
      accuracy: 0.85 + Math.random() * 0.1, // 85-95%
      pauseFrequency: 0.3 + Math.random() * 0.2, // Pause every 3-5 words
      backspaceRate: 0.05 + Math.random() * 0.05 // 5-10% backspace
    };
  }
}

module.exports = new HumanBehavior();
