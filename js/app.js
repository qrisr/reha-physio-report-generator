document.addEventListener('DOMContentLoaded', () => {
    // Initialize OpenRouter service with saved settings
    if (typeof openRouterService !== 'undefined' && typeof openRouterService.init === 'function') {
        openRouterService.init();
    }
    
    // DOM Elements
    const currentTimeEl = document.getElementById('current-time');
    const goalStatusEl = document.getElementById('goal-status');
    const complianceEl = document.getElementById('compliance');
    const therapyGoalEl = document.getElementById('therapy-goal');
    const hypothesisEl = document.getElementById('hypothesis');
    const reasonGroupEl = document.getElementById('reason-group');
    const reasonEl = document.getElementById('reason');
    const generateBtn = document.getElementById('generate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const reportForm = document.getElementById('report-form');
    const reportSection = document.getElementById('report-section');
    const loader = document.getElementById('loader');
    const reportContainer = document.getElementById('report-container');
    const summaryContentEl = document.getElementById('summary-content');
    const reportTextEl = document.getElementById('report-text');
    
    const goalStatusIndicator = document.getElementById('goal-status-indicator');
    const complianceIndicator = document.getElementById('compliance-indicator');

    // Initialize and update time
    function updateTime() {
        const now = new Date();
        const options = { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        };
        currentTimeEl.value = now.toLocaleString('de-DE', options);
    }
    
    updateTime();
    setInterval(updateTime, 60000); // Update every minute

    // Show/hide reason field based on goal status
    goalStatusEl.addEventListener('change', () => {
        if (goalStatusEl.value === 'nicht-erreicht') {
            reasonGroupEl.style.display = 'block';
            reasonEl.setAttribute('required', '');
            goalStatusIndicator.className = 'indicator red';
        } else {
            reasonGroupEl.style.display = 'none';
            reasonEl.removeAttribute('required');
            if (goalStatusEl.value === 'erreicht') {
                goalStatusIndicator.className = 'indicator green';
            } else {
                goalStatusIndicator.className = 'indicator';
            }
        }
    });

    // Update compliance indicator
    complianceEl.addEventListener('change', () => {
        if (complianceEl.value === 'ja') {
            complianceIndicator.className = 'indicator green';
        } else if (complianceEl.value === 'nein') {
            complianceIndicator.className = 'indicator red';
        } else {
            complianceIndicator.className = 'indicator';
        }
    });

    // Form submission
    reportForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate form
        if (!reportForm.checkValidity()) {
            alert('Bitte füllen Sie alle erforderlichen Felder aus.');
            return;
        }
        
        // Show loader
        reportSection.style.display = 'block';
        loader.style.display = 'block';
        reportContainer.style.display = 'none';
        
        // Collect form data
        const formData = {
            time: currentTimeEl.value,
            goalStatus: goalStatusEl.value,
            compliance: complianceEl.value,
            therapyGoal: therapyGoalEl.value,
            hypothesis: hypothesisEl.value,
            reason: goalStatusEl.value === 'nicht-erreicht' ? reasonEl.value : ''
        };
        
        try {
            // Generate report using OpenRouter API
            const report = await generateReport(formData);
            
            // Display report
            displayReport(formData, report);
            
            // Hide loader and show report
            loader.style.display = 'none';
            reportContainer.style.display = 'block';
            
            // Scroll to report
            reportSection.scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error generating report:', error);
            alert('Fehler bei der Berichterstellung. Bitte versuchen Sie es erneut.');
            loader.style.display = 'none';
            reportSection.style.display = 'none';
        }
    });

    // Reset form
    resetBtn.addEventListener('click', () => {
        // Reset indicators
        goalStatusIndicator.className = 'indicator';
        complianceIndicator.className = 'indicator';
        
        // Hide reason field
        reasonGroupEl.style.display = 'none';
        
        // Hide report section
        reportSection.style.display = 'none';
        
        // Update time
        updateTime();
    });

    // Display the generated report
    function displayReport(formData, reportText) {
        // Create summary
        const summaryHTML = `
            <div class="summary-item">
                <strong>Zeitpunkt:</strong> ${formData.time}
            </div>
            <div class="summary-item">
                <strong>Therapieziel Status:</strong> 
                <span class="${formData.goalStatus === 'erreicht' ? 'success' : 'danger'}">
                    ${formData.goalStatus === 'erreicht' ? 'Ziel erreicht' : 'Ziel nicht erreicht'}
                </span>
                <span class="indicator ${formData.goalStatus === 'erreicht' ? 'green' : 'red'}"></span>
            </div>
            <div class="summary-item">
                <strong>Compliance:</strong> 
                <span class="${formData.compliance === 'ja' ? 'success' : 'danger'}">
                    ${formData.compliance === 'ja' ? 'Ja' : 'Nein'}
                </span>
                <span class="indicator ${formData.compliance === 'ja' ? 'green' : 'red'}"></span>
            </div>
            <div class="summary-item">
                <strong>Therapieziel:</strong> ${formData.therapyGoal}
            </div>
        `;
        
        summaryContentEl.innerHTML = summaryHTML;
        
        // Format and display the report text
        reportTextEl.innerHTML = reportText;
    }
});

// Function to generate report using OpenRouter API
async function generateReport(formData) {
    try {
        const report = await openRouterService.generatePhysiotherapyReport(formData);
        return report;
    } catch (error) {
        console.error('Error in report generation:', error);
        throw error;
    }
}
