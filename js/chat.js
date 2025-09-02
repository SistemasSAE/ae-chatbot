// Variables globales para el panel de chat (referencias definidas in `main.js`)
// ...existing code...

// Inicializar panel de chat
function initChatPanel() {
    console.debug('initChatPanel called');
    chatPanel = document.getElementById('chatPanel');
    conversationArea = document.querySelector('.conversation-area');
    inputEl = document.querySelector('.chat-input');
    sendBtn = document.getElementById('sendBtn');
    refreshBtn = document.getElementById('refreshBtn');
    backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
    headerCloseBtn = document.getElementById('headerCloseBtn');
    panelCloseBtn = document.getElementById('panelCloseBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');

    chatIcon.addEventListener('click', (e) => {
        // Evitar que se active si se hace clic en el botón de cerrar
        if (e.target.closest('.chat-close-btn')) return;
        
        const anyActive = welcomePanel.classList.contains('active') || chatPanel.classList.contains('active');
        if (!anyActive) {
            // Siempre mostrar el panel de bienvenida al hacer clic en el icono
            resetChatCompletely();
            welcomePanel.classList.add('active');
            lastOpenPanel = 'welcome';
            chatIcon.classList.add('active');
            chatIcon.style.animation = 'none';
        }
        toggleFaqButton();
    });
    // Volver al panel de bienvenida
    if (backToWelcomeBtn) {
        backToWelcomeBtn.addEventListener('click', () => {
            console.debug('chat: backToWelcomeBtn clicked');
            if (chatPanel.classList.contains('active')) {
                chatPanel.classList.remove('active');
                welcomePanel.classList.add('active');
                faqToggleBtn.style.display = 'none';
                confirmationPanel.classList.remove('active');
                ratingPanel.classList.remove('active');
                chatFaqPanel.classList.remove('active');
                faqPanel.classList.remove('active');
                lastOpenPanel = 'welcome';
                chatIcon.classList.add('active');
                resetChatState();
            }
        });
    }

    // Reiniciar chat
    refreshBtn.addEventListener('click', () => {
    console.debug('chat: refreshBtn clicked');
        refreshBtn.style.transform = 'rotate(180deg)';
        refreshBtn.style.transition = 'transform 0.3s ease';
        resetChatState();
        setTimeout(() => {
            refreshBtn.style.transform = 'rotate(0deg)';
        }, 300);
        showRefreshFeedback();
    });

    // Minimizar chat
    headerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        minimizePanels();
    });

    // Cerrar panel de chat
    panelCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeAllPanels();
    });

    // Enviar mensaje
    const sendMessage = () => {
        const text = inputEl.value.trim();
        if (!text || text === lastUserSelection) return;
        
        appendUserMessage(text);
        inputEl.value = '';
        
        setTimeout(() => {
            let response;
            if (firstSelectionMade) {
                response = handleFreeTextResponse(text);
            } else {
                response = processOptionSelection(text);
            }
            
            appendBotMessage(response.message);
            
            if (response.options && response.options.length > 0) {
                showSuggestedOptions(response.options);
            }
        }, 1000);
        
        scrollToBottom();
    };

    sendBtn.addEventListener('click', () => {
        if (typeof chatFaqPanel !== 'undefined') {
            chatFaqPanel.classList.remove('active');
        }
        floatingMsg.classList.remove('active');
    console.debug('chat: sendBtn clicked');
        sendMessage();
    });
    
    inputEl.addEventListener('keydown', (e) => { 
        if (e.key === 'Enter') {
            if (typeof chatFaqPanel !== 'undefined') {
                chatFaqPanel.classList.remove('active');
            }
            floatingMsg.classList.remove('active');
            sendMessage();
        } 
    });

    // Cerrar chat desde el icono
    if (chatCloseBtn) {
        chatCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeAllPanels();
        });
    }
}
// ...existing code...
