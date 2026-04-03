// state.js must load first — state is a global

const slicerApp = {

    // ─── Constants ──────────────────────────────────────────────────────────────
  
    STL_DEFAULTS: {
      visible: true, locked: false, objectPrintMode: 'planar',
      activePrintProfile: 'PLA Print', baseFilamentProfile: 'PLA Filament',
      infillDensity: 20, perimeters: 3, infillPattern: 'Gyroid',
      materialType: 'PLA', nozzleTemp: 210, bedTemp: 60,
      xAngle: 0, yAngle: 0, zAngle: 0, xShift: 0, yShift: 0, zShift: 0,
      zMin: false, maxSlopeAngle: 45, nonPlanarZOffset: 0,
      childIds: []
    },
  
    SURFACE_DEFAULTS: {
      visible: true, locked: false, regionPrintMode: 'planar',
      surfaceExtrusionDepth: 1.2,
      // null = inherit from parent STL
      infillDensity: null, perimeters: null, infillPattern: null,
      materialType: null, nozzleTemp: null, bedTemp: null,
    },
  
    // id must match the property name on the node — inputs use their own id to write directly
    FIELDS: {
      xAngle:                { label: 'X Rotation',        type: 'number',   step: 1 },
      yAngle:                { label: 'Y Rotation',        type: 'number',   step: 1 },
      zAngle:                { label: 'Z Rotation',        type: 'number',   step: 1 },
      xShift:                { label: 'X Translation',     type: 'number',   step: 1 },
      yShift:                { label: 'Y Translation',     type: 'number',   step: 1 },
      zShift:                { label: 'Z Translation',     type: 'number',   step: 1 },
      zMin:                  { label: 'Auto Drop To Bed',  type: 'checkbox'            },
      maxSlopeAngle:         { label: 'Max Slope Angle',   type: 'number',   step: 1, min: 0, max: 90 },
      nonPlanarZOffset:      { label: 'Z Contact Offset',  type: 'number',   step: 0.1 },
      infillDensity:         { label: 'Infill Density',    type: 'number',   step: 1 },
      perimeters:             { label: 'Perimeters',             type: 'number',   step: 1 },
      infillPattern:         { label: 'Pattern',           type: 'select',   options: ['Gyroid','Lines','Grid'] },
      materialType:          { label: 'Material Type',     type: 'select',   options: ['PLA','TPU','PETG'] },
      nozzleTemp:            { label: 'Nozzle Temp',       type: 'number',   step: 1 },
      bedTemp:               { label: 'Bed Temp',          type: 'number',   step: 1 },
      surfaceExtrusionDepth: { label: 'Surface Thickness', type: 'number',   step: 0.1 },
    },
  
    // Only render-target bodies are cached here.
    // Panel shells / drawers / status els use el() — always fresh, never stale.
    els: {},
    el(id) { return document.getElementById(id); },
  
    // ─── Core Node ──────────────────────────────────────────────────────────────
  
    node({ html, wrap, children = [], visible } = {}) {
      return {
        render() {
          if (visible && !visible()) return '';
          const self  = html ? html() : '';
          const inner = self + children.map(c => c.render()).join('');
          return wrap ? wrap(inner) : inner;
        }
      };
    },
  
    esc(v) {
      return String(v ?? '').replace(/[&<>"']/g, c =>
        ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));
    },
  
    // ─── Data Helpers ────────────────────────────────────────────────────────────
  
    getNode(id)    { return state.nodes.get(id) ?? null; },
    getObjects() {
      if (state.objects instanceof Map) return Array.from(state.objects.values());
      if (Array.isArray(state.objects)) return state.objects;
      return Array.from(state.nodes.values()).filter(n => !n.parentId);
    },
    getChildren(n) {
      if (!n) return [];
      if (Array.isArray(n.children) && n.children.length) return n.children.filter(Boolean);
      return (n.childIds || []).map(id => this.getNode(id)).filter(Boolean);
    },
  
    getSelection() {
      const target = this.getNode(state.selectedId) || this.getObjects()[0] || null;
      if (!target) return { object: null, region: null, target: null, kind: 'object' };
      if (target.parentId) return { object: this.getNode(target.parentId), region: target, target, kind: 'region' };
      return { object: target, region: null, target, kind: 'object' };
    },
  
    resolveVal(target, fieldId) {
      if (!target) return '';
      const val = target[fieldId];
      if (val !== null && val !== undefined && val !== '') return val;
      if (target.parentId) {
        const parent = this.getNode(target.parentId);
        if (parent && parent[fieldId] !== null && parent[fieldId] !== undefined && parent[fieldId] !== '') {
          return parent[fieldId];
        }
      }
      const def = this.FIELDS[fieldId];
      if (!def) return '';
      if (def.type === 'checkbox') return false;
      if (def.type === 'number') return 0;
      if (def.type === 'select') return def.options?.[0] ?? '';
      return '';
    },
  
    hydrateNode(n, isRegion = false) {
      const defaults = isRegion ? this.SURFACE_DEFAULTS : this.STL_DEFAULTS;
      for (const [k, v] of Object.entries(defaults))
        if (n[k] === undefined) n[k] = structuredClone(v);
      if (!isRegion) {
        if (n.expanded === undefined) n.expanded = true;
        if (!Array.isArray(n.childIds)) n.childIds = [];
        if (Array.isArray(n.children) && n.children.length) {
          n.children.forEach(child => {
            if (!child?.id) return;
            child.parentId = n.id;
            this.hydrateNode(child, true);
            state.nodes.set(child.id, child);
            if (!n.childIds.includes(child.id)) n.childIds.push(child.id);
          });
        }
      }
      return n;
    },
  
    // ─── Element Factories ───────────────────────────────────────────────────────
  
    field(fieldId) {
      const app = this;
      return this.node({
        html() {
          const { target } = app.getSelection();
          if (!target) return '';
          const def       = app.FIELDS[fieldId];
          const val       = app.resolveVal(target, fieldId);
          const inherited = !!target.parentId && (target[fieldId] === null || target[fieldId] === undefined || target[fieldId] === '');
          let control;
          if (def.type === 'select') {
            const opts = def.options.map(o =>
              `<option value="${app.esc(o)}"${String(val) === o ? ' selected' : ''}>${app.esc(o)}</option>`).join('');
            control = `<select id="${fieldId}"${inherited ? ' data-inherited="true"' : ''}>${opts}</select>`;
          } else if (def.type === 'checkbox') {
            control = `<input id="${fieldId}" type="checkbox"${val ? ' checked' : ''}${inherited ? ' data-inherited="true"' : ''}>`;
          } else {
            const attrs = [
              `value="${app.esc(val ?? '')}"`,
              def.step !== undefined ? `step="${def.step}"` : '',
              def.min  !== undefined ? `min="${def.min}"`   : '',
              def.max  !== undefined ? `max="${def.max}"`   : '',
              inherited ? 'data-inherited="true"' : '',
            ].filter(Boolean).join(' ');
            control = `<input id="${fieldId}" type="number" ${attrs}>`;
          }
          return `<div class="mui-field${inherited ? ' inherited' : ''}">
            <label>${app.esc(def.label)}</label>${control}
          </div>`;
        }
      });
    },
  
    title(text) {
      return this.node({ html: () => `<div class="drawer-section-title">${this.esc(text)}</div>` });
    },
  
    modeToggle(scope) {
      const app = this;
      return this.node({
        html() {
          const ctx   = app.getSelection();
          const cur   = scope === 'object' ? (ctx.object?.objectPrintMode || 'planar') : (ctx.region?.regionPrintMode || 'planar');
          const label = scope === 'object' ? 'Object Slicing Mode' : 'Region Slicing Mode';
          return `<div class="drawer-section">
            <div class="drawer-section-title">${label}</div>
            <div class="pipebar">
              <button class="tab-btn${cur === 'planar'     ? ' active' : ''}" data-mode="${scope}" data-val="planar">Planar</button>
              <button class="tab-btn${cur === 'non-planar' ? ' active' : ''}" data-mode="${scope}" data-val="non-planar">Non-Planar</button>
            </div>
          </div>`;
        }
      });
    },
  
    group(children, isHidden) {
      return this.node({
        visible:  () => !isHidden(),
        wrap:     inner => `<div class="form-grid">${inner}</div>`,
        children
      });
    },
  
    tabPane(tabId, children) {
      return this.node({
        visible:  () => state.editorTab === tabId,
        wrap:     inner => `<div class="tab-pane">${inner}</div>`,
        children
      });
    },
  
    // ─── Trees ───────────────────────────────────────────────────────────────────
  
    buildEditorTree() {
      const ctx  = this.getSelection();
      const tabs = ctx.kind === 'region' ? ['surface','print','filament'] : ['positioning','print','filament'];
      if (!tabs.includes(state.editorTab)) state.editorTab = tabs[0];
      const f    = id => this.field(id);
  
      return this.node({ children: [
        this.node({ html: () =>
          `<div class="editor-tabs">${tabs.map(t =>
            `<button class="tab-btn${state.editorTab === t ? ' active' : ''}" data-tab="${t}">
              ${t[0].toUpperCase() + t.slice(1)}
            </button>`).join('')}</div>`
        }),
  
        this.tabPane('positioning', [
          this.modeToggle('object'),
            this.group(
          [this.title('Planar Scaffold Parameters'),
          ...['xAngle','yAngle','zAngle','xShift','yShift','zShift','zMin'].map(f)],
        () => ctx.object?.objectPrintMode !== 'planar'),


          this.group(
            [this.title('Non-Planar Parameters'), ...['nonPlanarZOffset','maxSlopeAngle'].map(f)],
            () => ctx.object?.objectPrintMode !== 'non-planar'
          )
        ]),
  
        this.tabPane('print',    [...['infillDensity','perimeters','infillPattern'].map(f)]),
        this.tabPane('filament', [...['materialType','nozzleTemp','bedTemp'].map(f)]),
  
        this.tabPane('surface', [
          this.modeToggle('region'),
          this.group(
            [f('surfaceExtrusionDepth')],
            () => ctx.region?.regionPrintMode !== 'non-planar'
          )
        ])
      ]});
    },
  
    buildSidebarTree() {
      return this.node({ children: [
        this.node({ html: () => `
          <div class="mui-panel">
            <div class="floating-label">Global</div>
            <div class="mui-panel-body">
              <div class="mass-row${state.massRows?.infill === false ? ' collapsed' : ''}">
                <button class="mass-btn" data-action="toggleMassInfill">Set Infill All</button>
                <div class="mui-field" style="display:${state.massRows?.infill === false ? 'none' : ''}">
                  <label>Infill %</label>
                  <input id="mass-infill" value="${this.esc(state.globalMassSettings?.infill || '')}">
                </div>
              </div>
              <div class="mass-row${state.massRows?.perimeters === false ? ' collapsed' : ''}">
                <button class="mass-btn" data-action="toggleMassPerimeters">Set Perimeters All</button>
                <div class="mui-field" style="display:${state.massRows?.perimeters === false ? 'none' : ''}">
                  <label>Wall Count</label>
                  <input id="mass-perimeters" value="${this.esc(state.globalMassSettings?.perimeters || '')}">
                </div>
              </div>
            </div>
          </div>`
        }),
        this.node({
          wrap: inner => `<div class="mui-panel">
            <div class="floating-label">Objects &amp; Regions</div>
            <div class="mui-panel-body"><div class="tree-list">${inner}</div></div>
          </div>`,
          children: this.getObjects().map(o => this.stlNode(o))
        })
      ]});
    },
  
    stlNode(obj) {
      return this.node({
        wrap: inner => `<div class="tree-item">${inner}</div>`,
        html: () => `
          <div class="tree-main profile-card${state.selectedId === obj.id ? ' active' : ''}"
               data-select="${this.esc(obj.id)}" data-type="object">
            <div class="tree-row-head">
              <div>
                <div class="tree-name">${this.esc(obj.name || 'Object')}</div>
                <div class="tree-meta">${this.esc(obj.description || '')}${obj.locked ? ' · locked' : ''}</div>
              </div>
            </div>
          </div>`,
        children: obj.expanded === false ? [] : this.getChildren(obj).map(r => this.surfaceNode(r))
      });
    },
  
    surfaceNode(region) {
      return this.node({
        html: () => `
          <div class="tree-main profile-card${state.selectedId === region.id ? ' active' : ''}"
               style="margin:1vh; border:1px solid var(--line); border-radius:5px"
               data-select="${this.esc(region.id)}" data-type="region">
            <div class="tree-name">${this.esc(region.name || 'Surface')}</div>
            <div class="tree-meta">${this.esc(region.description || '')}</div>
          </div>`
      });
    },
  
    buildLogTree() {
      return this.node({
        html: () => (state.logEntries || []).map(e =>
          `<div class="log-entry"><strong>[${this.esc(e.time)}]</strong> ${this.esc(e.message)}</div>`
        ).join('')
      });
    },
  
    // ─── Render ──────────────────────────────────────────────────────────────────
  
    regions: {
      sidebar: { elId: 'sidebarBody', build: 'buildSidebarTree' },
      editor:  { elId: 'editorBody',  build: 'buildEditorTree'  },
      log:     { elId: 'logPane',     build: 'buildLogTree'     },
    },
  
    render(name = 'all') {
      if (name === 'all') {
        Object.keys(this.regions).forEach(n => this.render(n));
        this.syncStatus();
        this.drawViewport();
        return;
      }
      const r  = this.regions[name];
      if (!r) return;
      const el = this.els[r.elId] || (this.els[r.elId] = this.el(r.elId));
      if (!el) return;
      el.innerHTML = this[r.build]().render();
      this.bindRegion(name);
    },
  
    renderAll() { this.render('all'); },
  
    // ─── Status / Panel Sync ─────────────────────────────────────────────────────
    // Always uses el() — fresh getElementById every time, never a stale cached ref.
    // This is what makes CSS transitions actually fire on panel shells.
  
    syncStatus() {
      const ctx = this.getSelection();
  
      const statusText = this.el('statusText');
      if (statusText) statusText.textContent = state.dirty ? 'Modified' : 'Ready';
  
      const title = this.el('editorTargetTitle');
      if (title) title.textContent = ctx.region
        ? `${ctx.object?.name || ''} / ${ctx.region?.name || 'Surface'}`
        : (ctx.object?.name || '');
  
      // objectEditor uses display style directly — no .hidden class in the CSS
      const editor = this.el('objectEditor');
      if (editor) editor.style.display = state.editorHidden ? 'none' : '';
  
      // All other panels use CSS classes for their transitions
      const panels = [
        ['sidebarShell',   'sidebarCollapsed', 'collapsed'],
        ['settingsDrawer', 'settingsOpen',     'open'],
        ['machineDrawer',  'machineOpen',      'open'],
        ['devShell',       'devCollapsed',     'collapsed'],
        ['previewShell',   'previewCollapsed', 'collapsed'],
      ];
      panels.forEach(([elId, flag, cls]) => {
        this.el(elId)?.classList.toggle(cls, !!state[flag]);
      });
    },
  
    // ─── Bind ────────────────────────────────────────────────────────────────────
  
    bindRegion(name) {
      if (name === 'sidebar') {
        this.els.sidebarBody.querySelectorAll('[data-select]').forEach(el => {
          const n = this.getNode(el.dataset.select);
          if (!n) return;
          el.onclick = e => {
            e.stopPropagation();
            if (el.dataset.type === 'object') n.expanded = n.expanded === false ? true : false;
            this.selectNode(el.dataset.select);
            compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
          };
          el.oncontextmenu = e => {
            e.preventDefault(); e.stopPropagation();
            this.openContextMenu(e.clientX, e.clientY, [
              [n.locked ? 'Unlock' : 'Lock', () => { n.locked = !n.locked; this.render('sidebar'); }],
              [n.visible === false ? 'Show' : 'Hide', () => { n.visible = n.visible !== false; this.render('sidebar'); compute?.rotateView?.(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle); }],
              ['Edit', () => this.selectNode(el.dataset.select, true)],
              ['Delete', ()=> {
                  if(state.objects.has(el.dataset.select)){
                    state.objects.delete(el.dataset.select);
                  } else {
                    let child = state.nodes.get(el.dataset.select);
                    state.selectedId = child.parentId;
                    state.nodes.delete(child.id);
                    let children = state.objects.get(child.parentId).children;
                    for(let i = 0; i < children.length; i++){
                        if(children[i].id == child.id){
                            children.splice(i, 1);
                            break;
                        }
                    };
                    compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
                  }
                  slicerApp.render('sidebar');
            }
            ]
            ]);
          };
        });
  
        this.els.sidebarBody.querySelectorAll('[data-action="toggleMassInfill"]').forEach(btn => {
          btn.onclick = e => { e.stopPropagation(); state.massRows = state.massRows || {}; state.massRows.infill = state.massRows.infill === false ? true : false; this.render('sidebar'); };
        });
        this.els.sidebarBody.querySelectorAll('[data-action="toggleMassPerimeters"]').forEach(btn => {
          btn.onclick = e => { e.stopPropagation(); state.massRows = state.massRows || {}; state.massRows.perimeters = state.massRows.perimeters === false ? true : false; this.render('sidebar'); };
        });
      }
  
      if (name === 'editor') {
        this.els.editorBody.querySelectorAll('[data-tab]').forEach(btn => {
          btn.onclick = e => { e.stopPropagation(); state.editorTab = btn.dataset.tab; this.render('editor'); };
        });
        this.els.editorBody.querySelectorAll('[data-mode]').forEach(btn => {
          btn.onclick = e => { e.stopPropagation(); this.setMode(btn.dataset.mode, btn.dataset.val); };
        });
      }
    },
  
    // ─── Actions ─────────────────────────────────────────────────────────────────
  
    selectNode(id, showEditor = false) {
      state.selectedId = id;
      if (showEditor) state.editorHidden = false;

      const node = this.getNode(id);
      if (node?.parentId) {
        if (state.editorTab === 'positioning') state.editorTab = 'surface';
      } else {
        if (state.editorTab === 'surface') state.editorTab = 'positioning';
      }

      this.render('sidebar');
      this.render('editor');
      this.syncStatus();

    },
  
    setMode(scope, value) {
      const ctx = this.getSelection();
      if (scope === 'object' && ctx.object) ctx.object.objectPrintMode = value;
      if (scope === 'region' && ctx.region) ctx.region.regionPrintMode = value;
      state.dirty = true;
      this.render('editor');
      this.render('sidebar');
      this.syncStatus();
      compute?.onModeChange?.(scope, value);
    },
  
    loadStl(stlObj) {
      this.hydrateNode(stlObj, false);
      state.nodes.set(stlObj.id, stlObj);
      if (state.objects instanceof Map) state.objects.set(stlObj.id, stlObj);
      else if (Array.isArray(state.objects) && !state.objects.find(o => o.id === stlObj.id)) state.objects.push(stlObj);
      if (Array.isArray(stlObj.children) && stlObj.children.length) {
        stlObj.children.forEach(surface => {
          if (!surface?.id) return;
          surface.parentId = stlObj.id;
          this.hydrateNode(surface, true);
          state.nodes.set(surface.id, surface);
          if (!stlObj.childIds.includes(surface.id)) stlObj.childIds.push(surface.id);
        });
      }
      if (!state.selectedId) state.selectedId = stlObj.id;
    },
  
    addSurface(surface, parentId) {
      this.hydrateNode(surface, true);
      surface.parentId = parentId;
      state.nodes.set(surface.id, surface);
      const parent = this.getNode(parentId);
      if (parent) {
        parent.childIds = parent.childIds || [];
        if (!parent.childIds.includes(surface.id)) parent.childIds.push(surface.id);
        if (Array.isArray(parent.children) && !parent.children.find(c => c?.id === surface.id)) parent.children.push(surface);
      }
      this.render();
    },
  
    removeNode(id) {
      const n = this.getNode(id);
      if (!n) return;
      if (n.parentId) {
        const parent = this.getNode(n.parentId);
        if (parent) {
          parent.childIds = (parent.childIds || []).filter(c => c !== id);
          if (Array.isArray(parent.children)) parent.children = parent.children.filter(c => c?.id !== id);
        }
      } else {
        (n.childIds || []).forEach(cid => state.nodes.delete(cid));
        if (Array.isArray(n.children)) n.children.forEach(child => state.nodes.delete(child.id));
        if (state.objects instanceof Map) state.objects.delete(id);
        else if (Array.isArray(state.objects)) state.objects = state.objects.filter(o => o.id !== id);
      }
      state.nodes.delete(id);
      if (state.selectedId === id) state.selectedId = this.getObjects()[0]?.id || null;
      this.render();
    },
  
    appendLog(msg) {
      state.logEntries.unshift({ time: new Date().toLocaleTimeString(), message: msg });
      this.render('log');
    },
  
    zoom(factor) {
      state.buildPlate.scaleFactor = factor === null ? 1 : (state.buildPlate.scaleFactor || 1) * factor;
      compute?.rotateView?.(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
    },
  
    // ─── Viewport ────────────────────────────────────────────────────────────────
  
    drawViewport() {
      const canvas = this.els.canvas || (this.els.canvas = this.el('viewport'));
      if (!canvas) return;
      const ctx2d = canvas.getContext('2d');
      const dpr   = window.devicePixelRatio || 1;
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx2d.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
  
      const { object: selObj } = this.getSelection();
      const W   = canvas.clientWidth, H = canvas.clientHeight;
      const bpL = state.machine.buildPlateLength, bpW = state.machine.buildPlateWidth;
      const scale = Math.min(W * .75 / bpL, H * .75 / bpW) * (state.buildPlate.scaleFactor || 1);
      const az  = state.buildPlate.zAngle * Math.PI / 180;
      const cos = Math.cos(az), sin = Math.sin(az);
      const proj = v => ({
        x: (v.x - bpL/2) * cos - (v.y - bpW/2) * sin,
        y: (v.x - bpL/2) * sin + (v.y - bpW/2) * cos,
      });
  
      ctx2d.save();
      ctx2d.translate(W/2, H/2);
      ctx2d.scale(scale, -scale);
  
      const corners = [{x:0,y:0},{x:bpL,y:0},{x:bpL,y:bpW},{x:0,y:bpW}].map(proj);
      ctx2d.beginPath();
      corners.forEach((c, i) => i ? ctx2d.lineTo(c.x, c.y) : ctx2d.moveTo(c.x, c.y));
      ctx2d.closePath();
      ctx2d.strokeStyle = '#4e5954'; ctx2d.lineWidth = 1/scale; ctx2d.stroke();
  
      this.getObjects().filter(o => o.visible !== false).forEach(obj => {
        ctx2d.strokeStyle = selObj?.id === obj.id ? '#d7ddd9' : '#7f9789';
        ctx2d.lineWidth   = (selObj?.id === obj.id ? 1.8 : 1) / scale;
        (obj.triangles || []).forEach(tri => {
          if (!tri?.vertices?.length) return;
          const [p0, p1, p2] = tri.vertices.map(proj);
          ctx2d.beginPath();
          ctx2d.moveTo(p0.x, p0.y); ctx2d.lineTo(p1.x, p1.y); ctx2d.lineTo(p2.x, p2.y);
          ctx2d.closePath(); ctx2d.stroke();
        });
      });
      ctx2d.restore();
      ctx2d.fillStyle = '#d7ddd9'; ctx2d.font = '12px monospace';
      ctx2d.fillText(`${(state.buildPlate.scaleFactor||1).toFixed(2)}x · ${this.getObjects().length} obj`, 20, 28);
    },
  
    // ─── Context Menu & Menus ────────────────────────────────────────────────────
  
    openContextMenu(x, y, items) {
      const menu = this.el('contextMenu');
      if (!menu) return;
      menu.innerHTML = items.map(([label]) => `<div class="context-item">${this.esc(label)}</div>`).join('');
      menu.querySelectorAll('.context-item').forEach((el, i) => {
        el.onclick = () => { menu.classList.remove('open'); items[i][1](); };
      });
      menu.style.left = `${x}px`;
      menu.style.top  = `${y}px`;
      menu.classList.add('open');
    },
  
    openMenu(name, btn) {
      this.closeMenus();
      const menuEl = this.el(name === 'file' ? 'fileMenu' : 'layoutMenu');
      if (!menuEl || !btn) return;
      menuEl.style.left = `${btn.getBoundingClientRect().left}px`;
      menuEl.classList.add('open');
    },
  
    closeMenus() {
      document.querySelectorAll('.dropdown').forEach(el => el.classList.remove('open'));
      this.el('contextMenu')?.classList.remove('open');
    },
  
    // ─── Editor Dragging ─────────────────────────────────────────────────────────
  
    setupEditorDragging() {
      const editor = this.el('objectEditor');
      const handle = this.el('editorTargetTitle');
      if (!editor || !handle) return;
      let dragging = false, sx = 0, sy = 0, sl = 0, st = 0;
      handle.style.cursor = 'move';
      handle.addEventListener('mousedown', e => {
        if (e.target.closest('button,input,select')) return;
        dragging = true;
        const r = editor.getBoundingClientRect();
        sx = e.clientX; sy = e.clientY; sl = r.left; st = r.top;
        document.body.style.userSelect = 'none';
        e.preventDefault();
      });
      window.addEventListener('mousemove', e => {
        if (!dragging) return;
        editor.style.left   = `${Math.max(0, Math.min(window.innerWidth  - editor.offsetWidth,  sl + e.clientX - sx))}px`;
        editor.style.top    = `${Math.max(0, Math.min(window.innerHeight - editor.offsetHeight, st + e.clientY - sy))}px`;
        editor.style.right  = 'auto';
        editor.style.bottom = 'auto';
      });
      window.addEventListener('mouseup', () => { dragging = false; document.body.style.userSelect = ''; });
    },
  
    // ─── Global Input Delegation ─────────────────────────────────────────────────
  
    initInputDelegation() {
      document.addEventListener('input', e => {
        const def = this.FIELDS[e.target.id];
        if (!def) return;
        const { target } = this.getSelection();
        if (!target) return;
        target[e.target.id] = def.type === 'number'   ? Number(e.target.value)
                             : def.type === 'checkbox' ? e.target.checked
                             : e.target.value;
        state.dirty = true;
        if(e.target.id == 'xAngle' || e.target.id == 'yAngle' || e.target.id == 'zAngle' || e.target.id == 'maxSlopeAngle'){
            compute.createStlSurfaces();
            slicerApp.render('sidebar');
        }
        if(e.target.id == 'zMin'){
            compute.updateZmin();
            compute.createStlSurfaces();
            
        }
        compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
      });
    },
  
    // ─── Init ────────────────────────────────────────────────────────────────────
  
    init() {
      this.initInputDelegation();
      state.massRows = state.massRows || { infill: false, perimeters: false };
  
      // tog() — attach a click listener with stopPropagation so the global
      // document click→closeMenus doesn't swallow these button events.
      // Works for both buttons and divs — always stops propagation so the
      // global click→closeMenus doesn't swallow the event before fn() runs.
      const tog = (id, fn) => {
        this.el(id)?.addEventListener('click', e => { e.stopPropagation(); fn(); });
      };
      // Dropdown items are plain divs — close menus after acting
      const menuItem = (id, fn) => {
        this.el(id)?.addEventListener('click', e => { e.stopPropagation(); fn(); this.closeMenus(); });
      };
  
      tog('sidebarGrip',       () => { state.sidebarCollapsed = !state.sidebarCollapsed; this.syncStatus(); });
      tog('sidebarRestoreBtn', () => { state.sidebarCollapsed = false;                   this.syncStatus(); });
      tog('editorHideBtn',     () => { state.editorHidden     = true;                    this.syncStatus(); });
      tog('settingsToggleBtn', () => { state.settingsOpen     = !state.settingsOpen;     this.syncStatus(); });
      tog('machineToggleBtn',  () => { state.machineOpen      = !state.machineOpen;      this.syncStatus(); });
      tog('devToggleBar',      () => { state.devCollapsed     = !state.devCollapsed;     this.syncStatus(); });
      tog('previewToggleBtn',  () => { state.previewCollapsed = !state.previewCollapsed; this.syncStatus(); });
      tog('zoomInBtn',         () => this.zoom(1.1));
      tog('zoomOutBtn',        () => this.zoom(1/1.1));
      tog('zoomResetBtn',      () => this.zoom(null));
      tog('clearDevBtn',       () => { state.logEntries = []; this.render('log'); });
      tog('importStlItem',     () => { this.el('hiddenImportStlInput')?.click(); this.closeMenus(); });
      menuItem('toggleEditorItem', () => { state.editorHidden = !state.editorHidden; this.syncStatus(); });
      menuItem('toggleDevItem',    () => { state.devCollapsed  = !state.devCollapsed;  this.syncStatus(); });
  
      document.querySelectorAll('[data-menu]').forEach(btn => {
        btn.addEventListener('click', e => { e.stopPropagation(); this.openMenu(btn.dataset.menu, btn); });
      });
  
      // Global click closes menus — stopPropagation in tog() keeps toggle buttons safe
      document.addEventListener('click', () => this.closeMenus());
  
      const canvas = this.el('viewport');
      canvas?.addEventListener('mousedown', e => { state.buildPlate.focused = true; compute?.canvasFocus?.(e); });
      canvas?.addEventListener('mousemove', e => { if (state.buildPlate.focused) compute?.canvasDragRotate?.(e); });
      document.body.addEventListener('mouseup', () => { state.buildPlate.focused = false; });
  
      this.renderAll();
      this.setupEditorDragging();
    }
  };
