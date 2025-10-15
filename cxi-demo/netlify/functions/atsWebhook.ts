import crypto from 'node:crypto';
const SECRET = process.env.ATS_WEBHOOK_SECRET || '';
function verify(sig, body){
  if(!SECRET) return false;
  const h = crypto.createHmac('sha256', SECRET).update(body).digest('hex');
  return sig === h;
}
export const handler = async (event) => {
  const sig = event.headers['x-cxi-signature'] || '';
  const ok = verify(sig, event.body || '');
  if(!ok){ return { statusCode: 401, body: JSON.stringify({ ok:false, reason:'bad_sig' }) }; }
  return { statusCode: 200, body: JSON.stringify({ ok:true }) };
};
