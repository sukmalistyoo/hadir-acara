const $=s=>document.querySelector(s);
const defaults={instansi:'Pemerintah Kabupaten Teladan',desa:'Pemerintah Desa Suka Karya',kantor:'Jl. Balai Desa No. 1 · Kecamatan Harapan',acara:'Musyawarah rencana pelayanan desa',tanggal:'Senin, 16 November 2026',mulai:'09.00',selesai:'Selesai',tempat:'Balai Desa Suka Karya',jabatan:'Kepala Desa',pejabat:'Ardi Pratama'};
const initial=()=>({...defaults,slots:1,rows:[]});
let doc={...initial(),rows:[['Arga Pradana','L','Dusun Timur, RT 01','Perangkat desa','AP'],['Ratih Utami','P','Dusun Barat, RT 02','Kader','RU'],['Bima Wicara','L','Dusun Tengah, RT 03','Ketua RT','BW']]};
let archives=[];try{archives=JSON.parse(localStorage.getItem('hadir-arsip-demo'))||[];}catch{}
function list(){const select=$('#archive');select.replaceChildren(new Option('Pilih arsip lokal',''));archives.forEach((d,i)=>select.add(new Option(d.acara||'Rapat',i)));}
function draw(){
 for(const e of document.querySelectorAll('[data-text]'))e.textContent=doc[e.dataset.text];
 const meta=$('#meta');meta.replaceChildren();for(const [k,v] of Object.entries({'Hari / Tanggal':doc.tanggal,Jam:doc.mulai+' s/d '+doc.selesai+' WIB',Tempat:doc.tempat,Acara:doc.acara,'Jumlah Peserta':doc.rows.length+' orang'})){const t=document.createElement('dt'),d=document.createElement('dd');t.textContent=k;d.textContent=v;meta.append(t,d);}
 const body=$('tbody');body.replaceChildren();for(let i=0;i<Math.max(doc.rows.length,doc.slots);i++){const r=doc.rows[i]||['','','','',''];const tr=body.insertRow();for(const v of [i+1,...r.slice(0,4)])tr.insertCell().textContent=v;const c=tr.insertCell();if(r[4]?.startsWith('data:image/png;base64,')){const img=new Image();img.src=r[4];img.alt='Tanda tangan contoh';c.append(img);}else{const em=document.createElement('em');em.textContent=r[4];c.append(em);}}
}
function load(){for(const e of document.querySelectorAll('[data-field]'))e.value=doc[e.dataset.field];$('#slots').value=doc.slots;draw();}
for(const e of document.querySelectorAll('[data-field]'))e.oninput=()=>{doc[e.dataset.field]=e.value;draw();};
$('#slots').onchange=e=>{doc.slots=Math.max(1,Math.min(100,Number(e.target.value)||1));load();};
$('#save').onclick=()=>{try{const next=archives.filter(x=>x.id!==doc.id);doc.id??=crypto.randomUUID();next.push(structuredClone(doc));localStorage.setItem('hadir-arsip-demo',JSON.stringify(next));archives=next;list();$('#status').textContent='Tersimpan di browser';}catch{$('#status').textContent='Penyimpanan lokal penuh atau diblokir.';}};
$('#new').onclick=()=>{doc={...initial(),acara:''};load();$('#archive').value='';$('#status').textContent='Arsip baru';};
$('#archive').onchange=e=>{if(e.target.value!==''){doc=structuredClone(archives[Number(e.target.value)]);load();}};
$('#qr').onclick=()=>$('#dialog').showModal();
const pad=$('#pad'),ctx=pad.getContext('2d');let down=false,marked=false;
function point(e){const r=pad.getBoundingClientRect();return [(e.clientX-r.left)*pad.width/r.width,(e.clientY-r.top)*pad.height/r.height];}
pad.onpointerdown=e=>{down=true;marked=true;pad.setPointerCapture(e.pointerId);ctx.lineWidth=2;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...point(e));};
pad.onpointermove=e=>{if(down){ctx.lineTo(...point(e));ctx.stroke();}};pad.onlostpointercapture=()=>down=false;
$('#clear').onclick=()=>{marked=false;ctx.clearRect(0,0,pad.width,pad.height);};
$('#add').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);doc.rows.push([f.get('nama'),f.get('jk'),f.get('alamat'),f.get('peran'),marked?pad.toDataURL():'']);draw();e.target.reset();$('#clear').click();$('#status').textContent='Peserta ditambahkan';};
list();load();
if(new URLSearchParams(location.search).has('peserta')){const section=$('#add').closest('details');section.open=true;section.scrollIntoView();$('#add input').focus();}

