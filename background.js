const menuItems = [
  {
    id: "solvedCorrectly",
    title: "Solved Correctly - Ask for Optimization",
    template: `Working on this leetcode question:
\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

My solution:
\`\`\`

\`\`\`

I've already solved this correctly. Please review it for potential optimizations and improvements.`
  },
  {
    id: "solvedWrong",
    title: "Solved Wrong - Ask for Mistakes & Fixes",
    template: `Working on this leetcode question:
\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

My Attempted Solution:
\`\`\`

\`\`\`

I am getting incorrect results. Please point out my mistakes and help me fix them.`
  },
  {
    id: "unsolvedStepByStepHint",
    title: "Unsolved - Step-by-Step Hints",
    template: `Working on this leetcode question:
\`\`\`
{{PROBLEM_DESCRIPTION}}
\`\`\`

I haven't solved this yet. Please provide step-by-step hints and guidance without immediately revealing the entire solution.`
  },
  {
    id: "unsolvedOptimalSolution",
    title: "Unsolved - Immediate Optimal Solution",
    template: `Working on this leetcode question:
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
      const html = document.querySelector('[data-track-load="description_content"]').innerHTML;
      const container = document.createElement('div');
      container.innerHTML = html;
      container.querySelectorAll('sup').forEach((sup) => {
        const transformed = '^' + sup.textContent;
        sup.replaceWith(document.createTextNode(transformed));
      });
      return container.textContent;
    }
  }, (injectionResults) => {
    if (!injectionResults || !injectionResults[0]) return;
    const actualSelection = injectionResults[0].result;

    const finalText = selectedMenuItem.template.replace("{{PROBLEM_DESCRIPTION}}", actualSelection);

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
