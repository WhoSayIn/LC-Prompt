const menuItems = [
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

chrome.runtime.onInstalled.addListener(() => {
  menuItems.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ["all"],
      documentUrlPatterns: ["https://leetcode.com/problems/*"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const selectedMenuItem = menuItems.find((menuItem) => menuItem.id === info.menuItemId);
  if (!selectedMenuItem || !tab || !tab.id) return;

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      // Get problem title
      const titleElement = document.querySelector('.text-title-large');
      const problemTitle = titleElement ? titleElement.textContent.trim() : "";
      
      // Get problem description
      const html = document.querySelector('[data-track-load="description_content"]').innerHTML;
      const container = document.createElement('div');
      container.innerHTML = html;
      container.querySelectorAll('sup').forEach((sup) => {
        const transformed = '^' + sup.textContent;
        sup.replaceWith(document.createTextNode(transformed));
      });
      const problemDescription = container.textContent;
      
      // Get user code
      let userCode = '';
      try {
        const editor = document.querySelector('.monaco-editor');
        if (editor) {
          const textArea = editor.querySelector('textarea');
          if (textArea && textArea.value) {
            userCode = textArea.value;
          } else {
            const codeLines = editor.querySelectorAll('.view-line');
            if (codeLines && codeLines.length > 0) {
              userCode = Array.from(codeLines).map(line => line.textContent).join('\n');
            }
          }
        }
      } catch (e) {
        userCode = "// Could not retrieve your code";
      }
      
      return {
        title: problemTitle,
        description: problemDescription,
        code: userCode
      };
    }
  }, (injectionResults) => {
    if (!injectionResults || !injectionResults[0]) return;
    const result = injectionResults[0].result;

    let finalText = selectedMenuItem.template
      .replace("{{PROBLEM_TITLE}}", result.title)
      .replace("{{PROBLEM_DESCRIPTION}}", result.description)
      .replace("{{USER_CODE}}", result.code);

    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (text) => {
        navigator.clipboard.writeText(text).catch((err) => {
          console.error("Failed to copy text:", err);
        });
      },
      args: [finalText]
    });
  });
});
