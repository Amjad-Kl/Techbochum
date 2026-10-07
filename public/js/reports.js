/**
 * MapForAll - Meldewesen & Berichte
 * Verwaltet Barriere-Meldungen, Synchronisation mit API und lokalem Fallback-Speicher
 */

const ReportsManager = {
    reports: [],
    apiUrl: '/api/reports',
    currentPhotoBase64: null,

    async init() {
        this.bindFormEvents();
        await this.loadReports();
    },

    async loadReports() {
        try {
            const response = await fetch(this.apiUrl);
            if (response.ok) {
                this.reports = await response.json();
                console.log(`✓ ${this.reports.length} Meldungen von der API geladen`);
            } else {
                throw new Error('API-Antwort nicht ok');
            }
        } catch (err) {
            console.warn('API nicht verfügbar, lade Meldungen aus lokalem Speicher:', err.message);
            this.reports = this.getLocalReports();
        }

        this.renderReportsList();
        if (window.MapManager) {
            window.MapManager.renderReportsMarkers(this.reports);
        }
    },

    getLocalReports() {
        try {
            const raw = localStorage.getItem('mapforall_user_reports');
            if (raw) return JSON.parse(raw);
        } catch (e) {
            console.error('Fehler beim Lesen des localStorage:', e);
        }
        return [];
    },

    saveLocalReports(list) {
        try {
            localStorage.setItem('mapforall_user_reports', JSON.stringify(list));
        } catch (e) {
            console.error('Fehler beim Schreiben in den localStorage:', e);
        }
    },

    async submitReport(reportData) {
        let savedReport = null;

        try {
            // Versuche Speichern über Backend
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reportData)
            });

            if (response.ok) {
                savedReport = await response.json();
            } else {
                throw new Error('Server gab Fehler zurück');
            }
        } catch (err) {
            console.warn('Speichere Meldung lokal (Offline/Fallback):', err.message);
            // Lokaler Fallback
            savedReport = {
                _id: 'local_' + Date.now(),
                ...reportData,
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            const localList = this.getLocalReports();
            localList.unshift(savedReport);
            this.saveLocalReports(localList);
        }

        if (savedReport) {
            this.reports.unshift(savedReport);
            this.renderReportsList();
            if (window.MapManager) {
                window.MapManager.renderReportsMarkers(this.reports);
                window.MapManager.panTo(savedReport.lat, savedReport.lng, 16);
            }
        }

        return savedReport;
    },

    renderReportsList(filter = 'all') {
        const container = document.getElementById('reports-items-list');
        const badgeCount = document.getElementById('badge-reports-count');
        if (!container) return;

        if (badgeCount) {
            badgeCount.textContent = this.reports.length;
        }

        let filtered = this.reports;
        if (filter !== 'all') {
            filtered = this.reports.filter(r => r.barrierType === filter || r.status === filter);
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div style="padding: 24px 12px; text-align: center; color: var(--text-muted);">
                    <i class="fas fa-check-circle" style="font-size: 2rem; color: var(--color-success); margin-bottom: 8px; display: block;"></i>
                    <p style="font-weight: 500;">Keine Barrieren in dieser Ansicht</p>
                    <p style="font-size: 0.8rem; margin-top: 4px;">Sie können selbst eine Barriere über den blauen Knopf oben melden.</p>
                </div>
            `;
            return;
        }

        const typeLabels = {
            stairs: 'Treppe / Stufen ohne Rampe',
            narrow: 'Engstelle / Durchgang zu schmal',
            doors: 'Schwere / fehlende Automatiktür',
            surface: 'Unebener Bodenbelag / Kopfsteinpflaster',
            elevator: 'Aufzug defekt / fehlt',
            construction: 'Baustellenhindernis',
            other: 'Sonstige Barriere'
        };

        const statusBadges = {
            pending: '<span class="badge badge-warning"><i class="fas fa-clock"></i> In Prüfung</span>',
            verified: '<span class="badge badge-danger"><i class="fas fa-exclamation-triangle"></i> Bestätigt</span>',
            resolved: '<span class="badge badge-success"><i class="fas fa-check"></i> Behoben</span>'
        };

        container.innerHTML = filtered.map(r => {
            const barrierName = typeLabels[r.barrierType] || 'Gemeldetes Hindernis';
            const statusHtml = statusBadges[r.status] || statusBadges.pending;
            const dateStr = r.createdAt ? new Date(r.createdAt).toLocaleDateString('de-DE') : 'Neu';

            return `
                <article class="card-item" data-lat="${r.lat}" data-lng="${r.lng}" tabindex="0" role="button" aria-label="${r.location}: ${barrierName}">
                    <div class="card-title-row">
                        <h4 class="card-title">${this.escapeHtml(r.location)}</h4>
                        ${statusHtml}
                    </div>
                    <div style="font-size: 0.8rem; font-weight: 600; color: var(--color-danger); margin-bottom: 4px;">
                        ${barrierName}
                    </div>
                    <p class="card-desc">${this.escapeHtml(r.description)}</p>
                    ${r.photo ? `<div style="margin-bottom: 8px;"><img src="${r.photo}" alt="Foto der Barriere" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: var(--radius-sm);"></div>` : ''}
                    <div class="tags-row">
                        <span class="tag-item"><i class="far fa-calendar-alt"></i> ${dateStr}</span>
                        ${r.severity ? `<span class="tag-item">Schweregrad: ${r.severity === 'high' ? 'Hoch' : r.severity === 'low' ? 'Gering' : 'Mittel'}</span>` : ''}
                    </div>
                </article>
            `;
        }).join('');

        // Klick-Handler zum Zentrieren der Karte
        container.querySelectorAll('.card-item').forEach(card => {
            const handleSelect = () => {
                const lat = parseFloat(card.dataset.lat);
                const lng = parseFloat(card.dataset.lng);
                if (!isNaN(lat) && !isNaN(lng) && window.MapManager) {
                    window.MapManager.panTo(lat, lng, 16);
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

    bindFormEvents() {
        const form = document.getElementById('form-report');
        const photoInput = document.getElementById('report-photo-input');
        const dropzone = document.getElementById('report-dropzone');
        const previewContainer = document.getElementById('photo-preview-container');
        const previewImg = document.getElementById('photo-preview-img');
        const removePhotoBtn = document.getElementById('btn-remove-photo');
        const geoBtn = document.getElementById('btn-get-current-location');

        // Foto-Upload über Dropzone
        if (dropzone && photoInput) {
            dropzone.addEventListener('click', () => photoInput.click());
            photoInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (!file) return;

                // Max 5 MB Check
                if (file.size > 5 * 1024 * 1024) {
                    App.showToast('Das Bild ist zu groß. Bitte maximal 5 MB wählen.', 'error');
                    return;
                }

                const reader = new FileReader();
                reader.onload = (event) => {
                    this.currentPhotoBase64 = event.target.result;
                    if (previewImg && previewContainer) {
                        previewImg.src = this.currentPhotoBase64;
                        previewContainer.classList.add('active');
                        dropzone.style.display = 'none';
                    }
                };
                reader.readAsDataURL(file);
            });
        }

        // Foto wieder entfernen
        if (removePhotoBtn) {
            removePhotoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.currentPhotoBase64 = null;
                if (photoInput) photoInput.value = '';
                if (previewContainer) previewContainer.classList.remove('active');
                if (dropzone) dropzone.style.display = 'block';
            });
        }

        // Standort ermitteln
        if (geoBtn) {
            geoBtn.addEventListener('click', () => {
                if (!navigator.geolocation) {
                    App.showToast('Standortermittlung wird vom Browser nicht unterstützt.', 'error');
                    return;
                }
                geoBtn.disabled = true;
                geoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Ermittle...';

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        document.getElementById('report-lat').value = lat;
                        document.getElementById('report-lng').value = lng;
                        
                        const locInput = document.getElementById('report-location');
                        if (locInput && !locInput.value) {
                            locInput.value = `Standort (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
                        }

                        geoBtn.disabled = false;
                        geoBtn.innerHTML = '<i class="fas fa-check"></i> Übernommen';
                        App.showToast('Aktuelle Koordinaten übernommen.');
                    },
                    (err) => {
                        geoBtn.disabled = false;
                        geoBtn.innerHTML = '<i class="fas fa-location-crosshairs"></i> Mein Standort';
                        App.showToast('Standort konnte nicht abgerufen werden.', 'error');
                    },
                    { enableHighAccuracy: true, timeout: 8000 }
                );
            });
        }

        // Formular Absenden
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const locationVal = document.getElementById('report-location').value.trim();
                const barrierTypeVal = document.getElementById('report-barrier-type').value;
                const severityVal = document.getElementById('report-severity').value;
                const descriptionVal = document.getElementById('report-description').value.trim();
                let latVal = parseFloat(document.getElementById('report-lat').value);
                let lngVal = parseFloat(document.getElementById('report-lng').value);

                if (!locationVal || !barrierTypeVal || !descriptionVal) {
                    App.showToast('Bitte alle Pflichtfelder ausfüllen.', 'error');
                    return;
                }

                // Standardkoordinaten falls nicht gesetzt: Bochum Innenstadt mit leichtem Versatz
                if (isNaN(latVal) || isNaN(lngVal)) {
                    latVal = 51.4818 + (Math.random() - 0.5) * 0.015;
                    lngVal = 7.2162 + (Math.random() - 0.5) * 0.015;
                }

                const newReport = {
                    location: locationVal,
                    barrierType: barrierTypeVal,
                    severity: severityVal,
                    description: descriptionVal,
                    lat: latVal,
                    lng: lngVal,
                    photo: this.currentPhotoBase64
                };

                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Wird gespeichert...';
                }

                const result = await this.submitReport(newReport);

                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Meldung einreichen';
                }

                if (result) {
                    App.showToast('Barriere erfolgreich gemeldet! Vielen Dank für Ihren Beitrag.', 'success');
                    form.reset();
                    this.currentPhotoBase64 = null;
                    if (previewContainer) previewContainer.classList.remove('active');
                    if (dropzone) dropzone.style.display = 'block';
                    App.closeModal('modal-report');

                    // Wechsel zur Meldungs-Ansicht
                    App.switchTab('reports');
                } else {
                    App.showToast('Fehler beim Speichern der Meldung.', 'error');
                }
            });
        }
    },

    escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

window.ReportsManager = ReportsManager;
