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
  const welcomeStartBtn = document.getElementById('welcomeStartBtn');
  const faqToggleBtn = document.getElementById('faqToggleBtn');
  const faqPanel = document.getElementById('faqPanel');
  const faqBackBtn = document.getElementById('faqBackBtn');
  const faqButtons = document.querySelectorAll('.faq-btn');
  const chatFaqBtn = document.getElementById('chatFaqBtn');
  const chatFaqPanel = document.getElementById('chatFaqPanel');
  const chatFaqButtons = document.querySelectorAll('.chat-faq-btn-item');
  const confirmationPanel = document.getElementById('confirmationPanel');
  const confirmCloseBtn = document.getElementById('confirmCloseBtn');
  const cancelCloseBtn = document.getElementById('cancelCloseBtn');
  const ratingPanel = document.getElementById('ratingPanel');
  const stars = document.querySelectorAll('.star');
  const ratingComment = document.getElementById('ratingComment');
  const submitRatingBtn = document.getElementById('submitRatingBtn');
  const skipRatingBtn = document.getElementById('skipRatingBtn');

  let firstSelectionMade = false;
  let currentUserType = null;
  let conversationActive = true;
  let lastUserSelection = null;
  let lastOpenPanel = null; // 'welcome' | 'chat'
  let currentRating = 0;

  const toggleFaqButton = () => {
    if (window.innerWidth <= 600) {
      faqToggleBtn.style.display = 'none';
      return;
    }
    
    // En desktop, mostrar u ocultar según el estado
    if (chatPanel.classList.contains('active')) {
      faqToggleBtn.style.display = 'flex';
    } else {
      faqToggleBtn.style.display = 'none';
      faqPanel.classList.remove('active');
    }
  };

  // Open panel when clicking chat icon (reopen last one if minimized)
  chatIcon.addEventListener('click', (e) => {
    // Evitar que se active si se hace clic en el botón de cerrar
    if (e.target.closest('.chat-close-btn')) return;
    
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
    toggleFaqButton();
  });

  // Close welcome panel
  const closeWelcomePanel = () => {
    welcomePanel.classList.remove('active');
    chatIcon.classList.remove('active');
    toggleFaqButton();
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
    toggleFaqButton();
  };

  const closeAllPanels = () => {
    // Aplicar blur a los paneles activos
    if (chatPanel.classList.contains('active')) {
      chatPanel.classList.add('blurred');
    } else if (welcomePanel.classList.contains('active')) {
      welcomePanel.classList.add('blurred');
    }
    
    // Mostrar panel de confirmación
    confirmationPanel.classList.add('active');
  };

  // Cerrar definitivamente (después de confirmación) - Modificado para quitar blur
  const confirmClose = () => {
    welcomePanel.classList.add('active');
    chatPanel.classList.remove('active', 'blurred');
    faqPanel.classList.remove('active');
    chatFaqPanel.classList.remove('active');
    chatIcon.classList.remove('active');
    confirmationPanel.classList.remove('active');
    resetChatState();
    toggleFaqButton();
  };

  // Cancelar cierre - Modificado para quitar blur
  const cancelClose = () => {
    confirmationPanel.classList.remove('active');
    // Remover blur de los paneles
    chatPanel.classList.remove('blurred');
    welcomePanel.classList.remove('blurred');
  };

  // Event listeners para los botones de confirmación
  confirmCloseBtn.addEventListener('click', confirmClose);
  cancelCloseBtn.addEventListener('click', cancelClose);

  // Sistema de valoración por estrellas
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const value = parseInt(star.getAttribute('data-value'));
      currentRating = value;
      
      // Actualizar visualización de estrellas
      stars.forEach(s => {
        const starValue = parseInt(s.getAttribute('data-value'));
        if (starValue <= value) {
          s.classList.add('active');
        } else {
          s.classList.remove('active');
        }
      });
    });
  });

  // Enviar valoración
  submitRatingBtn.addEventListener('click', () => {
    const comment = ratingComment.value.trim();
    
    // Aquí puedes enviar la valoración a tu backend
    console.log('Valoración:', {
      rating: currentRating,
      comment: comment
    });
    
    // Cerrar panel de valoración
    ratingPanel.classList.remove('active');
    
    // Reiniciar chat completamente
    resetChatCompletely();
  });

  // Omitir valoración
  skipRatingBtn.addEventListener('click', () => {
    ratingPanel.classList.remove('active');
    resetChatCompletely();
  });

  // Función para mostrar panel de valoración
  const showRatingPanel = () => {
    // Resetear estrellas y comentario
    stars.forEach(star => star.classList.remove('active'));
    ratingComment.value = '';
    currentRating = 0;
    
    // Mostrar panel
    ratingPanel.classList.add('active');
  };

  // Función para reiniciar chat completamente
  const resetChatCompletely = () => {
    // Cerrar todos los paneles
    welcomePanel.classList.remove('active');
    chatPanel.classList.remove('active');
    faqPanel.classList.remove('active');
    chatFaqPanel.classList.remove('active');
    confirmationPanel.classList.remove('active');
    chatIcon.classList.remove('active');
    
    // Reiniciar estado completo
    resetChatState();
    toggleFaqButton();
    
    // Restablecer variables de estado
    firstSelectionMade = false;
    currentUserType = null;
    conversationActive = true;
    lastUserSelection = null;
    lastOpenPanel = null;
  };

  // Abrir panel de FAQ principal
  faqToggleBtn.addEventListener('click', () => {
    faqPanel.classList.add('active');
    // En desktop, ocultar el botón flotante cuando el panel está abierto
    if (window.innerWidth > 600) {
      faqToggleBtn.style.display = 'none';
    }
  });

  // Cerrar panel de FAQ principal con el botón de volver
  faqBackBtn.addEventListener('click', () => {
    faqPanel.classList.remove('active');
    if (chatPanel.classList.contains('active') && window.innerWidth > 600) {
      faqToggleBtn.style.display = 'flex';
    }
  });

  // Cerrar panel FAQ principal al hacer clic fuera de él
  document.addEventListener('click', (e) => {
    if (faqPanel.classList.contains('active') && 
        !faqPanel.contains(e.target) && 
        !faqToggleBtn.contains(e.target)) {
      faqPanel.classList.remove('active');
      if (chatPanel.classList.contains('active') && window.innerWidth > 600) {
        faqToggleBtn.style.display = 'flex';
      }
    }

    // Cerrar panel de confirmación al hacer clic fuera
    if (confirmationPanel.classList.contains('active') && 
        !confirmationPanel.contains(e.target)) {
      confirmationPanel.classList.remove('active');
      // Remover blur de los paneles
      chatPanel.classList.remove('blurred');
      welcomePanel.classList.remove('blurred');
    }
    
    // Cerrar panel de valoración al hacer clic fuera
    if (ratingPanel.classList.contains('active') && 
        !ratingPanel.contains(e.target)) {
      ratingPanel.classList.remove('active');
    }
  });

  // Alternar visibilidad del panel FAQ del chat
  chatFaqBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatFaqPanel.classList.toggle('active');
  });

  // Cerrar panel FAQ del chat al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (chatFaqPanel.classList.contains('active') && 
        !chatFaqPanel.contains(e.target) && 
        !chatFaqBtn.contains(e.target)) {
      chatFaqPanel.classList.remove('active');
    }
  });

  // Manejar clic en preguntas frecuentes del FAQ principal
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-value');
      
      // Cerrar panel de FAQ (especialmente importante en móviles)
      faqPanel.classList.remove('active');
      
      // Si estamos en móvil, asegurarse de que el chat esté visible
      if (window.innerWidth <= 600) {
        // En móviles, el FAQ panel reemplaza al chat, así que necesitamos mostrar el chat
        if (!chatPanel.classList.contains('active')) {
          welcomePanel.classList.remove('active');
          chatPanel.classList.add('active');
          chatIcon.classList.add('active');
          lastOpenPanel = 'chat';
          toggleFaqButton();
        }
      } else {
        // En desktop, mostrar el botón FAQ si el chat está abierto
        if (chatPanel.classList.contains('active')) {
          faqToggleBtn.style.display = 'flex';
        }
      }
      
      // Enviar la pregunta seleccionada al chat
      setTimeout(() => {
        appendUserMessage(question);
        
        // Procesar la respuesta
        setTimeout(() => {
          const response = processOptionSelection(question);
          appendBotMessage(response.message);
          
          if (response.options && response.options.length > 0) {
            showSuggestedOptions(response.options);
          }
        }, 800);
      }, 500);
    });
  });

  // Manejar clic en preguntas frecuentes del FAQ del chat
  chatFaqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-value');
      
      // Cerrar panel de FAQ del chat
      chatFaqPanel.classList.remove('active');
      
      // Enviar la pregunta seleccionada al chat
      setTimeout(() => {
        appendUserMessage(question);
        
        // Procesar la respuesta
        setTimeout(() => {
          const response = processOptionSelection(question);
          appendBotMessage(response.message);
          
          if (response.options && response.options.length > 0) {
            showSuggestedOptions(response.options);
          }
        }, 800);
      }, 100);
    });
  });

  // Back to welcome from chat
  if (backToWelcomeBtn) {
    backToWelcomeBtn.addEventListener('click', () => {
      if (chatPanel.classList.contains('active')) {
        chatPanel.classList.remove('active');
        welcomePanel.classList.add('active');
        lastOpenPanel = 'welcome';
        chatIcon.classList.add('active');
        toggleFaqButton();
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
    toggleFaqButton();
  });

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
  
    // Detectar finalización de conversación - MOSTRAR PANEL DE VALORACIÓN
    if (message.includes('no, gracias') || message.includes('nada más') || message.includes('no gracias') || 
        message.includes('no gracia') || message.includes('adios') || message.includes('adiós') || 
        message.includes('hasta luego') || message.includes('chao') || message.includes('bye')) {
      conversationActive = false;
      
      // Mostrar mensaje final
      appendBotMessage('¡Perfecto! Ha sido un placer ayudarte. Que tengas un excelente día.');
      
      // Mostrar panel de valoración después de un breve delay
      setTimeout(() => {
        showRatingPanel();
      }, 1500);
      
      return {
        message: '',
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
    
    // Finalizar conversación - MOSTRAR PANEL DE VALORACIÓN
    if (optionLower.includes('no, gracias') || optionLower.includes('nada más') || 
        optionLower.includes('no gracias') || optionLower.includes('adios') || 
        optionLower.includes('adiós') || optionLower.includes('hasta luego') || 
        optionLower.includes('chao') || optionLower.includes('bye')) {
      conversationActive = false;
      
      // Mostrar mensaje final
      appendBotMessage('¡Perfecto! Ha sido un placer ayudarte. Que tengas un excelente día.');
      
      // Mostrar panel de valoración después de un breve delay
      setTimeout(() => {
        showRatingPanel();
      }, 1500);
      
      return {
        message: 'Muchas gracias por usar el sistema de asistente virtual',
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

  sendBtn.addEventListener('click', () => {
    chatFaqPanel.classList.remove('active');
    sendMessage();
  });
  
  inputEl.addEventListener('keydown', (e) => { 
    if (e.key === 'Enter') {
      chatFaqPanel.classList.remove('active');
      sendMessage();
    } 
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

// Añadir event listeners para los botones de cierre - CON EVENT STOPPING
chatCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Detener la propagación del evento
  console.log('Chat close button clicked');
  closeAllPanels();
});

welcomeCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Detener la propagación del evento
  console.log('Welcome close button clicked');
  closeAllPanels(); // Esto debería abrir el confirmation panel
});

headerCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Detener la propagación del evento
  console.log('Header close button clicked');
  minimizePanels();
});

panelCloseBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // Detener la propagación del evento
  console.log('Panel close button clicked');
  closeAllPanels();
});

// También necesitamos prevenir que el clic en el botón de cerrar active el chat icon
chatIcon.addEventListener('click', (e) => {
  // Evitar que se active si se hace clic en el botón de cerrar
  if (e.target.closest('.chat-close-btn')) {
    e.stopPropagation();
    return;
  }
  
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
  toggleFaqButton();
});

// Inicializar
attachUserTypeHandlers();
toggleFaqButton();

// Asegurarse de que el botón FAQ esté oculto en móviles al cargar
if (window.innerWidth <= 600) {
  faqToggleBtn.style.display = 'none';
}

// Escuchar cambios de tamaño de ventana para ajustar el botón FAQ
window.addEventListener('resize', toggleFaqButton);
});