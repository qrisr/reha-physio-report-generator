/**
 * Admin functionality for Physiotherapie Abschlussbericht Generator
 * Allows administrators to modify the system prompt and API settings
 */

// Admin configuration
const adminConfig = {
    // Default password - should be changed in production
    password: 'admin123',
    
    // Default system prompt
    defaultSystemPrompt: 'Du bist ein erfahrener Physiotherapeut, der professionelle Abschlussberichte verfasst. Deine Berichte sind klar strukturiert, fachlich korrekt und verwenden physiotherapeutische Fachsprache.\n\nAktuelles Therapieziel: {therapyGoal}\nZielerreichung: {goalStatus === "erreicht" ? "Das Ziel wurde erreicht" : "Das Ziel wurde nicht erreicht"}\nCompliance: {compliance === "ja" ? "gut" : "verbesserungswürdig"}',
    
    // Available models
    availableModels: [
        { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
        { id: 'openai/gpt-4', name: 'GPT-4' },
        { id: 'anthropic/claude-2', name: 'Claude 2' },
        { id: 'anthropic/claude-instant-v1', name: 'Claude Instant' },
        { id: 'google/palm-2-chat-bison', name: 'PaLM 2 Chat' },
        { id: 'meta-llama/llama-2-13b-chat', name: 'Llama 2 13B Chat' }
    ]
};

// DOM Elements
let adminModal;
let adminLink;
let adminForm;
let passwordInput;
let systemPromptTextarea;
let modelSelect;
let apiKeyInput;
let saveButton;
let closeButton;
let statusMessage;

// Initialize admin functionality
function initAdminPanel() {
    createAdminLink();
    createAdminModal();
    loadSavedSettings();
    
    // Event listeners
    adminLink.addEventListener('click', showPasswordPrompt);
    closeButton.addEventListener('click', hideAdminModal);
    adminForm.addEventListener('submit', saveSettings);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === adminModal) {
            hideAdminModal();
        }
    });
}

// Create admin link in the footer
function createAdminLink() {
    const footer = document.querySelector('footer');
    if (!footer) return;
    
    adminLink = document.createElement('a');
    adminLink.href = '#';
    adminLink.textContent = 'Admin';
    adminLink.style.marginLeft = '10px';
    adminLink.style.color = 'inherit';
    adminLink.style.textDecoration = 'none';
    adminLink.style.opacity = '0.7';
    
    const footerP = footer.querySelector('p');
    if (footerP) {
        footerP.appendChild(document.createTextNode(' | '));
        footerP.appendChild(adminLink);
    } else {
        footer.appendChild(adminLink);
    }
}

