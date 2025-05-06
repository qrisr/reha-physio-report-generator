/**
 * OpenRouter Service
 * Handles communication with the OpenRouter API for processing physiotherapy reports
 */

const OpenRouterService = {
    // Verwenden Sie die lokale Serverless Function statt direkter API-Aufrufe
    apiUrl: '/api/openrouter',
    
    // Kein API-Schlüssel mehr im Frontend-Code!
    
    // Das Modell wird jetzt in der Anfrage spezifiziert
    model: 'anthropic/claude-3-opus',
    
    /**
     * Send form data to OpenRouter API via serverless function
     * @param {Object} formData - The form data to send
     * @returns {Promise} - Promise that resolves with the generated report
     */
    async sendFormData(formData) {
        // Always use demo mode for GitHub Pages deployment
        console.log('Using demo mode for report generation');
        return {
            report: this.generateDemoReport(formData)
        };
        
        /* 
        // The following code is commented out for GitHub Pages deployment
        // Uncomment and configure API key for production use with Vercel
        try {
            // Format the data for the prompt
            const prompt = this.formatPrompt(formData);
            
            // Prepare the request to our serverless function
            const response = await axios.post(this.apiUrl, {
                model: this.model,
                messages: [
                    {
                        role: "system",
                        content: "Du bist ein erfahrener Physiotherapeut, der professionelle Abschlussberichte verfasst. Erstelle einen strukturierten, detaillierten Abschlussbericht basierend auf den gegebenen Informationen."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1500
            });
            
            // Check if the response is valid
            if (!response.data || !response.data.choices || !response.data.choices[0]) {
                throw new Error('Ungültige Antwort von der KI');
            }
            
            // Extract the generated report from the response
            const generatedReport = response.data.choices[0].message.content;
            
            return {
                report: generatedReport
            };
        } catch (error) {
            console.error('Error sending data to OpenRouter:', error);
            
            // Fallback to demo mode if there's an error
            return {
                report: this.generateDemoReport(formData)
            };
        }
        */
    },
    
    /**
     * Format the prompt for the AI model
     * @param {Object} formData - The form data to format
     * @returns {String} - Formatted prompt
     */
    formatPrompt(formData) {
        // Convert the goal status to a more readable format
        const goalStatusText = formData.goalStatus === 'achieved' ? 'Ziel erreicht' : 'Ziel nicht erreicht';
        
        // Convert compliance to a more readable format
        const complianceText = formData.compliance === 'yes' ? 'Ja' : 'Nein';
        
        // Traffic light indicators for HTML output
        const goalTrafficLight = formData.goalStatus === 'achieved' ? '🟢' : '🔴';
        const complianceTrafficLight = formData.compliance === 'yes' ? '🟢' : '🔴';
        
        // Build a structured prompt for the AI
        let prompt = `
Erstelle einen Physiotherapie-Abschlussbericht mit folgenden Informationen:

Zeit: ${formData.time}
Physiotherapie-Ziel Status: ${goalStatusText} ${goalTrafficLight}
Compliance: ${complianceText} ${complianceTrafficLight}
Therapieziel: ${formData.goalText}
Hypothese: ${formData.hypothesisText}
`;

        // Add reason if goal was not achieved
        if (formData.goalStatus === 'not-achieved' && formData.reasonText) {
            prompt += `Begründung für Nicht-Erreichung des Ziels: ${formData.reasonText}\n`;
        }

        prompt += `
Bitte strukturiere den Bericht in folgende Abschnitte:

WICHTIG: Beginne den Bericht mit einer Zusammenfassung der Formularinformationen in einer Box, die exakt die oben genannten Informationen enthält, inklusive der Ampel-Symbole (🟢 für positive und 🔴 für negative Antworten).

Danach folgen diese Abschnitte:
1. Patienteninformationen und Behandlungszeitraum
2. Ursprüngliche Diagnose und Befund
3. Therapieziele und Maßnahmen
4. Behandlungsverlauf
5. Ergebnisse und aktueller Status
6. Empfehlungen für weitere Maßnahmen

Der Bericht sollte professionell, detailliert und für medizinisches Fachpersonal geeignet sein.
`;

        return prompt;
    },
    
    /**
     * Generate a demo report for testing purposes
     * @param {Object} formData - The form data
     * @returns {String} - Demo report HTML
     */
    generateDemoReport(formData) {
        // Convert the goal status to a more readable format
        const goalStatusText = formData.goalStatus === 'achieved' ? 'Ziel erreicht' : 'Ziel nicht erreicht';
        
        // Convert compliance to a more readable format
        const complianceText = formData.compliance === 'yes' ? 'Ja' : 'Nein';
        
        // Current date for the report
        const today = new Date();
        const dateStr = today.toLocaleDateString('de-DE');
        
        // Demo patient name
        const patientName = "Max Mustermann";
        
        // Traffic light indicators for HTML output
        const goalTrafficLight = formData.goalStatus === 'achieved' ? '🟢' : '🔴';
        const complianceTrafficLight = formData.compliance === 'yes' ? '🟢' : '🔴';
        
        // Build a demo report
        return `
<div class="demo-notice">
    <strong>DEMO-MODUS</strong>: Dies ist ein Beispielbericht für Testzwecke. 
    Um echte KI-generierte Berichte zu erhalten, tragen Sie bitte Ihren OpenRouter API-Schlüssel in der Datei <code>js/services/openRouterService.js</code> ein.
</div>

<div class="form-summary">
    <div class="form-summary-item"><strong>Zeit:</strong> ${formData.time}</div>
    <div class="form-summary-item"><strong>Physiotherapie-Ziel Status:</strong> ${goalStatusText} ${goalTrafficLight}</div>
    <div class="form-summary-item"><strong>Compliance:</strong> ${complianceText} ${complianceTrafficLight}</div>
    <div class="form-summary-item"><strong>Therapieziel:</strong> ${formData.goalText}</div>
    <div class="form-summary-item"><strong>Hypothese:</strong> ${formData.hypothesisText}</div>
    ${formData.goalStatus === 'not-achieved' && formData.reasonText ? 
      `<div class="form-summary-item"><strong>Begründung für Nicht-Erreichung des Ziels:</strong> ${formData.reasonText}</div>` : ''}
</div>

<h3>Physiotherapeutischer Abschlussbericht</h3>
<p><strong>Datum:</strong> ${dateStr}</p>

<h4>1. Patienteninformationen und Behandlungszeitraum</h4>
<p>
    <strong>Patient:</strong> ${patientName}<br>
    <strong>Behandlungszeitraum:</strong> 01.04.2025 - ${dateStr}<br>
    <strong>Behandlungszeit:</strong> ${formData.time} Uhr
</p>

<h4>2. Ursprüngliche Diagnose und Befund</h4>
<p>${formData.hypothesisText}</p>

<h4>3. Therapieziele und Maßnahmen</h4>
<p>
    <strong>Hauptziel:</strong> ${formData.goalText}<br>
    <strong>Maßnahmen:</strong> Mobilisation, Kräftigung, Propriozeptionstraining, Gangschule
</p>

<h4>4. Behandlungsverlauf</h4>
<p>
    <strong>Compliance:</strong> ${complianceText}<br>
    <strong>Verlauf:</strong> Der Patient zeigte ${complianceText === 'Ja' ? 'eine gute Mitarbeit und regelmäßige Teilnahme an den Therapiesitzungen' : 'Schwierigkeiten bei der regelmäßigen Teilnahme an den Therapiesitzungen'}.
</p>

<h4>5. Ergebnisse und aktueller Status</h4>
<p>
    <strong>Zielerreichung:</strong> ${goalStatusText}<br>
    ${formData.goalStatus === 'not-achieved' ? `<strong>Begründung für Nicht-Erreichung:</strong> ${formData.reasonText}<br>` : ''}
    <strong>Aktueller Status:</strong> ${formData.goalStatus === 'achieved' ? 
        'Der Patient kann die Bewegungen schmerzfrei durchführen und zeigt eine deutliche Verbesserung der Funktionalität.' : 
        'Der Patient zeigt eine teilweise Verbesserung, benötigt jedoch weitere Therapie zur vollständigen Zielerreichung.'}
</p>

<h4>6. Empfehlungen für weitere Maßnahmen</h4>
<p>
    ${formData.goalStatus === 'achieved' ? 
        'Regelmäßige Eigenübungen zur Erhaltung der erreichten Funktionalität. Kontrolle in 3 Monaten empfohlen.' : 
        'Fortsetzung der Therapie mit 2 Einheiten pro Woche für weitere 6 Wochen. Anpassung des Heimübungsprogramms.'}
</p>

<p class="signature">
    <strong>Unterschrift Therapeut/in:</strong> _______________________
</p>
`;
    }
};
