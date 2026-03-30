const slicerApp = {
    defaults: {
      viewportReferenceFrame: 'build-plate',
      objectProfile: {
        description: 'PLA',
        basePrintProfile: 'PLA Print',
        activePrintProfile: 'PLA Print',
        printProfileModified: false,
        baseFilamentProfile: 'PLA Filament',
        activeFilamentProfile: 'PLA Filament',
        filamentProfileModified: false,
        visible: true,
        locked: false,
        expanded: true,
        objectPrintMode: 'planar',
        infillCurrent: 20,
        wallCount: 3,
        infillPattern: 'Gyroid',
        materialType: 'PLA',
        nozzleTemp: 210,
        bedTemp: 60,
        maxSlopeAngle: 45,
        nonPlanarZOffset: 0,
        surfaceExtrusionDepth: 1.2
      },

      regionProfile: {
        visible: true,
        locked: false,
        regionPrintMode: 'planar',
        printProfileOverride: null,
        printProfileModified: false,
        filamentProfileOverride: null,
        filamentProfileModified: false,
        infillCurrent: 20,
        wallCount: 3,
        infillPattern: 'Gyroid',
        materialType: 'PLA',
        nozzleTemp: 210,
        bedTemp: 60,
        surfaceExtrusionDepth: 1.2,
        nonPlanarZOffset: 0,
        maxSlopeAngle: 10
      },
      printPresets: {
        'PLA Print': { infillCurrent: 20, wallCount: 3, infillPattern: 'Gyroid' },
        'PLA Draft': { infillCurrent: 12, wallCount: 2, infillPattern: 'Lines' },
        'PLA Strong': { infillCurrent: 35, wallCount: 4, infillPattern: 'Grid' },
        'TPU Print': { infillCurrent: 18, wallCount: 3, infillPattern: 'Gyroid' }
      },
      filamentPresets: {
        'PLA Filament': { materialType: 'PLA', nozzleTemp: 210, bedTemp: 60 },
        'PLA+ Filament': { materialType: 'PLA', nozzleTemp: 220, bedTemp: 60 },
        'TPU Filament': { materialType: 'TPU', nozzleTemp: 225, bedTemp: 50 },
        'PETG Filament': { materialType: 'PETG', nozzleTemp: 240, bedTemp: 75 }
      }
    },
    els: {
      canvas: document.getElementById('viewport'),
      statusText: document.getElementById('statusText'),
      sidebarShell: document.getElementById('sidebarShell'),
      sidebarBody: document.getElementById('sidebarBody'),
      sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
      sidebarRestoreBtn: document.getElementById('sidebarRestoreBtn'),
      sidebarGrip: document.getElementById('sidebarGrip'),
      sidebarResizeShell: document.getElementById('sidebarResizeShell'),
      sidebarCornerResizer: document.getElementById('sidebarCornerResizer'),
      settingsDrawer: document.getElementById('settingsDrawer'),
      settingsBody: document.getElementById('settingsBody'),
      settingsToggleBtn: document.getElementById('settingsToggleBtn'),
      machineDrawer: document.getElementById('machineDrawer'),
      machineBody: document.getElementById('machineBody'),
      machineToggleBtn: document.getElementById('machineToggleBtn'),
      focusLabel: document.getElementById('focusLabel'),
      focusSelectedBtn: document.getElementById('focusSelectedBtn'),
      showWholeBtn: document.getElementById('showWholeBtn'),
      zoomInBtn: document.getElementById('zoomInBtn'),
      zoomOutBtn: document.getElementById('zoomOutBtn'),
      zoomResetBtn: document.getElementById('zoomResetBtn'),
      objectEditor: document.getElementById('objectEditor'),
      editorHead: document.getElementById('editorHead'),
      editorTargetTitle: document.getElementById('editorTargetTitle'),
      editorBody: document.getElementById('editorBody'),
      editorHideBtn: document.getElementById('editorHideBtn'),
      previewShell: document.getElementById('previewShell'),
      previewToggleBtn: document.getElementById('previewToggleBtn'),
      inspectorContentLabel: document.getElementById('inspectorContentLabel'),
      inspectorContentBody: document.getElementById('inspectorContentBody'),
      devShell: document.getElementById('devShell'),
      devResizer: document.getElementById('devResizer'),
      devTabs: document.getElementById('devTabs'),
      logPane: document.getElementById('logPane'),
      clearDevBtn: document.getElementById('clearDevBtn'),
      devToggleBar: document.getElementById('devToggleBar'),
      contextMenu: document.getElementById('contextMenu'),
      fileMenu: document.getElementById('fileMenu'),
      layoutMenu: document.getElementById('layoutMenu'),
      importStlItem: document.getElementById('importStlItem'),
      importProjectItem: document.getElementById('importProjectItem'),
      exportGcodeItem: document.getElementById('exportGcodeItem'),
      exportDebugItem: document.getElementById('exportDebugItem'),
      saveLayoutItem: document.getElementById('saveLayoutItem'),
      resetLayoutItem: document.getElementById('resetLayoutItem'),
      toggleEditorItem: document.getElementById('toggleEditorItem'),
      toggleDevItem: document.getElementById('toggleDevItem')
    },
  
    applyFlatDefaultsToObject(obj) {
      if (!obj) return obj;
      Object.keys(this.defaults.objectProfile).forEach((key) => {
        if (obj[key] === undefined) obj[key] = this.defaults.objectProfile[key];
      });
      if (!Array.isArray(obj.children)) obj.children = [];
      obj.children.forEach((region) => this.applyFlatDefaultsToRegion(region));
      return obj;
    },
  
    applyFlatDefaultsToRegion(region) {
      if (!region) return region;
      Object.keys(this.defaults.regionProfile).forEach((key) => {
        if (region[key] === undefined) region[key] = this.defaults.regionProfile[key];
      });
      return region;
    },
  
    getObjectBoundsCenter(obj) {
    if (!obj || !Array.isArray(obj.triangles) || !obj.triangles.length) return null;
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    obj.triangles.forEach((triangle) => {
      if (!triangle || !Array.isArray(triangle.vertices)) return;
      triangle.vertices.forEach((vertex) => {
        const vx = Number(vertex.x ?? 0);
        const vy = Number(vertex.y ?? 0);
        if (vx < minX) minX = vx;
        if (vx > maxX) maxX = vx;
        if (vy < minY) minY = vy;
        if (vy > maxY) maxY = vy;
      });
    });
    if (!Number.isFinite(minX) || !Number.isFinite(maxX) || !Number.isFinite(minY) || !Number.isFinite(maxY)) return null;
    return {
      x: (minX + maxX) * 0.5,
      y: (minY + maxY) * 0.5
    };
  },

  centerCameraOnSelectedObject() {
    if (!state.camera) state.camera = { ...slicerApp.defaults.camera };
    const selection = this.getSelectedObject();
    const obj = selection?.object || null;
    const center = this.getObjectBoundsCenter(obj);
    if (!center) return;
    state.camera.centerX = center.x;
    state.camera.centerY = center.y;
  },

  appendLog(message) {
      state.logEntries.unshift({ time: new Date().toLocaleTimeString(), message });
      this.renderLogPane();
    },
  
    updateGeneratedRegionsForObject(object, slopeAngle) {
      return;
    },
  
    renameRegion(region, parentObject) {
      const nextName = window.prompt('Rename region', region.name);
      if (!nextName || !nextName.trim() || nextName.trim() === region.name) return;
      region.name = nextName.trim();
      state.dirty = true;
      this.appendLog(`Renamed region to \"${region.name}\" under \"${parentObject.name}\".`);
      this.renderAll();
    },
  
    toggleLocked(node, kindLabel) {
      node.locked = !node.locked;
      state.dirty = true;
      this.appendLog(`${node.locked ? 'Locked' : 'Unlocked'} ${kindLabel} \"${node.name}\".`);
      this.renderSidebar();
      this.renderStatus();
    },
  
    getSelectedObject() {
      const objects = state.objects instanceof Map
        ? Array.from(state.objects.values())
        : Array.isArray(state.objects)
          ? state.objects
          : [];
  
      for (const obj of objects) {
        if (obj.id === state.selectedId) return { object: obj, region: null };
        for (const region of (obj.children || [])) {
          if (region.id === state.selectedId) return { object: obj, region };
        }
      }
  
      const fallback = objects[0] || null;
      return fallback ? { object: fallback, region: null } : { object: null, region: null };
    },
  
    selectNode(node, type, parentObject) {
      state.selectedId = node.id;
      state.focusMode = type === 'plate' ? 'plate' : 'selected';
      state.dirty = true;
      if (type === 'region') {
        this.appendLog(`Selected region \"${node.name}\" under \"${parentObject.name}\".`);
      } else {
        this.appendLog(`Selected object \"${node.name}\".`);
      }
      this.renderAll();
    },
  
    editNode(node, type, parentObject) {
      state.editorHidden = false;
      this.selectNode(node, type, parentObject);
    },
  
    getObjectProfileState(obj) {
      return {
        print: {
          base: obj.basePrintProfile || 'None',
          active: obj.activePrintProfile || obj.basePrintProfile || 'None',
          modified: !!obj.printProfileModified,
          inherited: false
        },
        filament: {
          base: obj.baseFilamentProfile || 'None',
          active: obj.activeFilamentProfile || obj.baseFilamentProfile || 'None',
          modified: !!obj.filamentProfileModified,
          inherited: false
        }
      };
    },
  
    getRegionProfileState(obj, region) {
      const objectProfiles = this.getObjectProfileState(obj);
      const printInherited = !region.printProfileOverride;
      const filamentInherited = !region.filamentProfileOverride;
  
      return {
        print: {
          base: objectProfiles.print.base,
          active: printInherited ? objectProfiles.print.active : region.printProfileOverride,
          modified: !!region.printProfileModified,
          inherited: printInherited
        },
        filament: {
          base: objectProfiles.filament.base,
          active: filamentInherited ? objectProfiles.filament.active : region.filamentProfileOverride,
          modified: !!region.filamentProfileModified,
          inherited: filamentInherited
        }
      };
    },
  
    escapeHtml(value) {
      return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
    },
  
    renderProfileLine(label, profile) {
      const chips = [];
      if (profile.modified) {
        chips.push('<span class="profile-chip warning">Modified</span>');
      }
      return `
        <div class="profile-line">
          <strong>${label}:</strong>
          <span>${this.escapeHtml(profile.active)}</span>
          ${chips.join('')}
        </div>
      `;
    },
  
    renderStatus() {
      const sel = this.getSelectedObject();
      this.els.statusText.textContent = state.dirty ? 'Modified' : 'Ready';
      this.els.focusLabel.textContent = `Reference frame: ${state.viewportReferenceFrame === 'selected-object' ? 'selected STL' : 'build plate center'}`;
      this.els.settingsDrawer.classList.toggle('open', state.settingsOpen);
      this.els.settingsToggleBtn.classList.toggle('active', state.settingsOpen);
      this.els.machineDrawer.classList.toggle('open', state.machineOpen);
      this.els.machineToggleBtn.classList.toggle('active', state.machineOpen);
      this.els.objectEditor.style.left = `${state.editorX}px`;
      this.els.objectEditor.style.top = `${state.editorY}px`;
      this.els.objectEditor.style.display = state.editorHidden ? 'none' : 'block';
      this.els.previewShell.classList.toggle('collapsed', state.previewCollapsed);
      this.els.focusSelectedBtn.classList.toggle('active', state.viewportReferenceFrame === 'selected-object');
      this.els.showWholeBtn.classList.toggle('active', state.viewportReferenceFrame !== 'selected-object');
    },
  
    applyDimensions() {
      document.documentElement.style.setProperty('--sidebar-w', `${state.sidebarWidth}px`);
      document.documentElement.style.setProperty('--dev-w', `${state.devWidth}px`);
      document.documentElement.style.setProperty('--dev-h', `${state.devHeight}px`);
      this.els.sidebarShell.classList.toggle('collapsed', state.sidebarCollapsed);
      this.els.devShell.classList.toggle('collapsed', state.devCollapsed);
    },
  
    renderSidebar() {
      this.els.sidebarBody.innerHTML = '';
  
      const applyGlobalInfill = () => {
        const nextValue = state.globalMassSettings.infill.trim();
        if (!nextValue) return;
        let changedCount = 0;
        state.objects.forEach(obj => {
          if (obj.locked) return;
          if (!obj._editorStore) obj._editorStore = {};
          if (!obj._editorStore.print) {
            obj._editorStore.print = {
              profileName: obj.activePrintProfile || obj.basePrintProfile || 'None',
              fields: { infill: '35', walls: '4', pattern: 'Gyroid' },
              savedFields: { infill: '35', walls: '4', pattern: 'Gyroid' }
            };
          }
          obj._editorStore.print.fields.infill = nextValue;
          obj.printProfileModified = true;
          changedCount += 1;
  
          obj.children.forEach(region => {
            if (region.locked) return;
            if (!region._editorStore) region._editorStore = {};
            if (!region._editorStore.print) {
              region._editorStore.print = {
                profileName: region.printProfileOverride || obj.activePrintProfile || obj.basePrintProfile || 'None',
                fields: { infill: '35', walls: '4', pattern: 'Gyroid' },
                savedFields: { infill: '35', walls: '4', pattern: 'Gyroid' }
              };
            }
            region._editorStore.print.fields.infill = nextValue;
            region.printProfileModified = true;
            changedCount += 1;
          });
        });
        state.dirty = true;
        this.appendLog(`Applied infill ${nextValue} to ${changedCount} unlocked object/region entries.`);
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
      };
  
      const applyGlobalWalls = () => {
        const nextValue = state.globalMassSettings.walls.trim();
        if (!nextValue) return;
        let changedCount = 0;
        state.objects.forEach(obj => {
          if (obj.locked) return;
          if (!obj._editorStore) obj._editorStore = {};
          if (!obj._editorStore.print) {
            obj._editorStore.print = {
              profileName: obj.activePrintProfile || obj.basePrintProfile || 'None',
              fields: { infill: '35', walls: '4', pattern: 'Gyroid' },
              savedFields: { infill: '35', walls: '4', pattern: 'Gyroid' }
            };
          }
          obj._editorStore.print.fields.walls = nextValue;
          obj.printProfileModified = true;
          changedCount += 1;
  
          obj.children.forEach(region => {
            if (region.locked) return;
            if (!region._editorStore) region._editorStore = {};
            if (!region._editorStore.print) {
              region._editorStore.print = {
                profileName: region.printProfileOverride || obj.activePrintProfile || obj.basePrintProfile || 'None',
                fields: { infill: '35', walls: '4', pattern: 'Gyroid' },
                savedFields: { infill: '35', walls: '4', pattern: 'Gyroid' }
              };
            }
            region._editorStore.print.fields.walls = nextValue;
            region.printProfileModified = true;
            changedCount += 1;
          });
        });
        state.dirty = true;
        this.appendLog(`Applied wall count ${nextValue} to ${changedCount} unlocked object/region entries.`);
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
      };
  
      const massPanel = document.createElement('div');
      massPanel.className = 'mui-panel';
      massPanel.innerHTML = `
        <div class="floating-label">Global</div>
        <div class="mui-panel-body">
          <div class="mass-list">
            <div class="mass-row">
              <div class="mass-row-head">
                <button class="mass-btn" id="mass-infill-toggle-btn">Set Infill All</button>
                <button class="mass-apply-btn" id="mass-infill-apply-btn">Apply</button>
              </div>
              <div class="mass-input-wrap">
                <div class="mui-field"><label>Infill %</label><input id="mass-infill-input" value="${this.escapeHtml(state.globalMassSettings.infill)}" /></div>
              </div>
            </div>
            <div class="mass-row">
              <div class="mass-row-head">
                <button class="mass-btn" id="mass-walls-toggle-btn">Set Max Walls</button>
                <button class="mass-apply-btn" id="mass-walls-apply-btn">Apply</button>
              </div>
              <div class="mass-input-wrap">
                <div class="mui-field"><label>Wall Count</label><input id="mass-walls-input" value="${this.escapeHtml(state.globalMassSettings.walls)}" /></div>
              </div>
            </div>
          </div>
        </div>`;
      this.els.sidebarBody.appendChild(massPanel);
  
      const massInfillToggleBtn = massPanel.querySelector('#mass-infill-toggle-btn');
      const massWallsToggleBtn = massPanel.querySelector('#mass-walls-toggle-btn');
      const massInfillApplyBtn = massPanel.querySelector('#mass-infill-apply-btn');
      const massWallsApplyBtn = massPanel.querySelector('#mass-walls-apply-btn');
      const massInfillInput = massPanel.querySelector('#mass-infill-input');
      const massWallsInput = massPanel.querySelector('#mass-walls-input');
  
      massInfillToggleBtn.addEventListener('click', () => massInfillToggleBtn.closest('.mass-row').classList.toggle('open'));
      massWallsToggleBtn.addEventListener('click', () => massWallsToggleBtn.closest('.mass-row').classList.toggle('open'));
      massInfillApplyBtn.addEventListener('click', applyGlobalInfill);
      massWallsApplyBtn.addEventListener('click', applyGlobalWalls);
      massInfillInput.addEventListener('input', () => { state.globalMassSettings.infill = massInfillInput.value; });
      massWallsInput.addEventListener('input', () => { state.globalMassSettings.walls = massWallsInput.value; });
  
      const panel = document.createElement('div');
      panel.className = 'mui-panel';
      panel.innerHTML = `<div class="floating-label">Objects & Regions</div><div class="mui-panel-body"><div class="tree-list" id="treeList"></div></div>`;
      const treeList = panel.querySelector('#treeList');
  
      state.objects.forEach((obj) => {
        const objectProfiles = this.getObjectProfileState(obj);
        const objectNeedsSave = objectProfiles.print.modified || objectProfiles.filament.modified;
        const item = document.createElement('div');
        item.className = 'tree-item' + (obj.expanded ? ' open' : '');
        item.innerHTML = `
          <div class="tree-main profile-card ${state.selectedId === obj.id ? 'active' : ''}">
            <div style="width:100%; display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <span class="tree-name">${this.escapeHtml(obj.name)}</span>
              <span class="tree-meta">${this.escapeHtml(obj.meta)}${obj.visible ? '' : ' · hidden'}${obj.locked ? ' · locked' : ''}${objectNeedsSave ? ' · unsaved profile changes' : ''}</span>
            </div>
            <div class="tree-meta" style="width:100%;">${this.escapeHtml(obj.description || '')}</div>
            <div class="profile-lines">
              ${this.renderProfileLine('Print', objectProfiles.print)}
              ${this.renderProfileLine('Filament', objectProfiles.filament)}
              <div class="profile-line"><strong>Printer:</strong><span>${this.escapeHtml(obj.printerProfile || 'None')}</span>${obj.locked ? '<span class="profile-chip locked">Locked</span>' : ''}</div>
            </div>
          </div>
          <div class="regions-list"></div>
        `;
        const main = item.querySelector('.tree-main');
        const regionsList = item.querySelector('.regions-list');
        main.addEventListener('click', () => {
          obj.expanded = !obj.expanded;
          this.selectNode(obj, 'object', obj);
            compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);

          this.renderSidebar();
        });
        main.addEventListener('contextmenu', (e) => {
          e.preventDefault();
          this.openContextMenu(e.clientX, e.clientY, [
            ['Edit Object', () => this.editNode(obj, 'object', obj)],
            [obj.locked ? 'Unlock Object' : 'Lock Object', () => this.toggleLocked(obj, 'object')],
            [obj.visible ? 'Hide Object' : 'Unhide Object', () => { obj.visible = !obj.visible; this.drawViewport(); this.renderSidebar();            compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
            }]
          ]);

        });
        obj.children.forEach((child) => {
          const childProfiles = this.getRegionProfileState(obj, child);
          const regionNeedsSave = childProfiles.print.modified || childProfiles.filament.modified;
          const childRow = document.createElement('div');
          childRow.className = 'region-row profile-card' + (state.selectedId === child.id ? ' active' : '');
          childRow.innerHTML = `
            <div style="width:100%; display:flex; align-items:center; justify-content:space-between; gap:8px;">
              <span class="tree-name">${this.escapeHtml(child.name)}</span>
              <span class="tree-meta">${this.escapeHtml(child.meta)}${child.visible ? '' : ' · hidden'}${child.locked ? ' · locked' : ''}${regionNeedsSave ? ' · unsaved profile changes' : ''}</span>
            </div>
            <div class="tree-meta" style="width:100%;">${this.escapeHtml(child.description || '')}</div>
            <div class="profile-lines">
              ${this.renderProfileLine('Print', childProfiles.print)}
              ${this.renderProfileLine('Filament', childProfiles.filament)}
              ${child.locked ? '<div class="profile-line"><span class="profile-chip locked">Locked</span></div>' : ''}
            </div>
          `;
          childRow.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectNode(child, 'region', obj);
          });
          childRow.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.openContextMenu(e.clientX, e.clientY, [
              ['Edit Region', () => this.editNode(child, 'region', obj)],
              ['Rename Region', () => this.renameRegion(child, obj)],
              [child.locked ? 'Unlock Region' : 'Lock Region', () => this.toggleLocked(child, 'region')],
              [child.visible ? 'Hide Region' : 'Unhide Region', () => { child.visible = !child.visible; this.drawViewport(); this.renderSidebar(); }]
            ]);
          });
          regionsList.appendChild(childRow);
        });
        treeList.appendChild(item);
      });
  
      this.els.sidebarBody.appendChild(panel);
    },
  
    renderSettingsDrawer() {
      this.els.settingsDrawer.querySelectorAll('[data-settings-tab]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.settingsTab === state.settingsTab);
      });
      const templates = {
        general: `
          <div class="drawer-section">
            <div class="drawer-section-title">General</div>
            <div class="form-grid">
              <div class="mui-field"><label>Selection mode</label><select><option>Single</option><option>Region</option></select></div>
            </div>
          </div>`,
        viewport: `
          <div class="drawer-section">
            <div class="drawer-section-title">Viewport</div>
            <div class="form-grid">
              <div class="mui-field"><label>Focus scope</label><select><option>Selected region</option><option>Whole plate</option></select></div>
            </div>
          </div>`
      };
      this.els.settingsBody.innerHTML = templates[state.settingsTab] || '';
    },
  
    renderMachineDrawer() {
      this.els.machineDrawer.querySelectorAll('[data-machine-tab]').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.machineTab === state.machineTab);
      });
      const templates = {
        general: `
          <div class="drawer-section">
            <div class="drawer-section-title">General</div>
            <div class="form-grid">
              <div class="mui-field"><label>Machine Profile</label><input value="Custom NP Rig" /></div>
              <div class="mui-field"><label>Build Plate Length</label><input id="buildPlateLengthId" onchange="state.buildPlate.updateBuildPlateDimensions()" type="number" value="300" step="10" /></div>
              <div class="mui-field"><label>Build Plate Width</label><input id="buildPlateWidthId" onchange="state.buildPlate.updateBuildPlateDimensions()" type="number" value="300" step="10" /></div>
              <div class="mui-field"><label>Build Plate Height</label><input id="buildPlateHeightId" onchange="state.buildPlate.updateBuildPlateDimensions()" type="number" value="300" step="10" /></div>
              <div class="mui-field"><label>Origin Center</label><div class="checkbox"><input id="originCenterButtonId" class="checkbox" onchange="state.buildPlate.updateBuildPlateOriginCenter()" type="checkbox"/></div></div>
            </div>
          </div>`,
        'custom-gcode': `
          <div class="drawer-section">
            <div class="drawer-section-title">Custom G-code</div>
            <div class="form-grid">
              <div class="mui-field"><label>Start G-code</label><input value="G28 ; home" /></div>
              <div class="mui-field"><label>End G-code</label><input value="M104 S0 ; cool down" /></div>
              <div class="mui-field"><label>Layer Change G-code</label><input value="; layer change hook" /></div>
            </div>
          </div>`,
        'machine-limits': `
          <div class="drawer-section">
            <div class="drawer-section-title">Machine Limits</div>
            <div class="form-grid">
              <div class="mui-field"><label>Max Feedrate X/Y</label><input type="number" value="300" step="1" /></div>
              <div class="mui-field"><label>Max Feedrate Z</label><input type="number" value="20" step="0.1" /></div>
              <div class="mui-field"><label>Max Acceleration</label><input type="number" value="5000" step="100" /></div>
              <div class="mui-field"><label>Max Jerk</label><input type="number" value="10" step="0.1" /></div>
            </div>
          </div>`,
        'extruder-1': `
          <div class="drawer-section">
            <div class="drawer-section-title">Extruder 1</div>
            <div class="form-grid">
              <div class="mui-field"><label>Nozzle Diameter</label><input type="number" value="0.4" step="0.05" /></div>
              <div class="mui-field"><label>Filament Diameter</label><input type="number" value="1.75" step="0.01" /></div>
              <div class="mui-field"><label>Retraction Length</label><input type="number" value="0.8" step="0.1" /></div>
              <div class="mui-field"><label>Retraction Speed</label><input type="number" value="35" step="1" /></div>
            </div>
          </div>`
      };
      this.els.machineBody.innerHTML = templates[state.machineTab] || '';
    },
  
    renderEditor() {
  
      const previousActive = document.activeElement;
      const previousFocusId = previousActive && previousActive.id ? previousActive.id : null;
      const previousSelectionStart = previousActive && typeof previousActive.selectionStart === 'number' ? previousActive.selectionStart : null;
      const previousSelectionEnd = previousActive && typeof previousActive.selectionEnd === 'number' ? previousActive.selectionEnd : null;
      const { object, region } = this.getSelectedObject();
      const selectedType = region ? 'region' : 'object';
      const target = region || object;
      if(!target){
          return;
      }
  
      function ensureEditorStore(node) {
        if (!node._editorStore) node._editorStore = {};
        if (!node._editorStore.print) {
          const profileName = region ? (region.printProfileOverride || object.activePrintProfile || object.basePrintProfile || 'None') : (object.activePrintProfile || object.basePrintProfile || 'None');
          node._editorStore.print = {
            profileName,
            fields: { infill: '', walls: '', pattern: '' },
            savedFields: { infill: '', walls: '', pattern: '' }
          };
        }
        node._editorStore.print.profileName = region ? (region.printProfileOverride || object.activePrintProfile || object.basePrintProfile || 'None') : (object.activePrintProfile || object.basePrintProfile || 'None');
        node._editorStore.print.fields.infill = String(node.infillCurrent ?? slicerApp.defaults.objectProfile.infillCurrent);
        node._editorStore.print.fields.walls = String(node.wallCount ?? slicerApp.defaults.objectProfile.wallCount);
        node._editorStore.print.fields.pattern = String(node.infillPattern ?? slicerApp.defaults.objectProfile.infillPattern);
        if (!node._editorStore.print.savedFields.infill) node._editorStore.print.savedFields = { ...node._editorStore.print.fields };
        if (!node._editorStore.filament) {
          const profileName = region ? (region.filamentProfileOverride || object.activeFilamentProfile || object.baseFilamentProfile || 'None') : (object.activeFilamentProfile || object.baseFilamentProfile || 'None');
          node._editorStore.filament = {
            profileName,
            fields: { material: '', nozzleTemp: '', bedTemp: '' },
            savedFields: { material: '', nozzleTemp: '', bedTemp: '' }
          };
        }
        node._editorStore.filament.profileName = region ? (region.filamentProfileOverride || object.activeFilamentProfile || object.baseFilamentProfile || 'None') : (object.activeFilamentProfile || object.baseFilamentProfile || 'None');
        node._editorStore.filament.fields.material = String(node.materialType ?? slicerApp.defaults.objectProfile.materialType);
        node._editorStore.filament.fields.nozzleTemp = String(node.nozzleTemp ?? slicerApp.defaults.objectProfile.nozzleTemp);
        node._editorStore.filament.fields.bedTemp = String(node.bedTemp ?? slicerApp.defaults.objectProfile.bedTemp);
        if (!node._editorStore.filament.savedFields.material) node._editorStore.filament.savedFields = { ...node._editorStore.filament.fields };
        if (!node._editorStore.surface) {
          node._editorStore.surface = {
            fields: { maxSlopeAngle: '', zTranslation: '', extrusionDepth: '' },
            savedFields: { maxSlopeAngle: '', zTranslation: '', extrusionDepth: '' }
          };
        }
        node._editorStore.surface.fields.maxSlopeAngle = String(node.maxSlopeAngle ?? slicerApp.defaults.objectProfile.maxSlopeAngle);
        node._editorStore.surface.fields.zTranslation = String(node.nonPlanarZOffset ?? slicerApp.defaults.objectProfile.nonPlanarZOffset);
        node._editorStore.surface.fields.extrusionDepth = String(node.surfaceExtrusionDepth ?? slicerApp.defaults.objectProfile.surfaceExtrusionDepth);
        if (!node._editorStore.surface.savedFields.maxSlopeAngle) node._editorStore.surface.savedFields = { ...node._editorStore.surface.fields };
      }
  
      function syncProfileFlags() {
        const printDirty = JSON.stringify(target._editorStore.print.fields) !== JSON.stringify(target._editorStore.print.savedFields);
        const filamentDirty = JSON.stringify(target._editorStore.filament.fields) !== JSON.stringify(target._editorStore.filament.savedFields);
  
        target.infillCurrent = Number(target._editorStore.print.fields.infill || 0);
        target.wallCount = Number(target._editorStore.print.fields.walls || 0);
        target.infillPattern = target._editorStore.print.fields.pattern;
  
        target.materialType = target._editorStore.filament.fields.material;
        target.nozzleTemp = Number(target._editorStore.filament.fields.nozzleTemp || 0);
        target.bedTemp = Number(target._editorStore.filament.fields.bedTemp || 0);
  
        target.maxSlopeAngle = Number(target._editorStore.surface.fields.maxSlopeAngle || 0);
        target.nonPlanarZOffset = Number(target._editorStore.surface.fields.zTranslation || 0);
        target.surfaceExtrusionDepth = Number(target._editorStore.surface.fields.extrusionDepth || 0);
  
        if (region) {
          region.printProfileModified = printDirty;
          region.filamentProfileModified = filamentDirty;
          region.printProfileOverride = target._editorStore.print.profileName === (object.activePrintProfile || object.basePrintProfile || 'None') ? null : target._editorStore.print.profileName;
          region.filamentProfileOverride = target._editorStore.filament.profileName === (object.activeFilamentProfile || object.baseFilamentProfile || 'None') ? null : target._editorStore.filament.profileName;
        } else {
          object.activePrintProfile = target._editorStore.print.profileName;
          object.activeFilamentProfile = target._editorStore.filament.profileName;
          object.printProfileModified = printDirty;
          object.filamentProfileModified = filamentDirty;
        }
      }
  
      function saveCurrentTabProfile() {
        if (state.editorTab === 'print') target._editorStore.print.savedFields = { ...target._editorStore.print.fields };
        if (state.editorTab === 'filament') target._editorStore.filament.savedFields = { ...target._editorStore.filament.fields };
        if (state.editorTab === 'surface') {
          target._editorStore.surface.savedFields = { ...target._editorStore.surface.fields };
          if (region) target.surfaceExtrusionDepth = Number(target._editorStore.surface.fields.extrusionDepth || 0);
        }
        syncProfileFlags();
        state.dirty = true;
        this.appendLog(`Saved ${state.editorTab} changes for "${region ? `${object.name} / ${region.name}` : object.name}".`);
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
      }
  
      function loadProfile(kind) {
        const currentName = target._editorStore[kind].profileName;
        const nextName = window.prompt(`Load ${kind} profile`, currentName);
        if (!nextName || !nextName.trim()) return;
        const trimmedName = nextName.trim();
        target._editorStore[kind].profileName = trimmedName;
        if (kind === 'print') {
          const preset = slicerApp.defaults.printPresets[trimmedName] || slicerApp.defaults.printPresets['PLA Print'];
          target._editorStore.print.fields = {
            infill: String(preset.infillCurrent),
            walls: String(preset.wallCount),
            pattern: String(preset.infillPattern)
          };
          target.infillCurrent = preset.infillCurrent;
          target.wallCount = preset.wallCount;
          target.infillPattern = preset.infillPattern;
        } else {
          const preset = slicerApp.defaults.filamentPresets[trimmedName] || slicerApp.defaults.filamentPresets['PLA Filament'];
          target._editorStore.filament.fields = {
            material: String(preset.materialType),
            nozzleTemp: String(preset.nozzleTemp),
            bedTemp: String(preset.bedTemp)
          };
          target.materialType = preset.materialType;
          target.nozzleTemp = preset.nozzleTemp;
          target.bedTemp = preset.bedTemp;
        }
        syncProfileFlags();
        state.dirty = true;
        this.appendLog(`Loaded ${kind} profile "${nextName.trim()}" for "${region ? `${object.name} / ${region.name}` : object.name}".`);
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
      }
  
      ensureEditorStore(target);
      syncProfileFlags();
  
      const objectMode = object.objectPrintMode || 'non-planar';
      const regionMode = region ? (region.regionPrintMode || 'planar') : null;
      const nonPlanarEnabled = objectMode === 'non-planar';
      const printDirty = JSON.stringify(target._editorStore.print.fields) !== JSON.stringify(target._editorStore.print.savedFields);
      const filamentDirty = JSON.stringify(target._editorStore.filament.fields) !== JSON.stringify(target._editorStore.filament.savedFields);
      const surfaceDirty = JSON.stringify(target._editorStore.surface.fields) !== JSON.stringify(target._editorStore.surface.savedFields);
      const rotateDisabled = selectedType === 'region';
  
      const tabsMarkup = region
        ? `
            <button class="tab-btn ${state.editorTab === 'surface' ? 'active' : ''}" data-editor-tab="surface">Surface</button>
            <button class="tab-btn ${state.editorTab === 'print' ? 'active' : ''}" data-editor-tab="print">Print</button>
            <button class="tab-btn ${state.editorTab === 'filament' ? 'active' : ''}" data-editor-tab="filament">Filament</button>
          `
        : `
            <button class="tab-btn ${state.editorTab === 'positioning' ? 'active' : ''}" data-editor-tab="positioning">Positioning</button>
            <button class="tab-btn ${state.editorTab === 'print' ? 'active' : ''}" data-editor-tab="print">Print</button>
            <button class="tab-btn ${state.editorTab === 'filament' ? 'active' : ''}" data-editor-tab="filament">Filament</button>
          `;
      document.getElementById('editorTabs').innerHTML = tabsMarkup;
  
      if (region && state.editorTab === 'positioning') state.editorTab = 'surface';
      if (!region && state.editorTab === 'surface') state.editorTab = 'positioning';
  
      this.els.editorTargetTitle.textContent = region ? `${object.name} / ${region.name}` : object.name;
  
      const templates = {
        positioning: `
          <div class="form-grid">
            <div class="drawer-section" style="margin-bottom:10px;">
              <div class="drawer-section-title">Object slicing mode</div>
              <div class="pipebar" style="height:40px; border:1px solid var(--line);">
                <button class="tab-btn ${objectMode === 'planar' ? 'active' : ''}" id="object-mode-planar-btn" type="button">Planar</button>
                <button class="tab-btn ${objectMode === 'non-planar' ? 'active' : ''}" id="object-mode-nonplanar-btn" type="button">Non-Planar</button>
              </div>
            </div>
            <div class="drawer-section-title">Planar Scaffold Parameters</div>
            <div class="mui-field"><label>X Rotation</label><input id="xRotationInputId" onchange="compute.rotateStlFromInput(event)" type="number" step="3" value="${object.xAngle ?? 0}" ${rotateDisabled ? 'disabled' : ''} /></div>
            <div class="mui-field"><label>Y Rotation</label><input id="yRotationInputId" onchange="compute.rotateStlFromInput(event)" type="number" step="3" value="${object.yAngle ?? 0}" ${rotateDisabled ? 'disabled' : ''} /></div>
            <div class="mui-field"><label>Z Rotation</label><input id="zRotationInputId" onchange="compute.rotateStlFromInput(event)" type="number" step="3" value="${object.zAngle ?? 0}" ${rotateDisabled ? 'disabled' : ''} /></div>
            <div class="mui-field"><label>X Translation</label><input id="xTranslationInputId" onchange="compute.translateStlFromInput()" type="number" step="3" value="${object.xShift ?? 0}" /></div>
            <div class="mui-field"><label>Y Translation</label><input id="yTranslationInputId" onchange="compute.translateStlFromInput()" type="number" step="3" value="${object.yShift ?? 0}" /></div>
            <div class="mui-field"><label>Z Translation</label><input id="zTranslationInputId" onchange="compute.translateStlFromInput()" type="number" step="3" value="${object.zShift ?? 0}" /></div>
            <div class="mui-field"><label>Auto Drop to Bed</label><div class="Zmin"><input id="zMinInputId" onchange="compute.updateZMin()" type="checkbox" value="${object.zMin !== undefined ? String(object.zMin) : 'true'}"/></div></div>
            <div style="opacity:${nonPlanarEnabled ? '1' : '.45'}; pointer-events:${nonPlanarEnabled ? 'auto' : 'none'}; transition:opacity .18s ease;">
              <div class="drawer-section-title" style="margin-top:14px;">Non-Planar Surface Parameters</div>
              <div class="mui-field"><label>Z Contact Offset</label><input id="zTranslationInputNonPlanarId" onchange="compute.translateStlFromInput()" type="number" step="0.1" value="${target._editorStore.surface.fields.zTranslation}" /></div>
              <div class="mui-field"><label>Max Slope Angle</label><input id="maxSlopeAngleId" onchange="compute.updateMaxSlopeAngle(event)" type="number" step="1" min="0" max="90" value="${target._editorStore.surface.fields.maxSlopeAngle}" /></div>
              <div class="tree-meta" style="margin-top:6px;">Max slope angle affects detection settings only. It no longer auto-generates child regions.</div>
            </div>
          </div>
        `,
        surface: `
          <div class="form-grid">
            <div class="drawer-section" style="margin-bottom:10px;">
              <div class="drawer-section-title">Region Surface Mode</div>
              <div class="pipebar" style="height:40px; border:1px solid var(--line);">
                <button class="tab-btn ${regionMode === 'planar' ? 'active' : ''}" id="region-mode-planar-btn" type="button">Planar</button>
                <button class="tab-btn ${regionMode === 'non-planar' ? 'active' : ''}" id="region-mode-nonplanar-btn" type="button">Non-Planar</button>
              </div>
            </div>
            <div style="opacity:${regionMode === 'non-planar' ? '1' : '.45'}; pointer-events:${regionMode === 'non-planar' ? 'auto' : 'none'}; transition:opacity .18s ease;">
              <div class="drawer-section-title">Non-Planar Parameters</div>
              <div class="mui-field"><label>Non-Planar Surface Thickness</label><input id="nonPlanarThickness" type="number" step="0.1" min="0" value="${target._editorStore.surface.fields.extrusionDepth}" /></div>
              <div class="tree-meta" style="margin-top:6px;">These region surface parameters are inactive while the region is locked to planar.</div>
            </div>
            <div class="tree-meta" style="margin-top:10px;">Child regions follow the parent STL scaffold and do not expose positioning controls.</div>
            <div style="display:grid; grid-template-columns: 1fr auto; gap:8px; align-items:end;">
              <div class="mui-field"><label>Surface Region</label><input value="${region ? region.name : ''}" disabled style="opacity:.7; cursor:not-allowed;" /></div>
              <button class="pipebtn" id="save-surface-region-btn" type="button" ${surfaceDirty ? '' : 'disabled'} style="height:40px; border:1px solid var(--line); ${surfaceDirty ? '' : 'opacity:.45; cursor:not-allowed;'}">Save</button>
            </div>
          </div>
        `,
        print: `
          <div class="form-grid">
            <div style="display:grid; grid-template-columns: 1fr auto auto; gap:8px; align-items:end;">
              <div class="mui-field"><label>Current Print Profile</label><input id="current-print-profile" value="${target._editorStore.print.profileName}" disabled style="opacity:.7; cursor:not-allowed;" /></div>
              <button class="pipebtn" id="load-print-profile-btn" type="button" title="Change print profile" style="height:40px; border:1px solid var(--line);">⚙</button>
              <button class="pipebtn" id="save-print-profile-btn" type="button" ${printDirty ? '' : 'disabled'} title="Save profile changes" style="height:40px; border:1px solid var(--line); ${printDirty ? '' : 'opacity:.45; cursor:not-allowed;'}">Save</button>
            </div>
            <div class="mui-field"><label>Infill density</label><input id="print-infill-input" value="${target._editorStore.print.fields.infill}" /></div>
            <div class="mui-field"><label>Walls</label><input id="print-walls-input" value="${target._editorStore.print.fields.walls}" /></div>
            <div class="mui-field"><label>Pattern</label><select id="print-pattern-input"><option ${target._editorStore.print.fields.pattern === 'Gyroid' ? 'selected' : ''}>Gyroid</option><option ${target._editorStore.print.fields.pattern === 'Lines' ? 'selected' : ''}>Lines</option><option ${target._editorStore.print.fields.pattern === 'Grid' ? 'selected' : ''}>Grid</option></select></div>
          </div>
        `,
        filament: `
          <div class="form-grid">
            <div style="display:grid; grid-template-columns: 1fr auto auto; gap:8px; align-items:end;">
              <div class="mui-field"><label>Current Filament Profile</label><input id="current-filament-profile" value="${target._editorStore.filament.profileName}" disabled style="opacity:.7; cursor:not-allowed;" /></div>
              <button class="pipebtn" id="load-filament-profile-btn" type="button" title="Change filament profile" style="height:40px; border:1px solid var(--line);">⚙</button>
              <button class="pipebtn" id="save-filament-profile-btn" type="button" ${filamentDirty ? '' : 'disabled'} title="Save profile changes" style="height:40px; border:1px solid var(--line); ${filamentDirty ? '' : 'opacity:.45; cursor:not-allowed;'}">Save</button>
            </div>
            <div class="mui-field"><label>Material Type</label><select id="filament-material-input"><option ${target._editorStore.filament.fields.material === 'TPU' ? 'selected' : ''}>TPU</option><option ${target._editorStore.filament.fields.material === 'PLA' ? 'selected' : ''}>PLA</option><option ${target._editorStore.filament.fields.material === 'PETG' ? 'selected' : ''}>PETG</option></select></div>
            <div class="mui-field"><label>Nozzle Temperature</label><input id="filament-nozzle-input" value="${target._editorStore.filament.fields.nozzleTemp}" /></div>
            <div class="mui-field"><label>Bed Temperature</label><input id="filament-bed-input" value="${target._editorStore.filament.fields.bedTemp}" /></div>
          </div>
        `
      };
  
      this.els.editorBody.innerHTML = templates[state.editorTab] || '';
  
      if (previousFocusId) {
        requestAnimationFrame(() => {
          const nextFocusEl = document.getElementById(previousFocusId);
          if (!nextFocusEl) return;
          nextFocusEl.focus();
          if (typeof nextFocusEl.setSelectionRange === 'function' && previousSelectionStart !== null && previousSelectionEnd !== null) {
            const valueLength = String(nextFocusEl.value || '').length;
            nextFocusEl.setSelectionRange(Math.max(0, Math.min(previousSelectionStart, valueLength)), Math.max(0, Math.min(previousSelectionEnd, valueLength)));
          }
        });
      }
  
      document.querySelectorAll('#editorTabs [data-editor-tab]').forEach(btn => {
        btn.addEventListener('click', () => {
          state.editorTab = btn.dataset.editorTab;
          this.renderEditor();
          let zMinInput = document.getElementById("zMinInputId");
        if(zMinInput){
          if(object.checked){
              zMinInput.checked = true;
          } else {
              zMinInput.checked = false;
          }
        }
        });
      });
  
      const objectPlanarBtn = document.getElementById('object-mode-planar-btn');
      const objectNonPlanarBtn = document.getElementById('object-mode-nonplanar-btn');
      if (objectPlanarBtn) objectPlanarBtn.addEventListener('click', () => {
        object.objectPrintMode = 'planar';
        state.dirty = true;
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
        let zMinInput = document.getElementById("zMinInputId");
        if(object.checked){
            zMinInput.checked = true;
        } else {
            zMinInput.checked = false;
        }
      });
      if (objectNonPlanarBtn) objectNonPlanarBtn.addEventListener('click', () => {
        object.objectPrintMode = 'non-planar';
        state.dirty = true;
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
        let zMinInput = document.getElementById("zMinInputId");
        if(object.checked){
            zMinInput.checked = true;
        } else {
            zMinInput.checked = false;
        }
      });
  
      const regionPlanarBtn = document.getElementById('region-mode-planar-btn');
      const regionNonPlanarBtn = document.getElementById('region-mode-nonplanar-btn');
      if (regionPlanarBtn) regionPlanarBtn.addEventListener('click', () => {
        region.regionPrintMode = 'planar';
        state.dirty = true;
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
      });
      if (regionNonPlanarBtn) regionNonPlanarBtn.addEventListener('click', () => {
        region.regionPrintMode = 'non-planar';
        state.dirty = true;
        this.renderSidebar();
        this.renderEditor();
        this.renderStatus();
      });
  
      if (state.editorTab === 'positioning') {
        const xRotInput = document.getElementById('xRotationInputId');
        const yRotInput = document.getElementById('yRotationInputId');
        const zRotInput = document.getElementById('zRotationInputId');
        const xShiftInput = document.getElementById('xTranslationInputId');
        const yShiftInput = document.getElementById('yTranslationInputId');
        const zShiftInput = document.getElementById('zTranslationInputId');
        const slopeInput = document.getElementById('maxSlopeAngleId');
        const nonPlanarZ = document.getElementById('zTranslationInputNonPlanarId');
        const zMinInput = document.getElementById('zMinInputId');
        
        const markPositionDirty = () => {
          object.xAngle = Number(xRotInput?.value || 0);
          object.yAngle = Number(yRotInput?.value || 0);
          object.zAngle = Number(zRotInput?.value || 0);
          object.xShift = Number(xShiftInput?.value || 0);
          object.yShift = Number(yShiftInput?.value || 0);
          object.zShift = Number(zShiftInput?.value || 0);
          target._editorStore.surface.fields.maxSlopeAngle = slopeInput?.value || target._editorStore.surface.fields.maxSlopeAngle;
          target._editorStore.surface.fields.zTranslation = nonPlanarZ?.value || target._editorStore.surface.fields.zTranslation;
          object.maxSlopeAngle = Number(target._editorStore.surface.fields.maxSlopeAngle || 0);
          object.nonPlanarZOffset = Number(target._editorStore.surface.fields.zTranslation || 0);
          state.dirty = true;
          this.renderSidebar();
          this.renderStatus();
        };
  
        [xRotInput, yRotInput, zRotInput, xShiftInput, yShiftInput, zShiftInput, slopeInput, nonPlanarZ].forEach((input) => {
          if (input) input.addEventListener('input', markPositionDirty);
        });
      }
  
      if (state.editorTab === 'surface') {
        const thicknessInput = document.getElementById('nonPlanarThickness');
        const saveSurfaceBtn = document.getElementById('save-surface-region-btn');
        const markSurfaceDirty = () => {
          const nextValue = thicknessInput.value;
          target._editorStore.surface.fields.extrusionDepth = nextValue;
          target.surfaceExtrusionDepth = Number(nextValue || 0);
          state.dirty = true;
          this.renderSidebar();
          this.renderEditor();
          this.renderStatus();
        };
        if (thicknessInput) thicknessInput.addEventListener('input', markSurfaceDirty);
        if (saveSurfaceBtn) saveSurfaceBtn.addEventListener('click', saveCurrentTabProfile);
      }
  
      if (state.editorTab === 'print') {
        const infillInput = document.getElementById('print-infill-input');
        const wallsInput = document.getElementById('print-walls-input');
        const patternInput = document.getElementById('print-pattern-input');
        const loadBtn = document.getElementById('load-print-profile-btn');
        const saveBtn = document.getElementById('save-print-profile-btn');
        const markDirty = () => {
          target._editorStore.print.fields.infill = infillInput.value;
          target._editorStore.print.fields.walls = wallsInput.value;
          target._editorStore.print.fields.pattern = patternInput.value;
          syncProfileFlags();
          this.renderSidebar();
          this.renderEditor();
          this.renderStatus();
        };
        infillInput.addEventListener('input', markDirty);
        wallsInput.addEventListener('input', markDirty);
        patternInput.addEventListener('change', markDirty);
        loadBtn.addEventListener('click', () => loadProfile('print'));
        if (saveBtn) saveBtn.addEventListener('click', saveCurrentTabProfile);
      }
  
      if (state.editorTab === 'filament') {
        const materialInput = document.getElementById('filament-material-input');
        const nozzleInput = document.getElementById('filament-nozzle-input');
        const bedInput = document.getElementById('filament-bed-input');
        const loadBtn = document.getElementById('load-filament-profile-btn');
        const saveBtn = document.getElementById('save-filament-profile-btn');
        const markDirty = () => {
          target._editorStore.filament.fields.material = materialInput.value;
          target._editorStore.filament.fields.nozzleTemp = nozzleInput.value;
          target._editorStore.filament.fields.bedTemp = bedInput.value;
          syncProfileFlags();
          this.renderSidebar();
          this.renderEditor();
          this.renderStatus();
        };
        materialInput.addEventListener('change', markDirty);
        nozzleInput.addEventListener('input', markDirty);
        bedInput.addEventListener('input', markDirty);
        loadBtn.addEventListener('click', () => loadProfile('filament'));
        if (saveBtn) saveBtn.addEventListener('click', saveCurrentTabProfile);
      }
    },
  
    renderInspector() {
      document.querySelectorAll('[data-inspector]').forEach(btn => btn.classList.toggle('active', btn.dataset.inspector === state.previewTab));
      this.els.inspectorContentLabel.textContent = state.previewTab;
      const rowsByTab = {
        STL: [['Mesh','mesh'], ['Wireframe','wireframe'], ['Slope heatmap','slopeHeatmap']],
        GCODE: [['Perimeters','perimeters'], ['Infill','infill']]
      };
      const wrap = document.createElement('div');
      wrap.className = 'toggle-list';
      (rowsByTab[state.previewTab] || []).forEach(([label, key]) => {
        const row = document.createElement('div');
        row.className = 'toggle-row' + (state.previewToggles[key] ? ' active' : '');
        row.innerHTML = `<span>${label}</span><span>${state.previewToggles[key] ? 'On' : 'Off'}</span>`;
        row.addEventListener('click', () => { state.previewToggles[key] = !state.previewToggles[key]; this.renderInspector(); this.drawViewport(); });
        wrap.appendChild(row);
      });
      this.els.inspectorContentBody.innerHTML = '';
      this.els.inspectorContentBody.appendChild(wrap);
    },
  
    renderDevTabs() { this.els.devTabs.innerHTML = '<button class="dev-tab active">Log</button>'; },
    renderLogPane() {
      this.els.logPane.innerHTML = '';
      state.logEntries.forEach(entry => {
        const div = document.createElement('div');
        div.className = 'log-entry';
        div.innerHTML = `<strong>[${entry.time}]</strong> ${entry.message}`;
        this.els.logPane.appendChild(div);
      });
    },
    openContextMenu(x, y, items) {
      this.els.contextMenu.innerHTML = '';
      items.forEach(([label, fn]) => {
        const item = document.createElement('div');
        item.className = 'context-item'; item.textContent = label;
        item.addEventListener('click', () => { this.closeContextMenu(); fn(); });
        this.els.contextMenu.appendChild(item);
      });
      this.els.contextMenu.style.left = `${x}px`;
      this.els.contextMenu.style.top = `${y}px`;
      this.els.contextMenu.classList.add('open');
    },
    closeContextMenu() { this.els.contextMenu.classList.remove('open'); },
    closeMenus() {
      state.openMenu = null;
      document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('[data-menu]').forEach(b => b.classList.remove('open'));
    },
    openMenu(name, btn) {
      this.closeMenus(); state.openMenu = name; btn.classList.add('open');
      const map = { file: this.els.fileMenu, layout: this.els.layoutMenu };
      const menu = map[name]; if (!menu) return;
      const rect = btn.getBoundingClientRect(); menu.style.left = `${rect.left}px`; menu.classList.add('open');
    },
  
    drawViewport() {
      const canvas = this.els.canvas;
      const ctx = canvas.getContext('2d');
      const dpr = Math.max(1, window.devicePixelRatio || 1);
      const cssW = canvas.clientWidth;
      const cssH = canvas.clientHeight;
  
      canvas.width = Math.floor(cssW * dpr);
      canvas.height = Math.floor(cssH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);
  
      const objects = state.objects instanceof Map
        ? Array.from(state.objects.values())
        : Array.isArray(state.objects)
          ? state.objects
          : [];
  
      const selected = this.getSelectedObject ? this.getSelectedObject() : null;
      const selectedObject = selected?.object || null;
  
      const buildPlateLength = Number(
        state.machine?.buildPlateLength
        ?? document.getElementById('buildPlateLengthId')?.value
        ?? 300
      );
      const buildPlateWidth = Number(
        state.machine?.buildPlateWidth
        ?? document.getElementById('buildPlateWidthId')?.value
        ?? 300
      );
  
      const platePadding = 0.12;
      const usableW = cssW * (1 - platePadding * 2);
      const usableH = cssH * (1 - platePadding * 2);
      const baseScale = Math.min(usableW / Math.max(buildPlateLength, 1), usableH / Math.max(buildPlateWidth, 1));
      const distanceScale = Math.max(state.camera?.distance || 1, 0.001);
      const finalScale = baseScale * Math.max(state.zoom || 1, 0.001) * distanceScale;
  
      const plateCx = cssW * 0.5;
      const plateCy = cssH * 0.5;
  
      const visibleObjects = objects.filter(obj => obj && obj.visible !== false && Array.isArray(obj.triangles) && obj.triangles.length);
  
      if (!visibleObjects.length) {
        ctx.strokeStyle = '#4e5954';
        ctx.lineWidth = 1;
        ctx.strokeRect(plateCx - (buildPlateLength * baseScale) / 2, plateCy - (buildPlateWidth * baseScale) / 2, buildPlateLength * baseScale, buildPlateWidth * baseScale);
        ctx.fillStyle = '#d7ddd9';
        ctx.font = '12px monospace';
        ctx.fillText('VIEWPORT · no visible triangles loaded', 20, 28);
        return;
      }
  
      let focusCenterX = Number(state.camera?.centerX ?? buildPlateLength * 0.5);
      let focusCenterY = Number(state.camera?.centerY ?? buildPlateWidth * 0.5);
  
      const angleZ = ((state.camera?.angleZ || 0) * Math.PI) / 180;
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);
  
      
  
      const projectPoint = (vertex) => {
        const worldX = Number(vertex.x ?? 0);
        const worldY = Number(vertex.y ?? 0);
        const dx = worldX - focusCenterX;
        const dy = worldY - focusCenterY;
        return {
          x: dx * cosZ - dy * sinZ,
          y: dx * sinZ + dy * cosZ
        };
      };
  
      ctx.save();
      ctx.translate(plateCx, plateCy);
      ctx.scale(finalScale, -finalScale);
  
      visibleObjects.forEach((obj) => {
        
  
        const isSelected = selectedObject && obj.id === selectedObject.id;
        ctx.strokeStyle = isSelected || state.selectedId === obj.id ? '#d7ddd9' : '#7f9789';
        ctx.lineWidth = (isSelected || state.selectedId === obj.id ? 1.8 : 1) / finalScale;
  
        obj.triangles.forEach((triangle) => {
          if (!triangle || !Array.isArray(triangle.vertices) || triangle.vertices.length < 3) return;
          const p0 = projectPoint(triangle.vertices[0]);
          const p1 = projectPoint(triangle.vertices[1]);
          const p2 = projectPoint(triangle.vertices[2]);
  
          ctx.beginPath();
          ctx.moveTo(p0.x, p0.y);
          ctx.lineTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.closePath();
          ctx.stroke();
        });
      });
  
      ctx.strokeStyle = '#4e5954';
      ctx.lineWidth = 1 / finalScale;
      const plateCorners = [
        projectPoint({ x: 0, y: 0 }),
        projectPoint({ x: buildPlateLength, y: 0 }),
        projectPoint({ x: buildPlateLength, y: buildPlateWidth }),
        projectPoint({ x: 0, y: buildPlateWidth })
      ];
      ctx.beginPath();
      ctx.moveTo(plateCorners[0].x, plateCorners[0].y);
      plateCorners.slice(1).forEach((corner) => ctx.lineTo(corner.x, corner.y));
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
  
      ctx.fillStyle = '#d7ddd9';
      ctx.font = '12px monospace';
      ctx.fillText(`VIEWPORT · ${state.buildPlate.scaleFactor}x · ${state.viewportReferenceFrame === 'selected-object' ? 'selected STL ref' : 'build plate center ref'} · objects: ${objects.length}`, 20, 28);
    },
  
  
    renderAll() {
      this.applyDimensions(); this.renderStatus(); this.renderSidebar(); this.renderSettingsDrawer(); this.renderMachineDrawer(); this.renderEditor(); this.renderInspector(); this.renderDevTabs(); this.renderLogPane(); this.drawViewport(); 
    },
  
    setupSidebarResize() {
      let active = false;
      let startX = 0;
      let startWidth = 0;
  
      this.els.sidebarCornerResizer.addEventListener('mousedown', (e) => {
        active = true;
        startX = e.clientX;
        startWidth = this.els.sidebarResizeShell.getBoundingClientRect().width;
        document.body.style.cursor = 'nwse-resize';
        e.preventDefault();
        e.stopPropagation();
      });
  
      window.addEventListener('mousemove', (e) => {
        if (!active) return;
        const nextWidth = Math.max(250, Math.min(window.innerWidth * 0.68, startWidth + (e.clientX - startX)));
        state.sidebarWidth = nextWidth;
        this.applyDimensions();
      });
  
      window.addEventListener('mouseup', () => {
        active = false;
        document.body.style.cursor = '';
      });
    },
    setupDevResize() {
      let active = false, sx = 0, sy = 0, sw = 0, sh = 0;
      this.els.devResizer.addEventListener('mousedown', (e) => { active = true; sx = e.clientX; sy = e.clientY; sw = state.devWidth; sh = state.devHeight; document.body.style.cursor = 'nwse-resize'; e.preventDefault(); });
      window.addEventListener('mousemove', (e) => { if (!active) return; state.devWidth = Math.max(320, Math.min(window.innerWidth - 20, sw + (sx - e.clientX))); state.devHeight = Math.max(160, Math.min(window.innerHeight * 0.7, sh + (sy - e.clientY))); this.applyDimensions(); });
      window.addEventListener('mouseup', () => { active = false; document.body.style.cursor = ''; });
    },
    setupEditorDragging() {
      let active = false, sx = 0, sy = 0, ox = 0, oy = 0;
      this.els.editorHead.addEventListener('mousedown', (e) => { if (e.target.closest('[data-editor-tab]')) return; active = true; sx = e.clientX; sy = e.clientY; ox = state.editorX; oy = state.editorY; e.preventDefault(); });
      window.addEventListener('mousemove', (e) => { if (!active) return; state.editorX = Math.max(20, Math.min(window.innerWidth - 260, ox + (e.clientX - sx))); state.editorY = Math.max(96, Math.min(window.innerHeight - 120, oy + (e.clientY - sy))); this.renderStatus(); });
      window.addEventListener('mouseup', () => { active = false; });
    },
    setupMenus() {
      document.querySelectorAll('[data-menu]').forEach(btn => {
        btn.addEventListener('click', (e) => { const name = btn.dataset.menu; if (state.openMenu === name) this.closeMenus(); else this.openMenu(name, btn); e.stopPropagation(); });
        btn.addEventListener('mouseenter', () => { if (state.openMenu) this.openMenu(btn.dataset.menu, btn); });
      });
      document.addEventListener('click', (e) => { if (!e.target.closest('.dropdown') && !e.target.closest('[data-menu]')) this.closeMenus(); if (!this.els.contextMenu.contains(e.target)) this.closeContextMenu(); });
    },
    setupButtons() {
      this.els.sidebarGrip.addEventListener('click', () => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
        this.applyDimensions();
      });
      this.els.sidebarRestoreBtn.addEventListener('click', () => {
        state.sidebarCollapsed = false;
        this.applyDimensions();
      });
      this.els.settingsToggleBtn.addEventListener('click', () => {
        state.settingsOpen = !state.settingsOpen;
        this.renderStatus();
      });
      this.els.machineToggleBtn.addEventListener('click', () => {
        state.machineOpen = !state.machineOpen;
        this.renderStatus();
      });
          this.els.previewToggleBtn.addEventListener('click', () => { state.previewCollapsed = !state.previewCollapsed; this.renderStatus(); });
      this.els.settingsDrawer.querySelectorAll('[data-settings-tab]').forEach(btn => btn.addEventListener('click', () => { state.settingsTab = btn.dataset.settingsTab; this.renderSettingsDrawer(); }));
      this.els.machineDrawer.querySelectorAll('[data-machine-tab]').forEach(btn => btn.addEventListener('click', () => { state.machineTab = btn.dataset.machineTab; this.renderMachineDrawer(); }));
      this.els.importStlItem.addEventListener('click', () => { this.appendLog('Import STL called.'); this.closeMenus(); document.getElementById("hiddenImportStlInput").click()});
      this.els.importProjectItem.addEventListener('click', () => { this.appendLog('Import Project called.'); this.closeMenus(); });
      this.els.exportGcodeItem.addEventListener('click', () => { this.appendLog('Export G-code called.'); this.closeMenus(); });
      this.els.exportDebugItem.addEventListener('click', () => { this.appendLog('Export debug data called.'); this.closeMenus(); });
      this.els.saveLayoutItem.addEventListener('click', this.closeMenus());
      this.els.resetLayoutItem.addEventListener('click', () => { state.zoom = 1; state.focusMode = 'plate'; state.viewportReferenceFrame = 'build-plate'; state.sidebarCollapsed = false; state.settingsOpen = false; state.machineOpen = false; state.previewCollapsed = false; state.dirty = false; state.selectedId = state.objects.values().next().value; this.renderAll(); this.closeMenus(); });
      this.els.toggleEditorItem.addEventListener('click', () => {
        state.editorHidden = !state.editorHidden;
        this.renderStatus();
        this.closeMenus();
      });
      this.els.toggleDevItem.addEventListener('click', () => { state.devCollapsed = !state.devCollapsed; this.applyDimensions(); this.closeMenus(); });
      let canvas = document.getElementById("viewport");
      let app = document.getElementById("app");

      this.els.zoomInBtn.addEventListener('click', () => {
        if (state.selectedId) this.centerCameraOnSelectedObject();
        state.buildPlate.scaleFactor = state.buildPlate.scaleFactor * 1.1;
        canvas.style.width = `${canvas.width +100}px`;
        canvas.style.height = `${canvas.width +100}px`;
        app.scrollLeft = (app.scrollWidth - app.clientWidth)/2;
        app.scrollTop = (app.scrollHeight - app.clientHeight)/2;
        this.renderAll();
        compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
      });
      this.els.zoomOutBtn.addEventListener('click', () => {
        if (state.selectedId) this.centerCameraOnSelectedObject();
        state.buildPlate.scaleFactor = state.buildPlate.scaleFactor / 1.1;
        canvas.style.width = `${ canvas.width-100}px`;
        canvas.style.height = `${ canvas.width-100}px`;
        app.scrollLeft = (app.scrollWidth - app.clientWidth)/2;
        app.scrollTop = (app.scrollHeight - app.clientHeight)/2;
        this.renderAll();
        compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
      });
      this.els.zoomResetBtn.addEventListener('click', () => {
        if (!state.camera) state.camera = { ...slicerApp.defaults.camera };
        state.buildPlate.scaleFactor = 1;
        this.renderAll();
        compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
      });
      this.els.focusSelectedBtn.textContent = 'Selected STL';
      this.els.showWholeBtn.textContent = 'Build Plate Center';
      this.els.focusSelectedBtn.addEventListener('click', () => {
        state.viewportReferenceFrame = 'selected-object';
        this.els.focusSelectedBtn.classList.toggle("active");
        this.els.showWholeBtn.classList.toggle("active");
        this.renderSidebar();
        compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);
      });
      this.els.showWholeBtn.addEventListener('click', () => {
        state.viewportReferenceFrame = 'build-plate';
        this.els.showWholeBtn.classList.toggle("active");
        this.els.focusSelectedBtn.classList.toggle("active");
        this.renderAll();
        compute.rotateView(state.buildPlate.xAngle, state.buildPlate.yAngle, state.buildPlate.zAngle);        

    });
      this.els.objectEditor.querySelectorAll('[data-editor-tab]').forEach(btn => btn.addEventListener('click', () => { if (btn.classList.contains('tab-disabled')) return; state.editorTab = btn.dataset.editorTab; this.renderEditor();}));
      document.querySelectorAll('[data-inspector]').forEach(btn => btn.addEventListener('click', () => { state.previewTab = btn.dataset.inspector; this.renderInspector();}));
      this.els.clearDevBtn.addEventListener('click', () => {
        state.logEntries = [];
        this.renderLogPane();
      });
      this.els.devToggleBar.addEventListener('click', () => { state.devCollapsed = !state.devCollapsed; this.applyDimensions(); });
      this.els.editorHideBtn.addEventListener('click', () => {
        state.editorHidden = true;
        this.renderStatus();
      });
    },
  
    init() {
        document.getElementById("viewport").addEventListener("mousedown", (event)=>{state.buildPlate.focused = true; compute.canvasFocus(event)});
        document.getElementById("viewport").addEventListener("mousemove", (event)=>{if(state.buildPlate.focused){compute.canvasDragRotate(event)}});
        document.getElementById("body").addEventListener("mouseup", ()=>{state.buildPlate.focused = false;});
      if (state.objects instanceof Map) {
        state.objects.forEach((obj) => this.applyFlatDefaultsToObject(obj));
      } else if (Array.isArray(state.objects)) {
        state.objects.forEach((obj) => this.applyFlatDefaultsToObject(obj));
      }
      if (!state.viewportReferenceFrame) state.viewportReferenceFrame = slicerApp.defaults.viewportReferenceFrame;
      if (!state.camera) state.camera = { ...slicerApp.defaults.camera };
      this.renderAll();
      this.setupSidebarResize(); this.setupDevResize(); this.setupEditorDragging(); this.setupMenus(); this.setupButtons();
    },
  
  };
  