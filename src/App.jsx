import { useState, useRef, useCallback } from "react";

/* ══════════════════════════════════════════════════════════════════
   NUTRIVO · App Nutrition Ivoirienne
   Interface épurée — 1 écran = 1 action
   ⚕️ Conseils nutritionnels uniquement
   ══════════════════════════════════════════════════════════════════ */

const ALIMENTS = {
  attieke:         { n:"Attiéké",           c:150, p:1.5,  l:0.5,  g:36, f:1.8, sel:0.1, ig:65 },
  riz_blanc:       { n:"Riz blanc",         c:130, p:2.5,  l:0.3,  g:28, f:0.3, sel:0.0, ig:73 },
  foutou_banane:   { n:"Foutou banane",     c:122, p:1.3,  l:0.3,  g:31, f:2.0, sel:0.0, ig:68 },
  foutou_igname:   { n:"Foutou igname",     c:118, p:2.0,  l:0.2,  g:28, f:1.5, sel:0.0, ig:54 },
  placali:         { n:"Placali",           c:110, p:1.0,  l:0.2,  g:26, f:1.2, sel:0.0, ig:58 },
  plantain_frit:   { n:"Aloco (frit)",      c:232, p:1.2,  l:10.0, g:34, f:2.3, sel:0.3, ig:68 },
  plantain_bouilli:{ n:"Plantain bouilli",  c:116, p:1.2,  l:0.1,  g:28, f:2.3, sel:0.0, ig:55 },
  igname_bouillie: { n:"Igname bouillie",   c:118, p:1.5,  l:0.1,  g:28, f:1.7, sel:0.0, ig:51 },
  poulet_grille:   { n:"Poulet grillé",     c:165, p:31.0, l:3.6,  g:0,  f:0.0, sel:0.3, ig:0  },
  poulet_frit:     { n:"Poulet frit",       c:260, p:25.0, l:15.0, g:0,  f:0.0, sel:0.8, ig:0  },
  poisson_braise:  { n:"Poisson braisé",    c:180, p:22.0, l:8.0,  g:0,  f:0.0, sel:0.5, ig:0  },
  poisson_frit:    { n:"Poisson frit",      c:220, p:20.0, l:12.0, g:0,  f:0.0, sel:0.8, ig:0  },
  poisson_fume:    { n:"Poisson fumé",      c:210, p:28.0, l:9.0,  g:0,  f:0.0, sel:2.2, ig:0  },
  thon:            { n:"Thon",              c:135, p:28.0, l:1.5,  g:0,  f:0.0, sel:0.4, ig:0  },
  sardine:         { n:"Sardine",           c:208, p:25.0, l:11.0, g:0,  f:0.0, sel:0.6, ig:0  },
  oeuf:            { n:"Œuf",              c:155, p:13.0, l:11.0, g:1,  f:0.0, sel:0.4, ig:0  },
  boeuf:           { n:"Bœuf",             c:250, p:26.0, l:15.0, g:0,  f:0.0, sel:0.3, ig:0  },
  pate_arachide:   { n:"Pâte d'arachide",  c:595, p:25.0, l:50.0, g:20, f:6.0, sel:0.5, ig:14 },
  niebe:           { n:"Niébé",            c:116, p:8.0,  l:0.6,  g:21, f:7.0, sel:0.0, ig:33 },
  graine_palme:    { n:"Graine de palme",  c:180, p:2.0,  l:15.0, g:8,  f:4.0, sel:0.1, ig:10 },
  huile_palme:     { n:"Huile de palme",   c:884, p:0.0,  l:100,  g:0,  f:0.0, sel:0.0, ig:0  },
  huile_vegetale:  { n:"Huile végétale",   c:884, p:0.0,  l:100,  g:0,  f:0.0, sel:0.0, ig:0  },
  tomate:          { n:"Tomate",           c:18,  p:0.9,  l:0.2,  g:4,  f:1.2, sel:0.0, ig:30 },
  oignon:          { n:"Oignon",           c:40,  p:1.1,  l:0.1,  g:9,  f:1.7, sel:0.0, ig:20 },
  gombo:           { n:"Gombo",            c:33,  p:1.9,  l:0.2,  g:7,  f:3.2, sel:0.0, ig:20 },
  aubergine:       { n:"Aubergine",        c:25,  p:1.0,  l:0.2,  g:6,  f:3.0, sel:0.0, ig:15 },
  piment:          { n:"Piment",           c:40,  p:1.9,  l:0.4,  g:9,  f:1.5, sel:0.0, ig:15 },
  cube_maggi:      { n:"Cube Maggi",       c:20,  p:1.0,  l:0.5,  g:2,  f:0.0, sel:5.0, ig:0  },
};

const PLATS_CI = [
  { id:"attieke_poisson", nom:"Attiéké + Poisson", emoji:"🐟",
    compo:[{a:"attieke",q:200},{a:"poisson_braise",q:150},{a:"tomate",q:50},{a:"oignon",q:30},{a:"huile_palme",q:10},{a:"cube_maggi",q:5}] },
  { id:"garba", nom:"Garba", emoji:"🍽️",
    compo:[{a:"attieke",q:200},{a:"thon",q:100},{a:"huile_vegetale",q:20},{a:"oignon",q:30},{a:"tomate",q:30},{a:"cube_maggi",q:5}] },
  { id:"foutou_graine", nom:"Foutou + Sauce graine", emoji:"🫙",
    compo:[{a:"foutou_banane",q:300},{a:"graine_palme",q:100},{a:"huile_palme",q:30},{a:"poisson_fume",q:50},{a:"oignon",q:20},{a:"cube_maggi",q:5}] },
  { id:"kedjenou", nom:"Kédjenou poulet", emoji:"🍗",
    compo:[{a:"poulet_grille",q:250},{a:"aubergine",q:80},{a:"tomate",q:80},{a:"oignon",q:40},{a:"piment",q:15}] },
  { id:"riz_arachide", nom:"Riz + Sauce arachide", emoji:"🥜",
    compo:[{a:"riz_blanc",q:250},{a:"pate_arachide",q:60},{a:"poulet_grille",q:100},{a:"tomate",q:40},{a:"oignon",q:30},{a:"cube_maggi",q:5}] },
  { id:"riz_gras", nom:"Riz gras", emoji:"🍚",
    compo:[{a:"riz_blanc",q:300},{a:"poulet_frit",q:100},{a:"huile_vegetale",q:30},{a:"tomate",q:60},{a:"oignon",q:30},{a:"cube_maggi",q:10}] },
  { id:"soupe_gombo", nom:"Sauce gombo", emoji:"🥬",
    compo:[{a:"riz_blanc",q:200},{a:"gombo",q:150},{a:"poisson_fume",q:50},{a:"huile_palme",q:20},{a:"oignon",q:30},{a:"cube_maggi",q:5}] },
  { id:"aloco_oeuf", nom:"Aloco + Œuf", emoji:"🍌",
    compo:[{a:"plantain_frit",q:200},{a:"oeuf",q:100},{a:"huile_vegetale",q:20},{a:"piment",q:10}] },
];

