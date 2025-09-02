// Variables globales para FAQ (referencias definidas in `main.js`)
// ...existing code...

// Inicializar panel de FAQ
function initFaqPanel() {
    console.debug('initFaqPanel called');
    faqPanel = document.getElementById('faqPanel');
    faqToggleBtn = document.getElementById('faqToggleBtn');
    faqBackBtn = document.getElementById('faqBackBtn');
    faqButtons = document.querySelectorAll('.faq-btn');

    // Abrir panel de FAQ
    if (faqToggleBtn) {
        faqToggleBtn.addEventListener('click', () => {
            if (faqPanel) faqPanel.classList.add('active');
            if (window.innerWidth > 600) {
                faqToggleBtn.style.display = 'none';
            }
        });
    console.debug('faq: faqToggleBtn listener attached');
    }

    // Cerrar panel de FAQ
    if (faqBackBtn) {
        faqBackBtn.addEventListener('click', () => {
            if (faqPanel) faqPanel.classList.remove('active');
            if (chatPanel && chatPanel.classList.contains('active') && window.innerWidth > 600) {
                if (faqToggleBtn) faqToggleBtn.style.display = 'flex';
            }
        });
    console.debug('faq: faqBackBtn listener attached');
    }

    // Manejar clic en preguntas frecuentes
    if (faqButtons && faqButtons.length > 0) {
    console.debug('faq: faqButtons count', faqButtons.length);
        faqButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-value');

                if (faqPanel) faqPanel.classList.remove('active');

                if (window.innerWidth <= 600) {
                    if (!chatPanel || !chatPanel.classList.contains('active')) {
                        if (welcomePanel) welcomePanel.classList.remove('active');
                        if (chatPanel) chatPanel.classList.add('active');
                        if (chatIcon) chatIcon.classList.add('active');
                        if (floatingMsg) floatingMsg.classList.remove('active');
                        lastOpenPanel = 'chat';
                    }
                } else {
                    if (chatPanel && chatPanel.classList.contains('active')) {
                        if (faqToggleBtn) faqToggleBtn.style.display = 'flex';
                    }
                }

                setTimeout(() => {
                    if (typeof appendUserMessage === 'function') appendUserMessage(question);
                    if (floatingMsg) floatingMsg.classList.remove('active');

                    // Si la pregunta es 'Como iniciar sesión' abrir el panel de login
                    const qLower = question ? question.toLowerCase() : '';
                    if (qLower.includes('iniciar') && qLower.includes('sesión') || qLower.includes('iniciar sesión') || qLower.includes('recuperar contraseña')) {
                        console.debug('faq: opening login from FAQ for question', question);
                        if (typeof openLoginFromFAQ === 'function') {
                            // Cerrar FAQ y abrir login
                            if (faqPanel) faqPanel.classList.remove('active');
                            openLoginFromFAQ();
                            return;
                        }
                    }

                    setTimeout(() => {
                        const response = typeof processOptionSelection === 'function' ? processOptionSelection(question) : { message: '', options: [] };
                        if (typeof appendBotMessage === 'function') appendBotMessage(response.message);

                        if (response.options && response.options.length > 0 && typeof showSuggestedOptions === 'function') {
                            showSuggestedOptions(response.options);
                        }
                    }, 800);
                }, 500);
            });
        });
    }
}

// Inicializar FAQ específico del chat (panel interno y botones rápidos)
function initChatFaqPanel() {
    chatFaqBtn = document.getElementById('chatFaqBtn');
    chatFaqPanel = document.getElementById('chatFaqPanel');
    chatFaqButtons = document.querySelectorAll('.chat-faq-btn-item');

    if (chatFaqBtn && chatFaqPanel) {
        chatFaqBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            chatFaqPanel.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (chatFaqPanel.classList.contains('active') && !chatFaqPanel.contains(e.target) && !chatFaqBtn.contains(e.target)) {
                chatFaqPanel.classList.remove('active');
            }
        });
    }

    if (chatFaqButtons && chatFaqButtons.length > 0) {
        chatFaqButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-value');
                if (chatFaqPanel) chatFaqPanel.classList.remove('active');

                setTimeout(() => {
                    if (typeof appendUserMessage === 'function') appendUserMessage(question);
                    setTimeout(() => {
                        const response = typeof processOptionSelection === 'function' ? processOptionSelection(question) : { message: '', options: [] };
                        if (typeof appendBotMessage === 'function') appendBotMessage(response.message);
                        if (response.options && response.options.length > 0 && typeof showSuggestedOptions === 'function') {
                            showSuggestedOptions(response.options);
                        }
                        if (floatingMsg) floatingMsg.classList.remove('active');
                    }, 800);
                }, 100);
            });
        });
    }
}

