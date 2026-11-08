const {requireTest,respond}=require('./_common');
const SHOP='pilot-shop';
async function query(method,body,headers={}){
 const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!url||!key)throw Error('Supabase not configured');
 const r=await fetch(url+'/rest/v1/pos_shop_state?shop_id=eq.'+SHOP+(method==='GET'?'&select=shop_id,revision,data,updated_at':''),{
 method,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',...headers},...(body?{body:JSON.stringify(body)}:{})});
 if(!r.ok)throw Error('Supabase state error: '+await r.text());
 const t=await r.text();return t?JSON.parse(t):null;
}
module.exports=async(req,res)=>{
 try{
 requireTest(req);res.setHeader('Cache-Control','no-store');
 if(req.method==='GET'){
  const rows=await query('GET');return respond(res,200,rows?.[0]||{shop_id:SHOP,revision:0,data:null});
 }
 if(req.method!=='PUT')return respond(res,405,{error:'Method not allowed'});
 const {revision,data}=req.body||{};
 if(!Number.isSafeInteger(revision)||revision<0||!data||typeof data!=='object'||Array.isArray(data))return respond(res,400,{error:'Invalid revision or state'});
 const payload=JSON.stringify(data);if(payload.length>750000)return respond(res,413,{error:'State too large'});
 if(!Array.isArray(data.jobs)||!Array.isArray(data.therapists)||!Array.isArray(data.members))return respond(res,400,{error:'Invalid POS data'});
 if(revision===0){
  const rows=await query('POST',{shop_id:SHOP,revision:1,data},{Prefer:'resolution=ignore-duplicates,return=representation'});
  if(rows?.length)return respond(res,200,{revision:1});
  return respond(res,409,{error:'Cloud state already initialized. Reload before saving.'});
 }
 const url=process.env.SUPABASE_URL,key=process.env.SUPABASE_SERVICE_ROLE_KEY;
 const r=await fetch(url+'/rest/v1/pos_shop_state?shop_id=eq.'+SHOP+'&revision=eq.'+revision,{method:'PATCH',headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify({revision:revision+1,data,updated_at:new Date().toISOString()})});
 if(!r.ok)throw Error('Supabase update error: '+await r.text());
 const rows=await r.json();if(!rows.length)return respond(res,409,{error:'Another device updated the shop. Reload to avoid overwriting changes.'});
 return respond(res,200,{revision:revision+1});
 }catch(e){return respond(res,e.message.startsWith('Unauthorized')?401:500,{error:e.message})}
};
