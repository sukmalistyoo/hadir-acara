const $=s=>document.querySelector(s), api='https://pemdesgripit.id/api/v1/demo/hadir-acara';
const slides=[['Rapat koordinasi pelayanan','Agenda hari ini: evaluasi pelayanan, usulan warga, dan penetapan tindak lanjut.'],['Usulan perbaikan','Sederhanakan formulir permohonan dan tampilkan daftar persyaratan di meja pelayanan.'],['Tindak lanjut','Susun panduan singkat, tunjuk penanggung jawab, dan bahas hasil uji coba pada rapat berikutnya.']];
const guest=new URLSearchParams(location.search).get('sesi');let session=null,state=null,busy=false,timer;
async function request(path='',data){
 const r=await fetch(api+path,{method:data?'POST':'GET',cache:'no-store',credentials:'omit',headers:{Accept:'application/json',...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined});
 if(!r.ok)throw Object.assign(Error('Permintaan gagal'),{status:r.status});return r.json();
}
function paint(){
 const [title,body]=slides[state.page-1];$('article').hidden=false;$('#num').textContent='Halaman '+state.page+' / 3';$('#title').textContent=title;$('#body').textContent=body;$('#setup').hidden=true;$('#tools').hidden=!!guest;$('#prev').disabled=busy||state.page===1;$('#next').disabled=busy||state.page===3;
}
function problem(e){
 if(e.status===410){clearTimeout(timer);sessionStorage.removeItem('hadir-live');$('article').hidden=true;$('#tools').hidden=true;$('#setup').hidden=!!guest;$('#msg').textContent=guest?'Sesi selesai. Minta QR baru dari operator.':'Sesi berakhir. Mulai sesi baru.';return;}
 $('#msg').textContent=e.status===429?'Terlalu banyak permintaan. Coba lagi sebentar.':'Koneksi terputus. Coba lagi.';
}
async function sync(){
 try{state=await request('/'+encodeURIComponent(session.room));paint();$('#msg').textContent='';}
 catch(e){problem(e);if(e.status===410)return;}
 if(guest)timer=setTimeout(sync,document.hidden?4500:1200);
}
$('#start').onclick=async()=>{const btn=$('#start');btn.disabled=true;try{session=await request('',{});sessionStorage.setItem('hadir-live',JSON.stringify(session));await sync();}catch(e){problem(e);}finally{btn.disabled=false;}};
async function move(step){if(busy)return;busy=true;paint();try{state=await request('/'+session.room,{page:state.page+step,revision:state.revision,key:session.key});$('#msg').textContent='';}catch(e){if(e.status===409)await sync();else{problem(e);if(e.status===410){state=null;}}}finally{busy=false;if(state)paint();}}
$('#next').onclick=()=>move(1);$('#prev').onclick=()=>move(-1);
$('#share').onclick=async()=>{const url=new URL('https://pemdesgripit.id/demo/hadir-acara/materi.html');url.searchParams.set('sesi',session.room);$('#guest').href=url.href;$('#code').src=await makeQr(url.href);$('dialog').showModal();};
$('#close').onclick=()=>$('dialog').close();$('#copy').onclick=async()=>{try{await navigator.clipboard.writeText($('#guest').href);$('#copy').textContent='Tersalin';}catch{$('#guest').focus();}};
if(guest){$('#setup').hidden=true;session={room:guest};sync();}else{try{session=JSON.parse(sessionStorage.getItem('hadir-live'));}catch{}if(session?.room && session?.key)sync();}

