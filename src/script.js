const darkModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#cccccc" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M20.958 15.325c.204-.486-.379-.9-.868-.684a7.684 7.684 0 0 1-3.101.648c-4.185 0-7.577-3.324-7.577-7.425a7.28 7.28 0 0 1 1.134-3.91c.284-.448-.057-1.068-.577-.936C5.96 4.041 3 7.613 3 11.862C3 16.909 7.175 21 12.326 21c3.9 0 7.24-2.345 8.632-5.675Z"/><path fill="currentColor" d="M15.611 3.103c-.53-.354-1.162.278-.809.808l.63.945a2.332 2.332 0 0 1 0 2.588l-.63.945c-.353.53.28 1.162.81.808l.944-.63a2.332 2.332 0 0 1 2.588 0l.945.63c.53.354 1.162-.278.808-.808l-.63-.945a2.332 2.332 0 0 1 0-2.588l.63-.945c.354-.53-.278-1.162-.809-.808l-.944.63a2.332 2.332 0 0 1-2.588 0l-.945-.63Z"/></svg>`;

const lightModeIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#333" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M12 1.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0V2a.75.75 0 0 1 .75-.75Z"/><path fill="currentColor" fill-rule="evenodd" d="M6.25 12a5.75 5.75 0 1 1 11.5 0a5.75 5.75 0 0 1-11.5 0ZM12 7.75a4.25 4.25 0 1 0 0 8.5a4.25 4.25 0 0 0 0-8.5Z" clip-rule="evenodd"/><path fill="currentColor" d="M5.46 4.399a.75.75 0 0 0-1.061 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM22.75 12a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm-3.149-6.54a.75.75 0 1 0-1.06-1.061l-.707.707a.75.75 0 1 0 1.06 1.06l.707-.707ZM12 20.25a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-1.5 0v-1a.75.75 0 0 1 .75-.75Zm6.894-2.416a.75.75 0 1 0-1.06 1.06l.707.707a.75.75 0 1 0 1.06-1.06l-.707-.707ZM3.75 12a.75.75 0 0 1-.75.75H2a.75.75 0 0 1 0-1.5h1a.75.75 0 0 1 .75.75Zm2.416 6.894a.75.75 0 0 0-1.06-1.06l-.707.707a.75.75 0 0 0 1.06 1.06l.707-.707Z"/></svg>`;

const actions = {
  punch: 2,
  bend: 7,
  upset: 13,
  shrink: 16,
  hit1: -3,
  hit2: -6,
  hit3: -9,
  draw: -15
};

const actionNames = {
  punch: "Punch (+2)",
  bend: "Bend (+7)",
  upset: "Upset (+13)",
  shrink: "Shrink (+16)",
  hit1: "Light Hit (-3)",
  hit2: "Medium Hit (-6)",
  hit3: "Heavy Hit (-9)",
  draw: "Draw (-15)"
};

document.addEventListener('DOMContentLoaded', function() {
  initializeMode();

  document.querySelectorAll('.action-icon').forEach(icon => {
    icon.src = '../res/empty.png';
    icon.setAttribute('data-action', '');
  });

  document.querySelectorAll('.priority').forEach(select => {
    select.selectedIndex = 0;
  });

  document.getElementById('target-value').value = '';
  document.getElementById('result').classList.remove('visible');
});

// Event listener for the dark mode toggle switch
document.getElementById('mode-toggle-checkbox').addEventListener('change', function () {
  if (this.checked) {
    document.body.classList.remove('light-mode');
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkMode', 'true');
    updateGitHubIconColor(true);
  } else {
    document.body.classList.remove('dark-mode');
    document.body.classList.add('light-mode');
    localStorage.setItem('darkMode', 'false');
    updateGitHubIconColor(false);
  }
  updateModeIcon();
});

// Function to update the mode icon
function updateModeIcon() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const modeIcon = document.getElementById('mode-icon');
  modeIcon.innerHTML = isDarkMode ? darkModeIcon : lightModeIcon;
}

// Set dark mode as default and handle mode persistence
function initializeMode() {
  const storedMode = localStorage.getItem('darkMode');
  let darkModeEnabled;
  if (storedMode === null) {
    darkModeEnabled = window.matchMedia('(prefers-color-scheme: dark)').matches;
  } else {
    darkModeEnabled = storedMode === 'true';
  }
  const modeToggle = document.getElementById('mode-toggle-checkbox');

  if (darkModeEnabled) {
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
    modeToggle.checked = true;
    updateGitHubIconColor(true);
  } else {
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
    modeToggle.checked = false;
    updateGitHubIconColor(false);
  }
  updateModeIcon();
}

