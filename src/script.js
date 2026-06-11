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
  hit: "Hit (-3 / -6 / -9)",
  hit1: "Light Hit (-3)",
  hit2: "Medium Hit (-6)",
  hit3: "Heavy Hit (-9)",
  draw: "Draw (-15)",
  empty: "None"
};

document.addEventListener('DOMContentLoaded', function() {
  initializeMode();
  initializeTheme();

  document.querySelectorAll('.action-icon').forEach(icon => {
    icon.src = `../res/${getTheme()}/empty.png`;
    icon.setAttribute('data-action', '');
  });

  document.querySelectorAll('.priority').forEach(select => {
    select.selectedIndex = 0;
  });

  document.getElementById('target-value').value = '';
  document.getElementById('result').classList.remove('visible');
  
  // initialize bookmarks
  initBookmarks();
  
  // ensure all icon paths are updated to the correct theme
  updateAllIconSources();
});

// event listener for the dark mode toggle switch
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

// function to update the mode icon
function updateModeIcon() {
  const isDarkMode = document.body.classList.contains('dark-mode');
  const modeIcon = document.getElementById('mode-icon');
  modeIcon.innerHTML = isDarkMode ? darkModeIcon : lightModeIcon;
}

// set dark mode as default and handle mode persistence
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

// helper function to create an image element for a given action
function createActionImage(action) {
  const img = document.createElement("img");
  img.src = `../res/${getTheme()}/${action}.png`;
  img.alt = action;
  img.title = actionNames[action] || (action.charAt(0).toUpperCase() + action.slice(1));
  img.classList.add("result-icon");
  return img;
}

// function to apply tooltips to existing action icons in the instruction set and popup
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

function checkDuplicatePriorities() {
  const prioritySelects = document.querySelectorAll('.priority');
  const warningBanner = document.getElementById('priority-warning');
  
  if (!warningBanner) return false;
  
  // clear previous warnings
  warningBanner.classList.add('hidden');
  prioritySelects.forEach(select => select.classList.remove('warning-input'));
  
  // count priorities
  const priorityCounts = {};
  const uniquePriorities = ['last', 'second-last', 'third-last'];
  
  prioritySelects.forEach(select => {
    const val = select.value;
    if (uniquePriorities.includes(val)) {
      priorityCounts[val] = (priorityCounts[val] || 0) + 1;
    }
  });
  
  let hasDuplicates = false;
  // mark duplicate select elements
  prioritySelects.forEach(select => {
    const val = select.value;
    if (uniquePriorities.includes(val) && priorityCounts[val] > 1) {
      select.classList.add('warning-input');
      hasDuplicates = true;
    }
  });
  
  if (hasDuplicates) {
    warningBanner.classList.remove('hidden');
  }
  
  return hasDuplicates;
}

