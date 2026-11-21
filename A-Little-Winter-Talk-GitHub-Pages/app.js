let page=0,sound=false,ctx,selected=null,mode='pair',current=0,peek=false;
let seen=new Set(),rank={},revealed=new Set(),done=new Set();
const modal=document.querySelector('#modal'),app=document.querySelector('#app'),content=document.querySelector('#content');
const items=[['Fireplace',19,65,'What would make an evening by the fire perfect for you?','I can’t imagine a cosy evening without…'],['Christmas tree',58,32,'Tell us about a decoration you remember.','It reminds me of…'],['Presents',33,70,'What small gift would you love to receive?','I’d be happy to get… because…'],['Books',19,19,'What would you like to read on a snowy day?','I associate reading with…'],['Candles',25,37,'Which smells do you associate with winter?','The smell of… reminds me of…'],['Armchair',63,65,'Describe your favourite place to relax at home.','My favourite spot is… because…'],['Window',76,24,'Imagine looking out of this window. What can you see and hear?','Outside, there’s… / I can hear…'],['Lamp',87,43,'Do you prefer bright lights or soft lighting on winter evenings?','I prefer… because it makes me feel…'],['Wreath',94,30,'What decorations would you choose for your front door?','I’d choose… because…'],['Cosy cushion',64,58,'What makes a room feel cosy to you?','I can’t imagine a cosy room without…'],['Guitar',89,79,'Which music puts you in a winter mood?','Whenever I hear…, I think of…'],['Open book',78,88,'Invent the first sentence of a story set in this room.','It was a quiet winter evening when…']];
items.push(['Tree bell',57,42,'Which sounds bring back happy memories for you?','The sound of… reminds me of…']);
const icks=['Slushy pavements','Freezing fingers','Static hair','Getting dark at 4 p.m.','Fogged-up glasses','Wet socks','Slipping on ice','Too many layers','A cold nose','Waiting for a bus in the cold'];
const secrets=[['☃️','Snowman',['Carrot','Scarf','Round','Garden','Melting']],['☕','Hot chocolate',['Mug','Sweet','Brown','Drink','Marshmallows']],['🧣','Scarf',['Neck','Wool','Long','Soft','Wear']],['🛷','Sledge',['Hill','Slide','Fast','Sit','Ride']],['🕯️','Candle',['Wax','Flame','Light','Scent','Burn']],['🎁','Present',['Wrapped','Ribbon','Surprise','Open','Give']],['🧤','Gloves',['Hands','Fingers','Pair','Wool','Wear']],['🦌','Reindeer',['Antlers','Hooves','Animal','Sleigh','Rudolph']],['🍪','Gingerbread man',['Biscuit','Spices','Bake','Icing','Person']]];
const gingerbreadBack = '<img class="secret-back" src="gingerbread-card.webp" width="672" height="448" alt="">';
function art(i,extra=''){return `<span class="watercolor ${extra}" style="background-position:${(i%4)*100/3}% ${Math.floor(i/4)*50}%" aria-hidden="true"></span>`}
const titles=['Winter Things, Winter Stories','Winter Icks: The Annoyance Meter','Five Words, One Winter Secret'];
let objectAudio=null,objectKind=null,audioVolume=.45;
function syncSound(){document.querySelector('#sound').textContent=sound?'Sound on ♫':'Sound off ♫';document.querySelector('#sound').setAttribute('aria-pressed',sound)}
function stopObjectAudio(){if(objectAudio){objectAudio.pause();objectAudio.currentTime=0;objectAudio=null}const b=document.querySelector('#object-listen');if(b)b.textContent='Play sound'}
function toggleSound(){sound=!sound;syncSound();if(!sound)stopObjectAudio();else if(modal.open&&objectKind)playObjectAudio()}
function playObjectAudio(){stopObjectAudio()}
function toggleObjectAudio(){if(objectAudio&&!objectAudio.paused)stopObjectAudio();else playObjectAudio()}
modal.addEventListener('close',()=>{stopObjectAudio();objectKind=null});

