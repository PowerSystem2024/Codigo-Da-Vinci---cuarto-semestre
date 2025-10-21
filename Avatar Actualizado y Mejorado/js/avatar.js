/* ---------- DATA ---------- */
const BASE_PJS = [
  {nombre:'Zuko',img:'./public/images/zuko.webp'},
  {nombre:'Katara',img:'./public/images/katara.png'},
  {nombre:'Aang',img:'./public/images/aang.png'},
  {nombre:'Toph',img:'./public/images/toph.webp'}
];
const TECNICAS = ['Puño','Patada','Barrida'];
const GANA_DE = {Puño:'Barrida',Patada:'Puño',Barrida:'Patada'};
const IMG_EXTRA = {
  Sokka:'./public/images/sokka.webp',
  Azula:'./public/images/azula.webp',
  Iroh:'./public/images/iroh.webp'
};

/* ---------- HELPERS ---------- */
const $ = q => document.querySelector(q);
const $$ = q => [...document.querySelectorAll(q)];

/* ---------- CLASES ---------- */
class Personaje{
  constructor({nombre,img}){
    this.nombre = nombre;
    this.img = img;
  }
  render(){
    return `
      <label class="pj">
        <input type="radio" name="personaje" value="${this.nombre}">
        <img src="${this.img}" alt="${this.nombre}">
        <div class="pj-name">${this.nombre}</div>
      </label>`;
  }
}

