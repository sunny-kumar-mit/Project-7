document.addEventListener('DOMContentLoaded', function () {
    const languageSelector = document.querySelector('.language-selector select');
    const govTitle = document.getElementById('govTitleEn');
    const ministryTitle = document.getElementById('ministryTitleEn');

    function setLanguage(lang) {
        if (lang === 'hindi') {
            govTitle.textContent = 'भारत सरकार';
            ministryTitle.textContent = 'संपत्ति पंजीकरण मंत्रालय';
        } else {
            govTitle.textContent = 'Government of India';
            ministryTitle.textContent = 'Ministry of Property Registration';
        }
    }

    languageSelector.addEventListener('change', function () {
        setLanguage(this.value);
    });

    // Optional: Set initial language based on selector
    setLanguage(languageSelector.value);
});

document.addEventListener('DOMContentLoaded', function() {
    const languageSelector = document.querySelector('.language-selector select');
    
    languageSelector.addEventListener('change', function() {
        if (this.value === 'hindi') {
            translateToHindi();
        } else {
            translateToEnglish();
        }
    });

    // Check for saved language preference
    const savedLanguage = localStorage.getItem('languagePreference');
    if (savedLanguage === 'hindi') {
        languageSelector.value = 'hindi';
        translateToHindi();
    }
});

