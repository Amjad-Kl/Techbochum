/**
 * MapForAll - Barrierefreiheits-Steuerung
 * Verwaltet Barrierefreiheits-Optionen: Kontrast, Schriftgröße, Nachtmodus, Farbschwäche, Sprachausgabe
 */

const AccessibilityManager = {
    state: {
        highContrast: false,
        largeText: false,
        darkMode: false,
        colorblindMode: 'none',
        speechActive: false
    },

    init() {
        this.loadPreferences();
        this.bindEvents();
    },

    loadPreferences() {
        this.state.highContrast = localStorage.getItem('mf_high_contrast') === 'true';
        this.state.largeText = localStorage.getItem('mf_large_text') === 'true';
        this.state.darkMode = localStorage.getItem('mf_dark_mode') === 'true';
        this.state.colorblindMode = localStorage.getItem('mf_colorblind') || 'none';

        this.applyThemeChanges();
        this.syncCheckboxes();
    },

    syncCheckboxes() {
        const hcToggle = document.getElementById('toggle-high-contrast');
        const ltToggle = document.getElementById('toggle-large-text');
        const dmToggle = document.getElementById('toggle-dark-mode');
        const cbSelect = document.getElementById('select-colorblind');

        if (hcToggle) hcToggle.checked = this.state.highContrast;
        if (ltToggle) ltToggle.checked = this.state.largeText;
        if (dmToggle) dmToggle.checked = this.state.darkMode;
        if (cbSelect) cbSelect.value = this.state.colorblindMode;
    },

    applyThemeChanges() {
        const body = document.body;

        // Kontrast
        body.classList.toggle('theme-high-contrast', this.state.highContrast);
        
        // Schriftgröße
        body.classList.toggle('theme-large-text', this.state.largeText);

        // Nachtmodus
        body.classList.toggle('theme-dark', this.state.darkMode);

        // Farbschwäche-Filter
        body.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia');
        if (this.state.colorblindMode === 'protanopia') {
            body.classList.add('colorblind-protanopia');
        } else if (this.state.colorblindMode === 'deuteranopia') {
            body.classList.add('colorblind-deuteranopia');
        }
    },

    bindEvents() {
        const hcToggle = document.getElementById('toggle-high-contrast');
        if (hcToggle) {
            hcToggle.addEventListener('change', (e) => {
                this.state.highContrast = e.target.checked;
                localStorage.setItem('mf_high_contrast', this.state.highContrast);
                this.applyThemeChanges();
            });
        }

        const ltToggle = document.getElementById('toggle-large-text');
        if (ltToggle) {
            ltToggle.addEventListener('change', (e) => {
                this.state.largeText = e.target.checked;
                localStorage.setItem('mf_large_text', this.state.largeText);
                this.applyThemeChanges();
            });
        }

        const dmToggle = document.getElementById('toggle-dark-mode');
        if (dmToggle) {
            dmToggle.addEventListener('change', (e) => {
                this.state.darkMode = e.target.checked;
                localStorage.setItem('mf_dark_mode', this.state.darkMode);
                this.applyThemeChanges();
            });
        }

        const cbSelect = document.getElementById('select-colorblind');
        if (cbSelect) {
            cbSelect.addEventListener('change', (e) => {
                this.state.colorblindMode = e.target.value;
                localStorage.setItem('mf_colorblind', this.state.colorblindMode);
                this.applyThemeChanges();
            });
        }

        const ttsBtn = document.getElementById('btn-tts-read');
        if (ttsBtn) {
            ttsBtn.addEventListener('click', () => {
                this.toggleSpeech();
            });
        }
    },

    speakText(text) {
        if (!('speechSynthesis' in window)) {
            App.showToast('Sprachausgabe wird von diesem Browser leider nicht unterstützt.', 'error');
            return;
        }

        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'de-DE';
        utterance.rate = 0.95;

        utterance.onend = () => {
            this.state.speechActive = false;
            this.updateTTSButton(false);
        };

        utterance.onerror = () => {
            this.state.speechActive = false;
            this.updateTTSButton(false);
        };

        window.speechSynthesis.speak(utterance);
        this.state.speechActive = true;
        this.updateTTSButton(true);
    },

    toggleSpeech() {
        if (!('speechSynthesis' in window)) {
            App.showToast('Sprachausgabe wird nicht unterstützt.', 'error');
            return;
        }

        if (this.state.speechActive) {
            window.speechSynthesis.cancel();
            this.state.speechActive = false;
            this.updateTTSButton(false);
            App.showToast('Vorlesen beendet.');
        } else {
            // Aktiven Inhalt ermitteln
            const activeTab = document.querySelector('.tab-panel.active');
            let contentText = 'Willkommen bei MapForAll – Barrierefreie Stadtkarte. ';
            
            if (activeTab) {
                const title = activeTab.querySelector('h3, .card-title');
                if (title) {
                    contentText += activeTab.innerText.slice(0, 400);
                } else {
                    contentText += activeTab.innerText.slice(0, 400);
                }
            } else {
                contentText += 'Wählen Sie einen Ort oder eine Baustelle auf der Karte aus, um Details zu hören.';
            }

            this.speakText(contentText);
            App.showToast('Vorlesen gestartet...');
        }
    },

    updateTTSButton(isActive) {
        const ttsBtn = document.getElementById('btn-tts-read');
        if (!ttsBtn) return;
        const label = ttsBtn.querySelector('.btn-label') || ttsBtn;
        if (isActive) {
            label.textContent = 'Vorlesen stoppen';
            ttsBtn.classList.add('active');
        } else {
            label.textContent = 'Vorlesen starten';
            ttsBtn.classList.remove('active');
        }
    }
};

window.AccessibilityManager = AccessibilityManager;
