// Variables globales para panel de confirmación (definidas in `main.js`)
// ...existing code...

// Inicializar panel de confirmación
function initConfirmationPanel() {
    console.debug('initConfirmationPanel called');
    confirmationPanel = document.getElementById('confirmationPanel');
    confirmCloseBtn = document.getElementById('confirmCloseBtn');
    cancelCloseBtn = document.getElementById('cancelCloseBtn');

// Cerrar todos los paneles
window.closeAllPanels = () => {
    if (chatPanel && chatPanel.classList.contains('active')) {
        faqToggleBtn.style.display = 'none';
    } else if (welcomePanel && welcomePanel.classList.contains('active')) {
        faqToggleBtn.style.display = 'none';
    }
    

    if (confirmationPanel) confirmationPanel.classList.add('active');
    
    // NO marcar como cerrado manualmente todavía - solo cuando se confirme
};
    // Confirmar cierre
const confirmClose = () => {

    if (welcomePanel) welcomePanel.classList.remove('active');
    if (faqPanel) faqPanel.classList.remove('active');
    if (chatFaqPanel) chatFaqPanel.classList.remove('active');
    if (confirmationPanel) confirmationPanel.classList.remove('active');
    if (faqToggleBtn) faqToggleBtn.style.display = 'none';
    if (chatPanel && !chatPanel.classList.contains('active')) {
        chatIcon.classList.remove('active');
    }
    toggleFaqButton();
    if (faqToggleBtn) faqToggleBtn.style.display = 'none';
    
    // Marcar que se cerró manualmente
    sessionStorage.setItem('manuallyClosed', 'true');
    // Remover marca de minimizado
    sessionStorage.removeItem('minimized');
    
    setTimeout(() => {
        showRatingPanel();
    }, 50);
};

// Cancelar cierre
const cancelClose = () => {
    if (confirmationPanel) confirmationPanel.classList.remove('active');
    if (faqToggleBtn) faqToggleBtn.style.display = 'flex';
    
    // NO marcar como cerrado manualmente si se cancela
    sessionStorage.removeItem('manuallyClosed');
};

    if (confirmCloseBtn) confirmCloseBtn.addEventListener('click', confirmClose);
    if (cancelCloseBtn) cancelCloseBtn.addEventListener('click', cancelClose);
    console.debug('confirmation: listeners attached');
}