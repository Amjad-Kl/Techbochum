/**
 * MapForAll - Karten-Modul
 * Verwaltet Leaflet-Karte, Vektor-Marker, Popups, GeoJSON-Baustellen und Standortdienste
 */

const MapManager = {
    map: null,
    locationsLayer: null,
    constructionLayer: null,
    reportsLayer: null,
    userLocationMarker: null,
    defaultLocations: [],
    baustellenData: null,

    async init() {
        this.initLeaflet();
        await this.loadDefaultLocations();
        await this.loadBaustellen();
        this.setupMapClick();
    },

    initLeaflet() {
        // Bochum Innenstadt als Startpunkt
        const bochumCenter = [51.4818, 7.2162];
        const defaultZoom = 13;

        this.map = L.map('map', {
            zoomControl: false, // Eigene Positionierung
            attributionControl: true
        }).setView(bochumCenter, defaultZoom);

        // Zoom-Kontrolle unten rechts platzieren
        L.control.zoom({
            position: 'bottomright'
        }).addTo(this.map);

        // OpenStreetMap Kartenkacheln
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>-Mitwirkende'
        }).addTo(this.map);

        // Layer-Gruppen
        this.locationsLayer = L.layerGroup().addTo(this.map);
        this.constructionLayer = L.layerGroup().addTo(this.map);
        this.reportsLayer = L.layerGroup().addTo(this.map);
    },

    createMarkerIcon(type, iconClass) {
        let pinClass = 'pin-accessible';
        if (type === 'partially') pinClass = 'pin-partially';
        if (type === 'issue') pinClass = 'pin-issue';
        if (type === 'construction') pinClass = 'pin-construction';

        return L.divIcon({
            className: 'custom-pin-wrapper',
            html: `<div class="custom-pin ${pinClass}"><i class="${iconClass}"></i></div>`,
            iconSize: [34, 34],
            iconAnchor: [17, 17],
            popupAnchor: [0, -18]
        });
    },

    async loadDefaultLocations() {
        try {
            const res = await fetch('data/default-locations.json');
            if (res.ok) {
                this.defaultLocations = await res.json();
                this.renderLocationsMarkers(this.defaultLocations);
                this.renderLocationsList(this.defaultLocations);
            }
        } catch (err) {
            console.error('Fehler beim Laden der Standardorte:', err);
        }
    },

    renderLocationsMarkers(locations) {
        this.locationsLayer.clearLayers();

        locations.forEach(loc => {
            const iconClass = loc.type === 'accessible' ? 'fas fa-wheelchair' : 'fas fa-exclamation';
            const marker = L.marker([loc.lat, loc.lng], {
                icon: this.createMarkerIcon(loc.type, iconClass),
                title: loc.name
            });

            const featuresHtml = (loc.features || []).map(f => `<span class="tag-item">${f}</span>`).join(' ');

            marker.bindPopup(`
                <div class="popup-box">
                    <h3 class="popup-title">${loc.name}</h3>
                    <div class="popup-meta"><i class="fas fa-tag"></i> ${loc.category || 'Öffentlicher Ort'}</div>
                    <p class="popup-desc">${loc.description}</p>
                    ${featuresHtml ? `<div class="tags-row" style="margin-top: 6px;">${featuresHtml}</div>` : ''}
                </div>
            `);

            this.locationsLayer.addLayer(marker);
            loc._marker = marker;
        });
    },

    renderLocationsList(locations, filterCategory = 'all') {
        const container = document.getElementById('locations-items-list');
        const badgeCount = document.getElementById('badge-locations-count');
        if (!container) return;

        if (badgeCount) {
            badgeCount.textContent = locations.length;
        }

        let filtered = locations;
        if (filterCategory !== 'all') {
            filtered = locations.filter(loc => {
                if (filterCategory === 'stufenfrei') {
                    return (loc.features || []).some(f => f.toLowerCase().includes('stufen'));
                }
                if (filterCategory === 'aufzug') {
                    return (loc.features || []).some(f => f.toLowerCase().includes('aufzug'));
                }
                return loc.category && loc.category.toLowerCase().includes(filterCategory.toLowerCase());
            });
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="padding: 24px 12px; text-align: center; color: var(--text-muted);">
                    <p>Keine Orte für diesen Filter gefunden.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(loc => `
            <article class="card-item" data-id="${loc.id}" data-lat="${loc.lat}" data-lng="${loc.lng}" tabindex="0" role="button" aria-label="${loc.name}">
                <div class="card-title-row">
                    <h4 class="card-title">${loc.name}</h4>
                    <span class="badge ${loc.type === 'accessible' ? 'badge-success' : 'badge-warning'}">
                        ${loc.type === 'accessible' ? 'Barrierefrei' : 'Teilweise barrierefrei'}
                    </span>
                </div>
                <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 6px;">
                    <i class="fas fa-map-marker-alt"></i> ${loc.category}
                </div>
                <p class="card-desc">${loc.description}</p>
                <div class="tags-row">
                    ${(loc.features || []).map(f => `<span class="tag-item">${f}</span>`).join('')}
                </div>
            </article>
        `).join('');

        container.querySelectorAll('.card-item').forEach(card => {
            const handleSelect = () => {
                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);
                this.panTo(lat, lng, 16);
                
                const locObj = this.defaultLocations.find(l => l.id === card.dataset.id);
                if (locObj && locObj._marker) {
                    locObj._marker.openPopup();
                }
            };
            card.addEventListener('click', handleSelect);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect();
                }
            });
        });
    },

    async loadBaustellen() {
        try {
            const res = await fetch('data/baustellen.geojson');
            if (res.ok) {
                this.baustellenData = await res.json();
                this.renderBaustellenMarkers(this.baustellenData);
                this.renderBaustellenList(this.baustellenData.features || []);
            }
        } catch (err) {
            console.error('Fehler beim Laden der Baustellen-Daten:', err);
        }
    },

    renderBaustellenMarkers(geojson) {
        this.constructionLayer.clearLayers();

        L.geoJSON(geojson, {
            pointToLayer: (feature, latlng) => {
                return L.marker(latlng, {
                    icon: this.createMarkerIcon('construction', 'fas fa-person-digging'),
                    title: feature.properties.name || 'Baustelle'
                });
            },
            onEachFeature: (feature, layer) => {
                const p = feature.properties;
                let html = `<div class="popup-box">`;
                html += `<h3 class="popup-title">${p.name || 'Baustelle'}</h3>`;
                html += `<div class="badge badge-construction" style="margin-bottom: 8px;"><i class="fas fa-triangle-exclamation"></i> ${p.status || 'Arbeiten im Straßenraum'}</div>`;
                if (p.duration) html += `<div class="popup-meta"><b>Dauer:</b> ${p.duration}</div>`;
                if (p.work) html += `<p class="popup-desc" style="margin-top: 4px;"><b>Arbeiten:</b> ${p.work}</p>`;
                if (p.contractor) html += `<div class="popup-meta"><b>Verantwortlich:</b> ${p.contractor}</div>`;
                html += `</div>`;
                layer.bindPopup(html);
                feature._layer = layer;
            }
        }).addTo(this.constructionLayer);
    },

    renderBaustellenList(features, searchTerm = '') {
        const container = document.getElementById('baustellen-items-list');
        const badgeCount = document.getElementById('badge-baustellen-count');
        if (!container) return;

        if (badgeCount) {
            badgeCount.textContent = features.length;
        }

        let filtered = features;
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = features.filter(f => {
                const name = (f.properties.name || '').toLowerCase();
                const status = (f.properties.status || '').toLowerCase();
                const work = (f.properties.work || '').toLowerCase();
                return name.includes(term) || status.includes(term) || work.includes(term);
            });
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="padding: 24px 12px; text-align: center; color: var(--text-muted);">
                    <p>Keine Baustellen für den Suchbegriff gefunden.</p>
                </div>
            `;
            return;
        }

        // Zeige maximal 40 Einträge im DOM für flüssiges Scrollen
        const displayItems = filtered.slice(0, 40);

        container.innerHTML = displayItems.map((f, idx) => {
            const p = f.properties;
            const coords = f.geometry.coordinates; // [lng, lat]
            return `
                <article class="card-item" data-idx="${idx}" data-lat="${coords[1]}" data-lng="${coords[0]}" tabindex="0" role="button" aria-label="${p.name}">
                    <div class="card-title-row">
                        <h4 class="card-title">${p.name}</h4>
                        <span class="badge badge-construction"><i class="fas fa-road"></i> Baustelle</span>
                    </div>
                    <div style="font-size: 0.8rem; font-weight: 500; color: var(--color-construction); margin-bottom: 6px;">
                        ${p.status || 'Arbeiten im Straßenraum'}
                    </div>
                    ${p.duration ? `<div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;"><i class="far fa-clock"></i> ${p.duration}</div>` : ''}
                    ${p.work ? `<p class="card-desc">${p.work}</p>` : ''}
                </article>
            `;
        }).join('');

        container.querySelectorAll('.card-item').forEach(card => {
            const handleSelect = () => {
                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);
                this.panTo(lat, lng, 16);
            };
            card.addEventListener('click', handleSelect);
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect();
                }
            });
        });
    },

    renderReportsMarkers(reports) {
        this.reportsLayer.clearLayers();

        reports.forEach(r => {
            const marker = L.marker([r.lat, r.lng], {
                icon: this.createMarkerIcon('issue', 'fas fa-triangle-exclamation'),
                title: r.location
            });

            let photoHtml = '';
            if (r.photo) {
                photoHtml = `<div style="margin-top: 8px;"><img src="${r.photo}" alt="Foto" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px;"></div>`;
            }

            marker.bindPopup(`
                <div class="popup-box">
                    <h3 class="popup-title">${r.location}</h3>
                    <div class="badge badge-danger" style="margin-bottom: 6px;">
                        <i class="fas fa-exclamation-circle"></i> Gemeldete Barriere
                    </div>
                    <p class="popup-desc">${r.description}</p>
                    <div class="popup-meta"><b>Art:</b> ${r.barrierType}</div>
                    ${photoHtml}
                </div>
            `);

            this.reportsLayer.addLayer(marker);
        });
    },

    setupMapClick() {
        // Klick auf die Karte bietet direkten Weg zum Melden einer Barriere
        this.map.on('click', (e) => {
            const lat = e.latlng.lat;
            const lng = e.latlng.lng;

            // Optionales Popup mit Schnellaktion
            const popupContent = `
                <div style="text-align: center; padding: 4px;">
                    <p style="font-weight: 600; font-size: 0.88rem; margin-bottom: 8px;">Hier Barriere melden?</p>
                    <button class="btn btn-primary" id="btn-popup-report" style="padding: 6px 12px; font-size: 0.8rem; width: 100%;">
                        <i class="fas fa-plus"></i> Neue Meldung anlegen
                    </button>
                </div>
            `;

            const popup = L.popup()
                .setLatLng(e.latlng)
                .setContent(popupContent)
                .openOn(this.map);

            setTimeout(() => {
                const btn = document.getElementById('btn-popup-report');
                if (btn) {
                    btn.addEventListener('click', () => {
                        this.map.closePopup();
                        document.getElementById('report-lat').value = lat.toFixed(5);
                        document.getElementById('report-lng').value = lng.toFixed(5);
                        document.getElementById('report-location').value = `Ausgewählter Ort (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
                        App.openModal('modal-report');
                    });
                }
            }, 50);
        });
    },

    locateUser() {
        if (!navigator.geolocation) {
            App.showToast('Standortermittlung wird von Ihrem Gerät nicht unterstützt.', 'error');
            return;
        }

        App.showToast('Standort wird ermittelt...');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                if (this.userLocationMarker) {
                    this.map.removeLayer(this.userLocationMarker);
                }

                this.userLocationMarker = L.circleMarker([lat, lng], {
                    radius: 8,
                    fillColor: '#0284c7',
                    color: '#ffffff',
                    weight: 3,
                    opacity: 1,
                    fillOpacity: 0.9
                }).addTo(this.map);

                this.userLocationMarker.bindPopup('<b>Ihr aktueller Standort</b>').openPopup();
                this.panTo(lat, lng, 16);
                App.showToast('Standort gefunden.');
            },
            (error) => {
                App.showToast('Standort konnte nicht ermittelt werden (Zugriff verweigert oder Timeout).', 'error');
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    },

    panTo(lat, lng, zoom = 15) {
        if (this.map) {
            this.map.setView([lat, lng], zoom, { animate: true });
        }
    }
};

window.MapManager = MapManager;