function tone(){}
function go(n){stopObjectAudio();objectKind=null;page=n;selected=null;modal.close();render();window.scrollTo(0,0)}
function nav(){return `<div class="top"><button onclick="go(0)">Home</button><span class="eyebrow">${page} of 3 · Winter warm-ups</span><button onclick="resetGame()">Start again</button></div><h2 class="game-title">${titles[page-1]}</h2>`}
function bottom(){return `<div class="bottom"><span class="note">Take your time. There are no perfect answers.</span><button class="primary" onclick="done.add(page);go(${page===3?0:page+1})">${page===3?'Finish & return home':'Next game'}</button></div>`}
function render(){let h='';if(page===0)h=`<section class="hero"><div><div class="eyebrow">A cosy little speaking collection</div><h1>A little<br><em>winter talk.</em></h1><p>Come in from the cold. Discover little stories, share your winter icks, and keep a secret or two.</p><button class="primary" onclick="go(1)">Let’s play</button><p class="note">3 warm-ups · 5–10 minutes each · A2–B1</p></div><img src="room.jpg" width="1024" height="1024" alt="Watercolour Christmas room with a glowing fireplace and cosy armchair"></section><div class="rule">Pick a little winter adventure</div><section class="cards">${titles.map((t,i)=>`<button class="card" onclick="go(${i+1})">${art([4,11,5][i],'home-art')}<span class="eyebrow">${['Click & reveal','Drag & rank','Guess & reveal'][i]}</span><h3>${t}</h3><p>${['Every object has a story. What’s yours?','A tiny annoyance or your biggest winter ick?','Five words. One hidden answer. Can you guess?'][i]}</p><span class="play">${done.has(i+1)?'Play again · completed':'Step inside'}</span></button>`).join('')}</section>`;
if(page===1)h=nav()+`<p>Explore the room. Click a glowing spot, then share a little story.</p><div class="room-layout"><div class="room"><img src="room.jpg" width="1024" height="1024" alt="Interactive winter room">${items.map((v,i)=>`<button class="spot ${seen.has(i)?'seen':''}" style="left:${v[1]}%;top:${v[2]}%" aria-label="${v[0]}" title="${v[0]}" onclick="openItem(${i})">${seen.has(i)?'✓':i===12?'♬':'+'}</button>`).join('')}</div><aside><div class="eyebrow">Make it personal</div><div class="count">${seen.size} of ${items.length} stories explored</div><div class="support"><h3>A little help with words</h3><p>It reminds me of…</p><p>I associate it with…</p><p>I can’t imagine winter without…</p><p>It makes me feel…</p></div><p class="note">Ask one more question: “Why?” “When was that?” or “Who were you with?”</p></aside></div>`+bottom();
if(page===2)h=nav()+annoyanceMeter()+bottom();
if(page===3)h=nav()+`<p>Choose a secret. Describe it in exactly five words. Let your partner guess!</p><div class="controls"><button class="${mode==='pair'?'active':''}" onclick="mode='pair';render()">Play together</button><button class="${mode==='solo'?'active':''}" onclick="mode='solo';render()">Guess from clues</button><button onclick="randomSecret()">Pick a random card</button></div><div class="challenge"><strong>The challenge:</strong> don’t say <b>winter</b>, <b>Christmas</b>, <b>snow</b> or <b>cold</b> — or the name of the secret!</div><div class="secrets">${secrets.map((s,i)=>`<button class="secret ${revealed.has(i)?'revealed':''}" aria-label="${revealed.has(i)?s[1]:'Secret card '+(i+1)}" onclick="openSecret(${i})">${revealed.has(i)?`${art(i,'secret-art')}<small>${s[1]}</small>`:gingerbreadBack}</button>`).join('')}</div><p class="note" style="text-align:center">${mode==='pair'?'The guesser looks away while the speaker peeks at the secret.':'Open a card to see five clues. Say your guess before revealing the answer.'}</p>`+bottom();app.innerHTML=h}
function openItem(i){stopObjectAudio();objectKind=i===0?'fireplace':i===12?'bell':null;seen.add(i);render();const v=items[i];content.innerHTML=`<div class="zoom" role="img" aria-label="${v[0]}" style="background-image:url(room.jpg);background-position:${65-v[1]*6.5}px ${65-v[2]*6.5}px"></div><div class="eyebrow">${v[0]}</div><p class="prompt">${v[3]}</p><p><em>${v[4]}</em></p>${false?`<div class="audio-controls"><button id="object-listen" onclick="toggleObjectAudio()">Play sound</button><label>Volume <input type="range" min="0" max="1" step=".05" value="${audioVolume}" aria-label="Sound volume" oninput="audioVolume=Number(this.value);if(objectAudio)objectAudio.volume=audioVolume"></label></div>`:''}<button class="primary" onclick="modal.close()">Back to the room</button>`;modal.showModal();}
function annoyanceArt(index, className = '') {
  const x = (index % 5) * 25;
  const y = Math.floor(index / 5) * 50;
  return `<span class="annoyance-art ${className}" style="background-position:${x}% ${y}%" aria-hidden="true"></span>`;
}