// Helper function to create an image element for a given action
function createActionImage(action) {
  const img = document.createElement("img");
  img.src = `../res/${action}.png`;
  img.alt = action;
  img.title = actionNames[action] || (action.charAt(0).toUpperCase() + action.slice(1));
  img.classList.add("result-icon");
  return img;
}

// Function to apply tooltips to existing action icons in the instruction set and popup
function applyTooltipToIcon(iconElement) {
  const action = iconElement.getAttribute("data-action");
  if (action) {
    iconElement.title = actionNames[action] || (action.charAt(0).toUpperCase() + action.slice(1));
  } else if (action === "") {
    iconElement.title = "None";
  }
}

function runBFS() {
  const dist = Array(151).fill(Infinity);
  const parent = Array(151).fill(null);
  const parentAction = Array(151).fill(null);

  dist[0] = 0;
  const queue = [0];

  while (queue.length > 0) {
    const u = queue.shift();
    for (const action in actions) {
      const val = actions[action];
      const v = Math.max(0, Math.min(150, u + val));
      if (dist[v] === Infinity) {
        dist[v] = dist[u] + 1;
        parent[v] = u;
        parentAction[v] = action;
        queue.push(v);
      }
    }
  }
  return { dist, parent, parentAction };
}

function getHitCombinations(instructions) {
  const hitTiers = ["hit1", "hit2", "hit3"];
  const results = [];

  function generate(index, currentInstructions) {
    if (index === instructions.length) {
      results.push(currentInstructions);
      return;
    }

    const instr = instructions[index];
    if (instr.action === "hit") {
      for (const tier of hitTiers) {
        generate(index + 1, [
          ...currentInstructions,
          { ...instr, action: tier, originalIndex: index }
        ]);
      }
    } else {
      generate(index + 1, [
        ...currentInstructions,
        { ...instr, originalIndex: index }
      ]);
    }
  }

  generate(0, []);
  return results;
}

function isValidPermutation(p) {
  const n = p.length;
  for (let i = 0; i < n; i++) {
    const priority = p[i].priority;
    if (priority === 'last' && i !== n - 1) return false;
    if (priority === 'second-last' && i !== n - 2) return false;
    if (priority === 'third-last' && i !== n - 3) return false;
    if (priority === 'not-last' && i === n - 1) return false;
  }
  return true;
}

function simulateFinalPath(preTargetValue, sortedInstructions) {
  let val = preTargetValue;
  for (const instr of sortedInstructions) {
    val = Math.max(0, Math.min(150, val + actions[instr.action]));
  }
  return val;
}

function calculateSetupActions(targetValue, instructions) {
  const bfsResult = runBFS();
  const combinations = getHitCombinations(instructions);
  
  let bestCombination = null;
  let bestSetupActions = null;
  let minSetupLength = Infinity;
  let bestVs = null;

  for (const comb of combinations) {
    const sorted = sortInstructions(comb);
    if (!isValidPermutation(sorted)) continue;

    for (let Vs = 0; Vs <= 150; Vs++) {
      if (bfsResult.dist[Vs] === Infinity) continue;
      if (simulateFinalPath(Vs, sorted) === targetValue) {
        if (bfsResult.dist[Vs] < minSetupLength) {
          minSetupLength = bfsResult.dist[Vs];
          bestVs = Vs;
          bestCombination = sorted;
        }
      }
    }
  }

  if (bestCombination !== null && bestVs !== null) {
    const path = [];
    let curr = bestVs;
    while (curr !== 0) {
      path.push(bfsResult.parentAction[curr]);
      curr = bfsResult.parent[curr];
    }
    path.reverse();

    for (const resolvedInstr of bestCombination) {
      instructions[resolvedInstr.originalIndex].action = resolvedInstr.action;
    }
    return path;
  }

  return null;
}

function sortInstructions(instructions) {
  const last = instructions.filter(i => i.priority === 'last');
  const secondLast = instructions.filter(i => i.priority === 'second-last');
  const thirdLast = instructions.filter(i => i.priority === 'third-last');
  const notLast = instructions.filter(i => i.priority === 'not-last');
  const anyPriority = instructions.filter(i => i.priority === 'any');

  let sortedInstructions = [...thirdLast, ...secondLast, ...notLast, ...last];

  if (anyPriority.length > 0) {
    const anyHits = anyPriority.map(i => i);

    let insertionPoint = 0;
    if (last.length > 0 && secondLast.length > 0) {
      insertionPoint = sortedInstructions.length - last.length - secondLast.length;
    } else if (last.length > 0) {
      insertionPoint = sortedInstructions.length - last.length;
    } else {
      insertionPoint = sortedInstructions.length;
    }

    sortedInstructions.splice(insertionPoint, 0, ...anyHits);
  }

  return sortedInstructions;
}

