const issuesCon = document.getElementById('issues-con');
const issueCountEl = document.getElementById('issue-count');
const loadingSpinner = document.getElementById('loadingSpinner');

const allBtn = document.getElementById('all-btn');
const openBtn = document.getElementById('open-btn');
const closeBtn = document.getElementById('close-btn');

let allIssues = [];

function showLoading(){
    loadingSpinner.classList.remove("hidden");
 };
 function removeLoading(){
    loadingSpinner.classList.add("hidden");
 };

function toggleBtn(id) {
    // sob button theke blue remove, white add
    [allBtn, openBtn, closeBtn].forEach(btn => {
        if (!btn) return;
        btn.classList.remove('bg-[#4A00FF]', 'text-white');
        btn.classList.add('bg-white', 'text-gray-500');
    });

    const selected = document.getElementById(id);
    if (selected) {
        selected.classList.remove('bg-white', 'text-gray-500');
        selected.classList.add('bg-[#4A00FF]', 'text-white');
    }

    // filter data by status
    let filtered = allIssues;
    if (id === 'open-btn') {
        filtered = allIssues.filter(issue => issue?.status?.toLowerCase() === 'open');
    } else if (id === 'close-btn') {
        filtered = allIssues.filter(issue => issue?.status?.toLowerCase() === 'closed');
    }

    displayCards(filtered);
}


async function loadCard() {
    showLoading();
    const res = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://phi-lab-server.vercel.app/api/v1/lab/issues'));
    const data = await res.json();
    allIssues = data.data || [];
    removeLoading();
    displayCards(allIssues);
}

function displayCards(issues) {
    if (!issuesCon) return;
    issuesCon.innerHTML = '';

    if (issueCountEl) issueCountEl.textContent = issues.length;

    if (!Array.isArray(issues) || issues.length === 0) {
        issuesCon.innerHTML = '<p class="text-gray-500 p-4">No issues found.</p>';
        return;
    }

    issues.forEach((issue) => {
        const isOpen = issue?.status?.toLowerCase() === 'open';
        const borderClass = isOpen ? 'border-t-4 border-green-500' : 'border-t-4 border-purple-500';
        const statusImg = isOpen ? 'assets/Open-Status.png' : 'assets/Closed- Status .png';
        const priority = issue?.priority || 'High';
        const priorityLower = (priority || 'High').toString().toLowerCase();
        const priorityClass = priorityLower === 'high' ? 'text-red-500 bg-[#FEECEC]' : priorityLower === 'medium' ? 'text-purple-600 bg-purple-100' : 'text-red-600 bg-red-100';
        const author = issue?.author || 'unknown';
        const createdAt = issue?.createdAt ? new Date(issue.createdAt).toLocaleDateString() : '';

        let labelsHtml = '';
        if (priorityLower === 'low') {
            labelsHtml = `<button class=" uppercase btn rounded-full" style="color: #00A96E; background: #BBF7D0;">Enhancement</button>`;
        } else if (priorityLower === 'high' || priorityLower === 'medium') {
            labelsHtml = `<button class=" uppercase btn text-red-500 bg-[#FEECEC] rounded-full">Bug</button><button class=" uppercase btn text-[#D97706] bg-[#FFF8DB] rounded-full">help wanted</button>`;
        }

        const card = document.createElement('div');
        card.className = `card p-4 shadow-2xl bg-white ${borderClass}`;
        card.innerHTML = `
            <div class="flex justify-between">
                <img src="${statusImg}" alt="${isOpen ? 'open' : 'closed'}">
                <button class="btn ${priorityClass} rounded-full px-[25px] uppercase">${priority}</button>
            </div>
            <div class="my-3">
                <h2 class="text-2xl font-semibold mb-2">${issue?.title || 'Untitled'}</h2>
                <p class="line-clamp-2">${issue?.description || ''}</p>
            </div>
            <div class="flex flex-wrap gap-1">
                ${labelsHtml}
            </div>
            <hr class="text-gray-300 my-4">
            <div>
                <p>#${issue?.id || ''} by ${author}</p>
                <p>${createdAt}</p>
            </div>
        `;
        issuesCon.appendChild(card);
    });
}


// search er jonne
document.getElementById("btn-search").addEventListener("click", () =>{

    const input = document.getElementById("input-search");

    const searchValue = input.value.trim().toLowerCase();

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q={searchText}")
    .then((res) => res.json())
    .then((data) => {

        const allWords = data.data;

        const filterWord = allWords.filter(word =>
            word.word && word.word.toLowerCase().includes(searchValue)
        );

        displayLevelWord(filterWord);
    });

});

loadCard();