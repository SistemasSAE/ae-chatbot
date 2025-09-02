document.addEventListener('DOMContentLoaded', function() {
        const loginPanel = document.getElementById('loginPanel');
        const loginCloseBtn = document.getElementById('loginCloseBtn');
        const loginBtn = document.getElementById('loginBtn');
        const loginUser = document.getElementById('loginUser');
        const loginPassword = document.getElementById('loginPassword');
    
        // Función para abrir el panel de login (segura)
        window.openLoginPanel = function() {
            if (!loginPanel) return;
            loginPanel.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevenir scroll
    
            // Bloquear interacción con el chatbot
            const chatElements = document.querySelectorAll('.chat-panel, .welcome-panel, .chat-icon, .faq-toggle-btn');
            chatElements.forEach(el => {
                el.style.pointerEvents = 'none';
                el.style.opacity = '0.5';
            });
        };
        // Función para cerrar el panel de login (segura)
        window.closeLoginPanel = function() {
            if (!loginPanel) return;
            loginPanel.classList.remove('active');
            document.body.style.overflow = ''; // Restaurar scroll
    
            // Restaurar interacción con el chatbot
            const chatElements = document.querySelectorAll('.chat-panel, .welcome-panel, .chat-icon, .faq-toggle-btn');
            chatElements.forEach(el => {
                el.style.pointerEvents = '';
                el.style.opacity = '';
            });
        };
    
        const loginOpenBtn = document.getElementById('loginOpenBtn');
        if (loginOpenBtn) {
            loginOpenBtn.addEventListener('click', window.openLoginPanel);
        }
    
        // Cerrar panel al hacer clic en el botón de cerrar
        if (loginCloseBtn) loginCloseBtn.addEventListener('click', () => window.closeLoginPanel());
    
        // Cerrar panel al hacer clic fuera del contenido
        if (loginPanel) {
            loginPanel.addEventListener('click', function(e) {
                if (e.target === loginPanel) {
                    window.closeLoginPanel();
                }
            });
        }
    
        // Cargar el archivo user.json y configurar la validación
        fetch('user.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar las credenciales');
                }
                return response.json();
            })
            .then(userData => {
                console.log('Credenciales cargadas:', userData);
                
                // Manejar envío del formulario
                if (loginBtn) {
                    loginBtn.addEventListener('click', function(e) {
                        e.preventDefault();
    
                        const username = loginUser ? loginUser.value : '';
                        const password = loginPassword ? loginPassword.value : '';
    
                        // Validar credenciales
                        if (username === userData.user && password === userData.password) {
                            // Agregar clase active al botón de login
                            loginBtn.classList.add('active');
                            
                            alert('Inicio de sesión exitoso');
                            window.closeLoginPanel();
                            
                            // Aquí puedes agregar lógica adicional después del login exitoso
                            localStorage.setItem('isLoggedIn', 'true');
                            
                            // Quitar la clase active después de 2 segundos
                            setTimeout(() => {
                                loginBtn.classList.remove('active');
                            }, 2000);
                        } else {
                            alert('Credenciales incorrectas');
                            
                            // Efecto de shake para indicar error
                            loginPanel.classList.add('shake');
                            setTimeout(() => {
                                loginPanel.classList.remove('shake');
                            }, 500);
                        }
                    });
                }
            })
            .catch(error => {
                console.error('Error cargando user.json:', error);
                alert('Error al cargar el sistema de autenticación');
            });
    
        // Cerrar con la tecla Escape (seguro)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && loginPanel && loginPanel.classList.contains('active')) {
                window.closeLoginPanel();
            }
        });
    
        // También permitir enviar el formulario con la tecla Enter
        if (loginUser && loginPassword) {
            loginUser.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loginBtn.click();
                }
            });
            
            loginPassword.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    loginBtn.click();
                }
            });
        }
    });
    
    // Función global para abrir desde los botones FAQ
    function openLoginFromFAQ() {
        if (typeof openLoginPanel === 'function') {
            openLoginPanel();
        }
    }