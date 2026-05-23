const dns = require('dns');
const crypto = require('crypto');
const db = require('../db');
class MailFactory {
  async checkDomainAvailability(domain) { return new Promise((r)=>dns.resolveMx(domain,(e)=>r(!e))); }
  async registerDomain(domain, provider='freenom') { return { success: true, domain }; }
  async configureDomainMX(domain, mxRecord) { await db.run('INSERT INTO mail_domains(domain,mx_record,status) VALUES(?,?,"active")', [domain, mxRecord]); return { success: true }; }
  async createMailbox(domain, username, password=null) {
    const email = `${username}@${domain}`;
    const mailboxPassword = password || crypto.randomBytes(8).toString('hex');
    await db.run('INSERT INTO mailboxes(email,domain,username,password,status,created_at) VALUES(?,?,?,?,"active",?)', [email, domain, username, mailboxPassword, Date.now()]);
    return { email, password: mailboxPassword, domain };
  }
  async createBulkMailboxes(domain, count, prefix='user') {
    const mailboxes = [];
    for(let i=0;i<count;i++) {
      const username = `${prefix}${Date.now()}_${Math.random().toString(36).substr(2,6)}`;
      const mailbox = await this.createMailbox(domain, username);
      mailboxes.push(mailbox);
      await new Promise(r=>setTimeout(r,100));
    }
    return mailboxes;
  }
}
module.exports = new MailFactory();
