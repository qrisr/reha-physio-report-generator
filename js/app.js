/**
 * Physiotherapie Abschlussbericht Application
 * Main application file
 */

// Initialize Vue application
new Vue({
    el: '#app',
    
    // Application data
    data: {
        // Current time (updated every minute)
        currentTime: '',
        
        // Form data
        formData: {
            goalStatus: '',
            compliance: '',
            goalText: '',
            hypothesisText: '',
            reasonText: ''
        },
        
        // Application state
        isSubmitting: false,
        error: null,
        report: null,
        
        // Timer reference for time updates
        timeInterval: null
    },
    
    // Lifecycle hooks
    created() {
        // Initialize the current time
        this.updateTime();
        
        // Update time every minute
        this.timeInterval = setInterval(this.updateTime, 60000);
    },
    
    beforeDestroy() {
        // Clear the time interval when the component is destroyed
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
    },
    
    // Methods
    methods: {
        /**
         * Update the current time
         */
        updateTime() {
            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            this.currentTime = `${hours}:${minutes}`;
            
            // Also update the time in the form data
            this.formData.time = this.currentTime;
        },
        
        /**
         * Handle goal status change
         * Shows/hides the reason field based on goal status
         */
        handleGoalStatusChange() {
            // If goal is not achieved, ensure the reason field is empty
            if (this.formData.goalStatus !== 'not-achieved') {
                this.formData.reasonText = '';
            }
        },
        
        /**
         * Reset the form to its initial state
         */
        resetForm() {
            // Reset form data - using direct property assignment for better reactivity
            this.formData.goalStatus = '';
            this.formData.compliance = '';
            this.formData.goalText = '';
            this.formData.hypothesisText = '';
            this.formData.reasonText = '';
            this.formData.time = this.currentTime;
            
            // Reset application state
            this.error = null;
            this.report = null;
        },
        
        /**
         * Validate the form before submission
         * @returns {boolean} - Whether the form is valid
         */
        validateForm() {
            // Check required fields
            if (!this.formData.goalStatus) {
                this.error = 'Bitte wählen Sie den Physiotherapie-Ziel-Status aus.';
                return false;
            }
            
            if (!this.formData.compliance) {
                this.error = 'Bitte wählen Sie die Compliance aus.';
                return false;
            }
            
            if (!this.formData.goalText.trim()) {
                this.error = 'Bitte geben Sie das Therapieziel ein.';
                return false;
            }
            
            if (!this.formData.hypothesisText.trim()) {
                this.error = 'Bitte geben Sie die Hypothese ein.';
                return false;
            }
            
            // If goal is not achieved, reason is required
            if (this.formData.goalStatus === 'not-achieved' && !this.formData.reasonText.trim()) {
                this.error = 'Bitte geben Sie eine Begründung für die Nicht-Erreichung des Ziels ein.';
                return false;
            }
            
            // Clear any previous errors
            this.error = null;
            return true;
        },
        
        /**
         * Submit the form to the OpenRouter API
         */
        async submitForm() {
            // Validate the form
            if (!this.validateForm()) {
                // Display error to user (could be enhanced with a toast notification)
                alert(this.error);
                return;
            }
            
            try {
                // Set submitting state
                this.isSubmitting = true;
                
                // Ensure the time is up to date
                this.updateTime();
                
                // Send the form data to OpenRouter
                const result = await OpenRouterService.sendFormData(this.formData);
                
                // Display the generated report
                this.report = result.report || 'Der Abschlussbericht konnte nicht generiert werden.';
                
                // Scroll to the report section
                this.$nextTick(() => {
                    const reportElement = document.querySelector('.result-container');
                    if (reportElement) {
                        reportElement.scrollIntoView({ behavior: 'smooth' });
                    }
                });
            } catch (error) {
                // Handle error
                this.error = error.message || 'Ein unbekannter Fehler ist aufgetreten.';
                alert(this.error);
            } finally {
                // Reset submitting state
                this.isSubmitting = false;
            }
        }
    }
});