function calculate() {
  const hasDuplicates = checkDuplicatePriorities();

  const targetValueVal = document.getElementById("target-value").value;
  if (!targetValueVal || hasDuplicates) {
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
  
  const setupDiv = document.querySelector(".setup");
  const finalDiv = document.querySelector(".final-instructions");
  const errorDiv = document.getElementById("no-path-error");

  setupContainer.innerHTML = "";
  finalContainer.innerHTML = "";

  if (setupActions === null) {
    if (setupDiv) setupDiv.classList.add("hidden");
    if (finalDiv) finalDiv.classList.add("hidden");
    if (errorDiv) {
      errorDiv.classList.remove("hidden");
    }
  } else {
    if (setupDiv) setupDiv.classList.remove("hidden");
    if (finalDiv) finalDiv.classList.remove("hidden");
    if (errorDiv) errorDiv.classList.add("hidden");

    setupActions.forEach(action => {
      setupContainer.appendChild(createActionImage(action));
    });

    sortedInstructions.forEach(instr => {
      finalContainer.appendChild(createActionImage(instr.action));
    });
  }

  const resultCard = document.getElementById("result");
  resultCard.classList.add("visible");
}

// single function to manage icon selection
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
      icon.src = `../res/${getTheme()}/empty.png`;
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
        applyTooltipToIcon(currentIcon); // fix tooltip on selection
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

// function to reset all inputs and selections
function resetPage() {
  // reset target value input
  document.getElementById('target-value').value = '';

  // reset preset name input
  const nameInput = document.getElementById('bookmark-name');
  if (nameInput) {
    nameInput.value = '';
  }

  // hide priority warning
  const warningBanner = document.getElementById('priority-warning');
  if (warningBanner) {
    warningBanner.classList.add('hidden');
  }

  // reset instruction sets
  document.querySelectorAll('.instruction-set').forEach(set => {
    const actionIcon = set.querySelector('.action-icon');
    actionIcon.src = `../res/${getTheme()}/empty.png`;
    actionIcon.setAttribute('data-action', '');
    actionIcon.title = 'None';

    const prioritySelect = set.querySelector('.priority');
    if (prioritySelect) {
      prioritySelect.selectedIndex = 0;
      prioritySelect.classList.remove('warning-input');
    }
  });

  // hide result card
  const resultCard = document.getElementById('result');
  resultCard.classList.remove('visible');

  // clear setup and final actions
  document.getElementById('setup-actions').innerHTML = '';
  document.getElementById('final-actions').innerHTML = '';
}

function updateGitHubIconColor(isDarkMode) {
  const githubIcon = document.getElementById('github-icon');
  if (githubIcon) {
    githubIcon.style.fill = isDarkMode ? '#ffffff' : '#24292f';
  }
}

// call resetpage on window load
window.addEventListener('load', resetPage);

// apply listeners to each instruction set
setupInstructionListener('.instruction-set-1');
setupInstructionListener('.instruction-set-2');
setupInstructionListener('.instruction-set-3');

document.getElementById("target-value").addEventListener("input", calculate);
document.getElementById("calculate-button").addEventListener("click", calculate);

// bookmarks logic
function initBookmarks() {
  let bookmarks = JSON.parse(localStorage.getItem('anvil_bookmarks') || '[]');
  
  // remove old default presets if present
  const defaultNames = ["Pickaxe Head (TFC)", "Sword Blade (TFC)", "Shovel Head (TFC)"];
  const beforeLength = bookmarks.length;
  bookmarks = bookmarks.filter(b => !defaultNames.includes(b.name));
  
  // if we removed default presets or if localstorage was empty, save the updated list
  if (bookmarks.length !== beforeLength || localStorage.getItem('anvil_bookmarks') === null) {
    localStorage.setItem('anvil_bookmarks', JSON.stringify(bookmarks));
  }
  
  // set event listeners for bookmark saving
  const saveBtn = document.getElementById('save-bookmark-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveCurrentBookmark);
  }
  
  const nameInput = document.getElementById('bookmark-name');
  if (nameInput) {
    nameInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        saveCurrentBookmark();
      }
    });
  }
  
  renderBookmarks();
}

function renderBookmarks() {
  const listContainer = document.getElementById('bookmarks-list');
  if (!listContainer) return;
  listContainer.innerHTML = '';
  
  const bookmarks = JSON.parse(localStorage.getItem('anvil_bookmarks') || '[]');
  
  bookmarks.forEach(bm => {
    const item = document.createElement('div');
    item.className = 'bookmark-item';
    
    // create preview icons html
    let iconsHtml = '';
    bm.instructions.forEach(ins => {
      const action = ins.action || 'empty';
      const priority = ins.priority || 'none';
      const title = `${actionNames[action] || action || 'None'} (${priority})`;
      iconsHtml += `<img src="../res/${getTheme()}/${action}.png" class="bookmark-preview-icon" title="${title}" alt="${action}">`;
    });
    
    item.innerHTML = `
      <div class="bookmark-info">
        <div class="bookmark-title" title="${bm.name}">${bm.name}</div>
        <div class="bookmark-details">
          <span>Target: ${bm.target || 'None'}</span>
          <div class="bookmark-preview-icons">
            ${iconsHtml}
          </div>
        </div>
      </div>
      <div class="bookmark-actions">
        <button class="bookmark-load-btn">Load</button>
        <button class="bookmark-delete-btn" title="Delete preset">X</button>
      </div>
    `;
    
    // attach load click listener to the load button only
    const loadBtn = item.querySelector('.bookmark-load-btn');
    if (loadBtn) {
      loadBtn.addEventListener('click', () => {
        loadBookmark(bm.name, item);
      });
    }
    
    // handle delete button click
    const deleteBtn = item.querySelector('.bookmark-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        deleteBookmark(bm.name);
      });
    }
    
    listContainer.appendChild(item);
  });
}

