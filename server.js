// Alegria — Rise of Olympus | dependency-free Node.js API server
// Node 18+ recommended. Persistent JSON datastore is created in /data locally, or /tmp on serverless platforms.
const http = require('node:http');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = __dirname;
const PUBLIC = fs.existsSync(path.join(ROOT, 'public'))
  ? path.join(ROOT, 'public')
  : path.join(process.cwd(), 'public');
const IS_SERVERLESS = Boolean(
  process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NOW_REGION
);
const DATA_DIR = IS_SERVERLESS
  ? path.join(os.tmpdir(), 'alegria-data')
  : path.join(ROOT, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PORT = Number(process.env.PORT || 3000);
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@alegria.local').toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Olympus@2027!';
const JWT_SECRET = process.env.JWT_SECRET || 'replace-this-secret-before-deployment-2027';
const FESTIVAL_EVENTS = [
  {id:1,name:'Apollo’s Lyre',category:'Music',prize:'₹30,000',team:'Solo or duet'},
  {id:2,name:'Orpheus Battle of Bands',category:'Music',prize:'₹60,000',team:'Team of 3 to 7'},
  {id:3,name:'Terpsichore',category:'Dance',prize:'₹50,000',team:'Team of 6 to 16'},
  {id:4,name:'Dionysus Dance-Off',category:'Dance',prize:'₹20,000',team:'Solo or crew'},
  {id:5,name:'Thespis Stage Play',category:'Drama',prize:'₹40,000',team:'Team of 8 to 15'},
  {id:6,name:'Muse of Mime',category:'Drama',prize:'₹10,000',team:'Solo or duo'},
  {id:7,name:'Athena’s Canvas',category:'Art',prize:'₹15,000',team:'Solo'},
  {id:8,name:'Hephaestus Forge',category:'Art',prize:'₹15,000',team:'Team of 2 to 3'},
  {id:9,name:'Homer’s Odyssey',category:'Literary',prize:'₹12,000',team:'Solo'},
  {id:10,name:'Oracle of Delphi Quiz',category:'Literary',prize:'₹10,000',team:'Team of 3'},
  {id:11,name:'Ares Arena',category:'Gaming',prize:'₹35,000',team:'Team of 5'},
  {id:12,name:'Zeus’s Thunderbolt',category:'Gaming',prize:'₹20,000',team:'Squad of 4'}
];

function createInitialDB() {
  return {registrations:[], admins:[{email:ADMIN_EMAIL, createdAt:new Date().toISOString()}]};
}

let fsWritable = true;
try {
  fs.mkdirSync(DATA_DIR, {recursive:true});
} catch (err) {
  fsWritable = false;
  console.warn('Data directory not writable, using in-memory store:', err.message);
}

function readDB() {
  if (!fsWritable) return createInitialDB();
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = createInitialDB();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  } catch (err) {
    console.warn('Database read/init fallback to memory:', err.message);
    fsWritable = false;
    return createInitialDB();
  }
}

let db = readDB();

function saveDB() {
  if (!fsWritable) return;
  try {
    const tmp = DB_FILE + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(db, null, 2));
    fs.renameSync(tmp, DB_FILE);
  } catch (err) {
    console.warn('Database save fallback to memory:', err.message);
    fsWritable = false;
  }
}

const mime = {'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.svg':'image/svg+xml'};
function send(res,status,data,headers={}) {
  res.writeHead(status, {'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});
  res.end(JSON.stringify(data));
}
function readBody(req) {
  if (req.body !== undefined) {
    if (typeof req.body === 'string') {
      try { return Promise.resolve(req.body ? JSON.parse(req.body) : {}); }
      catch { return Promise.reject(new Error('Invalid JSON body')); }
    }
    return Promise.resolve(req.body || {});
  }
  if (req.readableEnded) return Promise.resolve({});
  return new Promise((resolve,reject)=>{
    let raw=''; req.on('data',chunk=>{raw+=chunk; if(raw.length>1e6) reject(new Error('Request body too large'));});
    req.on('end',()=>{try{resolve(raw?JSON.parse(raw):{});}catch{reject(new Error('Invalid JSON body'));}});
    req.on('error',reject);
  });
}
function sign(payload) {
  const header = Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})).toString('base64url');
  const body = Buffer.from(JSON.stringify({...payload,iat:Date.now(),exp:Date.now()+8*60*60*1000})).toString('base64url');
  const data = header+'.'+body;
  const sig = crypto.createHmac('sha256',JWT_SECRET).update(data).digest('base64url');
  return data+'.'+sig;
}
function verify(token) {
  if(!token) return null;
  const parts=token.split('.');
  if(parts.length!==3) return null;
  const expected=crypto.createHmac('sha256',JWT_SECRET).update(parts[0]+'.'+parts[1]).digest();
  let actual; try { actual=Buffer.from(parts[2],'base64url'); } catch { return null; }
  if(actual.length!==expected.length || !crypto.timingSafeEqual(actual,expected)) return null;
  try { const p=JSON.parse(Buffer.from(parts[1],'base64url').toString()); return p.exp>Date.now()?p:null; } catch { return null; }
}
function auth(req) {
  const value=req.headers.authorization||'';
  return verify(value.startsWith('Bearer ')?value.slice(7):'');
}
function passCode() {
  let code;
  do { code='OLY-'+crypto.randomBytes(3).toString('hex').toUpperCase(); }
  while(db.registrations.some(r=>r.code===code));
  return code;
}
function safeRegistration(r) {
  const {name,email,phone,college,year,pass,events,code,status,createdAt}=r;
  return {name,email,phone,college,year,pass,events,code,status,createdAt};
}
function adminRegistration(r) {
  return {id:r.id,...safeRegistration(r)};
}

