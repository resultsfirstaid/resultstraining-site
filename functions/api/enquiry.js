// Cloudflare Pages Function. Requires RESEND_API_KEY, ENQUIRY_TO_EMAIL,
// and ENQUIRY_FROM_EMAIL configured in Cloudflare Pages environment variables.
const interests = new Set(['Not sure yet','Book a public course','Workplace training','Mental health training','First aid equipment and servicing','Something else']);
const clean = (value, limit) => String(value ?? '').trim().slice(0, limit);
const escapeHtml = (value) => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const response = (body, status=200) => new Response(JSON.stringify(body), {status, headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}});
export async function onRequestPost({request, env}) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > 16000) return response({error:'Your message is too long.'},413);
  let data;
  try {
    const type = request.headers.get('content-type') || '';
    if (!type.includes('application/json')) return response({error:'Invalid submission format.'},415);
    data = await request.json();
  } catch { return response({error:'Please check your details and try again.'},400); }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return response({error:'Invalid enquiry.'},400);
  if (clean(data.website,100)) return response({ok:true});
  const name=clean(data.name,120), email=clean(data.email,254), phone=clean(data.phone,40), message=clean(data.message,4000), interest=clean(data.interest,80);
  if (!name || !email || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !interests.has(interest)) return response({error:'Please complete your name, a valid email and a message.'},400);
  if (String(data.message ?? '').length > 4000) return response({error:'Your message is too long.'},400);
  if (!env.RESEND_API_KEY || !env.ENQUIRY_TO_EMAIL || !env.ENQUIRY_FROM_EMAIL) return response({error:'The enquiry form is not configured yet. Please email training@resultsfirstaid.com.'},503);
  const fields=[['Name',name],['Email',email],['Phone',phone || 'Not provided'],['Enquiry type',interest],['Message',message]];
  const html='<h2>New Results Training enquiry</h2>'+fields.map(([key,value])=>`<p><strong>${escapeHtml(key)}</strong><br>${escapeHtml(value).replace(/\n/g,'<br>')}</p>`).join('');
  try {
    const res=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({from:env.ENQUIRY_FROM_EMAIL,to:env.ENQUIRY_TO_EMAIL.split(',').map(v=>v.trim()).filter(Boolean),reply_to:email,subject:`Results Training enquiry: ${interest}`,html})});
    if (!res.ok) { console.error('Resend failed',res.status); return response({error:'We could not send your enquiry. Please email training@resultsfirstaid.com.'},502); }
    return response({ok:true});
  } catch(error) { console.error('Enquiry delivery error',String(error));return response({error:'We could not send your enquiry. Please email training@resultsfirstaid.com.'},502); }
}
export async function onRequestGet(){return response({error:'Method not allowed.'},405);}
