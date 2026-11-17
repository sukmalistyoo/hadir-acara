// A published invitation resolves its image only from its own event directory.
(() => {
  const frame = document.querySelector('#gift-frame');
  const picture = document.querySelector('#gift-image');
  const eventId = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
  function display(src) {
    frame.hidden = true;
    if (!src) {
      picture.removeAttribute('src');
      return;
    }
    picture.onload = () => { frame.hidden = false; };
    picture.onerror = () => { frame.hidden = true; };
    picture.src = src;
  }
  if (guest) {
    if (eventId.test(guest)) display('amplop/' + guest + '.png');
    return;
  }
  if (preview) {
    if (parent !== window) {
      window.addEventListener('message', e => {
        if (e.origin === location.origin && e.source === parent && e.data?.type === 'gift-preview') {
          display(e.data.src);
        }
      });
      parent.postMessage({type:'gift-ready'},location.origin);
    }
    return;
  }
  const file = document.querySelector('#gift-file');
  const remove = document.querySelector('#gift-remove');
  const download = document.querySelector('#gift-export');
  const message = document.querySelector('#gift-status');
  const stage = document.querySelector('#stage');
  let src = '', revision = 0;
  function refresh() {
    remove.hidden = download.hidden = !src;
    stage.contentWindow?.postMessage({type:'gift-preview',src},location.origin);
  }
  window.addEventListener('message', e => {
    if (e.origin === location.origin && e.source === stage.contentWindow && e.data?.type === 'gift-ready') refresh();
  });
  file.onchange = async () => {
    const chosen = file.files[0];
    if (!chosen) return;
    const version = ++revision;
    let bitmap;
    try {
      if (!['image/png','image/jpeg','image/webp'].includes(chosen.type) || chosen.size > 5*1024*1024)
        throw Error('Pilih PNG, JPG, atau WebP hingga 5 MB.');
      bitmap = await createImageBitmap(chosen);
      if (version !== revision) return;
      const canvas = document.createElement('canvas');
      const scale = Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
      canvas.width = Math.max(1,Math.round(bitmap.width*scale));
      canvas.height = Math.max(1,Math.round(bitmap.height*scale));
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = 'white';
      ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
      src = canvas.toDataURL('image/png');
      refresh();
      message.textContent = 'QR terpasang di pratinjau.';
    } catch (error) {
      if(version === revision) message.textContent = error.name === 'Error' ? error.message : 'Gambar belum dapat dibuka.';
    } finally { bitmap?.close(); }
  };
  remove.onclick = () => {
    revision++;
    src = ''; file.value = ''; message.textContent = '';
    refresh();
  };
  download.onclick = async () => {
    download.disabled = true;
    try {
      const event = await ensureOwner();
      if (!src || !eventId.test(event.id)) return;
      const link = document.createElement('a');
      link.href = src; link.download = event.id+'.png'; link.click();
      message.textContent = 'Tempatkan file di folder amplop pada hosting acara.';
    } catch { message.textContent = 'File acara belum siap. Coba lagi.'; }
    finally { download.disabled = false; }
  };
})();
