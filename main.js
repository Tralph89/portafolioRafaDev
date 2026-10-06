const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function () {
        navLinks.forEach(item => item.classList.remove('active'));
        this.classList.add('active');
    });
});

// Esperar a que el HTML esté completamente cargado antes de ejecutar cosas
document.addEventListener('DOMContentLoaded', () => {
    /* ====================================================================
       1. FILTRO DE PROYECTOS
       ==================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');
            // Función que hace el cambio brusco (ocultar/mostrar)
            const updateGrid = () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');

                    // Nos aseguramos de quitar cualquier opacidad o transformación previa
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            };
            // Aquí ocurre la magia: Invocamos la API nativa de animaciones
            if (document.startViewTransition) {
                document.startViewTransition(updateGrid);
            } else {
                // Si alguien usa un navegador muy viejo, funcionará normal
                updateGrid();
            }
        });
    });

    /* ====================================================================
       2. MODAL DE PROYECTOS (CERRAR LA VENTANA)
       ==================================================================== */
    const projectModal = document.getElementById('projectModal');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    // Función para cerrar el modal
    const closeModal = () => {
        projectModal.classList.remove('open');
        document.body.style.overflow = ''; // Devolverle el scroll a la página
    };
    // Cerrar al hacer clic en el botón de la (X)
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    // Cerrar al hacer clic en el fondo oscuro
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }
    // Cerrar si el usuario presiona la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('open')) {
            closeModal();
        }
    });

    /* ====================================================================
       3. COPIAR CORREO AL PORTAPAPELES
       ==================================================================== */
    const btnCopyEmail = document.getElementById('btnCopyEmail');
    const emailText = document.getElementById('emailText');

    if (btnCopyEmail && emailText) {
        btnCopyEmail.addEventListener('click', () => {
            // navigator.clipboard es la API moderna de Javascript para el portapapeles
            navigator.clipboard.writeText(emailText.textContent).then(() => {
                // Guardamos el HTML original para volver a él después
                const originalHTML = btnCopyEmail.innerHTML;
                
                // Cambiamos a estado de "Éxito"
                btnCopyEmail.innerHTML = '<i class="fa-solid fa-check"></i><span>¡Copiado!</span>';
                btnCopyEmail.style.background = 'rgba(34, 197, 94, 0.2)'; // Verde transparente
                btnCopyEmail.style.borderColor = 'rgba(34, 197, 94, 0.5)';
                btnCopyEmail.style.color = '#22c55e'; // Letra verde
                
                // setTimeout es un temporizador. Regresa el botón a la normalidad en 2 segundos (2000ms)
                setTimeout(() => {
                    btnCopyEmail.innerHTML = originalHTML;
                    btnCopyEmail.style = ''; // Borra los estilos en línea aplicados
                }, 2000);
            }).catch(err => {
                console.error('Error al copiar el texto: ', err);
            });
        });
    }

    /* ====================================================================
       4. VALIDACIÓN Y ENVÍO DE FORMULARIO CON EMAILJS
       ==================================================================== */
    // ====> ¡SOLO TE FALTA LA PUBLIC KEY! <====
    const EMAILJS_PUBLIC_KEY = 'W6HvXEV5Keyy_CvIV'; 
    const EMAILJS_SERVICE_ID = 'service_jthmjhr'; // El que tienes conectado a Gmail
    const EMAILJS_TEMPLATE_ID = 'template_tbdsizi'; // El que acabas de crear

    // Inicializamos EmailJS con tu Public Key
    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault(); 

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            if (name && email && subject && message) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                
                // Cambiamos a estado "Enviando..."
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Enviando...';
                submitBtn.disabled = true;

                // Las variables que pusimos en tu plantilla de EmailJS
                const templateParams = {
                    from_name: name,
                    reply_to: email,
                    subject: subject,
                    message: message
                };

                // Enviamos el correo 
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                    .then((response) => {
                        console.log('ÉXITO!', response.status, response.text);
                        submitBtn.innerHTML = '<i class="fa-solid fa-check"></i> Mensaje Enviado';
                        submitBtn.style.background = '#22c55e';
                        submitBtn.style.borderColor = '#22c55e';
                        
                        contactForm.reset(); 
                    })
                    .catch((error) => {
                        console.error('ERROR AL ENVIAR...', error);
                        submitBtn.innerHTML = '<i class="fa-solid fa-xmark"></i> Error al Enviar';
                        submitBtn.style.background = '#ef4444';
                        submitBtn.style.borderColor = '#ef4444';
                    })
                    .finally(() => {
                        setTimeout(() => {
                            submitBtn.innerHTML = originalBtnText;
                            submitBtn.style.background = '';
                            submitBtn.style.borderColor = '';
                            submitBtn.disabled = false;
                        }, 3000);
                    });

            } else {
                alert('Por favor, completa todos los campos.');
            }
        });
    }
}); // Fin del DOMContentLoaded
/* ====================================================================
   3. MODAL DE PROYECTOS (ABRIR Y CARGAR DATOS)
   ==================================================================== */