// Create admin modal
function createAdminModal() {
    // Create modal container
    adminModal = document.createElement('div');
    adminModal.className = 'admin-modal';
    adminModal.style.display = 'none';
    adminModal.style.position = 'fixed';
    adminModal.style.zIndex = '1000';
    adminModal.style.left = '0';
    adminModal.style.top = '0';
    adminModal.style.width = '100%';
    adminModal.style.height = '100%';
    adminModal.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    adminModal.style.overflow = 'hidden';
    
    // Create modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'admin-modal-content';
    modalContent.style.backgroundColor = 'white';
    modalContent.style.margin = '2% auto';
    modalContent.style.padding = '20px';
    modalContent.style.border = '1px solid #888';
    modalContent.style.borderRadius = '5px';
    modalContent.style.width = '80%';
    modalContent.style.maxWidth = '600px';
    modalContent.style.maxHeight = '80vh';
    modalContent.style.overflow = 'auto';
    
    // Create modal header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'admin-modal-header';
    modalHeader.style.display = 'flex';
    modalHeader.style.justifyContent = 'space-between';
    modalHeader.style.alignItems = 'center';
    modalHeader.style.marginBottom = '20px';
    
    const modalTitle = document.createElement('h2');
    modalTitle.textContent = 'Admin-Bereich';
    modalTitle.style.margin = '0';
    
    closeButton = document.createElement('span');
    closeButton.textContent = '×';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '30px';
    closeButton.style.fontWeight = 'bold';
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    
    // Create password prompt
    const passwordPrompt = document.createElement('div');
    passwordPrompt.id = 'password-prompt';
    
    const passwordLabel = document.createElement('label');
    passwordLabel.textContent = 'Passwort:';
    passwordLabel.style.display = 'block';
    passwordLabel.style.marginBottom = '5px';
    
    passwordInput = document.createElement('input');
    passwordInput.type = 'password';
    passwordInput.style.width = '100%';
    passwordInput.style.padding = '8px';
    passwordInput.style.marginBottom = '15px';
    passwordInput.style.boxSizing = 'border-box';
    
    const submitPasswordButton = document.createElement('button');
    submitPasswordButton.textContent = 'Anmelden';
    submitPasswordButton.style.padding = '8px 15px';
    submitPasswordButton.style.backgroundColor = '#4a90e2';
    submitPasswordButton.style.color = 'white';
    submitPasswordButton.style.border = 'none';
    submitPasswordButton.style.borderRadius = '4px';
    submitPasswordButton.style.cursor = 'pointer';
    submitPasswordButton.addEventListener('click', validatePassword);
    
    passwordPrompt.appendChild(passwordLabel);
    passwordPrompt.appendChild(passwordInput);
    passwordPrompt.appendChild(submitPasswordButton);
    
    // Create admin form
    adminForm = document.createElement('form');
    adminForm.id = 'admin-form';
    adminForm.style.display = 'none';
    
    // System prompt
    const promptGroup = document.createElement('div');
    promptGroup.style.marginBottom = '15px';
    
    const promptLabel = document.createElement('label');
    promptLabel.textContent = 'System Prompt:';
    promptLabel.style.display = 'block';
    promptLabel.style.marginBottom = '5px';
    promptLabel.style.fontWeight = 'bold';
    
    systemPromptTextarea = document.createElement('textarea');
    systemPromptTextarea.rows = '5';
    systemPromptTextarea.style.width = '100%';
    systemPromptTextarea.style.padding = '8px';
    systemPromptTextarea.style.boxSizing = 'border-box';
    
    // Add help text for variables
    const variablesHelp = document.createElement('div');
    variablesHelp.style.marginTop = '10px';
    variablesHelp.style.fontSize = '0.9em';
    variablesHelp.style.color = '#666';
    
    const helpTitle = document.createElement('p');
    helpTitle.innerHTML = '<strong>Verfügbare Variablen:</strong> (Klicken zum Einfügen)';
    helpTitle.style.marginBottom = '5px';
    variablesHelp.appendChild(helpTitle);
    
    // Create variable chips
    if (typeof openRouterService !== 'undefined' && typeof openRouterService.getAvailableVariables === 'function') {
        const variables = openRouterService.getAvailableVariables();
        const chipContainer = document.createElement('div');
        chipContainer.style.display = 'flex';
        chipContainer.style.flexWrap = 'wrap';
        chipContainer.style.gap = '5px';
        
        variables.forEach(variable => {
            const chip = document.createElement('span');
            chip.textContent = `{${variable.name}}`;
            chip.title = variable.description;
            chip.style.backgroundColor = '#e9f0f7';
            chip.style.padding = '3px 8px';
            chip.style.borderRadius = '12px';
            chip.style.fontSize = '0.85em';
            chip.style.cursor = 'pointer';
            
            chip.addEventListener('click', () => {
                // Insert variable at cursor position
                const cursorPos = systemPromptTextarea.selectionStart;
                const textBefore = systemPromptTextarea.value.substring(0, cursorPos);
                const textAfter = systemPromptTextarea.value.substring(cursorPos);
                systemPromptTextarea.value = textBefore + `{${variable.name}}` + textAfter;
                
                // Set cursor position after inserted variable
                const newCursorPos = cursorPos + variable.name.length + 2;
                systemPromptTextarea.focus();
                systemPromptTextarea.setSelectionRange(newCursorPos, newCursorPos);
            });
            
            chipContainer.appendChild(chip);
        });
        
        variablesHelp.appendChild(chipContainer);
    }
    
    // Add example usage
    const exampleUsage = document.createElement('p');
    exampleUsage.innerHTML = '<strong>Beispiel:</strong> Du bist ein Physiotherapeut und erstellst einen Bericht für das Ziel: {therapyGoal}';
    exampleUsage.style.marginTop = '10px';
    exampleUsage.style.fontSize = '0.85em';
    variablesHelp.appendChild(exampleUsage);
    
    const conditionalExample = document.createElement('p');
    conditionalExample.innerHTML = '<strong>Bedingte Logik:</strong> {goalStatus === "erreicht" ? "Gratulation zum Erfolg!" : "Weiter arbeiten!"}';
    conditionalExample.style.fontSize = '0.85em';
    variablesHelp.appendChild(conditionalExample);
    
    promptGroup.appendChild(promptLabel);
    promptGroup.appendChild(systemPromptTextarea);
    promptGroup.appendChild(variablesHelp);
    
    // Model selection
    const modelGroup = document.createElement('div');
    modelGroup.style.marginBottom = '15px';
    
    const modelLabel = document.createElement('label');
    modelLabel.textContent = 'Sprachmodell:';
    modelLabel.style.display = 'block';
    modelLabel.style.marginBottom = '5px';
    modelLabel.style.fontWeight = 'bold';
    
    modelSelect = document.createElement('select');
    modelSelect.style.width = '100%';
    modelSelect.style.padding = '8px';
    modelSelect.style.boxSizing = 'border-box';
    
    // Add model options
    adminConfig.availableModels.forEach(model => {
        const option = document.createElement('option');
        option.value = model.id;
        option.textContent = model.name;
        modelSelect.appendChild(option);
    });
    
    modelGroup.appendChild(modelLabel);
    modelGroup.appendChild(modelSelect);
    
    // API Key
    const apiKeyGroup = document.createElement('div');
    apiKeyGroup.style.marginBottom = '20px';
    
    const apiKeyLabel = document.createElement('label');
    apiKeyLabel.textContent = 'OpenRouter API-Schlüssel:';
    apiKeyLabel.style.display = 'block';
    apiKeyLabel.style.marginBottom = '5px';
    apiKeyLabel.style.fontWeight = 'bold';
    
    apiKeyInput = document.createElement('input');
    apiKeyInput.type = 'text';
    apiKeyInput.style.width = '100%';
    apiKeyInput.style.padding = '8px';
    apiKeyInput.style.boxSizing = 'border-box';
    
    // Add help text for API key
    const apiKeyHelp = document.createElement('div');
    apiKeyHelp.style.fontSize = '0.85em';
    apiKeyHelp.style.color = '#666';
    apiKeyHelp.style.marginTop = '5px';
    apiKeyHelp.innerHTML = 'Geben Sie hier Ihren OpenRouter API-Schlüssel ein. Ohne gültigen API-Schlüssel wird eine Demo-Antwort angezeigt.';
    
    apiKeyGroup.appendChild(apiKeyLabel);
    apiKeyGroup.appendChild(apiKeyInput);
    apiKeyGroup.appendChild(apiKeyHelp);
    
    // Status message
    statusMessage = document.createElement('div');
    statusMessage.style.marginBottom = '15px';
    statusMessage.style.padding = '10px';
    statusMessage.style.borderRadius = '4px';
    statusMessage.style.display = 'none';
    
    // Save button
    saveButton = document.createElement('button');
    saveButton.type = 'submit';
    saveButton.textContent = 'Einstellungen speichern';
    saveButton.style.padding = '10px 15px';
    saveButton.style.backgroundColor = '#4a90e2';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';
    saveButton.style.marginTop = '15px';
    saveButton.style.marginBottom = '10px';
    
    // Add elements to form
    adminForm.appendChild(promptGroup);
    adminForm.appendChild(modelGroup);
    adminForm.appendChild(apiKeyGroup);
    adminForm.appendChild(statusMessage);
    adminForm.appendChild(saveButton);
    
    // Assemble modal
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(passwordPrompt);
    modalContent.appendChild(adminForm);
    adminModal.appendChild(modalContent);
    
    // Add to document
    document.body.appendChild(adminModal);
}