function loadBookmark(name, elementToFlash) {
  const bookmarks = JSON.parse(localStorage.getItem('anvil_bookmarks') || '[]');
  const bm = bookmarks.find(b => b.name === name);
  if (!bm) return;
  
  // load target value
  document.getElementById('target-value').value = bm.target || '';
  
  // load each slot
  bm.instructions.forEach((ins, idx) => {
    const setSelector = `.instruction-set-${idx + 1}`;
    const setElement = document.querySelector(setSelector);
    if (!setElement) return;
    
    const icon = setElement.querySelector('.action-icon');
    const prioritySelect = setElement.querySelector('.priority');
    
    const action = ins.action || '';
    icon.src = `../res/${getTheme()}/${action || 'empty'}.png`;
    icon.setAttribute('data-action', action);
    applyTooltipToIcon(icon);
    
    if (prioritySelect) {
      prioritySelect.value = ins.priority || '';
    }
  });
  
  // perform calculation
  calculate();
  
  // flash element if provided
  if (elementToFlash) {
    elementToFlash.classList.add('flash-loaded');
    setTimeout(() => {
      elementToFlash.classList.remove('flash-loaded');
    }, 800);
  }
}

function saveCurrentBookmark() {
  const nameInput = document.getElementById('bookmark-name');
  const name = nameInput.value.trim();
  
  if (!name) {
    nameInput.focus();
    nameInput.placeholder = "Please enter a name first!";
    nameInput.classList.add('warning-input');
    setTimeout(() => {
      nameInput.classList.remove('warning-input');
      nameInput.placeholder = "Preset name (e.g. Iron Pickaxe)";
    }, 2000);
    return;
  }
  
  const targetVal = document.getElementById('target-value').value;
  const target = targetVal ? parseInt(targetVal) : '';
  
  const instructions = [];
  for (let i = 1; i <= 3; i++) {
    const setElement = document.querySelector(`.instruction-set-${i}`);
    if (setElement) {
      const actionIcon = setElement.querySelector('.action-icon');
      const action = actionIcon.getAttribute('data-action') || '';
      const priority = setElement.querySelector('.priority').value || '';
      instructions.push({ action, priority });
    }
  }
  
  const bookmarks = JSON.parse(localStorage.getItem('anvil_bookmarks') || '[]');
  const existingIdx = bookmarks.findIndex(b => b.name.toLowerCase() === name.toLowerCase());
  
  const newBookmark = { name, target, instructions };
  
  if (existingIdx !== -1) {
    bookmarks[existingIdx] = newBookmark;
  } else {
    bookmarks.push(newBookmark);
  }
  
  localStorage.setItem('anvil_bookmarks', JSON.stringify(bookmarks));
  nameInput.value = '';
  renderBookmarks();
  
  // highlight the newly saved bookmark
  setTimeout(() => {
    const items = document.querySelectorAll('.bookmark-item');
    items.forEach(item => {
      const title = item.querySelector('.bookmark-title').textContent;
      if (title === name) {
        item.classList.add('flash-loaded');
        setTimeout(() => item.classList.remove('flash-loaded'), 800);
      }
    });
  }, 50);
}

function deleteBookmark(name) {
  let bookmarks = JSON.parse(localStorage.getItem('anvil_bookmarks') || '[]');
  bookmarks = bookmarks.filter(b => b.name !== name);
  localStorage.setItem('anvil_bookmarks', JSON.stringify(bookmarks));
  renderBookmarks();
}

// get current icon theme
function getTheme() {
  const themeSelect = document.getElementById('theme-select');
  return themeSelect ? themeSelect.value : (localStorage.getItem('icon_theme') || 'default');
}

// initialize theme dropdown and load theme from localstorage
function initializeTheme() {
  const storedTheme = localStorage.getItem('icon_theme') || 'default';
  const themeSelect = document.getElementById('theme-select');
  if (themeSelect) {
    themeSelect.value = storedTheme;
    themeSelect.addEventListener('change', function() {
      localStorage.setItem('icon_theme', this.value);
      updateAllIconSources();
    });
  }
}

// update all icon image paths on the page
function updateAllIconSources() {
  const theme = getTheme();
  
  // update instruction slot icons
  document.querySelectorAll('.action-icon').forEach(img => {
    const action = img.getAttribute('data-action') || 'empty';
    img.src = `../res/${theme}/${action}.png`;
  });
  
  // update popup icons
  document.querySelectorAll('.popup-action-icon').forEach(img => {
    const action = img.getAttribute('data-action') || 'empty';
    img.src = `../res/${theme}/${action}.png`;
  });
  
  // re-render bookmarks to update their preview icons
  renderBookmarks();
  
  // re-calculate setup paths to update result icons
  calculate();
}



