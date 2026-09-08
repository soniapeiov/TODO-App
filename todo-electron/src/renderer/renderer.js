async function loadItems() {
  const items = await window.electronAPI.getItems();
  const list = document.getElementById('list');
  list.innerHTML = '';
  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'item';
    div.innerHTML = `<span>${item.Name}</span>
                     <span class="done-icon">${item.Done ? '✓' : ''}</span>`;
    div.addEventListener('click', () => {
      location.href = `item.html?id=${item.ID}`;
    });
    list.appendChild(div);
  });
}

document.getElementById('btn-add').addEventListener('click', () => {
  location.href = 'item.html';
});

loadItems();