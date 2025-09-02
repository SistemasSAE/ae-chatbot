// main.js - Archivo principal que inicializa todos los paneles y componentes

// Variables globales
let firstSelectionMade = false;
let currentUserType = null;
let conversationActive = true;
let lastUserSelection = null;
let lastOpenPanel = null;
let currentRating = 0;

// Elementos globales
let chatIcon, welcomePanel, chatPanel, conversationArea, inputEl, sendBtn, floatingMsg, faqToggleBtn, faqPanel;
let confirmationPanel, ratingPanel, chatFaqPanel, welcomeCloseBtn, welcomeStartBtn, chatFaqBtn;

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    console.debug('main: DOMContentLoaded - initializing panels');
    // Obtener referencias a los elementos
    chatIcon = document.getElementById('chatIcon');
    welcomePanel = document.getElementById('welcomePanel');
    chatPanel = document.getElementById('chatPanel');
    conversationArea = document.querySelector('.conversation-area');
    inputEl = document.querySelector('.chat-input');
    sendBtn = document.getElementById('sendBtn');
    floatingMsg = document.getElementById('floating-message-bot');
    faqToggleBtn = document.getElementById('faqToggleBtn');
    faqPanel = document.getElementById('faqPanel');
    confirmationPanel = document.getElementById('confirmationPanel');
    ratingPanel = document.getElementById('ratingPanel');
    chatFaqPanel = document.getElementById('chatFaqPanel');
    welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
    welcomeStartBtn = document.getElementById('welcomeStartBtn');
    chatFaqBtn = document.getElementById('chatFaqBtn');

    // Inicializar todos los paneles
    initWelcomePanel();
    initChatPanel();
    initFaqPanel();
    initChatFaqPanel();
    initConfirmationPanel();
    initRatingPanel();

    // Inicializar estado del chat
    resetChatState();
    
    // Configurar eventos globales
    setupGlobalEventListeners();
    
    // Asegurarse de que el botón FAQ esté oculto en móviles al cargar
    if (window.innerWidth <= 600) {
        faqToggleBtn.style.display = 'none';
    }

    // Escuchar cambios de tamaño de ventana para ajustar el botón FAQ
    window.addEventListener('resize', toggleFaqButton);
});

