document.addEventListener('DOMContentLoaded', () => {
    const promptListElement = document.getElementById('promptList');
    const statusElement = document.getElementById('status');
    const editFormElement = document.getElementById('editPromptForm');
    
    const defaultPrompts = [
        {
            id: "solvedCorrectly",
            title: "Solved Correctly - Ask for Optimization",
            template: `Working on this leetcode question:

# {{PROBLEM_TITLE}}

\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

My solution:
\`\`\`
{{USER_CODE}}
\`\`\`

I've already solved this correctly. Please review it for potential optimizations and improvements.`
        },
        {
            id: "solvedWrong",
            title: "Solved Wrong - Ask for Mistakes & Fixes",
            template: `Working on this leetcode question:

# {{PROBLEM_TITLE}}

\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

My Attempted Solution:
\`\`\`
{{USER_CODE}}
\`\`\`

I am getting incorrect results. Please point out my mistakes and help me fix them.`
        },
        {
            id: "unsolvedStepByStepHint",
            title: "Unsolved - Step-by-Step Hints",
            template: `Working on this leetcode question:

# {{PROBLEM_TITLE}}

\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

I haven't solved this yet. Please provide step-by-step hints and guidance without immediately revealing the entire solution.`
        },
        {
            id: "unsolvedOptimalSolution",
            title: "Unsolved - Immediate Optimal Solution",
            template: `Working on this leetcode question:

# {{PROBLEM_TITLE}}

\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

I haven't solved this yet. Please provide the most optimal solution right away.`
        }
    ];

    function loadPrompts() {
        chrome.storage.sync.get('prompts', (data) => {
            let prompts = data.prompts || defaultPrompts;
            renderPromptList(prompts);
        });
    }

    function savePrompts(prompts) {
        chrome.storage.sync.set({ prompts }, () => {
            chrome.runtime.sendMessage({ action: 'promptsUpdated' });
            
            showStatus('Prompts saved successfully!', 'success');
            
            loadPrompts();
        });
    }

    function renderPromptList(prompts) {
        promptListElement.innerHTML = '';
        
        prompts.forEach(prompt => {
            const promptItem = document.createElement('div');
            promptItem.className = 'prompt-item';
            promptItem.innerHTML = `
                <h3>${prompt.title}</h3>
                <p><strong>ID:</strong> ${prompt.id}</p>
                <pre>${prompt.template}</pre>
                <div class="prompt-actions">
                    <button class="edit-btn" data-id="${prompt.id}">Edit</button>
                    <button class="delete delete-btn" data-id="${prompt.id}">Delete</button>
                </div>
            `;
            promptListElement.appendChild(promptItem);
        });
        
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
    }

    function showStatus(message, type) {
        statusElement.textContent = message;
        statusElement.className = `status ${type}`;
        
        setTimeout(() => {
            statusElement.className = 'status hidden';
        }, 3000);
    }

    function handleEditClick(e) {
        const promptId = e.target.dataset.id;
        
        chrome.storage.sync.get('prompts', (data) => {
            const prompts = data.prompts || defaultPrompts;
            const promptToEdit = prompts.find(p => p.id === promptId);
            
            if (promptToEdit) {
                document.getElementById('editId').value = promptToEdit.id;
                document.getElementById('editTitle').value = promptToEdit.title;
                document.getElementById('editTemplate').value = promptToEdit.template;
                
                editFormElement.classList.remove('hidden');
                window.scrollTo(0, editFormElement.offsetTop - 20);
            }
        });
    }

    function handleDeleteClick(e) {
        const promptId = e.target.dataset.id;
        
        if (confirm('Are you sure you want to delete this prompt?')) {
            chrome.storage.sync.get('prompts', (data) => {
                let prompts = data.prompts || defaultPrompts;
                prompts = prompts.filter(p => p.id !== promptId);
                savePrompts(prompts);
            });
        }
    }

    function handleAddPrompt() {
        const id = document.getElementById('newId').value.trim();
        const title = document.getElementById('newTitle').value.trim();
        const template = document.getElementById('newTemplate').value;
        
        if (!id || !title || !template) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }
        
        if (!/^[a-z0-9_]+$/.test(id)) {
            showStatus('ID must be lowercase with no spaces (only letters, numbers, and underscores).', 'error');
            return;
        }
        
        chrome.storage.sync.get('prompts', (data) => {
            let prompts = data.prompts || defaultPrompts;
            
            if (prompts.some(p => p.id === id)) {
                showStatus('A prompt with this ID already exists.', 'error');
                return;
            }
            
            prompts.push({ id, title, template });
            savePrompts(prompts);
            
            document.getElementById('newId').value = '';
            document.getElementById('newTitle').value = '';
            document.getElementById('newTemplate').value = '';
        });
    }

    function handleUpdatePrompt() {
        const id = document.getElementById('editId').value;
        const title = document.getElementById('editTitle').value.trim();
        const template = document.getElementById('editTemplate').value;
        
        if (!title || !template) {
            showStatus('Please fill in all fields.', 'error');
            return;
        }
        
        chrome.storage.sync.get('prompts', (data) => {
            let prompts = data.prompts || defaultPrompts;
            
            const updatedPrompts = prompts.map(p => {
                if (p.id === id) {
                    return { id, title, template };
                }
                return p;
            });
            
            savePrompts(updatedPrompts);
            editFormElement.classList.add('hidden');
        });
    }

    function handleCancelEdit() {
        editFormElement.classList.add('hidden');
    }

    document.getElementById('addPromptBtn').addEventListener('click', handleAddPrompt);
    document.getElementById('updatePromptBtn').addEventListener('click', handleUpdatePrompt);
    document.getElementById('cancelEditBtn').addEventListener('click', handleCancelEdit);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset to Defaults';
    resetButton.style.marginTop = '20px';
    document.body.appendChild(resetButton);
    
    resetButton.addEventListener('click', () => {
        if (confirm('This will delete all custom prompts and restore the default ones. Are you sure?')) {
            savePrompts(defaultPrompts);
        }
    });

    loadPrompts();
});