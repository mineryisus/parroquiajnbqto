/**
 * PARROQUIA JESÚS DE NAZARET - SCRIPT PRINCIPAL (V3)
 * Navegación móvil, filtros, directorio de coordinadores, formulario y métricas.
 *
 * CONFIGURACIÓN CENTRAL:
 * - Cambia el número de WhatsApp y el enlace de Google Maps en SITE_CONFIG.
 * - Para conectar el formulario a un correo real, coloca la URL de Formspree
 *   (o de tu endpoint) en SITE_CONFIG.formEndpoint. Si queda vacía, el
 *   formulario envía el mensaje por WhatsApp al número configurado.
 */

const SITE_CONFIG = {
  parishName: 'Parroquia Jesús de Nazaret',
  whatsappNumber: '584168316724',
  whatsappDisplay: '0416-8316724',
  mapsUrl: 'https://maps.google.com/?cid=9239731275723414516&g_mp=CiVnb29nbGUubWFwcy5wbGFjZXMudjEuUGxhY2VzLkdldFBsYWNlEAMYASAF',
  // Ejemplo: 'https://formspree.io/f/abcdwxyz'
  formEndpoint: ''
};

document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.querySelector('.mobile-nav-toggle');
  const mainNav = document.querySelector('.main-navigation');

  const closeMobileNav = () => {
    if (!mobileToggle || !mainNav) return;
    mainNav.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    const icon = mobileToggle.querySelector('i');
    if (icon) {
      icon.classList.remove('fa-xmark');
      icon.classList.add('fa-bars');
    }
  };

  // 1. Navegación móvil accesible (toggle, Escape y clic fuera)
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.classList.toggle('menu-open', isOpen);

      const icon = mobileToggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('fa-bars', !isOpen);
        icon.classList.toggle('fa-xmark', isOpen);
      }

      if (isOpen) {
        mainNav.querySelector('.nav-link')?.focus();
      } else {
        mobileToggle.focus();
      }
    });

    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMobileNav);
    });

    document.querySelectorAll('.mobile-nav-close').forEach(closeBtn => {
      closeBtn.addEventListener('click', () => {
        closeMobileNav();
        mobileToggle.focus();
      });
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && mainNav.classList.contains('is-open')) {
        closeMobileNav();
        mobileToggle.focus();
      }
    });

    document.addEventListener('click', event => {
      if (
        mainNav.classList.contains('is-open') &&
        !mainNav.contains(event.target) &&
        !mobileToggle.contains(event.target)
      ) {
        closeMobileNav();
      }
    });
  }

  // 2. Cabecera fija con sombra al hacer scroll
  const siteHeader = document.querySelector('.site-header');
  if (siteHeader) {
    const updateHeader = () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 20);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    // Mantiene el menú móvil justo debajo de la cabecera real.
    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--site-header-height',
        `${siteHeader.offsetHeight}px`
      );
    };
    syncHeaderHeight();
    window.addEventListener('resize', syncHeaderHeight);
    if ('ResizeObserver' in window) {
      new ResizeObserver(syncHeaderHeight).observe(siteHeader);
    }
  }

  // 3. Filtros interactivos en la página de Grupos Parroquiales
  const filterBtns = document.querySelectorAll('.filter-btn');
  const groupCards = document.querySelectorAll('.group-detailed-card');

  if (filterBtns.length > 0 && groupCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        const filterValue = btn.getAttribute('data-filter');

        groupCards.forEach(card => {
          const category = card.getAttribute('data-category');
          const matches =
            filterValue === 'all' ||
            category === filterValue ||
            category?.includes(filterValue);

          if (matches) {
            card.style.display = 'grid';
            requestAnimationFrame(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          } else {
            card.style.opacity = '0';
            card.style.transform = 'translateY(15px)';
            window.setTimeout(() => {
              card.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // 4. Directorio desplegable de coordinadores (página de Contacto)
  // DATOS EDITABLES: cuando la parroquia autorice los datos personales,
  // agrega a cada grupo los campos `telefono` y `whatsapp` (formato internacional
  // sin + ni espacios, por ejemplo '584141234567'). Si no existen, se usa el
  // teléfono del despacho configurado en SITE_CONFIG.
  const coordinadoresData = {
    huellas: {
      nombre: 'Movimiento Juvenil Huellas',
      coordinador: 'César Meléndez',
      etiqueta: 'Coordinador',
      telefono: '0414-5657512',
      whatsapp: '584145657512',
      area: 'Pastoral Juvenil y Liderazgo',
      reunion: 'Sábados 3:00 PM',
      lugar: 'Salones Pastorales',
      icono: 'fa-shoe-prints',
      descripcion: 'Acompañamiento a adolescentes y jóvenes en formación de liderazgo cristiano con espiritualidad ignaciana, campamentos y servicio comunitario.'
    },
    ejc: {
      nombre: 'EJC (Encuentro de Jóvenes con Cristo)',
      coordinador: 'Coordinación Pastoral EJC',
      area: 'Evangelización Juvenil y Retiros',
      reunion: 'Sábados 4:30 PM',
      lugar: 'Salón Múltiple Parroquial',
      icono: 'fa-fire',
      descripcion: 'Espacio de espiritualidad, amistad y encuentro vivo con Jesucristo mediante retiros, dinámicas y perseverancia juvenil.'
    },
    catequesis: {
      nombre: 'Ministerio de Catequesis Parroquial',
      coordinador: 'Coordinación de Catequistas Parroquiales',
      area: 'Sacramentos e Iniciación Cristiana',
      reunion: 'Sábados 9:00 AM - 11:30 AM',
      lugar: 'Aulas de Formación',
      icono: 'fa-book-bible',
      descripcion: 'Instrucción de fe y preparación doctrinal para Bautismos, Primera Comunión, Confirmación y formación de adultos.'
    },
    misericordia: {
      nombre: 'Ministerio de la Misericordia',
      coordinador: 'Equipo de Pastoral Social',
      area: 'Caridad y Acompañamiento Comunitario',
      reunion: 'Jornadas semanales y mensuales',
      lugar: 'Centro Parroquial de Asistencia',
      icono: 'fa-hand-holding-heart',
      descripcion: 'Atención caritativa a familias vulnerables, ollas solidarias comunitarias, entrega de medicamentos y visitas a enfermos.'
    },
    musica: {
      nombre: 'Pastoral de Música',
      coordinador: 'Dirección de Coros Litúrgicos',
      area: 'Animación Litúrgica y Canto Sacro',
      reunion: 'Jueves 6:30 PM (Ensayos)',
      lugar: 'Coro del Templo Parroquial',
      icono: 'fa-music',
      descripcion: 'Músicos y cantores que solemnizan las celebraciones eucarísticas, orando a través de la alabanza y la música sacra.'
    },
    sembradores: {
      nombre: 'Sembradores de Alegría',
      coordinador: 'Coordinación de Ecología Parroquial',
      area: 'Cuidado de Áreas Verdes y Medio Ambiente',
      reunion: 'Sábados 8:30 AM',
      lugar: 'Jardines y Espacios Verdes del Templo',
      icono: 'fa-leaf',
      descripcion: 'Grupo dedicado al embellecimiento, siembra, mantenimiento y protección de las áreas verdes y jardines de nuestra parroquia, promoviendo el cuidado de la casa común.'
    },
    infancia: {
      nombre: 'Escuela de Infancia Misionera',
      coordinador: 'Equipo de Formación de Infancia Misionera',
      area: 'Pastoral y Misión con los Niños',
      reunion: 'Sábados 10:00 AM',
      lugar: 'Patio Parroquial',
      icono: 'fa-children',
      descripcion: 'Espacio formativo y evangelizador para los niños de la parroquia, promoviendo valores cristianos, juegos y solidaridad con niños de todo el mundo.'
    },
    legion: {
      nombre: 'Legión de María',
      coordinador: 'Presidium Parroquial',
      area: 'Apostolado y Oración Mariana',
      reunion: 'Martes 4:00 PM',
      lugar: 'Capilla del Santísimo',
      icono: 'fa-hands-praying',
      descripcion: 'Rezo del Santo Rosario, apostolado mariano, visitas domiciliarias y consuelo espiritual a familias y ancianos de la comunidad.'
    },
    ceb: {
      nombre: 'Comunidades Eclesiales de Base (CEBs)',
      coordinador: 'Coordinación Pastoral de Sectores',
      area: 'Comunidades Vecinales de Fe',
      reunion: 'Quincenal en los Sectores',
      lugar: 'Hogares y Sectores Parroquiales',
      icono: 'fa-house-chimney-window',
      descripcion: 'Encuentros de reflexión de la Palabra de Dios y ayuda fraterna entre vecinos de cada sector parroquial.'
    },
    emc: {
      nombre: 'EMC (Encuentro de Matrimonio con Cristo)',
      coordinador: 'Equipo Coordinador de Matrimonios',
      area: 'Pastoral Familiar y Conyugal',
      reunion: 'Viernes (mensual) 7:00 PM',
      lugar: 'Salón San Ignacio',
      icono: 'fa-ring',
      descripcion: 'Encuentros y retiros vivenciales para parejas casadas, fortaleciendo el diálogo, el perdón y el sacramento del matrimonio.'
    },
    consejo: {
      nombre: 'Consejo Parroquial de Asuntos Económicos',
      coordinador: 'Secretaría del Consejo Económico',
      area: 'Administración y Transparencia',
      reunion: 'Sesiones mensuales programadas',
      lugar: 'Despacho Parroquial',
      icono: 'fa-scale-balanced',
      descripcion: 'Órgano consultivo de corresponsabilidad que supervisa la administración responsable de los recursos de la parroquia.'
    },
    uspd: {
      nombre: 'USPD (Una Sonrisa Para Dios)',
      coordinador: 'Coordinación USPD',
      area: 'Servicio Pastoral y Alegría Cristiana',
      reunion: 'Sábados quincenales',
      lugar: 'Salón Pastoral',
      icono: 'fa-face-smile',
      descripcion: 'Grupo pastoral enfocado en llevar alegría, servicio fraterno y entusiasmo cristiano en las diversas actividades y encuentros parroquiales.'
    }
  };

  const buildWhatsAppUrl = (text, phone = SITE_CONFIG.whatsappNumber) =>
    `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

  const selectGrupo = document.getElementById('selectGrupoCoordinador');
  const coordDisplay = document.getElementById('coordinatorDisplay');

  if (selectGrupo && coordDisplay) {
    const updateCoordinatorCard = key => {
      const data = coordinadoresData[key];
      if (!data) return;

      const phoneDisplay = data.telefono || SITE_CONFIG.whatsappDisplay;
      const phoneNumber = data.whatsapp || SITE_CONFIG.whatsappNumber;
      const whatsappUrl = buildWhatsAppUrl(
        `Hola, deseo unirme al grupo pastoral ${data.nombre}. ¿Me pueden dar más información?`,
        phoneNumber
      );

      coordDisplay.innerHTML = `
        <div class="coordinator-avatar-badge">
          <i class="fa-solid ${data.icono}"></i>
        </div>
        <div class="coordinator-details-content">
          <span class="coordinator-role-tag">${data.area}</span>
          <h3>${data.nombre}</h3>
          <p style="color: #c4d4e7; font-size: 0.95rem; line-height: 1.6; margin-bottom: 0.75rem;">
            ${data.descripcion}
          </p>
          <div class="coordinator-meta-grid">
            <div class="coordinator-meta-item">
              <i class="fa-solid fa-user-tie"></i>
              <span><strong>${data.etiqueta || 'Coordinación'}:</strong> ${data.coordinador}</span>
            </div>
            <div class="coordinator-meta-item">
              <i class="fa-solid fa-phone"></i>
              <span><strong>Teléfono / WhatsApp:</strong> <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">${phoneDisplay}</a></span>
            </div>
            <div class="coordinator-meta-item">
              <i class="fa-regular fa-clock"></i>
              <span><strong>Encuentros:</strong> ${data.reunion}</span>
            </div>
            <div class="coordinator-meta-item">
              <i class="fa-solid fa-location-dot"></i>
              <span><strong>Lugar:</strong> ${data.lugar}</span>
            </div>
          </div>
          <div class="coordinator-actions">
            <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-sm">
              <i class="fa-brands fa-whatsapp"></i> Quiero unirme a este grupo
            </a>
            <a href="#contactForm" class="btn btn-outline-white btn-sm" onclick="prepararMensajeGrupo('${data.nombre.replace(/'/g, "\\'")}')">
              <i class="fa-regular fa-paper-plane"></i> Enviar mensaje
            </a>
          </div>
        </div>
      `;
    };

    selectGrupo.addEventListener('change', event => {
      updateCoordinatorCard(event.target.value);
    });

    updateCoordinatorCard(selectGrupo.value || 'huellas');
  }

  // 5. Formulario de contacto: endpoint real o envío por WhatsApp
  const contactForm = document.getElementById('contactForm');
  const formAlert = document.getElementById('formAlert');

  const showFormAlert = (message, type = 'success') => {
    if (!formAlert) return;
    formAlert.className = `form-alert ${type}`;
    formAlert.innerHTML = message;
    formAlert.style.display = 'block';
    formAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const setSubmitting = (submitting, originalText) => {
    const submitBtn = contactForm?.querySelector('button[type="submit"]');
    if (!submitBtn) return;
    submitBtn.disabled = submitting;
    submitBtn.innerHTML = submitting
      ? '<i class="fa-solid fa-spinner fa-spin"></i> Preparando mensaje...'
      : originalText;
  };

  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();

      const name = document.getElementById('nombre')?.value.trim();
      const phone = document.getElementById('telefono')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const subjectSelect = document.getElementById('asunto');
      const subject = subjectSelect?.value;
      const subjectText = subjectSelect?.selectedOptions?.[0]?.textContent?.trim() || subject;
      const message = document.getElementById('mensaje')?.value.trim();
      const privacy = document.getElementById('privacidad');

      if (!name || !phone || !subject || !message) {
        showFormAlert(
          '<strong><i class="fa-solid fa-circle-exclamation"></i> Faltan datos obligatorios.</strong><br>Completa nombre, teléfono, motivo y mensaje.',
          'error'
        );
        return;
      }

      if (privacy && !privacy.checked) {
        showFormAlert(
          '<strong><i class="fa-solid fa-circle-exclamation"></i> Falta tu aceptación.</strong><br>Debes leer y aceptar el Aviso de Privacidad para enviar el mensaje.',
          'error'
        );
        privacy.focus();
        return;
      }

      const payload = {
        nombre: name,
        telefono: phone,
        email: email || 'No indicado',
        asunto: subjectText,
        mensaje: message
      };

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : 'Enviar Mensaje';

      if (SITE_CONFIG.formEndpoint) {
        setSubmitting(true, originalText);

        fetch(SITE_CONFIG.formEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify(payload)
        })
          .then(response => {
            if (!response.ok) throw new Error(`Error ${response.status}`);
            showFormAlert(
              `<strong><i class="fa-solid fa-circle-check"></i> ¡Mensaje enviado con éxito!</strong><br>Gracias ${name}, tu mensaje fue recibido por el equipo parroquial. Nos pondremos en contacto contigo a la brevedad.`,
              'success'
            );
            contactForm.reset();
          })
          .catch(() => {
            const fallbackUrl = buildWhatsAppUrl(
              `Hola, soy ${name}. ${message}\n\nTeléfono: ${phone}\nCorreo: ${email || 'No indicado'}\nMotivo: ${subjectText}`
            );
            showFormAlert(
              `<strong><i class="fa-solid fa-triangle-exclamation"></i> No se pudo enviar por el formulario.</strong><br>Puedes enviar tu mensaje directamente por WhatsApp: <a href="${fallbackUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: 700;">Abrir WhatsApp</a>.`,
              'error'
            );
          })
          .finally(() => {
            setSubmitting(false, originalText);
          });
      } else {
        const whatsappUrl = buildWhatsAppUrl(
          `Hola, soy ${name}. ${message}\n\nTeléfono: ${phone}\nCorreo: ${email || 'No indicado'}\nMotivo: ${subjectText}`
        );

        const whatsappWindow = window.open(whatsappUrl, '_blank', 'noopener');

        showFormAlert(
          `<strong><i class="fa-solid fa-circle-check"></i> Mensaje preparado para WhatsApp.</strong><br>Gracias ${name}. ${
            whatsappWindow
              ? 'Se abrió WhatsApp en una nueva pestaña para completar el envío.'
              : 'Tu navegador bloqueó la ventana emergente.'
          } También puedes usar este enlace: <a href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" style="text-decoration: underline; font-weight: 700;">abrir WhatsApp</a>.`,
          'success'
        );

        contactForm.reset();
      }
    });
  }

  // 6. Animación de conteo para los datos comunitarios verificables
  const statNumbers = document.querySelectorAll('.stat-number');
  let hasAnimatedStats = false;

  const animateStats = () => {
    if (hasAnimatedStats) return;

    statNumbers.forEach(stat => {
      const targetStr = stat.getAttribute('data-target');
      if (!targetStr) return;

      const target = parseInt(targetStr, 10);
      const prefix = stat.getAttribute('data-prefix') || '';
      const suffix = stat.getAttribute('data-suffix') || '';
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const counter = window.setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          window.clearInterval(counter);
        }
        stat.textContent = `${prefix}${current.toLocaleString('es-VE')}${suffix}`;
      }, 30);
    });

    hasAnimatedStats = true;
  };

  const statsSection = document.querySelector('.stats-counter-bar');
  if (statsSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) animateStats();
        });
      },
      { threshold: 0.3 }
    );
    observer.observe(statsSection);
  } else {
    animateStats();
  }
});

/**
 * Rellena el formulario de contacto cuando el visitante pulsa
 * "Enviar mensaje" desde el directorio de coordinadores.
 */
function prepararMensajeGrupo(nombreGrupo) {
  const selectAsunto = document.getElementById('asunto');
  const txtMensaje = document.getElementById('mensaje');

  if (selectAsunto) {
    selectAsunto.value = 'grupos';
  }

  if (txtMensaje) {
    txtMensaje.value = `Hola, deseo unirme al grupo pastoral: ${nombreGrupo}. ¿Me pueden dar más información?`;
    txtMensaje.focus();
  }
}
