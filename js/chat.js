// Chat functionality
document.addEventListener('DOMContentLoaded', function() {
    const chatIcon = document.getElementById('chatIcon');
    const welcomePanel = document.getElementById('welcomePanel');
    const chatPanel = document.getElementById('chatPanel');
    const panelCloseBtn = document.getElementById('panelCloseBtn');
    const headerCloseBtn = document.getElementById('headerCloseBtn');
    const refreshBtn = document.getElementById('refreshBtn');
    const backToWelcomeBtn = document.getElementById('backToWelcomeBtn');
    const conversationArea = document.querySelector('.conversation-area');
    const inputEl = document.querySelector('.chat-input');
    const sendBtn = document.getElementById('sendBtn');
    const chatCloseBtn = document.getElementById('chatCloseBtn');
    const welcomeCloseBtn = document.getElementById('welcomeCloseBtn');
    const welcomeStartBtn = document.getElementById('welcomeStartBtn'); // ACTIVO - Botón restaurado
  
    let firstSelectionMade = false;
    let currentUserType = null;
    let conversationActive = true;
    let lastUserSelection = null;
    let lastOpenPanel = null; // 'welcome' | 'chat'
  
    // Open panel when clicking chat icon (reopen last one if minimized)
    chatIcon.addEventListener('click', () => {
      const anyActive = welcomePanel.classList.contains('active') || chatPanel.classList.contains('active');
      if (!anyActive) {
        if (lastOpenPanel === 'chat') {
          chatPanel.classList.add('active');
        } else {
          welcomePanel.classList.add('active');
          lastOpenPanel = 'welcome';
        }
        chatIcon.classList.add('active');
      }
    });
  
    // Close welcome panel
    const closeWelcomePanel = () => {
      welcomePanel.classList.remove('active');
      chatIcon.classList.remove('active');
    };
  
    // Close chat panel
    const closeChatPanel = () => {
      chatPanel.classList.remove('active');
      resetChatState();
    };

    // Minimize current panel (keep state)
    const minimizePanels = () => {
      if (chatPanel.classList.contains('active')) {
        chatPanel.classList.remove('active');
        lastOpenPanel = 'chat';
      } else if (welcomePanel.classList.contains('active')) {
        welcomePanel.classList.remove('active');
        lastOpenPanel = 'welcome';
      }
      chatIcon.classList.remove('active');
    };
  
    // Close all panels
    const closeAllPanels = () => {
      welcomePanel.classList.remove('active');
      chatPanel.classList.remove('active');
      chatIcon.classList.remove('active');
      resetChatState();
    };
    
    // Event listeners para cerrar paneles
    welcomeCloseBtn.addEventListener('click', closeWelcomePanel);
    panelCloseBtn.addEventListener('click', closeAllPanels);
    headerCloseBtn.addEventListener('click', minimizePanels);
    chatCloseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeAllPanels();
    });

    // Back to welcome from chat
    if (backToWelcomeBtn) {
      backToWelcomeBtn.addEventListener('click', () => {
        if (chatPanel.classList.contains('active')) {
          chatPanel.classList.remove('active');
          welcomePanel.classList.add('active');
          lastOpenPanel = 'welcome';
          chatIcon.classList.add('active');
        }
      });
    }
  
    // Start conversation button - opens chat panel
    welcomeStartBtn.addEventListener('click', () => {
      welcomePanel.classList.remove('active');
      chatPanel.classList.add('active');
      chatIcon.classList.add('active');
      lastOpenPanel = 'chat';
      resetChatState();
    });
  
   /* document.addEventListener('click', (e) => {
      if (!chatIcon.contains(e.target) && !chatPanel.contains(e.target)) {
        closePanel();
      }
    });*/
    
    // Utility functions
    const appendUserMessage = (text) => {
      const userMsg = document.createElement('div');
      userMsg.className = 'user-selection';
      userMsg.innerHTML = `<span>${text}</span>`;
      conversationArea.appendChild(userMsg);
      lastUserSelection = text;
      setTimeout(() => { conversationArea.scrollTop = conversationArea.scrollHeight; }, 50);
    };
  
    const appendBotMessage = (text) => {
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
    };
  
    const scrollToBottom = () => {
      setTimeout(() => {
        conversationArea.scrollTop = conversationArea.scrollHeight;
      }, 100);
    };
  
    // Reset chat state and UI
    const resetChatState = () => {
      firstSelectionMade = false;
      currentUserType = null;
      conversationActive = true;
      lastUserSelection = null;
      conversationArea.innerHTML = '';
      
      appendBotMessage('Este es el comienzo de su conversación con nosotros.');
      appendBotMessage('¡Bienvenido👋🏻! ¿Podrías indicar qué tipo de usuario eres?');
      
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
  
      inputEl.value = '';
      attachUserTypeHandlers();
      conversationArea.scrollTop = 0;
    };
  
    // Refresh button functionality
    refreshBtn.addEventListener('click', () => {
      refreshBtn.style.transform = 'rotate(180deg)';
      refreshBtn.style.transition = 'transform 0.3s ease';
      resetChatState();
      setTimeout(() => {
        refreshBtn.style.transform = 'rotate(0deg)';
      }, 300);
      showRefreshFeedback();
    });
  
    const showRefreshFeedback = () => {
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
    };
  
    // Attach click handlers to initial three buttons
    function attachUserTypeHandlers() {
      const buttons = conversationArea.querySelectorAll('.user-type-buttons .option-btn');
      buttons.forEach((btn) => {
        btn.onclick = () => {
          if (firstSelectionMade) return;
          firstSelectionMade = true;
          
          const userType = btn.getAttribute('data-value');
          currentUserType = userType;
          const text = btn.querySelector('.btn-text')?.textContent || userType;
          
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
  
    function showMainOptions() {
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
    const generateBotResponse = (userMessage) => {
      const message = userMessage.toLowerCase();
      
      // Si la conversación está cerrada pero el usuario escribe
      if (!conversationActive) {
        return {
          message: 'La conversación ha finalizado. ¿Deseas comenzar una nueva?',
          options: ['Sí, nueva consulta', 'No, gracias']
        };
      }

      // Manejo de tipo de usuario
      if (!firstSelectionMade && (message.includes('representante') || message.includes('estudiante') || message.includes('profesor'))) {
        firstSelectionMade = true;
        currentUserType = message.includes('representante') ? 'Representante' : 
                        message.includes('estudiante') ? 'Estudiante' : 'Profesor';
        return {
          message: `Perfecto, eres ${currentUserType}. ¿En qué puedo ayudarte?`,
          options: ['Iniciar Sesión', 'Inscripciones', 'Solicitud de Cupo', 'Reportar Pago']
        };
      }
    
      // Respuestas para finalizar conversación
      if (message.includes('no, gracias') || message.includes('nada más') || message.includes('no gracias') || 
          message.includes('no gracia') || message.includes('adios') || message.includes('adiós') || 
          message.includes('hasta luego') || message.includes('chao') || message.includes('bye')) {
        conversationActive = false;
        return {
          message: '¡Perfecto! Ha sido un placer ayudarte. Que tengas un excelente día.',
          options: []
        };
      }
        
      // Solicitar más ayuda
      if (message.includes('necesito más ayuda') || message.includes('ayuda') || message.includes('otra cosa')) {
        return {
          message: 'Claro, ¿en qué más puedo ayudarte?',
          options: ['Iniciar Sesión', 'Inscripciones', 'Solicitud de Cupo', 'Reportar Pago']
        };
      }
        
      // Iniciar sesión
      if (message.includes('iniciar sesión') || message.includes('iniciar') || message.includes('sesión') || 
          message.includes('sesion') || message.includes('login') || message.includes('acceder') || 
          message.includes('entrar')) {
        return {
          message: 'Te ayudo con el inicio de sesión. ¿Qué necesitas específicamente?',
          options: ['Recuperar Contraseña', 'Crear Cuenta', 'Problemas de Acceso']
        };
      }
      // Inscripciones
      else if (message.includes('inscripciones') || message.includes('matrícula') || message.includes('matricula') || 
               message.includes('inscribir') || message.includes('matricular') || message.includes('registro')) {
        return {
          message: 'Claro, con gusto te asisto en el apartado de las inscripciones. ¿Qué tipo de inscripción te interesa realizar?',
          options: ['Nuevo Ingreso', 'Reingreso']
        };
      }

        // Nuevo Ingreso y Reingreso
        else if (message.includes('Nuevo Ingreso') || message.includes('Reingreso') ||  message.includes('nuevo') || message.includes('Nuevo') || message.includes('Reingreso') || message.includes('reingreso') || 
        message.includes('nuevo ingreso')) {
 return {
   message: 'Gracias por tu selección. Un asesor especializado se pondrá en contacto contigo pronto para resolver tu consulta específica.',
   options: ['Necesito más ayuda', 'No, gracias']
 };
 }
      // Solicitud de cupo
      else if (message.includes('solicitud de cupo') || message.includes('cupo') || message.includes('vacante') || 
               message.includes('solicitar')) {
        return {
          message: 'Entendido, para la solicitud de cupo, ¿Necesitas información sobre el proceso o el estado de una solicitud existente?',
          options: ['Proceso de Solicitud', 'Estado de Solicitud']
        };
      }

       // Proceso y Estado de solicitud de cupo
       else if (message.includes('Estado') || message.includes('Estado de Solicitud') ||  message.includes('estado de solicitud') || message.includes('Proceso de Solicitud') || message.includes('Proceso') || message.includes('proceso') || 
       message.includes('proceso de solicitud')) {
return {
  message: 'Gracias por tu selección. Un asesor especializado se pondrá en contacto contigo pronto para resolver tu consulta específica.',
  options: ['Necesito más ayuda', 'No, gracias']
};
}
      // Reportar pago
      else if (message.includes('reportar pago') || message.includes('pago') || message.includes('factura') || 
               message.includes('pagar') || message.includes('comprobante') || message.includes('recibo')) {
        return {
          message: 'Para reportar un pago realizado o consultar su estado, indícame a continuación el tipo que realizaste.',
          options: ['Matrícula', 'Mensualidad', 'Otro Pago']
        };
      }
      
      // Respuesta por defecto para mensajes no reconocidos
      return {
        message: 'No entiendo tu consulta. Para ayudarte mejor, ¿podrías seleccionar una de las opciones disponibles o ser más específico?',
        options: ['Iniciar Sesión', 'Inscripciones', 'Solicitud de Cupo', 'Reportar Pago', 'Necesito más ayuda']
      };
    }
  
    const processOptionSelection = (option) => {
      const optionLower = option.toLowerCase();
      
      // Finalizar conversación
      if (optionLower.includes('no, gracias') || optionLower.includes('nada más') || 
          optionLower.includes('no gracias') || optionLower.includes('adios') || 
          optionLower.includes('adiós') || optionLower.includes('hasta luego') || 
          optionLower.includes('chao') || optionLower.includes('bye')) {
        conversationActive = false;
        return {
          message: '¡Perfecto! Ha sido un placer ayudarte. Que tengas un excelente día.',
          options: []
        };
      }
      
      // Solicitar más ayuda
      if (optionLower.includes('necesito más ayuda') || optionLower.includes('ayuda') || 
          optionLower.includes('otra cosa') || optionLower.includes('más opciones')) {
        return {
          message: 'Claro, ¿en qué más puedo ayudarte?',
          options: ['Iniciar Sesión', 'Inscripciones', 'Solicitud de Cupo', 'Reportar Pago']
        };
      }
      
      // Iniciar sesión
      if (optionLower.includes('iniciar sesión') || optionLower.includes('iniciar') || 
          optionLower.includes('sesión') || optionLower.includes('sesion') || 
          optionLower.includes('login') || optionLower.includes('acceder') || 
          optionLower.includes('entrar')) {
        return {
          message: 'Te ayudo con el inicio de sesión. ¿Qué necesitas específicamente?',
          options: ['Recuperar Contraseña', 'Crear Cuenta', 'Problemas de Acceso']
        };
      }
      // Inscripciones
      else if (optionLower.includes('inscripciones') || optionLower.includes('matrícula') || 
               optionLower.includes('matricula') || optionLower.includes('inscribir') || 
               optionLower.includes('matricular') || optionLower.includes('registro')) {
        return {
          message: 'Claro, con gusto te asisto con las inscripciones. ¿Qué tipo de inscripción te interesa?',
          options: ['Nuevo Ingreso', 'Reingreso']
        };
      }
      // Solicitud de cupo
      else if (optionLower.includes('solicitud de cupo') || optionLower.includes('cupo') || 
               optionLower.includes('vacante') || optionLower.includes('solicitar') || 
               optionLower.includes('disponibilidad') || optionLower.includes('lugar')) {
        return {
          message: 'Entendido, para la solicitud de cupo, ¿Necesitas información sobre el proceso o el estado de una solicitud realizada?',
          options: ['Proceso de Solicitud', 'Estado de Solicitud']
        };
      }
      // Reportar pago
      else if (optionLower.includes('reportar pago') || optionLower.includes('pago') || 
               optionLower.includes('factura') || optionLower.includes('pagar') || 
               optionLower.includes('comprobante') || optionLower.includes('recibo')) {
        return {
          message: 'Para reportar un pago realizado, indícame a continuación el que realizaste.',
          options: ['Matrícula', 'Mensualidad', 'Otro Pago']
        };
      }
      
      // Respuesta por defecto
      return {
        message: 'Gracias por tu selección. Un asesor especializado se pondrá en contacto contigo pronto para resolver tu consulta específica.',
        options: ['Necesito más ayuda', 'No, gracias']
      };
    };
  
    const showSuggestedOptions = (options) => {
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
    };
  
    const sendMessage = () => {
      const text = inputEl.value.trim();
      if (!text || text === lastUserSelection) return;
      
      appendUserMessage(text);
      inputEl.value = '';
      
      setTimeout(() => {
        // Usar handleFreeTextResponse para texto libre y processOptionSelection para opciones
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
  
    sendBtn.addEventListener('click', sendMessage);
    inputEl.addEventListener('keydown', (e) => { 
      if (e.key === 'Enter') sendMessage(); 
    });
  
    // Search functionality for help center - SIMPLIFICADA (Sección 2 comentada)
    const welcomeSearchInput = document.querySelector('.welcome-search-input');
    if (welcomeSearchInput) {
      welcomeSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const searchTerm = e.target.value.trim();
          if (searchTerm) {
            // Función básica de búsqueda (simplificada)
            alert(`Búsqueda: "${searchTerm}" - Esta funcionalidad está temporalmente deshabilitada.`);
          }
        }
      });
    }

    // Función de búsqueda simplificada (comentada ya que la sección 2 está inactiva)
    /*
    const performHelpCenterSearch = (searchTerm) => {
      // Código de búsqueda comentado
    };
    */
    
    // Función para manejar respuestas inteligentes a texto libre
    const handleFreeTextResponse = (text) => {
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
      if (lowerText.includes('gracias') || lowerText.includes('gracia') || 
          lowerText.includes('thank') || lowerText.includes('thanks')) {
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
    };
  
    attachUserTypeHandlers();
  });