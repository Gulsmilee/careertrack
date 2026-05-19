// ==========================================
// 1. TEMEL DEĞİŞKENLER VE ARAYÜZ YAKALAMA
// ==========================================
const authSection = document.getElementById("auth-section");
const dashboardSection = document.getElementById("dashboard-section");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const logoutBtn = document.getElementById("logout-btn");
const userNameDisplay = document.getElementById("user-name-display");

const loginContainer = document.getElementById("login-container");
const registerContainer = document.getElementById("register-container");
const showRegisterBtn = document.getElementById("show-register");
const showLoginBtn = document.getElementById("show-login");

const resetPasswordContainer = document.getElementById(
  "reset-password-container",
);
const showResetPasswordBtn = document.getElementById("show-reset-password");
const backToLoginBtn = document.getElementById("back-to-login");
const resetPasswordForm = document.getElementById("reset-password-form");

const addCompanyForm = document.getElementById("add-company-form");
const companiesList = document.getElementById("companies-list");

// Sayfa yüklendiğinde oturum kontrolünü yap
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
});

// ==========================================
// 2. OTURUM VE KİMLİK YÖNETİMİ (AUTH)
// ==========================================
function checkAuth() {
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  if (token) {
    authSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    if (userNameDisplay) userNameDisplay.textContent = username;

    fetchCompanies(); // Şirketleri getirir
    fetchApplications(); // Başvuruları getirir
  } else {
    authSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
  }
}

// Kayıt Ol
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
        registerForm.reset();
        showLoginBtn.click();
      } else {
        alert("Hata: " + data.error);
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  });
}

// Giriş Yap
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("username", data.user.username);
        checkAuth();
        loginForm.reset();
      } else {
        alert("Giriş başarısız: " + data.error);
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
    }
  });
}

// Şifre Sıfırlama İşlemi
if (resetPasswordForm) {
  resetPasswordForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("reset-username").value;
    const email = document.getElementById("reset-email").value;
    const newPassword = document.getElementById("reset-new-password").value;

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, newPassword }),
      });
      const data = await response.json();

      if (response.ok) {
        alert(data.mesaj + " Şimdi yeni şifrenizle giriş yapabilirsiniz.");
        resetPasswordForm.reset();
        backToLoginBtn.click();
      } else {
        alert("Hata: " + data.error);
      }
    } catch (error) {
      console.error("Sıfırlama hatası:", error);
    }
  });
}

// Çıkış Yap
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    checkAuth();
  });
}

// ==========================================
// 3. ARAYÜZ (UI) ETKİLEŞİMLERİ
// ==========================================

if (showRegisterBtn) {
  showRegisterBtn.addEventListener("click", () => {
    loginContainer.classList.add("hidden");
    registerContainer.classList.remove("hidden");
  });
}

if (showLoginBtn) {
  showLoginBtn.addEventListener("click", () => {
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  });
}

if (showResetPasswordBtn) {
  showResetPasswordBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginContainer.classList.add("hidden");
    resetPasswordContainer.classList.remove("hidden");
  });
}

if (backToLoginBtn) {
  backToLoginBtn.addEventListener("click", () => {
    resetPasswordContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
  });
}

document.querySelectorAll(".toggle-password").forEach((icon) => {
  icon.addEventListener("click", function () {
    const targetId = this.getAttribute("data-target");
    const inputField = document.getElementById(targetId);
    const iconElement = this.querySelector("i");

    if (inputField.type === "password") {
      inputField.type = "text";
      iconElement.classList.remove("bi-eye-slash");
      iconElement.classList.add("bi-eye");
    } else {
      inputField.type = "password";
      iconElement.classList.remove("bi-eye");
      iconElement.classList.add("bi-eye-slash");
    }
  });
});

// ==========================================
// 4. ŞİRKET YÖNETİMİ (CRUD)
// ==========================================

async function fetchCompanies() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("/api/companies", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await response.json();

    if (response.ok) {
      renderCompanies(data.data);
    }
  } catch (error) {
    console.error("İstek hatası:", error);
  }
}

