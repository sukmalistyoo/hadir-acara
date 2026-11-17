const $=s=>document.querySelector(s);
const api='https://pemdesgripit.id/api/v1/demo/buku-tamu';
const guest=new URLSearchParams(location.search).get('undangan');
const params=new URLSearchParams(location.search);
const preview=params.has('contoh') && !guest;
const invitation=Boolean(guest)||preview;
const designs=['floral','pinus','klasik'];
const requested=params.get('contoh')||params.get('tema');
const design=designs.includes(requested)?requested:'floral';
const recipient=(params.get('untuk')||'').trim().slice(0,70);
const ownerKey='hadir-wedding-owner-v1';
let owner=JSON.parse(localStorage.getItem(ownerKey)||'null'), guests=[], selected=null, marked=false, creating=null;
let details={couple:'Laras & Damar',date:'2027-02-14',time:'10:00',place:'Pendopo Taman Pinus',theme:'pine'};
const sample=['Ayu Lestari','Raka Aditya','Dina Maharani'].map((name,i)=>({name,address:['Semarang','Solo','Yogyakarta'][i],count:2,attending:true,checked:false}));
async function req(path='',data=null,key=null){
 const res=await fetch(api+path,{method:data?'POST':'GET',cache:'no-store',credentials:'omit',headers:{Accept:'application/json',...(data?{'Content-Type':'application/json'}:{}),...(key?{Authorization:'Bearer '+key}:{})},body:data?JSON.stringify(data):undefined});
 if(!res.ok){const err=new Error(res.status===410?'Demo berakhir. Buat undangan baru.':res.status===409?'Tamu sudah check-in.':res.status===429?'Tunggu sebentar sebelum mencoba lagi.':'Permintaan gagal. Periksa koneksi atau isian.');err.status=res.status;throw err;}return res.status===204?null:res.json();
}
function render(){
 document.body.className=invitation?'guest invitation '+design:details.theme;
 $('#couple').textContent=details.couple;$('#when').textContent=new Date(details.date+'T12:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})+' · '+details.time;$('#venue').textContent=details.place;
 if(invitation){
   $('#names').textContent=details.couple;
   $('#schedule').textContent=$('#when').textContent;
   $('#location').textContent=details.place;
   return;
 }
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
async function shareGuestLink(atDoor) {
 const btn=$(atDoor?'#bookqr':'#share');
 btn.disabled=true;
 try{
   await ensureOwner();render();
   const url=new URL(atDoor?'buku-tamu.html':'wedding.html',location.href);
   if(atDoor){
     const data=await req('/'+owner.id,null,owner.key);
     url.searchParams.set('acara',owner.id);url.hash=data.entry_key;
   }else {
     url.searchParams.set('undangan',owner.id);
     attachDesign(url);
   }
   $('#sharing h2').textContent=atDoor?'QR Buku Tamu':'Undangan digital';
   $('#open').textContent=atDoor?'Buka form tamu ↗':'Buka undangan ↗';
   $('#qr').alt=atDoor?'QR Buku Tamu':'QR undangan';$('#copy').textContent='Salin';
   $('#url').value=url.href;$('#open').href=url.href;$('#qr').src=await makeQr(url.href);$('#sharing').showModal();
 }catch(e){problem(e);}finally{btn.disabled=false;}
}
$('#share').onclick=()=>shareGuestLink(false);
$('#bookqr').onclick=()=>shareGuestLink(true);
$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#url').value);$('#copy').textContent='Tersalin';}catch{$('#url').select();}};
for(const b of document.querySelectorAll('[data-close]'))b.onclick=()=>b.closest('dialog').close();
$('#refresh').onclick=()=>sync().then(()=>$('#message').textContent='Rekap diperbarui.').catch(problem);
const form=$('#rsvp');form.elements.attending.onchange=()=>$('#numlabel').hidden=form.elements.attending.value==='no';
form.onsubmit=async e=>{e.preventDefault();if(preview){$('#message').textContent='Terima kasih. Simulasi konfirmasi selesai.';return;}const btn=e.submitter;btn.disabled=true;try{const k='hadir-rsvp:'+guest;const token=localStorage.getItem(k)||crypto.randomUUID();localStorage.setItem(k,token);await req('/'+guest,{token,name:form.elements.name.value,address:form.elements.address.value,attending:form.elements.attending.value==='yes',count:form.elements.attending.value==='yes'?Number(form.elements.count.value):0});$('#message').textContent='Terima kasih. Konfirmasi Anda tersimpan.';}catch(err){problem(err);}finally{btn.disabled=false;}};
const pad=$('canvas'),ctx=pad.getContext('2d');let drawing=false;
function clearPad(){ctx.clearRect(0,0,pad.width,pad.height);marked=false;$('#confirm').disabled=true;}
function xy(e){const r=pad.getBoundingClientRect();return [(e.clientX-r.left)*pad.width/r.width,(e.clientY-r.top)*pad.height/r.height];}
pad.onpointerdown=e=>{drawing=true;pad.setPointerCapture(e.pointerId);ctx.beginPath();ctx.moveTo(...xy(e));ctx.lineWidth=2;ctx.lineCap='round';};
pad.onpointermove=e=>{if(drawing){ctx.lineTo(...xy(e));ctx.stroke();marked=true;$('#confirm').disabled=false;}};pad.onlostpointercapture=()=>drawing=false;
$('#reset').onclick=clearPad;$('#confirm').onclick=async()=>{if(!marked)return;$('#confirm').disabled=true;try{await req('/'+owner.id,{guest:selected,signature:pad.toDataURL()},owner.key);$('#sign').close();await sync();}catch(e){$('#sign').close();problem(e);}finally{$('#confirm').disabled=false;}};
function attachDesign(url){
 url.searchParams.set('tema',$('#design').value);
 url.searchParams.set('isi',$('#wording').value);
 const name=$('#to').value.trim();
 if(name)url.searchParams.set('untuk',name);
}
function updatePreview(){
 const url=new URL('wedding.html',location.href);
 attachDesign(url);
 url.searchParams.set('contoh',url.searchParams.get('tema'));
 url.searchParams.set('v','amplop1');
 url.searchParams.delete('tema');
 const book=$('#show-book').getAttribute('aria-pressed')==='true';
 const stage=$('#stage');
 stage.title=book?'Pratinjau buku tamu':'Pratinjau undangan';
 stage.src=book?'buku-tamu.html?contoh=1':url.href;
 $('#invitation-options').hidden=book;
}
if(invitation){
 const islam=params.get('isi')==='islami';
 document.body.dataset.wording=islam?'islami':'umum';
 $('.basmalah').hidden=!islam;
 $('#greeting').textContent=islam?'Assalamu’alaikum warahmatullahi wabarakatuh.':'Salam hangat,';
 $('#intro').textContent=islam?'Dengan memohon rida Allah SWT, kami mengundang Bapak, Ibu, dan Saudara untuk menghadiri walimah pernikahan kami.':'Dengan penuh sukacita, kami mengundang Anda untuk merayakan hari pernikahan kami bersama keluarga dan sahabat.';
 $('#event-kind').textContent=islam?'Walimatul ‘Urs':'Resepsi pernikahan';
 $('#blessing').textContent=islam?'Mohon doa agar rumah tangga kami senantiasa diliputi ketenteraman, kasih sayang, dan rahmat Allah.':'Kehadiran Anda akan membuat hari kami semakin berkesan. Terima kasih atas kasih dan doa restunya.';
 $('#owner').hidden=true;
 document.title='Undangan Pernikahan';
 $('.cover').setAttribute('aria-label','Undangan pernikahan');
 $('.cover-copy span').textContent=islam?'Walimatul ‘Urs':'Undangan Pernikahan';
 $('.dedication').hidden=false;
 $('#recipient').textContent=recipient||'Bapak/Ibu/Saudara/i';
 if(recipient)form.elements.name.value=recipient;
 $('#leaf-title').textContent='Konfirmasi kedatangan';
 if(preview)form.hidden=false;
 $('#page-label').textContent='Resepsi pernikahan';
 $('.leaf').hidden=true;
 $('#occasion').hidden=false;
 $('#unseal').onclick=()=>{
   $('.leaf').hidden=false;
   $('.cover').hidden=true;
   $('#names').tabIndex=-1;
   $('#names').focus();
   window.scrollTo(0,0);
 };
}else{
 $('.cover').hidden=true;
 $('#studio').hidden=false;
 for(const id of ['show-invite','show-book']){
   $('#'+id).onclick=()=>{
     for(const button of document.querySelectorAll('.switch button'))button.setAttribute('aria-pressed',String(button.id===id));
     updatePreview();
   };
 }
 const settingsKey='hadir-wedding-invitation-style';
 const designSelect=$('#design'), wordingSelect=$('#wording');
 try{
   const saved=JSON.parse(localStorage.getItem(settingsKey));
   if(designs.includes(saved?.design))designSelect.value=saved.design;
   if(['islami','umum'].includes(saved?.wording))wordingSelect.value=saved.wording;
 }catch{}
 function saveStyle(){
   try{localStorage.setItem(settingsKey,JSON.stringify({design:designSelect.value,wording:wordingSelect.value}));}catch{}
   updatePreview();
 }
 designSelect.onchange=saveStyle;
 wordingSelect.onchange=saveStyle;
 let typing;
 $('#to').oninput=()=>{clearTimeout(typing);typing=setTimeout(updatePreview,250);};
 if(params.get('lihat')==='buku-tamu')$('#show-book').click();
 else updatePreview();
}
render();
if(!preview)sync().catch(problem);
if(!invitation)setInterval(()=>{if(owner&&!document.hidden&&!document.querySelector('dialog[open]'))sync().catch(problem);},12000);
