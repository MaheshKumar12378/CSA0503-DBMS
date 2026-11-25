// Video Game Regional Sales Analytics: interactive student project demo.
const sampleGames = [
 {rank:1,name:"Galaxy Quest",platform:"PS4",year:2018,genre:"Action",publisher:"Nova Studios",NA:4.8,EU:3.9,JP:1.1,Other:1.2},
 {rank:2,name:"World Soccer Pro",platform:"PS4",year:2019,genre:"Sports",publisher:"Peak Games",NA:2.4,EU:5.1,JP:0.4,Other:1.0},
 {rank:3,name:"Kingdom Adventure",platform:"Switch",year:2020,genre:"Role-Playing",publisher:"Pixel Forge",NA:2.8,EU:2.2,JP:2.1,Other:0.6},
 {rank:4,name:"Racing Horizon",platform:"PS5",year:2021,genre:"Racing",publisher:"Nova Studios",NA:2.7,EU:2.6,JP:0.3,Other:0.8},
 {rank:5,name:"Battle Arena",platform:"PC",year:2022,genre:"Shooter",publisher:"Red Byte",NA:2.1,EU:1.8,JP:0.5,Other:0.7},
 {rank:6,name:"Puzzle Planet",platform:"Switch",year:2020,genre:"Puzzle",publisher:"Pixel Forge",NA:1.1,EU:1.4,JP:1.2,Other:0.3},
 {rank:7,name:"City Builder X",platform:"PC",year:2019,genre:"Simulation",publisher:"BrightWorks",NA:1.5,EU:1.6,JP:0.2,Other:0.4},
 {rank:8,name:"Mystic Legends",platform:"PS4",year:2017,genre:"Role-Playing",publisher:"Red Byte",NA:1.0,EU:0.8,JP:1.2,Other:0.2},
 {rank:9,name:"Speed Circuit",platform:"Xbox",year:2021,genre:"Racing",publisher:"Peak Games",NA:1.4,EU:1.0,JP:0.1,Other:0.3},
 {rank:10,name:"Brain Challenge",platform:"DS",year:2016,genre:"Puzzle",publisher:"BrightWorks",NA:0.8,EU:0.7,JP:0.9,Other:0.2},
 {rank:11,name:"Shadow Strike",platform:"PC",year:2022,genre:"Shooter",publisher:"Nova Studios",NA:1.0,EU:0.9,JP:0.2,Other:0.2},
 {rank:12,name:"Farm Life",platform:"Switch",year:2023,genre:"Simulation",publisher:"Pixel Forge",NA:0.7,EU:0.8,JP:0.5,Other:0.2},
 {rank:13,name:"Pro Basketball",platform:"Xbox",year:2018,genre:"Sports",publisher:"Peak Games",NA:1.1,EU:0.6,JP:0.1,Other:0.2},
 {rank:14,name:"Dragon Path",platform:"PS5",year:2023,genre:"Role-Playing",publisher:"Red Byte",NA:0.6,EU:0.5,JP:0.6,Other:0.1},
 {rank:15,name:"Mini Racer",platform:"DS",year:2015,genre:"Racing",publisher:"BrightWorks",NA:0.5,EU:0.6,JP:0.3,Other:0.1}
];
const regions=["NA","EU","JP","Other"];
const regionNames={NA:"North America",EU:"Europe",JP:"Japan",Other:"Other"};
const fmt=n=>Number(n||0).toFixed(1);
const STORAGE_KEY="vg_regional_sales_analytics_v2";
let games=loadGames();
const charts={};
Chart.defaults.color="#9eacc3";Chart.defaults.borderColor="#29364d";Chart.defaults.font.family="DM Sans";
function loadGames(){try{const saved=localStorage.getItem(STORAGE_KEY)||localStorage.getItem("gamescope_games");return saved?JSON.parse(saved):structuredClone(sampleGames)}catch{return structuredClone(sampleGames)}}
function persist(){localStorage.setItem(STORAGE_KEY,JSON.stringify(games));localStorage.setItem("gamescope_games",JSON.stringify(games));document.getElementById("last-updated").textContent="Local dataset · Saved just now"}
function total(arr,key){return arr.reduce((a,g)=>a+Number(g[key]||0),0)}
function globalSales(g){return regions.reduce((s,r)=>s+Number(g[r]||0),0)}
function groupSum(key,field,arr=games){const out={};arr.forEach(g=>{const k=g[key]??"Unknown";out[k]=(out[k]||0)+Number(g[field]||0)});return out}
function makeChart(id,type,labels,datasets,opts={}){if(charts[id])charts[id].destroy();const canvas=document.getElementById(id);if(!canvas)return;charts[id]=new Chart(canvas,{type,data:{labels,datasets},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:opts.legend??false,labels:{boxWidth:10,usePointStyle:true}},tooltip:{callbacks:{label:c=>`${c.dataset.label||"Sales"}: ${fmt(c.raw)}M`}}},scales:type==="doughnut"?{}:{x:{grid:{display:false},ticks:{maxRotation:opts.rotate?45:0,minRotation:0}},y:{beginAtZero:true,grid:{color:"#26334a"},title:{display:true,text:"Sales (millions)"}}},...opts.options}})}
function bar(id,labels,values,label="Sales",horizontal=false){makeChart(id,"bar",labels,[{label,data:values,backgroundColor:["#5d9cff","#39c9c4","#a78bfa","#f3b65c","#f07f9d","#68c6a5","#7797e8","#d18be5","#8cb6cb","#e58e60"],borderRadius:5,borderSkipped:false}],{options:{indexAxis:horizontal?"y":"x"}})}
function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toast.timer);toast.timer=setTimeout(()=>el.classList.remove("show"),2400)}
function updateDashboard(){
 const totalGlobal=games.reduce((s,g)=>s+globalSales(g),0),top=[...games].sort((a,b)=>globalSales(b)-globalSales(a))[0];
 const rt=regions.map(r=>total(games,r)),lead=regions[rt.indexOf(Math.max(...rt))];
 document.getElementById("total-sales").textContent=fmt(totalGlobal)+"M";
 document.getElementById("total-games").textContent=games.length;
 document.getElementById("top-game").textContent=top?.name||"—";
 document.getElementById("top-game-sales").textContent=top?fmt(globalSales(top))+" million global sales":"No records";
 document.getElementById("top-region").textContent=regionNames[lead]||"—";
 bar("dashRegion",regions.map(r=>regionNames[r]),rt,"Regional sales");
 const genres=groupSum("genre","Global",games.map(g=>({...g,Global:globalSales(g)})));
 makeChart("dashGenre","doughnut",Object.keys(genres),[{data:Object.values(genres),backgroundColor:["#5d9cff","#39c9c4","#a78bfa","#f3b65c","#f07f9d","#68c6a5","#7797e8"],borderWidth:0}],{legend:true});
 document.getElementById("top-games-table").innerHTML=[...games].sort((a,b)=>globalSales(b)-globalSales(a)).slice(0,5).map(g=>`<tr><td>${escapeHtml(g.name)}</td><td>${escapeHtml(g.platform)}</td><td>${escapeHtml(g.genre)}</td><td>${fmt(globalSales(g))}</td></tr>`).join("");
 renderInsights(totalGlobal,top,lead,rt);
}
function renderInsights(totalGlobal,top,lead,regionalTotals){
 const insights=[];
 if(!games.length){insights.push("Add game records to generate analytics insights.")}
 else{
  const bestGenre=Object.entries(groupSum("genre","Global",games.map(g=>({...g,Global:globalSales(g)})))).sort((a,b)=>b[1]-a[1])[0];
  const bestPlatform=Object.entries(groupSum("platform","Global",games.map(g=>({...g,Global:globalSales(g)})))).sort((a,b)=>b[1]-a[1])[0];
  const share=totalGlobal?regionalTotals[regions.indexOf(lead)]/totalGlobal*100:0;
  insights.push(`<b>${escapeHtml(regionNames[lead])}</b> is the leading region with <b>${fmt(regionalTotals[regions.indexOf(lead)])}M</b> in sales (${share.toFixed(1)}% of the total).`);
  if(bestGenre)insights.push(`<b>${escapeHtml(bestGenre[0])}</b> is the highest-selling genre, contributing <b>${fmt(bestGenre[1])}M</b>.`);
  if(bestPlatform)insights.push(`<b>${escapeHtml(bestPlatform[0])}</b> is the leading platform with <b>${fmt(bestPlatform[1])}M</b> in global sales.`);
  if(top)insights.push(`<b>${escapeHtml(top.name)}</b> is the top-selling game at <b>${fmt(globalSales(top))}M</b>.`);
 }
 document.getElementById("insights-list").innerHTML=insights.map((x,i)=>`<div class="insight-item"><span>${i+1}</span><p>${x}</p></div>`).join("");
}
function parseCSV(text){
 const rows=[];let row=[],cell="",quoted=false;
 for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&quoted&&n==='"'){cell+='"';i++}else if(c==='"'){quoted=!quoted}else if(c===','&&!quoted){row.push(cell.trim());cell=""}else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(cell.trim());if(row.some(Boolean))rows.push(row);row=[];cell=""}else cell+=c}
 row.push(cell.trim());if(row.some(Boolean))rows.push(row);if(rows.length<2)throw new Error("CSV must include a header row and at least one game.");
 const headers=rows.shift().map(h=>h.toLowerCase().replace(/[^a-z]/g,""));
 const find=(...names)=>headers.findIndex(h=>names.includes(h));
 const ix={name:find("name","gamename","title"),platform:find("platform"),year:find("year","releaseyear"),genre:find("genre"),publisher:find("publisher"),NA:find("na","northamerica"),EU:find("eu","europe"),JP:find("jp","japan"),Other:find("other","othersales")};
 if(Object.values(ix).some(v=>v<0))throw new Error("Required columns: Name, Platform, Year, Genre, Publisher, NA, EU, JP, Other.");
 return rows.map((r,i)=>{const g={rank:i+1,name:r[ix.name],platform:r[ix.platform],year:Number(r[ix.year]),genre:r[ix.genre],publisher:r[ix.publisher]};regions.forEach(k=>g[k]=Number(r[ix[k]]));if(!g.name||!g.platform||!g.genre||!g.publisher||!Number.isInteger(g.year)||regions.some(k=>!Number.isFinite(g[k])||g[k]<0))throw new Error(`Invalid values in CSV row ${i+2}.`);return g});
}
function downloadBackup(){const payload={project:"Video Game Regional Sales Analytics",version:2,exportedAt:new Date().toISOString(),games};const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:"application/json"}));a.download="video-game-regional-sales-backup.json";a.click();URL.revokeObjectURL(a.href);toast("Backup downloaded")}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderDataset(){
 const q=document.getElementById("dataset-search").value.toLowerCase(),genre=document.getElementById("genre-filter").value,region=document.getElementById("region-filter").value;
 const filtered=games.map((g,i)=>({...g,_index:i})).filter(g=>(`${g.name} ${g.platform} ${g.publisher} ${g.genre}`.toLowerCase().includes(q))&&(!genre||g.genre===genre)&&(!region||g[region]>0));
 document.getElementById("record-count").textContent=`Showing ${filtered.length} of ${games.length} records`;
 document.getElementById("dataset-table").innerHTML=filtered.map(g=>`<tr><td>${g.rank}</td><td>${escapeHtml(g.name)}</td><td>${escapeHtml(g.platform)}</td><td>${g.year}</td><td>${escapeHtml(g.genre)}</td><td>${escapeHtml(g.publisher)}</td>${regions.map(r=>`<td>${fmt(g[r])}</td>`).join("")}<td><b>${fmt(globalSales(g))}</b></td><td><button class="action-btn" data-edit="${g._index}">Edit</button><button class="action-btn delete" data-delete="${g._index}">Delete</button></td></tr>`).join("")||'<tr><td colspan="12">No matching records found.</td></tr>';
}
const querySql={
 region:"SELECT region_name, SUM(sales_millions) AS total_sales\nFROM regional_sales\nGROUP BY region_name\nORDER BY total_sales DESC;",
 genre:"SELECT genre_name, SUM(global_sales) AS total_sales\nFROM games\nGROUP BY genre_name\nORDER BY total_sales DESC;",
 platform:"SELECT platform_name, SUM(global_sales) AS total_sales\nFROM games\nGROUP BY platform_name\nORDER BY total_sales DESC;",
 top:"SELECT game_name, global_sales\nFROM games\nORDER BY global_sales DESC\nLIMIT 5;",
 year:"SELECT release_year, SUM(global_sales) AS total_sales\nFROM games\nGROUP BY release_year\nORDER BY release_year;"
};
function reportData(key){
 const computed=games.map(g=>({...g,Global:globalSales(g)}));
 if(key==="region")return regions.map(r=>[regionNames[r],total(games,r)]);
 if(key==="genre")return Object.entries(groupSum("genre","Global",computed));
 if(key==="platform")return Object.entries(groupSum("platform","Global",computed));
 if(key==="top")return [...computed].sort((a,b)=>b.Global-a.Global).slice(0,5).map(g=>[g.name,g.Global]);
 return Object.entries(groupSum("year","Global",computed)).sort((a,b)=>Number(a[0])-Number(b[0]));
}
function runReport(){const key=document.getElementById("query-select").value,data=reportData(key);document.getElementById("sql-caption").textContent=document.getElementById("query-select").selectedOptions[0].text;document.getElementById("sql-results").innerHTML=data.map(([k,v])=>`<tr><td>${escapeHtml(k)}</td><td>${fmt(v)}</td></tr>`).join("");bar("sqlChart",data.map(x=>x[0]),data.map(x=>x[1]),"Sales",data.length>6)}
const dbTables={
 games:{description:"Main catalogue containing one row per video game.",columns:[["game_id","INT","PK","Unique game identifier"],["game_name","VARCHAR(150)","—","Title of the video game"],["platform_id","INT","FK","References platforms"],["genre_id","INT","FK","References genres"],["publisher_id","INT","FK","References publishers"],["release_year","SMALLINT","—","Year of release"],["global_sales","DECIMAL(8,2)","—","Worldwide sales in millions"]]},
 platforms:{description:"Lookup table for game platforms and hardware systems.",columns:[["platform_id","INT","PK","Unique platform identifier"],["platform_name","VARCHAR(50)","UNIQUE","Platform short name"],["manufacturer","VARCHAR(80)","—","Platform manufacturer"]]},
 genres:{description:"Lookup table for game categories.",columns:[["genre_id","INT","PK","Unique genre identifier"],["genre_name","VARCHAR(60)","UNIQUE","Category of the game"]]},
 publishers:{description:"Companies responsible for publishing games.",columns:[["publisher_id","INT","PK","Unique publisher identifier"],["publisher_name","VARCHAR(120)","UNIQUE","Publisher company name"]]},
 regional_sales:{description:"One row per game and sales region.",columns:[["sales_id","INT","PK","Unique regional sales row"],["game_id","INT","FK","References games"],["region_name","VARCHAR(40)","—","Sales territory"],["sales_millions","DECIMAL(8,2)","—","Sales in millions"]]}
};
function showTable(name){
 const t=dbTables[name],sample=name==="games"?games.slice(0,4).map(g=>[g.rank,g.name,g.platform,g.genre,g.year,fmt(globalSales(g))]):name==="platforms"?[...new Set(games.map(g=>g.platform))].slice(0,4).map((x,i)=>[i+1,x,"Demo manufacturer"]):name==="genres"?[...new Set(games.map(g=>g.genre))].slice(0,4).map((x,i)=>[i+1,x]):name==="publishers"?[...new Set(games.map(g=>g.publisher))].slice(0,4).map((x,i)=>[i+1,x]):games.slice(0,4).map((g,i)=>[i+1,g.rank,"North America",fmt(g.NA)]);
 document.getElementById("explorer-title").textContent=name;document.getElementById("explorer-description").textContent=t.description;document.getElementById("explorer-count").textContent=(name==="regional_sales"?games.length*4:name==="games"?games.length:sample.length)+" demo rows";
 document.getElementById("columns-table").innerHTML=t.columns.map(c=>`<tr>${c.map(x=>`<td>${escapeHtml(x)}</td>`).join("")}</tr>`).join("");
 const heads=name==="games"?["ID","Game","Platform","Genre","Year","Global M"]:name==="regional_sales"?["Sales ID","Game ID","Region","Sales M"]:name==="platforms"?["ID","Platform","Manufacturer"]:name==="genres"?["ID","Genre"]:["ID","Publisher"];
 document.getElementById("sample-head").innerHTML="<tr>"+heads.map(h=>`<th>${h}</th>`).join("")+"</tr>";document.getElementById("sample-body").innerHTML=sample.map(row=>"<tr>"+row.map(x=>`<td>${escapeHtml(x)}</td>`).join("")+"</tr>").join("");
 document.querySelectorAll(".table-item").forEach(b=>b.classList.toggle("selected",b.dataset.table===name));
}
function buildVisuals(){
 const field=document.getElementById("chart-region").value,computed=games.map(g=>({...g,Global:globalSales(g)})),totalBy=key=>groupSum(key,field,computed),top=(key,n=10)=>Object.entries(totalBy(key)).sort((a,b)=>b[1]-a[1]).slice(0,n);
 bar("v1",regions.map(r=>regionNames[r]),regions.map(r=>total(games,r)),"Sales");
 let a=totalBy("genre");bar("v2",Object.keys(a),Object.values(a));a=totalBy("platform");bar("v3",Object.keys(a),Object.values(a));
 const tg=[...computed].sort((x,y)=>y[field]-x[field]).slice(0,10);bar("v4",tg.map(g=>g.name),tg.map(g=>g[field]),"Sales",true);
 let p=top("publisher");bar("v5",p.map(x=>x[0]),p.map(x=>x[1]));
 let years=top("year",20).sort((x,y)=>Number(x[0])-Number(y[0]));bar("v6",years.map(x=>x[0]),years.map(x=>x[1]));
 const genreNames=[...new Set(games.map(g=>g.genre))];makeChart("v7","bar",genreNames,regions.map((r,i)=>({label:regionNames[r],data:genreNames.map(n=>total(games.filter(g=>g.genre===n),r)),backgroundColor:["#5d9cff","#39c9c4","#a78bfa","#f3b65c"][i],borderRadius:3})),{legend:true});
 const platforms=[...new Set(games.map(g=>g.platform))];makeChart("v8","bar",platforms,regions.map((r,i)=>({label:regionNames[r],data:platforms.map(n=>total(games.filter(g=>g.platform===n),r)),backgroundColor:["#5d9cff","#39c9c4","#a78bfa","#f3b65c"][i],borderRadius:3})),{legend:true});
 p=top("publisher");bar("v9",p.map(x=>x[0]),p.map(x=>x[1]));p=top("platform");bar("v10",p.map(x=>x[0]),p.map(x=>x[1]));
}
function showPage(id){document.querySelectorAll(".page").forEach(p=>p.classList.toggle("active",p.id===id));document.querySelectorAll(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.page===id));const labels={dashboard:"Dashboard",dataset:"Dataset",sql:"SQL Report",explorer:"Database Explorer",schema:"Database Schema",visualization:"Visualization"};document.getElementById("page-title").textContent=labels[id];if(id==="visualization")buildVisuals();if(id==="sql")runReport();document.getElementById("sidebar").classList.remove("open")}
function refreshAll(){const selected=document.getElementById("genre-filter").value;document.getElementById("genre-filter").innerHTML='<option value="">All genres</option>'+[...new Set(games.map(g=>g.genre))].sort().map(g=>`<option value="${escapeHtml(g)}">${escapeHtml(g)}</option>`).join("");document.getElementById("genre-filter").value=selected;updateDashboard();renderDataset();runReport();if(document.getElementById("visualization").classList.contains("active"))buildVisuals();showTable(document.getElementById("explorer-title").textContent in dbTables?document.getElementById("explorer-title").textContent:"games")}
function openEditor(index=null){
 const dialog=document.getElementById("game-dialog"),g=index===null?null:games[index];document.getElementById("game-form").reset();document.getElementById("edit-index").value=index===null?"":index;document.getElementById("dialog-title").textContent=g?"Edit game":"Add game";
 const vals={name:g?.name||"",platform:g?.platform||"",year:g?.year||new Date().getFullYear(),genre:g?.genre||"",publisher:g?.publisher||"",na:g?.NA??0,eu:g?.EU??0,jp:g?.JP??0,other:g?.Other??0};
 Object.entries(vals).forEach(([k,v])=>document.getElementById("f-"+k).value=v);dialog.showModal();
}
document.querySelectorAll(".nav-link").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.page)));
document.querySelectorAll("[data-goto]").forEach(b=>b.addEventListener("click",()=>showPage(b.dataset.goto)));
document.getElementById("mobile-menu").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
["dataset-search","genre-filter","region-filter"].forEach(id=>document.getElementById(id).addEventListener(id==="dataset-search"?"input":"change",renderDataset));
document.getElementById("query-select").addEventListener("change",e=>document.getElementById("sql-editor").value=querySql[e.target.value]);
document.getElementById("run-query").addEventListener("click",runReport);
document.getElementById("chart-region").addEventListener("change",buildVisuals);
document.getElementById("add-game").addEventListener("click",()=>openEditor());
document.getElementById("dataset-table").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit)openEditor(Number(edit.dataset.edit));if(del){const i=Number(del.dataset.delete);if(confirm(`Delete "${games[i].name}"?`)){games.splice(i,1);games.forEach((g,j)=>g.rank=j+1);persist();refreshAll();toast("Game record deleted")}}});
document.getElementById("game-form").addEventListener("submit",e=>{
 if(e.submitter?.value==="cancel")return;
 e.preventDefault();const val=id=>document.getElementById("f-"+id).value.trim();
 const g={name:val("name"),platform:val("platform"),year:Number(val("year")),genre:val("genre"),publisher:val("publisher"),NA:Number(val("na")),EU:Number(val("eu")),JP:Number(val("jp")),Other:Number(val("other"))};
 if(!g.name||!g.platform||!g.genre||!g.publisher||!Number.isFinite(g.year)||regions.some(r=>!Number.isFinite(g[r])||g[r]<0)){toast("Please enter valid game details");return}
 const index=document.getElementById("edit-index").value;if(index===""){g.rank=games.length+1;games.push(g)}else{g.rank=games[Number(index)].rank;games[Number(index)]=g}
 persist();document.getElementById("game-dialog").close();refreshAll();toast(index===""?"Game added successfully":"Game updated successfully");
});
document.getElementById("reset-data").addEventListener("click",()=>{if(confirm("Restore the original sample dataset?")){games=structuredClone(sampleGames);persist();refreshAll();toast("Sample dataset restored")}});
document.getElementById("download-csv").addEventListener("click",()=>{const cols=["rank","name","platform","year","genre","publisher","NA","EU","JP","Other","Global"];const csv=[cols.join(","),...games.map((g,i)=>cols.map(c=>`"${String(c==="Global"?globalSales(g):c==="rank"?i+1:g[c]).replaceAll('"','""')}"`).join(","))].join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));a.download="video_game_regional_sales_analytics.csv";a.click();URL.revokeObjectURL(a.href);toast("CSV export started")});
document.getElementById("import-csv").addEventListener("click",()=>document.getElementById("csv-file").click());
document.getElementById("csv-file").addEventListener("change",async e=>{const file=e.target.files?.[0];if(!file)return;try{const imported=parseCSV(await file.text());if(!confirm(`Replace the current dataset with ${imported.length} imported records?`))return;games=imported;persist();refreshAll();toast(`${games.length} records imported`)}catch(err){toast(err.message||"Could not import CSV")}finally{e.target.value=""}});
document.getElementById("backup-data").addEventListener("click",downloadBackup);
document.getElementById("print-report").addEventListener("click",()=>window.print());
document.getElementById("table-list").innerHTML=Object.keys(dbTables).map((n,i)=>`<button class="table-item ${i===0?"selected":""}" data-table="${n}">▤ &nbsp; ${n}</button>`).join("");
document.getElementById("table-list").addEventListener("click",e=>{const b=e.target.closest("[data-table]");if(b)showTable(b.dataset.table)});
document.getElementById("sql-editor").value=querySql.region;
refreshAll();showTable("games");
