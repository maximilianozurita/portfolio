// ===== THEME =====
function syncThemeButtons() {
  const isLight = document.body.classList.contains('light-mode');
  document.getElementById('seg-dark').classList.toggle('active', !isLight);
  document.getElementById('seg-light').classList.toggle('active', isLight);
}

(function initTheme() {
  const saved = localStorage.getItem('theme');
  const useDark = saved ? saved === 'dark' : true;
  if (!useDark) document.body.classList.add('light-mode');
  syncThemeButtons();
})();

document.getElementById('seg-dark').addEventListener('click', () => {
  document.body.classList.remove('light-mode');
  localStorage.setItem('theme', 'dark');
  syncThemeButtons();
});

document.getElementById('seg-light').addEventListener('click', () => {
  document.body.classList.add('light-mode');
  localStorage.setItem('theme', 'light');
  syncThemeButtons();
});

// ===== UI STRINGS =====
const UI_STRINGS = {
  es: {
    sections: {
      summary: 'Resumen',
      experience: 'Experiencia',
      skills: 'Skills Técnicos',
      education: 'Educación',
      certifications: 'Certificaciones',
    },
    sidebar: {
      location: 'Ubicación',
      languages: 'Idiomas',
      softSkills: 'Soft Skills',
    },
    exp: {
      technologies: 'Tecnologías',
      responsibilities: 'Responsabilidades',
      achievements: 'Logros',
      showMore: 'Ver más',
      showLess: 'Ver menos',
    },
    cert: { viewCert: 'Ver certificado ↗' },
    categories: {
      programming_languages: 'Lenguajes',
      data_engineering: 'Data Engineering',
      backend: 'Backend',
      databases: 'Bases de datos',
      tools: 'Herramientas',
      methodologies: 'Metodologías',
    },
    langBtn: 'EN',
  },
  en: {
    sections: {
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Technical Skills',
      education: 'Education',
      certifications: 'Certifications',
    },
    sidebar: {
      location: 'Location',
      languages: 'Languages',
      softSkills: 'Soft Skills',
    },
    exp: {
      technologies: 'Technologies',
      responsibilities: 'Responsibilities',
      achievements: 'Achievements',
      showMore: 'Show more',
      showLess: 'Show less',
    },
    cert: { viewCert: 'View certificate ↗' },
    categories: {
      programming_languages: 'Languages',
      data_engineering: 'Data Engineering',
      backend: 'Backend',
      databases: 'Databases',
      tools: 'Tools',
      methodologies: 'Methodologies',
    },
    langBtn: 'ES',
  },
};

// ===== LANGUAGE =====
let currentLang = localStorage.getItem('lang') || 'es';

function syncLangButtons() {
  document.getElementById('seg-es').classList.toggle('active', currentLang === 'es');
  document.getElementById('seg-en').classList.toggle('active', currentLang === 'en');
}

function updateStaticUI(lang) {
  const ui = UI_STRINGS[lang];
  document.documentElement.lang = lang;
  document.getElementById('title-summary').textContent = ui.sections.summary;
  document.getElementById('title-experience').textContent = ui.sections.experience;
  document.getElementById('title-skills').textContent = ui.sections.skills;
  document.getElementById('title-education').textContent = ui.sections.education;
  document.getElementById('title-certifications').textContent = ui.sections.certifications;
  document.getElementById('sidebar-label-location').textContent = ui.sidebar.location;
  document.getElementById('sidebar-label-languages').textContent = ui.sidebar.languages;
  document.getElementById('sidebar-label-softskills').textContent = ui.sidebar.softSkills;
  syncLangButtons();
}

// ===== RENDER FUNCTIONS =====

function renderSidebar(data) {
  const info = data.personal_info;

  document.getElementById('name').textContent = info.full_name;
  document.getElementById('location').textContent = info.location;

  if (data.experience && data.experience.length > 0) {
    const latest = data.experience[0];
    document.getElementById('current-role').textContent =
      `${latest.role} @ ${latest.company}`;
  }

  const contacts = document.getElementById('contact-links');
  const links = [
    { icon: '✉', label: info.email, href: `mailto:${info.email}` },
    { icon: '☏', label: info.phone, href: `tel:${info.phone.replace(/\s/g, '')}` },
    { icon: '⚑', label: 'LinkedIn', href: `https://${info.linkedin}`, target: '_blank' },
  ];
  contacts.innerHTML = links.map(l => `
    <a class="contact-link" href="${l.href}"${l.target ? ' target="_blank" rel="noopener"' : ''}>
      <span class="contact-icon">${l.icon}</span>
      <span>${l.label}</span>
    </a>
  `).join('');

  const langsEl = document.getElementById('languages');
  langsEl.innerHTML = (data.languages || []).map(l => `
    <div class="lang-item">
      <span>${l.language}</span>
      <span class="lang-level">${l.level}</span>
    </div>
  `).join('');

  const ssEl = document.getElementById('soft-skills');
  ssEl.innerHTML = (data.soft_skills || []).map(s =>
    `<span class="tag">${s}</span>`
  ).join('');
}

