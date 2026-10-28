(() => {
'use strict';
const G=window.SecretDance,C=window.BIRTHDAY,$=id=>document.getElementById(id),NS='http://www.w3.org/2000/svg';
const key='wfh-dancing-v2',reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
let state=G.makeState(),selected=null,busy=false,showBeam=true,policeMoving=false;
try{const saved=JSON.parse(localStorage.getItem(key));if(saved&&saved.phase==='won'&&saved.position===37)saved.position=G.HOME;if(saved&&saved.phase==='dance')saved.phase='action';if(saved&&G.validState({...G.makeState(),...saved}))state={...G.makeState(),...saved};}catch{}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(state));}catch{}};
const sleep=ms=>new Promise(r=>setTimeout(r,reduced?0:ms));
const svg=(tag,attrs,parent)=>{const el=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,v));parent.append(el);return el;};
const center=n=>{const {c,r}=G.xy(n);return {x:100+c*100,y:204+r*88};};
function text(parent,x,y,copy,attrs={}){const el=svg('text',{x,y,fill:'#c9bdd6','font-family':'monospace','font-size':12,...attrs},parent);el.textContent=copy;return el;}
const furniture=$('furniture');
// House zones and furniture are scenery; interior walls block movement.
const zones=[{x:40,y:143,w:510,h:281,color:'#668c80',label:'KITCHEN',labelX:162,labelY:180},{x:650,y:143,w:310,h:193,color:'#788aa5',label:'LAUNDRY',labelY:180},{x:40,y:512,w:310,h:185,color:'#9b866c',label:'HOME OFFICE',labelX:62},{x:450,y:512,w:200,h:185,color:'#698f73',label:'PLANT CORNER'}];
for(const z of zones){svg('rect',{x:z.x,y:z.y,width:z.w,height:z.h,fill:z.color,opacity:.24,rx:8},furniture);text(furniture,z.labelX??z.x+12,z.labelY??z.y+20,z.label,{'font-size':14,'letter-spacing':1.5,fill:'#eee8d9'});}
// Dad's office reaches the house's right and bottom walls.
const office=svg('g',{'aria-label':"Dad’s office"},furniture);
svg('rect',{x:650,y:512,width:310,height:185,fill:'#736a8b',opacity:.5},office);

