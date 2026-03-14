const API_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL";

// ฝากงาน
document.getElementById("workForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const payload = {
    action: "addWork",
    name: workName.value,
    link: workLink.value,
    type: workType.value
  };
  await fetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
  loadWorks();
});

async function loadWorks() {
  const res = await fetch(API_URL + "?action=getWorks");
  const data = await res.json();
  const tbody = document.querySelector("#workTable tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${row.name}</td>
      <td><a href="${row.link}" target="_blank">เปิด</a></td>
      <td>${row.type}</td>
      <td>${row.status}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ตารางโพสต์
document.getElementById("scheduleForm")?.addEventListener("submit", async e => {
  e.preventDefault();
  const payload = {
    action: "addContent",
    date: postDate.value,
    content: contentType.value
  };
  await fetch(API_URL, { method: "POST", body: JSON.stringify(payload) });
  loadCalendar();
});

async function loadCalendar() {
  const res = await fetch(API_URL + "?action=getCalendar");
  const data = await res.json();
  const tbody = document.querySelector("#calendarTable tbody");
  tbody.innerHTML = "";
  data.forEach(row => {
    const tr = document.createElement("tr");
    tr.innerHTML = `<td>${row.date}</td><td>${row.content}</td>`;
    tbody.appendChild(tr);
  });
}

// โหลดเมื่อเปิดหน้า
if (document.body.contains(document.getElementById("workTable"))) loadWorks();
if (document.body.contains(document.getElementById("calendarTable"))) loadCalendar();
