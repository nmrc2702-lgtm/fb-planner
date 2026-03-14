function doGet(e) {
  const action = e.parameter.action;

  if (action === "getWorks") return getWorks();
  if (action === "getCalendar") return getCalendar();

  return ContentService.createTextOutput("unknown action");
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents);

  if (data.action === "addWork") return addWork(data);
  if (data.action === "addContent") return addContent(data);

  return ContentService.createTextOutput("ok");
}

function getSheet(name) {
  return SpreadsheetApp.getActive().getSheetByName(name);
}

// ฝากงาน
function addWork(data) {
  const sh = getSheet("works");
  sh.appendRow([data.name, data.link, data.type, "รอรับงาน"]);
  return ContentService.createTextOutput("ok");
}

function getWorks() {
  const sh = getSheet("works");
  const rows = sh.getDataRange().getValues().slice(1);
  const data = rows.map(r => ({ name: r[0], link: r[1], type: r[2], status: r[3] }));
  return ContentService.createTextOutput(JSON.stringify(data));
}

// ตารางโพสต์
function addContent(data) {
  const sh = getSheet("calendar");
  let d = new Date(data.date);
  let content = data.content;

  const groupMap = {
    "ฟิลเลอร์ทั่วหน้า": ["ฟิลเลอร์ทั่วหน้า"],
    "ฟิลเลอร์ 3 จุด": ["ฟิลเลอร์ 3 จุด"],
    "ฟิลเลอร์ 1 จุด": ["ฟิลเลอร์ 1 จุด"],
    "แฟต": ["แฟต"],
    "Pico": ["Pico"],
    "Oligio": ["Oligio"],
    "Ulthera": ["Ulthera"],
    "Scanxel": ["Scanxel"],
    "โบท็อกซ์": ["โบท็อกซ์"],
    "จมูก": ["จมูก"],
    "ดึงหน้า": ["ดึงหน้า"],
    "ตาสองชั้น": ["ตาสองชั้น"],
    "Subbrow": ["Subbrow"]
  };

  function findGroup(c) {
    return Object.keys(groupMap).find(g => c.includes(g));
  }

  while (true) {
    let dateStr = d.toISOString().split("T")[0];
    let rows = sh.getDataRange().getValues().slice(1);
    let exist = rows.find(r => r[0] === dateStr);

    if (!exist) {
      sh.appendRow([dateStr, content]);
      break;
    }

    const newGroup = findGroup(content);
    const existGroup = findGroup(exist[1]);

    if (newGroup === existGroup) {
      d.setDate(d.getDate() + 1);
      continue;
    }

    sh.appendRow([dateStr, content]);

    const pushed = exist[1];
    addContent({ date: dateStr, content: pushed });
    break;
  }

  return ContentService.createTextOutput("ok");
}

function getCalendar() {
  const sh = getSheet("calendar");
  const rows = sh.getDataRange().getValues().slice(1);
  const data = rows.map(r => ({ date: r[0], content: r[1] }));
  return ContentService.createTextOutput(JSON.stringify(data));
}
