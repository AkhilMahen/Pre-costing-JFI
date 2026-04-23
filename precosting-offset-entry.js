  /* ----------------------------------------------------------------
     HANDLER: Sidebar list item selection
     ---------------------------------------------------------------- */
  function selectEntry(el) {
    document.querySelectorAll('.list-panel-item').forEach(i => i.classList.remove('active'));
    el.classList.add('active');
  }

  /* ----------------------------------------------------------------
     HANDLER: New list entry (sidebar +) — Axpert will handle creation
     ---------------------------------------------------------------- */
  function handleNewEntry() {}

  /* ----------------------------------------------------------------
     HANDLER: Collapsible Section Toggle
     Smoothly opens / closes a collapsible form section.
     Called via: onclick="toggleSection(this)" on .collapsible-trigger
     ---------------------------------------------------------------- */
  function toggleSection(trigger) {
    const section = trigger.closest('.collapsible-section');
    const content = section.querySelector('.collapsible-content');
    const isOpen  = section.classList.contains('open');

    if (isOpen) {
      content.style.height  = content.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        content.style.height  = '0';
        content.style.opacity = '0';
      }));
      section.classList.remove('open');
    } else {
      section.classList.add('open');
      const targetH = content.scrollHeight;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        content.style.height  = targetH + 'px';
        content.style.opacity = '1';
      }));
      content.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'height' && section.classList.contains('open')) {
          content.style.height = 'auto';
          content.removeEventListener('transitionend', handler);
        }
      });
    }
  }

  /* ----------------------------------------------------------------
     INIT: Set correct initial state for all collapsible sections.
     ---------------------------------------------------------------- */
  function initCollapsible() {
    document.querySelectorAll('.collapsible-section').forEach(section => {
      const content = section.querySelector('.collapsible-content');
      if (!content) return;
      if (section.classList.contains('open')) {
        content.style.height  = 'auto';
        content.style.opacity = '1';
      } else {
        content.style.height  = '0';
        content.style.opacity = '0';
      }
    });
  }
  document.addEventListener('DOMContentLoaded', initCollapsible);

  /* ----------------------------------------------------------------
     MODE SWITCHER: toggle between Header form view and Details panels
     ---------------------------------------------------------------- */
  function switchMode(mode) {
    const formBody = document.getElementById('form-body');
    const btnHeader = document.getElementById('mode-btn-header');
    const btnDetails = document.getElementById('mode-btn-details');
    if (mode === 'header') {
      formBody.classList.remove('detail-active');
      btnHeader.classList.add('active');
      btnDetails.classList.remove('active');
      document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
    } else {
      formBody.classList.add('detail-active');
      btnHeader.classList.remove('active');
      btnDetails.classList.add('active');
      document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
      const defPanel = document.getElementById('detail-panel-pre-press');
      if (defPanel) defPanel.classList.add('active');
      const defBtn = document.querySelector('.detail-tab-btn[data-panel="detail-panel-pre-press"]');
      if (defBtn) defBtn.classList.add('active');
    }
  }

  function toggleDetailTab(panelId) {
    switchMode('details');
    document.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.detail-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(panelId);
    if (panel) panel.classList.add('active');
    const btn = document.querySelector(`.detail-tab-btn[data-panel="${panelId}"]`);
    if (btn) btn.classList.add('active');
  }

  function showHeaderView() { switchMode('header'); }

  /* ----------------------------------------------------------------
     Open the combined Product tab (Header info + FG Product fields)
     ---------------------------------------------------------------- */
  function openProductSections() {
    switchMode('header');
    const ids = ['section-header', 'section-fg-product'];
    document.querySelectorAll('.collapsible-section.open').forEach(sec => {
      if (ids.includes(sec.id)) return;
      const oc = sec.querySelector('.collapsible-content');
      if (!oc) return;
      oc.style.height = oc.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => { oc.style.height = '0'; oc.style.opacity = '0'; }));
      sec.classList.remove('open');
    });
    ids.forEach(id => {
      const sec = document.getElementById(id);
      if (!sec) return;
      const c = sec.querySelector('.collapsible-content');
      if (!c || sec.classList.contains('open')) return;
      sec.classList.add('open');
      const h = c.scrollHeight;
      requestAnimationFrame(() => requestAnimationFrame(() => { c.style.height = h + 'px'; c.style.opacity = '1'; }));
      c.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'height' && sec.classList.contains('open')) {
          c.style.height = 'auto'; c.removeEventListener('transitionend', handler);
        }
      });
    });
    document.querySelectorAll('.horiz-tab').forEach(t => t.classList.remove('open'));
    const prodTab = document.querySelector('.horiz-tab[data-section="section-fg-product"]');
    if (prodTab) prodTab.classList.add('open');
  }

  function toggleSectionById(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    const content = section.querySelector('.collapsible-content');
    if (!content) return;
    const isOpen = section.classList.contains('open');

    switchMode('header');

    if (!isOpen) {
      document.querySelectorAll('.collapsible-section.open').forEach(openSec => {
        if (openSec.id === sectionId) return;
        const oc = openSec.querySelector('.collapsible-content');
        if (!oc) return;
        oc.style.height  = oc.scrollHeight + 'px';
        requestAnimationFrame(() => requestAnimationFrame(() => {
          oc.style.height  = '0';
          oc.style.opacity = '0';
        }));
        openSec.classList.remove('open');
        syncHorizTab(openSec.id);
      });
    }

    if (isOpen) {
      content.style.height  = content.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => {
        content.style.height  = '0';
        content.style.opacity = '0';
      }));
      section.classList.remove('open');
    } else {
      section.classList.add('open');
      const h = content.scrollHeight;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        content.style.height  = h + 'px';
        content.style.opacity = '1';
      }));
      content.addEventListener('transitionend', function handler(e) {
        if (e.propertyName === 'height' && section.classList.contains('open')) {
          content.style.height = 'auto';
          content.removeEventListener('transitionend', handler);
        }
      });
      setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 80);
    }
    syncHorizTab(sectionId);
  }

  function syncHorizTab(sectionId) {
    const isOpen = document.getElementById(sectionId)?.classList.contains('open');
    document.querySelectorAll(`.horiz-tab[data-section="${sectionId}"]`)
      .forEach(tab => tab.classList.toggle('open', !!isOpen));
  }

  /* On page load: open section-header + section-fg-product (combined Product tab) */
  function initHorizTabs() {
    const productIds = ['section-header', 'section-fg-product'];
    document.querySelectorAll('.collapsible-section').forEach(sec => {
      const content = sec.querySelector('.collapsible-content');
      if (!content) return;
      if (productIds.includes(sec.id)) {
        sec.classList.add('open');
        content.style.height  = 'auto';
        content.style.opacity = '1';
      } else {
        sec.classList.remove('open');
        content.style.height  = '0';
        content.style.opacity = '0';
      }
    });
    const prodTab = document.querySelector('.horiz-tab[data-section="section-fg-product"]');
    if (prodTab) prodTab.classList.add('open');
  }
  document.addEventListener('DOMContentLoaded', initHorizTabs);