function renderSummary(data) {
  document.getElementById('summary').textContent =
    data.summary_base || data.personal_info?.summary || '';
}

function renderExperience(data) {
  const ui = UI_STRINGS[currentLang];
  const container = document.getElementById('experience-list');
  container.innerHTML = (data.experience || []).map((exp, idx) => {
    const techTags = (exp.technologies || []).map(t =>
      `<span class="tag">${t}</span>`
    ).join('');

    const responsibilities = (exp.responsibilities || []).map(r =>
      `<li>${r}</li>`
    ).join('');

    const achievements = (exp.achievements || []).map(a =>
      `<li>${a}</li>`
    ).join('');

    const respId = `resp-${idx}`;
    const fadeId = `fade-${idx}`;
    const btnId = `btn-${idx}`;

    return `
      <div class="exp-card">
        <div class="exp-header">
          <span class="exp-role">${exp.role}</span>
          <span class="exp-dates">${exp.start_date} — ${exp.end_date}</span>
        </div>
        <div class="exp-company">${exp.company}</div>
        <p class="exp-description">${exp.description}</p>

        ${techTags ? `
          <div class="exp-subsection-title">${ui.exp.technologies}</div>
          <div class="tags" style="margin-bottom:16px">${techTags}</div>
        ` : ''}

        ${responsibilities ? `
          <div class="exp-subsection-title">${ui.exp.responsibilities}</div>
          <div style="position:relative">
            <ul class="exp-responsibilities" id="${respId}">${responsibilities}</ul>
            <div class="exp-fade" id="${fadeId}"></div>
          </div>
          <button class="show-more-btn" id="${btnId}" onclick="toggleResp('${respId}','${fadeId}','${btnId}')">
            ${ui.exp.showMore}
          </button>
        ` : ''}

      </div>
    `;
  }).join('');
}

window.toggleResp = function(listId, fadeId, btnId) {
  const ui = UI_STRINGS[currentLang];
  const list = document.getElementById(listId);
  const fade = document.getElementById(fadeId);
  const btn = document.getElementById(btnId);
  const expanded = list.classList.toggle('expanded');
  fade.style.display = expanded ? 'none' : '';
  btn.textContent = expanded ? ui.exp.showLess : ui.exp.showMore;
};

function renderSkills(data) {
  const ui = UI_STRINGS[currentLang];
  const container = document.getElementById('skills-grid');
  const skills = data.technical_skills || {};
  container.innerHTML = Object.entries(skills).map(([key, values]) => `
    <div class="skill-card">
      <div class="skill-category">${ui.categories[key] || key}</div>
      <div class="skill-tags">
        ${values.map(v => `<span class="skill-tag">${v}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function renderEducation(data) {
  const container = document.getElementById('education-list');
  container.innerHTML = (data.education || []).map(edu => `
    <div class="edu-card">
      <div>
        <div class="edu-degree">${edu.degree}</div>
        <div class="edu-institution">${edu.institution}</div>
      </div>
      <div class="edu-year">${edu.end_date}</div>
    </div>
  `).join('');
}

function renderCertifications(data) {
  const ui = UI_STRINGS[currentLang];
  const container = document.getElementById('certifications-list');
  container.innerHTML = `<div class="cert-list">` +
    (data.certifications || []).map(cert => `
      <div class="cert-card">
        <div class="cert-name">${cert.name}</div>
        <div class="cert-issuer">${cert.issuer}</div>
        ${cert.credential_url
          ? `<a class="cert-link" href="${cert.credential_url}" target="_blank" rel="noopener">
               ${ui.cert.viewCert}
             </a>`
          : ''
        }
      </div>
    `).join('') + `</div>`;
}

function renderAll(data) {
  updateStaticUI(currentLang);
  renderSidebar(data);
  renderSummary(data);
  renderExperience(data);
  renderSkills(data);
  renderEducation(data);
  renderCertifications(data);
}

// ===== LOAD DATA =====
function loadData(lang) {
  const file = lang === 'en' ? 'candidate_data_en.json' : 'candidate_data.json';
  fetch(file)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => renderAll(data))
    .catch(err => {
      console.error('Error loading data:', err);
      document.getElementById('main-content').innerHTML =
        `<div style="padding:40px;color:var(--accent)">
          Error cargando datos. Asegurate de servir el sitio con un servidor HTTP.<br>
          <code style="font-size:13px;color:var(--text-muted)">python3 -m http.server 8080</code>
         </div>`;
    });
}

// ===== LANG TOGGLE =====
document.getElementById('seg-es').addEventListener('click', () => {
  if (currentLang === 'es') return;
  currentLang = 'es';
  localStorage.setItem('lang', currentLang);
  loadData(currentLang);
});

document.getElementById('seg-en').addEventListener('click', () => {
  if (currentLang === 'en') return;
  currentLang = 'en';
  localStorage.setItem('lang', currentLang);
  loadData(currentLang);
});

// ===== INIT =====
loadData(currentLang);
