/**
 * N8N Service
 * Handles communication with the N8N webhook for processing physiotherapy reports
 */

const N8NService = {
    // Replace with your actual N8N webhook URL
    webhookUrl: 'https://your-n8n-instance.com/webhook/physiotherapy-report',
    
    /**
     * Send form data to N8N webhook
     * @param {Object} formData - The form data to send
     * @returns {Promise} - Promise that resolves with the generated report
     */
    async sendFormData(formData) {
        try {
            // Format the data for N8N
            const payload = this.formatPayload(formData);
            
            // Send the data to N8N webhook
            const response = await axios.post(this.webhookUrl, payload);
            
            // Check if the response is valid
            if (response.status !== 200 || !response.data) {
                throw new Error('Invalid response from N8N webhook');
            }
            
            return response.data;
        } catch (error) {
            console.error('Error sending data to N8N:', error);
            throw new Error('Fehler bei der Kommunikation mit dem Server. Bitte versuchen Sie es später erneut.');
        }
    },
    
    /**
     * Format the payload for N8N
     * @param {Object} formData - The form data to format
     * @returns {Object} - Formatted payload
     */
    formatPayload(formData) {
        // Convert the goal status to a more readable format
        const goalStatusText = formData.goalStatus === 'achieved' ? 'Ziel erreicht' : 'Ziel nicht erreicht';
        
        // Convert compliance to a more readable format
        const complianceText = formData.compliance === 'yes' ? 'Ja' : 'Nein';
        
        return {
            time: formData.time,
            goalStatus: goalStatusText,
            compliance: complianceText,
            goalText: formData.goalText,
            hypothesisText: formData.hypothesisText,
            reasonText: formData.goalStatus === 'not-achieved' ? formData.reasonText : '',
            // Add any additional metadata that might be useful for the N8N workflow
            metadata: {
                timestamp: new Date().toISOString(),
                source: 'physiotherapy-report-app'
            }
        };
    }
};