let originalRenderCompanies = null;
function renderCompanies(companies) {
  if (!companiesList) return;
  companiesList.innerHTML = "";

  if (companies.length === 0) {
    companiesList.innerHTML =
      '<div class="text-secondary small">Henüz bir şirket eklemediniz.</div>';
  } else {
    companies.forEach((company) => {
      const col = document.createElement("div");
      col.className = "col-md-6";
      col.innerHTML = `
          <div class="p-3 rounded h-100 shadow-sm" style="background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1);">
              <div class="d-flex justify-content-between align-items-start">
                  <div>
                      <h6 class="text-white mb-1 fw-bold">${company.name}</h6>
                      <div class="small text-secondary mb-1"><i class="bi bi-briefcase me-1"></i> ${company.industry || "Belirtilmedi"}</div>
                      ${company.website ? `<a href="${company.website}" target="_blank" class="small text-primary text-decoration-none"><i class="bi bi-link-45deg"></i> Siteye Git</a>` : ""}
                  </div>
                  <button onclick="deleteCompany(${company.id})" class="btn btn-sm btn-outline-danger border-0" title="Şirketi Sil"><i class="bi bi-trash"></i></button>
              </div>
          </div>
      `;
      companiesList.appendChild(col);
    });
  }

  // Başvuru formundaki Select menüsünü güncelle
  const appCompanySelect = document.getElementById("app-company-id");
  if (appCompanySelect) {
    appCompanySelect.innerHTML = '<option value="">-- Şirket Seçin --</option>';
    companies.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.name;
      appCompanySelect.appendChild(opt);
    });
  }
}

if (addCompanyForm) {
  addCompanyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const name = document.getElementById("comp-name").value;
    const industry = document.getElementById("comp-industry").value;
    const website = document.getElementById("comp-website").value;

    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ name, industry, website }),
      });

      const data = await response.json();

      if (response.ok) {
        addCompanyForm.reset();
        fetchCompanies();
      } else {
        alert("Ekleme başarısız: " + data.error);
      }
    } catch (error) {
      console.error("Ekleme hatası:", error);
    }
  });
}

window.deleteCompany = async (id) => {
  if (!confirm("Bu şirketi silmek istediğinize emin misiniz?")) return;

  const token = localStorage.getItem("token");
  try {
    const response = await fetch("/api/companies/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (response.ok) {
      fetchCompanies();
      fetchApplications(); // Şirket silinince ona bağlı başvurular da silindiği için burayı da yeniliyoruz
    } else {
      const data = await response.json();
      alert("Silinemedi: " + data.error);
    }
  } catch (error) {
    console.error("Silme hatası:", error);
  }
};

// ==========================================
// 5. BAŞVURU YÖNETİMİ VE CV YÜKLEME
// ==========================================
const addApplicationForm = document.getElementById("add-application-form");
const applicationsList = document.getElementById("applications-list");

if (document.getElementById("app-date")) {
  document.getElementById("app-date").value = new Date()
    .toISOString()
    .split("T")[0];
}

async function fetchApplications() {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const response = await fetch("/api/applications", {
      headers: { Authorization: "Bearer " + token },
    });
    const data = await response.json();

    if (response.ok) {
      renderApplications(data.data);
    }
  } catch (error) {
    console.error("Başvurular çekilemedi:", error);
  }
}