text(office,662,532,'DAD’S OFFICE',{'font-size':14,'letter-spacing':1.5,fill:'#eee3ef'});
// Dad shares Mom's proportions, dancing pose and halo, with short hair and glasses.
const dadSpot=center(G.DAD),dad=svg('g',{transform:`translate(${dadSpot.x} ${dadSpot.y-9})`,'aria-label':'Dad'},office);
const dadBeacon=svg('circle',{cx:0,cy:0,r:36,fill:'#b9e4ce',class:'target-halo'},dad);
svg('ellipse',{cx:0,cy:20,rx:20,ry:7,fill:'#151622',opacity:.4},dad);
svg('path',{d:'M-6 3l-10 17m20 -15l13 12',stroke:'#a9d5c4','stroke-width':7,'stroke-linecap':'round'},dad);
svg('path',{d:'M-11 -13l-10 -9m32 10l12 -6',stroke:'#a9d5c4','stroke-width':6,'stroke-linecap':'round'},dad);
svg('rect',{x:-11,y:-19,width:22,height:28,rx:8,fill:'#a9d5c4'},dad);
svg('circle',{cx:0,cy:-30,r:10,fill:'#d9b7a5'},dad);
svg('path',{d:'M-10 -30q-3 -15 10 -15q14 0 10 15l-5 -8h-10Z',fill:'#77717a'},dad);
svg('path',{d:'M-8 -31h6v5h-6Zm10 0h6v5h-6Zm-4 2h4',fill:'none',stroke:'#393442','stroke-width':1.5},dad);
text(dad,0,48,'DAD',{'text-anchor':'middle','font-size':12,fill:'#dfefcf','font-weight':700});
// Laptop at the start and finish tile.
const laptopSpot=center(G.HOME),laptop=svg('g',{transform:`translate(${laptopSpot.x} ${laptopSpot.y})`,'aria-label':'Laptop'},furniture);const laptopHalo=svg('circle',{cx:0,cy:0,r:39,fill:'#d9ef83',stroke:'#e6f6aa','stroke-width':2,class:'target-halo',visibility:'hidden'},laptop);svg('rect',{x:-36,y:-18,width:72,height:44,rx:4,fill:'#292d40',stroke:'#c4bfd1','stroke-width':3},laptop);svg('rect',{x:-29,y:-11,width:58,height:29,rx:2,fill:'#8fbac1'},laptop);svg('path',{d:'M-36 28h72l12 10h-96Z',fill:'#d0c9d7'},laptop);text(furniture,laptopSpot.x,laptopSpot.y+48,'LAPTOP',{'text-anchor':'middle','font-size':10,fill:'#e3edb4'});
// Walls follow square boundaries, with gaps for doorways.
const walls=svg('g',{'aria-label':'Interior walls with open doorways'},furniture);
for(const [a,b] of G.WALLS){const p=center(a),q=center(b),vertical=p.y===q.y,x=(p.x+q.x)/2,y=(p.y+q.y)/2;
const d=vertical?`M${x} ${y===204?143:y-44}V${y===644?697:y+44}`:`M${x===100?40:x-50} ${y}H${x===900?960:x+50}`;
svg('path',{d,fill:'none',stroke:'#292733','stroke-width':16,'stroke-linecap':'square'},walls);
svg('path',{d,fill:'none',stroke:'#c9b9cf','stroke-width':9,'stroke-linecap':'square'},walls);
svg('path',{d,fill:'none',stroke:'#eee0e5','stroke-width':2,opacity:.6},walls);
}
// Fixed player silhouette.
const avatar=$('player-layer');
const shieldHeart=svg('path',{d:'M0 38C-76 -6 -48 -70 0 -39C48 -70 76 -6 0 38Z',fill:'#f5a0c1','fill-opacity':.12,stroke:'#ff9bc7','stroke-width':4,class:'dad-heart-glow',visibility:'hidden'},avatar);
svg('ellipse',{cx:0,cy:20,rx:20,ry:7,fill:'#151622',opacity:.4},avatar);svg('path',{d:'M-6 3l-10 17m20 -15l13 12',stroke:'#d9ef83','stroke-width':7,'stroke-linecap':'round'},avatar);svg('path',{d:'M-11 -13l-10 -9m32 10l12 -6',stroke:'#d9ef83','stroke-width':6,'stroke-linecap':'round'},avatar);svg('rect',{x:-11,y:-19,width:22,height:28,rx:8,fill:'#d9ef83'},avatar);svg('circle',{cx:0,cy:-30,r:10,fill:'#d9b7a5'},avatar);svg('path',{d:'M-10 -30q-4 -15 9 -15q17 2 11 19l-5 -9 -10 0',fill:'#2b2434'},avatar);svg('circle',{cx:9,cy:-43,r:6,fill:'#2b2434'},avatar);svg('rect',{x:-21,y:-67,width:42,height:17,rx:3,fill:'#d9ef83'},avatar);text(avatar,0,-55,'YOU',{'text-anchor':'middle','font-size':10,fill:'#282d24','font-weight':700});
const tiles=[];for(let n=0;n<54;n++){const button=document.createElement('button');button.className='tile';button.disabled=true;button.setAttribute('aria-label',`Row ${G.xy(n).r+1}, column ${G.xy(n).c+1}: ${G.tileName(n)}`);button.innerHTML='<span class="cost"></span>';button.addEventListener('click',()=>choose(n));button.addEventListener('mouseenter',()=>{if(state.phase==='choose'&&!busy)drawRoute(n);});button.addEventListener('focus',()=>{if(state.phase==='choose'&&!busy)drawRoute(n);});button.addEventListener('mouseleave',()=>drawRoute(selected));tiles.push(button);$('tile-grid').append(button);}
$('note-heading').textContent=C.note.heading;C.note.paragraphs.forEach(copy=>{const p=document.createElement('p');p.textContent=copy;$('note-copy').append(p);});$('note-signature').textContent=C.note.signature;$('note-from').textContent=C.note.from;
function drawBeams(){
const layer=$('beam-layer');layer.replaceChildren();
const zone=svg('g',{id:'next-beam'},layer);
for(const n of G.dangerCells(state)){const p=center(n);svg('rect',{x:p.x-49,y:p.y-43,width:98,height:86,fill:'#edbd77',opacity:.18,stroke:'#edbd77','stroke-width':1},zone);}
if(!policeMoving)return;
const origin=center(state.enemy),from={x:origin.x+30,y:origin.y+4},to=center(state.position),dx=to.x-from.x,dy=to.y-from.y,len=Math.hypot(dx,dy)||1,nx=-dy/len*24,ny=dx/len*24;
svg('path',{d:`M${from.x} ${from.y} L${to.x+nx} ${to.y+ny} L${to.x-nx} ${to.y-ny}Z`,fill:'#ffd78e',opacity:.27},layer);
svg('path',{d:`M${from.x} ${from.y} L${to.x} ${to.y}`,stroke:'#ffda98','stroke-width':3,'stroke-dasharray':'8 6',opacity:.85},layer);
svg('circle',{cx:to.x,cy:to.y,r:33,fill:'none',stroke:'#ffda98','stroke-width':2},layer);
const path=[state.enemy,...G.chasePath(state)];svg('polyline',{points:path.map(n=>{const p=center(n);return `${p.x},${p.y}`;}).join(' '),fill:'none',stroke:'#f69870','stroke-width':6,'stroke-linecap':'round','stroke-linejoin':'round'},layer);
path.slice(1).forEach((n,i)=>{const p=center(n);svg('circle',{cx:p.x,cy:p.y,r:12,fill:'#f69870'},layer);text(layer,p.x,p.y+4,String(i+1),{'text-anchor':'middle',fill:'#29212a','font-size':12,'font-weight':700});});
}