// Configurar event listeners globales
function setupGlobalEventListeners() {
    // Cerrar paneles al hacer clic fuera de ellos
    document.addEventListener('click', (e) => {
        if (faqPanel.classList.contains('active') && 
            !faqPanel.contains(e.target) && 
            !faqToggleBtn.contains(e.target)) {
            faqPanel.classList.remove('active');
            if (chatPanel.classList.contains('active') && window.innerWidth > 600) {
                faqToggleBtn.style.display = 'flex';
            }
        }

        if (confirmationPanel.classList.contains('active') && 
            !confirmationPanel.contains(e.target)) {
            confirmationPanel.classList.remove('active');
            if (faqToggleBtn) faqToggleBtn.style.display = 'flex';
            chatPanel.classList.remove('blurred');
            welcomePanel.classList.remove('blurred');
        }
        
        if (ratingPanel.classList.contains('active') && 
            !ratingPanel.contains(e.target)) {
            ratingPanel.classList.remove('active');
        }
        
        if (chatFaqPanel.classList.contains('active') && 
            !chatFaqPanel.contains(e.target) && 
            !chatFaqBtn.contains(e.target)) {
            chatFaqPanel.classList.remove('active');
        }
    });

    // También necesitamos prevenir que el clic en el botón de cerrar active el chat icon
    const chatCloseButtons = document.querySelectorAll('.chat-close-btn');
    chatCloseButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// Función para alternar la visibilidad del botón FAQ
function toggleFaqButton() {
    if (!faqToggleBtn) return;
    
    if (window.innerWidth <= 600) {
        faqToggleBtn.style.display = 'none';
        return;
    }
    
    if (chatPanel.classList.contains('active')) {
        faqToggleBtn.style.display = 'flex';
    } else {
        faqToggleBtn.style.display = 'none';
        if (faqPanel) faqPanel.classList.remove('active');
    }
}

// Función para minimizar paneles
function minimizePanels() {
    if (chatPanel.classList.contains('active')) {
        chatPanel.classList.remove('active');
        lastOpenPanel = 'chat';
    } else if (welcomePanel.classList.contains('active')) {
        welcomePanel.classList.remove('active');
        lastOpenPanel = 'welcome';
    }
    
    if (!welcomePanel.classList.contains('active') && !chatPanel.classList.contains('active')) {
        chatIcon.classList.remove('active');
        chatIcon.style.animation = '';
    }
    toggleFaqButton();
}

// Función para cerrar el panel de bienvenida
function closeWelcomePanel() {
    welcomePanel.classList.remove('active');
    if (!chatPanel.classList.contains('active')) {
        chatIcon.classList.remove('active');
    }
    if (!welcomePanel.classList.contains('active') && !chatPanel.classList.contains('active')) {
        chatIcon.style.animation = '';
    }
    toggleFaqButton();
}

// Función para mostrar el panel de valoración
function showRatingPanel() {
    const stars = document.querySelectorAll('.star');
    const ratingComment = document.getElementById('ratingComment');
    
    stars.forEach(star => star.classList.remove('active'));
    if (ratingComment) ratingComment.value = '';
    currentRating = 0;
    
    ratingPanel.classList.add('active');
}

// Función para reiniciar completamente el chat
function resetChatCompletely() {
    welcomePanel.classList.remove('active');
    chatPanel.classList.remove('active');
    if (faqPanel) faqPanel.classList.remove('active');
    if (chatFaqPanel) chatFaqPanel.classList.remove('active');
    if (confirmationPanel) confirmationPanel.classList.remove('active');
    if (ratingPanel) ratingPanel.classList.remove('active');
    if (floatingMsg) floatingMsg.classList.add('active');
    
    if (!chatPanel.classList.contains('active')) {
        chatIcon.classList.remove('active');
    }
    
    firstSelectionMade = false;
    currentUserType = null;
    conversationActive = true;
    lastUserSelection = null;
    lastOpenPanel = null;
    
    if (conversationArea) conversationArea.innerHTML = '';
    
    toggleFaqButton();
}

// Función para mostrar opciones principales
function showMainOptions() {
    if (!conversationArea) return;
    
    const existingOptions = conversationArea.querySelector('.main-options');
    if (existingOptions) existingOptions.remove();
    
    const container = document.createElement('div');
    container.className = 'option-buttons main-options';
    container.innerHTML = `
        <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Iniciar Sesión">
            <span class="btn-text">Iniciar Sesión</span>
            <div class="btn-icon"></div>
        </button>
        <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Inscripciones">
            <span class="btn-text">Inscripciones</span>
            <div class="btn-icon"></div>
        </button>
        <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Solicitud de Cupo">
            <span class="btn-text">Solicitud de Cupo</span>
            <div class="btn-icon"></div>
        </button>
        <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Reportar Pago">
            <span class="btn-text">Reportar Pago</span>
            <div class="btn-icon"></div>
        </button>
    `;
    
    conversationArea.appendChild(container);

    container.querySelectorAll('.option-btn').forEach(b => {
        b.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = b.dataset.value;
            
            if (lastUserSelection === text) return;
            
            container.querySelectorAll('.option-btn').forEach(btn => {
                btn.classList.add('disabled');
                btn.style.pointerEvents = 'none';
            });
            
            b.classList.add('active');
            appendUserMessage(text);
            
            setTimeout(() => {
                const response = processOptionSelection(text);
                appendBotMessage(response.message);
                
                if (response.options && response.options.length > 0) {
                    showSuggestedOptions(response.options);
                }
            }, 800);
        });
    });

    scrollToBottom();
}

// Función para mostrar opciones sugeridas
function showSuggestedOptions(options) {
    if (!conversationArea) return;
    
    const oldOptions = conversationArea.querySelector('.suggested-options');
    if (oldOptions) oldOptions.remove();
    
    const container = document.createElement('div');
    container.className = 'option-buttons suggested-options';
    container.innerHTML = options.map(option => `
        <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="${option}">
            <span class="btn-text">${option}</span>
            <div class="btn-icon"></div>
        </button>
    `).join('');
    
    conversationArea.appendChild(container);
    
    container.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const text = btn.dataset.value;
            
            if (lastUserSelection === text) return;
            
            container.querySelectorAll('.option-btn').forEach(b => {
                b.classList.add('disabled');
                b.style.pointerEvents = 'none';
            });
            
            btn.classList.add('active');
            appendUserMessage(text);
            
            setTimeout(() => {
                const response = processOptionSelection(text);
                appendBotMessage(response.message);
                
                if (response.options && response.options.length > 0) {
                    showSuggestedOptions(response.options);
                }
            }, 800);
        });
    });
    
    scrollToBottom();
}

// Función para agregar mensaje del usuario
function appendUserMessage(text) {
    if (!conversationArea) return;
    
    const userMsg = document.createElement('div');
    userMsg.className = 'user-selection';
    userMsg.innerHTML = `<span>${text}</span>`;
    conversationArea.appendChild(userMsg);
    lastUserSelection = text;
    setTimeout(() => { conversationArea.scrollTop = conversationArea.scrollHeight; }, 50);
}

// Función para agregar mensaje del bot
function appendBotMessage(text) {
    if (!conversationArea) return;
    
    const botMsg = document.createElement('div');
    botMsg.className = 'bot-message';
    botMsg.innerHTML = `
        <div class="bot-avatar">
            <img src="images/agente-de-centro-de-llamadas.png" alt="Bot Avatar" class="bot-avatar-img">
        </div>
        <span>${text}</span>
    `;
    conversationArea.appendChild(botMsg);
    setTimeout(() => { conversationArea.scrollTop = conversationArea.scrollHeight; }, 50);
}

