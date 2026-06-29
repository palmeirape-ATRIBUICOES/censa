/* 
=========================================
  CENSA Portal & Management App JavaScript Engine
  LocalStorage Database & Unified Dashboards Logic
=========================================
*/

// --- 1. DEFAULT DATA INITIALIZATION ---
const DEFAULT_STUDENTS = [
  {
    id: "202601",
    name: "Thiago Alves de Souza",
    cpf: "123.456.789-00",
    class: "Ensino Médio - 2º Ano",
    grades: {
      "Matemática": { b1: 8.5, b2: 9.0, faltas: 2 },
      "Português": { b1: 7.0, b2: 8.5, faltas: 1 },
      "Física": { b1: 9.2, b2: 9.5, faltas: 0 },
      "História": { b1: 6.5, b2: 8.0, faltas: 3 },
      "Química": { b1: 5.0, b2: 4.5, faltas: 4 }
    }
  },
  {
    id: "202602",
    name: "Mariana Silva Santos",
    cpf: "987.654.321-11",
    class: "Ensino Médio - 2º Ano",
    grades: {
      "Matemática": { b1: 9.5, b2: 9.8, faltas: 0 },
      "Português": { b1: 8.0, b2: 9.0, faltas: 1 },
      "Física": { b1: 7.5, b2: 8.2, faltas: 2 },
      "História": { b1: 9.0, b2: 9.5, faltas: 0 },
      "Química": { b1: 8.0, b2: 8.5, faltas: 1 }
    }
  },
  {
    id: "202603",
    name: "Carlos Eduardo Lima",
    cpf: "456.789.123-22",
    class: "Ensino Fundamental II",
    grades: {
      "Matemática": { b1: 6.0, b2: 5.5, faltas: 3 },
      "Português": { b1: 7.0, b2: 7.0, faltas: 2 },
      "Física": { b1: 6.2, b2: 6.0, faltas: 1 },
      "História": { b1: 8.0, b2: 7.5, faltas: 0 },
      "Química": { b1: 6.5, b2: 7.0, faltas: 2 }
    }
  }
];

const DEFAULT_BOLETOS = [
  { id: "B001", studentId: "202601", month: "Março", value: 450, status: "pago", barcode: "23790.11119 12345.678909 12345.678909 1 12340000045000" },
  { id: "B002", studentId: "202601", month: "Abril", value: 450, status: "pago", barcode: "23790.11119 12345.678909 12345.678909 1 12340000045000" },
  { id: "B003", studentId: "202601", month: "Maio", value: 450, status: "pago", barcode: "23790.11119 12345.678909 12345.678909 1 12340000045000" },
  { id: "B004", studentId: "202601", month: "Junho", value: 450, status: "pendente", barcode: "23790.11119 12345.678909 12345.678909 1 12340000045000" },
  { id: "B005", studentId: "202602", month: "Junho", value: 450, status: "pago", barcode: "23790.11119 12345.678909 12345.678909 1 12340000045000" }
];

const DEFAULT_NOTICES = [
  { id: "N001", title: "Festa Junina do CENSA 2026", date: "12/06/2026", target: "todos", content: "Prezadas famílias, no próximo sábado teremos nossa tradicional Festa Junina! Estão todos convidados a partir das 13h no pátio do colégio. Haverá barracas de comidas típicas, danças e muita alegria!" },
  { id: "N002", title: "Fechamento de Notas e Diários", date: "10/06/2026", target: "professores", content: "Atenção professores! Solicitamos o preenchimento de todas as notas do 1º Trimestre no sistema até o dia 20 de junho para que a secretaria possa emitir os boletins atualizados." },
  { id: "N003", title: "Início das Provas Trimestrais", date: "08/06/2026", target: "alunos", content: "Lembramos a todos os alunos que as avaliações do primeiro trimestre iniciarão na segunda-feira, dia 22 de junho. Confiram o calendário de salas e matérias no mural físico ou com seus líderes de turma." }
];

const DEFAULT_BANNERS = {
  promoText: "Matrículas e Inscrições Abertas!",
  phone: "(21) 2455-6582",
  whatsapp: "(21) 98556-1885"
};

