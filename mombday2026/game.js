(function(root){
'use strict';
const COLS=9,ROWS=6,HOME=46,START_ENEMY=4,CDS=[0,17,50],CHASE_STEPS=2,DAD=44;
const TASKS=[{tile:0,icon:"🍳",name:"Lunch",action:"Cook lunch",done:"Lunch is ready.",quote:"A proper lunch deserves a proper soundtrack."},{tile:17,icon:"👕",name:"Laundry",action:"Start the laundry",done:"Laundry is spinning.",quote:"The spin cycle can wait. This chorus can’t."},{tile:50,icon:"🪴",name:"Plants",action:"Water the plants",done:"Plants are watered.",quote:"You’re allowed to grow at your own pace."}];
// Walls separate neighboring squares; furniture is scenery.
const BLOCKED=new Set();
const WALLS=[[4,5],[22,23],[18,27],[20,29],[21,30],[14,15],[15,24],[16,25],[33,42],[34,43],[50,51],[27,36],[29,38],[47,48]];
const edgeKey=(a,b)=>a<b?a+':'+b:b+':'+a;
const wallEdges=new Set(WALLS.map(([a,b])=>edgeKey(a,b)));
const hasWall=(a,b)=>wallEdges.has(edgeKey(a,b));
const validTile=n=>Number.isInteger(n)&&n>=0&&n<COLS*ROWS&&!BLOCKED.has(n);
const xy=n=>({c:n%COLS,r:Math.floor(n/COLS)});
function neighbors(n){const {c,r}=xy(n);return [[c-1,r],[c+1,r],[c,r-1],[c,r+1]].filter(([x,y])=>x>=0&&x<COLS&&y>=0&&y<ROWS).map(([x,y])=>y*COLS+x).filter(next=>validTile(next)&&!hasWall(n,next));}
function reachable(from,budget=6){const distance=new Map([[from,0]]),parent=new Map(),queue=[from];for(let i=0;i<queue.length;i++){const n=queue[i];if(distance.get(n)>=budget)continue;for(const next of neighbors(n))if(!distance.has(next)){distance.set(next,distance.get(n)+1);parent.set(next,n);queue.push(next);}}return {distance,parent};}
function route(from,to,budget=54){const {distance,parent}=reachable(from,budget);if(!distance.has(to))return [];const result=[to];while(result[0]!==from)result.unshift(parent.get(result[0]));return result;}
const dangerCells=s=>new Set(reachable(s.enemy,CHASE_STEPS).distance.keys());
function makeState(){return {position:HOME,enemy:START_ENEMY,turn:0,cds:[],phase:'roll',budget:0,shield:false,dadVisited:false,last:''};}
function validState(s){return s&&typeof s.shield==='boolean'&&typeof s.dadVisited==='boolean'&&validTile(s.position)&&validTile(s.enemy)&&Number.isInteger(s.turn)&&s.turn>=0&&s.turn<10000&&Array.isArray(s.cds)&&new Set(s.cds).size===s.cds.length&&s.cds.every(n=>CDS.includes(n))&&['roll','choose','action','won'].includes(s.phase)&&Number.isInteger(s.budget)&&s.budget>=0&&s.budget<=6&&typeof s.last==='string'&&s.last.length<200&&(s.phase!=='choose'||s.budget>=1)&&(s.phase!=='won'||s.position===HOME&&s.cds.length===3);}
const caught=()=>({...makeState(),last:'Caught. Start again.'});
function chasePath(s){const path=route(s.enemy,s.position).slice(1,CHASE_STEPS+1);return s.shield&&path.at(-1)===s.position?path.slice(0,-1):path;}
function resolveTurn(s){const path=chasePath(s),enemy=path.at(-1)??s.enemy;if(enemy===s.position&&!s.shield)return caught();const next={...s,enemy,turn:s.turn+1,cds:[...s.cds],phase:'roll',budget:0,last:''};if(s.shield&&dangerCells(s).has(s.position)){next.shield=false;next.last='Dad distracted the WFH police. Shield used!';}if(CDS.includes(s.position)&&!next.cds.includes(s.position)){next.cds.push(s.position);next.last=TASKS.find(t=>t.tile===s.position).done;}if(next.cds.length===3&&s.position===HOME){next.phase='won';next.last='You made it.';}return next;}
const atGoal=s=>s.position===HOME&&s.cds.length===CDS.length;
const needsAction=s=>CDS.includes(s.position)&&!s.cds.includes(s.position);
function visitDad(s){return s.position===DAD&&!s.dadVisited?{...s,shield:true,dadVisited:true,last:'Dad’s got you. One catch forgiven!'}:s;}
function tileName(n){if(n===HOME)return 'Laptop';if(n===DAD)return 'Visit Dad';if(CDS.includes(n))return TASKS.find(t=>t.tile===n).action;return `Row ${xy(n).r+1}, column ${xy(n).c+1}`;}
const api={atGoal,needsAction,visitDad,DAD,TASKS,COLS,ROWS,HOME,START_ENEMY,CDS,CHASE_STEPS,BLOCKED,WALLS,hasWall,validTile,xy,neighbors,reachable,route,dangerCells,makeState,validState,resolveTurn,chasePath,caught,tileName};if(typeof module!=='undefined')module.exports=api;else root.SecretDance=api;
})(typeof window!=='undefined'?window:this);