function calculate() {
  const targetValueVal = document.getElementById("target-value").value;
  if (!targetValueVal) {
    document.getElementById("result").classList.remove("visible");
    return;
  }
  const targetValue = parseInt(targetValueVal);
  if (isNaN(targetValue)) {
    document.getElementById("result").classList.remove("visible");
    return;
  }

  const instructions = [];
  document.querySelectorAll("[class^='instruction-set']").forEach((set) => {
    const actionElement = set.querySelector(".action-icon");
    const action = actionElement.getAttribute("data-action");
    const priority = set.querySelector(".priority").value;
    if (action && priority) {
      instructions.push({ action, priority });
    }
  });

  const setupActions = calculateSetupActions(targetValue, instructions);
  const sortedInstructions = sortInstructions(instructions);

  const setupContainer = document.getElementById("setup-actions");
  const finalContainer = document.getElementById("final-actions");

  setupContainer.innerHTML = "";
  finalContainer.innerHTML = "";

  if (setupActions === null) {
    setupContainer.textContent = "No valid path found (values must stay in 0-150 range).";
  } else {
    setupActions.forEach(action => {
      setupContainer.appendChild(createActionImage(action));
    });
  }

  sortedInstructions.forEach(instr => {
    finalContainer.appendChild(createActionImage(instr.action));
  });

  const resultCard = document.getElementById("result");
  resultCard.classList.add("visible");
}

// Single function to manage icon selection
function setupInstructionListener(selector) {
  const setElement = document.querySelector(selector);
  const icon = setElement.querySelector('.action-icon');
  const container = document.querySelector('.container');
  const popup = document.getElementById('action-popup');
  const popupContent = document.querySelector('.action-popup-content');
  const header = document.querySelector('.app-header');

  const clearBtn = setElement.querySelector('.clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      icon.src = '../res/empty.png';
      icon.setAttribute('data-action', '');
      icon.title = 'None';
      const prioritySelect = setElement.querySelector('.priority');
      if (prioritySelect) {
        prioritySelect.selectedIndex = 0;
      }
      document.getElementById('result').classList.remove('visible');
      document.getElementById('setup-actions').innerHTML = '';
      document.getElementById('final-actions').innerHTML = '';
      calculate();
    });
  }

  const prioritySelect = setElement.querySelector('.priority');
  if (prioritySelect) {
    prioritySelect.addEventListener('change', calculate);
  }

  icon.addEventListener('click', function() {
    const currentIcon = this;
    popup.classList.remove('hidden');
    container.classList.add('blurred');

    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      popupIcon.onclick = null;
    });

    document.querySelectorAll('.popup-action-icon').forEach(popupIcon => {
      applyTooltipToIcon(popupIcon);

      popupIcon.onclick = function() {
        currentIcon.src = this.src;
        currentIcon.setAttribute('data-action', this.getAttribute('data-action'));
        closePopup();
        calculate();
      };
    });

    function handleOutsideClick(event) {
      if (!popupContent.contains(event.target) &&
          !icon.contains(event.target) &&
          !header.contains(event.target)) {
        closePopup();
      }
    }

    document.addEventListener('click', handleOutsideClick);

    function closePopup() {
      popup.classList.add('hidden');
      container.classList.remove('blurred');
      document.removeEventListener('click', handleOutsideClick);
    }

    document.getElementById('close-popup').onclick = closePopup;
  });

  applyTooltipToIcon(icon);
}

// Function to reset all inputs and selections
function resetPage() {
  // Reset target value input
  document.getElementById('target-value').value = '';

  // Reset instruction sets
  document.querySelectorAll('.instruction-set').forEach(set => {
    const actionIcon = set.querySelector('.action-icon');
    actionIcon.src = '../res/empty.png';
    actionIcon.setAttribute('data-action', '');
    actionIcon.title = 'None';

    const prioritySelect = set.querySelector('.priority');
    if (prioritySelect) {
      prioritySelect.selectedIndex = 0;
    }
  });

  // Hide result card
  const resultCard = document.getElementById('result');
  resultCard.classList.remove('visible');

  // Clear setup and final actions
  document.getElementById('setup-actions').innerHTML = '';
  document.getElementById('final-actions').innerHTML = '';
}

function updateGitHubIconColor(isDarkMode) {
  const githubIcon = document.getElementById('github-icon');
  if (githubIcon) {
    githubIcon.style.fill = isDarkMode ? '#ffffff' : '#24292f';
  }
}

// Call resetPage on window load
window.addEventListener('load', resetPage);

// Apply listeners to each instruction set
setupInstructionListener('.instruction-set-1');
setupInstructionListener('.instruction-set-2');
setupInstructionListener('.instruction-set-3');

document.getElementById("target-value").addEventListener("input", calculate);
document.getElementById("calculate-button").addEventListener("click", calculate);



