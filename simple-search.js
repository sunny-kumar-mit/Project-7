document.addEventListener('DOMContentLoaded', function() {
    // Toggle between simple and advanced search
    const simpleSearchToggle = document.getElementById('simpleSearchToggle');
    const advancedSearchToggle = document.getElementById('advancedSearchToggle');
    const simpleSearchContainer = document.getElementById('simpleSearchContainer');
    const advancedSearchContainer = document.getElementById('advancedSearchContainer');
    const simpleSearchResults = document.getElementById('simpleSearchResults');
    const advancedSearchResults = document.getElementById('searchResults');

    simpleSearchToggle.addEventListener('click', function() {
        simpleSearchToggle.classList.add('active');
        advancedSearchToggle.classList.remove('active');
        simpleSearchContainer.classList.add('active');
        advancedSearchContainer.style.display = 'none';
        advancedSearchResults.style.display = 'none';
    });

    advancedSearchToggle.addEventListener('click', function() {
        advancedSearchToggle.classList.add('active');
        simpleSearchToggle.classList.remove('active');
        advancedSearchContainer.style.display = 'block';
        simpleSearchContainer.classList.remove('active');
        simpleSearchResults.style.display = 'none';
    });

    // Load data and populate dropdowns
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateSimpleSearchDropdowns(data);
            setupSimpleSearchEventListeners(data);
        })
        .catch(error => console.error('Error loading data:', error));

    // Show search input when card is clicked
    document.querySelectorAll('.search-card').forEach(card => {
        card.addEventListener('click', function() {
            const searchType = this.dataset.searchType;
            const inputGroup = this.querySelector('.search-input-group');
            
            document.querySelectorAll('.search-input-group').forEach(group => {
                group.classList.remove('active');
            });
            
            inputGroup.classList.add('active');
        });
    });
});

function populateSimpleSearchDropdowns(data) {
    const simpleLocationSelect = document.getElementById('simpleLocation');
    data.propertyLocations.forEach(location => {
        const option = document.createElement('option');
        option.value = location;
        option.textContent = location;
        simpleLocationSelect.appendChild(option);
    });

    const simpleRegistryOfficeSelect = document.getElementById('simpleRegistryOffice');
    data.registrationOffices.forEach(office => {
        const option = document.createElement('option');
        option.value = office;
        option.textContent = office;
        simpleRegistryOfficeSelect.appendChild(option);
    });
}

function setupSimpleSearchEventListeners(data) {
    document.getElementById('searchByName').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleName').value.trim();
        const results = performSearch(data.records, { partyName: searchValue });
        displaySimpleSearchResults(results);
    });

    document.getElementById('searchByAddress').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleLocation').value;
        const results = performSearch(data.records, { propertyLocation: searchValue });
        displaySimpleSearchResults(results);
    });

    document.getElementById('searchByPlot').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simplePlotNo').value.trim().toLowerCase();
        const results = data.records.filter(record => 
            record.serialNo.toLowerCase().includes(searchValue) ||
            record.plotNo.toLowerCase().includes(searchValue)
        );
        displaySimpleSearchResults(results);
    });

    document.getElementById('searchByDeed').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleDeedNo').value.trim();
        const results = performSearch(data.records, { deedNo: searchValue });
        displaySimpleSearchResults(results);
    });

    document.getElementById('searchRegistry').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleRegistryOffice').value;
        const results = performSearch(data.records, { registrationOffice: searchValue });
        displaySimpleSearchResults(results);
    });

    document.getElementById('searchDisputed').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleDisputed').value.trim();
        const resultsContainer = document.getElementById('simpleSearchResults');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Disputed Properties Search</h3>
                <p>This feature requires additional data about property disputes</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });

    document.getElementById('generateReport').addEventListener('click', function(e) {
        e.preventDefault();
        const reportType = document.getElementById('reportType').value;
        const resultsContainer = document.getElementById('simpleSearchResults');
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-chart-pie"></i>
                <h3>Report Generation</h3>
                <p>This would generate a ${reportType} report in a real implementation</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
    });
}

