const API = "https://luxury-backend-iu71.onrender.com/content";

let currentData = {};

async function load() {
  const res = await fetch(API);
  currentData = await res.json();

  // HERO
  heroBadge.value = currentData.hero.badge || "";
  heroTitle.value = currentData.hero.title || "";
  heroSubtitle.value = currentData.hero.subtitle || "";
  heroCta1.value = currentData.hero.cta_primary || "";
  heroCta2.value = currentData.hero.cta_secondary || "";

  // SERVICES
  svc1Title.value = currentData.services?.[0]?.title || "";
  svc1Desc.value  = currentData.services?.[0]?.desc  || "";
  svc2Title.value = currentData.services?.[1]?.title || "";
  svc2Desc.value  = currentData.services?.[1]?.desc  || "";
}

async function save() {
  const password = pw.value.trim();
  if (!password) return alert("Nhập password");

  // cập nhật data
  currentData.hero = {
    badge: heroBadge.value,
    title: heroTitle.value,
    subtitle: heroSubtitle.value,
    cta_primary: heroCta1.value,
    cta_secondary: heroCta2.value
  };

  currentData.services = [
    { title: svc1Title.value, desc: svc1Desc.value },
    { title: svc2Title.value, desc: svc2Desc.value }
  ];

  const res = await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Password": password
    },
    body: JSON.stringify(currentData)
  });

  if (!res.ok) {
    alert("❌ Sai mật khẩu hoặc không có quyền");
    return;
  }

  alert("✅ Đã lưu – web public sẽ cập nhật ngay");
}

load();