function translateToHindi() {
    localStorage.setItem('languagePreference', 'hindi');
    
    // Translate navigation
    document.querySelector('nav ul li:nth-child(1) a').innerHTML = '<i class="fas fa-home"></i> मुखपृष्ठ';
    document.querySelector('nav ul li:nth-child(2) a').innerHTML = '<i class="fas fa-sitemap"></i> संगठन';
    document.querySelector('nav ul li:nth-child(3) a').innerHTML = '<i class="fas fa-gavel"></i> अधिनियम/नियम';
    document.querySelector('nav ul li:nth-child(4) a').innerHTML = '<i class="fas fa-concierge-bell"></i> सेवाएं';
    document.querySelector('nav ul li:nth-child(5) a').innerHTML = '<i class="fas fa-chart-bar"></i> रिपोर्ट';
    document.querySelector('nav ul li:nth-child(6) a').innerHTML = '<i class="fas fa-search"></i> दस्तावेज़ खोज';
    document.querySelector('nav ul li:nth-child(7) a').innerHTML = '<i class="fas fa-info-circle"></i> हमारे बारे में';
    document.querySelector('nav ul li:nth-child(8) a').innerHTML = '<i class="fas fa-user-circle"></i> लॉगिन';

    // Translate search section
    document.querySelector('.search-header h1').innerHTML = '<i class="fas fa-search"></i> संपत्ति पंजीकरण विवरण';
    document.querySelector('.search-header p').textContent = 'हमारे व्यापक खोज उपकरणों के साथ संपत्ति पंजीकरण रिकॉर्ड खोजें';
    
    // Translate search toggles
    document.getElementById('simpleSearchToggle').textContent = 'सरल खोज';
    document.getElementById('advancedSearchToggle').textContent = 'उन्नत खोज';
    
    // Translate simple search cards
    const searchCards = document.querySelectorAll('.search-card');
    searchCards[0].querySelector('h3').innerHTML = '<i class="fas fa-user"></i> नाम से खोजें';
    searchCards[0].querySelector('p').textContent = 'मालिक के नाम या पार्टी के नाम से संपत्ति रिकॉर्ड खोजें';
    searchCards[0].querySelector('input').placeholder = 'मालिक/पार्टी का नाम दर्ज करें';
    searchCards[0].querySelector('button').textContent = 'खोजें';
    
    searchCards[1].querySelector('h3').innerHTML = '<i class="fas fa-map-marker-alt"></i> संपत्ति पते से खोजें';
    searchCards[1].querySelector('p').textContent = 'उनके भौतिक स्थान या पते से संपत्तियां ढूंढें';
    searchCards[1].querySelector('option').textContent = 'स्थान चुनें';
    searchCards[1].querySelector('button').textContent = 'खोजें';
    
    searchCards[2].querySelector('h3').innerHTML = '<i class="fas fa-bullseye"></i> विशिष्ट खोज';
    searchCards[2].querySelector('p').textContent = 'सर्वे नंबर, प्लॉट नंबर जैसे विशिष्ट पहचानकर्ताओं से खोजें';
    searchCards[2].querySelector('input').placeholder = 'प्लॉट नंबर दर्ज करें';
    searchCards[2].querySelector('button').textContent = 'खोजें';
    
    searchCards[3].querySelector('h3').innerHTML = '<i class="fas fa-file-contract"></i> दस्तावेज़ खोज';
    searchCards[3].querySelector('p').textContent = 'दस्तावेज़ नंबर से संपत्ति रिकॉर्ड खोजें';
    searchCards[3].querySelector('input').placeholder = 'दस्तावेज़ नंबर दर्ज करें';
    searchCards[3].querySelector('button').textContent = 'खोजें';
    
    searchCards[4].querySelector('h3').innerHTML = '<i class="fas fa-gavel"></i> विवादित संपत्ति';
    searchCards[4].querySelector('p').textContent = 'जांचें कि क्या किसी संपत्ति में कोई कानूनी विवाद या मुकदमा है';
    searchCards[4].querySelector('input').placeholder = 'संपत्ति विवरण दर्ज करें';
    searchCards[4].querySelector('button').textContent = 'खोजें';
    
    searchCards[5].querySelector('h3').innerHTML = '<i class="fas fa-building"></i> रजिस्ट्री कार्यालय खोजें';
    searchCards[5].querySelector('p').textContent = 'स्थान या अधिकार क्षेत्र द्वारा रजिस्ट्री कार्यालय ढूंढें';
    searchCards[5].querySelector('option').textContent = 'रजिस्ट्री कार्यालय चुनें';
    searchCards[5].querySelector('button').textContent = 'खोजें';
    
    searchCards[6].querySelector('h3').innerHTML = '<i class="fas fa-chart-bar"></i> रिपोर्ट';
    searchCards[6].querySelector('p').textContent = 'विभिन्न संपत्ति पंजीकरण रिपोर्ट और विश्लेषण तक पहुंचें';
    searchCards[6].querySelector('option:nth-child(1)').textContent = 'रिपोर्ट प्रकार चुनें';
    searchCards[6].querySelector('option:nth-child(2)').textContent = 'मासिक पंजीकरण';
    searchCards[6].querySelector('option:nth-child(3)').textContent = 'स्वामित्व सत्यापन';
    searchCards[6].querySelector('option:nth-child(4)').textContent = 'ऐतिहासिक रुझान';
    searchCards[6].querySelector('button').textContent = 'बनाएं';

    // Translate advanced search form
    document.querySelector('.form-group:nth-child(1) label').innerHTML = '<i class="fas fa-building"></i> पंजीकरण कार्यालय';
    document.querySelector('.form-group:nth-child(2) label').innerHTML = '<i class="far fa-calendar-alt"></i> तिथि सीमा';
    document.querySelector('.form-group:nth-child(3) label').innerHTML = '<i class="fas fa-ruler-combined"></i> क्षेत्र (दशमलव)';
    document.querySelector('.form-group:nth-child(4) label').innerHTML = '<i class="fas fa-map-marker-alt"></i> स्थान';
    document.querySelector('.form-group:nth-child(5) label').innerHTML = '<i class="fas fa-hashtag"></i> क्रम संख्या';
    document.querySelector('.form-group:nth-child(6) label').innerHTML = '<i class="fas fa-file-alt"></i> खाता संख्या';
    document.querySelector('.form-group:nth-child(7) label').innerHTML = '<i class="fas fa-globe-asia"></i> सर्किल';
    document.querySelector('.form-group:nth-child(8) label').innerHTML = '<i class="fas fa-file-contract"></i> दस्तावेज़ संख्या';
    document.querySelector('.form-group:nth-child(9) label').innerHTML = '<i class="fas fa-map-pin"></i> प्लॉट संख्या';
    document.querySelector('.form-group:nth-child(10) label').innerHTML = '<i class="fas fa-vector-square"></i> मौजा';
    document.querySelector('.form-group:nth-child(11) label').innerHTML = '<i class="fas fa-user-tie"></i> पार्टी का नाम';
    document.querySelector('.form-group:nth-child(12) label').innerHTML = '<i class="fas fa-rupee-sign"></i> भूमि मूल्य (₹)';
    document.querySelector('.form-group:nth-child(13) label').innerHTML = '<i class="fas fa-users"></i> पिता/पति का नाम';
    document.querySelector('.form-group:nth-child(14) label').innerHTML = '<i class="fas fa-tags"></i> भूमि प्रकार';

    // Translate form placeholders
    document.getElementById('serialNo').placeholder = 'क्रम संख्या दर्ज करें (जैसे-SN001)';
    document.getElementById('khataNo').placeholder = 'खाता संख्या दर्ज करें (जैसे-KH001)';
    document.getElementById('deedNo').placeholder = 'दस्तावेज़ संख्या दर्ज करें (जैसे-D001)';
    document.getElementById('plotNo').placeholder = 'प्लॉट संख्या दर्ज करें (जैसे-P001)';
    document.getElementById('partyName').placeholder = 'पार्टी का नाम दर्ज करें';
    document.getElementById('fatherHusbandName').placeholder = 'नाम दर्ज करें';

    // Translate form buttons
    document.querySelector('.search-btn').innerHTML = '<i class="fas fa-search"></i> रिकॉर्ड खोजें';
    document.querySelector('.reset-btn').innerHTML = '<i class="fas fa-undo"></i> फॉर्म रीसेट करें';

    // Translate tabs
    document.querySelector('.tab-btn[data-period="current"]').innerHTML = '<i class="fas fa-laptop"></i> ऑनलाइन पंजीकरण (2016-वर्तमान)';
    document.querySelector('.tab-btn[data-period="mid"]').innerHTML = '<i class="fas fa-desktop"></i> कंप्यूटरीकरण के बाद (2006-2015)';
    document.querySelector('.tab-btn[data-period="old"]').innerHTML = '<i class="fas fa-archive"></i> कंप्यूटरीकरण से पहले (2005 से पहले)';

    // Translate property gallery
    document.querySelector('.gallery-title').textContent = 'संपत्तियां एक्सप्लोर करें';

    // Translate footer
    document.querySelector('.footer-section:nth-child(1) h3').textContent = 'त्वरित लिंक';
    document.querySelectorAll('.footer-section:nth-child(1) li')[0].innerHTML = '<i class="fas fa-chevron-right"></i> मुखपृष्ठ';
    document.querySelectorAll('.footer-section:nth-child(1) li')[1].innerHTML = '<i class="fas fa-chevron-right"></i> सेवाएं';
    document.querySelectorAll('.footer-section:nth-child(1) li')[2].innerHTML = '<i class="fas fa-chevron-right"></i> डाउनलोड';
    document.querySelectorAll('.footer-section:nth-child(1) li')[3].innerHTML = '<i class="fas fa-chevron-right"></i> संपर्क करें';

    document.querySelector('.footer-section:nth-child(2) h3').textContent = 'सहायता और समर्थन';
    document.querySelectorAll('.footer-section:nth-child(2) li')[0].innerHTML = '<i class="fas fa-chevron-right"></i> सामान्य प्रश्न';
    document.querySelectorAll('.footer-section:nth-child(2) li')[1].innerHTML = '<i class="fas fa-chevron-right"></i> प्रतिक्रिया';
    document.querySelectorAll('.footer-section:nth-child(2) li')[2].innerHTML = '<i class="fas fa-chevron-right"></i> हेल्प डेस्क';
    document.querySelectorAll('.footer-section:nth-child(2) li')[3].innerHTML = '<i class="fas fa-chevron-right"></i> साइट मैप';

    document.querySelector('.footer-section:nth-child(3) h3').textContent = 'कानूनी';
    document.querySelectorAll('.footer-section:nth-child(3) li')[0].innerHTML = '<i class="fas fa-chevron-right"></i> नियम और शर्तें';
    document.querySelectorAll('.footer-section:nth-child(3) li')[1].innerHTML = '<i class="fas fa-chevron-right"></i> गोपनीयता नीति';
    document.querySelectorAll('.footer-section:nth-child(3) li')[2].innerHTML = '<i class="fas fa-chevron-right"></i> अस्वीकरण';

    document.querySelector('.footer-section:nth-child(4) h3').textContent = 'हमसे जुड़ें';
    document.querySelector('.newsletter input').placeholder = 'आपका ईमेल';
    document.querySelector('.newsletter button').innerHTML = '<i class="fas fa-paper-plane"></i> सब्सक्राइब करें';

    document.querySelector('.copyright p').textContent = '© 2025 भारत सरकार, संपत्ति पंजीकरण मंत्रालय। सर्वाधिकार सुरक्षित।';

    // Translate scrolling banner
    const scrollingTexts = document.querySelectorAll('.scrolling-text span');
    scrollingTexts[0].textContent = '🏛️ यह वेबसाइट भारत सरकार के संपत्ति पंजीकरण मंत्रालय का आधिकारिक पोर्टल है';
    scrollingTexts[1].textContent = '🔍 नागरिकों को संपत्ति पंजीकरण सेवाओं तक सुगम पहुंच प्रदान करने के लिए डिज़ाइन किया गया';
    scrollingTexts[2].textContent = '🖥️ कई खोज उपकरणों के साथ उपयोगकर्ता के अनुकूल इंटरफेस';
    scrollingTexts[3].textContent = '📌 सरल खोज | उन्नत खोज | नाम/पता/दस्तावेज़ संख्या से खोज';
    scrollingTexts[4].textContent = '⚖️ विवादित संपत्तियों की जांच करें और नजदीकी रजिस्ट्री कार्यालय ढूंढें';
    scrollingTexts[5].textContent = '📊 संपत्ति पंजीकरण रिपोर्ट, कानूनी संसाधन और सामान्य प्रश्नों तक पहुंचें';
    scrollingTexts[6].textContent = '🤖 मार्गदर्शन के लिए हमारे संपत्ति पंजीकरण सहायक के साथ बातचीत करें';
    scrollingTexts[7].textContent = '🌐 पहुंच योग्य सुविधाओं के साथ कई भाषाओं में उपलब्ध';
    scrollingTexts[8].textContent = '🔒 सुरक्षित, पारदर्शी और कुशल संपत्ति संबंधी सेवाएं';

    // Translate official portal message
    document.querySelector('.no-translate').textContent = 'यह वेबसाइट भारत सरकार का आधिकारिक पोर्टल है';

    // Setup Hindi chatbot
    setupHindiChatbot();
};

