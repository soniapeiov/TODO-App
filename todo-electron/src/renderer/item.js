const params = new URLSearchParams(window.location.search);
const id = params.get('id');
let currentItem = { ID: null, Name: '', Notes: '', Done: false };

async function init() {
  if (id) {
    const items = await window.electronAPI.getItems();
    currentItem = items.find(i => i.ID == id);
    document.getElementById('name').value = currentItem.Name || '';
    document.getElementById('notes').value = currentItem.Notes || '';
    document.getElementById('done').checked = !!currentItem.Done;
  }
}

document.getElementById('btn-save').addEventListener('click', async () => {
  const name = document.getElementById('name').value.trim();
  if (!name) { alert('Name is required'); return; }
  await window.electronAPI.saveItem({
    ID: currentItem.ID,
    Name: name,
    Notes: document.getElementById('notes').value,
    Done: document.getElementById('done').checked
  });
  location.href = 'index.html';
});

document.getElementById('btn-delete').addEventListener('click', async () => {
  if (currentItem.ID) await window.electronAPI.deleteItem(currentItem.ID);
  location.href = 'index.html';
});

document.getElementById('btn-cancel').addEventListener('click', () => {
  location.href = 'index.html';
});

init();