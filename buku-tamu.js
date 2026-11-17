const el=id=>document.getElementById(id), form=el('entry'), pad=el('ink'), ctx=pad.getContext('2d');
const room=new URLSearchParams(location.search).get('acara'),entryKey=location.hash.slice(1);
const preview=!room && new URLSearchParams(location.search).has('contoh');
const api='https://pemdesgripit.id/api/v1/demo/buku-tamu/'+encodeURIComponent(room||'');
const tokenKey='hadir-entry:'+room;
let drawing=false,marked=false,token=sessionStorage.getItem(tokenKey)||crypto.randomUUID();
for(let i=1;i<=10;i++)form.elements.count.add(new Option(i,i));
function point(e){const r=pad.getBoundingClientRect();return [(e.clientX-r.left)*pad.width/r.width,(e.clientY-r.top)*pad.height/r.height];}
pad.onpointerdown=e=>{if(e.button!==0)return;drawing=true;pad.setPointerCapture(e.pointerId);ctx.strokeStyle='#203d31';ctx.lineWidth=2.4;ctx.lineJoin=ctx.lineCap='round';ctx.beginPath();ctx.moveTo(...point(e));};
pad.onpointermove=e=>{if(drawing){ctx.lineTo(...point(e));ctx.stroke();marked=true;}};
pad.onlostpointercapture=()=>drawing=false;
el('clear').onclick=()=>{ctx.clearRect(0,0,pad.width,pad.height);marked=false;};
function finish(){form.hidden=true;el('heading').hidden=true;el('msg').hidden=true;el('done').hidden=false;sessionStorage.removeItem(tokenKey);}
async function init(){
 if(preview){
   el('names').textContent='Laras & Damar';el('event').textContent='Pendopo Taman Pinus';form.hidden=false;el('msg').textContent='';return;
 }
 if(!/^[0-9a-f-]{36}$/i.test(room||'')||!/^[0-9a-f]{64}$/.test(entryKey)){el('msg').textContent='Pindai QR Buku Tamu dari meja penerima tamu.';return;}
 const res=await fetch(api,{cache:'no-store',credentials:'omit',headers:{Accept:'application/json'}});
 if(!res.ok)throw Error(res.status===410?'Acara sudah berakhir.':'Buku tamu belum dapat dibuka.');
 const {details:d}=await res.json();el('names').textContent=d.couple;document.body.className=d.theme;
 el('event').textContent=[new Date(d.date+'T12:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'}),d.place].join(' · ');
 el('msg').textContent='';form.hidden=false;sessionStorage.setItem(tokenKey,token);
}
form.onsubmit=async e=>{e.preventDefault();if(!marked){el('msg').textContent='Bubuhkan tanda tangan terlebih dahulu.';return;}
 if(preview){el('done').querySelector('p').textContent='Simulasi kehadiran selesai.';finish();return;}
 const button=e.submitter;button.disabled=true;
 try{const data={token,entry_key:entryKey,rsvp_token:localStorage.getItem('hadir-rsvp:'+room),name:form.elements.name.value.trim(),address:form.elements.address.value.trim(),count:Number(form.elements.count.value),attending:true,ink:pad.toDataURL('image/png')};
 const r=await fetch(api,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},credentials:'omit',body:JSON.stringify(data)});
 if(r.ok||r.status===409){finish();return;}
 const error=await r.json().catch(()=>({}));throw Error(r.status===403?'QR tidak valid. Minta QR Buku Tamu kepada penerima tamu.':r.status===410?'Acara sudah berakhir.':r.status===422?(error.message==='Kuota demo penuh.'?error.message:'Periksa nama, jumlah orang, dan tanda tangan Anda.'):'Gagal menyimpan. Silakan coba lagi.');
 }catch(err){el('msg').textContent=err.message;}finally{button.disabled=false;}
};
init().catch(err=>{el('msg').textContent=err.message;});