class Juego{
  constructor(){
    this.pjs = BASE_PJS.map(p=>new Personaje(p));
    this.vidas = {jugador:3,enemigo:3};
    this.seleccion = {jugador:null,enemigo:null};
    this.ataque  = {jugador:null,enemigo:null};
    this.inicializarVista();
    this.inyectarPersonajes();
    this.escuchar();
  }
  inicializarVista(){
    const nodos = {};
    ['reglas','seleccionar-personaje','combate','btn-reiniciar',
     'mensaje'].forEach(id => {
       const el = document.getElementById(id);
       if (!el) console.warn(`⚠️ No se encontró #${id}`);
       nodos[id] = el;
     });
    Object.assign(this, nodos);
  }
  inyectarPersonajes(){
    const grid = $('.personajes-grid');
    grid.innerHTML = this.pjs.map(p=>p.render()).join('');
  }
  escuchar(){
    const self = this;

    /* botones principales */
    $('#btn-reglas').addEventListener('click',()=>self.reglas.toggleAttribute('hidden'));
    $('#btn-reiniciar').addEventListener('click',()=>self.reiniciar());
    $('#btn-agregar').addEventListener('click',()=>$('#form-agregar').toggleAttribute('hidden'));
    $('#form-agregar').addEventListener('submit',e=>self.agregarPersonaje(e));

    /* clic en tarjeta → marca radio y dispara change */
    $('.personajes-grid').addEventListener('click',e=>{
      const card = e.target.closest('.pj');
      if(!card) return;
      const input = card.querySelector('input[type="radio"]');
      if(!input) return;
      input.checked = true;
      input.dispatchEvent(new Event('change',{bubbles:true}));
    });

    /* cuando el radio cambie → habilitar botón (con traza) */
    $('.personajes-grid').addEventListener('change',e=>{
      if(e.target.name !== 'personaje') return;
      console.log('✅ Evento change disparado');
      self.seleccion.jugador = e.target.value;
      $$('.pj').forEach(p=>p.classList.remove('selected'));
      e.target.closest('.pj').classList.add('selected');

      // ACTIVAMOS el botón sin condiciones
      const btn = document.getElementById('btn-confirmar');
      if (btn) {
        btn.disabled = false;
        console.log('🔓 Botón Confirmar habilitado');
      } else {
        console.warn('❌ Botón Confirmar no encontrado');
      }
    });

    /* click directo sobre el botón (por si el change falla) */
    document.addEventListener('click',e=>{
      if(e.target.id==='btn-confirmar' && e.target.disabled===false){
        console.log('🚀 Click en Confirmar');
        self.confirmarPersonaje();
      }
    });

    /* ataques */
    $('.tecnicas').addEventListener('click',e=>{
      const btn = e.target.closest('button');
      if(!btn) return;
      self.atacar(btn.dataset.tec);
    });
  }
  confirmarPersonaje(){
    // Buscamos los nodos justo antes de usarlos
    const btnConfirm   = document.getElementById('btn-confirmar');
    const nombreJug    = document.getElementById('nombre-jugador');
    const nombreEnem   = document.getElementById('nombre-enemigo');
    const vidasJug     = document.getElementById('vidas-jugador');
    const vidasEnem    = document.getElementById('vidas-enemigo');
    const barraJug     = document.getElementById('barra-jugador');
    const barraEnem    = document.getElementById('barra-enemigo');
    const sectPerson   = document.getElementById('seleccionar-personaje');
    const sectCombate  = document.getElementById('combate');
    const btnRein      = document.getElementById('btn-reiniciar');

    if (!btnConfirm || this.seleccion.jugador === null) return;

    this.seleccion.enemigo = this.random(this.pjs).nombre;

    // Solo actualizamos si el nodo existe
    if (nombreJug) nombreJug.textContent = this.seleccion.jugador;
    if (nombreEnem) nombreEnem.textContent = this.seleccion.enemigo;
    if (vidasJug) vidasJug.textContent = this.vidas.jugador;
    if (vidasEnem) vidasEnem.textContent = this.vidas.enemigo;
    if (barraJug) barraJug.style.width = `${(this.vidas.jugador/3)*100}%`;
    if (barraEnem) barraEnem.style.width = `${(this.vidas.enemigo/3)*100}%`;

    if (sectPerson) sectPerson.hidden = true;
    if (sectCombate) sectCombate.hidden = false;
    if (btnRein) btnRein.disabled = false;

    console.log('✅ Confirmar ejecutado – entrando al combate');
  }
  atacar(tec){
    this.ataque.jugador = tec;
    this.ataque.enemigo = this.random(TECNICAS);
    this.resolver();
  }
  resolver(){
    const {jugador,enemigo} = this.ataque;
    let msg = '';
    if(jugador===enemigo){
      msg = `Empate – ambos usaron ${jugador}`;
    }else if(GANA_DE[jugador]===enemigo){
      msg = `¡Ganaste! ${jugador} vence a ${enemigo}`;
      this.vidas.enemigo--;
    }else{
      msg = `¡Perdiste! ${enemigo} vence a ${jugador}`;
      this.vidas.jugador--;
    }
    const mens = document.getElementById('mensaje');
    if (mens) mens.textContent = msg;
    this.actualizarBarras();
    if(this.vidas.jugador===0||this.vidas.enemigo===0) this.finalizar();
  }
  actualizarBarras(){
    const vidasJug  = document.getElementById('vidas-jugador');
    const vidasEnem = document.getElementById('vidas-enemigo');
    const barraJug  = document.getElementById('barra-jugador');
    const barraEnem = document.getElementById('barra-enemigo');
    if (vidasJug)  vidasJug.textContent  = this.vidas.jugador;
    if (vidasEnem) vidasEnem.textContent = this.vidas.enemigo;
    if (barraJug)  barraJug.style.width  = `${(this.vidas.jugador/3)*100}%`;
    if (barraEnem) barraEnem.style.width = `${(this.vidas.enemigo/3)*100}%`;
  }
  finalizar(){
    const gano = this.vidas.enemigo===0;
    const mens = document.getElementById('mensaje');
    if (mens) mens.innerHTML = `${gano?'¡Victoria!':'Derrota'}<br><small>Recarga para jugar de nuevo</small>`;
    const tecnicas = $$('.tecnicas button');
    tecnicas.forEach(b=>b.disabled=true);
  }
  reiniciar(){
    this.vidas = {jugador:3,enemigo:3};
    this.seleccion = {jugador:null,enemigo:null};
    this.ataque  = {jugador:null,enemigo:null};
    this.actualizarBarras();
    const mens = document.getElementById('mensaje');
    if (mens) mens.textContent = '';
    $$('.tecnicas button').forEach(b=>b.disabled=false);
    $('.pj.selected')?.classList.remove('selected');
    const btn = document.getElementById('btn-confirmar');
    if (btn) btn.disabled = true;
    const sectPerson  = document.getElementById('seleccionar-personaje');
    const sectCombate = document.getElementById('combate');
    if (sectPerson)  sectPerson.hidden  = false;
    if (sectCombate) sectCombate.hidden = true;
  }
  agregarPersonaje(e){
    e.preventDefault();
    const nombre = $('#select-pj').value;
    if(!nombre||this.pjs.some(p=>p.nombre===nombre)) return;
    this.pjs.push(new Personaje({nombre,img:IMG_EXTRA[nombre]}));
    this.inyectarPersonajes();
    e.target.reset();
    e.target.hidden = true;
  }
  random(arr){return arr[Math.floor(Math.random()*arr.length)]}
}

/* ---------- INICIO ---------- */
document.getElementById('btn-jugar').addEventListener('click', () => {
  new Juego();
  document.getElementById('seleccionar-personaje').hidden = false;
  document.getElementById('btn-jugar').disabled = true;
});