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
