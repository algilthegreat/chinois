fetch("data.json")
  .then(resp => resp.json())
  .then(data => init(data));

function randomRGB() {
  const r = Math.floor(Math.random() * 200);
  const g = Math.floor(Math.random() * 200);
  const b = Math.floor(Math.random() * 200);
  return `rgb(${r},${g},${b})`;
}

// Mélanger un tableau
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function init(data){
  const categoriesDiv = document.getElementById("categories");
  const cardsDiv = document.getElementById("cards");

  const colorMap = {
    "白色":"white","黑色":"black","红色":"red","蓝色":"blue",
    "绿色":"green","黄色":"yellow","橙色":"orange","紫色":"purple",
    "粉红色":"pink","棕色":"brown","灰色":"gray","金色":"gold",
    "银色":"silver","浅色":"lightgray","深色":"darkgray",
    "彩色":"linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)",
    "透明":"transparent"
  };
  const lightColors = ["white","yellow","pink","lightgray","gold","silver"];

  // Boutons catégories normales
  for(let cat in data){
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.onclick = () => showCards(data[cat], cat);
    categoriesDiv.appendChild(btn);
  }

  // Bouton aléatoire
  const randomBtn = document.createElement("button");
  randomBtn.textContent = "aléatoire";
  randomBtn.onclick = () => showRandom(data);
  categoriesDiv.appendChild(randomBtn);

  // --- Affichage cartes normales ---
  function showCards(cartes, cat){
    cardsDiv.innerHTML = "";
    cartes.forEach(c=>{
      const card = document.createElement("div");
      card.className="card";
      let color = (cat==="couleurs" && colorMap[c.chinois]) || randomRGB();
      let textColor = lightColors.includes(color) ? "black":"white";

      // Si catégorie questions et exemple présent, on l'affiche
      let exempleHTML = "";
      if(cat==="questions" && c.exemple){
        exempleHTML = `<div style="font-size:0.9rem; margin-top:5px;">${c.exemple}</div>`;
      }

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front" style="background:${color};color:${textColor}">
            ${c.chinois}
          </div>
          <div class="card-face card-back" style="background:${color};color:${textColor}">
            <div>${c.pinyin}</div>
            <div>${c.francais}</div>
            ${exempleHTML}
          </div>
        </div>
      `;
      card.onclick = ()=>card.classList.toggle("flipped");
      cardsDiv.appendChild(card);
    });
  }

  // --- Catégorie aléatoire ---
  function showRandom(data){
    cardsDiv.innerHTML="";
    const allCards = [];
    for(let cat in data) data[cat].forEach(c => allCards.push(c));
    if(allCards.length===0) return;

    shuffle(allCards); // ordre aléatoire

    let index=0;
    const container=document.createElement("div");
    container.style.display="flex";
    container.style.alignItems="center";
    container.style.justifyContent="center";
    container.style.gap="20px";
    container.style.marginTop="30px";
    cardsDiv.appendChild(container);

    const leftArrow=document.createElement("button");
    leftArrow.textContent="◀";
    leftArrow.className="arrow";

    const rightArrow=document.createElement("button");
    rightArrow.textContent="▶";
    rightArrow.className="arrow";

    container.appendChild(leftArrow);

    const card=document.createElement("div");
    card.className="card card-vertical";
    container.appendChild(card);

    container.appendChild(rightArrow);

    function showCard(i){
      const current = allCards[i];
      let color = colorMap[current.chinois] || randomRGB();
      let textColor = lightColors.includes(color)?"black":"white";

      card.innerHTML = `
        <div class="card-inner">
          <div class="card-face card-front" style="background:${color};color:${textColor};font-size:5rem;display:flex;justify-content:center;align-items:center">
            ${current.chinois}
          </div>
          <div class="card-face card-back" style="background:${color};color:${textColor};font-size:2.5rem;display:flex;flex-direction:column;justify-content:center;align-items:center">
            <div>${current.pinyin}</div>
            <div>${current.francais}</div>
          </div>
        </div>
      `;
      card.classList.remove("flipped");
    }

    showCard(index);

    leftArrow.onclick=()=>{index=(index-1+allCards.length)%allCards.length; showCard(index);}
    rightArrow.onclick=()=>{index=(index+1)%allCards.length; showCard(index);}
    card.onclick = () => card.classList.toggle("flipped");
  }
}
