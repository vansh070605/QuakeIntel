document.addEventListener('DOMContentLoaded', () => {
    // --- 1. INDUSTRIAL THEME TOGGLE & TAB LOGIC ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(`tab-${tabId}`).classList.add('active');
            appendLog(`Switched Workspace: ${tabId.toUpperCase()}`);
        });
    });

    // --- 2. GIS ENGINE INITIALIZATION ---
    const map = L.map('map', {
        center: [20, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false
    });

    // CartoDB Dark Matter (Industrial Look)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
    }).addTo(map);

    // Layers
    let platesVisible = false;
    let heatVisible = false;
    let historyVisible = true;
    let tectonicLayer;
    let heatmapLayer;
    let historyLayer = L.layerGroup().addTo(map);

    // Coordinate Viewer
    map.on('mousemove', (e) => {
        document.getElementById('cursor-lat').innerText = e.latlng.lat.toFixed(4);
        document.getElementById('cursor-lng').innerText = e.latlng.lng.toFixed(4);
    });

    // --- 3. DATA REQUISITION ---
    appendLog("Establishing Secure Connection...");
    
    fetch('/api/seismic-data')
        .then(res => res.json())
        .then(data => {
            document.getElementById('stat-count').innerText = data.features.length.toString().padStart(4, '0');
            appendLog(`Requisitioned ${data.features.length} Historical Records.`);

            const heatPoints = [];
            L.geoJSON(data, {
                pointToLayer: (feature, latlng) => {
                    const mag = feature.properties.mag;
                    const color = mag > 6 ? '#ff4747' : (mag > 4.5 ? '#ffb800' : '#00d4ff');
                    heatPoints.push([latlng.lat, latlng.lng, mag / 10]);

                    return L.circleMarker(latlng, {
                        radius: mag * 1.8,
                        fillColor: color,
                        color: "#fff",
                        weight: 0.5,
                        opacity: 0.8,
                        fillOpacity: 0.3
                    });
                },
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(`
                        <div class="industrial-popup">
                            <strong>TARGET: ${feature.properties.place}</strong><hr>
                            MAGNITUDE: ${feature.properties.mag}<br>
                            RISK_INDEX: ${feature.properties.risk}<br>
                            DEPTH: ${feature.properties.depth} KM<br>
                            TIME: ${feature.properties.time}
                        </div>
                    `);
                }
            }).addTo(historyLayer);

            heatmapLayer = L.heatLayer(heatPoints, {radius: 20, blur: 15, max: 0.8});
            appendLog("Heatmap Clusters Indexed.");
        });

    // Tectonic Plate Data
    appendLog("Fetching Tectonic Boundary Data...");
    fetch('https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json')
        .then(res => res.json())
        .then(data => {
            tectonicLayer = L.geoJSON(data, {
                style: {
                    color: '#00d4ff',
                    weight: 1.5,
                    opacity: 0.4,
                    dashArray: '4, 10'
                }
            });
            appendLog("System Ready: Tectonic Overlays Loaded.");
        });

    // --- 4. PREDICTION HUD COORD LINK ---
    const runBtn = document.getElementById('run-scan');
    runBtn.addEventListener('click', async () => {
        const lat = document.getElementById('lat').value;
        const lng = document.getElementById('lng').value;
        const depth = document.getElementById('depth').value;

        if (!lat || !lng || !depth) {
            appendLog("[ERROR] Insufficient data for Scan.");
            return;
        }

        appendLog(`Initiating Tactical Scan at [${lat}, ${lng}]...`);
        runBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SCANNING...';
        runBtn.disabled = true;

        try {
            const response = await fetch('/api/predict', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat, lng, depth })
            });
            const result = await response.json();

            if (result.status === 'success') {
                renderPrediction(result, [lat, lng]);
                appendLog(`Scan Complete: Prediction Category [${result.prediction}]`);
            } else {
                appendLog(`[FAULT] ${result.message}`);
            }
        } catch (e) {
            appendLog(`[CRITICAL] Connection Refused: ${e.message}`);
        } finally {
            runBtn.innerHTML = 'INITIATE RISK SCAN';
            runBtn.disabled = false;
        }
    });

    function renderPrediction(data, coords) {
        const panel = document.getElementById('scan-results');
        panel.classList.remove('hidden');
        
        document.getElementById('res-time').innerText = data.timestamp;
        document.getElementById('res-class').innerText = data.prediction;
        document.getElementById('res-conf').innerText = data.confidence;
        document.getElementById('res-risk-val').innerText = data.risk_score;
        document.getElementById('res-threat').innerText = data.threat_level;
        
        document.getElementById('risk-fill').style.width = (data.risk_score * 10) + "%";

        // Map Pulse
        map.flyTo(coords, 6, { duration: 1.5 });
        const scanRing = L.circle(coords, {
            radius: 100000,
            color: '#ffb800',
            fillColor: '#ffb800',
            fillOpacity: 0.1,
            weight: 1
        }).addTo(map);

        setTimeout(() => map.removeLayer(scanRing), 4000);
    }

    // --- 5. LOGGING SYSTEM ---
    function appendLog(msg) {
        const log = document.getElementById('activity-log');
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        const time = new Date().toLocaleTimeString('en-GB', { hour12: false });
        entry.innerText = `[${time}] ${msg}`;
        log.prepend(entry);
    }

    // --- 6. MAP CONTROLS ---
    document.getElementById('toggle-history').addEventListener('click', function() {
        historyVisible = !historyVisible;
        this.classList.toggle('active');
        if (historyVisible) historyLayer.addTo(map);
        else map.removeLayer(historyLayer);
    });

    document.getElementById('toggle-plates').addEventListener('click', function() {
        platesVisible = !platesVisible;
        this.classList.toggle('active');
        if (platesVisible) tectonicLayer.addTo(map);
        else map.removeLayer(tectonicLayer);
    });

    document.getElementById('toggle-heatmap').addEventListener('click', function() {
        heatVisible = !heatVisible;
        this.classList.toggle('active');
        if (heatVisible) heatmapLayer.addTo(map);
        else map.removeLayer(heatmapLayer);
    });
});