// Database Initialization Helper
function initLocalStorageDB() {
  if (!localStorage.getItem('censa_students')) {
    localStorage.setItem('censa_students', JSON.stringify(DEFAULT_STUDENTS));
  }
  if (!localStorage.getItem('censa_boletos')) {
    localStorage.setItem('censa_boletos', JSON.stringify(DEFAULT_BOLETOS));
  }
  if (!localStorage.getItem('censa_notices')) {
    localStorage.setItem('censa_notices', JSON.stringify(DEFAULT_NOTICES));
  }
  if (!localStorage.getItem('censa_banners')) {
    localStorage.setItem('censa_banners', JSON.stringify(DEFAULT_BANNERS));
  }
}

// Database Getters & Setters
const db = {
  getStudents: () => JSON.parse(localStorage.getItem('censa_students')),
  setStudents: (data) => localStorage.setItem('censa_students', JSON.stringify(data)),
  
  getBoletos: () => JSON.parse(localStorage.getItem('censa_boletos')),
  setBoletos: (data) => localStorage.setItem('censa_boletos', JSON.stringify(data)),
  
  getNotices: () => JSON.parse(localStorage.getItem('censa_notices')),
  setNotices: (data) => localStorage.setItem('censa_notices', JSON.stringify(data)),
  
  getBanners: () => JSON.parse(localStorage.getItem('censa_banners')),
  setBanners: (data) => localStorage.setItem('censa_banners', JSON.stringify(data))
};

// Initialize DB on script load
initLocalStorageDB();


// --- 2. SESSION CONTROL ---
const session = {
  login: (role, username, name) => {
    const data = { role, username, name };
    sessionStorage.setItem('censa_session', JSON.stringify(data));
  },
  logout: () => {
    sessionStorage.removeItem('censa_session');
    window.location.reload();
  },
  get: () => JSON.parse(sessionStorage.getItem('censa_session'))
};


// --- 3. CORE PORTAL ENGINE CLASS ---
class PortalApp {
  constructor() {
    this.sessionData = null;
    this.initElements();
    this.bindEvents();
    this.checkActiveSession();
  }

  initElements() {
    // Screens
    this.loginScreen = document.getElementById('login-screen');
    this.appContainer = document.getElementById('app-container');
    
    // Forms
    this.loginForm = document.getElementById('portal-login-form');
    this.studentForm = document.getElementById('form-add-student');
    this.boletoForm = document.getElementById('form-create-boleto');
    this.noticeForm = document.getElementById('form-create-notice');
    this.bannersForm = document.getElementById('form-update-banners');
    
    // Navigation Menus
    this.menuAdmin = document.getElementById('menu-admin');
    this.menuTeacher = document.getElementById('menu-teacher');
    this.menuStudent = document.getElementById('menu-student');
    this.mobileNav = document.getElementById('mobile-nav-bar');
    
    // Info display
    this.sidebarRoleBadge = document.getElementById('sidebar-role-badge');
    this.userDisplayName = document.getElementById('user-display-name');
    this.userDisplayId = document.getElementById('user-display-id');
    
    // Buttons
    this.logoutBtn = document.getElementById('portal-logout-btn');
    this.logoutBtnMobile = document.getElementById('portal-logout-btn-mobile');
    this.btnAddStudentModal = document.getElementById('btn-add-student-modal');
    this.btnCloseStudentModal = document.getElementById('btn-close-student-modal');
    this.btnCancelStudentModal = document.getElementById('btn-cancel-student-modal');
    
    // Modals
    this.modalAddStudent = document.getElementById('modal-add-student');
    this.modalViewBoleto = document.getElementById('modal-view-boleto');
  }

  bindEvents() {
    // Login Submit
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }

    // Logout
    if (this.logoutBtn) this.logoutBtn.addEventListener('click', () => session.logout());
    if (this.logoutBtnMobile) this.logoutBtnMobile.addEventListener('click', () => session.logout());

