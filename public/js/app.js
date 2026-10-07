/**
 * MapForAll - Hauptanwendung (App)
 * Steuert Lebenszyklus, Interaktion, Suchfunktion, Tabs und Benachrichtigungen
 */

const App = {
    searchTimeout: null,

    async init() {
        console.log('Starte MapForAll Barrierefreie Stadtkarte...');

        // Subsysteme initialisieren
        AccessibilityManager.init();
        await MapManager.init();
        await ReportsManager.init();

        this.bindUiEvents();
        this.setupSearch();
    },

    bindUiEvents() {
        // Sidebar Toggle
        const menuBtn = document.getElementById('btn-toggle-menu');
        const sidebar = document.getElementById('sidebar');
        const closeSidebarBtn = document.getElementById('btn-close-sidebar');

        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }

        if (closeSidebarBtn && sidebar) {
            closeSidebarBtn.addEventListener('click', () => {
                sidebar.classList.remove('open');
            });
        }

        // Standort ermitteln Knopf
        const locateBtn = document.getElementById('btn-locate-me');
        if (locateBtn) {
            locateBtn.addEventListener('click', () => {
                MapManager.locateUser();
            });
        }

        // Barriere melden Knopf im Header
        const reportBtn = document.getElementById('btn-open-report');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                this.openModal('modal-report');
            });
        }

        // Barrierefreiheit Knopf im Header
        const a11yBtn = document.getElementById('btn-open-a11y');
        if (a11yBtn) {
            a11yBtn.addEventListener('click', () => {
                this.openModal('modal-accessibility');
            });
        }

        // Modale Schließen-Knöpfe
        document.querySelectorAll('[data-close-modal]').forEach(btn => {
            btn.addEventListener('click', () => {
                const modalId = btn.getAttribute('data-close-modal');
                this.closeModal(modalId);
            });
        });

        // Modale schließen bei Klick auf den Hintergrund
        document.querySelectorAll('.modal-backdrop').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('open');
                }
            });
        });

        // ESC-Taste schließt geöffnete Dialoge oder Sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal-backdrop.open');
                if (openModal) {
                    openModal.classList.remove('open');
                    return;
                }
                const openSidebar = document.querySelector('.sidebar.open');
                if (openSidebar) {
                    openSidebar.classList.remove('open');
                }
            }
        });

        // Tab-Navigation in der Sidebar
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabTarget = btn.getAttribute('data-tab');
                this.switchTab(tabTarget);
            });
        });

        // Filterchips Orte
        document.querySelectorAll('#locations-filters .filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('#locations-filters .filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.getAttribute('data-filter');
                MapManager.renderLocationsList(MapManager.defaultLocations, filter);
            });
        });

        // Filterchips Meldungen
        document.querySelectorAll('#reports-filters .filter-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('#reports-filters .filter-pill').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                const filter = pill.getAttribute('data-filter');
                ReportsManager.renderReportsList(filter);
            });
        });

        // Suchfeld Baustellen
        const baustellenSearchInput = document.getElementById('input-baustellen-search');
        if (baustellenSearchInput) {
            baustellenSearchInput.addEventListener('input', (e) => {
                const term = e.target.value.trim();
                if (MapManager.baustellenData) {
                    MapManager.renderBaustellenList(MapManager.baustellenData.features || [], term);
                }
            });
        }
    },

    switchTab(tabName) {
        // Tab Knöpfe
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
        });

        // Tab Panele
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${tabName}`);
        });

        // Sidebar öffnen falls geschlossen
        const sidebar = document.getElementById('sidebar');
        if (sidebar && !sidebar.classList.contains('open')) {
            sidebar.classList.add('open');
        }
    },

    setupSearch() {
        const searchInput = document.getElementById('global-search-input');
        const clearBtn = document.getElementById('btn-clear-search');
        const dropdown = document.getElementById('search-dropdown');

        if (!searchInput || !dropdown) return;

        // Eingabe-Listener mit Debouncing
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.trim();

            if (clearBtn) {
                clearBtn.classList.toggle('active', query.length > 0);
            }

            clearTimeout(this.searchTimeout);

            if (query.length < 2) {
                dropdown.classList.remove('open');
                dropdown.innerHTML = '';
                return;
            }

            this.searchTimeout = setTimeout(async () => {
                await this.performSearch(query, dropdown);
            }, 300);
        });

        // Löschen-Knopf
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                clearBtn.classList.remove('active');
                dropdown.classList.remove('open');
                dropdown.innerHTML = '';
                searchInput.focus();
            });
        }

        // Schließen bei Klick außerhalb
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('open');
            }
        });

        // Enter-Taste
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const firstResult = dropdown.querySelector('.search-result-item');
                if (firstResult) {
                    firstResult.click();
                }
            }
        });
    },

    async performSearch(query, dropdown) {
        const results = [];
        const queryLower = query.toLowerCase();

        // 1. Lokale Orte durchsuchen
        MapManager.defaultLocations.forEach(loc => {
            if (loc.name.toLowerCase().includes(queryLower) || loc.description.toLowerCase().includes(queryLower)) {
                results.push({
                    title: loc.name,
                    subtitle: loc.category,
                    type: 'local-place',
                    lat: loc.lat,
                    lng: loc.lng
                });
            }
        });

        // 2. Photon Geocoding API abfragen (auf NRW / Deutschland fokussiert)
        try {
            const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lat=51.4818&lon=7.2162&limit=5&lang=de`;
            const res = await fetch(url);
            if (res.ok) {
                const data = await res.json();
                (data.features || []).forEach(f => {
                    const p = f.properties;
                    const coords = f.geometry.coordinates; // [lng, lat]
                    const details = [p.street, p.housenumber, p.city || p.county].filter(Boolean).join(', ');
                    results.push({
                        title: p.name || details || 'Adresse',
                        subtitle: details || p.country || 'Standort',
                        type: 'address',
                        lat: coords[1],
                        lng: coords[0]
                    });
                });
            }
        } catch (err) {
            console.warn('Geocoding-Suche fehlgeschlagen:', err);
        }

        if (results.length === 0) {
            dropdown.innerHTML = `
                <div style="padding: 12px 16px; color: var(--text-muted); font-size: 0.85rem;">
                    Keine Treffer für "${this.escapeHtml(query)}"
                </div>
            `;
            dropdown.classList.add('open');
            return;
        }

        dropdown.innerHTML = results.slice(0, 7).map(r => `
            <div class="search-result-item" data-lat="${r.lat}" data-lng="${r.lng}">
                <i class="${r.type === 'local-place' ? 'fas fa-map-marker-alt' : 'fas fa-location-dot'}"></i>
                <div>
                    <div style="font-weight: 600; color: var(--text-primary);">${this.escapeHtml(r.title)}</div>
                    <div style="font-size: 0.75rem; color: var(--text-muted);">${this.escapeHtml(r.subtitle)}</div>
                </div>
            </div>
        `).join('');

        dropdown.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const lat = parseFloat(item.dataset.lat);
                const lng = parseFloat(item.dataset.lng);
                MapManager.panTo(lat, lng, 16);
                dropdown.classList.remove('open');
                document.getElementById('global-search-input').value = item.querySelector('div > div').innerText;
            });
        });

        dropdown.classList.add('open');
    },

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            const firstInput = modal.querySelector('input:not([type="hidden"]), select, textarea, button');
            if (firstInput) firstInput.focus();
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('open');
        }
    },

    showToast(message, type = 'info') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
        
        let icon = 'fas fa-info-circle';
        if (type === 'success') icon = 'fas fa-check-circle';
        if (type === 'error') icon = 'fas fa-exclamation-circle';

        toast.innerHTML = `<i class="${icon}"></i> <span>${this.escapeHtml(message)}</span>`;
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.transition = 'opacity 0.3s, transform 0.3s';
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 300);
        }, 3600);
    },

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

window.App = App;

// Start bei DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