// Función para desplazarse al final
function scrollToBottom() {
    if (!conversationArea) return;
    
    setTimeout(() => {
        conversationArea.scrollTop = conversationArea.scrollHeight;
    }, 20);
}

// Función para mostrar feedback de reinicio
function showRefreshFeedback() {
    if (!conversationArea) return;
    
    const feedback = document.createElement('div');
    feedback.className = 'bot-message refresh-feedback';
    feedback.innerHTML = `
        <div class="bot-avatar">
            <img src="images/agente-de-centro-de-llamadas.png" alt="Bot Avatar" class="bot-avatar-img">
        </div>
        <span>Chat reiniciado. ¿En qué puedo ayudarte?</span>
    `;
    feedback.style.background = '#e8f5e8';
    feedback.style.border = '1px solid #28a745';
    feedback.style.color = '#155724';
    
    conversationArea.insertBefore(feedback, conversationArea.firstChild);
    
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}

// Función para adjuntar manejadores de tipo de usuario
function attachUserTypeHandlers() {
    if (!conversationArea) return;
    
    const buttons = conversationArea.querySelectorAll('.user-type-buttons .option-btn');
    buttons.forEach((btn) => {
        btn.onclick = () => {
            if (firstSelectionMade) return;
            firstSelectionMade = true;
            
            const userType = btn.getAttribute('data-value');
            currentUserType = userType;
            const text = btn.querySelector('.btn-text')?.textContent || userType;
            if (floatingMsg) floatingMsg.classList.remove('active');
            appendUserMessage(text);
            
            buttons.forEach(otherBtn => {
                otherBtn.classList.add('disabled');
                otherBtn.style.pointerEvents = 'none';
            });
            
            btn.classList.add('active');
            
            setTimeout(() => {
                appendBotMessage(`Perfecto, eres ${text}. ¿En qué puedo ayudarte?`);
                showMainOptions();
            }, 1000);
        };
    });
}

// Función para reiniciar el estado del chat
function resetChatState() {
    firstSelectionMade = false;
    currentUserType = null;
    conversationActive = true;
    lastUserSelection = null;
    if (conversationArea) conversationArea.innerHTML = '';

    // Agregar mensaje del bot
    appendBotMessage('¡Bienvenido👋🏻! ¿Podrías indicar qué tipo de usuario eres?');

    if (conversationArea) {
        conversationArea.insertAdjacentHTML('beforeend', `
            <div class="option-buttons user-type-buttons">
                <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Representante">
                    <span class="btn-text">Representante</span>
                    <div class="btn-icon"></div>
                </button>
                <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Estudiante">
                    <span class="btn-text">Estudiante</span>
                    <div class="btn-icon"></div>
                </button>
                <button class="option-btn btn btn-light w-100 text-start d-flex justify-content-between align-items-center" data-value="Profesor">
                    <span class="btn-text">Profesor</span>
                    <div class="btn-icon"></div>
                </button>
            </div>
        `);
    }

    if (inputEl) inputEl.value = '';
    attachUserTypeHandlers();
    if (conversationArea) conversationArea.scrollTop = 0;
}

// Función para manejar respuestas de texto libre
function handleFreeTextResponse(text) {
    const lowerText = text.toLowerCase();
    
    // Detectar saludos
    if (lowerText.includes('hola') || lowerText.includes('buenos días') || 
        lowerText.includes('buenas') || lowerText.includes('saludos') ||
        lowerText.includes('buenos dias') || lowerText.includes('buenas tardes') ||
        lowerText.includes('buenas noches')) {
        return {
            message: '¡Hola! ¿En qué puedo ayudarte hoy?',
            options: ['Iniciar Sesión', 'Inscripciones', 'Solicitud de Cupo', 'Reportar Pago']
        };
    }
    
    // Detectar agradecimientos
    if (lowerText.includes('gracias') || lowerText.includes('gracia')) {
        return {
            message: '¡De nada! Me alegra haber podido ayudarte. ¿Hay algo más en lo que pueda asistirte?',
            options: ['Sí, necesito más ayuda', 'No, gracias']
        };
    }
    
    // Detectar preguntas generales
    if (lowerText.includes('qué') || lowerText.includes('que') || 
        lowerText.includes('como') || lowerText.includes('cómo') ||
        lowerText.includes('cuando') || lowerText.includes('cuándo') ||
        lowerText.includes('donde') || lowerText.includes('dónde')) {
        return {
            message: 'Entiendo tu pregunta. Para darte la mejor respuesta, ¿podrías ser más específico sobre qué necesitas?',
            options: ['Iniciar Sesión', 'Inscripciones', 'Solicitud de Cupo', 'Reportar Pago', 'Necesito más ayuda']
        };
    }
    
    // Si no se reconoce, usar la función principal
    return generateBotResponse(text);
}