function annoyanceMeter() {
  const unsorted = icks.map((_, index) => rank[index] === undefined ? ick(index) : '').join('');
  const levels = ['I can live with it', 'It’s pretty annoying', 'It drives me crazy'];
  return `<div class="annoyance">
    <div class="annoyance-intro">
      <div>
        <p>Drag each winter ick to your annoyance meter. Then explain your choices.</p>
        <p class="note">Or click a card, then a zone heading. Click a placed card to move it again.</p>
      </div>
      ${annoyanceArt(13, 'annoyance-sprig')}
    </div>
    <div class="bank" aria-label="Winter annoyances">
      ${unsorted || '<p class="bank-empty">All sorted! Which one is the worst? Compare your choices.</p>'}
    </div>
    <div class="zones">
      ${levels.map((label, zone) => `<section class="zone" aria-labelledby="annoyance-level-${zone}"
        ondragover="event.preventDefault()" ondrop="drop(event,${zone})">
        <button id="annoyance-level-${zone}" class="zone-title" onclick="place(${zone})">
          <span class="zone-portrait">${annoyanceArt(10 + zone, 'zone-snowman')}</span>
          <span>${label}</span>
        </button>
        <div class="zone-cards">${icks.map((_, index) => rank[index] === zone ? ick(index) : '').join('')}</div>
      </section>`).join('')}
    </div>
    <aside class="support annoyance-phrases">
      <h3>Useful phrases</h3>
      <ul>
        <li>I don’t mind…</li>
        <li>I can’t stand…</li>
        <li>What really gets on my nerves is…</li>
        <li>The worst thing about winter is…</li>
      </ul>
    </aside>
  </div>`;
}

function ick(index) {
  return `<button class="ick${selected === index ? ' selected' : ''}" data-ick="${index}"
    draggable="true" aria-pressed="${selected === index}"
    ondragstart="selected=${index};event.dataTransfer.setData('text/plain','${index}')"
    onclick="selectIck(${index})">${annoyanceArt(index, 'ick-art')}<span>${icks[index]}</span></button>`;
}

function selectIck(index) {
  selected = index;
  render();
  document.querySelector(`[data-ick="${index}"]`)?.focus({ preventScroll: true });
}

function drop(e,z){e.preventDefault();const raw=e.dataTransfer.getData('text/plain');if(!/^\d+$/.test(raw))return;const i=Number(raw);if(i<icks.length){selected=i;place(z)}}
function place(z){if(selected===null)return;rank[selected]=z;selected=null;render();tone(z===2?'low':'bell');if(z===2)document.querySelector('#annoyance-level-2 .zone-snowman')?.classList.add('angry')}
function openSecret(i){current=i;peek=false;secretPopup();modal.showModal()}
function secretPopup(){const s=secrets[current];content.innerHTML=`<div class="eyebrow">Secret ${current+1}</div>${revealed.has(current)?`${art(current,'answer-art')}<h2>${s[1]}</h2><p>What gave it away?</p>`:mode==='solo'?`<h3>What could it be?</h3><p class="clues">${s[2].join(' · ')}</p><button class="primary" onclick="reveal()">Reveal answer</button>`:peek?`${art(current,'answer-art')}<h3>${s[1]}</h3><p class="note">Remember your secret. Hide it before your partner looks.</p><button class="primary" onclick="peek=false;secretPopup()">Hide the secret</button>`:`${gingerbreadBack}<h3>For the speaker’s eyes only</h3><p class="note">Ask your partner to look away. Peek, hide the answer, then give your five words.</p><button onclick="peek=true;secretPopup()">Peek at my secret</button><button class="primary" style="margin-top:12px" onclick="reveal()">We’ve guessed — reveal</button>`}`}
function reveal(){revealed.add(current);tone();render();secretPopup()}
function randomSecret(){const a=secrets.map((_,i)=>i).filter(i=>!revealed.has(i));openSecret(a.length?a[Math.floor(Math.random()*a.length)]:Math.floor(Math.random()*9))}
function resetGame(){if(page===1)seen.clear();if(page===2){rank={};selected=null}if(page===3)revealed.clear();done.delete(page);render()}
render();