const TAGS = ["Riz","Attiéké","Foutou","Poulet","Poisson","Thon","Sardine","Bœuf","Œuf","Sauce arachide","Sauce graine","Gombo","Aloco","Légumes","Huile"];

const CONDS = [
  {id:"diabete",   l:"Diabète",      e:"🩺"},
  {id:"hypertension",l:"Hypertension",e:"❤️"},
  {id:"cholesterol",l:"Cholestérol", e:"🫀"},
  {id:"grossesse", l:"Grossesse",    e:"🤰"},
  {id:"anemie",    l:"Anémie",       e:"🩸"},
  {id:"obesite",   l:"Obésité",      e:"⚖️"},
];

const CONSEILS_JOUR = [
  "Buvez 2 litres d'eau par jour. L'eau de coco naturelle est excellente.",
  "Le gombo est un superaliment ivoirien : fibres, folates, calcium.",
  "Le kédjenou est le plat le plus sain de la cuisine ivoirienne.",
  "1 cube Maggi = 2,5 à 5g de sel. Réduire pour la tension.",
  "Associez toujours féculent + protéine + légumes dans votre assiette.",
  "L'attiéké fermenté contient des probiotiques bons pour l'intestin.",
];

function calcNutri(compo) {
  let r = {cal:0,p:0,l:0,g:0,f:0,sel:0};
  compo.forEach(({a,q})=>{
    const d=ALIMENTS[a]; if(!d) return;
    const x=q/100;
    r.cal+=d.c*x; r.p+=d.p*x; r.l+=d.l*x;
    r.g+=d.g*x;   r.f+=d.f*x; r.sel+=d.sel*x;
  });
  return {cal:Math.round(r.cal),p:+r.p.toFixed(1),l:+r.l.toFixed(1),g:+r.g.toFixed(1),f:+r.f.toFixed(1),sel:+r.sel.toFixed(1)};
}

function calcBesoins({age,poids,taille,sexe,activite}) {
  if(!age||!poids||!taille) return null;
  const bmr = sexe==="femme"
    ? 10*poids+6.25*taille-5*age-161
    : 10*poids+6.25*taille-5*age+5;
  const coef = {sedentaire:1.2,leger:1.375,modere:1.55,actif:1.725}[activite]||1.55;
  const imc = +(poids/Math.pow(taille/100,2)).toFixed(1);
  return {
    tdee:Math.round(bmr*coef), imc,
    statut: imc<18.5?"Maigreur":imc<25?"Normal":imc<30?"Surpoids":"Obésité",
    ok: imc>=18.5&&imc<25,
  };
}

/* ── Chrononutrition — heure du repas ──────────────────────────── */
function analyserHeure() {
  const h = new Date().getHours();
  const m = new Date().getMinutes();
  const heure = h + m/60;
  const heureStr = `${String(h).padStart(2,"0")}h${String(m).padStart(2,"0")}`;

  if(heure >= 6 && heure < 9)
    return { moment:"Petit-déjeuner", emoji:"🌅", statut:"ok",
      msg:`${heureStr} — Bon moment pour un petit-déjeuner énergétique.`,
      conseil:"Idéal : attiéké léger, œuf, fruit. Éviter les plats lourds le matin." };

  if(heure >= 9 && heure < 11)
    return { moment:"Matinée", emoji:"☀️", statut:"ok",
      msg:`${heureStr} — Collation matinale acceptable.`,
      conseil:"Privilégier un fruit ou une boisson légère. Pas de repas complet." };

  if(heure >= 11 && heure < 14)
    return { moment:"Déjeuner", emoji:"🍽️", statut:"excellent",
      msg:`${heureStr} — Meilleur moment de la journée pour un repas complet.`,
      conseil:"C'est le bon moment ! Le corps digère mieux et utilise l'énergie efficacement." };

  if(heure >= 14 && heure < 17)
    return { moment:"Après-midi", emoji:"⚠️", statut:"attention",
      msg:`${heureStr} — Repas en milieu d'après-midi.`,
      conseil:"Si c'est un repas principal, alléger la portion du soir. Sinon préférer une collation légère." };

  if(heure >= 17 && heure < 20)
    return { moment:"Dîner", emoji:"🌆", statut:"ok",
      msg:`${heureStr} — Heure du dîner correcte.`,
      conseil:"Préférer protéines + légumes. Réduire les féculents lourds (foutou, riz en grande quantité)." };

  if(heure >= 20 && heure < 22)
    return { moment:"Dîner tardif", emoji:"🌙", statut:"attention",
      msg:`${heureStr} — Repas un peu tardif.`,
      conseil:"Alléger la portion. Éviter les plats très caloriques — la digestion sera lente pendant le sommeil." };

  if(heure >= 22 || heure < 2)
    return { moment:"Repas nocturne", emoji:"🌚", statut:"danger",
      msg:`${heureStr} — Repas nocturne déconseillé.`,
      conseil:"Manger la nuit favorise la prise de poids et perturbe le sommeil. Si nécessaire, choisir quelque chose de très léger : fruit, yaourt, soupe claire." };

  if(heure >= 2 && heure < 6)
    return { moment:"Nuit", emoji:"😴", statut:"danger",
      msg:`${heureStr} — Heure inhabituelle pour un repas.`,
      conseil:"Éviter de manger entre 2h et 6h. Le métabolisme est au repos. Boire de l'eau à la place." };

  return null;
}

function genConseils(nutri, profil, besoins) {
  const alertes=[], conseils=[];
  const conds=profil.conditions||[];
  const {cal,p,l,g,f,sel}=nutri;

  // ── Chrononutrition ──────────────────────────────────────────────
  const chrono = analyserHeure();
  if(chrono) {
    if(chrono.statut==="danger")
      alertes.unshift({t:"danger", m:chrono.emoji+" "+chrono.msg+" — "+chrono.conseil});
    else if(chrono.statut==="attention")
      alertes.push({t:"att", m:chrono.emoji+" "+chrono.msg+" — "+chrono.conseil});
    else if(chrono.statut==="excellent")
      conseils.unshift(chrono.emoji+" "+chrono.conseil);
  }

  if(cal>800) alertes.push({t:"lourd",m:"Repas calorique ("+cal+" kcal). Alléger le prochain repas."});
  if(sel>2)   alertes.push({t:"sel",  m:`Sel élevé (${sel}g). Réduire le cube Maggi.`});
  if(l>25)    alertes.push({t:"gras", m:`Lipides élevés (${l}g). Moins d'huile dans la sauce.`});
  if(f<3)     conseils.push("Ajouter des légumes (gombo, aubergine, tomate) pour plus de fibres.");

  if(conds.includes("diabete")) {
    if(g>60) alertes.push({t:"danger",m:`⚠️ Glucides élevés (${g}g). Réduire la portion de féculent.`});
    conseils.push("Associer féculent + protéine + légumes ralentit l'absorption du sucre.");
  }
  if(conds.includes("hypertension")) {
    if(sel>1.5) alertes.push({t:"danger",m:`⚠️ Sel élevé (${sel}g). OMS : max 2g/jour. Éviter le cube en excès.`});
  }
  if(conds.includes("cholesterol")) {
    if(l>20) alertes.push({t:"att",m:"Lipides élevés. Préférer poisson grillé, limiter la friture."});
    if(f<5)  conseils.push("Le gombo réduit naturellement le cholestérol grâce à ses fibres solubles.");
  }
  if(conds.includes("grossesse")) {
    if(p<20) conseils.push("Protéines insuffisantes. Ajouter œuf, sardine ou niébé.");
    conseils.push("Gombo = riche en folates, excellent pour le bébé.");
    alertes.push({t:"info",m:"Bien cuire toutes les viandes et poissons pendant la grossesse."});
  }
  if(conds.includes("anemie")) {
    conseils.push("Fer : sardine, bœuf, niébé, épinards locaux. Associer avec tomate (vitamine C).");
  }
  if(profil.objectif==="perte"&&besoins&&cal>besoins.tdee*0.4) {
    alertes.push({t:"att",m:`Ce repas = ${Math.round(cal/besoins.tdee*100)}% de vos besoins journaliers.`});
    conseils.push("Assiette idéale : 50% légumes · 25% féculent · 25% protéine.");
  }
  if(profil.objectif==="muscle"&&p<25)
    conseils.push(`Protéines faibles (${p}g). Viser 30–40g par repas pour la prise de muscle.`);

  return {alertes,conseils};
}