// Nuestra "Base de Datos" para las tarjetas
const projectDetails = {
    1: {
        title: "Proyecto en Desarrollo 1",
        category: "E-Commerce",
        description: "Este es un espacio reservado para mi primer gran proyecto práctico. Actualmente me encuentro trabajando en él aplicando las mejores prácticas de diseño y desarrollo web.",
        problem: "Construir una plataforma visualmente atractiva utilizando únicamente tecnologías frontend modernas sin depender de plantillas prefabricadas.",
        solution: "Implementación de una arquitectura modular basada en CSS Grid, variables CSS dinámicas y manipulación del DOM con Vanilla JavaScript.",
        stack: ["HTML5", "CSS3 Glassmorphism", "Vanilla JS"],
        codeUrl: ""
    },
    2: {
        title: "Proyecto en Desarrollo 2",
        category: "Aplicación Web",
        description: "Espacio reservado para mi segunda aplicación web. En este proyecto me enfocaré en la interacción avanzada con el usuario y lógica de negocio.",
        problem: "Manejar estructuras de datos complejas y actualizar el estado de la aplicación en tiempo real para ofrecer una experiencia fluida.",
        solution: "Uso de arreglos y objetos avanzados en JS, junto con actualización selectiva de nodos en el DOM para optimizar el rendimiento.",
        stack: ["JavaScript ES6", "Lógica de Datos", "Responsive Design"],
        codeUrl: ""
    },
    3: {
        title: "Proyecto en Desarrollo 3",
        category: "Diseño Web",
        description: "Mi tercer espacio de proyecto, enfocado en dominar CSS moderno, animaciones fluidas y accesibilidad web.",
        problem: "Crear una interfaz altamente interactiva que sea usable tanto en computadoras de escritorio como en dispositivos móviles.",
        solution: "Diseño 'Mobile-First' y uso intensivo de variables CSS para facilitar cambios de tema y adaptación de tamaños.",
        stack: ["HTML5", "CSS3 Animations", "Diseño UX/UI"],
        codeUrl: ""
    }
};
// Esta función debe quedar AFUERA del DOMContentLoaded porque la llamamos 
// directamente desde el HTML con 'onclick="openProjectModal(1)"'
window.openProjectModal = function (projectId) {
    const data = projectDetails[projectId];
    if (!data) return; // Si no hay datos, no hacer nada
    // Inyectar los datos en el HTML del Modal
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalProblem').textContent = data.problem;
    document.getElementById('modalSolution').textContent = data.solution;

    const modalCodeLink = document.getElementById('modalCodeLink');
    if (data.codeUrl !== "") {
        modalCodeLink.href = data.codeUrl;
        modalCodeLink.style.display = 'inline-flex'; // O el display que tenga
    } else {
        modalCodeLink.style.display = 'none'; // Ocultar si está vacío
    }

    // Cargar las etiquetas (tecnologías)
    const modalStack = document.getElementById('modalStack');
    modalStack.innerHTML = ''; // Limpiar anteriores
    data.stack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'project-tag';
        span.textContent = tech;
        modalStack.appendChild(span);
    });
    // Mostrar el modal
    const projectModal = document.getElementById('projectModal');
    projectModal.classList.add('open');

    // Evitar que la página de fondo siga haciendo scroll mientras el modal esté abierto
    document.body.style.overflow = 'hidden';
};