// Show password prompt
function showPasswordPrompt() {
    adminModal.style.display = 'block';
    passwordInput.value = '';
    document.getElementById('password-prompt').style.display = 'block';
    adminForm.style.display = 'none';
    passwordInput.focus();
    
    // Reload saved settings to ensure fresh data
    loadSavedSettings();
}

// Hide admin modal
function hideAdminModal() {
    adminModal.style.display = 'none';
}

// Validate password
function validatePassword() {
    if (passwordInput.value === adminConfig.password) {
        document.getElementById('password-prompt').style.display = 'none';
        adminForm.style.display = 'block';
        
        // Clear and reload the textarea to prevent text mixing issues
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            systemPromptTextarea.value = settings.systemPrompt || adminConfig.defaultSystemPrompt;
        } else {
            systemPromptTextarea.value = adminConfig.defaultSystemPrompt;
        }
    } else {
        alert('Falsches Passwort!');
    }
}

// Save settings
function saveSettings(e) {
    e.preventDefault();
    
    const settings = {
        systemPrompt: systemPromptTextarea.value,
        model: modelSelect.value,
        apiKey: apiKeyInput.value
    };
    
    // Save to localStorage
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    
    // Update openRouterService with new settings
    if (typeof openRouterService !== 'undefined') {
        openRouterService.updateSettings(settings);
    }
    
    // Show success message
    showStatus('Einstellungen erfolgreich gespeichert!', 'success');
}

// Show status message
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.style.display = 'block';
    
    if (type === 'success') {
        statusMessage.style.backgroundColor = '#d4edda';
        statusMessage.style.color = '#155724';
        statusMessage.style.border = '1px solid #c3e6cb';
    } else {
        statusMessage.style.backgroundColor = '#f8d7da';
        statusMessage.style.color = '#721c24';
        statusMessage.style.border = '1px solid #f5c6cb';
    }
    
    // Hide after 3 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 3000);
}

// Load saved settings
function loadSavedSettings() {
    const savedSettings = localStorage.getItem('adminSettings');
    
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        
        systemPromptTextarea.value = settings.systemPrompt || adminConfig.defaultSystemPrompt;
        
        // Find and select the saved model
        const modelOption = Array.from(modelSelect.options).find(option => option.value === settings.model);
        if (modelOption) {
            modelOption.selected = true;
        }
        
        apiKeyInput.value = settings.apiKey || '';
    } else {
        // Set defaults
        systemPromptTextarea.value = adminConfig.defaultSystemPrompt;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAdminPanel);