function translateToEnglish() {
    localStorage.setItem('languagePreference', 'english');
    location.reload(); // Reload to reset to original English content
}

function setupHindiChatbot() {
    // Disable chatbot in Hindi mode
    const chatbotInput = document.getElementById('chatbotInput');
    const chatbotSend = document.getElementById('chatbotSend');
    const chatbotMic = document.getElementById('chatbotMic');
    const chatbotMessages = document.getElementById('chatbotMessages');
    const chatbotTitle = document.querySelector('.chatbot-title h3');

    // Optional: Show a message that chatbot is not available in Hindi
    if (chatbotMessages) {
        chatbotMessages.innerHTML = `
            <div class="chatbot-message bot">
                <div class="message-content">
                    <p>चैटबॉट हिंदी में उपलब्ध नहीं है। कृपया अंग्रेज़ी भाषा का चयन करें।<br>Chatbot is not available in Hindi. Please select English language.</p>
                </div>
            </div>
        `;
    }
    if (chatbotTitle) chatbotTitle.textContent = 'संपत्ति पंजीकरण सहायक';

    // Disable input and buttons
    if (chatbotInput) {
        chatbotInput.value = '';
        chatbotInput.disabled = true;
        chatbotInput.placeholder = 'चैटबॉट हिंदी में उपलब्ध नहीं है';
    }
    if (chatbotSend) {
        chatbotSend.disabled = true;
    }
    if (chatbotMic) {
        chatbotMic.disabled = true;
        chatbotMic.classList.remove('listening');
    }
}