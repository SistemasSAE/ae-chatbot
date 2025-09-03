// Variables (referencias globales declaradas in `main.js`)
// (no redeclare here to avoid SyntaxError)

// Inicializar panel de bienvenida
function initWelcomePanel() {
    console.debug('initWelcomePanel called');
    welcomePanel = document.getElementById('welcomePanel');
    welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
    welcomeStartBtn = document.getElementById('welcomeStartBtn');

    const closeWelcomePanel = () => {
        welcomePanel.classList.remove('active');
        if (!chatPanel.classList.contains('active')) {
            chatIcon.classList.remove('active');
        }
        if (!welcomePanel.classList.contains('active') && !chatPanel.classList.contains('active')) {
            chatIcon.style.animation = '';
        }
        toggleFaqButton();
        
        // Marcar que se cerró manualmente
        sessionStorage.setItem('manuallyClosed', 'true');
    };
    
    const chatIconEl = document.getElementById('chatIcon');
    if (chatIconEl) {
        chatIconEl.addEventListener('click', (e) => {
            // Evitar que se active si se hace clic en el botón de cerrar
            if (e.target.closest && e.target.closest('.chat-close-btn')) return;
        
            const welcomeActive = welcomePanel && welcomePanel.classList.contains('active');
            const chatActive = chatPanel && chatPanel.classList.contains('active');
            const anyActive = welcomeActive || chatActive;
        
            // Si ya hay un panel activo, minimizarlo
            if (anyActive) {
                minimizePanels();
                return;
            }
        
            // Si no hay panel activo, decidir cuál abrir basado en el último estado
            const wasMinimized = sessionStorage.getItem('minimized') === 'true';
            const manuallyClosed = sessionStorage.getItem('manuallyClosed') === 'true';
            
            if (wasMinimized && !manuallyClosed && lastOpenPanel === 'chat' && conversationActive) {
                // Reabrir el chat panel si fue minimizado y hay conversación activa
                if (chatPanel) chatPanel.classList.add('active');
                if (chatIcon) chatIcon.classList.add('active');
                lastOpenPanel = 'chat';
                
                // Remover marca de minimizado
                sessionStorage.removeItem('minimized');
            } else {
                // Abrir welcome panel por defecto
                if (typeof resetChatCompletely === 'function') resetChatCompletely();
                if (welcomePanel) welcomePanel.classList.add('active');
                lastOpenPanel = 'welcome';
                
                // Remover marcas
                sessionStorage.removeItem('minimized');
                sessionStorage.removeItem('manuallyClosed');
            }
            
            if (chatIcon) chatIcon.classList.add('active');
            if (chatIcon) chatIcon.style.animation = 'none';
            
            if (typeof toggleFaqButton === 'function') toggleFaqButton();
        });
        console.debug('welcome: chatIcon click listener attached');
    }
    // Iniciar conversación - abre panel de chat
    welcomeStartBtn.addEventListener('click', () => {
        welcomePanel.classList.remove('active');
        chatPanel.classList.add('active');
        chatIcon.classList.add('active');
        floatingMsg.classList.add('active');
        lastOpenPanel = 'chat';
        resetChatState();
        toggleFaqButton();
        
        // Remover marca de cierre manual al iniciar nueva conversación
        sessionStorage.removeItem('manuallyClosed');
    });

    // Cerrar panel de bienvenida
    welcomeCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeWelcomePanel();
    });
}