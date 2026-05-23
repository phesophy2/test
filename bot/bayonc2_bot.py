import os, logging, requests
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler
logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)
BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
API_BASE = os.getenv('API_BASE_URL', 'http://localhost:5001/api')
async def start(update, context):
    keyboard = [[InlineKeyboardButton("📊 Dashboard", callback_data='dashboard')],[InlineKeyboardButton("👥 Accounts", callback_data='accounts')],[InlineKeyboardButton("📈 Stats", callback_data='stats')],[InlineKeyboardButton("🏭 Mail Production", callback_data='mail')]]
    await update.message.reply_text("🤖 KhmerGhost Bot", reply_markup=InlineKeyboardMarkup(keyboard))
async def button_handler(update, context):
    query = update.callback_query; await query.answer()
    if query.data == 'dashboard':
        r = requests.get(f"{API_BASE}/stats"); s = r.json()
        await query.edit_message_text(f"📊 Total: {s.get('total',0)}\n✅ Active: {s.get('active',0)}\n💻 CPU: {s.get('cpu',0)}%\n🧠 RAM: {s.get('ram',0)}%")
    elif query.data == 'accounts':
        r = requests.get(f"{API_BASE}/accounts"); accs = r.json()[:5]
        await query.edit_message_text("👥 Accounts:\n" + "\n".join([f"🆔 {a.get('uid')} - {a.get('state')}" for a in accs]))
    elif query.data == 'stats':
        r = requests.get(f"{API_BASE}/stats"); s = r.json()
        await query.edit_message_text(f"📊 Stats:\nTotal: {s.get('total',0)}\nActive: {s.get('active',0)}\nPending: {s.get('pending',0)}")
    elif query.data == 'mail':
        r = requests.get(f"{API_BASE}/mail/stats"); s = r.json()
        await query.edit_message_text(f"🏭 Mail Production:\nTotal Emails: {s.get('totalEmails',0)}\nActive Domains: {s.get('activeDomains',0)}\nToday: {s.get('todayProduction',0)}\nRevenue: ${s.get('monthlyRevenue',0)}")
def main():
    if not BOT_TOKEN: logging.error("TELEGRAM_BOT_TOKEN required!"); return
    app = Application.builder().token(BOT_TOKEN).build()
    app.add_handler(CommandHandler("start", start))
    app.add_handler(CallbackQueryHandler(button_handler))
    app.run_polling()
if __name__ == '__main__': main()