function drawInspector(){const layer=$('patrol-layer');layer.replaceChildren();const p=center(state.enemy),g=svg('g',{transform:`translate(${p.x} ${p.y-20})`,class:'inspector'},layer);svg('ellipse',{cx:0,cy:31,rx:25,ry:8,fill:'#171520',opacity:.5},g);svg('path',{d:'M-12 8l-8 26h40L12 8Z',fill:'#364d78',stroke:'#9eafd4','stroke-width':2},g);svg('circle',{cx:0,cy:-4,r:12,fill:'#b9a2a5'},g);svg('path',{d:'M-20 -10h40M-12 -13l4 -14H8l4 14',stroke:'#15151f','stroke-width':7,fill:'#15151f','stroke-linejoin':'round'},g);svg('path',{d:'M-8 -3h6m4 0h6',stroke:'#171821','stroke-width':4},g);svg('path',{d:'M12 16l15 9',stroke:'#e2a190','stroke-width':5,'stroke-linecap':'round'},g);svg('path',{d:'M25 19l10 1 -1 13 -10 -4Z',fill:'#e5c698'},g);text(g,0,-42,'WFH POLICE',{'text-anchor':'middle','font-size':10,fill:'#f2b799'});}
function drawRecords(){const layer=$('record-layer');layer.replaceChildren();G.TASKS.forEach(t=>{const p=center(t.tile),done=state.cds.includes(t.tile),group=svg('g',{transform:`translate(${p.x} ${p.y})`},layer);if(!done)svg('circle',{cx:0,cy:0,r:35,fill:'#f0ddb0',class:'target-halo'},group);svg('circle',{cx:0,cy:0,r:27,fill:done?'#b7cc83':'#f0e6cf',opacity:done?.55:1,stroke:done?'#d9ef83':'#fff6e5','stroke-width':2},group);text(group,0,9,done?'✓':t.icon,{'text-anchor':'middle','font-size':29,fill:'#33412f','font-family':'sans-serif'});text(group,0,43,t.name.toUpperCase(),{'text-anchor':'middle','font-size':11,fill:'#f1eee6','font-weight':700});});$('record-slots').replaceChildren();G.TASKS.forEach(t=>{const done=state.cds.includes(t.tile),slot=document.createElement('div');slot.className='record-slot task-slot'+(done?' found':'');slot.innerHTML=`<div class="task-icon">${done?'✓':t.icon}</div><small>${t.name}</small>`;slot.setAttribute('aria-label',t.name+': '+(done?'done':'to do'));$('record-slots').append(slot);});}
function drawRoute(to){const layer=$('route-layer');layer.replaceChildren();if(to===null||state.phase!=='choose'||busy)return;const route=G.route(state.position,to,state.budget);if(!route.length)return;svg('polyline',{points:route.map(n=>{const p=center(n);return `${p.x},${p.y}`;}).join(' '),stroke:'#d9ef83','stroke-width':3,fill:'none',class:'route-line'},layer);const p=center(to);svg('circle',{cx:p.x,cy:p.y,r:32,fill:'none',stroke:'#d9ef83','stroke-width':2,'stroke-dasharray':'4 5'},layer);const chase=G.route(state.enemy,to).slice(0,3);svg('polyline',{points:chase.map(n=>{const p=center(n);return `${p.x},${p.y}`;}).join(' '),stroke:'#efa785','stroke-width':4,fill:'none','stroke-dasharray':'3 7'},layer);}
function render(){const choosing=state.phase==='choose',acting=state.phase==='action',won=state.phase==='won';$('instruction').textContent=choosing?`Up to ${state.budget} ${state.budget===1?'step':'steps'}.`:'';$('instruction').hidden=!choosing;document.querySelector('.brand-sub').hidden=won;document.querySelector('.legend').hidden=won;$('turn-label').textContent=won?'♥':`TURN ${state.turn+1}`;$('roll').hidden=choosing||acting;$('replay-finale').hidden=!won;$('dice').hidden=won;$('toggle-light').hidden=won;$('dad-status').hidden=won;$('roll').disabled=busy;$('roll').classList.toggle('action-ready',state.phase==='roll'&&!busy);dadBeacon.setAttribute('visibility',state.dadVisited||won?'hidden':'visible');laptop.classList.toggle('goal-ready',state.cds.length===G.CDS.length&&!won);laptopHalo.setAttribute('visibility',state.cds.length===G.CDS.length&&!won?'visible':'hidden');$('dice').disabled=busy||state.phase!=='roll';$('roll').textContent=won?'Open your note →':'Roll dice';$('move').hidden=!choosing;$('resume').hidden=!acting;$('resume').disabled=busy;$('move').disabled=selected===null||busy;$('destination').hidden=!choosing||selected===null;
if(choosing&&selected!==null){const steps=G.reachable(state.position,state.budget).distance.get(selected),danger=G.dangerCells(state).has(selected)||G.route(state.position,selected,state.budget).includes(state.enemy);$('move').textContent=`Move ${steps} →`;$('destination-name').textContent=G.CDS.includes(selected)?G.tileName(selected):`${steps} ${steps===1?'step':'steps'}`;$('destination-risk').textContent=danger?(state.shield?'Dad’s shield can save you here.':'He can catch you here.'):'Out of reach.';$('destination').classList.toggle('danger',danger);}else $('move').textContent='Choose a square';
$('turn-note').textContent=state.last;$('turn-note').hidden=won||!state.last;$('dad-status').textContent=state.shield?'💗 Dad’s got you · shield ready':state.dadVisited?'💗 Thanks, Dad · shield used':'💗 Visit Dad for a one-use shield';$('record-count').textContent=`${state.cds.length} / 3 done`;
const reachable=choosing?G.reachable(state.position,state.budget).distance:new Map(),danger=G.dangerCells(state);tiles.forEach((b,n)=>{const can=choosing&&reachable.has(n)&&n!==state.position&&!busy,steps=reachable.get(n);b.disabled=!can;b.className='tile'+(G.BLOCKED.has(n)?' obstacle':'')+(can?' reachable':'')+(n===selected?' selected':'');b.querySelector('.cost').textContent=can?String(steps):'';b.title=G.BLOCKED.has(n)?'Wall — blocks your path':can?`Move here · ${steps} ${steps===1?'step':'steps'}`:choosing?(n===state.position?'You are here':'Not reachable on this roll'):'Roll dice to see where you can move';b.setAttribute('aria-pressed',String(n===selected));b.setAttribute('aria-label',`${G.BLOCKED.has(n)?'Wall — blocks your path':G.tileName(n)}${can?`, ${steps} ${steps===1?'step':'steps'}, ${danger.has(n)?'danger':'out of reach'}`:''}`);});
const p=center(state.position);shieldHeart.setAttribute('visibility',state.shield?'visible':'hidden');avatar.setAttribute('transform',`translate(${p.x} ${p.y-9})`);drawBeams();drawInspector();drawRecords();drawRoute(selected);if(won)drawFinale(false);else clearFinale();
}
function choose(n){if(state.phase!=='choose'||busy||n===state.position||!G.reachable(state.position,state.budget).distance.has(n))return;selected=n;render();}
function die(n){$('dice').replaceChildren();const pattern={1:[5],2:[1,9],3:[1,5,9],4:[1,3,7,9],5:[1,3,5,7,9],6:[1,3,4,6,7,9]};pattern[n].forEach(k=>{const pip=document.createElement('i');pip.className='pip';pip.style.gridArea=`${Math.floor((k-1)/3)+1} / ${(k-1)%3+1}`;$('dice').append(pip);});$('dice').setAttribute('aria-label',`Dice showing ${n}`);}
function clearDie(){$('dice').innerHTML='<span>?</span>';$('dice').setAttribute('aria-label','Roll dice');}
async function roll(){if(busy)return;if(state.phase==='won'){openPrize();return;}if(state.phase!=='roll')return;busy=true;render();$('dice').classList.add('rolling');const n=crypto.getRandomValues(new Uint32Array(1))[0]%6+1;for(let i=0;i<7;i++){die((i+n)%6+1);await sleep(65);}die(n);$('dice').classList.remove('rolling');state.budget=n;state.phase='choose';selected=null;busy=false;state.last='';save();render();}
function showCaught(){state=G.caught();selected=null;busy=false;save();render();clearDie();$('caught-dialog').showModal();}
async function move(to){
if(state.phase!=='choose'||busy||!G.reachable(state.position,state.budget).distance.has(to))return;
busy=true;const path=G.route(state.position,to,state.budget);render();
for(const n of path.slice(1)){state.position=n;render();await sleep(170);if(n===state.enemy){if(state.shield){state.shield=false;state.enemy=state.position===G.START_ENEMY?0:G.START_ENEMY;state.last='Dad distracted the WFH police. Shield used!';}else{showCaught();return;}}}
const firstDad=to===G.DAD&&!state.dadVisited;state=G.visitDad(state);selected=null;
if(G.atGoal(state)){state.phase='won';state.budget=0;busy=false;save();render();openPrize();return;}
if(G.needsAction(state)||firstDad){state.phase='action';busy=false;save();render();openAction();}
else await finishTurn();
}
async function finishTurn(){
if(state.phase==='won')return;
busy=true;policeMoving=true;
if($('action-dialog').open)$('action-dialog').close();
const next=G.resolveTurn(state),path=G.chasePath(state);
for(const n of path){state.enemy=n;render();await sleep(550);}
policeMoving=false;
if(next.last==='Caught. Start again.'){showCaught();return;}
state=next;busy=false;save();render();if(state.phase==='won')openPrize();
}
function openAction(){
if(state.phase!=='action'||busy)return;
const kind=state.position===G.DAD?'dad':state.position===0?'lunch':state.position===17?'laundry':state.position===50?'plants':null;
if(!kind){finishTurn();return;}
const content={lunch:['the kitchen','Lunch is ready →'],laundry:['the laundry','Laundry is spinning →'],plants:['the plant corner','Plants are watered →'],dad:["Dad’s office",'Thanks, Dad ♥']};

$('action-caption').textContent=kind==='dad'?'Dad’s got you. One catch forgiven.':'';$('action-caption').hidden=kind!=='dad';
$('action-done').textContent=content[kind][1];drawAction(kind);
if(!$('action-dialog').open)$('action-dialog').showModal();
}
function drawAction(kind){
const stage=$('action-scene');stage.replaceChildren();stage.setAttribute('class','action-scene scene-'+kind);
stage.setAttribute('aria-label',{lunch:'Mom stirring a pan on the stove',laundry:'Mom putting clothes into a spinning washing machine',plants:'Mom watering a plant',dad:'Mom and Dad sharing a hug with pink hearts'}[kind]);
svg('rect',{x:0,y:0,width:400,height:245,rx:20,fill:'#333546'},stage);svg('ellipse',{cx:200,cy:213,rx:155,ry:13,fill:'#242633'},stage);
function person(x,y,color,isDad=false){const person=svg('g',{transform:`translate(${x} ${y})`},stage),body=svg('g',{class:isDad?'scene-dad':'scene-mom'},person);svg('path',{d:'M-10 16l-12 43m31 -43l14 43',stroke:color,'stroke-width':13,'stroke-linecap':'round'},body);svg('rect',{x:-21,y:-33,width:42,height:57,rx:16,fill:color},body);svg('circle',{cx:0,cy:-54,r:20,fill:'#d9b7a5'},body);svg('path',{d:'M-20 -55q-5 -31 20 -31q28 0 20 31l-10 -16h-20Z',fill:isDad?'#77717a':'#2b2434'},body);for(const x of [-6,6])svg('circle',{cx:x,cy:-52,r:1.8,fill:'#45353c'},body);svg('path',{d:'M-5 -43q5 5 10 0',stroke:'#9f6e6b','stroke-width':2,fill:'none','stroke-linecap':'round'},body);if(!isDad)svg('circle',{cx:18,cy:-80,r:10,fill:'#2b2434'},body);else svg('path',{d:'M-15 -57h11v9h-11Zm19 0h11v9H4Zm-8 4h8',fill:'none',stroke:'#393442','stroke-width':2},body);return body;}
if(kind==='lunch'){
const mom=person(145,151,'#d9ef83');svg('path',{d:'M17 -16l62 -3',stroke:'#d9ef83','stroke-width':12,'stroke-linecap':'round',class:'stir-arm'},mom);
svg('rect',{x:205,y:139,width:126,height:69,rx:9,fill:'#9c98b0'},stage);svg('ellipse',{cx:265,cy:140,rx:37,ry:10,fill:'#e5aa78'},stage);svg('path',{d:'M225 122q2 39 77 0Z',fill:'#454454',stroke:'#bcb8c5','stroke-width':3},stage);svg('path',{d:'M300 124h30',stroke:'#454454','stroke-width':8,'stroke-linecap':'round'},stage);
const spoon=svg('g',{class:'scene-spoon'},stage);svg('path',{d:'M259 121l-35 11',stroke:'#d4b28a','stroke-width':6,'stroke-linecap':'round'},spoon);svg('ellipse',{cx:259,cy:120,rx:9,ry:4,fill:'#d4b28a'},spoon);
for(const x of [245,266,285])svg('path',{d:`M${x} 98q-9 -12 0 -23q9 -12 0 -22`,fill:'none',stroke:'#eee2ce','stroke-width':3,class:'scene-steam'},stage);
}else if(kind==='laundry'){
const mom=person(105,151,'#d9ef83');svg('path',{d:'M15 -14l49 18',stroke:'#d9ef83','stroke-width':12,'stroke-linecap':'round'},mom);
svg('rect',{x:216,y:89,width:118,height:122,rx:12,fill:'#c4ced0'},stage);svg('circle',{cx:275,cy:155,r:40,fill:'#617986',stroke:'#f1eee0','stroke-width':8},stage);const drum=svg('g',{class:'scene-drum'},stage);svg('path',{d:'M258 132q34 -7 35 23q-2 28 -31 22q-20 -13 -4 -45',fill:'#bda8d5'},drum);svg('path',{d:'M260 145l25 19',stroke:'#a9d5c4','stroke-width':13,'stroke-linecap':'round'},drum);svg('circle',{cx:315,cy:107,r:4,fill:'#8eae80'},stage);
const shirt=svg('g',{class:'scene-shirt'},stage);svg('path',{d:'M157 135l16 -8 16 8 9 14 -12 5v22h-27v-22l-12 -5Z',fill:'#eab0ba'},shirt);
}else if(kind==='plants'){
const mom=person(112,151,'#d9ef83');svg('path',{d:'M16 -15l45 0',stroke:'#d9ef83','stroke-width':12,'stroke-linecap':'round'},mom);
svg('path',{d:'M251 169h61l-10 41h-42Z',fill:'#c88d8f'},stage);svg('path',{d:'M280 170v-53',stroke:'#9bb889','stroke-width':5},stage);svg('path',{d:'M280 144q-56 -7 -31 -37q31 2 31 37m0 10q54 -10 36 -40q-34 0 -36 40',fill:'#9bb889',class:'scene-leaves'},stage);
const can=svg('g',{class:'scene-can'},stage);svg('path',{d:'M170 114h42v30h-42Z',fill:'#a9c7c0'},can);svg('path',{d:'M210 125l31 -18 6 10 -33 22',fill:'#a9c7c0'},can);svg('path',{d:'M173 117q-30 -20 -29 9q2 18 28 12',fill:'none',stroke:'#a9c7c0','stroke-width':6},can);
for(const [i,x]of [251,264,277].entries())svg('path',{d:`M${x} 127l-3 15`,stroke:'#afdce5','stroke-width':4,'stroke-linecap':'round',class:'scene-water',style:`animation-delay:${i*.2}s`},stage);
}else{
const mom=person(163,151,'#d9ef83'),father=person(219,151,'#a9d5c4',true);svg('path',{d:'M-14 -15q44 27 74 -7',fill:'none',stroke:'#d9ef83','stroke-width':12,'stroke-linecap':'round'},mom);svg('path',{d:'M15 -12q-37 32 -68 -4',fill:'none',stroke:'#a9d5c4','stroke-width':12,'stroke-linecap':'round'},father);
for(const [i,x]of [129,202,272].entries()){const heart=svg('g',{transform:`translate(${x} ${63-i%2*20})`},stage);svg('path',{d:'M0 12C-25 -2 -13 -23 0 -12C13 -23 25 -2 0 12Z',fill:'#f4a3c9',class:'scene-heart',style:`animation-delay:${i*.3}s`},heart);}
}
}
function clearFinale(){
$('ending-layer').replaceChildren();$('room').classList.remove('ending-room');$('room-art').setAttribute('viewBox','0 130 1000 575');avatar.removeAttribute('visibility');dad.removeAttribute('visibility');avatar.style.removeProperty('display');dad.style.removeProperty('display');$('tile-grid').hidden=false;
}
function drawFinale(animate){
const layer=$('ending-layer');layer.replaceChildren();$('room').classList.add('ending-room');$('room-art').setAttribute('viewBox','0 130 1220 575');$('tile-grid').hidden=true;avatar.setAttribute('visibility','hidden');dad.setAttribute('visibility','hidden');avatar.style.display='none';dad.style.display='none';$('beam-layer').replaceChildren();$('route-layer').replaceChildren();
// A small garden outside the right-hand wall makes the eviction legible.
svg('rect',{x:973,y:137,width:239,height:566,rx:14,fill:'#283c3b'},layer);svg('path',{d:'M982 655q85 -22 220 0v42H982Z',fill:'#4f6e5b'},layer);text(layer,1090,177,'OUTSIDE',{'text-anchor':'middle','font-size':13,'letter-spacing':3,fill:'#b8d1bd'});
for(const [x,y]of [[1004,652],[1158,671],[1184,637]]){svg('path',{d:`M${x} ${y+18}v-26m0 10l-11 -10m11 14l12 -9`,stroke:'#88ad84','stroke-width':3,fill:'none'},layer);svg('circle',{cx:x,cy:y-13,r:5,fill:'#e1bdab'},layer);}
// An open door and a little boot send the police into the garden.
svg('path',{d:'M960 495v127',stroke:'#c1b0c8','stroke-width':15},layer);svg('path',{d:'M960 495l-35 25v101l35 1Z',fill:'#a28a7c',stroke:'#d8bca3','stroke-width':3},layer);svg('circle',{cx:936,cy:567,r:3,fill:'#f3dd9c'},layer);
const launch=center(state.enemy);const boot=svg('g',{transform:`translate(${launch.x-35} ${launch.y-7})`,visibility:animate?'visible':'hidden'},layer),bootMotion=svg('g',{class:animate?'final-boot':''},boot);svg('path',{d:'M-27 -17h26v17q26 -2 30 13v9h-62v-14l6 -8Z',fill:'#d9ef83',stroke:'#eaf7b9','stroke-width':2},bootMotion);
// Reuse the same Mom-and-Dad action artwork, without its card background.
drawAction('dad');const source=$('action-scene'),couple=svg('g',{transform:'translate(320 365) scale(1.22)',class:'final-couple','aria-label':'Mom, Dad, Cassandra and her sister together inside the house'},layer);
const heart=svg('path',{d:'M190 192C-17 71 83 -75 190 3C297 -75 397 71 190 192Z',fill:'#f5a0c1','fill-opacity':.07,stroke:'#ffadd2','stroke-width':3,class:'final-heart-glow'},couple);
Array.from(source.children).slice(2).forEach(el=>couple.append(el.cloneNode(true)));
// The daughters share the family character style, with distinct shirts and hair.
for(const [x,color,right]of [[96,'#c6afe9',false],[286,'#e9adb4',true]]){
const daughter=source.children[2].cloneNode(true);daughter.setAttribute('transform',`translate(${x} 155) scale(.94)`);daughter.setAttribute('aria-label',right?'Her sister':'Cassandra');
daughter.querySelectorAll('[fill="#d9ef83"]').forEach(el=>el.setAttribute('fill',color));daughter.querySelectorAll('[stroke="#d9ef83"]').forEach(el=>el.setAttribute('stroke',color));
const body=daughter.firstElementChild,arm=body.lastElementChild;arm.setAttribute('d',right?'M15 -15q-30 28 -56 -5':'M-15 -15q30 28 56 -5');
body.querySelectorAll('[fill="#2b2434"]').forEach(el=>el.remove());
const hair=svg('path',{d:right?'M-22 -51Q-28 -88 -1 -87Q27 -86 23 -49L24 -30Q5 -23 -24 -30Z':'M-22 -52Q-28 -89 -1 -88Q29 -87 23 -48L28 -1Q13 5 6 -1L-8 -1Q-20 6 -28 0Z',fill:'#2b2434'},body);body.insertBefore(hair,body.firstChild);
svg('path',{d:right?'M-21 -55Q-25 -85 0 -86Q25 -85 21 -53L14 -66Q-2 -58 -15 -69Z':'M-21 -55Q-25 -86 0 -87Q26 -85 21 -54L14 -68Q5 -76 0 -71Q-9 -65 -16 -68Z',fill:'#2b2434'},body);
couple.append(daughter);
}

// Clone the live police drawing so the finale uses the same character.
drawInspector();const original=$('patrol-layer').firstElementChild,police=original.cloneNode(true);police.removeAttribute('transform');police.setAttribute('class','');$('patrol-layer').replaceChildren();const landing=svg('g',{transform:'translate(1100 589)'},layer),motion=svg('g',{class:animate?'police-launch':'police-outside','aria-label':'WFH police booted outside','data-start-tile':state.enemy},landing);motion.append(police);
if(animate&&!reduced){
const dx=launch.x-1100,dy=launch.y-20-589,controlX=dx*.45,controlY=Math.min(dy,0)-165;
const frames=[{transform:`translate(${dx}px,${dy}px) rotate(0deg)`,offset:0},{transform:`translate(${dx}px,${dy}px) rotate(0deg)`,offset:.16}];
for(let i=1;i<=24;i++){const t=i/24,u=1-t,x=u*u*dx+2*u*t*controlX,y=u*u*dy+2*u*t*controlY;frames.push({transform:`translate(${x}px,${y}px) rotate(${374*t}deg)`,offset:.16+.84*t});}
motion.animate(frames,{duration:1900,easing:'linear',fill:'both'});
}else motion.setAttribute('class','police-outside');
const stars=svg('g',{class:animate?'final-stars':'final-stars still'},landing);for(const [i,x]of [-30,0,30].entries())text(stars,x,-70-i%2*12,'✦',{'text-anchor':'middle','font-size':18,fill:'#edcd8d'});
}
function openPrize(){$('final-score').textContent=`ALL THREE TASKS COMPLETE`;if(!$('prize-dialog').open)$('prize-dialog').showModal();}
$('replay-finale').addEventListener('click',()=>{if(state.phase==='won')drawFinale(true);});$('prize-dialog').addEventListener('close',()=>{if(state.phase==='won')drawFinale(true);});$('roll').addEventListener('click',roll);$('dice').addEventListener('click',roll);$('move').addEventListener('click',()=>{if(selected!==null)move(selected);});$('resume').addEventListener('click',openAction);$('action-done').addEventListener('click',()=>{if(state.phase==='action'&&!busy)finishTurn();});$('action-dialog').addEventListener('cancel',e=>e.preventDefault());
$('how').addEventListener('click',()=>$('help-dialog').showModal());$('restart').addEventListener('click',()=>{if(!busy)$('restart-dialog').showModal();});$('confirm-restart').addEventListener('click',()=>{if(busy)return;state=G.makeState();selected=null;save();render();clearDie();$('restart-dialog').close();});document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>$(b.dataset.close).close()));$('toggle-light').addEventListener('click',()=>{showBeam=!showBeam;$('room').classList.toggle('beam-hidden',!showBeam);$('toggle-light').setAttribute('aria-pressed',String(showBeam));$('toggle-light').innerHTML=showBeam?'Danger zone <span>◉</span>':'Danger zone <span>○</span>';});
if(state.budget)die(state.budget);render();if(state.phase==='action')openAction();
})();