    // Tabs switching
    document.querySelectorAll('.sidebar-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = link.getAttribute('data-tab');
        this.switchTab(tabId);
        
        // Update active class in sidebar links
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });

    // Mobile tabs switching delegation
    if (this.mobileNav) {
      this.mobileNav.addEventListener('click', (e) => {
        const link = e.target.closest('.mobile-nav-link');
        if (link) {
          e.preventDefault();
          const tabId = link.getAttribute('data-tab');
          this.switchTab(tabId);
          
          this.mobileNav.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }

    // Modal Control: Add Student
    if (this.btnAddStudentModal) {
      this.btnAddStudentModal.addEventListener('click', () => this.openStudentModal());
    }
    if (this.btnCloseStudentModal) this.btnCloseStudentModal.addEventListener('click', () => this.closeStudentModal());
    if (this.btnCancelStudentModal) this.btnCancelStudentModal.addEventListener('click', () => this.closeStudentModal());

    // Student CRUD Submit
    if (this.studentForm) {
      this.studentForm.addEventListener('submit', (e) => this.handleStudentSubmit(e));
    }

    // Boleto Emit Submit
    if (this.boletoForm) {
      this.boletoForm.addEventListener('submit', (e) => this.handleBoletoSubmit(e));
    }

    // Notice Submit
    if (this.noticeForm) {
      this.noticeForm.addEventListener('submit', (e) => this.handleNoticeSubmit(e));
    }

    // Banner Config Submit
    if (this.bannersForm) {
      this.bannersForm.addEventListener('submit', (e) => this.handleBannersSubmit(e));
    }

    // Boleto Modal Close Buttons
    document.querySelectorAll('#btn-close-boleto-modal, #btn-close-boleto-modal-footer').forEach(btn => {
      btn.addEventListener('click', () => this.modalViewBoleto.classList.remove('active'));
    });

    // Teacher select change filters list
    const teacherSubject = document.getElementById('teacher-select-subject');
    const teacherClass = document.getElementById('teacher-select-class');
    if (teacherSubject && teacherClass) {
      teacherSubject.addEventListener('change', () => this.renderTeacherGradesTable());
      teacherClass.addEventListener('change', () => this.renderTeacherGradesTable());
    }

    // Teacher save grades button
    const btnSaveGrades = document.getElementById('btn-save-grades-teacher');
    if (btnSaveGrades) {
      btnSaveGrades.addEventListener('click', () => this.handleTeacherGradesSave());
    }
  }

  checkActiveSession() {
    const activeSession = session.get();
    if (activeSession) {
      this.sessionData = activeSession;
      this.loginScreen.style.display = 'none';
      this.appContainer.style.display = 'flex';
      
      this.setupUserUI();
    } else {
      this.loginScreen.style.display = 'flex';
      this.appContainer.style.display = 'none';
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const role = document.getElementById('login-role').value;
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;

    if (password !== '123456') {
      alert("Senha incorreta! Para testes, use a senha padrão: 123456");
      return;
    }

    if (role === 'admin') {
      if (username.toLowerCase() === 'admin') {
        session.login('admin', 'admin', 'Secretaria Escolar (Admin)');
        this.checkActiveSession();
      } else {
        alert("Matrícula/Usuário inválido para Administrador. Use: admin");
      }
    } else if (role === 'professor') {
      if (username.toLowerCase() === 'prof1') {
        session.login('professor', 'prof1', 'Prof. Marcos Silva');
        this.checkActiveSession();
      } else {
        alert("Matrícula/Usuário inválido para Professor. Use: prof1");
      }
    } else if (role === 'aluno') {
      const students = db.getStudents();
      const student = students.find(s => s.id === username);
      if (student) {
        session.login('aluno', student.id, student.name);
        this.checkActiveSession();
      } else {
        alert("Matrícula de aluno não encontrada! Teste com 202601 ou 202602.");
      }
    }
  }

  setupUserUI() {
    const { role, username, name } = this.sessionData;
    
    // Set text display
    this.userDisplayName.textContent = name;
    this.userDisplayId.textContent = `Código: ${username}`;
    this.sidebarRoleBadge.textContent = role === 'admin' ? 'Administrador' : role === 'professor' ? 'Professor' : 'Aluno';
    
    // Hide all menus
    this.menuAdmin.style.display = 'none';
    this.menuTeacher.style.display = 'none';
    this.menuStudent.style.display = 'none';
    
    // Setup tabs
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));

    // Configure display by role
    if (role === 'admin') {
      this.menuAdmin.style.display = 'block';
      this.setupMobileNav('admin');
      this.switchTab('admin-dash');
      this.renderAdminDash();
    } else if (role === 'professor') {
      this.menuTeacher.style.display = 'block';
      this.setupMobileNav('teacher');
      this.switchTab('teacher-dash');
      this.renderTeacherDash();
    } else if (role === 'aluno') {
      this.menuStudent.style.display = 'block';
      this.setupMobileNav('student');
      this.switchTab('student-boletim');
      this.renderStudentDash();
    }
  }

  setupMobileNav(role) {
    if (!this.mobileNav) return;
    this.mobileNav.style.display = 'flex';
    
    let html = '';
    if (role === 'admin') {
      html = `
        <a href="#" class="mobile-nav-link active" data-tab="admin-dash"><i class="fa-solid fa-chart-line"></i><span>Dash</span></a>
        <a href="#" class="mobile-nav-link" data-tab="admin-students"><i class="fa-solid fa-user-graduate"></i><span>Alunos</span></a>
        <a href="#" class="mobile-nav-link" data-tab="admin-boletos"><i class="fa-solid fa-file-invoice-dollar"></i><span>Boletos</span></a>
        <a href="#" class="mobile-nav-link" data-tab="admin-notices"><i class="fa-solid fa-bullhorn"></i><span>Avisos</span></a>
      `;
    } else if (role === 'teacher') {
      html = `
        <a href="#" class="mobile-nav-link active" data-tab="teacher-dash"><i class="fa-solid fa-chalkboard-user"></i><span>Turmas</span></a>
        <a href="#" class="mobile-nav-link" data-tab="teacher-grades"><i class="fa-solid fa-pen-to-square"></i><span>Notas</span></a>
      `;
    } else if (role === 'student') {
      html = `
        <a href="#" class="mobile-nav-link active" data-tab="student-boletim"><i class="fa-solid fa-file-signature"></i><span>Boletim</span></a>
        <a href="#" class="mobile-nav-link" data-tab="student-financeiro"><i class="fa-solid fa-wallet"></i><span>Faturas</span></a>
        <a href="#" class="mobile-nav-link" data-tab="student-mural"><i class="fa-solid fa-message"></i><span>Mural</span></a>
      `;
    }
    
    this.mobileNav.innerHTML = html;
  }

  switchTab(tabId) {
    // Hide all tabs
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    
    // Show selected tab
    const targetPane = document.getElementById(`tab-${tabId}`);
    if (targetPane) {
      targetPane.classList.add('active');
    }

    // Specific loads
    if (tabId === 'admin-students') this.renderAdminStudentsTable();
    if (tabId === 'admin-boletos') this.renderAdminBoletosTab();
    if (tabId === 'admin-notices') this.renderAdminNoticesTab();
    if (tabId === 'admin-banners') this.renderAdminBannersTab();
    if (tabId === 'teacher-grades') this.renderTeacherGradesTable();
    if (tabId === 'student-boletim') this.renderStudentBoletim();
    if (tabId === 'student-financeiro') this.renderStudentFinanceiro();
    if (tabId === 'student-mural') this.renderStudentMural();
  }

  // Helper to trigger tab transition from external buttons
  openGradesTab(subject, className) {
    const selectSubject = document.getElementById('teacher-select-subject');
    const selectClass = document.getElementById('teacher-select-class');
    if (selectSubject && selectClass) {
      selectSubject.value = subject;
      selectClass.value = className;
    }
    
    // Update menu state
    document.querySelectorAll('.sidebar-link').forEach(l => {
      if (l.getAttribute('data-tab') === 'teacher-grades') l.classList.add('active');
      else l.classList.remove('active');
    });

    if (this.mobileNav) {
      this.mobileNav.querySelectorAll('.mobile-nav-link').forEach(l => {
        if (l.getAttribute('data-tab') === 'teacher-grades') l.classList.add('active');
        else l.classList.remove('active');
      });
    }

    this.switchTab('teacher-grades');
  }


  // =========================================
  // --- RENDERS: ADMINISTRATOR PANEL ---
  // =========================================
  renderAdminDash() {
    const students = db.getStudents();
    const boletos = db.getBoletos();
    const notices = db.getNotices();

    // Stats
    document.getElementById('admin-stat-students').textContent = students.length;
    document.getElementById('admin-stat-boletos').textContent = boletos.length;
    document.getElementById('admin-stat-notices').textContent = notices.length;

    // Recent Students List (last 4)
    const recentStudentsTbody = document.getElementById('admin-recent-students-tbody');
    let studHtml = '';
    const sliceStudents = students.slice(-4).reverse();
    sliceStudents.forEach(s => {
      studHtml += `
        <tr>
          <td>${s.id}</td>
          <td>${s.name}</td>
          <td>${s.class}</td>
        </tr>
      `;
    });
    recentStudentsTbody.innerHTML = studHtml;

    // Recent Boletos List (last 4)
    const recentBoletosTbody = document.getElementById('admin-recent-boletos-tbody');
    let bolHtml = '';
    const sliceBoletos = boletos.slice(-4).reverse();
    sliceBoletos.forEach(b => {
      const statusClass = b.status === 'pago' ? 'pago' : 'pendente';
      bolHtml += `
        <tr>
          <td>${b.studentId}</td>
          <td>${b.month}</td>
          <td>R$ ${b.value},00</td>
          <td><span class="status-badge ${statusClass}">${b.status.toUpperCase()}</span></td>
        </tr>
      `;
    });
    recentBoletosTbody.innerHTML = bolHtml;
  }

  renderAdminStudentsTable() {
    const students = db.getStudents();
    const tbody = document.getElementById('admin-students-table-tbody');
    let html = '';
    
    students.forEach((s, idx) => {
      html += `
        <tr>
          <td>${s.id}</td>
          <td><strong>${s.name}</strong></td>
          <td>${s.cpf}</td>
          <td>${s.class}</td>
          <td>
            <button class="action-btn-outline" onclick="portalApp.openStudentModal(${idx})"><i class="fa-solid fa-pen"></i></button>
            <button class="action-btn-outline delete" onclick="portalApp.deleteStudent('${s.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  openStudentModal(editIndex = -1) {
    this.modalAddStudent.classList.add('active');
    const title = document.getElementById('modal-student-title');
    const inputIndex = document.getElementById('edit-student-index');
    
    const nameInput = document.getElementById('student-name');
    const cpfInput = document.getElementById('student-cpf');
    const classSelect = document.getElementById('student-class');
    const idInput = document.getElementById('student-id-input');

    if (editIndex > -1) {
      // Editing Mode
      const students = db.getStudents();
      const s = students[editIndex];
      
      title.textContent = "Editar Ficha do Aluno";
      inputIndex.value = editIndex;
      
      nameInput.value = s.name;
      cpfInput.value = s.cpf;
      classSelect.value = s.class;
      idInput.value = s.id;
      idInput.disabled = true; // cannot edit primary key
    } else {
      // Creation Mode
      title.textContent = "Adicionar Novo Aluno";
      inputIndex.value = '';
      
      this.studentForm.reset();
      idInput.disabled = false;
      // Auto-generate random matricula for convenience
      idInput.value = Math.floor(202600 + Math.random() * 999).toString();
    }
  }

  closeStudentModal() {
    this.modalAddStudent.classList.remove('active');
    this.studentForm.reset();
  }

  handleStudentSubmit(e) {
    e.preventDefault();
    const editIndex = document.getElementById('edit-student-index').value;
    const name = document.getElementById('student-name').value.trim();
    const cpf = document.getElementById('student-cpf').value.trim();
    const className = document.getElementById('student-class').value;
    const id = document.getElementById('student-id-input').value.trim();

    const students = db.getStudents();

    if (editIndex !== '') {
      // Save Edit
      const idx = parseInt(editIndex);
      students[idx].name = name;
      students[idx].cpf = cpf;
      students[idx].class = className;
      
      db.setStudents(students);
      alert("Ficha do aluno atualizada com sucesso!");
    } else {
      // Add Student
      if (students.some(s => s.id === id)) {
        alert("Já existe um aluno cadastrado com esta matrícula!");
        return;
      }

      // Default grades object for new students
      const grades = {
        "Matemática": { b1: 0, b2: 0, faltas: 0 },
        "Português": { b1: 0, b2: 0, faltas: 0 },
        "Física": { b1: 0, b2: 0, faltas: 0 },
        "História": { b1: 0, b2: 0, faltas: 0 },
        "Química": { b1: 0, b2: 0, faltas: 0 }
      };

      students.push({ id, name, cpf, class: className, grades });
      db.setStudents(students);
      alert("Novo aluno cadastrado com sucesso!");
    }

    this.closeStudentModal();
    this.renderAdminStudentsTable();
  }

  deleteStudent(id) {
    if (confirm(`Tem certeza que deseja excluir o aluno com matrícula ${id}? Esta ação não pode ser desfeita.`)) {
      let students = db.getStudents();
      students = students.filter(s => s.id !== id);
      db.setStudents(students);
      this.renderAdminStudentsTable();
    }
  }

  renderAdminBoletosTab() {
    const students = db.getStudents();
    const boletos = db.getBoletos();
    
    // Select Student dropdown
    const select = document.getElementById('boleto-student-id');
    let selHtml = '';
    students.forEach(s => {
      selHtml += `<option value="${s.id}">${s.name} (${s.id})</option>`;
    });
    select.innerHTML = selHtml;

    // Boletos List
    const tbody = document.getElementById('admin-boletos-table-tbody');
    let tableHtml = '';
    boletos.forEach(b => {
      const student = students.find(s => s.id === b.studentId);
      const studentName = student ? student.name : "Desconhecido";
      const statusClass = b.status === 'pago' ? 'pago' : 'pendente';
      const statusActionBtn = b.status === 'pago' 
        ? `<button class="action-btn-outline" onclick="portalApp.toggleBoletoStatus('${b.id}', 'pendente')">Marcar Pendente</button>`
        : `<button class="action-btn-solid green sm-btn" onclick="portalApp.toggleBoletoStatus('${b.id}', 'pago')">Liquidar</button>`;

      tableHtml += `
        <tr>
          <td><strong>${studentName}</strong> <br><small>Matrícula: ${b.studentId}</small></td>
          <td>${b.month}</td>
          <td>R$ ${b.value},00</td>
          <td><span class="status-badge ${statusClass}">${b.status.toUpperCase()}</span></td>
          <td>
            ${statusActionBtn}
            <button class="action-btn-outline delete" onclick="portalApp.deleteBoleto('${b.id}')"><i class="fa-solid fa-trash"></i></button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = tableHtml;
  }

  handleBoletoSubmit(e) {
    e.preventDefault();
    const studentId = document.getElementById('boleto-student-id').value;
    const month = document.getElementById('boleto-month').value;
    const value = parseInt(document.getElementById('boleto-value').value);
    
    const boletos = db.getBoletos();
    const id = "B" + Math.floor(100 + Math.random() * 899).toString();
    const barcode = "23790.11119 12345.678909 " + Math.floor(10000 + Math.random() * 89999) + ".678909 1 " + value + "00000";

    boletos.push({ id, studentId, month, value, status: 'pendente', barcode });
    db.setBoletos(boletos);
    
    alert("Boleto emitido com sucesso para a conta do aluno!");
    this.renderAdminBoletosTab();
  }

  toggleBoletoStatus(id, newStatus) {
    const boletos = db.getBoletos();
    const idx = boletos.findIndex(b => b.id === id);
    if (idx > -1) {
      boletos[idx].status = newStatus;
      db.setBoletos(boletos);
      this.renderAdminBoletosTab();
    }
  }

  deleteBoleto(id) {
    if (confirm("Deseja mesmo cancelar e excluir esta cobrança?")) {
      let boletos = db.getBoletos();
      boletos = boletos.filter(b => b.id !== id);
      db.setBoletos(boletos);
      this.renderAdminBoletosTab();
    }
  }

  renderAdminNoticesTab() {
    const notices = db.getNotices();
    const div = document.getElementById('admin-notices-list');
    let html = '';
    
    notices.forEach(n => {
      html += `
        <div class="notice-admin-card">
          <h5>${n.title}</h5>
          <span>Data: ${n.date} | Público: <strong>${n.target.toUpperCase()}</strong></span>
          <p>${n.content}</p>
          <button class="delete-notice-btn" onclick="portalApp.deleteNotice('${n.id}')" title="Excluir Aviso"><i class="fa-solid fa-trash"></i></button>
        </div>
      `;
    });
    
    if (notices.length === 0) {
      html = '<p style="color:var(--text-muted); text-align:center;">Nenhum comunicado cadastrado.</p>';
    }
    div.innerHTML = html;
  }

  handleNoticeSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('notice-title').value.trim();
    const target = document.getElementById('notice-target').value;
    const content = document.getElementById('notice-content').value.trim();
    
    const notices = db.getNotices();
    const id = "N" + Math.floor(100 + Math.random() * 899).toString();
    const dateObj = new Date();
    const date = `${dateObj.getDate().toString().padStart(2, '0')}/${(dateObj.getMonth()+1).toString().padStart(2, '0')}/${dateObj.getFullYear()}`;

    notices.push({ id, title, date, target, content });
    db.setNotices(notices);
    
    alert("Comunicado publicado no mural com sucesso!");
    this.noticeForm.reset();
    this.renderAdminNoticesTab();
  }

  deleteNotice(id) {
    if (confirm("Remover comunicado do mural?")) {
      let notices = db.getNotices();
      notices = notices.filter(n => n.id !== id);
      db.setNotices(notices);
      this.renderAdminNoticesTab();
    }
  }

  renderAdminBannersTab() {
    const banners = db.getBanners();
    document.getElementById('banner-promo-text').value = banners.promoText;
    document.getElementById('banner-phone').value = banners.phone;
    document.getElementById('banner-whatsapp').value = banners.whatsapp;
  }

  handleBannersSubmit(e) {
    e.preventDefault();
    const promoText = document.getElementById('banner-promo-text').value.trim();
    const phone = document.getElementById('banner-phone').value.trim();
    const whatsapp = document.getElementById('banner-whatsapp').value.trim();

    const banners = { promoText, phone, whatsapp };
    db.setBanners(banners);
    alert("Configurações do site atualizadas! O banner promocional público foi alterado.");
  }


  // =========================================
  // --- RENDERS: TEACHER PANEL ---
  // =========================================
  renderTeacherDash() {
    const notices = db.getNotices();
    const listDiv = document.getElementById('teacher-notices-list');
    let html = '';
    
    // Filter notices targeted to teachers or all
    const teacherNotices = notices.filter(n => n.target === 'todos' || n.target === 'professores');
    teacherNotices.forEach(n => {
      html += `
        <div class="aviso-item">
          <strong>${n.title}</strong>
          <span>Publicado em: ${n.date}</span>
          <p>${n.content}</p>
        </div>
      `;
    });
    
    if (teacherNotices.length === 0) {
      html = '<p style="color:var(--text-muted);">Nenhum comunicado recente da coordenação.</p>';
    }
    listDiv.innerHTML = html;
  }

  renderTeacherGradesTable() {
    const subject = document.getElementById('teacher-select-subject').value;
    const className = document.getElementById('teacher-select-class').value;
    const students = db.getStudents();
    
    // Filter students belonging to the selected class/grade level
    const filteredStudents = students.filter(s => s.class === className);
    const tbody = document.getElementById('teacher-grades-table-tbody');
    let html = '';

    filteredStudents.forEach(s => {
      // Fetch or init subject grades if not present
      if (!s.grades[subject]) {
        s.grades[subject] = { b1: 0, b2: 0, faltas: 0 };
      }
      const grade = s.grades[subject];

      html += `
        <tr data-student-id="${s.id}">
          <td>${s.id}</td>
          <td><strong>${s.name}</strong></td>
          <td>
            <input type="number" step="0.1" min="0" max="10" class="grade-edit-input b1-input" value="${grade.b1}">
          </td>
          <td>
            <input type="number" step="0.1" min="0" max="10" class="grade-edit-input b2-input" value="${grade.b2}">
          </td>
          <td>
            <input type="number" min="0" class="grade-edit-input faltas-input" value="${grade.faltas}">
          </td>
        </tr>
      `;
    });

    if (filteredStudents.length === 0) {
      html = `<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">Não há alunos cadastrados nesta turma.</td></tr>`;
    }
    
    tbody.innerHTML = html;
  }

  handleTeacherGradesSave() {
    const subject = document.getElementById('teacher-select-subject').value;
    const students = db.getStudents();
    const tbody = document.getElementById('teacher-grades-table-tbody');
    const rows = tbody.querySelectorAll('tr[data-student-id]');

    if (rows.length === 0) {
      alert("Não há dados de alunos para salvar.");
      return;
    }

    rows.forEach(row => {
      const studentId = row.getAttribute('data-student-id');
      const b1 = parseFloat(row.querySelector('.b1-input').value) || 0;
      const b2 = parseFloat(row.querySelector('.b2-input').value) || 0;
      const faltas = parseInt(row.querySelector('.faltas-input').value) || 0;

      const studentIdx = students.findIndex(s => s.id === studentId);
      if (studentIdx > -1) {
        if (!students[studentIdx].grades) students[studentIdx].grades = {};
        students[studentIdx].grades[subject] = { b1, b2, faltas };
      }
    });

    db.setStudents(students);
    alert("Notas e faltas lançadas com sucesso!");
    this.renderTeacherGradesTable();
  }


  // =========================================
  // --- RENDERS: STUDENT PANEL ---
  // =========================================
  renderStudentDash() {
    this.renderStudentBoletim();
  }

  renderStudentBoletim() {
    const username = this.sessionData.username;
    const students = db.getStudents();
    const student = students.find(s => s.id === username);
    
    const tbody = document.getElementById('student-boletim-tbody');
    if (!student) return;

    let html = '';
    const subjects = Object.keys(student.grades);

    subjects.forEach(subject => {
      const grade = student.grades[subject];
      const media = ((grade.b1 + grade.b2) / 2).toFixed(1);
      const isPass = media >= 6.0;
      
      const badgeClass = isPass ? 'aprovado' : 'recuperacao';
      const badgeText = isPass ? 'Aprovado' : 'Recuperação';

      html += `
        <tr>
          <td><strong>${subject}</strong></td>
          <td>${grade.b1.toFixed(1)}</td>
          <td>${grade.b2.toFixed(1)}</td>
          <td>${grade.faltas}</td>
          <td><span class="boletim-badge ${badgeClass}">${badgeText} (Média: ${media})</span></td>
        </tr>
      `;
    });

    if (subjects.length === 0) {
      html = `<tr><td colspan="5" style="text-align:center;">Nenhuma nota lançada neste período.</td></tr>`;
    }

    tbody.innerHTML = html;
  }

  renderStudentFinanceiro() {
    const username = this.sessionData.username;
    const boletos = db.getBoletos();
    const studentBoletos = boletos.filter(b => b.studentId === username);
    
    const tbody = document.getElementById('student-boletos-tbody');
    let html = '';

    studentBoletos.forEach(b => {
      const statusClass = b.status === 'pago' ? 'pago' : 'pendente';
      const actionHtml = b.status === 'pago'
        ? `<span style="color:var(--green); font-weight:700;"><i class="fa-solid fa-circle-check"></i> Compensado</span>`
        : `<button class="action-btn-solid red sm-btn" onclick="portalApp.openBoletoPrintModal('${b.id}')">Visualizar Boleto</button>`;

      html += `
        <tr>
          <td>Mensalidade - ${b.month}</td>
          <td>R$ ${b.value},00</td>
          <td><span class="status-badge ${statusClass}">${b.status.toUpperCase()}</span></td>
          <td>${actionHtml}</td>
        </tr>
      `;
    });

    if (studentBoletos.length === 0) {
      html = `<tr><td colspan="4" style="text-align:center; color:var(--text-muted);">Nenhum boleto lançado para esta conta.</td></tr>`;
    }

    tbody.innerHTML = html;
  }

  openBoletoPrintModal(boletoId) {
    const boletos = db.getBoletos();
    const students = db.getStudents();
    
    const b = boletos.find(x => x.id === boletoId);
    if (!b) return;

    const student = students.find(s => s.id === b.studentId);
    const studentName = student ? student.name : "Sacado";

    // Set printable content details
    document.getElementById('boleto-print-doc-num').textContent = b.id;
    document.getElementById('boleto-print-value').textContent = `R$ ${b.value},00`;
    document.getElementById('boleto-print-value-cobrado').textContent = `R$ ${b.value},00`;
    document.getElementById('boleto-print-sacado').textContent = `${studentName} (CPF: ${student ? student.cpf : '000.000.000-00'})`;

    // Open Modal
    this.modalViewBoleto.classList.add('active');
  }

  renderStudentMural() {
    const notices = db.getNotices();
    const div = document.getElementById('student-notices-timeline');
    let html = '';

    // Notices targeting 'todos' or 'alunos'
    const studentNotices = notices.filter(n => n.target === 'todos' || n.target === 'alunos');
    
    studentNotices.forEach((n, idx) => {
      const isUrgent = idx === 0 ? 'urgent' : ''; // Mock urgent tag
      html += `
        <div class="timeline-card ${isUrgent}">
          <h4>${n.title}</h4>
          <span class="date">Publicado em: ${n.date}</span>
          <p>${n.content}</p>
        </div>
      `;
    });

    if (studentNotices.length === 0) {
      html = '<p style="color:var(--text-muted); text-align:center;">Nenhum aviso no mural.</p>';
    }

    div.innerHTML = html;
  }
}

let portalApp;
document.addEventListener('DOMContentLoaded', () => {
  portalApp = new PortalApp();

  // --- 3D Mouse Tilt Effect for Portal Login Card ---
  const tiltElements = document.querySelectorAll('.tilt-3d');
  if (tiltElements.length > 0) {
    tiltElements.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((centerY - y) / centerY) * 10;
        const tiltY = ((x - centerX) / centerX) * 10;
        
        el.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;
        el.style.transition = 'none';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        el.style.transition = 'transform 0.5s ease';
      });
    });
  }
});