function renderApplications(applications) {
  if (!applicationsList) return;
  applicationsList.innerHTML = "";

  if (applications.length === 0) {
    applicationsList.innerHTML =
      '<tr><td colspan="6" class="text-secondary text-center">Henüz bir başvuru kaydı yok.</td></tr>';
    return;
  }

  applications.forEach((app) => {
    let badgeColor = "bg-primary";
    if (app.status === "Mülakat") badgeColor = "bg-warning text-dark";
    if (app.status === "Kabul") badgeColor = "bg-success";
    if (app.status === "Red") badgeColor = "bg-danger";

    let cvCellContent = "";
    if (app.cv_path) {
      cvCellContent = `
        <a href="/uploads/${app.cv_path}" target="_blank" class="btn btn-sm btn-outline-info text-decoration-none">
            <i class="bi bi-file-earmark-pdf-fill"></i> CV'yi Gör
        </a>
      `;
    } else {
      cvCellContent = `
        <form onsubmit="uploadCV(event, ${app.id})" class="d-flex flex-column gap-1">
            <div class="d-flex gap-1 align-items-center">
                <label class="btn btn-sm btn-outline-light mb-0" style="cursor: pointer;">
                    <i class="bi bi-file-earmark-pdf"></i> Seç
                    <input type="file" name="cv" accept=".pdf" class="hidden-file-input" style="display:none;" 
                           onchange="updateFileName(this, ${app.id})" required />
                </label>
                <button type="submit" class="btn btn-sm btn-success" title="Yükle"><i class="bi bi-upload"></i></button>
            </div>
            <span id="file-name-${app.id}" class="text-secondary" style="font-size: 0.75rem; max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">Dosya seçilmedi</span>
        </form>
      `;
    }

    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td class="fw-bold text-white">${app.company_name}</td>
        <td>${app.position}</td>
        <td><span class="badge ${badgeColor}">${app.status}</span></td>
        <td>${app.application_date}</td>
        <td>${cvCellContent}</td>
        <td>
            <button onclick="deleteApplication(${app.id})" class="btn btn-sm btn-outline-danger border-0"><i class="bi bi-trash"></i></button>
        </td>
    `;
    applicationsList.appendChild(tr);
  });
}

if (addApplicationForm) {
  addApplicationForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const company_id = parseInt(
      document.getElementById("app-company-id").value,
    );
    const position = document.getElementById("app-position").value;
    const status = document.getElementById("app-status").value;
    const application_date = document.getElementById("app-date").value;

    try {
      const response = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          company_id,
          position,
          status,
          application_date,
        }),
      });
      const data = await response.json();

      if (response.ok) {
        document.getElementById("app-position").value = "";
        fetchApplications();
      } else {
        alert("Hata: " + data.error);
      }
    } catch (error) {
      console.error("Başvuru eklenemedi:", error);
    }
  });
}

window.deleteApplication = async (id) => {
  if (!confirm("Bu başvuruyu silmek istediğinize emin misiniz?")) return;
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/applications/" + id, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });

    if (response.ok) {
      fetchApplications();
    }
  } catch (error) {
    console.error("Silme hatası:", error);
  }
};

window.updateFileName = (input, appId) => {
  const fileNameSpan = document.getElementById(`file-name-${appId}`);
  if (input.files && input.files.length > 0) {
    fileNameSpan.textContent = input.files[0].name;
    fileNameSpan.classList.remove("text-secondary");
    fileNameSpan.classList.add("text-success");
  } else {
    fileNameSpan.textContent = "Dosya seçilmedi";
    fileNameSpan.classList.remove("text-success");
    fileNameSpan.classList.add("text-secondary");
  }
};

window.uploadCV = async (e, applicationId) => {
  e.preventDefault();
  const token = localStorage.getItem("token");
  const form = e.target;
  const fileInput = form.querySelector('input[type="file"]');
  const submitBtn = form.querySelector('button[type="submit"]');

  const originalBtnHTML = submitBtn.innerHTML;
  submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>`;
  submitBtn.disabled = true;

  const formData = new FormData();
  formData.append("cv", fileInput.files[0]);

  try {
    const response = await fetch(
      `/api/applications/${applicationId}/upload-cv`,
      {
        method: "POST",
        headers: { Authorization: "Bearer " + token },
        body: formData,
      },
    );
    const data = await response.json();

    if (response.ok) {
      alert("Başarılı: " + data.mesaj);
      form.reset();
      fetchApplications(); // Tabloyu anında yeniler ve "CV'yi Gör" butonunu getirir!
    } else {
      alert("Yükleme Engellendi: " + data.error);
    }
  } catch (error) {
    console.error("Dosya yükleme hatası:", error);
    alert("Sunucuyla iletişim kurulurken bir hata oluştu.");
  } finally {
    submitBtn.innerHTML = originalBtnHTML;
    submitBtn.disabled = false;
  }
};

// ==========================================
// 6. HAREKETLİ ARKA PLAN (CANVAS ANİMASYONU)
// ==========================================
const canvas = document.getElementById("bg-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let width, height, particles;

  function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 1) * 0.7,
      });
    }
  }

  function animateCanvas() {
    requestAnimationFrame(animateCanvas);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "rgba(16, 185, 129, 0.6)";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.06)";

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  window.addEventListener("resize", initCanvas);
  initCanvas();
  animateCanvas();
}

