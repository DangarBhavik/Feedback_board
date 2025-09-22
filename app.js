let data = [];


const searchInput = document.getElementById("q");
const cancelButton = document.getElementById('closeModal');
const addBtn = document.getElementById("addList");
const titleInput = document.getElementById("titleInput");
const descInput = document.getElementById("descInput");
const tagsInput = document.getElementById("tagsInput");
const commenInput = document.getElementById("commenInput");


let countadd = 0;

const stored = localStorage.getItem("items");
if (stored) {
    data = JSON.parse(stored);
    renderList(data);
    userEnteredData(data);
} else {
    fetch('./feedback.json')
    .then(response => response.json())
    .then(jsonData => {
        data = jsonData;
        renderList(data);
        userEnteredData(data);
        localStorage.setItem("items", JSON.stringify(data));
    });
}
displayTag();

function userEnteredData(data){
    
    addBtn.addEventListener("click" ,()=>{
    countadd++;
    let nextId = Math.max(...data.map(item => item.id), 0) + 1;
    let title = titleInput.value;
    let desc = descInput.value;
    let tags = tagsInput.value.split(" ").filter(tag => tag.trim() !== '');
    let comments = commenInput.value;
    const now = new Date(); 
    const Udata = {
        id: nextId,
        title,
        desc,
        tags,
        comments,
        createdAt: now.toISOString(),
        upvotes: 0
    }

    
    
    data.push(Udata);
    localStorage.setItem('items', JSON.stringify(data));
  
    renderList(data);
           
    

    titleInput.value = "";
    descInput.value = "";
    tagsInput.value = "";
    commenInput.value = "";

})



}

function renderList(data){
    
    
    const list = document.getElementById("list");
    list.innerHTML = "";
    data.forEach(item=>{
        const div = document.createElement('div')
        
        div.classList.add("card");

        const ids = document.createElement('h2');
        ids.textContent = item.id;
        div.appendChild(ids);

        const titleElement = document.createElement('h2');
        titleElement.textContent = item.title;
        div.appendChild(titleElement);

        const descElement = document.createElement('h4');
        descElement.textContent = `Desc:  ${item.desc}`;
        div.appendChild(descElement);

        const tagsList = document.createElement('ul');

            item.tags.forEach(tag => {
                const tagLi = document.createElement('li');
                tagLi.textContent = tag;
                tagsList.appendChild(tagLi);
            });
        div.appendChild(tagsList);

        const commElement = document.createElement('h4');
        commElement.textContent = `comment:  ${item.comments}`;
        div.appendChild(commElement);

        const createAtElement = document.createElement('h4');
        createAtElement.textContent = `createdAt:  ${item.createdAt}`;
        div.appendChild(createAtElement);

        const upvote = document.createElement('button');
        upvote.textContent = `Upvotes: ${item.upvotes || 0}`;

        upvote.addEventListener("click",(event)=>{
            event.stopPropagation();
            item.upvotes = (item.upvotes || 0 )+1;
            localStorage.setItem("items",JSON.stringify(data));
            renderList(data);
        })
        div.appendChild(upvote);
        div.addEventListener("click", () => {
        showInModal(item);
        });
        list.appendChild(div);
        
        
    })
    localStorage.setItem('items', JSON.stringify(data));


}

function showInModal(item){
    const modal = document.getElementById("modal");
    const modalContent = document.getElementById("modalContent");

    modalContent.innerHTML = "";

        const ids = document.createElement('h2');
        ids.textContent = item.id;
        modalContent.appendChild(ids);

        const titleElement = document.createElement('h2');
        titleElement.textContent = item.title;
        modalContent.appendChild(titleElement);

        const descElement = document.createElement('h4');
        descElement.textContent = `Desc:  ${item.desc}`;
        modalContent.appendChild(descElement);

        const tagsList = document.createElement('ul');

            item.tags.forEach(tag => {
                const tagLi = document.createElement('li');
                tagLi.textContent = tag;
                tagsList.appendChild(tagLi);
            });
        modalContent.appendChild(tagsList);

        const commElement = document.createElement('h4');
        commElement.textContent = `comment:  ${item.comments}`;
        modalContent.appendChild(commElement);

        const createAtElement = document.createElement('h4');
        createAtElement.textContent = `createdAt:  ${item.createdAt}`;
        modalContent.appendChild(createAtElement);

        const upvote = document.createElement('button');
        upvote.textContent = `Upvotes: ${item.upvotes || 0}`;

        upvote.addEventListener("click",(event)=>{
            event.stopPropagation();
            item.upvotes = (item.upvotes || 0 )+1;
            localStorage.setItem("items",JSON.stringify(data));
            upvote.textContent = `Upvotes: ${item.upvotes}`;
            renderList(data);
        })
        modalContent.appendChild(upvote);

        modal.style.display = "flex";
        
    
}
const modal = document.getElementById("modal");

cancelButton.addEventListener("click", () => {
    modal.style.display = "none";
});


modal.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});


const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const darkThemeClass = 'dark';
const localStorageKey = 'themePreference';

function applyTheme(theme) {
    if (theme === 'dark') {
        body.classList.add(darkThemeClass);
    } else {
        body.classList.remove(darkThemeClass);
    }
}

function saveTheme(theme) {
    localStorage.setItem(localStorageKey, theme);
}

function loadTheme() {
    return localStorage.getItem(localStorageKey);
}

const savedTheme = loadTheme();
if (savedTheme) {
    applyTheme(savedTheme);
}else {
    applyTheme('light'); 
}

themeBtn.addEventListener('click', () => {
    if (body.classList.contains(darkThemeClass)) {
        applyTheme('light');
        saveTheme('light');
    } else {
        applyTheme('dark');
        saveTheme('dark');
    }
});

function displayTag() {
  const tagSelect = document.getElementById("tag");
  const tags = [...new Set(data.flatMap(item => item.tags || []))];

  tagSelect.innerHTML = '<option value="">All tags</option>';
  tags.forEach(tag => {
    tagSelect.innerHTML += `<option value="${tag}">${tag}</option>`;
  });
}



function applyFilters(){
    let filtered = [...data];

    const search = searchInput.value.toLowerCase();
    const tag = document.getElementById("tag").value;
    const sort = document.getElementById("sort").value;

    if(search){
        filtered = filtered.filter(item =>
            item.title.toLowerCase().includes(search) ||
            item.desc.toLowerCase().includes(search)
        )
    }

    if(tag){
        filtered = filtered.filter(item => item.tags && item.tags.includes(tag));
    }

    if(sort === "newest"){
        filtered.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
    }
    if(sort === "upvotes"){
        filtered.sort((a,b)=>(b.upvotes || 0) - (a.upvotes || 0));

    }
    if(sort === "comments"){
        filtered.sort((a,b)=> (b.comments || 0) - (a.comments || 0));
    }
    renderList(filtered);
}




searchInput.addEventListener("input",applyFilters);
document.getElementById("tag").addEventListener("change",applyFilters);
document.getElementById("sort").addEventListener("change",applyFilters);
document.getElementById("modal").style.display = "none";

