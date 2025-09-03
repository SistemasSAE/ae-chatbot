// Variables globales para panel de valoración (definidas in `main.js`)
// ...existing code...

// Inicializar panel de valoración
function initRatingPanel() {
        console.debug('initRatingPanel called');
    ratingPanel = document.getElementById('ratingPanel');
    stars = document.querySelectorAll('.star');
    ratingComment = document.getElementById('ratingComment');
    submitRatingBtn = document.getElementById('submitRatingBtn');

    // Sistema de valoración por estrellas
        if (stars && stars.length > 0) {
            stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.getAttribute('data-value'));
            currentRating = value;
            
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
        }

    // Enviar valoración
        if (submitRatingBtn) {
            submitRatingBtn.addEventListener('click', () => {
        const comment = ratingComment.value.trim();
        
        console.log('Valoración:', {
            rating: currentRating,
            comment: comment
        });
        
        chatPanel.classList.remove('active');
        ratingPanel.classList.remove('active');
        if (faqToggleBtn) faqToggleBtn.style.display ='none';
        welcomePanel.classList.add('active');
        resetChatState();
    });
            console.debug('valoration: submit listener attached');
        }
}

// Función para mostrar panel de valoración (se define en main.js)