// ==========================================
// 7. ARAMA VE FİLTRELEME ÖZELLİĞİ
// ==========================================
const searchAppInput = document.getElementById("search-app");

if (searchAppInput) {
  searchAppInput.addEventListener("keyup", function () {
    const filterValue = this.value.toLowerCase();
    const rows = applicationsList.querySelectorAll("tr");

    rows.forEach((row) => {
      // Eğer tablo boşsa ve "Henüz başvuru kaydı yok" yazıyorsa filtrelemeyi atla
      if (row.cells.length === 1) return;

      // Şirket Adı, Pozisyon veya Durum sütunlarındaki metinleri al
      const companyName = row.cells[0].textContent.toLowerCase();
      const position = row.cells[1].textContent.toLowerCase();
      const status = row.cells[2].textContent.toLowerCase();

      // Aranan kelime bu üçünden birinde geçiyorsa satırı göster, geçmiyorsa gizle
      if (
        companyName.includes(filterValue) ||
        position.includes(filterValue) ||
        status.includes(filterValue)
      ) {
        row.style.display = ""; // CSS'i sıfırla, yani göster
      } else {
        row.style.display = "none"; // Satırı gizle
      }
    });
  });
}

// ==========================================
// 8. İSTATİSTİK HESAPLAMA VE EXCEL İNDİRME
// ==========================================

// İstatistikleri Güncelle
function updateStats(applications) {
  const total = applications.length;
  const interviews = applications.filter(
    (app) => app.status === "Mülakat",
  ).length;
  const rejected = applications.filter((app) => app.status === "Red").length;

  const statTotal = document.getElementById("stat-total");
  const statInterview = document.getElementById("stat-interview");
  const statRejected = document.getElementById("stat-rejected");

  if (statTotal) statTotal.textContent = total;
  if (statInterview) statInterview.textContent = interviews;
  if (statRejected) statRejected.textContent = rejected;
}

// Orijinal renderApplications fonksiyonunu ezerek istatistikleri de çalıştıralım
const oldRenderApplications = renderApplications;
renderApplications = function (applications) {
  oldRenderApplications(applications);
  updateStats(applications);
};

// Tabloyu CSV (Excel) Formatında İndirme
window.exportTableToCSV = function (filename) {
  const table = document.querySelector(".table");
  let csv = [];
  const rows = table.querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
    let row = [],
      cols = rows[i].querySelectorAll("td, th");
    // Son iki sütunu (CV ve Aksiyon) Excel'e almamak için length - 2 yapıyoruz
    let maxCol = i === 0 ? cols.length - 2 : cols.length - 2;

    for (let j = 0; j < maxCol; j++) {
      // Excel'de Türkçe karakter sorunu olmasın diye temizliyoruz
      row.push('"' + cols[j].innerText.replace(/"/g, '""') + '"');
    }
    if (row.length > 0) csv.push(row.join(","));
  }

  const csvFile = new Blob(["\uFEFF" + csv.join("\n")], {
    type: "text/csv;charset=utf-8;",
  });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
};

// --- AYDINLIK / KARANLIK TEMA GEÇİŞİ MANTIĞI ---
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Sayfa yüklendiğinde kullanıcının tarayıcı hafızasındaki (localStorage) son seçimini hatırla
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light-mode");
  if (themeIcon) themeIcon.classList.replace("bi-sun-fill", "bi-moon-fill");
  if (themeToggleBtn) {
    themeToggleBtn.classList.replace(
      "btn-outline-secondary",
      "btn-outline-dark",
    );
    themeToggleBtn.style.color = "black";
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");

    if (isLight) {
      if (themeIcon) themeIcon.classList.replace("bi-sun-fill", "bi-moon-fill");
      themeToggleBtn.classList.replace(
        "btn-outline-secondary",
        "btn-outline-dark",
      );
      themeToggleBtn.style.color = "black";
      localStorage.setItem("theme", "light"); // Seçimi hafızaya kaydet
    } else {
      if (themeIcon) themeIcon.classList.replace("bi-moon-fill", "bi-sun-fill");
      themeToggleBtn.classList.replace(
        "btn-outline-dark",
        "btn-outline-secondary",
      );
      themeToggleBtn.style.color = "white";
      localStorage.setItem("theme", "dark"); // Seçimi hafızaya kaydet
    }
  });
}
