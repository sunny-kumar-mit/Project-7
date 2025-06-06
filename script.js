document.addEventListener('DOMContentLoaded', function() {
    // Load data from JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            populateDropdowns(data);
            setupEventListeners(data);
            initMap(data.propertyLocations);
            setupSimpleSearch(data);
            setupLandGallery(data.propertyImages); // Initialize property image gallery
        })
        .catch(error => console.error('Error loading data:', error));

    // Tab functionality
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            this.classList.add('pulse');
            setTimeout(() => this.classList.remove('pulse'), 2000);
        });
    });

    // Search toggle functionality
    const simpleSearchToggle = document.getElementById('simpleSearchToggle');
    const advancedSearchToggle = document.getElementById('advancedSearchToggle');
    const simpleSearchContainer = document.getElementById('simpleSearchContainer');
    const advancedSearchContainer = document.getElementById('advancedSearchContainer');

    simpleSearchToggle.addEventListener('click', function() {
        simpleSearchToggle.classList.add('active');
        advancedSearchToggle.classList.remove('active');
        simpleSearchContainer.classList.add('active');
        advancedSearchContainer.style.display = 'none';
    });

    advancedSearchToggle.addEventListener('click', function() {
        advancedSearchToggle.classList.add('active');
        simpleSearchToggle.classList.remove('active');
        simpleSearchContainer.classList.remove('active');
        advancedSearchContainer.style.display = 'block';
    });

    // Font size controls
    const fontButtons = document.querySelectorAll('.font-btn');
    fontButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            fontButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const size = this.classList.contains('small') ? '14px' : 
                         this.classList.contains('medium') ? '16px' : '18px';
            document.body.style.fontSize = size;
            localStorage.setItem('fontSize', size);
        });
    });

    // Apply saved font size preference
    const savedFontSize = localStorage.getItem('fontSize');
    if (savedFontSize) {
        document.body.style.fontSize = savedFontSize;
        fontButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.font-btn.${savedFontSize === '14px' ? 'small' : 
                              savedFontSize === '16px' ? 'medium' : 'large'}`).classList.add('active');
    }

    // Scroll to top button
    const scrollTopBtn = document.querySelector('.scroll-top');
    window.addEventListener('scroll', () => {
        scrollTopBtn.classList.toggle('active', window.pageYOffset > 300);
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Close property details
    document.querySelector('.close-details').addEventListener('click', () => {
        document.getElementById('propertyDetails').style.display = 'none';
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('nav ul');
    
    mobileMenuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close menu when clicking on a link
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => navMenu.classList.remove('active'));
    });

    // Initialize chatbot
    setupChatbot();
});

function populateDropdowns(data) {
    // Registration Office
    populateSelect('registrationOffice', data.registrationOffices);
    populateSelect('simpleLocation', data.propertyLocations);
    populateSelect('propertyLocation', data.propertyLocations);
    populateSelect('circle', data.circles);
    populateSelect('mauja', data.maujas);
    populateSelect('landType', data.landTypes);
    populateSelect('simpleRegistryOffice', data.registrationOffices);
}

function populateSelect(elementId, options) {
    const select = document.getElementById(elementId);
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

function setupSimpleSearch(data) {
    // Setup click handlers for search cards
    document.querySelectorAll('.search-card').forEach(card => {
        card.addEventListener('click', function() {
            const inputGroup = this.querySelector('.search-input-group');
            if (inputGroup) {
                document.querySelectorAll('.search-input-group').forEach(group => {
                    group.classList.remove('active');
                });
                inputGroup.classList.add('active');
            }
        });
    });

    // Setup search button handlers
    document.getElementById('searchByName').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleName').value.trim();
        const results = performSearch(data.records, { partyName: searchValue });
        displayResults(results, true);
    });

    document.getElementById('searchByAddress').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleLocation').value;
        const results = performSearch(data.records, { propertyLocation: searchValue });
        displayResults(results, true);
    });

    document.getElementById('searchByPlot').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simplePlotNo').value.trim().toLowerCase();
        const results = data.records.filter(record => 
            record.serialNo.toLowerCase().includes(searchValue) ||
            record.plotNo.toLowerCase().includes(searchValue)
        );
        displayResults(results, true);
    });

    document.getElementById('searchByDeed').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleDeedNo').value.trim();
        const results = performSearch(data.records, { deedNo: searchValue });
        displayResults(results, true);
    });

    document.getElementById('searchDisputed').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleDisputed').value.trim().toLowerCase();
        const results = data.records.filter(record => 
            record.partyName.toLowerCase().includes(searchValue) ||
            record.propertyLocation.toLowerCase().includes(searchValue)
        );
        displayResults(results, true);
    });

    document.getElementById('searchRegistry').addEventListener('click', function(e) {
        e.preventDefault();
        const searchValue = document.getElementById('simpleRegistryOffice').value;
        const results = performSearch(data.records, { registrationOffice: searchValue });
        displayResults(results, true);
    });

    document.getElementById('generateReport').addEventListener('click', function(e) {
        e.preventDefault();
        const reportType = document.getElementById('reportType').value;
        if (reportType === 'Select report type') {
            alert('Please select a report type');
            return;
        }
        displayResults(data.records, true);
        alert(`Generating ${reportType} report...`);
    });
}

function setupEventListeners(data) {
    const searchForm = document.getElementById('searchForm');
    const resultsContainer = document.getElementById('searchResults');

    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitBtn = this.querySelector('[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
        submitBtn.disabled = true;
        
        const formData = {
            registrationOffice: document.getElementById('registrationOffice').value,
            dateFrom: document.getElementById('dateFrom').value,
            dateTo: document.getElementById('dateTo').value,
            areaFrom: document.getElementById('areaFrom').value,
            areaTo: document.getElementById('areaTo').value,
            propertyLocation: document.getElementById('propertyLocation').value,
            serialNo: document.getElementById('serialNo').value,
            khataNo: document.getElementById('khataNo').value,
            circle: document.getElementById('circle').value,
            deedNo: document.getElementById('deedNo').value,
            plotNo: document.getElementById('plotNo').value,
            mauja: document.getElementById('mauja').value,
            partyName: document.getElementById('partyName').value,
            landValueFrom: document.getElementById('landValueFrom').value,
            landValueTo: document.getElementById('landValueTo').value,
            fatherHusbandName: document.getElementById('fatherHusbandName').value,
            landType: document.getElementById('landType').value
        };

        setTimeout(() => {
            const results = performSearch(data.records, formData);
            displayResults(results, false);
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        }, 800);
    });
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

function displayResults(results, isSimpleSearch = false) {
    const resultsContainer = isSimpleSearch ? 
        document.getElementById('simpleSearchResults') : 
        document.getElementById('searchResults');
        
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
        return;
    }

    // Create results header
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

    // Attach export functionality (updated)
    resultsHeader.querySelector('.export-btn').addEventListener('click', () => exportToPDF(results));

    // Create table
    const table = document.createElement('table');
    table.className = 'results-table';

    // Table headers
    const headers = ['Deed No', 'Registration Date', 'Party Name', 'Property Location', 'Area', 'Land Value', 'Actions'];
    const fields = ['deedNo', 'registrationDate', 'partyName', 'propertyLocation', 'area', 'landValue'];

    // Create header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create body
    const tbody = document.createElement('tbody');
    results.forEach(record => {
        const row = document.createElement('tr');
        fields.forEach(field => {
            const td = document.createElement('td');
            td.textContent = field === 'landValue' ? formatCurrency(record[field]) : (record[field] || '');
            row.appendChild(td);
        });

        // Add "View More" button
        const actionTd = document.createElement('td');
        const viewMoreButton = document.createElement('button');
        viewMoreButton.className = 'action-btn';
        viewMoreButton.innerHTML = '<i class="fas fa-eye"></i> View More';
        viewMoreButton.addEventListener('click', () => showPropertyDetails(record));
        actionTd.appendChild(viewMoreButton);
        row.appendChild(actionTd);

        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    resultsContainer.appendChild(table);
    resultsContainer.style.display = 'block';
}

// Only clear the map when initMap is called (don't show by default)
function initMap(locations) {
    const mapContainer = document.getElementById('mapContainer');
    if (!mapContainer) return;

    // Clear any existing map content
    mapContainer.innerHTML = '';
}

// Show property details and initialize the map in the details panel
function showPropertyDetails(record) {
    const propertyDetailsContainer = document.getElementById('propertyDetails');
    const propertyDetailsContent = document.getElementById('propertyDetailsContent');
    
    // Format the land value with commas
    const formattedLandValue = formatCurrency(record.landValue);
    
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
            <span>${formattedLandValue}</span>
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
    
    // Initialize map for this property inside the details panel
    initPropertyMap(record.propertyLocation);
    
    // Show the details container
    propertyDetailsContainer.style.display = 'block';
    propertyDetailsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Update initPropertyMap to always use the property details panel map container
function initPropertyMap(location) {
    const propertyMapContainer = document.getElementById('propertyMap');
    propertyMapContainer.innerHTML = ''; // Clear previous content

    // Create coordinates display
    const coordinatesDiv = document.createElement('div');
    coordinatesDiv.className = 'map-coordinates';

    // Create map container
    const mapDiv = document.createElement('div');
    mapDiv.id = 'map';
    mapDiv.style.width = '100%';
    mapDiv.style.height = '300px';
    mapDiv.style.borderRadius = '0 0 8px 8px';

    // Create map link
    const mapLinkDiv = document.createElement('div');
    mapLinkDiv.className = 'map-link';

    // Coordinates for different locations
    const locationCoordinates = {
        "Location A": { lat: 28.6139, lng: 77.2090 },
        "Location B": { lat: 28.6129, lng: 77.2080 },
        "Location C": { lat: 28.6149, lng: 77.2100 },
        "Location D": { lat: 28.6159, lng: 77.2110 }
    };

    const coords = locationCoordinates[location] || { lat: 28.6139, lng: 77.2090 };

    coordinatesDiv.innerHTML = `<i class="fas fa-map-marker-alt"></i> Coordinates: ${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
    propertyMapContainer.appendChild(coordinatesDiv);
    propertyMapContainer.appendChild(mapDiv);

    mapLinkDiv.innerHTML = `
        <a href="https://www.google.com/maps?q=${coords.lat},${coords.lng}" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i> Open in Google Maps
        </a>
    `;
    propertyMapContainer.appendChild(mapLinkDiv);

    // Initialize Leaflet map
    const map = L.map('map').setView([coords.lat, coords.lng], 15);

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Add marker
    const marker = L.marker([coords.lat, coords.lng]).addTo(map)
        .bindPopup(`<b>${location}</b><br>Property Location`);

    // Add click event to open Google Maps
    map.on('click', function() {
        window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank');
    });
}

function setupLandGallery(images) {
    const scrollContainer = document.querySelector('.scroll-container');
    if (!scrollContainer || !images || images.length === 0) return;

    // Create two rows for continuous scrolling
    const row1 = document.createElement('div');
    row1.className = 'scroll-row';
    const row2 = document.createElement('div');
    row2.className = 'scroll-row scroll-right';

    // Duplicate images for seamless looping
    const allImages = [...images, ...images];

    allImages.forEach((img, index) => {
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.innerHTML = `
            <img src="${img.url}" alt="${img.title}">
            <div class="image-caption">${img.title}</div>
        `;
        if (index < images.length) {
            row1.appendChild(galleryItem);
        } else {
            row2.appendChild(galleryItem);
        }
    });

    scrollContainer.appendChild(row1);
    scrollContainer.appendChild(row2);
}

// Replace exportToJsonFile with exportToPDF
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

// Add this to the existing script.js file, replacing the current setupChatbot function

function setupChatbot() {
    const chatbotToggle = document.getElementById('chatbotToggle');
    const chatbotContainer = document.getElementById('chatbotContainer');
    const chatbotClose = document.getElementById('chatbotClose');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMic = document.getElementById('chatbotMic');
    const chatbotTitle = document.querySelector('.chatbot-title h3');
    const languageSelector = document.querySelector('.language-selector select');

    // Initialize with English
    let currentLanguage = languageSelector.value;
    
    // Update language when selector changes
    languageSelector.addEventListener('change', function() {
        currentLanguage = this.value;
        clearChat();
        sendWelcomeMessage();
    });

    // Send welcome message based on language
    function sendWelcomeMessage() {
        if (currentLanguage === 'hindi') {
            addMessage("नमस्ते! मैं आपका संपत्ति पंजीकरण सहायक हूँ। आज मैं आपकी किस प्रकार सहायता कर सकता हूँ?", 'bot', [
                "संपत्ति कैसे पंजीकृत करें?",
                "कौन से दस्तावेज़ आवश्यक हैं?",
                "संपत्ति की स्थिति कैसे जांचें?",
                "स्टाम्प ड्यूटी दरें क्या हैं?"
            ]);
            if (chatbotTitle) chatbotTitle.textContent = 'संपत्ति पंजीकरण सहायक';
            if (chatbotInput) chatbotInput.placeholder = 'संपत्ति पंजीकरण के बारे में पूछें...';
        } else {
            addMessage("Hello! I'm your Property Registration Assistant. How can I help you today?", 'bot', [
                "How to register a property?",
                "What documents are needed?",
                "How to check property status?",
                "What are the stamp duty rates?"
            ]);
            if (chatbotTitle) chatbotTitle.textContent = 'Property Registration Assistant';
            if (chatbotInput) chatbotInput.placeholder = 'Ask me about property registration...';
        }
    }

    // Clear chat and reset
    function clearChat() {
        chatbotMessages.innerHTML = '';
        if (chatbotInput) {
            chatbotInput.value = '';
            chatbotInput.disabled = false;
        }
        if (chatbotSend) chatbotSend.disabled = false;
        if (chatbotMic) {
            chatbotMic.disabled = false;
            chatbotMic.classList.remove('listening');
        }
    }

    // Toggle chatbot visibility
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
        document.querySelector('.notification-badge').style.display = 'none';
    });

    chatbotClose.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Send message function
    function sendMessage() {
        const message = chatbotInput.value.trim();
        if (message) {
            addMessage(message, 'user');
            chatbotInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'typing-indicator';
            typingIndicator.innerHTML = '<span></span><span></span><span></span>';
            chatbotMessages.appendChild(typingIndicator);
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
            
            // Simulate bot thinking and responding
            setTimeout(() => {
                typingIndicator.remove();
                const botResponse = getBotResponse(message, currentLanguage);
                addMessage(botResponse.text, 'bot', botResponse.quickReplies);
                
                // Show notification if chat is closed
                if (!chatbotContainer.classList.contains('active')) {
                    document.querySelector('.notification-badge').style.display = 'flex';
                }
            }, 1500);
        }
    }

    // Add message to chat
    function addMessage(text, sender, quickReplies = []) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${sender}`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        messageDiv.appendChild(contentDiv);
        
        if (quickReplies && quickReplies.length > 0 && sender === 'bot') {
            const repliesDiv = document.createElement('div');
            repliesDiv.className = 'quick-replies';
            
            quickReplies.forEach(reply => {
                const button = document.createElement('button');
                button.className = 'quick-reply';
                button.setAttribute('data-question', reply);
                button.textContent = reply;
                repliesDiv.appendChild(button);
            });
            
            messageDiv.appendChild(repliesDiv);
        }
        
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // Get appropriate bot response based on language
    function getBotResponse(message, language) {
        const lowerMessage = message.toLowerCase();
        let response = {};
        
        // Handle creator question first
        if (lowerMessage.includes('who created you') || lowerMessage.includes('who made you') || 
    lowerMessage.includes('who developed you') || lowerMessage.includes('किसने बनाया') || 
    lowerMessage.includes('तुम्हारे निर्माता कौन हैं') || lowerMessage.includes('तुम्हें किसने बनाया')) {
    response.text = language === 'hindi' ? 
        `मुझे सनी कुमार ने बनाया है, जो एक अनुभवी सॉफ्टवेयर इंजीनियर और वेब डेवलपर हैं। उन्हें जटिल प्रणालियों को डिजाइन करने और उपयोगकर्ता के अनुकूल इंटरफेस बनाने में 5+ वर्षों का अनुभव है।
        
        <a href="https://www.linkedin.com/in/sunny-kumar-mit/" target="_blank" class="creator-link">LinkedIn प्रोफाइल देखें <i class="fas fa-external-link-alt"></i></a>
        
        उनसे संपर्क करने के लिए आप ऊपर दिए गए लिंक पर क्लिक कर सकते हैं या sunny01srp@gmail.com पर ईमेल कर सकते हैं।` :
        `I was created by Sunny Kumar, an experienced software engineer and web developer with lots of expertise in designing complex systems and creating user-friendly interfaces.
        
        <a href="https://www.linkedin.com/in/sunny-kumar-mit/" target="_blank" class="creator-link">View LinkedIn profile <i class="fas fa-external-link-alt"></i></a>
        
        You can click the link above to connect with him or email at sunny01srp@gmail.com.`;
    return response;
}

        if (language === 'hindi') {
            // Hindi responses
            if (lowerMessage.includes('पंजीकृत') || lowerMessage.includes('पंजीकरण') || lowerMessage.includes('रजिस्टर')) {
                response.text = `भारत में संपत्ति पंजीकरण प्रक्रिया में ये प्रमुख चरण शामिल हैं:\n\n1. दस्तावेज़ तैयारी (2-7 दिन):\n   - बिक्री विलेख (स्टाम्प पेपर पर)\n   - संपत्ति दस्तावेज़ (टाइटल डीड, पिछले विलेख)\n   - पहचान प्रमाण (आधार, पैन कार्ड)\n   - पता प्रमाण (यूटिलिटी बिल)\n   - पासपोर्ट आकार के फोटो (2 प्रत्येक)\n\n2. शुल्क भुगतान:\n   - स्टाम्प ड्यूटी: संपत्ति मूल्य का 4-8% (राज्य अनुसार)\n   - पंजीकरण शुल्क: 1% (अधिकतम ₹30,000)\n\n3. उप-रजिस्ट्रार कार्यालय जाएँ:\n   - दोनों पक्षों को उपस्थित होना चाहिए\n   - बायोमेट्रिक सत्यापन (आधार फिंगरप्रिंट)\n   - 2 गवाहों की आवश्यकता\n\n4. पंजीकरण पूर्ण:\n   - दस्तावेज़ सत्यापित होने के बाद पंजीकृत\n   - पावती पर्ची प्राप्त करें\n   - पंजीकृत विलेख 7-15 दिनों में उपलब्ध\n\nअधिक जानकारी के लिए आप किस चरण के बारे में जानना चाहेंगे?`;
                response.quickReplies = ["स्टाम्प ड्यूटी दरें", "दस्तावेज़ चेकलिस्ट", "ऑनलाइन अपॉइंटमेंट"];
            } 
            else if (lowerMessage.includes('दस्तावेज़') || lowerMessage.includes('आवश्यक') || lowerMessage.includes('डॉक्यूमेंट')) {
                response.text = `संपत्ति पंजीकरण के लिए आवश्यक दस्तावेज़:\n\n1. बिक्री विलेख (उचित स्टाम्प पेपर पर, ₹100-₹500 के बीच)\n2. संपत्ति दस्तावेज़:\n   - टाइटल डीड (मूल स्वामित्व दस्तावेज़)\n   - पिछले 30 वर्षों के विलेखों की श्रृंखला\n   - एन्कम्ब्रेंस सर्टिफिकेट (रजिस्ट्रार कार्यालय से)\n   - संपत्ति कर रसीदें (अंतिम 3 वर्ष)\n3. पहचान प्रमाण:\n   - आधार कार्ड (अनिवार्य)\n   - पैन कार्ड (अनिवार्य)\n   - वोटर आईडी/पासपोर्ट/ड्राइविंग लाइसेंस\n4. पता प्रमाण:\n   - बिजली/पानी का बिल (अंतिम 3 महीने)\n   - आधार कार्ड (यदि पता अद्यतित है)\n5. अन्य:\n   - पासपोर्ट आकार के फोटो (2 प्रत्येक पक्ष के)\n   - सोसाइटी/डेवलपर से एनओसी (यदि अपार्टमेंट)\n   - निर्माण पूर्णता प्रमाणपत्र (नई संपत्ति के लिए)\n\nनोट: कुछ राज्यों में अतिरिक्त दस्तावेज़ आवश्यक हो सकते हैं।`;
                response.quickReplies = ["बिक्री विलेख प्रारूप", "एन्कम्ब्रेंस सर्टिफिकेट", "ऑनलाइन आवेदन"];
            }
            else if (lowerMessage.includes('स्थिति') || lowerMessage.includes('जांच') || lowerMessage.includes('स्टेटस')) {
                response.text = `आप अपनी संपत्ति पंजीकरण स्थिति निम्न तरीकों से जांच सकते हैं:\n\n1. ऑनलाइन पोर्टल:\n   - अपने राज्य के अधिकारिक पंजीकरण विभाग की वेबसाइट पर जाएँ\n   - 'पंजीकरण स्थिति' या 'Deed Status' अनुभाग ढूंढें\n   - विलेख संख्या (जैसे DN-2023-001) और पंजीकरण तिथि दर्ज करें\n\n2. मोबाइल ऐप:\n   - राज्य सरकार के 'e-Registration' ऐप का उपयोग करें\n   - लॉगिन करके अपने विलेख की स्थिति देखें\n\n3. एसएमएस सेवा:\n   - प्रारूप में एसएमएस भेजें: REG <विलेख संख्या>\n   - राज्य-विशिष्ट नंबर पर (उदा. महाराष्ट्र के लिए 567673)\n\n4. उप-रजिस्ट्रार कार्यालय:\n   - पंजीकरण पावती रसीद लेकर जाएँ\n   - विलेख संख्या और पार्टी नाम बताएँ\n\nस्थिति जांचने के लिए आप कौन सा तरीका पसंद करेंगे?`;
                response.quickReplies = ["ऑनलाइन लिंक", "एसएमएस नंबर", "कार्यालय स्थान"];
            }
            else if (lowerMessage.includes('शुल्क') || lowerMessage.includes('लागत') || lowerMessage.includes('स्टाम्प ड्यूटी')) {
                response.text = `संपत्ति पंजीकरण लागत में निम्न शामिल हैं:\n\n1. स्टाम्प ड्यूटी (राज्य अनुसार भिन्न):\n   - आवासीय संपत्ति: 4-8% संपत्ति मूल्य का\n   - वाणिज्यिक संपत्ति: 5-10% संपत्ति मूल्य का\n   - कुछ राज्यों में महिलाओं के लिए 1-2% छूट\n\n2. पंजीकरण शुल्क:\n   - सभी राज्यों में संपत्ति मूल्य का 1% (अधिकतम ₹30,000)\n\n3. अन्य संभावित शुल्क:\n   - वकील शुल्क: ₹5,000-₹15,000 (वैकल्पिक)\n   - दलाली: संपत्ति मूल्य का 1-2% (यदि दलाल शामिल)\n   - सोसाइटी स्थानांतरण शुल्क: ₹25,000-₹50,000 (अपार्टमेंट के लिए)\n\nउदाहरण: ₹50 लाख की आवासीय संपत्ति के लिए (दिल्ली में):\n- स्टाम्प ड्यूटी: 6% = ₹3 लाख\n- पंजीकरण: 1% = ₹50,000\n- कुल: ₹3.5 लाख (लगभग)\n\nक्या आप किसी विशेष राज्य के लिए सटीक दरें जानना चाहेंगे?`;
                response.quickReplies = ["महाराष्ट्र", "दिल्ली", "कर्नाटक", "तमिल नाडु"];
            }
            else if (lowerMessage.includes('समय') || lowerMessage.includes('अवधि') || lowerMessage.includes('कितना समय')) {
                response.text = `संपत्ति पंजीकरण प्रक्रिया में आमतौर पर लगने वाला समय:\n\n1. दस्तावेज़ तैयारी: 2-7 दिन\n   - सभी दस्तावेज़ एकत्र करने और सत्यापित करने में\n   - स्टाम्प पेपर पर विलेख तैयार करने में\n\n2. पंजीकरण अपॉइंटमेंट: 1-3 दिन\n   - ऑनलाइन स्लॉट बुक करने में\n   - कुछ राज्यों में समय-स्लॉट उपलब्धता पर निर्भर\n\n3. वास्तविक पंजीकरण: 1 दिन\n   - जब सभी पक्ष कार्यालय जाते हैं\n   - दस्तावेज़ जमा करने और बायोमेट्रिक सत्यापन में\n\n4. पंजीकृत दस्तावेज़ प्राप्त करना: 7-15 दिन\n   - पंजीकरण के बाद प्रसंस्करण समय\n   - कुछ राज्यों में ई-विलेख 3-5 दिन में उपलब्ध\n\nकुल अनुमानित समय: 1-3 सप्ताह\n\nप्रक्रिया को तेज करने के टिप्स:\n- पहले से सभी दस्तावेज़ तैयार रखें\n- ऑनलाइन अपॉइंटमेंट लें\n- सुबह जल्दी कार्यालय जाएँ`;
                response.quickReplies = ["ऑनलाइन अपॉइंटमेंट", "दस्तावेज़ चेकलिस्ट", "ई-विलेख"];
            }
            else if (lowerMessage.includes('मदद') || lowerMessage.includes('सहायता') || lowerMessage.includes('समस्या')) {
                response.text = `संपत्ति पंजीकरण में सहायता के लिए:\n\n1. केंद्रीय हेल्पलाइन:\n   - टोल-फ्री: 1800-123-4567 (सोम-शनि, सुबह 8 से रात 8 बजे तक)\n   - ईमेल: help@propertyregistration.gov.in\n\n2. राज्य हेल्प डेस्क:\n   - सभी उप-रजिस्ट्रार कार्यालयों में उपलब्ध\n   - सोम-शुक्र, सुबह 9:30 से शाम 5:30 तक\n\n3. ऑनलाइन सहायता:\n   - आधिकारिक पोर्टल पर लाइव चैट (10AM-6PM)\n   - व्हाट्सएप हेल्पलाइन: +91 9876543210\n\nसामान्य समस्याओं का समाधान:\n- दस्तावेज़ अस्वीकृत: सत्यापित करें कि सभी दस्तावेज़ अपडेटेड हैं\n- भुगतान समस्या: पंजीकरण कार्यालय में नकद भुगतान विकल्प उपलब्ध है\n- विलेख देरी: ईमेल करें statusquery@propertyregistration.gov.in पर\n\nआपको किस प्रकार की सहायता चाहिए?`;
                response.quickReplies = ["दस्तावेज़ अस्वीकृत", "भुगतान समस्या", "विलेख नहीं मिला"];
            }
            else {
                response.text = `मैं भारत में संपत्ति पंजीकरण संबंधी सभी प्रश्नों में आपकी सहायता कर सकता हूँ। आप मुझसे निम्न विषयों पर पूछ सकते हैं:\n\n• पंजीकरण प्रक्रिया के चरण\n• आवश्यक दस्तावेज़ों की पूरी सूची\n• स्टाम्प ड्यूटी और पंजीकरण शुल्क की गणना\n• अपने विलेख की स्थिति कैसे जांचें\n• सामान्य समस्याओं का समाधान\n• राज्य-विशिष्ट नियम और दरें\n\nयहां कुछ सामान्य प्रश्न हैं जो आप पूछ सकते हैं:`;
                response.quickReplies = ["संपत्ति कैसे पंजीकृत करें?", "कौन से दस्तावेज़ चाहिए?", "स्थिति कैसे जांचें?", "स्टाम्प ड्यूटी कितनी है?"];
            }
        } else {
            // English responses
            if (lowerMessage.includes('register') || lowerMessage.includes('registration')) {
                response.text = `The property registration process in India involves these key steps:\n\n1. Document Preparation (2-7 days):\n   - Sale deed (on stamp paper)\n   - Property documents (title deed, previous deeds)\n   - ID proof (Aadhaar, PAN card)\n   - Address proof (utility bills)\n   - Passport photos (2 each)\n\n2. Fee Payment:\n   - Stamp duty: 4-8% of property value (varies by state)\n   - Registration charges: 1% (max ₹30,000)\n\n3. Visit Sub-Registrar Office:\n   - Both parties must be present\n   - Biometric verification (Aadhaar fingerprint)\n   - Requires 2 witnesses\n\n4. Registration Completion:\n   - Documents verified and registered\n   - Receive acknowledgement slip\n   - Registered deed available in 7-15 days\n\nWhich step would you like more details about?`;
                response.quickReplies = ["Stamp duty rates", "Document checklist", "Online appointment"];
            } 
            else if (lowerMessage.includes('document') || lowerMessage.includes('required')) {
                response.text = `Essential documents for property registration:\n\n1. Sale Deed (on stamp paper, ₹100-₹500 value)\n2. Property Documents:\n   - Title deed (original ownership document)\n   - Chain of deeds for last 30 years\n   - Encumbrance certificate (from registrar office)\n   - Property tax receipts (last 3 years)\n3. Identity Proof:\n   - Aadhaar card (mandatory)\n   - PAN card (mandatory)\n   - Voter ID/Passport/Driving License\n4. Address Proof:\n   - Utility bills (last 3 months)\n   - Aadhaar card (if address updated)\n5. Others:\n   - Passport-size photos (2 of each party)\n   - NOC from society/developer (if apartment)\n   - Completion certificate (for new properties)\n\nNote: Some states may require additional documents.`;
                response.quickReplies = ["Sale deed format", "Encumbrance certificate", "Online application"];
            }
            else if (lowerMessage.includes('status') || lowerMessage.includes('check')) {
                response.text = `You can check your property registration status through:\n\n1. Online Portal:\n   - Visit your state's registration department website\n   - Look for 'Registration Status' or 'Deed Status' section\n   - Enter deed number (e.g. DN-2023-001) and registration date\n\n2. Mobile App:\n   - Use state government's 'e-Registration' app\n   - Login to view your deed status\n\n3. SMS Service:\n   - Send SMS in format: REG <Deed Number>\n   - To state-specific number (e.g. 567673 for Maharashtra)\n\n4. Sub-Registrar Office:\n   - Visit with registration acknowledgement receipt\n   - Provide deed number and party name\n\nWhich method would you prefer to check status?`;
                response.quickReplies = ["Online link", "SMS number", "Office location"];
            }
            else if (lowerMessage.includes('fee') || lowerMessage.includes('cost') || lowerMessage.includes('stamp duty')) {
                response.text = `Property registration costs include:\n\n1. Stamp Duty (varies by state):\n   - Residential property: 4-8% of property value\n   - Commercial property: 5-10% of property value\n   - Some states offer 1-2% discount for women\n\n2. Registration Charges:\n   - 1% of property value in all states (max ₹30,000)\n\n3. Other Possible Charges:\n   - Lawyer fees: ₹5,000-₹15,000 (optional)\n   - Brokerage: 1-2% of property value (if broker involved)\n   - Society transfer charges: ₹25,000-₹50,000 (for apartments)\n\nExample: For ₹50 lakh residential property (in Delhi):\n- Stamp duty: 6% = ₹3 lakh\n- Registration: 1% = ₹50,000\n- Total: ₹3.5 lakh (approx)\n\nWould you like exact rates for a specific state?`;
                response.quickReplies = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu"];
            }
            else if (lowerMessage.includes('time') || lowerMessage.includes('duration') || lowerMessage.includes('how long')) {
                response.text = `Typical time required for property registration:\n\n1. Document Preparation: 2-7 days\n   - Collecting and verifying all documents\n   - Preparing deed on stamp paper\n\n2. Registration Appointment: 1-3 days\n   - Booking online slot\n   - Depends on slot availability in some states\n\n3. Actual Registration: 1 day\n   - When all parties visit office\n   - Document submission and biometric verification\n\n4. Receiving Registered Document: 7-15 days\n   - Processing time after registration\n   - Some states provide e-deed in 3-5 days\n\nTotal estimated time: 1-3 weeks\n\nTips to speed up process:\n- Keep all documents ready in advance\n- Take online appointment\n- Visit office early in the morning`;
                response.quickReplies = ["Online appointment", "Document checklist", "e-Deed"];
            }
            else if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('problem')) {
                response.text = `For assistance with property registration:\n\n1. Central Helpline:\n   - Toll-free: 1800-123-4567 (Mon-Sat, 8AM-8PM)\n   - Email: help@propertyregistration.gov.in\n\n2. State Help Desks:\n   - Available at all sub-registrar offices\n   - Mon-Fri, 9:30 AM to 5:30 PM\n\n3. Online Support:\n   - Live chat on official portal (10AM-6PM)\n   - WhatsApp helpline: +91 9876543210\n\nCommon Issue Solutions:\n- Documents rejected: Verify all documents are updated\n- Payment issues: Cash payment option available at office\n- Deed delay: Email statusquery@propertyregistration.gov.in\n\nWhat kind of assistance do you need?`;
                response.quickReplies = ["Documents rejected", "Payment problem", "Deed not received"];
            }
            else {
                response.text = `I can assist with all property registration queries in India. You can ask me about:\n\n• Step-by-step registration process\n• Complete list of required documents\n• Stamp duty and registration fee calculation\n• How to check your deed status\n• Solutions to common problems\n• State-specific rules and rates\n\nHere are some common questions you might ask:`;
                response.quickReplies = ["How to register property?", "What documents are needed?", "How to check status?", "What is stamp duty?"];
            }
        }
        
        return response;
    }

    // Set up event listeners
    chatbotSend.addEventListener('click', sendMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('quick-reply')) {
            const question = e.target.getAttribute('data-question');
            chatbotInput.value = question;
            sendMessage();
        }
    });

    // Voice recognition setup
    if ('webkitSpeechRecognition' in window) {
        const recognition = new webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = currentLanguage === 'hindi' ? 'hi-IN' : 'en-IN';
        
        chatbotMic.addEventListener('click', function() {
            if (chatbotMic.classList.contains('listening')) {
                recognition.stop();
                chatbotMic.classList.remove('listening');
            } else {
                recognition.lang = currentLanguage === 'hindi' ? 'hi-IN' : 'en-IN';
                recognition.start();
                chatbotMic.classList.add('listening');
            }
        });
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatbotInput.value = transcript;
            chatbotMic.classList.remove('listening');
            sendMessage();
        };
        
        recognition.onerror = () => {
            chatbotMic.classList.remove('listening');
        };
    } else {
        chatbotMic.style.display = 'none';
    }

    // Send initial welcome message
    sendWelcomeMessage();
}