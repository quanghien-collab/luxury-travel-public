const API = "https://luxury-backend-iu71.onrender.com/content";

let currentData = {};

function el(id){ return document.getElementById(id); }

// ========== UI RENDER ==========
function renderDestinations(){
  const wrap = el("destinationsList");
  wrap.innerHTML = "";

  const list = Array.isArray(currentData.destinations) ? currentData.destinations : [];
  if (!list.length){
    wrap.innerHTML = `<div class="muted">Chưa có điểm đến. Bấm “+ Thêm điểm đến”.</div>`;
    return;
  }

  list.forEach((d, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="cardHead">
        <strong>Điểm đến #${idx+1}</strong>
        <button class="btnDanger" type="button" onclick="removeDestination(${idx})">Xóa</button>
      </div>

      <label>Tiêu đề</label>
      <input data-dest-title="${idx}" value="${escapeHtml(d.title || "")}">

      <label>Mô tả</label>
      <textarea data-dest-desc="${idx}">${escapeHtml(d.desc || "")}</textarea>

      <label>Link ảnh (img)</label>
      <input data-dest-img="${idx}" value="${escapeHtml(d.img || "")}">
      <div class="muted">Gợi ý: dùng link ảnh Unsplash/Cloudinary/S3…</div>
    `;
    wrap.appendChild(card);
  });
}

function renderGallery(){
  const wrap = el("galleryList");
  wrap.innerHTML = "";

  const list = Array.isArray(currentData.gallery) ? currentData.gallery : [];
  if (!list.length){
    wrap.innerHTML = `<div class="muted">Chưa có ảnh. Bấm “+ Thêm ảnh”.</div>`;
    return;
  }

  list.forEach((url, idx) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="cardHead">
        <strong>Ảnh #${idx+1}</strong>
        <button class="btnDanger" type="button" onclick="removeGallery(${idx})">Xóa</button>
      </div>
      <label>Link ảnh</label>
      <input data-gal="${idx}" value="${escapeHtml(url || "")}">
    `;
    wrap.appendChild(card);
  });
}

// ========== ACTIONS ==========
function addDestination(){
  if (!Array.isArray(currentData.destinations)) currentData.destinations = [];
  currentData.destinations.push({ title:"", desc:"", img:"" });
  renderDestinations();
}

function removeDestination(i){
  currentData.destinations.splice(i, 1);
  renderDestinations();
}

function addGallery(){
  if (!Array.isArray(currentData.gallery)) currentData.gallery = [];
  currentData.gallery.push("");
  renderGallery();
}

function removeGallery(i){
  currentData.gallery.splice(i, 1);
  renderGallery();
}

// ========== LOAD / SAVE ==========
async function load(){
  const res = await fetch(API);
  currentData = await res.json();

  // HERO
  el("heroBadge").value = currentData.hero?.badge || "";
  el("heroTitle").value = currentData.hero?.title || "";
  el("heroSubtitle").value = currentData.hero?.subtitle || "";
  el("heroCta1").value = currentData.hero?.cta_primary || "";
  el("heroCta2").value = currentData.hero?.cta_secondary || "";

  // SERVICES (2 mục)
  el("svc1Title").value = currentData.services?.[0]?.title || "";
  el("svc1Desc").value  = currentData.services?.[0]?.desc  || "";
  el("svc2Title").value = currentData.services?.[1]?.title || "";
  el("svc2Desc").value  = currentData.services?.[1]?.desc  || "";

  // DEST + GALLERY
  renderDestinations();
  renderGallery();
}

function collectFromUI(){
  // HERO
  currentData.hero = {
    badge: el("heroBadge").value.trim(),
    title: el("heroTitle").value.trim(),
    subtitle: el("heroSubtitle").value.trim(),
    cta_primary: el("heroCta1").value.trim(),
    cta_secondary: el("heroCta2").value.trim(),
  };

  // SERVICES
  currentData.services = [
    { title: el("svc1Title").value.trim(), desc: el("svc1Desc").value.trim() },
    { title: el("svc2Title").value.trim(), desc: el("svc2Desc").value.trim() },
  ];

  // DESTINATIONS (đọc theo data-* idx)
  const dests = Array.isArray(currentData.destinations) ? currentData.destinations : [];
  dests.forEach((_, idx) => {
    const t = document.querySelector(`[data-dest-title="${idx}"]`);
    const d = document.querySelector(`[data-dest-desc="${idx}"]`);
    const i = document.querySelector(`[data-dest-img="${idx}"]`);
    dests[idx] = {
      title: (t?.value || "").trim(),
      desc:  (d?.value || "").trim(),
      img:   (i?.value || "").trim(),
    };
  });
  currentData.destinations = dests.filter(x => x.title || x.desc || x.img); // bỏ dòng trống

  // GALLERY
  const g = Array.isArray(currentData.gallery) ? currentData.gallery : [];
  currentData.gallery = g.map((_, idx) => {
    const inp = document.querySelector(`[data-gal="${idx}"]`);
    return (inp?.value || "").trim();
  }).filter(Boolean);
}

async function save(){
  const password = el("pw").value.trim();
  if (!password) return alert("Nhập password");

  collectFromUI();

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "X-Password": password
    },
    body: JSON.stringify(currentData)
  });

  if (!res.ok){
    alert("❌ Sai mật khẩu hoặc không có quyền");
    return;
  }

  alert("✅ Đã lưu – website public sẽ cập nhật ngay");
  // reload lại để render sạch
  await load();
}

// chống lỗi HTML injection khi set value vào innerHTML
function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

load();
