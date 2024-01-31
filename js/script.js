
// User and talent tabs switching code.

const tabs = document.querySelectorAll(".tab-btns > button");
let content = document.querySelectorAll(".tab-content");
console.log(tabs);
tabs.forEach((tab, i) => {
  // console.log(tab);
  tab.addEventListener("click", () => {
    tabs.forEach((t) => {
      t.classList.remove("active");
    });

    content.forEach((c, ci) => {
      if (i === ci) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });
    tab.classList.add("active");
  });
});



const tabs1 = document.querySelectorAll(" .tab1");
const scontent = document.querySelectorAll(".tab-content-talent .leaderboard-1");

tabs1.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    tabs1.forEach((t) => {
      t.classList.remove("active");
    });

    scontent.forEach((c, ci) => {
      if (i === ci) {
        c.classList.add("active");
      } else {
        c.classList.remove("active");
      }
    });

    tab.classList.add("active");
  });
});


// get User Image 
async function getUserImageUrl(userId) {
    const res = await fetch(
      `https://www.streamkarlive.live/meShow/entrance?parameter=%7B%22FuncTag%22:10005044,%22userId%22:${userId}%7D`
    );
    const data = await res.json();
    if (data && data.portrait_path_original)
      return data.portrait_path_original + "!256";
    else return "";
  }

// Fetching schedule data from spreadsheet.

let SHEET_ID = "1djhJENfLOWBMu2pp0aiH5KdCWL0KqzqMXEdMvLDnHnI";
let SHEET_TITLE = "Winner_Leaderboard";

let SHEET_RANGE = "A34:C43";

let URL =
  "https://docs.google.com/spreadsheets/d/" +
  SHEET_ID +
  "/gviz/tq?sheet=" +
  SHEET_TITLE +
  "&range=";

console.log(URL);

async function fetchSheetData(sheet_range) {
  try {
    const res = await fetch(`${URL}${sheet_range}`);
    const data = await res.text();
    return JSON.parse(data.substring(47).slice(0, -2));
  } catch (e) {
    return null;
  }
}



async function renderLeaderboardData(data, name, roundNumber,category) {
  const top3 = data.rows.slice(0, 3);
  console.log(top3);
  const toppers =
    name === "user"
      ? document.querySelectorAll(
          `.leaderboard .topper-container .top`
        )
      : document.querySelectorAll(
          `#${category} .top`
        );
  console.log(toppers)
  toppers.forEach(async (topper, i) => {
    const current = top3[i].c;
    const name = topper.querySelector(".name");
    const avatar = topper.querySelector("img");
    const userImageUrl = await getUserImageUrl(current[0].v);
    avatar.setAttribute("src", userImageUrl);
    const id = topper.querySelector(".id");
    const beans = topper.querySelector(".beans");

    name.innerHTML = current[0].v;
    id.innerHTML = current[1].v;
    beans.innerText = current[2].v || 0;
  });

  const winnerContainer =
    name === "user"
      ? document.querySelector(
          `.leaderboard .winner-container`
        )
      : document.querySelector(
          `#${category} .winner-container`
        );
        
    console.log(winnerContainer);
  const winnerStripTemplate = document.querySelector("#winner-strip");
 
  for (let i = 3; i < data.rows.length; i++) {
    const current = data.rows[i].c;
    // console.log(current);
    const winnerStrip = winnerStripTemplate.content.cloneNode(true);
    const position = winnerStrip.querySelector(".position");

    position.innerHTML = i + 1;

    const avatarContainer = winnerStrip.querySelector(".avatar");
    avatarContainer.style.overflow = "hidden";
    const avatar = avatarContainer.querySelector("img");
    const userImageUrl = await getUserImageUrl(current[0].v);
    avatar.setAttribute("src", userImageUrl);

    const name = winnerStrip.querySelector(".name");
    name.innerHTML = current[0].v;

    const id = winnerStrip.querySelector(".id");
    id.innerHTML = current[1].v;

    // beanImg.src=

    const beans = winnerStrip.querySelector(".beans");
    beans.innerHTML = current[2].v || 0;
    winnerContainer.appendChild(winnerStrip);
  }
}

async function init() {
    const leaderboardData = await fetchSheetData("A4:C13");
    
    const leaderboardDataS1 = await fetchSheetData("A36:C40");
    const leaderboardDataF1 = await fetchSheetData("A24:C28");
    const leaderboardDataD1 = await fetchSheetData("A17:C20")
    
    renderLeaderboardData(leaderboardData.table, "user", "1");
    renderLeaderboardData(leaderboardDataF1.table,"talent",'1','fashion');
    renderLeaderboardData(leaderboardDataS1.table,"talent",'1','singing');
    renderLeaderboardData(leaderboardDataD1.table,"talent",'1','dancing');
  }

  init();