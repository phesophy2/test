# bayonc2_bot.py — Telegram Bot ជាភាសាខ្មែរ
import os
import logging
import requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
logger = logging.getLogger(__name__)

API_URL = os.getenv('API_URL', 'http://localhost:3000/api')
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
ADMIN_ID = os.getenv('TELEGRAM_ADMIN_ID')

if not BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN is required!")

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    welcome_text = f"""
👻 *សូមស្វាគមន៍មកកាន់ BayonC2!*

សួស្តី លោក {user.first_name}!

ខ្ញុំជា bot គ្រប់គ្រង *KhmerGhost* — ឧបករណ៍ Auto Farm Facebook #1 កម្ពុជា 🇰🇭

*បញ្ជាដែលប្រើបាន:*
• /បង្កើត — បង្កើត Facebook account ថ្មី
• /mail — បង្កើត mail ឥតគិតថ្លៃ
• /phone — បង្កើតលេខទូរស័ព្ទ
• /ស្ថិតិ — ពិនិត្យស្ថិតិទាំងអស់

⚡ ម្ចាស់: JZYY (THE MASTER)
    """
    keyboard = [
        [InlineKeyboardButton("🚀 បង្កើត Account", callback_data='create')],
        [InlineKeyboardButton("📧 បង្កើត Mail", callback_data='mail')],
        [InlineKeyboardButton("📊 ស្ថិតិ", callback_data='stats')],
    ]
    await update.message.reply_text(welcome_text, parse_mode='Markdown', reply_markup=InlineKeyboardMarkup(keyboard))

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    help_text = """
📖 *ជំនួយប្រើប្រាស់ BayonC2*

*បញ្ជាគោល:*
• /start — ចាប់ផ្តើម
• /បង្កើត — បង្កើត Facebook account ថ្មី
• /mail — បង្កើត mail ឥតគិតថ្លៃ
• /phone — បង្កើតលេខទូរស័ព្ទ
• /ស្ថិតិ — ពិនិត្យស្ថិតិទាំងអស់

👑 ម្ចាស់: JZYY
    """
    await update.message.reply_text(help_text, parse_mode='Markdown')

async def status_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        res = requests.get(f"{API_URL.replace('/api', '')}/health", timeout=10)
        data = res.json()
        status_text = f"""
📊 *ស្ថានភាពប្រព័ន្ធ*

ស្ថានភាព: {data.get('status', 'UNKNOWN')}
សេវាកម្ម: {data.get('service', 'N/A')}

✅ ប្រព័ន្ធកំពុងដំណើរការ!
        """
        await update.message.reply_text(status_text, parse_mode='Markdown')
    except Exception as e:
        await update.message.reply_text(f"❌ ប្រព័ន្ធមិនដំណើរ: {str(e)}")

async def create_account(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🚀 កំពុងបង្កើត account ថ្មី... សូមរង់ចាំ")
    try:
        res = requests.post(f"{API_URL}/farm/create", json={"useMail": True, "warmUp": False}, timeout=60)
        data = res.json()
        if data.get('success'):
            result_text = f"""
✅ *Account បង្កើតរួចរាល់!*

📧 Email: `{data.get('email')}`
🔑 Password: `{data.get('password')}`
📍 Location: {data.get('location')}
🔍 Fingerprint: {data.get('fingerprint')}

🎯 ម្ចាស់: JZYY
            """
            await update.message.reply_text(result_text, parse_mode='Markdown')
        else:
            await update.message.reply_text(f"❌ បរាជ័យ: {data.get('error', 'Unknown error')}")
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def generate_mail(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("📧 កំពុងបង្កើត mail ថ្មី...")
    try:
        res = requests.post(f"{API_URL}/mail/generate", json={"provider": "mail.tm"}, timeout=30)
        data = res.json()
        if data.get('success'):
            mail_text = f"""
✅ *Mail បង្កើតរួច!*

📧 Email: `{data.get('email')}`
🔑 Password: `{data.get('password')}`
🏢 Provider: {data.get('provider')}

⚡ ម្ចាស់: JZYY
            """
            await update.message.reply_text(mail_text, parse_mode='Markdown')
        else:
            await update.message.reply_text(f"❌ បរាជ័យ: {data.get('error')}")
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def generate_phone(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("📱 កំពុងទាញយក free numbers...")
    try:
        res = requests.get(f"{API_URL}/phone/numbers?country=US", timeout=30)
        data = res.json()
        if data.get('success') and data.get('numbers'):
            numbers = data.get('numbers', [])[:5]
            phone_text = "📱 *Free Numbers Available:*\n\n"
            for i, num in enumerate(numbers, 1):
                phone_text += f"{i}. `{num.get('number')}`\n"
            await update.message.reply_text(phone_text, parse_mode='Markdown')
        else:
            await update.message.reply_text("❌ មិនមាន numbers ឥតគិតថ្លៃឥឡូវនេះ")
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def get_stats(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        res = requests.get(f"{API_URL}/farm/status", timeout=30)
        data = res.json()
        if data.get('success'):
            stats = data.get('stats', [])
            stats_text = "📊 *ស្ថិតិ KhmerGhost*\n\n"
            total = 0
            for stat in stats:
                status = stat.get('status', 'unknown')
                count = stat.get('count', 0)
                stats_text += f"✅ {status}: {count}\n"
                total += count
            stats_text += f"\n📈 *សរុប:* {total} accounts\n👑 ម្ចាស់: JZYY"
            await update.message.reply_text(stats_text, parse_mode='Markdown')
        else:
            await update.message.reply_text("❌ មិនអាចទាញយកស្ថិតិ")
    except Exception as e:
        await update.message.reply_text(f"❌ Error: {str(e)}")

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()
    if query.data == 'create':
        await create_account(update, context)
    elif query.data == 'mail':
        await generate_mail(update, context)
    elif query.data == 'stats':
        await get_stats(update, context)

def main():
    application = Application.builder().token(BOT_TOKEN).build()
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("ជំនួយ", help_command))
    application.add_handler(CommandHandler("status", status_command))
    application.add_handler(CommandHandler("បង្កើត", create_account))
    application.add_handler(CommandHandler("mail", generate_mail))
    application.add_handler(CommandHandler("phone", generate_phone))
    application.add_handler(CommandHandler("ស្ថិតិ", get_stats))
    application.add_handler(CommandHandler("stats", get_stats))
    application.add_handler(CallbackQueryHandler(button_callback))
    print("🤖 BayonC2 Bot started!")
    print("👑 Owner: JZYY (THE MASTER)")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
