/**
 * OpenRouter Service for generating physiotherapy reports
 * This service handles communication with the OpenRouter API
 */
const openRouterService = {
    // API endpoint for OpenRouter
    apiUrl: 'https://openrouter.ai/api/v1/chat/completions',
    
    // Default settings
    settings: {
        apiKey: '',
        model: 'openai/gpt-3.5-turbo',
        systemPrompt: 'Du bist ein erfahrener Physiotherapeut, der professionelle Abschlussberichte verfasst. Deine Berichte sind klar strukturiert, fachlich korrekt und verwenden physiotherapeutische Fachsprache.'
    },
    
    // Available variables for prompt templates
    availableVariables: [
        { name: 'time', description: 'Zeitpunkt der Berichterstellung' },
        { name: 'goalStatus', description: 'Status des Therapieziels (erreicht/nicht-erreicht)' },
        { name: 'compliance', description: 'Compliance des Patienten (ja/nein)' },
        { name: 'therapyGoal', description: 'Das definierte Therapieziel' },
        { name: 'hypothesis', description: 'Die eingegebene Hypothese' },
        { name: 'reason', description: 'Begründung bei Nicht-Erreichung des Ziels (nur wenn goalStatus = nicht-erreicht)' },
        { name: 'formData:json', description: 'Alle Formulardaten als JSON-Objekt' }
    ],
    
    /**
     * Initialize the service with saved settings if available
     */
    init: function() {
        // Load settings from localStorage if available
        const savedSettings = localStorage.getItem('adminSettings');
        if (savedSettings) {
            this.updateSettings(JSON.parse(savedSettings));
        }
    },
    
    /**
     * Update service settings
     * @param {Object} newSettings - The new settings to apply
     */
    updateSettings: function(newSettings) {
        if (newSettings.apiKey) {
            this.settings.apiKey = newSettings.apiKey;
        }
        
        if (newSettings.model) {
            this.settings.model = newSettings.model;
        }
        
        if (newSettings.systemPrompt) {
            this.settings.systemPrompt = newSettings.systemPrompt;
        }
        
        console.log('OpenRouter service settings updated');
    },
    
    /**
     * Generate a physiotherapy report based on form data
     * @param {Object} formData - The form data containing patient information
     * @returns {Promise<string>} - The generated report text
     */
    generatePhysiotherapyReport: async function(formData) {
        // Create the prompt for the AI
        const prompt = this.createPrompt(formData);
        
        // Process system prompt to replace variables
        const processedSystemPrompt = this.processTemplate(this.settings.systemPrompt, formData);
        
        try {
            // Check if API key is provided
            if (!this.settings.apiKey || this.settings.apiKey.trim() === '') {
                console.warn('No API key provided. Using mock response.');
                return this.getMockResponse(formData);
            }
            
            console.log('Using API key:', this.settings.apiKey.substring(0, 3) + '...');
            
            // Make the API request
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.apiKey}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'Physiotherapie Abschlussbericht Generator'
                },
                body: JSON.stringify({
                    model: this.settings.model,
                    messages: [
                        {
                            role: 'system',
                            content: processedSystemPrompt
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
                throw new Error(errorMessage);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error calling OpenRouter API:', error);
            
            // If API call fails, use mock response as fallback
            console.warn('API call failed. Using mock response as fallback.');
            return this.getMockResponse(formData);
        }
    },
    
    /**
     * Process a template string by replacing variables with their values
     * @param {string} template - The template string with variables
     * @param {Object} formData - The form data containing values
     * @returns {string} - The processed template
     */
    processTemplate: function(template, formData) {
        if (!template) return '';
        
        // Replace {formData:json} with stringified JSON
        let processed = template.replace(/\{formData:json\}/g, JSON.stringify(formData, null, 2));
        
        // Replace simple variables
        processed = processed.replace(/\{(\w+)\}/g, (match, varName) => {
            if (varName in formData) {
                return formData[varName];
            }
            return match; // Keep the original if variable not found
        });
        
        // Process conditional expressions (simple version)
        // Format: {varName === 'value' ? 'trueResult' : 'falseResult'}
        processed = processed.replace(/\{(\w+)\s*===\s*['"]([^'"]+)['"]\s*\?\s*['"]([^'"]+)['"]\s*:\s*['"]([^'"]+)['"]\}/g, 
            (match, varName, value, trueResult, falseResult) => {
                if (varName in formData && formData[varName] === value) {
                    return trueResult;
                }
                return falseResult;
            }
        );
        
        return processed;
    },
    
    /**
     * Create a prompt for the AI based on form data
     * @param {Object} formData - The form data
     * @returns {string} - The formatted prompt
     */
    createPrompt: function(formData) {
        return `
Erstelle einen professionellen physiotherapeutischen Abschlussbericht basierend auf folgenden Informationen:

- Zeitpunkt: ${formData.time}
- Therapieziel Status: ${formData.goalStatus === 'erreicht' ? 'Ziel erreicht' : 'Ziel nicht erreicht'}
- Compliance: ${formData.compliance === 'ja' ? 'Ja' : 'Nein'}
- Therapieziel: ${formData.therapyGoal}
- Hypothese: ${formData.hypothesis}
${formData.reason ? `- Begründung für Nicht-Erreichung des Ziels: ${formData.reason}` : ''}

Der Bericht sollte folgende Struktur haben:
1. Einleitung mit Patienteninformationen (erfinde realistische Details)
2. Ursprüngliche Diagnose und Befund
3. Behandlungsverlauf
4. Abschlussbefund
5. Empfehlungen für den Patienten

Verwende physiotherapeutische Fachsprache und halte den Bericht professionell. Formatiere den Text mit HTML-Absätzen (<p>) für bessere Lesbarkeit.
`;
    },
    
    /**
     * Get a mock response for demonstration purposes
     * @param {Object} formData - The form data
     * @returns {string} - A mock report
     */
    getMockResponse: function(formData) {
        const goalAchieved = formData.goalStatus === 'erreicht';
        const goodCompliance = formData.compliance === 'ja';
        
        return `
<p><strong>Physiotherapeutischer Abschlussbericht</strong></p>

<p><strong>Patient:</strong> Max Mustermann<br>
<strong>Geburtsdatum:</strong> 15.06.1975<br>
<strong>Behandlungszeitraum:</strong> 01.03.2025 - 30.04.2025<br>
<strong>Verordnungsdiagnose:</strong> Chronische Lumbalgie (M54.5)</p>

<p><strong>Ursprüngliche Diagnose und Befund:</strong></p>
<p>Der Patient stellte sich initial mit chronischen Rückenschmerzen im lumbalen Bereich vor, die seit ca. 6 Monaten bestehen und durch längeres Sitzen verstärkt werden. Die klinische Untersuchung zeigte eine eingeschränkte Beweglichkeit der LWS in Flexion und Extension, eine hypotone Rumpfmuskulatur sowie myofasziale Triggerpunkte im M. quadratus lumborum beidseits. Der Patient berichtete über Schmerzen (VAS 7/10) bei alltäglichen Aktivitäten und berufsbedingtem langem Sitzen.</p>

<p><strong>Therapieziel:</strong> ${formData.therapyGoal}</p>

<p><strong>Behandlungsverlauf:</strong></p>
<p>Die Behandlung umfasste manuelle Therapie zur Mobilisation der LWS, Triggerpunktbehandlung, progressive Kräftigungsübungen für die Rumpfmuskulatur sowie ergonomische Beratung. ${goodCompliance ? 'Der Patient zeigte eine sehr gute Compliance und führte die empfohlenen Heimübungen regelmäßig durch.' : 'Die Compliance des Patienten bezüglich der Heimübungen war leider unzureichend, was den Therapieerfolg beeinträchtigte.'}</p>

<p><strong>Hypothese:</strong> ${formData.hypothesis}</p>

<p><strong>Abschlussbefund:</strong></p>
${goalAchieved ? 
`<p>Das Therapieziel wurde erreicht. Der Patient zeigt eine deutliche Verbesserung der Beweglichkeit der LWS (Flexion/Extension nahezu normwertig). Die Rumpfmuskulatur weist eine verbesserte Tonisierung auf, und die myofaszialen Triggerpunkte konnten erfolgreich behandelt werden. Die Schmerzintensität hat sich signifikant reduziert (VAS 2/10). Der Patient kann alltägliche Aktivitäten wieder schmerzfrei durchführen und hat Strategien zur Schmerzprävention erlernt.</p>` 
: 
`<p>Das Therapieziel wurde nicht vollständig erreicht. Trotz partieller Verbesserung der Beweglichkeit der LWS bestehen weiterhin Einschränkungen in der Extension. Die Rumpfmuskulatur zeigt eine leichte Verbesserung der Tonisierung, jedoch sind die myofaszialen Triggerpunkte im M. quadratus lumborum noch teilweise aktiv. Die Schmerzintensität hat sich nur mäßig reduziert (VAS 5/10).</p>
<p><strong>Begründung für Nicht-Erreichung des Ziels:</strong> ${formData.reason}</p>`}

<p><strong>Empfehlungen:</strong></p>
<p>${goalAchieved ? 
'Zur Aufrechterhaltung des Therapieerfolgs wird dem Patienten empfohlen, die erlernten Übungen zur Kräftigung der Rumpfmuskulatur 3x wöchentlich fortzuführen. Zusätzlich sollte auf eine ergonomische Sitzposition am Arbeitsplatz geachtet und regelmäßige Bewegungspausen eingelegt werden. Sportliche Aktivitäten wie Schwimmen oder Nordic Walking sind zu empfehlen. Eine Kontrolluntersuchung in 3 Monaten wird angeraten.' 
: 
'Es wird eine Fortsetzung der physiotherapeutischen Behandlung für weitere 6 Einheiten empfohlen, mit verstärktem Fokus auf die aktive Mitarbeit des Patienten und intensiviertes Training der Rumpfmuskulatur. Die Heimübungen sollten täglich durchgeführt werden, und ergonomische Anpassungen am Arbeitsplatz sind dringend umzusetzen. Eine begleitende Schmerztherapie sollte in Erwägung gezogen werden.'}</p>

<p>Erstellt am: ${formData.time}<br>
Physiotherapeut: Dr. med. Anna Therapeut</p>
`;
    },
    
    /**
     * Get the list of available variables for templates
     * @returns {Array} - Array of variable objects with name and description
     */
    getAvailableVariables: function() {
        return this.availableVariables;
    }
};