function displaySimpleSearchResults(results) {
    const resultsContainer = document.getElementById('simpleSearchResults');
    resultsContainer.innerHTML = '';

    if (results.length === 0) {
        resultsContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search-minus"></i>
                <h3>No matching records found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        `;
        resultsContainer.style.display = 'block';
        resultsContainer.style.animation = 'fadeIn 0.5s ease-out';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
        return;
    }

    const resultsHeader = document.createElement('div');
    resultsHeader.className = 'results-header';
    resultsHeader.innerHTML = `
        <div class="results-count">
            <i class="fas fa-check-circle"></i> ${results.length} records found
        </div>
        <button class="export-btn">
            <i class="fas fa-download"></i> Export
        </button>
    `;
    resultsContainer.appendChild(resultsHeader);

    // Changed from exportToJsonFile to exportToPDF
    const exportBtn = resultsHeader.querySelector('.export-btn');
    exportBtn.addEventListener('click', () => exportToPDF(results));

    const table = document.createElement('table');
    table.className = 'results-table';

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Deed No', 'Registration Date', 'Party Name', 'Property Location', 'Area', 'Land Value', 'Actions'].forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    results.forEach(record => {
        const row = document.createElement('tr');
        ['deedNo', 'registrationDate', 'partyName', 'propertyLocation', 'area', 'landValue'].forEach(field => {
            const td = document.createElement('td');
            td.textContent = record[field];
            row.appendChild(td);
        });

        const actionTd = document.createElement('td');
        const viewMoreButton = document.createElement('button');
        viewMoreButton.textContent = 'View More';
        viewMoreButton.className = 'view-more-btn';
        viewMoreButton.addEventListener('click', () => showPropertyDetails(record));
        actionTd.appendChild(viewMoreButton);
        row.appendChild(actionTd);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    resultsContainer.appendChild(table);
    resultsContainer.style.display = 'block';
    resultsContainer.style.animation = 'fadeIn 0.5s ease-out';
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function performSearch(records, criteria) {
    return records.filter(record => {
        if (criteria.registrationOffice && criteria.registrationOffice !== 'ALL' && 
            record.registrationOffice !== criteria.registrationOffice) return false;
        
        if (criteria.dateFrom && record.registrationDate < criteria.dateFrom) return false;
        if (criteria.dateTo && record.registrationDate > criteria.dateTo) return false;
        if (criteria.areaFrom && parseFloat(record.area) < parseFloat(criteria.areaFrom)) return false;
        if (criteria.areaTo && parseFloat(record.area) > parseFloat(criteria.areaTo)) return false;
        if (criteria.propertyLocation && criteria.propertyLocation !== 'ALL' && 
            record.propertyLocation !== criteria.propertyLocation) return false;
        if (criteria.serialNo && !record.serialNo.toLowerCase().includes(criteria.serialNo.toLowerCase())) return false;
        if (criteria.khataNo && !record.khataNo.toLowerCase().includes(criteria.khataNo.toLowerCase())) return false;
        if (criteria.circle && criteria.circle !== 'ALL' && record.circle !== criteria.circle) return false;
        if (criteria.deedNo && !record.deedNo.toLowerCase().includes(criteria.deedNo.toLowerCase())) return false;
        if (criteria.plotNo && !record.plotNo.toLowerCase().includes(criteria.plotNo.toLowerCase())) return false;
        if (criteria.mauja && criteria.mauja !== 'ALL' && record.mauja !== criteria.mauja) return false;
        if (criteria.partyName && !record.partyName.toLowerCase().includes(criteria.partyName.toLowerCase())) return false;
        if (criteria.landValueFrom && parseFloat(record.landValue) < parseFloat(criteria.landValueFrom)) return false;
        if (criteria.landValueTo && parseFloat(record.landValue) > parseFloat(criteria.landValueTo)) return false;
        if (criteria.fatherHusbandName && 
            !record.fatherHusbandName.toLowerCase().includes(criteria.fatherHusbandName.toLowerCase())) return false;
        if (criteria.landType && criteria.landType !== 'ALL' && record.landType !== criteria.landType) return false;

        return true;
    });
}

function showPropertyDetails(record) {
    const propertyDetailsContainer = document.getElementById('propertyDetails');
    const propertyDetailsContent = document.getElementById('propertyDetailsContent');
    
    const formattedLandValue = parseInt(record.landValue).toLocaleString('en-IN');
    
    propertyDetailsContent.innerHTML = `
        <div class="detail-item">
            <strong>Deed Number</strong>
            <span>${record.deedNo}</span>
        </div>
        <div class="detail-item">
            <strong>Registration Date</strong>
            <span>${record.registrationDate}</span>
        </div>
        <div class="detail-item">
            <strong>Party Name</strong>
            <span>${record.partyName}</span>
        </div>
        <div class="detail-item">
            <strong>Father/Husband Name</strong>
            <span>${record.fatherHusbandName}</span>
        </div>
        <div class="detail-item">
            <strong>Property Location</strong>
            <span>${record.propertyLocation}</span>
        </div>
        <div class="detail-item">
            <strong>Registration Office</strong>
            <span>${record.registrationOffice}</span>
        </div>
        <div class="detail-item">
            <strong>Area</strong>
            <span>${record.area} decimal</span>
        </div>
        <div class="detail-item">
            <strong>Land Value</strong>
            <span>₹${formattedLandValue}</span>
        </div>
        <div class="detail-item">
            <strong>Serial Number</strong>
            <span>${record.serialNo}</span>
        </div>
        <div class="detail-item">
            <strong>Khata Number</strong>
            <span>${record.khataNo}</span>
        </div>
        <div class="detail-item">
            <strong>Circle</strong>
            <span>${record.circle}</span>
        </div>
        <div class="detail-item">
            <strong>Plot Number</strong>
            <span>${record.plotNo}</span>
        </div>
        <div class="detail-item">
            <strong>Mauja</strong>
            <span>${record.mauja}</span>
        </div>
        <div class="detail-item">
            <strong>Land Type</strong>
            <span>${record.landType}</span>
        </div>
    `;
    
    propertyDetailsContainer.style.display = 'block';
    initPropertyMap(record.propertyLocation);
    propertyDetailsContainer.scrollIntoView({ behavior: 'smooth' });
}

function exportToJsonFile(data) {
    const dataStr = JSON.stringify(data, null, 4);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "property_records.json";
    a.click();

    URL.revokeObjectURL(url);
}

function exportToPDF(data) {
    // Initialize jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // Add Government of India header
    doc.setFontSize(16);
    doc.setTextColor(0, 56, 101); // Dark blue color
    doc.setFont("helvetica", "bold");
    doc.text("Government of India", 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text("Ministry of Property Registration", 105, 22, { align: 'center' });
    
    // Add document title
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text("Property Registration Records", 105, 35, { align: 'center' });
    
    // Add generated date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 42, { align: 'center' });
    
    // Add watermark
    doc.setFontSize(60);
    doc.setTextColor(230, 230, 230);
    doc.setFont("helvetica", "bold");
    doc.text("OFFICIAL", 105, 150, { align: 'center', angle: 45 });
    
    // Reset font for table
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");
    
    // Prepare data for the table
    const headers = [
        { header: 'Deed No', dataKey: 'deedNo' },
        { header: 'Date', dataKey: 'registrationDate' },
        { header: 'Party Name', dataKey: 'partyName' },
        { header: 'Location', dataKey: 'propertyLocation' },
        { header: 'Area (dec)', dataKey: 'area' },
        { header: 'Value (₹)', dataKey: 'landValue' }
    ];
    
    // Format the data for the table
    const tableData = data.map(record => ({
        deedNo: record.deedNo,
        registrationDate: record.registrationDate,
        partyName: record.partyName,
        propertyLocation: record.propertyLocation,
        area: record.area,
        landValue: formatCurrency(record.landValue).replace('₹', '')
    }));
    
    // Add the table
    doc.autoTable({
        head: [headers.map(h => h.header)],
        body: tableData.map(row => headers.map(h => row[h.dataKey])),
        startY: 50,
        theme: 'grid',
        headStyles: {
            fillColor: [0, 56, 101], // Dark blue header
            textColor: 255,
            fontStyle: 'bold'
        },
        alternateRowStyles: {
            fillColor: [240, 240, 240]
        },
        margin: { top: 50 }
    });
    
    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Page ${i} of ${pageCount}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
    }
    
    // Add official seal text at the end
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("This document is system generated and doesn't require a physical signature.", 105, doc.internal.pageSize.height - 20, { align: 'center' });
    
    // Save the PDF
    doc.save(`Property_Records_${new Date().toISOString().slice(0,10)}.pdf`);
}

function formatCurrency(value) {
    return '₹' + parseInt(value).toLocaleString('en-IN');
}

function initPropertyMap(location) {
    const propertyMapContainer = document.getElementById('propertyMap');
    if (!propertyMapContainer) return;
    
    propertyMapContainer.innerHTML = ''; // Clear previous content

    // Detailed coordinates for different locations with custom markers
    const locationData = {
        "Location A": {
            coords: { lat: 28.6139, lng: 77.2090 },
            zoom: 16,
            markerColor: 'red',
            popupContent: 'Prime Commercial Area'
        },
        "Location B": {
            coords: { lat: 28.6129, lng: 77.2080 },
            zoom: 15,
            markerColor: 'blue',
            popupContent: 'Residential Zone'
        },
        "Location C": {
            coords: { lat: 28.6149, lng: 77.2100 },
            zoom: 17,
            markerColor: 'green',
            popupContent: 'Agricultural Land'
        },
        "Location D": {
            coords: { lat: 28.6159, lng: 77.2110 },
            zoom: 16,
            markerColor: 'orange',
            popupContent: 'Industrial Area'
        }
    };

    const locationInfo = locationData[location] || {
        coords: { lat: 28.6139, lng: 77.2090 },
        zoom: 15,
        markerColor: 'purple',
        popupContent: 'Property Location'
    };

    // Create coordinates display
    const coordinatesDiv = document.createElement('div');
    coordinatesDiv.className = 'map-coordinates';
    coordinatesDiv.innerHTML = `
        <i class="fas fa-map-marker-alt"></i> 
        Coordinates: ${locationInfo.coords.lat.toFixed(4)}, ${locationInfo.coords.lng.toFixed(4)}
        <span class="location-type">${locationInfo.popupContent}</span>
    `;
    propertyMapContainer.appendChild(coordinatesDiv);

    // Create map container
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    mapDiv.className = 'property-map-view';
    propertyMapContainer.appendChild(mapDiv);

    // Create map controls container
    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'map-controls';
    controlsDiv.innerHTML = `
        <button class="map-control-btn zoom-in"><i class="fas fa-plus"></i></button>
        <button class="map-control-btn zoom-out"><i class="fas fa-minus"></i></button>
        <a href="https://www.google.com/maps?q=${locationInfo.coords.lat},${locationInfo.coords.lng}" 
           target="_blank" rel="noopener noreferrer" class="map-control-btn external-link">
            <i class="fas fa-external-link-alt"></i>
        </a>
    `;
    propertyMapContainer.appendChild(controlsDiv);

    // Initialize Leaflet map with custom icon
    const map = L.map('map').setView([locationInfo.coords.lat, locationInfo.coords.lng], locationInfo.zoom);

    // Add tile layer (OpenStreetMap with custom style)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    }).addTo(map);

    // Create custom marker icon
    const customIcon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color:${locationInfo.markerColor}">
                  <i class="fas fa-home"></i>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30]
    });

    // Add marker with custom icon
    const marker = L.marker([locationInfo.coords.lat, locationInfo.coords.lng], {
        icon: customIcon
    }).addTo(map)
    .bindPopup(`<b>${location}</b><br>${locationInfo.popupContent}`)
    .openPopup();

    // Add zoom controls functionality
    document.querySelector('.zoom-in').addEventListener('click', () => {
        map.zoomIn();
    });
    document.querySelector('.zoom-out').addEventListener('click', () => {
        map.zoomOut();
    });

    // Add click event to marker to open Google Maps
    marker.on('click', function() {
        window.open(`https://www.google.com/maps?q=${locationInfo.coords.lat},${locationInfo.coords.lng}`, '_blank');
    });

    // Add scale control
    L.control.scale({ imperial: false }).addTo(map);
}