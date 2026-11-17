const $=s=>document.querySelector(s);
const api='https://pemdesgripit.id/api/v1/demo/buku-tamu';
const guest=new URLSearchParams(location.search).get('undangan');
const ownerKey='hadir-wedding-owner-v1';
let owner=JSON.parse(localStorage.getItem(ownerKey)||'null'), guests=[], selected=null, marked=false, creating=null;
let details={couple:'Laras & Damar',date:'2027-02-14',time:'10:00',place:'Pendopo Taman Pinus',theme:'pine'};
const sample=['Ayu Lestari','Raka Aditya','Dina Maharani'].map((name,i)=>({name,address:['Semarang','Solo','Yogyakarta'][i],count:2,attending:true,checked:false}));
async function req(path='',data=null,key=null){
 const res=await fetch(api+path,{method:data?'POST':'GET',cache:'no-store',credentials:'omit',headers:{Accept:'application/json',...(data?{'Content-Type':'application/json'}:{}),...(key?{Authorization:'Bearer '+key}:{})},body:data?JSON.stringify(data):undefined});
 if(!res.ok){const err=new Error(res.status===410?'Demo berakhir. Buat undangan baru.':res.status===409?'Tamu sudah check-in.':res.status===429?'Tunggu sebentar sebelum mencoba lagi.':'Permintaan gagal. Periksa koneksi atau isian.');err.status=res.status;throw err;}return res.status===204?null:res.json();
}
function render(){
 document.body.className=(guest?'guest ':'')+details.theme;
 $('#couple').textContent=details.couple;$('#when').textContent=new Date(details.date+'T12:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})+' · '+details.time;$('#venue').textContent=details.place;
 if(guest)return;
 const rows=owner?guests:sample;
 $('#expected').textContent=rows.reduce((n,g)=>n+(g.attending?g.count:0),0);$('#arrived').textContent=rows.reduce((n,g)=>n+(g.checked?g.count:0),0);
 $('#refresh').hidden=!owner;$('#rows').replaceChildren();
 for(let i=0;i<Math.max(6,rows.length);i++){const tr=$('#rows').insertRow(),g=rows[i];
 for(const val of [i+1,g?.name||'',g?.address||''])tr.insertCell().textContent=val;
 const cell=tr.insertCell();if(!g)continue;
 if(g.signature){const img=new Image();img.alt='Tanda tangan';img.src=g.signature;cell.append(img);}
 else if(!g.attending)cell.textContent='Berhalangan';else if(owner){const btn=document.createElement('button');btn.textContent='Check-in';btn.onclick=()=>{selected=g.id;$('#signer').textContent=g.name;clearPad();$('#sign').showModal();};cell.append(btn);}else cell.textContent='—';}
}
async function ensureOwner(){
 if(owner)return owner;
 if(!creating)creating=req('',details).then(result=>{localStorage.setItem(ownerKey,JSON.stringify(result));owner=result;guests=[];return result;}).finally(()=>creating=null);
 return creating;
}
async function sync(){
 const id=guest||owner?.id;if(!id)return;
 try{const data=await req('/'+encodeURIComponent(id),null,guest?null:owner.key);details=data.details;guests=data.guests||[];render();if(guest)$('#rsvp').hidden=false;}
 catch(e){if(e.status===410&&!guest){localStorage.removeItem(ownerKey);owner=null;guests=[];render();}if(guest)$('#rsvp').hidden=true;throw e;}
}
function problem(e){$('#message').textContent=e.message||'Koneksi gagal.';}
$('#custom').onclick=()=>{for(const [k,v] of Object.entries(details))$('#settings').elements[k].value=v;$('#edit').showModal();};
$('#settings').onsubmit=async e=>{e.preventDefault();const next=Object.fromEntries(new FormData(e.target)),btn=e.submitter;btn.disabled=true;try{await ensureOwner();await req('/'+owner.id,next,owner.key);details=next;render();$('#edit').close();$('#message').textContent='Undangan tersimpan.';}catch(err){$('#settings output').textContent=err.message;}finally{btn.disabled=false;}};
$('#share').onclick=async()=>{const btn=$('#share');btn.disabled=true;try{await ensureOwner();render();const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('undangan',owner.id);$('#url').value=url.href;$('#open').href=url.href;$('#qr').src=await makeQr(url.href);$('#sharing').showModal();}catch(e){problem(e);}finally{btn.disabled=false;}};
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#url').value);$('#copy').textContent='Tersalin';}catch{$('#url').select();}};
for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>b.closest('dialog').close();
$('#refresh').onclick=()=>sync().then(()=>$('#message').textContent='Rekap diperbarui.').catch(problem);
const form=$('#rsvp');form.elements.attending.onchange=()=>$('#numlabel').hidden=form.elements.attending.value==='no';
form.onsubmit=async e=>{e.preventDefault();const btn=e.submitter;btn.disabled=true;try{const k='hadir-rsvp:'+guest;const token=localStorage.getItem(k)||crypto.randomUUID();localStorage.setItem(k,token);await req('/'+guest,{token,name:form.elements.name.value,address:form.elements.address.value,attending:form.elements.attending.value==='yes',count:form.elements.attending.value==='yes'?Number(form.elements.count.value):0});$('#message').textContent='Terima kasih. Konfirmasi Anda tersimpan.';}catch(err){problem(err);}finally{btn.disabled=false;}};
const pad=$('canvas'),ctx=pad.getContext('2d');let drawing=false;
function clearPad(){ctx.clearRect(0,0,pad.width,pad.height);marked=false;$('#confirm').disabled=true;}
function xy(e){const r=pad.getBoundingClientRect();return [(e.clientX-r.left)*pad.width/r.width,(e.clientY-r.top)*pad.height/r.height];}
pad.onpointerdown=e=>{drawing=true;pad.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(...xy(e));ctx.lineWidth=2;ctx.lineCap='round';};
pad.onpointermove=e=>{if(drawing){ctx.lineTo(...xy(e));ctx.stroke();marked=true;$('#confirm').disabled=false;}};pad.onlostpointercapture=()=>drawing=false;
$('#reset').onclick=clearPad;$('#confirm').onclick=async()=>{if(!marked)return;$('#confirm').disabled=true;try{await req('/'+owner.id,{guest:selected,signature:pad.toDataURL()},owner.key);$('#sign').close();await sync();}catch(e){$('#sign').close();problem(e);}finally{$('#confirm').disabled=false;}};
if(guest){$('#owner').hidden=true;$('.heading h1').textContent='Undangan pernikahan';$('#leaf-title').textContent='Konfirmasi kedatangan';$('#page-label').textContent='RSVP';}
render();sync().catch(problem);
if(!guest)setInterval(()=>{if(owner&&!document.hidden&&!document.querySelector('dialog[open]'))sync().catch(problem);},12000);

