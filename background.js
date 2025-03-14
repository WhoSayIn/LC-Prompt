const menuItems = [
  {
    id: "solvedCorrectly",
    title: "Solved Correctly - Ask for Optimization",
    template: `Working on this leetcode question:
\`\`\`
{{SELECTED_TEXT}}
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
{{SELECTED_TEXT}}
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
{{SELECTED_TEXT}}
\`\`\`

I haven't solved this yet. Please provide step-by-step hints and guidance without immediately revealing the entire solution.`
  },
  {
    id: "unsolvedOptimalSolution",
    title: "Unsolved - Immediate Optimal Solution",
    template: `Working on this leetcode question:
\`\`\`
{{SELECTED_TEXT}}
\`\`\`

I haven't solved this yet. Please provide the most optimal solution right away.`
  }
];

chrome.runtime.onInstalled.addListener(() => {
  menuItems.forEach((item) => {
    chrome.contextMenus.create({
      id: item.id,
      title: item.title,
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    const item = menuItems.find((menuItem) => menuItem.id === info.menuItemId);
    if (item) {
      const finalText = item.template.replace("{{SELECTED_TEXT}}", info.selectionText);
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: (text) => {
          navigator.clipboard.writeText(text).catch((err) => {
            console.error("Failed to copy text:", err);
          });
        },
        args: [finalText]
      });

    }
  }
});
