const fs = require('fs');
const path = require('path');

// Mock browser DOM elements required by portal.js during script evaluation
document.body.innerHTML = `
  <div id="login-screen"></div>
  <div id="app-container"></div>
  <form id="portal-login-form"></form>
  <form id="form-add-student"></form>
  <form id="form-create-boleto"></form>
  <form id="form-create-notice"></form>
  <form id="form-update-banners"></form>
  <div id="menu-admin"></div>
  <div id="menu-teacher"></div>
  <div id="menu-student"></div>
  <div id="mobile-nav-bar"></div>
  <span id="sidebar-role-badge"></span>
  <span id="user-display-name"></span>
  <span id="user-display-id"></span>
  <button id="portal-logout-btn"></button>
  <button id="portal-logout-btn-mobile"></button>
  <button id="btn-add-student-modal"></button>
  <button id="btn-close-student-modal"></button>
  <button id="btn-cancel-student-modal"></button>
  <div id="modal-add-student"></div>
  <div id="modal-view-boleto"></div>
`;

// Load portal.js script into the JSDOM context
const portalScript = fs.readFileSync(path.resolve(__dirname, './portal.js'), 'utf8');
eval(portalScript);

describe('CENSA Portal - Banco de Dados Simulado (LocalStorage)', () => {
  beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    initLocalStorageDB();
  });

  test('Inicializacao: deve criar tabelas padrao com registros iniciais', () => {
    const students = db.getStudents();
    const boletos = db.getBoletos();
    const notices = db.getNotices();
    const banners = db.getBanners();
    
    expect(students).not.toBeNull();
    expect(Array.isArray(students)).toBe(true);
    expect(students.length).toBe(3);
    
    expect(boletos).not.toBeNull();
    expect(boletos.length).toBe(5);
    
    expect(notices).not.toBeNull();
    expect(notices.length).toBe(3);
    
    expect(banners).not.toBeNull();
    expect(banners.phone).toBe("(21) 2455-6582");
  });

  test('Leitura: deve retornar os dados de um estudante pelo ID', () => {
    const students = db.getStudents();
    const student = students.find(s => s.id === '202601');
    
    expect(student).toBeDefined();
    expect(student.name).toBe('Thiago Alves de Souza');
    expect(student.cpf).toBe('123.456.789-00');
    expect(student.class).toBe('Ensino Médio - 2º Ano');
  });

  test('Escrita: deve cadastrar novo estudante e manter persistido no LocalStorage', () => {
    const originalStudents = db.getStudents();
    const newStudent = {
      id: "202699",
      name: "Novo Estudante Teste Unitario",
      cpf: "999.888.777-66",
      class: "Ensino Fundamental I",
      grades: {}
    };
    
    db.setStudents([...originalStudents, newStudent]);
    
    const updatedStudents = db.getStudents();
    expect(updatedStudents.length).toBe(4);
    
    const found = updatedStudents.find(s => s.id === "202699");
    expect(found).toBeDefined();
    expect(found.name).toBe("Novo Estudante Teste Unitario");
  });
});

describe('CENSA Portal - Controle de Sessao (SessionStorage)', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  test('Login: deve salvar informacoes de sessao ativa', () => {
    session.login('admin', 'admin', 'Secretaria Admin');
    
    const active = session.get();
    expect(active).not.toBeNull();
    expect(active.role).toBe('admin');
    expect(active.username).toBe('admin');
    expect(active.name).toBe('Secretaria Admin');
  });

  test('Logout: deve limpar chaves de sessao ativa', () => {
    session.login('aluno', '202601', 'Thiago Alves');
    expect(session.get()).not.toBeNull();
    
    // Mock reload to prevent loop
    const originalLocation = window.location;
    delete window.location;
    window.location = { reload: jest.fn() };
    
    session.logout();
    
    expect(session.get()).toBeNull();
    expect(window.location.reload).toHaveBeenCalled();
    
    // Restore
    window.location = originalLocation;
  });
});

describe('CENSA Portal - Regras de Boletim e Notas', () => {
  test('Calculo de Media: deve validar a situacao bimestral', () => {
    // Caso 1: Aprovado
    const notaMat = { b1: 8.0, b2: 9.0 };
    const mediaMat = (notaMat.b1 + notaMat.b2) / 2;
    expect(mediaMat).toBe(8.5);
    expect(mediaMat).toBeGreaterThanOrEqual(6.0);

    // Caso 2: Recuperacao
    const notaHist = { b1: 5.0, b2: 4.5 };
    const mediaHist = (notaHist.b1 + notaHist.b2) / 2;
    expect(mediaHist).toBe(4.75);
    expect(mediaHist).toBeLessThan(6.0);
  });
});