function calcScore(nutri,profil) {
  let s=10;
  const conds=profil.conditions||[];
  if(nutri.cal>900)s-=2; else if(nutri.cal>700)s-=1;
  if(nutri.f<2)s-=1; if(nutri.f>=5)s+=0.5;
  if(nutri.sel>2)s-=1.5; if(nutri.l>25)s-=1;
  if(nutri.p>=20)s+=0.5;
  if(conds.includes("diabete")&&nutri.g>60)s-=2;
  if(conds.includes("hypertension")&&nutri.sel>1.5)s-=1.5;
  if(conds.includes("cholesterol")&&nutri.l>25)s-=1;
  return Math.max(1,Math.min(10,Math.round(s*2)/2));
}

/* ══════════════════════════════════════════════════════════════════ */
export default function Dougou() {
  const [screen, setScreen] = useState("accueil");
  const [navTab, setNavTab] = useState("accueil");
  const [profil, setProfil] = useState({
    prenom:"", age:"", sexe:"homme", taille:"", poids:"",
    activite:"modere", conditions:[], autreCondition:"", objectif:"equilibre",
  });
  const [image,   setImage]   = useState(null);
  const [imgB64,  setImgB64]  = useState(null);
  const [nomPlat, setNomPlat] = useState("");
  const [ingLibres,setIngLibres]=useState("");
  const [tags,    setTags]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [res,     setRes]     = useState(null);
  const [hist,    setHist]    = useState([]);
  const fileRef = useRef();

  const upP = (k,v) => setProfil(p=>({...p,[k]:v}));
  const toggleCond = id => setProfil(p=>({...p,
    conditions:p.conditions.includes(id)?p.conditions.filter(c=>c!==id):[...p.conditions,id]
  }));
  const toggleTag = t => setTags(p=>p.includes(t)?p.filter(x=>x!==t):[...p,t]);

  const handleImg = f => {
    if(!f) return;
    const r=new FileReader();
    r.onload=e=>{setImage(e.target.result);setImgB64(e.target.result.split(",")[1]);};
    r.readAsDataURL(f);
  };

  const besoins = calcBesoins(profil);
  const profilOk = profil.age && profil.poids && profil.taille;
  const conseilIdx = new Date().getDay() % CONSEILS_JOUR.length;

  const goAnalyse = () => {
    setImage(null); setImgB64(null); setNomPlat("");
    setIngLibres(""); setTags([]); setRes(null);
    setScreen("scanner");
  };

  /* ── ANALYSE ─────────────────────────────────────────────────── */
  const analyser = useCallback(async () => {
    setLoading(true);
    const ing = ingLibres || tags.join(", ") || "";
    const maintenant = new Date();
    const heureRepas = maintenant.getHours()+"h"+String(maintenant.getMinutes()).padStart(2,"0");
    const chrono = analyserHeure();
    const conds = profil.conditions.includes("aucun")
      ? "aucune condition particulière — bonne santé"
      : [
          ...CONDS.filter(c=>profil.conditions.includes(c.id)).map(c=>c.l),
          ...(profil.conditions.includes("autre")&&profil.autreCondition ? [profil.autreCondition] : [])
        ].join(", ") || "non précisé";

    const platConnu = PLATS_CI.find(p=>
      nomPlat.toLowerCase().includes(p.nom.split(" ")[0].toLowerCase()) ||
      p.nom.toLowerCase().includes((nomPlat||"").toLowerCase().split(" ")[0])
    );

    try {
      let data;
      if(platConnu && !ingLibres) {
        const n=calcNutri(platConnu.compo);
        const s=calcScore(n,profil);
        const {alertes,conseils}=genConseils(n,profil,besoins);
        data={
          plat_identifie:platConnu.nom, confidence:"elevee",
          calories:n.cal, portion:`~${platConnu.compo.reduce((t,c)=>t+c.q,0)}g`,
          macros:{proteines:`${n.p}g`,glucides:`${n.g}g`,lipides:`${n.l}g`,fibres:`${n.f}g`,sel:`${n.sel}g`},
          score:s, verdict:s>=8?"excellent":s>=6?"bon":s>=4?"acceptable":"a_ameliorer",
          resume:`${platConnu.nom} analysé depuis la base NUTRIVO.`,
          alerte_sante:alertes.filter(a=>a.t==="danger").map(a=>a.m).join(" ")||null,
          conseils:conseils.slice(0,3),
          alternative:"Kédjenou de poulet — le plat ivoirien le plus sain.",
        };
      } else {
        const sys=`Tu es NUTRIVO, nutritionniste expert en cuisine ivoirienne.
⚕️ Conseils nutritionnels uniquement — jamais de diagnostic médical.
Tu connais : attiéké, foutou, sauce graine, kédjenou, garba, aloco, placali, soupe gombo, riz gras...
Priorise toujours la description textuelle sur la photo pour les plats africains.
Tes conseils utilisent uniquement des ingrédients disponibles en Côte d'Ivoire.
Réponds en JSON strict sans markdown :
{"plat_identifie":"...","confidence":"elevee|moyenne|faible","calories":0,"portion":"...","macros":{"proteines":"Xg","glucides":"Xg","lipides":"Xg","fibres":"Xg","sel":"Xg"},"score":0,"verdict":"excellent|bon|acceptable|a_ameliorer","resume":"...","alerte_sante":"...ou null","conseils":["..."],"alternative":"..."}`;

        const prompt=`Profil : ${profil.prenom||"Utilisateur"}, ${profil.age} ans, ${profil.sexe}, ${profil.poids}kg/${profil.taille}cm
Activité : ${profil.activite} | Objectif : ${profil.objectif} | Besoins : ${besoins?.tdee||"?"}kcal/j
Conditions médicales : ${conds}
Heure du repas : ${heureRepas} (${chrono ? chrono.moment : ""})
Plat : "${nomPlat||"non précisé"}" | Ingrédients : "${ing||"non précisés"}"
${ing?"⚠️ Utilise ces ingrédients en priorité.":""}`;

        const content=[];
        if(imgB64) content.push({type:"image",source:{type:"base64",media_type:"image/jpeg",data:imgB64}});
        content.push({type:"text",text:prompt});

        const resp=await fetch("https://api.anthropic.com/v1/messages",{
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,system:sys,messages:[{role:"user",content}]}),
        });
        const raw=await resp.json();
        data=JSON.parse((raw.content?.[0]?.text||"{}").replace(/```json|```/g,"").trim());
      }

      setRes(data);
      setHist(h=>[{image,nom:data.plat_identifie,score:data.score,verdict:data.verdict,cal:data.calories,date:new Date().toLocaleDateString("fr-CI")},...h.slice(0,9)]);
      setScreen("resultat");
    } catch(e){ alert("Erreur. Vérifie ta connexion."); }
    finally{ setLoading(false); }
  },[imgB64,nomPlat,ingLibres,tags,profil,besoins,image]);

  const sCol = s=>s>=8?"#16a34a":s>=6?"#d97706":s>=4?"#f59e0b":"#dc2626";
  const vInfo = v=>({
    excellent:{bg:"#dcfce7",c:"#14532d",l:"Excellent ✅"},
    bon:      {bg:"#dbeafe",c:"#1e3a8a",l:"Bon choix 👍"},
    acceptable:{bg:"#fef9c3",c:"#78350f",l:"Acceptable ⚠️"},
    a_ameliorer:{bg:"#fee2e2",c:"#7f1d1d",l:"À améliorer ❌"},
  }[v]||{bg:"#f3f4f6",c:"#374151",l:v});

  const nav = (tab, sc) => { setNavTab(tab); setScreen(sc); };

  /* ══════════════════════════════════════════════════════════════
     RENDER
  ══════════════════════════════════════════════════════════════ */
  return (
    <div style={C.wrap}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@700;900&family=Nunito:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pop{0%{transform:scale(.85);opacity:0}100%{transform:scale(1);opacity:1}}
        .up{animation:up .3s ease both}
        .pop{animation:pop .25s cubic-bezier(.34,1.56,.64,1) both}
        input:focus,textarea:focus,select:focus{outline:none;border-color:#16a34a!important;}
        button:active{transform:scale(.97);}
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-thumb{background:#d1fae5;border-radius:4px}
      `}</style>

      <div style={C.phone}>

        {/* ═══ ACCUEIL — Splash screen épuré ═══════════════════════ */}
        {screen==="accueil" && (
          <div style={{...C.screen, justifyContent:"center", alignItems:"center", background:"#fff"}}>
            {/* Logo */}
            <div style={{textAlign:"center", padding:"40px 24px"}}>
              <div style={{marginBottom:16}}>
                <svg width="90" height="76" viewBox="0 0 90 76" fill="none">
                  <text x="2" y="70" fontFamily="Arial Black,sans-serif" fontSize="68" fontWeight="900" fill="#14532d">N</text>
                  <path d="M56 2 C50 9 46 19 49 29 C52 39 63 42 69 33 C75 24 70 11 56 2Z" fill="#16a34a"/>
                  <line x1="57" y1="4" x2="61" y2="35" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div style={{fontFamily:"Arial Black,sans-serif", fontSize:40, color:"#14532d", fontWeight:900, letterSpacing:2, marginBottom:8}}>NUTRIVO</div>
              <div style={{fontSize:14, color:"#6b7280", fontStyle:"italic", marginBottom:40}}>Votre coach nutrition intelligent</div>
              <div style={{fontSize:90, marginBottom:48}}>🥗</div>
              <button style={C.btnCommencer} onClick={()=>{
                if(profilOk){setNavTab("accueil");setScreen("scanner");}
                else{nav("profil","profil");}
              }}>Commencer</button>
            </div>
          </div>
        )}

        {/* ═══ PROFIL ══════════════════════════════════════════ */}
        {screen==="profil" && (
          <div style={C.screen} className="up">
            <div style={C.topBar}>
              <div style={C.topTitre}>Mon profil</div>
            </div>
            <div style={C.body}>

              <input style={C.inp} placeholder="Prénom (optionnel)"
                value={profil.prenom} onChange={e=>upP("prenom",e.target.value)}/>

              <div style={C.row2}>
                <div>
                  <div style={C.lbl}>Âge *</div>
                  <input style={C.inp} type="number" placeholder="Ex: 30"
                    value={profil.age} onChange={e=>upP("age",+e.target.value)}/>
                </div>
                <div>
                  <div style={C.lbl}>Sexe</div>
                  <div style={C.toggle}>
                    {["homme","femme"].map(s=>(
                      <button key={s} style={{...C.toggleOpt,background:profil.sexe===s?"#16a34a":"transparent",color:profil.sexe===s?"#fff":"#6b7280"}}
                        onClick={()=>upP("sexe",s)}>
                        {s==="homme"?"👨 H":"👩 F"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={C.row2}>
                <div>
                  <div style={C.lbl}>Poids (kg) *</div>
                  <input style={C.inp} type="number" placeholder="72"
                    value={profil.poids} onChange={e=>upP("poids",+e.target.value)}/>
                </div>
                <div>
                  <div style={C.lbl}>Taille (cm) *</div>
                  <input style={C.inp} type="number" placeholder="170"
                    value={profil.taille} onChange={e=>upP("taille",+e.target.value)}/>
                </div>
              </div>

              {/* IMC live */}
              {besoins && (
                <div style={{...C.imcBand,marginBottom:0}}>
                  <div style={C.imcItem}>
                    <div style={{...C.imcVal,color:besoins.ok?"#16a34a":"#d97706"}}>{besoins.imc}</div>
                    <div style={C.imcLbl}>IMC · {besoins.statut}</div>
                  </div>
                  <div style={C.imcDiv}/>
                  <div style={C.imcItem}>
                    <div style={C.imcVal}>{besoins.tdee}</div>
                    <div style={C.imcLbl}>kcal/jour</div>
                  </div>
                </div>
              )}

              <div style={C.lbl}>Activité physique</div>
              <div style={C.pills}>
                {[["sedentaire","Sédentaire"],["leger","Léger"],["modere","Modéré"],["actif","Actif"]].map(([id,l])=>(
                  <button key={id} style={{...C.pill,background:profil.activite===id?"#16a34a":"#f0fdf4",color:profil.activite===id?"#fff":"#16a34a"}}
                    onClick={()=>upP("activite",id)}>{l}</button>
                ))}
              </div>

              <div style={C.lbl}>Objectif santé</div>
              <div style={C.pills}>
                {[["perte","📉 Perdre du poids"],["equilibre","⚖️ Équilibre"],["muscle","💪 Muscle"],["sante","🌿 Santé"]].map(([id,l])=>(
                  <button key={id} style={{...C.pill,background:profil.objectif===id?"#16a34a":"#f0fdf4",color:profil.objectif===id?"#fff":"#16a34a"}}
                    onClick={()=>upP("objectif",id)}>{l}</button>
                ))}
              </div>

              <div style={C.lbl}>État de santé <span style={{fontSize:11,color:"#9ca3af",fontWeight:400}}>(cocher si concerné)</span></div>
              <div style={C.condGrid}>

                {/* Aucun — bonne santé */}
                <button style={{...C.condBtn,
                  background:profil.conditions.includes("aucun")?"#dcfce7":"#f9fafb",
                  border:profil.conditions.includes("aucun")?"2px solid #16a34a":"2px solid #e5e7eb",
                  gridColumn:"1/-1"}}
                  onClick={()=>setProfil(p=>({...p,conditions:p.conditions.includes("aucun")?[]:(["aucun"]),autreCondition:""}))}>
                  <span style={{fontSize:20}}>✅</span>
                  <span style={{fontSize:11,color:"#374151",fontWeight:700}}>Aucune condition — Je suis en bonne santé</span>
                </button>

                {/* Conditions médicales — désactivées si "aucun" coché */}
                {!profil.conditions.includes("aucun") && CONDS.map(c=>(
                  <button key={c.id} style={{...C.condBtn,
                    background:profil.conditions.includes(c.id)?"#dcfce7":"#f9fafb",
                    border:profil.conditions.includes(c.id)?"2px solid #16a34a":"2px solid #e5e7eb"}}
                    onClick={()=>toggleCond(c.id)}>
                    <span style={{fontSize:20}}>{c.e}</span>
                    <span style={{fontSize:11,color:"#374151"}}>{c.l}</span>
                  </button>
                ))}

                {/* Autre — pathologie non listée */}
                {!profil.conditions.includes("aucun") && (
                  <button style={{...C.condBtn,
                    background:profil.conditions.includes("autre")?"#fef9c3":"#f9fafb",
                    border:profil.conditions.includes("autre")?"2px solid #d97706":"2px solid #e5e7eb"}}
                    onClick={()=>toggleCond("autre")}>
                    <span style={{fontSize:20}}>➕</span>
                    <span style={{fontSize:11,color:"#374151"}}>Autre</span>
                  </button>
                )}
              </div>

              {/* Champ texte si "Autre" coché */}
              {profil.conditions.includes("autre") && !profil.conditions.includes("aucun") && (
                <div>
                  <div style={C.lbl}>Préciser votre condition</div>
                  <input style={C.inp}
                    placeholder="Ex: asthme, insuffisance rénale, drépanocytose..."
                    value={profil.autreCondition}
                    onChange={e=>upP("autreCondition",e.target.value)}/>
                </div>
              )}

              <button style={{...C.btnVert,opacity:profilOk?1:0.45}} disabled={!profilOk}
                onClick={()=>{setNavTab("accueil");setScreen("scanner");}}>
                Valider mon profil ✓
              </button>
              <div style={C.disclaimer}>⚕️ Conseils nutritionnels uniquement — pas de prescriptions médicales</div>
            </div>
            <BottomNav tab={navTab} nav={nav}/>
          </div>
        )}

        {/* ═══ SCANNER ══════════════════════════════════════════ */}
        {screen==="scanner" && (
          <div style={C.screen} className="up">
            <div style={C.topBar}>
              <button style={C.backBtn} onClick={()=>nav("accueil","accueil")}>←</button>
              <div style={C.topTitre}>Scanner mon repas</div>
            </div>
            <div style={C.body}>

              {/* Zone photo */}
              <div style={C.photoZone} onClick={()=>fileRef.current?.click()}>
                {image
                  ? <img src={image} alt="repas" style={C.photoImg}/>
                  : <div style={C.photoVide}>
                      <div style={{fontSize:44}}>📸</div>
                      <div style={C.photoTexte}>Prendre une photo</div>
                      <div style={C.photoSub}>optionnel</div>
                    </div>
                }
              </div>
              <input ref={fileRef} type="file" accept="image/*" capture="environment"
                style={{display:"none"}} onChange={e=>handleImg(e.target.files[0])}/>
              {image && <button style={C.btnLien} onClick={()=>{setImage(null);setImgB64(null);}}>Changer la photo</button>}

              {/* Nom du plat */}
              <div>
                <div style={C.lbl}>Nom du plat</div>
                <input style={C.inp} placeholder="Ex: Attiéké poisson, Garba, Foutou..."
                  value={nomPlat} onChange={e=>setNomPlat(e.target.value)}/>
              </div>

              {/* Plats rapides CI */}
              <div>
                <div style={C.lbl}>Plats ivoiriens</div>
                <div style={C.platGrid}>
                  {PLATS_CI.map(p=>(
                    <button key={p.id} style={{...C.platBtn,background:nomPlat===p.nom?"#dcfce7":"#f9fafb",border:nomPlat===p.nom?"2px solid #16a34a":"2px solid #e5e7eb"}}
                      onClick={()=>{setNomPlat(p.nom);setIngLibres(p.compo.map(c=>ALIMENTS[c.a]?.n||c.a).join(", "));}}>
                      <span style={{fontSize:18}}>{p.emoji}</span>
                      <span style={{fontSize:11,color:"#374151",textAlign:"center",lineHeight:1.3}}>{p.nom}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags rapides */}
              <div>
                <div style={C.lbl}>Ingrédients présents</div>
                <div style={C.tagCloud}>
                  {TAGS.map(t=>(
                    <button key={t} style={{...C.tagBtn,background:tags.includes(t)?"#16a34a":"#f0fdf4",color:tags.includes(t)?"#fff":"#374151"}}
                      onClick={()=>toggleTag(t)}>{t}</button>
                  ))}
                </div>
              </div>

              {/* Description libre */}
              <div>
                <div style={C.lbl}>
                  Décrire la composition
                  <span style={C.badge}>🔑 Aide l'IA</span>
                </div>
                <textarea style={C.textarea} rows={3}
                  placeholder={"Ex: attiéké, thon frit, oignon, piment, cube Maggi\n\nPlus tu décris, plus l'analyse est précise."}
                  value={ingLibres} onChange={e=>setIngLibres(e.target.value)}/>
              </div>

              <button style={{...C.btnVert,opacity:(nomPlat||ingLibres||tags.length>0||image)?1:0.4}}
                disabled={loading||(!nomPlat&&!ingLibres&&!tags.length&&!image)}
                onClick={analyser}>
                {loading
                  ? <span style={C.loaderRow}><span style={C.spinner}/>Analyse en cours…</span>
                  : "🔍 Analyser ce repas"}
              </button>

              <div style={C.tipBox}>
                <span style={{fontSize:16}}>💡</span>
                <span style={{fontSize:12,color:"#6b7280",lineHeight:1.6}}>Pour les plats en sauce (foutou, gombo...), décris les ingrédients — l'IA sera bien plus précise qu'avec la photo seule.</span>
              </div>
            </div>
          </div>
        )}

        {/* ═══ RÉSULTAT ════════════════════════════════════════ */}
        {screen==="resultat" && res && (
          <div style={C.screen} className="up">
            <div style={C.topBar}>
              <button style={C.backBtn} onClick={()=>nav("accueil","accueil")}>←</button>
              <div style={C.topTitre}>Résultat</div>
            </div>
            <div style={C.body}>

              {/* Photo + nom + verdict */}
              <div style={C.resTop}>
                {image && <img src={image} alt="" style={C.resImg}/>}
                <div style={{flex:1}}>
                  <div style={C.resNom}>{res.plat_identifie}</div>
                  <div style={{...C.verdictBadge,background:vInfo(res.verdict).bg,color:vInfo(res.verdict).c}}>
                    {vInfo(res.verdict).l}
                  </div>
                  <div style={C.resPortion}>{res.portion}</div>
                </div>
              </div>

              {/* Score + Calories — layout NUTRIVO */}
              <div style={C.scoreCalRow}>
                <div style={C.scoreWrap}>
                  <svg width="88" height="88" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="36" fill="none" stroke="#f0fdf4" strokeWidth="9"/>
                    <circle cx="44" cy="44" r="36" fill="none" stroke={sCol(res.score)} strokeWidth="9"
                      strokeDasharray={`${(res.score/10)*226} 226`} strokeLinecap="round" transform="rotate(-90 44 44)"/>
                    <text x="44" y="49" textAnchor="middle" fontSize="22" fontWeight="bold"
                      fill={sCol(res.score)} fontFamily="Unbounded">{res.score}</text>
                  </svg>
                  <div style={C.scoreLbl}>Score global</div>
                </div>
                <div style={C.calBox}>
                  <div style={C.calNum}>{res.calories}</div>
                  <div style={C.calLbl}>kcal</div>
                  {besoins && (
                    <>
                      <div style={C.calBarWrap}>
                        <div style={{...C.calBarFill,width:`${Math.min(100,Math.round(res.calories/besoins.tdee*100))}%`,
                          background:res.calories/besoins.tdee>.5?"#ef4444":"#16a34a"}}/>
                      </div>
                      <div style={C.calPct}>{Math.round(res.calories/besoins.tdee*100)}% de tes besoins/jour</div>
                    </>
                  )}
                </div>
              </div>

              {/* Badge heure — Chrononutrition */}
              {(()=>{
                const ch = analyserHeure();
                if(!ch) return null;
                const bg = ch.statut==="excellent"?"#dcfce7":ch.statut==="danger"?"#fee2e2":ch.statut==="attention"?"#fef9c3":"#f0fdf4";
                const col = ch.statut==="excellent"?"#14532d":ch.statut==="danger"?"#7f1d1d":ch.statut==="attention"?"#78350f":"#166534";
                return (
                  <div style={{background:bg,borderRadius:12,padding:"10px 14px",display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{fontSize:20,flexShrink:0}}>{ch.emoji}</span>
                    <div>
                      <div style={{fontSize:12,fontWeight:700,color:col,marginBottom:2}}>{ch.moment} · {new Date().getHours()}h{String(new Date().getMinutes()).padStart(2,"0")}</div>
                      <div style={{fontSize:12,color:col,lineHeight:1.6}}>{ch.conseil}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Macros — 4 carrés simples */}
              <div style={C.macroRow}>
                {[
                  {e:"🥩",l:"Protéines",v:res.macros.proteines,w:false},
                  {e:"🍞",l:"Glucides", v:res.macros.glucides, w:parseFloat(res.macros.glucides)>70},
                  {e:"🫒",l:"Lipides",  v:res.macros.lipides,  w:parseFloat(res.macros.lipides)>25},
                  {e:"🧂",l:"Sel",      v:res.macros.sel,      w:parseFloat(res.macros.sel)>1.5},
                ].map((m,i)=>(
                  <div key={i} style={{...C.macroCard,borderTop:`3px solid ${m.w?"#ef4444":"#bbf7d0"}`}}>
                    <div style={{fontSize:16}}>{m.e}</div>
                    <div style={{...C.macroVal,color:m.w?"#dc2626":"#111"}}>{m.v}</div>
                    <div style={C.macroLbl}>{m.l}</div>
                  </div>
                ))}
              </div>

              {/* Résumé */}
              <div style={C.resumeBox}>
                <p style={{fontSize:13,color:"#166534",lineHeight:1.8}}>{res.resume}</p>
              </div>

              {/* Alerte santé */}
              {res.alerte_sante && (
                <div style={C.alerteBox}>
                  <span style={{fontSize:22}}>⚠️</span>
                  <p style={{fontSize:13,color:"#7f1d1d",lineHeight:1.7}}>{res.alerte_sante}</p>
                </div>
              )}

              {/* Conseils nutritionnels */}
              {res.conseils?.length>0 && (
                <div style={C.conseilsBox}>
                  <div style={C.conseilsTitre}>💡 Conseils nutritionnels</div>
                  {res.conseils.map((c,i)=>(
                    <div key={i} style={C.conseilLigne}>
                      <span style={{color:"#16a34a",fontWeight:700}}>▸</span>
                      <span style={{fontSize:13,color:"#374151",lineHeight:1.6}}>{c}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Alternative */}
              <div style={C.altBox}>
                <div style={C.altTitre}>🍽️ Suggestion saine</div>
                <p style={{fontSize:13,color:"#1e3a8a",lineHeight:1.7}}>{res.alternative}</p>
              </div>

              <div style={C.disclaimer}>⚕️ Conseils nutritionnels indicatifs — pas de prescriptions médicales. Consulter un professionnel de santé si nécessaire.</div>

              <button style={C.btnVert} onClick={goAnalyse}>
                📸 Analyser un autre repas
              </button>
            </div>
            <BottomNav tab={navTab} nav={nav}/>
          </div>
        )}

        {/* ═══ HISTORIQUE ══════════════════════════════════════ */}
        {screen==="historique" && (
          <div style={C.screen} className="up">
            <div style={C.topBar}><div style={C.topTitre}>Historique</div></div>
            <div style={C.body}>
              {hist.length===0
                ? <div style={C.vide}><div style={{fontSize:48}}>🍽️</div><div style={{color:"#9ca3af",marginTop:12,fontSize:14}}>Aucun repas analysé</div></div>
                : hist.map((h,i)=>(
                  <div key={i} style={C.histItem} className="up">
                    {h.image?<img src={h.image} alt="" style={C.histImg}/>:<div style={C.histEmoji}>🍽️</div>}
                    <div style={{flex:1}}>
                      <div style={C.histNom}>{h.nom}</div>
                      <div style={C.histSub}>{h.cal} kcal · {h.date}</div>
                      <div style={{...C.verdictBadge,...{background:vInfo(h.verdict).bg,color:vInfo(h.verdict).c,fontSize:11,padding:"2px 10px",marginTop:4,display:"inline-block"}}}>
                        {vInfo(h.verdict).l}
                      </div>
                    </div>
                    <div style={{...C.histScore,background:sCol(h.score)}}>{h.score}</div>
                  </div>
                ))
              }
            </div>
            <BottomNav tab={navTab} nav={nav}/>
          </div>
        )}

        {/* ═══ CONSEILS ════════════════════════════════════════ */}
        {screen==="conseils" && (
          <div style={C.screen} className="up">
            <div style={C.topBar}><div style={C.topTitre}>Conseils nutritionnels</div></div>
            <div style={C.body}>
              {[
                {e:"🥘",t:"L'assiette idéale",c:"50% légumes · 25% féculent · 25% protéine. Ajoute toujours des légumes à tes plats."},
                {e:"🧂",t:"Le sel et le cube Maggi",c:"Max 2g de sel/jour (OMS). 1 cube Maggi = 2,5 à 5g de sel. Utilise herbes et piment à la place."},
                {e:"🥬",t:"Le gombo : superaliment CI",c:"Fibres solubles, folates, calcium, IG très bas. Excellent pour diabète, cholestérol et grossesse."},
                {e:"🍗",t:"Le kédjenou : plat santé CI",c:"Cuisson à l'étouffée sans huile ajoutée. Riche en protéines, légumes intégrés, IG très bas."},
                {e:"🫒",t:"Les graisses",c:"Huile de palme avec modération (graisses saturées). Sardine et thon pour les bons oméga-3."},
                {e:"💧",t:"Hydratation",c:"2 litres d'eau minimum par jour. L'eau de coco naturelle est excellente."},
                {e:"⏰",t:"Rythme des repas",c:"3 repas réguliers valent mieux que 2 repas copieux. Ne saute pas le petit-déjeuner."},
              ].map((c,i)=>(
                <div key={i} style={C.conseilCard}>
                  <div style={C.conseilIcon}>{c.e}</div>
                  <div>
                    <div style={C.conseilTitre}>{c.t}</div>
                    <div style={C.conseilTexte}>{c.c}</div>
                  </div>
                </div>
              ))}
              <div style={C.disclaimer}>⚕️ Conseils nutritionnels généraux (OMS). Consulter un professionnel de santé pour un suivi personnalisé.</div>
            </div>
            <BottomNav tab={navTab} nav={nav}/>
          </div>
        )}

      </div>
    </div>
  );
}

/* ── BOTTOM NAV ─────────────────────────────────────────────────── */
function BottomNav({tab, nav}) {
  const items = [
    {id:"accueil",  e:"🏠", l:"Accueil",   s:"accueil"},
    {id:"historique",e:"📋",l:"Historique",s:"historique"},
    {id:"conseils", e:"💡", l:"Conseils",  s:"conseils"},
    {id:"profil",   e:"👤", l:"Profil",    s:"profil"},
  ];
  return (
    <nav style={{display:"flex",background:"#fff",borderTop:`1px solid ${G.vertC}`,paddingBottom:4,boxShadow:"0 -2px 8px rgba(0,0,0,.06)"}}>
      {items.map(it=>(
        <button key={it.id} onClick={()=>nav(it.id,it.s)}
          style={{flex:1,padding:"8px 0",border:"none",background:"transparent",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,borderTop:tab===it.id?`3px solid ${G.vert}`:"3px solid transparent"}}>
          <span style={{fontSize:20}}>{it.e}</span>
          <span style={{fontSize:10,color:tab===it.id?G.vert:"#9ca3af",fontWeight:700,fontFamily:"Nunito"}}>{it.l}</span>
        </button>
      ))}
    </nav>
  );
}

/* ── STYLES ─────────────────────────────────────────────────────── */
const G = { vert:"#16a34a", vertF:"#14532d", vertC:"#dcfce7", vertP:"#e8f5e9", fond:"#e8f5e9", blanc:"#fff", gris:"#6b7280", border:"#c8e6c9" };

const C = {
  wrap:{ minHeight:"100vh", background:"#e8f5e9", display:"flex", justifyContent:"center", alignItems:"flex-start" },
  phone:{ width:"100%", maxWidth:420, minHeight:"100vh", background:"#e8f5e9", display:"flex", flexDirection:"column", fontFamily:"'Nunito',sans-serif" },
  screen:{ flex:1, display:"flex", flexDirection:"column", maxHeight:"100vh" },
  body:{ flex:1, overflowY:"auto", padding:"14px 16px", display:"flex", flexDirection:"column", gap:12, background:"#e8f5e9" },

  /* HERO */
  hero:{ background:"#fff", padding:"40px 24px 32px", textAlign:"center", flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" },
  heroLogoWrap:{ marginBottom:8 },
  heroNom:{ fontFamily:"'Arial Black',Georgia,sans-serif", fontSize:40, color:"#14532d", fontWeight:900, letterSpacing:2, marginBottom:6 },
  heroTag:{ fontSize:14, color:"#4b5563", marginBottom:24, fontStyle:"italic" },
  heroAssiette:{ marginBottom:32 },
  btnCommencer:{ width:"80%", padding:"16px", background:"#16a34a", color:"#fff", border:"none", borderRadius:30, fontSize:17, fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", letterSpacing:1, boxShadow:"0 4px 16px rgba(22,163,74,.35)" },

  /* TOP BAR */
  topBar:{ display:"flex", alignItems:"center", gap:10, padding:"14px 16px", background:G.blanc, borderBottom:`1px solid ${G.vertC}` },
  topTitre:{ flex:1, fontFamily:"'Nunito',sans-serif", fontSize:16, color:G.vertF, fontWeight:800, textAlign:"center" },
  backBtn:{ background:"none", border:"none", color:G.vert, fontSize:22, cursor:"pointer", width:32, lineHeight:1 },

  /* CONSEIL JOUR */
  conseilJour:{ background:G.blanc, borderRadius:16, padding:"14px 16px", display:"flex", gap:12, alignItems:"flex-start", border:`1px solid ${G.vertC}`, boxShadow:"0 2px 8px rgba(22,163,74,.08)" },
  cjTitre:{ fontSize:12, fontWeight:700, color:G.vert, marginBottom:3 },
  cjTexte:{ fontSize:13, color:"#374151", lineHeight:1.7 },

  /* BTN PRINCIPAL */
  btnPrincipal:{ background:`linear-gradient(135deg,${G.vert},${G.vertF})`, borderRadius:20, padding:"18px 20px", border:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:16, boxShadow:"0 4px 16px rgba(22,163,74,.3)" },
  btnPrincTitre:{ fontSize:17, fontWeight:800, color:"#fff", fontFamily:"'Unbounded',sans-serif" },
  btnPrincSub:{ fontSize:12, color:"rgba(255,255,255,.8)", marginTop:2 },

  /* IMC BAND */
  imcBand:{ background:G.blanc, borderRadius:14, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-around", border:`1px solid ${G.border}` },
  imcItem:{ textAlign:"center" },
  imcVal:{ fontFamily:"'Unbounded',sans-serif", fontSize:20, fontWeight:700, color:G.vertF },
  imcLbl:{ fontSize:10, color:G.gris, marginTop:2 },
  imcDiv:{ width:1, height:36, background:G.border },

  /* SECTION */
  sectionTitre:{ fontSize:13, fontWeight:700, color:G.vertF, borderLeft:`3px solid ${G.vert}`, paddingLeft:8 },

  /* HISTORIQUE */
  histItem:{ background:G.blanc, borderRadius:14, padding:"10px 12px", display:"flex", alignItems:"center", gap:12, border:`1px solid ${G.border}` },
  histImg:{ width:52, height:52, borderRadius:12, objectFit:"cover" },
  histEmoji:{ width:52, height:52, borderRadius:12, background:G.vertC, display:"flex", alignItems:"center", justifyContent:"center", fontSize:22 },
  histNom:{ fontSize:14, fontWeight:700, color:"#111" },
  histSub:{ fontSize:11, color:G.gris, marginTop:2 },
  histScore:{ color:"#fff", fontWeight:800, fontSize:14, width:36, height:36, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 },

  /* PROFIL */
  lbl:{ fontSize:12, fontWeight:700, color:"#374151", marginBottom:5 },
  inp:{ width:"100%", padding:"11px 13px", border:`1.5px solid ${G.border}`, borderRadius:12, fontSize:14, background:G.blanc, color:"#111", fontFamily:"'Nunito',sans-serif" },
  row2:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 },
  toggle:{ display:"flex", border:`1.5px solid ${G.border}`, borderRadius:12, overflow:"hidden" },
  toggleOpt:{ flex:1, padding:"10px 0", border:"none", cursor:"pointer", fontSize:13, fontWeight:600, fontFamily:"'Nunito',sans-serif", transition:"all .2s" },
  pills:{ display:"flex", flexWrap:"wrap", gap:7 },
  pill:{ padding:"7px 14px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:"'Nunito',sans-serif", transition:"all .2s" },
  condGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8, alignItems:"start" },
  condBtn:{ padding:"10px 6px", borderRadius:12, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:4, transition:"all .2s" },

  /* SCANNER */
  photoZone:{ border:`2px dashed ${G.vertC}`, borderRadius:18, minHeight:160, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", overflow:"hidden", background:G.blanc },
  photoImg:{ width:"100%", maxHeight:220, objectFit:"cover" },
  photoVide:{ textAlign:"center", padding:20 },
  photoTexte:{ color:G.vert, fontWeight:700, fontSize:14, marginTop:8 },
  photoSub:{ color:G.gris, fontSize:11, marginTop:3 },
  platGrid:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 },
  platBtn:{ padding:"10px 8px", borderRadius:12, cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:5, transition:"all .2s" },
  tagCloud:{ display:"flex", flexWrap:"wrap", gap:7 },
  tagBtn:{ padding:"6px 13px", borderRadius:20, border:"none", cursor:"pointer", fontSize:12, fontWeight:600, fontFamily:"'Nunito',sans-serif", transition:"all .2s" },
  badge:{ fontSize:10, background:"#dcfce7", color:G.vert, padding:"2px 8px", borderRadius:10, fontWeight:700, marginLeft:8 },
  textarea:{ width:"100%", padding:"11px 13px", border:`1.5px solid ${G.border}`, borderRadius:12, fontSize:12, background:G.blanc, resize:"none", lineHeight:1.7, fontFamily:"'Nunito',sans-serif", color:"#374151" },
  tipBox:{ background:G.vertP, borderRadius:12, padding:"10px 14px", display:"flex", gap:10, alignItems:"flex-start" },

  /* RÉSULTAT */
  resTop:{ display:"flex", gap:12, alignItems:"center" },
  resImg:{ width:76, height:76, borderRadius:16, objectFit:"cover", border:`2px solid ${G.vertC}` },
  resNom:{ fontFamily:"'Unbounded',sans-serif", fontSize:15, fontWeight:700, color:"#111", marginBottom:6, lineHeight:1.3 },
  verdictBadge:{ display:"inline-block", padding:"4px 13px", borderRadius:20, fontSize:12, fontWeight:700 },
  resPortion:{ fontSize:11, color:G.gris, marginTop:4 },

  scoreCalRow:{ display:"flex", gap:14, alignItems:"center" },
  scoreWrap:{ display:"flex", flexDirection:"column", alignItems:"center", gap:4 },
  scoreLbl:{ fontSize:11, color:G.gris },
  calBox:{ flex:1, background:G.vertP, borderRadius:16, padding:"14px 18px" },
  calNum:{ fontFamily:"'Unbounded',sans-serif", fontSize:34, fontWeight:900, color:G.vert },
  calLbl:{ fontSize:11, color:G.gris },
  calBarWrap:{ height:6, background:G.vertC, borderRadius:6, overflow:"hidden", marginTop:8, marginBottom:4 },
  calBarFill:{ height:"100%", borderRadius:6, transition:"width .5s" },
  calPct:{ fontSize:11, color:G.gris },

  macroRow:{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 },
  macroCard:{ background:G.blanc, borderRadius:12, padding:"10px 4px", textAlign:"center", border:`1px solid ${G.border}` },
  macroVal:{ fontWeight:800, fontSize:14 },
  macroLbl:{ fontSize:10, color:G.gris, marginTop:2 },

  resumeBox:{ background:G.vertP, borderRadius:14, padding:14 },
  alerteBox:{ background:"#fff1f2", border:"1px solid #fecdd3", borderRadius:14, padding:14, display:"flex", gap:10, alignItems:"flex-start" },
  conseilsBox:{ background:G.blanc, border:`1px solid ${G.vertC}`, borderRadius:14, padding:14 },
  conseilsTitre:{ fontSize:13, fontWeight:700, color:G.vert, marginBottom:8 },
  conseilLigne:{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:6 },
  altBox:{ background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:14, padding:14 },
  altTitre:{ fontSize:12, fontWeight:700, color:"#1e40af", marginBottom:6 },

  /* CONSEILS PAGE */
  conseilCard:{ background:G.blanc, borderRadius:14, padding:"12px 14px", display:"flex", gap:12, alignItems:"flex-start", border:`1px solid ${G.border}` },
  conseilIcon:{ fontSize:26, flexShrink:0 },
  conseilTitre:{ fontSize:13, fontWeight:700, color:G.vertF, marginBottom:4 },
  conseilTexte:{ fontSize:12, color:"#4b5563", lineHeight:1.7 },

  /* COMMUN */
  btnVert:{ width:"100%", padding:"14px", background:`linear-gradient(135deg,${G.vert},${G.vertF})`, color:"#fff", border:"none", borderRadius:14, fontSize:15, fontWeight:800, cursor:"pointer", fontFamily:"'Unbounded',sans-serif", letterSpacing:.5 },
  btnSetup:{ background:"transparent", border:`1.5px dashed ${G.vert}`, borderRadius:12, padding:"11px 14px", fontSize:13, color:G.vert, fontWeight:600, cursor:"pointer", textAlign:"center" },
  btnLien:{ background:"none", border:"none", color:G.gris, fontSize:12, cursor:"pointer", textDecoration:"underline", alignSelf:"flex-start" },
  disclaimer:{ fontSize:11, color:G.gris, lineHeight:1.6, textAlign:"center", fontStyle:"italic" },
  loaderRow:{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 },
  spinner:{ display:"inline-block", width:18, height:18, border:"2px solid rgba(255,255,255,.3)", borderTop:"2px solid #fff", borderRadius:"50%", animation:"spin .7s linear infinite" },
  vide:{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", flex:1, padding:40, textAlign:"center" },
};
