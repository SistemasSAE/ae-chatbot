// Funciones de respuesta del bot
const generateBotResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Si la conversación está cerrada pero el usuario escribe
    if (conversationActive===false) {
        return {
            message: 'La conversación ha finalizado. ¿Deseas comenzar una nueva?',
            options: ['Sí, nueva consulta', 'No, gracias']
        };
    }
    else if (conversationActive=== true) {
        // Manejo de tipo de usuario
        if (!firstSelectionMade && (message.includes('representante') || message.includes('estudiante') || message.includes('profesor'))) {
            firstSelectionMade = true;
            currentUserType = message.includes('representante') ? 'Representante' : 
                            message.includes('estudiante') ? 'Estudiante' : 'Profesor';
            if (floatingMsg) floatingMsg.classList.remove('active');
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
                message: 'Si deseas abrir otra conversación por favor escribe "Necesito más ayuda" o seleccione el botón que se muestra a continuación, si no cierre el chat si ya termino de consultar.',
                options: ['Necesito más ayuda']
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
        // Pregunta sobre profesores y notas - DETECCIÓN MEJORADA
        if (message.includes('profesor') && (message.includes('nota') || message.includes('subir') || message.includes('cargar'))) {
            return {
                message: 'Ingresar al acceso del plantel; estando allí, dirigirse al menú de configuración (donde está el nombre de la institución), dar clic en la opción 1, datos de la institución, y luego ubicarse en los campos "USUARIO" y "CONTRASEÑA". Una vez que ya esté modificado, dar clic en guardar.',
                options: ['Necesito más ayuda']
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
};

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
            options: ['Recuperar Contraseña', 'Crear Cuña', 'Problemas de Acceso']
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
    // Solicitud de cupo
    else if (optionLower.includes('por qué los profesores no pueden cargar notas') || optionLower.includes('Por qué los profesores no pueden cargar notas')) {
        return {
            message: 'Ingresar al acceso del plantel; estando allí, dirigirse al menú de configuración (donde está el nombre de la institución), dar clic en la opción 1, datos de la institución, y luego ubicarse en los campos "USUARIO" y "CONTRASEÑA". Una vez que ya esté modificado, dar clic en guardar.',
            options: ['Necesito más ayuda']
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