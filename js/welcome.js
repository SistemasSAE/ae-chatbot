// Variables (referencias globales declaradas in `main.js`)
// (no redeclare here to avoid SyntaxError)

// Inicializar panel de bienvenida
function initWelcomePanel() {
    console.debug('initWelcomePanel called');
    welcomePanel = document.getElementById('welcomePanel');
    welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
    welcomeStartBtn = document.getElementById('welcomeStartBtn');

    // Cerrar panel de bienvenida
    const closeWelcomePanel = () => {
        welcomePanel.classList.remove('active');
        if (!chatPanel.classList.contains('active')) {
            chatIcon.classList.remove('active');
        }
        if (!welcomePanel.classList.contains('active') && !chatPanel.classList.contains('active')) {
            chatIcon.style.animation = '';
        }
        toggleFaqButton();
    };

    // Abrir panel cuando se hace click en el icono del chat (restaurar último panel abierto)
    const chatIconEl = document.getElementById('chatIcon');
    if (chatIconEl) {
    chatIconEl.addEventListener('click', (e) => {
            // Evitar que se active si se hace clic en el botón de cerrar
            if (e.target.closest && e.target.closest('.chat-close-btn')) return;

            const anyActive = (welcomePanel && welcomePanel.classList.contains('active')) || (chatPanel && chatPanel.classList.contains('active'));
            if (!anyActive) {
                if (typeof lastOpenPanel !== 'undefined' && lastOpenPanel === 'chat' && typeof conversationActive !== 'undefined' && conversationActive) {
                    if (chatPanel) chatPanel.classList.add('active');
                } else {
                    if (typeof resetChatCompletely === 'function') resetChatCompletely();
                    if (welcomePanel) welcomePanel.classList.add('active');
                    lastOpenPanel = 'welcome';
                }
                if (chatIcon) chatIcon.classList.add('active');
                if (chatIcon) chatIcon.style.animation = 'none';
            }
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
    });

    // Cerrar panel de bienvenida
    welcomeCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPanels();
        chatIcon.style.animation = '';
        closeWelcomePanel();
    });
}