async function handleRequest(req, res) {
  const host = (req.headers && req.headers.host) || 'localhost';
  const url = new URL(req.url || '/', `http://${host}`);
  const route = url.pathname;
  try {
    if(req.method==='GET' && route==='/api/health') return send(res,200,{ok:true,service:'Alegria API',database:fsWritable?'file-json':'memory',time:new Date().toISOString()});
    if(req.method==='GET' && route==='/api/events') return send(res,200,{events:FESTIVAL_EVENTS});
    if(req.method==='POST' && route==='/api/registrations') {
      const b=await readBody(req);
      const name=String(b.name||'').trim(), email=String(b.email||'').trim().toLowerCase();
      const phone=String(b.phone||'').trim(), college=String(b.college||'').trim();
      const year=String(b.year||''), pass=String(b.pass||'Mortal');
      const ids=Array.isArray(b.events)?[...new Set(b.events.map(Number))]:[];
      if(name.length<2 || name.length>90) return send(res,400,{error:'Please enter a valid full name.'});
      if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return send(res,400,{error:'Please enter a valid email address.'});
      if(!/^[0-9+ ()-]{10,18}$/.test(phone)) return send(res,400,{error:'Please enter a valid phone number.'});
      if(college.length<2 || college.length>140) return send(res,400,{error:'Please enter your college name.'});
      if(!['Mortal','Hero','Immortal'].includes(pass)) return send(res,400,{error:'Invalid pass selected.'});
      if(!ids.length || ids.some(id=>!FESTIVAL_EVENTS.some(e=>e.id===id))) return send(res,400,{error:'Select at least one valid event.'});
      if(pass==='Mortal' && ids.length!==1) return send(res,400,{error:'Mortal pass is for one event. Select one event or choose Hero/Immortal.'});
      if(pass==='Hero' && ids.length>5) return send(res,400,{error:'Hero pass allows up to five events.'});
      const record={id:crypto.randomUUID(),code:passCode(),name,email,phone,college,year,pass,events:ids,status:'confirmed',createdAt:new Date().toISOString()};
      db.registrations.push(record); saveDB();
      return send(res,201,{message:'Registration successful.',registration:safeRegistration(record)});
    }
    if(req.method==='GET' && route.startsWith('/api/registrations/')) {
      const code=decodeURIComponent(route.split('/').pop()).toUpperCase();
      const record=db.registrations.find(r=>r.code===code);
      return record?send(res,200,{registration:safeRegistration(record)}):send(res,404,{error:'Pass code not found.'});
    }
    if(req.method==='POST' && route==='/api/admin/login') {
      const b=await readBody(req), email=String(b.email||'').trim().toLowerCase(), password=String(b.password||'');
      const a=crypto.createHash('sha256').update(password).digest();
      const expected=crypto.createHash('sha256').update(ADMIN_PASSWORD).digest();
      if(email!==ADMIN_EMAIL || !crypto.timingSafeEqual(a,expected)) return send(res,401,{error:'Incorrect admin email or password.'});
      return send(res,200,{token:sign({sub:ADMIN_EMAIL,role:'admin'}),admin:{email:ADMIN_EMAIL}});
    }
    if(route.startsWith('/api/admin/')) {
      const user=auth(req);
      if(!user || user.role!=='admin' || user.sub!==ADMIN_EMAIL) return send(res,401,{error:'Admin authentication required.'});
      if(req.method==='GET' && route==='/api/admin/registrations') {
        const rows=[...db.registrations].sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
        return send(res,200,{total:rows.length,confirmed:rows.filter(r=>r.status==='confirmed').length,registrations:rows.map(adminRegistration)});
      }
      if(req.method==='PATCH' && route.startsWith('/api/admin/registrations/')) {
        const id=decodeURIComponent(route.split('/').pop()), b=await readBody(req);
        const record=db.registrations.find(r=>r.id===id);
        if(!record) return send(res,404,{error:'Registration not found.'});
        if(!['confirmed','checked-in','cancelled'].includes(b.status)) return send(res,400,{error:'Invalid registration status.'});
        record.status=b.status; saveDB(); return send(res,200,{registration:adminRegistration(record)});
      }
      return send(res,404,{error:'Admin endpoint not found.'});
    }
    // Static frontend
    let reqPath = '/';
    try { reqPath = decodeURIComponent(route); } catch { return send(res,400,{error:'Bad request'}); }
    const resolvedPublic = path.resolve(PUBLIC);
    const file = path.resolve(reqPath==='/'?path.join(resolvedPublic,'index.html'):path.join(resolvedPublic,reqPath.replace(/^\/+/,'')));
    if(file!==resolvedPublic && !file.startsWith(resolvedPublic+path.sep)) return send(res,403,{error:'Forbidden'});
    if(!fs.existsSync(file) || fs.statSync(file).isDirectory()) return send(res,404,{error:'Not found'});
    const ext=path.extname(file).toLowerCase();
    res.writeHead(200,{'Content-Type':mime[ext]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin'});
    fs.createReadStream(file).pipe(res);
  } catch(err) {
    console.error(err);
    if(!res.headersSent) send(res,500,{error:err.message||'Internal server error'});
  }
}

const server = http.createServer(handleRequest);
if (require.main === module && !process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', ()=>console.log(`Alegria server running at http://0.0.0.0:${PORT}`));
}

module.exports = handleRequest;
module.exports.server = server;
