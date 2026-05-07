// Import Google Fonts pro zobrazení v aplikaci
const fontStyle = document.createElement('style');
fontStyle.innerHTML = "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Lato:wght@400;700&family=Montserrat:wght@400;500;700&family=Open+Sans:wght@400;500;700&family=Roboto+Condensed:wght@400;700&family=Roboto:wght@400;500;700&display=swap');";
document.head.appendChild(fontStyle);

const CUSTOM_FONTS_URLS = {
    "Inter-Regular": "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjZ-Ck-8.ttf",
    "Inter-Medium": "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjZ-Ck-8.ttf",
    "Inter-Bold": "https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYAZ9hjZ-Ck-8.ttf",
    "Roboto-Regular": "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbVmUiA_0lFQm.ttf",
    "Roboto-Medium": "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWub2bVmUiA_0lFQm.ttf",
    "Roboto-Bold": "https://fonts.gstatic.com/s/roboto/v51/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjalmUiA_0lFQm.ttf",
    "RobotoCondensed-Regular": "https://fonts.gstatic.com/s/robotocondensed/v31/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyWyosBO5XljK9SL.ttf",
    "RobotoCondensed-Bold": "https://fonts.gstatic.com/s/robotocondensed/v31/ieVo2ZhZI2eCN5jzbjEETS9weq8-_d6T_POl0fRJeyVVpcBO5XljK9SL.ttf",
    "Lato-Regular": "https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHjx4wWyWtFCc.ttf",
    "Lato-Bold": "https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh6UVSwiPHA3q5d0.ttf",
    "Montserrat-Regular": "https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Hw5aX9-obK4.ttf",
    "Montserrat-Medium": "https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Hw5aX9-obK4.ttf",
    "Montserrat-Bold": "https://fonts.gstatic.com/s/montserrat/v31/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCuM73w5aX9-obK4.ttf",
    "OpenSans-Regular": "https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0B4gaVcUx6EQ.ttf",
    "OpenSans-Medium": "https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjr0B4gaVcUx6EQ.ttf",
    "OpenSans-Bold": "https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1x4gaVcUx6EQ.ttf"
};

const fontCache = {};

function getCssFont(fontId) {
    if (fontCache[fontId]) {
        return `400 1em "${fontId}", sans-serif`;
    }
    if (fontId === 'Helvetica') return '400 1em Arial, sans-serif';
    if (fontId === 'TimesRoman') return '400 1em "Times New Roman", serif';
    if (fontId === 'Courier') return '400 1em "Courier New", monospace';
    
    // Rozparsování např. "Inter-Bold"
    const [family, weight] = fontId.split('-');
    let cssFamily = family;
    if (family === 'RobotoCondensed') cssFamily = '"Roboto Condensed"';
    if (family === 'OpenSans') cssFamily = '"Open Sans"';
    
    const cssWeight = weight === 'Bold' ? '700' : (weight === 'Medium' ? '500' : '400');
    return `${cssWeight} 1em "${cssFamily}", sans-serif`;
}

let pdfLibDoc = null;
let pageIds = [];
function generateId() { return Math.random().toString(36).substring(2, 9); }

let pdfDocInstance = null;
let currentPageNum = 1;
let totalPages = 1;
let currentPage = null;
let pdfTextContent = null; 
let blocks = [];
let currentScale = 1.0;
let pdfDimensions = { width: 0, height: 0 };

let currentMode = 'select';
let selectedBlockId = null;

// Tažení pro kreslení
let isDrawing = false;
let startX = 0;
let startY = 0;
let currentRect = null;

// Přesouvání bloků
let isDraggingBlock = false;
let dragElement = null;
let dragStartX = 0;
let dragStartY = 0;
let dragStartBlockX = 0;
let dragStartBlockY = 0;

// DOM Elementy
const uploadBtn = document.getElementById('pdf-upload');
const mergeBtn = document.getElementById('merge-upload');
const exportBtn = document.getElementById('export-btn');
const exportSvgBtn = document.getElementById('export-svg-btn');
const exportDocxBtn = document.getElementById('export-docx-btn');
const statusPanel = document.getElementById('status-panel');
const statusText = document.getElementById('status-text');
const emptyState = document.getElementById('empty-state');
const workspace = document.getElementById('workspace');
const canvas = document.getElementById('pdf-canvas');
const overlayContainer = document.getElementById('overlay-container');
const toolbar = document.getElementById('toolbar');
const pdfContainer = document.getElementById('pdf-container');
const propertiesPanel = document.getElementById('properties-panel');
const zoomControls = document.getElementById('zoom-controls');
const thumbnailsPanel = document.getElementById('thumbnails-panel');
const thumbnailsContainer = document.getElementById('thumbnails-container');

const pageControls = document.getElementById('page-controls');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageInfo = document.getElementById('page-info');

// Vlastnosti UI
const propFont = document.getElementById('prop-font');
const propSize = document.getElementById('prop-size');
const propColor = document.getElementById('prop-color');
const propBg = document.getElementById('prop-bg');
const propBgTrans = document.getElementById('prop-bg-transparent');
const propOffsetY = document.getElementById('prop-offset-y');
const propLocked = document.getElementById('prop-locked');
const nudgeUp = document.getElementById('nudge-up');
const nudgeDown = document.getElementById('nudge-down');
const deleteBlockBtn = document.getElementById('delete-block-btn');
const fontUpload = document.getElementById('font-upload');

function showStatus(text) {
    statusPanel.classList.remove('hidden');
    statusText.textContent = text;
}

function hideStatus() {
    statusPanel.classList.add('hidden');
}

// ---- UNDO STACK ----
let undoStack = [];
function saveState() {
    undoStack.push(JSON.stringify(blocks));
    if (undoStack.length > 50) undoStack.shift();
}

document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        e.preventDefault();
        if (undoStack.length > 0) {
            blocks = JSON.parse(undoStack.pop());
            renderOverlays();
            updatePropertiesPanel();
            showStatus('Krok zpět');
            setTimeout(hideStatus, 1000);
        } else {
            showStatus('Není co vrátit');
            setTimeout(hideStatus, 1000);
        }
    }
    
    // Mazání bloku pomocí klávesy Delete nebo Backspace
    if ((e.key === 'Delete' || e.key === 'Backspace') && selectedBlockId) {
        // Nemažeme, pokud uživatel píše do textového pole
        if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return;
        }
        e.preventDefault();
        saveState();
        blocks = blocks.filter(b => b.id !== selectedBlockId);
        selectBlock(null);
        renderOverlays();
    }
    
    // Kopírování bloku (Cmd+C)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && selectedBlockId && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        const block = blocks.find(b => b.id === selectedBlockId);
        if (block) {
            window.copiedBlock = JSON.parse(JSON.stringify(block));
            showStatus('Zkopírováno');
            setTimeout(hideStatus, 1000);
        }
    }
    
    // Vložení bloku (Cmd+V)
    if ((e.ctrlKey || e.metaKey) && e.key === 'v' && window.copiedBlock && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'INPUT') {
        saveState();
        const newBlock = JSON.parse(JSON.stringify(window.copiedBlock));
        newBlock.id = Date.now();
        // Vložíme na aktuální otevřenou stránku
        newBlock.pageId = pageIds[currentPageNum - 1]; 
        
        // Pokud vkládáme na stejnou stránku jako byla kopie, trochu to odsadíme, ať je to vidět
        if (newBlock.pageId === window.copiedBlock.pageId) {
            newBlock.x += 15;
            newBlock.y += 15;
        }
        
        blocks.push(newBlock);
        selectBlock(newBlock.id);
        renderOverlays();
        showStatus('Vloženo');
        setTimeout(hideStatus, 1000);
    }
});

// Inicializace OCR
let ocrWorker = null;
async function initOCR() {
    if (!ocrWorker) {
        showStatus('Příprava OCR engine...');
        ocrWorker = await Tesseract.createWorker();
        await ocrWorker.loadLanguage('ces+eng');
        await ocrWorker.initialize('ces+eng');
        hideStatus();
    }
}

function getCanvasCrop(xCanvas, yCanvas, wCanvas, hCanvas) {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = wCanvas;
    tempCanvas.height = hCanvas;
    const ctx = tempCanvas.getContext('2d');
    ctx.drawImage(canvas, xCanvas, yCanvas, wCanvas, hCanvas, 0, 0, wCanvas, hCanvas);
    return tempCanvas.toDataURL('image/png');
}

// Mapování nativního PDF písma na naše
function mapPdfFontToOurs(fontName) {
    fontName = (fontName || '').toLowerCase();
    if (fontName.includes('times')) return 'TimesRoman';
    if (fontName.includes('courier')) return 'Courier';
    if (fontName.includes('roboto')) return 'Roboto-Regular';
    if (fontName.includes('inter')) return 'Inter-Regular';
    if (fontName.includes('arial')) return 'OpenSans-Regular'; 
    if (fontName.includes('montserrat')) return 'Montserrat-Regular';
    if (fontName.includes('lato')) return 'Lato-Regular';
    if (fontName.includes('sans')) return 'OpenSans-Regular';
    return 'Helvetica'; 
}

function findNativeTextIntersection(xPDF, yPDF, wPDF, hPDF) {
    if (!pdfTextContent || !pdfTextContent.items) return null;
    
    const searchYBottom = pdfDimensions.height - (yPDF + hPDF);
    const searchYTop = pdfDimensions.height - yPDF;
    
    for (const item of pdfTextContent.items) {
        const itemX = item.transform[4];
        const itemY = item.transform[5];
        const itemSize = item.transform[0]; 
        const itemW = item.width;
        
        if (itemX < xPDF + wPDF && itemX + itemW > xPDF &&
            itemY < searchYTop && itemY + itemSize > searchYBottom) {
            return {
                text: item.str,
                size: Math.abs(itemSize),
                fontName: item.fontName
            };
        }
    }
    return null;
}

// ---- NÁSTROJOVÁ LIŠTA ----
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        currentMode = e.currentTarget.dataset.mode;
        pdfContainer.setAttribute('data-mode', currentMode);
        if (currentMode !== 'select') selectBlock(null); 
    });
});

document.getElementById('image-upload').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const dataUri = ev.target.result;
        const img = new Image();
        img.onload = () => {
            const pageId = pageIds[currentPageNum - 1];
            // Center the image initially
            let w = img.width * 0.5;
            let h = img.height * 0.5;
            if (w > pdfDimensions.width * 0.8) {
                const ratio = (pdfDimensions.width * 0.8) / w;
                w *= ratio;
                h *= ratio;
            }
            const x = (pdfDimensions.width - w) / 2;
            const y = (pdfDimensions.height - h) / 2;
            
            const newBlock = {
                id: Date.now(),
                pageId: pageId,
                x, y, w, h,
                type: 'image', text: '',
                dataUri: dataUri,
                color: '#000000', bgColor: 'transparent', offsetY: 0, font: 'Helvetica', size: 14
            };
            blocks.push(newBlock);
            document.querySelector('.tool-btn[data-mode="select"]').click();
            selectBlock(newBlock.id);
            renderOverlays();
        };
        img.src = dataUri;
    };
    reader.readAsDataURL(file);
});

// ---- ZOOM & STRÁNKOVÁNÍ ----
async function renderPDFPage() {
    if (!currentPage) return;
    const viewport = currentPage.getViewport({ scale: currentScale });
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    const unscaledViewport = currentPage.getViewport({ scale: 1.0 });
    pdfDimensions.width = unscaledViewport.width;
    pdfDimensions.height = unscaledViewport.height;
    
    await currentPage.render({ canvasContext: context, viewport: viewport }).promise;
    document.getElementById('zoom-level').textContent = `${Math.round(currentScale * 100)}%`;
    renderOverlays();
}

async function loadPage(pageNum) {
    if (!pdfDocInstance || pageNum < 1 || pageNum > totalPages) return;
    showStatus(`Načítám stranu ${pageNum}...`);
    currentPageNum = pageNum;
    currentPage = await pdfDocInstance.getPage(currentPageNum);
    pdfTextContent = await currentPage.getTextContent();
    
    if (pageNum === 1 && !window.hasFittedZoom) {
        const unscaledViewport = currentPage.getViewport({ scale: 1.0 });
        const workspaceRect = workspace.getBoundingClientRect();
        const availableHeight = workspaceRect.height - 40;
        const availableWidth = workspaceRect.width - 40;
        
        const scaleX = availableWidth / unscaledViewport.width;
        const scaleY = availableHeight / unscaledViewport.height;
        currentScale = Math.min(scaleX, scaleY);
        if (currentScale > 2.5) currentScale = 2.5; 
        if (currentScale < 0.1) currentScale = 0.5;
        window.hasFittedZoom = true;
    }
    
    await renderPDFPage();
    
    pageInfo.textContent = `Strana ${currentPageNum} z ${totalPages}`;
    prevPageBtn.disabled = currentPageNum === 1;
    nextPageBtn.disabled = currentPageNum === totalPages;
    
    // Highlight thumbnail
    document.querySelectorAll('.thumbnail-item').forEach(item => {
        item.classList.remove('active');
        if (parseInt(item.dataset.index) === currentPageNum) {
            item.classList.add('active');
            item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
    
    selectBlock(null);
    hideStatus();
}

prevPageBtn.addEventListener('click', () => loadPage(currentPageNum - 1));
nextPageBtn.addEventListener('click', () => loadPage(currentPageNum + 1));

document.getElementById('zoom-in').addEventListener('click', () => {
    if (currentScale >= 10.0) return;
    currentScale += (currentScale >= 2.0 ? 0.5 : 0.25);
    renderPDFPage();
});

document.getElementById('zoom-out').addEventListener('click', () => {
    if (currentScale <= 0.25) return;
    currentScale -= (currentScale > 2.0 ? 0.5 : 0.25);
    renderPDFPage();
});

// ---- PROPERTIES PANEL ----
function updatePropertiesPanel() {
    if (!selectedBlockId) {
        propertiesPanel.classList.add('disabled');
        deleteBlockBtn.style.display = 'none';
        document.getElementById('vectorize-options').style.display = 'none';
        [propFont, propSize, propColor, propBg, propBgTrans, propOffsetY, propLocked, nudgeUp, nudgeDown].forEach(el => el.disabled = true);
        return;
    }
    
    propertiesPanel.classList.remove('disabled');
    deleteBlockBtn.style.display = 'block';
    [propFont, propSize, propColor, propBg, propBgTrans, propOffsetY, propLocked, nudgeUp, nudgeDown].forEach(el => el.disabled = false);
    
    const block = blocks.find(b => b.id === selectedBlockId);
    if (block) {
        if (block.type === 'image') {
            document.getElementById('vectorize-options').style.display = 'block';
        } else {
            document.getElementById('vectorize-options').style.display = 'none';
        }
        
        if (block.type === 'image' || block.type === 'erase') {
            propFont.disabled = true;
            propSize.disabled = true;
            propColor.disabled = true;
            propOffsetY.disabled = true;
            nudgeUp.disabled = true;
            nudgeDown.disabled = true;
        } else {
            propFont.value = block.font;
            propSize.value = Math.round(block.size);
            propColor.value = block.color;
            propOffsetY.value = block.offsetY || 0;
        }
        
        if (block.bgColor === 'transparent') {
            propBgTrans.checked = true;
            propBg.disabled = true;
        } else {
            propBgTrans.checked = false;
            propBg.disabled = false;
            propBg.value = block.bgColor || '#ffffff';
        }
        
        propLocked.checked = !!block.locked;
    }
}

function getActiveBlock() {
    return blocks.find(b => b.id === selectedBlockId);
}

[propFont, propSize, propColor, propBg, propOffsetY].forEach(el => {
    el.addEventListener('change', () => {
        const block = getActiveBlock();
        if (block) {
            saveState();
            if (el === propFont) block.font = propFont.value;
            if (el === propSize) block.size = parseInt(propSize.value) || 14;
            if (el === propColor) block.color = propColor.value;
            if (el === propOffsetY) block.offsetY = parseInt(propOffsetY.value) || 0;
            if (el === propBg && !propBgTrans.checked) block.bgColor = propBg.value;
            renderOverlays();
        }
    });
});

propBgTrans.addEventListener('change', (e) => {
    propBg.disabled = e.target.checked;
    const block = getActiveBlock();
    if (block) {
        saveState();
        block.bgColor = e.target.checked ? 'transparent' : propBg.value;
        renderOverlays();
    }
});

propLocked.addEventListener('change', (e) => {
    const block = getActiveBlock();
    if (block) {
        saveState();
        block.locked = e.target.checked;
    }
});

nudgeUp.addEventListener('click', () => {
    const block = getActiveBlock();
    if (block) {
        saveState();
        block.offsetY = (block.offsetY || 0) - 1;
        propOffsetY.value = block.offsetY;
        renderOverlays();
    }
});

nudgeDown.addEventListener('click', () => {
    const block = getActiveBlock();
    if (block) {
        saveState();
        block.offsetY = (block.offsetY || 0) + 1;
        propOffsetY.value = block.offsetY;
        renderOverlays();
    }
});

deleteBlockBtn.addEventListener('click', () => {
    if (!selectedBlockId) return;
    saveState();
    blocks = blocks.filter(b => b.id !== selectedBlockId);
    selectBlock(null);
    renderOverlays();
});

document.getElementById('vectorize-btn').addEventListener('click', () => {
    const block = getActiveBlock();
    if (!block || block.type !== 'image' || !block.dataUri) return;
    
    if (typeof ImageTracer === 'undefined') {
        alert("Knihovna pro vektorizaci se ještě načítá nebo selhala.");
        return;
    }
    
    showStatus('Vektorizuji obrázek (může to chvíli trvat)...');
    
    const preset = document.getElementById('vectorize-preset').value;
    let options = {
        corsenabled: false,
        ltres: 1,
        qtres: 1,
        pathomit: 8,
        rightangleenhance: true,
        colorsampling: 2,
        numberofcolors: 16,
        mincolorratio: 0,
        colorquantcycles: 3,
        layering: 1,
        strokewidth: 0.5
    };
    
    if (preset === 'logo') {
        options = {
            corsenabled: false,
            ltres: 1,
            qtres: 1,
            pathomit: 8,
            rightangleenhance: true,
            colorsampling: 2,
            numberofcolors: 4,
            mincolorratio: 0.02,
            colorquantcycles: 3,
            blurradius: 1,
            blurdelta: 20,
            layering: 1,
            strokewidth: 0.5
        };
    } else if (preset === 'bw') {
        options = {
            corsenabled: false,
            ltres: 1,
            qtres: 1,
            pathomit: 8,
            rightangleenhance: true,
            colorsampling: 0,
            numberofcolors: 4,
            mincolorratio: 0.05,
            colorquantcycles: 3,
            blurradius: 1,
            blurdelta: 20,
            layering: 1,
            strokewidth: 0.5,
            pal: [{r:0,g:0,b:0,a:255}, {r:255,g:255,b:255,a:255}]
        };
    } else if (preset === 'detailed') {
        options = {
            corsenabled: false,
            ltres: 0.5,
            qtres: 0.5,
            pathomit: 0,
            rightangleenhance: false,
            colorsampling: 2,
            numberofcolors: 64,
            mincolorratio: 0,
            colorquantcycles: 3,
            blurradius: 0,
            blurdelta: 20,
            layering: 0,
            strokewidth: 0.5
        };
    }
    
    ImageTracer.imageToSVG(block.dataUri, function(svgstr) {
        // Odstraníme bílé (nebo velmi světlé) vrstvy z pozadí, aby byl výsledek průhledný
        // ImageTracer generuje path s fill="rgb(r,g,b)". Pokud je r,g,b > 240, odstraníme je.
        let processedSvg = svgstr.replace(/<path[^>]*fill="rgb\((24[0-9]|25[0-5]),(24[0-9]|25[0-5]),(24[0-9]|25[0-5])\)"[^>]*>/gi, '');
        
        const svgBase64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(processedSvg)));
        
        saveState();
        
        // Vytvoříme NOVÝ blok (vrstvu nad obrázkem) místo přepisu originálu!
        const newBlock = {
            id: Date.now(),
            pageId: block.pageId,
            x: block.x, y: block.y, w: block.w, h: block.h,
            type: 'image', text: '',
            dataUri: svgBase64,
            isVector: true,
            bgColor: 'transparent',
            locked: false
        };
        
        blocks.push(newBlock);
        selectBlock(newBlock.id);
        renderOverlays();
        hideStatus();
    }, options);
});

function selectBlock(id) {
    selectedBlockId = id;
    renderOverlays(); 
    updatePropertiesPanel();
}


// ---- RENDER BLOKŮ ----
function renderOverlays() {
    overlayContainer.innerHTML = '';
    const activePageId = pageIds[currentPageNum - 1];
    
    blocks.filter(b => b.pageId === activePageId).forEach(block => {
        const div = document.createElement('div');
        div.className = `${block.type === 'image' ? 'image-block' : 'text-block'} ${selectedBlockId === block.id ? 'selected' : ''}`;
        
        const scaledX = block.x * currentScale;
        const scaledY = block.y * currentScale;
        const scaledW = block.w * currentScale;
        const scaledH = block.h * currentScale;
        const scaledSize = block.size * currentScale;
        const scaledOffsetY = (block.offsetY || 0) * currentScale;
        
        div.style.left = `${scaledX}px`;
        div.style.top = `${scaledY}px`;
        div.style.width = `${scaledW}px`;
        div.style.height = `${scaledH}px`;
        
        if (block.bgColor !== 'transparent') div.style.backgroundColor = block.bgColor;
        if (block.type === 'form' && block.bgColor === 'transparent') {
            div.style.backgroundColor = 'rgba(191, 219, 254, 0.3)';
            div.style.border = '1px dashed #3b82f6';
        }
        
        // PŘESOUVÁNÍ BLOKŮ (Tlačítko pro přesun)
        if (selectedBlockId === block.id && currentMode === 'select') {
            const handle = document.createElement('div');
            handle.className = 'drag-handle';
            handle.innerHTML = '✋ Přesunout';
            handle.style.position = 'absolute';
            handle.style.top = '-24px';
            handle.style.left = '-2px';
            handle.style.background = 'var(--primary)';
            handle.style.color = 'white';
            handle.style.padding = '2px 8px';
            handle.style.fontSize = '12px';
            handle.style.cursor = 'grab';
            handle.style.borderRadius = '4px 4px 0 0';
            handle.style.pointerEvents = 'auto';
            handle.style.zIndex = '100';
            handle.style.userSelect = 'none';
            handle.style.boxShadow = '0 -2px 4px rgba(0,0,0,0.1)';
            
            handle.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault(); // Zabrání selekci textu v pozadí
                isDraggingBlock = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                dragStartBlockX = block.x;
                dragStartBlockY = block.y;
                dragElement = div;
            });
            div.appendChild(handle);
        }

        // SELEKCE BLOKU (při kliknutí na text)
        div.addEventListener('mousedown', (e) => {
            if (currentMode === 'select') {
                e.stopPropagation();
                if (selectedBlockId !== block.id) {
                    selectBlock(block.id);
                }
            }
        });

        if (block.type === 'image') {
            const img = document.createElement('img');
            img.src = block.dataUri;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.pointerEvents = 'none';
            div.appendChild(img);
        } else if (block.type !== 'erase') {
            const inputContainer = document.createElement('div');
            inputContainer.style.width = '100%';
            inputContainer.style.height = '100%';
            inputContainer.style.display = 'flex';
            inputContainer.style.transform = `translateY(${scaledOffsetY}px)`;
            
            const input = document.createElement(block.type === 'static' ? 'textarea' : 'input');
            input.className = 'text-input';
            input.value = block.text;
            
            input.style.font = getCssFont(block.font);
            input.style.fontSize = `${scaledSize}px`;
            input.style.color = block.color;
            
            if (block.type === 'form') input.placeholder = 'Vyplňovací pole...';
            
            input.addEventListener('change', (e) => {
                saveState();
                block.text = e.target.value;
            });
            input.addEventListener('focus', () => { 
                if (currentMode === 'select' && selectedBlockId !== block.id) {
                    selectBlock(block.id); 
                }
            });
            input.addEventListener('blur', (e) => {
                block.text = e.target.value;
                // Automatické smazání prázdného textového bloku (neplatí pro masky/formuláře)
                if (block.text.trim() === '' && block.type === 'static' && block.bgColor === 'transparent') {
                    saveState();
                    blocks = blocks.filter(b => b.id !== block.id);
                    if (selectedBlockId === block.id) selectBlock(null);
                    else renderOverlays();
                }
            });
            
            inputContainer.appendChild(input);
            div.appendChild(inputContainer);
        }
        
        // Přidání úchytky pro změnu velikosti (pro obrázky i texty)
        if (selectedBlockId === block.id && currentMode === 'select' && block.type !== 'erase') {
            const resizer = document.createElement('div');
            resizer.className = 'block-resizer';
            resizer.style.position = 'absolute';
            resizer.style.right = '-6px';
            resizer.style.bottom = '-6px';
            resizer.style.width = '12px';
            resizer.style.height = '12px';
            resizer.style.background = 'var(--primary)';
            resizer.style.border = '2px solid white';
            resizer.style.borderRadius = '50%';
            resizer.style.cursor = 'se-resize';
            resizer.style.zIndex = '101';
            resizer.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
            
            resizer.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                e.preventDefault();
                window.isResizingBlock = true;
                dragStartX = e.clientX;
                dragStartY = e.clientY;
                window.dragStartBlockW = block.w;
                window.dragStartBlockH = block.h;
                dragElement = div;
            });
            div.appendChild(resizer);
        }
        
        overlayContainer.appendChild(div);
    });
}

document.addEventListener('mousemove', (e) => {
    if (isDraggingBlock && selectedBlockId && currentMode === 'select' && dragElement) {
        const block = blocks.find(b => b.id === selectedBlockId);
        if (block) {
            const deltaX = (e.clientX - dragStartX) / currentScale;
            const deltaY = (e.clientY - dragStartY) / currentScale;
            block.x = dragStartBlockX + deltaX;
            block.y = dragStartBlockY + deltaY;
            
            dragElement.style.left = `${block.x * currentScale}px`;
            dragElement.style.top = `${block.y * currentScale}px`;
        }
    }
    
    if (window.isResizingBlock && selectedBlockId && currentMode === 'select' && dragElement) {
        const block = blocks.find(b => b.id === selectedBlockId);
        if (block) {
            const deltaX = (e.clientX - dragStartX) / currentScale;
            const deltaY = (e.clientY - dragStartY) / currentScale;
            
            let newW = Math.max(10, window.dragStartBlockW + deltaX);
            let newH = Math.max(10, window.dragStartBlockH + deltaY);
            
            if (e.shiftKey) {
                const ratio = window.dragStartBlockW / window.dragStartBlockH;
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    newH = newW / ratio;
                } else {
                    newW = newH * ratio;
                }
            }
            
            block.w = newW;
            block.h = newH;
            
            dragElement.style.width = `${block.w * currentScale}px`;
            dragElement.style.height = `${block.h * currentScale}px`;
        }
    }
});
document.addEventListener('mouseup', () => {
    if (isDraggingBlock || window.isResizingBlock) saveState();
    isDraggingBlock = false;
    window.isResizingBlock = false;
    dragElement = null;
});

// ---- KRESLENÍ NOVÝCH BLOKŮ ----
overlayContainer.addEventListener('mousedown', (e) => {
    if (currentMode === 'image') {
        document.getElementById('image-upload').click();
        return;
    }
    if (currentMode === 'select') {
        if (e.target === overlayContainer) {
            selectBlock(null);
        } else {
            return; 
        }
    }
    const rect = overlayContainer.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;
    
    currentRect = document.createElement('div');
    currentRect.className = 'drawing-rect';
    currentRect.style.left = `${startX}px`;
    currentRect.style.top = `${startY}px`;
    overlayContainer.appendChild(currentRect);
});

overlayContainer.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = overlayContainer.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const x = Math.min(startX, currentX);
    const y = Math.min(startY, currentY);
    const w = Math.abs(currentX - startX);
    const h = Math.abs(currentY - startY);
    
    currentRect.style.left = `${x}px`;
    currentRect.style.top = `${y}px`;
    currentRect.style.width = `${w}px`;
    currentRect.style.height = `${h}px`;
});

overlayContainer.addEventListener('mouseup', async (e) => {
    if (!isDrawing) return;
    isDrawing = false;
    currentRect.remove();
    
    const rect = overlayContainer.getBoundingClientRect();
    const endX = e.clientX - rect.left;
    const endY = e.clientY - rect.top;
    
    const xCanvas = Math.min(startX, endX);
    const yCanvas = Math.min(startY, endY);
    const wCanvas = Math.abs(endX - startX);
    const hCanvas = Math.abs(endY - startY);
    
    if (wCanvas < 10 || hCanvas < 10) return;
    
    const pdfX = xCanvas / currentScale;
    const pdfY = yCanvas / currentScale;
    const pdfW = wCanvas / currentScale;
    const pdfH = hCanvas / currentScale;
    
    const newBlock = {
        id: Date.now(),
        pageId: pageIds[currentPageNum - 1],
        x: pdfX, y: pdfY, w: pdfW, h: pdfH,
        type: 'static', text: '',
        font: 'OpenSans-Regular', size: Math.max(10, Math.floor(pdfH * 0.75)),
        color: '#000000', bgColor: '#ffffff', offsetY: 0,
        locked: false
    };
    const effectiveMode = (currentMode === 'select') ? 'ocr' : currentMode;
    if (effectiveMode === 'ocr') {
        if (ocrWorker) {
            showStatus('Rozpoznávám text (OCR)...');
            try {
                const cropUrl = getCanvasCrop(xCanvas, yCanvas, wCanvas, hCanvas);
                const { data } = await ocrWorker.recognize(cropUrl);
                newBlock.text = data.text.trim();
                
                // Přesnější odhad velikosti fontu podle nalezených řádků z OCR
                if (data.lines && data.lines.length > 0) {
                    const firstLine = data.lines[0];
                    const lineH_px = firstLine.bbox.y1 - firstLine.bbox.y0;
                    if (lineH_px > 5) {
                        newBlock.size = Math.floor((lineH_px / currentScale) * 0.75);
                    }
                }
                    
                // Rozdělení: Původní text překryjeme "maskou", která zůstane na místě
                const maskBlock = {
                    id: Date.now() + 1,
                    pageId: newBlock.pageId,
                    x: newBlock.x, y: newBlock.y, w: newBlock.w, h: newBlock.h,
                    type: 'erase', text: '',
                    bgColor: '#ffffff',
                    locked: false
                };
                blocks.push(maskBlock);
                    
                // Samotný rozpoznaný text bude mít průhledné pozadí
                newBlock.bgColor = 'transparent';
                    
            } catch (err) {
                console.error(err);
            }
            hideStatus();
        } else {
            alert("OCR se teprve načítá, zkuste to za okamžik.");
            return;
        }
    }
    
    if (effectiveMode === 'erase') {
        newBlock.type = 'erase';
        newBlock.bgColor = '#ffffff';
    } 
    else if (effectiveMode === 'form') {
        newBlock.type = 'form';
        newBlock.bgColor = 'transparent';
    }
    else if (effectiveMode === 'text') {
        newBlock.type = 'static';
        newBlock.bgColor = 'transparent'; 
    } else if (effectiveMode === 'crop') {
        const cropUrl = getCanvasCrop(xCanvas, yCanvas, wCanvas, hCanvas);
        newBlock.type = 'image';
        newBlock.dataUri = cropUrl;
        newBlock.bgColor = 'transparent';
    }
    // (OCR je již vyřešeno nahoře, takže ponecháme výchozí bgColor transparent, pokud už ho má)
    
    saveState();
    blocks.push(newBlock);
    document.querySelector('.tool-btn[data-mode="select"]').click();
    selectBlock(newBlock.id);
    
    setTimeout(() => {
        const textInputs = document.querySelectorAll('.text-block.selected .text-input');
        if (textInputs.length > 0) {
            textInputs[0].focus();
        }
    }, 50);
});

// ---- NAČÍTÁNÍ A SYNCHRONIZACE ----
async function loadFileAsPdfLibDoc(file) {
    if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        return await PDFLib.PDFDocument.load(arrayBuffer);
    } else if (file.type.startsWith('image/')) {
        const imgBytes = await file.arrayBuffer();
        const doc = await PDFLib.PDFDocument.create();
        let img;
        if (file.type === 'image/jpeg') img = await doc.embedJpg(imgBytes);
        else if (file.type === 'image/png') img = await doc.embedPng(imgBytes);
        
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
        return doc;
    }
    return null;
}

async function renderThumbnails() {
    thumbnailsContainer.innerHTML = '';
    for (let i = 1; i <= pdfDocInstance.numPages; i++) {
        const page = await pdfDocInstance.getPage(i);
        const viewport = page.getViewport({ scale: 0.2 });
        
        const item = document.createElement('div');
        item.className = `thumbnail-item ${i === currentPageNum ? 'active' : ''}`;
        item.dataset.index = i;
        item.dataset.pageId = pageIds[i - 1];
        
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page.render({ canvasContext: ctx, viewport }).promise;
        
        const label = document.createElement('div');
        label.className = 'thumbnail-label';
        label.textContent = i;
        
        item.appendChild(canvas);
        item.appendChild(label);
        
        item.addEventListener('click', () => loadPage(i));
        
        item.draggable = true;
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragover', handleDragOver);
        item.addEventListener('dragleave', handleDragLeave);
        item.addEventListener('drop', handleDrop);
        item.addEventListener('dragend', handleDragEnd);
        
        thumbnailsContainer.appendChild(item);
    }
}

let draggedThumbIndex = null;
function handleDragStart(e) {
    draggedThumbIndex = parseInt(e.currentTarget.dataset.index) - 1;
    e.currentTarget.classList.add('dragging');
}
function handleDragOver(e) {
    e.preventDefault();
    document.querySelectorAll('.thumbnail-item').forEach(item => {
        item.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (e.clientY < midY) {
        target.classList.add('drag-over-top');
    } else {
        target.classList.add('drag-over-bottom');
    }
}
function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
}
async function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over-top', 'drag-over-bottom');
    
    let targetIndex = parseInt(e.currentTarget.dataset.index) - 1;
    if (draggedThumbIndex === null) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (e.clientY > midY) targetIndex += 1;
    
    if (draggedThumbIndex === targetIndex || draggedThumbIndex === targetIndex - 1) return;
    
    showStatus('Přesouvám stranu...');
    
    const [draggedPageId] = pageIds.splice(draggedThumbIndex, 1);
    let insertIndex = targetIndex;
    if (draggedThumbIndex < targetIndex) insertIndex -= 1;
    pageIds.splice(insertIndex, 0, draggedPageId);
    
    const [movedPage] = await pdfLibDoc.copyPages(pdfLibDoc, [draggedThumbIndex]);
    pdfLibDoc.removePage(draggedThumbIndex);
    pdfLibDoc.insertPage(insertIndex, movedPage);
    
    await syncPdfJs(insertIndex + 1);
    hideStatus();
}
function handleDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.thumbnail-item').forEach(item => {
        item.classList.remove('drag-over-top', 'drag-over-bottom');
    });
    draggedThumbIndex = null;
}

async function syncPdfJs(pageToLoad = 1) {
    const pdfBytes = await pdfLibDoc.save();
    pdfDocInstance = await pdfjsLib.getDocument({ data: pdfBytes }).promise;
    totalPages = pdfDocInstance.numPages;
    if (totalPages > 1) pageControls.classList.remove('hidden');
    else pageControls.classList.add('hidden');
    
    await loadPage(pageToLoad <= totalPages ? pageToLoad : totalPages);
    await renderThumbnails();
}

uploadBtn.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    emptyState.classList.add('hidden');
    workspace.classList.remove('hidden');
    toolbar.classList.remove('hidden');
    zoomControls.classList.remove('hidden');
    thumbnailsPanel.classList.remove('hidden');
    exportBtn.style.display = 'inline-flex';
    exportSvgBtn.style.display = 'inline-flex';
    exportDocxBtn.style.display = 'inline-flex';
    
    showStatus('Načítám dokument...');
    try {
        pdfLibDoc = await loadFileAsPdfLibDoc(file);
        if (!pdfLibDoc) throw new Error("Nepodporovaný formát");
        
        pageIds = Array(pdfLibDoc.getPageCount()).fill(0).map(() => generateId());
        blocks = [];
        window.hasFittedZoom = false;
        
        await syncPdfJs(1);
        initOCR();
    } catch (error) {
        console.error(error);
        showStatus('Chyba při zpracování.');
        setTimeout(hideStatus, 3000);
    }
});

mergeBtn.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file || !pdfLibDoc) return;
    
    showStatus('Přidávám soubor...');
    try {
        const mergeDoc = await loadFileAsPdfLibDoc(file);
        const copiedPages = await pdfLibDoc.copyPages(mergeDoc, mergeDoc.getPageIndices());
        for (const p of copiedPages) {
            pdfLibDoc.addPage(p);
            pageIds.push(generateId());
        }
        await syncPdfJs(currentPageNum);
    } catch(err) {
        console.error(err);
        alert("Chyba při přidávání souboru.");
    }
    hideStatus();
});

// PAGE OPS
document.getElementById('page-dup-btn').addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    showStatus('Duplikuji stranu...');
    const index = currentPageNum - 1;
    const [dupPage] = await pdfLibDoc.copyPages(pdfLibDoc, [index]);
    pdfLibDoc.insertPage(index + 1, dupPage);
    
    const oldPageId = pageIds[index];
    const newPageId = generateId();
    pageIds.splice(index + 1, 0, newPageId);
    
    const blocksToDup = blocks.filter(b => b.pageId === oldPageId);
    blocksToDup.forEach(b => {
        blocks.push({ ...b, id: Date.now() + Math.random(), pageId: newPageId });
    });
    
    await syncPdfJs(currentPageNum + 1);
    hideStatus();
});

document.getElementById('page-up-btn').addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    const index = currentPageNum - 1;
    if (index > 0) {
        showStatus('Přesouvám...');
        const pId = pageIds.splice(index, 1)[0];
        pageIds.splice(index - 1, 0, pId);
        
        const [movedPage] = await pdfLibDoc.copyPages(pdfLibDoc, [index]);
        pdfLibDoc.removePage(index);
        pdfLibDoc.insertPage(index - 1, movedPage);
        
        await syncPdfJs(currentPageNum - 1);
        hideStatus();
    }
});

document.getElementById('page-down-btn').addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    const index = currentPageNum - 1;
    if (index < pageIds.length - 1) {
        showStatus('Přesouvám...');
        const pId = pageIds.splice(index, 1)[0];
        pageIds.splice(index + 1, 0, pId);
        
        const [movedPage] = await pdfLibDoc.copyPages(pdfLibDoc, [index]);
        pdfLibDoc.removePage(index);
        pdfLibDoc.insertPage(index + 1, movedPage);
        
        await syncPdfJs(currentPageNum + 1);
        hideStatus();
    }
});

document.getElementById('page-move-btn').addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    const targetVal = parseInt(document.getElementById('page-move-input').value);
    if (isNaN(targetVal) || targetVal < 1 || targetVal > pageIds.length) {
        alert("Neplatné číslo stránky.");
        return;
    }
    const index = currentPageNum - 1;
    let targetIndex = targetVal; 
    if (targetIndex > index) targetIndex -= 1;
    
    if (index === targetIndex) return;
    
    showStatus('Přesouvám...');
    const pId = pageIds.splice(index, 1)[0];
    pageIds.splice(targetIndex, 0, pId);
    
    const [movedPage] = await pdfLibDoc.copyPages(pdfLibDoc, [index]);
    pdfLibDoc.removePage(index);
    pdfLibDoc.insertPage(targetIndex, movedPage);
    
    await syncPdfJs(targetVal);
    hideStatus();
});

document.getElementById('page-rot-btn').addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    showStatus('Otáčím stranu...');
    const index = currentPageNum - 1;
    const page = pdfLibDoc.getPage(index);
    const rotation = page.getRotation();
    page.setRotation(PDFLib.degrees(rotation.angle + 90));
    await syncPdfJs(currentPageNum);
    hideStatus();
});

document.getElementById('page-del-btn').addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    if (pdfLibDoc.getPageCount() <= 1) {
        alert("Nelze smazat poslední stranu.");
        return;
    }
    showStatus('Mažu stranu...');
    const index = currentPageNum - 1;
    const delPageId = pageIds[index];
    
    pdfLibDoc.removePage(index);
    pageIds.splice(index, 1);
    
    blocks = blocks.filter(b => b.pageId !== delPageId);
    
    let nextLoad = currentPageNum;
    if (nextLoad > pageIds.length) nextLoad = pageIds.length;
    await syncPdfJs(nextLoad);
    hideStatus();
});


function hexToRgb(hex) {
    if (!hex) return null;
    hex = hex.replace('#', '');
    const bigint = parseInt(hex, 16);
    return {
        r: ((bigint >> 16) & 255) / 255,
        g: ((bigint >> 8) & 255) / 255,
        b: (bigint & 255) / 255
    };
}

fontUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    showStatus('Načítám font...');
    try {
        const buffer = await file.arrayBuffer();
        const fontName = file.name.replace(/\.[^/.]+$/, "");
        
        const fontFace = new FontFace(fontName, buffer);
        await fontFace.load();
        document.fonts.add(fontFace);
        
        fontCache[fontName] = buffer;
        
        const customGroup = document.getElementById('custom-fonts-group');
        const option = document.createElement('option');
        option.value = fontName;
        option.textContent = fontName;
        customGroup.appendChild(option);
        
        propFont.value = fontName;
        
        const block = getActiveBlock();
        if (block) {
            block.font = fontName;
            renderOverlays();
        }
    } catch(err) {
        console.error(err);
        alert("Chyba při načítání fontu.");
    }
    hideStatus();
});

// ---- EXPORT PDF ----
exportBtn.addEventListener('click', async () => {
    if (!pdfLibDoc) return;
    showStatus('Generuji PDF...');
    selectBlock(null); 
    
    try {
        // Znovu načteme master PDF bytes abychom neovlivnili pdfLibDoc stav
        const pdfBytesOrig = await pdfLibDoc.save();
        const exportDoc = await PDFLib.PDFDocument.load(pdfBytesOrig);
        exportDoc.registerFontkit(window.fontkit);
        const pages = exportDoc.getPages();
        
        const standardFontsMap = {
            'Helvetica': await exportDoc.embedFont(PDFLib.StandardFonts.Helvetica),
            'TimesRoman': await exportDoc.embedFont(PDFLib.StandardFonts.TimesRoman),
            'Courier': await exportDoc.embedFont(PDFLib.StandardFonts.Courier)
        };
        
        const usedFonts = new Set(blocks.map(b => b.font).filter(Boolean));
        const activeFontsMap = { ...standardFontsMap };
        
        for (const fontName of usedFonts) {
            if (CUSTOM_FONTS_URLS[fontName]) {
                if (!fontCache[fontName]) {
                    showStatus(`Stahuji písmo ${fontName}...`);
                    try {
                        const res = await fetch(CUSTOM_FONTS_URLS[fontName]);
                        if (!res.ok) throw new Error("Nelze stáhnout: " + res.status);
                        fontCache[fontName] = await res.arrayBuffer();
                    } catch (e) {
                        console.error(`Písmo ${fontName} nelze stáhnout.`, e);
                    }
                }
            }
            if (fontCache[fontName]) {
                try {
                    activeFontsMap[fontName] = await exportDoc.embedFont(fontCache[fontName]);
                } catch (e) {
                    console.error(`Chyba při vkládání písma ${fontName}`, e);
                }
            }
        }
        
        const form = exportDoc.getForm();

        for (const block of blocks) {
            const pIdx = pageIds.indexOf(block.pageId);
            if (pIdx === -1) continue;
            const targetPage = pages[pIdx];
            const pageHeight = targetPage.getHeight(); // in points
            
            const x = block.x;
            const y = pageHeight - (block.y + block.h);
            const w = block.w;
            const h = block.h;
            
            if (block.bgColor !== 'transparent') {
                const bgRgb = hexToRgb(block.bgColor);
                if (bgRgb) {
                    targetPage.drawRectangle({
                        x, y, width: w, height: h,
                        color: PDFLib.rgb(bgRgb.r, bgRgb.g, bgRgb.b)
                    });
                }
            }
            
            if (block.type === 'image' && block.dataUri) {
                let imgEmbed;
                if (block.dataUri.startsWith('data:image/jpeg')) {
                    imgEmbed = await exportDoc.embedJpg(block.dataUri);
                } else {
                    imgEmbed = await exportDoc.embedPng(block.dataUri);
                }
                targetPage.drawImage(imgEmbed, { x, y, width: w, height: h });
                continue;
            }
            
            const cRgb = hexToRgb(block.color) || {r:0, g:0, b:0};
            const activeFont = activeFontsMap[block.font] || activeFontsMap['Helvetica'];
            
            if (block.type === 'static' && block.text) {
                const lines = block.text.split('\n');
                lines.forEach((line, i) => {
                    const offsetYPDF = (block.offsetY || 0); 
                    targetPage.drawText(line, {
                        x: x + 2,
                        y: y + h - (block.size * 1.0) - (i * block.size * 1.2) - offsetYPDF,
                        size: block.size,
                        font: activeFont,
                        color: PDFLib.rgb(cRgb.r, cRgb.g, cRgb.b),
                    });
                });
            } 
            else if (block.type === 'form') {
                const fieldName = `field_${block.id}`;
                let textField;
                try {
                    textField = form.getTextField(fieldName);
                    if (!textField) textField = form.createTextField(fieldName);
                } catch {
                    textField = form.createTextField(fieldName);
                }
                if (block.text) textField.setText(block.text);
                
                textField.addToPage(targetPage, {
                    x, y, width: w, height: h,
                    font: activeFont,
                    textColor: PDFLib.rgb(cRgb.r, cRgb.g, cRgb.b),
                    borderWidth: 0,
                });
            }
        }
        
        showStatus('Ukládám PDF...');
        const pdfBytes = await exportDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pdf-extraktor-pro.pdf';
        a.click();
        URL.revokeObjectURL(url);
        
    } catch (error) {
        console.error(error);
        showStatus('Chyba při exportu.');
        setTimeout(hideStatus, 3000);
    }
    hideStatus();
});

// ---- EXPORT SVG ----
exportSvgBtn.addEventListener('click', async () => {
    if (!currentPage) return;
    showStatus('Generuji SVG...');
    try {
        const viewport = currentPage.getViewport({ scale: 1.0 });
        let svg = null;
        try {
            const opList = await currentPage.getOperatorList();
            if (!pdfjsLib.SVGGraphics) throw new Error("SVGGraphics not available");
            const svgGfx = new pdfjsLib.SVGGraphics(currentPage.commonObjs, currentPage.objs);
            svgGfx.embedFonts = true;
            svg = await svgGfx.getSVG(opList, viewport);
        } catch (e) {
            console.warn("SVGGraphics nedostupné, používám rastrové pozadí.", e);
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", viewport.width);
            svg.setAttribute("height", viewport.height);
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = viewport.width * 2;
            tempCanvas.height = viewport.height * 2;
            const ctx = tempCanvas.getContext('2d');
            await currentPage.render({ canvasContext: ctx, viewport: currentPage.getViewport({ scale: 2.0 }) }).promise;
            
            const imageEl = document.createElementNS("http://www.w3.org/2000/svg", "image");
            imageEl.setAttributeNS("http://www.w3.org/1999/xlink", "href", tempCanvas.toDataURL('image/jpeg', 0.85));
            imageEl.setAttribute("width", viewport.width);
            imageEl.setAttribute("height", viewport.height);
            svg.appendChild(imageEl);
        }
        
        const activePageId = pageIds[currentPageNum - 1];
        const pageBlocks = blocks.filter(b => b.pageId === activePageId);
        
        for (const block of pageBlocks) {
            if (block.type === 'image' && block.dataUri) {
                const imageEl = document.createElementNS("http://www.w3.org/2000/svg", "image");
                imageEl.setAttributeNS("http://www.w3.org/1999/xlink", "href", block.dataUri);
                imageEl.setAttribute("x", block.x);
                imageEl.setAttribute("y", block.y);
                imageEl.setAttribute("width", block.w);
                imageEl.setAttribute("height", block.h);
                svg.appendChild(imageEl);
            } 
            else if (block.type === 'erase' || block.bgColor !== 'transparent') {
                const rectEl = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rectEl.setAttribute("x", block.x);
                rectEl.setAttribute("y", block.y);
                rectEl.setAttribute("width", block.w);
                rectEl.setAttribute("height", block.h);
                rectEl.setAttribute("fill", block.bgColor !== 'transparent' ? block.bgColor : 'none');
                svg.appendChild(rectEl);
            }
            
            if ((block.type === 'static' || block.type === 'form') && block.text) {
                const lines = block.text.split('\n');
                lines.forEach((line, i) => {
                    const textEl = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    textEl.textContent = line;
                    
                    const cRgb = hexToRgb(block.color) || {r:0, g:0, b:0};
                    textEl.setAttribute("fill", `rgb(${Math.round(cRgb.r*255)},${Math.round(cRgb.g*255)},${Math.round(cRgb.b*255)})`);
                    
                    const cssFontFamily = getCssFont(block.font).replace(/^[0-9]+ 1em /, '').replace(/,.*$/, '').replace(/"/g, ''); 
                    textEl.setAttribute("font-family", cssFontFamily);
                    textEl.setAttribute("font-size", `${block.size}px`);
                    
                    textEl.setAttribute("x", block.x + 2);
                    textEl.setAttribute("y", block.y + block.size + (i * block.size * 1.2) + (block.offsetY || 0));
                    
                    svg.appendChild(textEl);
                });
            }
        }
        
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(svg);
        const blob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `page-${currentPageNum}.svg`;
        a.click();
        URL.revokeObjectURL(url);
    } catch(err) {
        console.error(err);
        alert("Chyba při exportu do SVG.");
    }
    hideStatus();
});

function twip(pt) { return Math.round(pt * 20); }

// ---- EXPORT DOCX ----
exportDocxBtn.addEventListener('click', async () => {
    if (!pdfLibDoc || typeof docx === 'undefined') {
        alert("Knihovna DOCX není načtena nebo chybí PDF dokument.");
        return;
    }
    showStatus('Generuji DOCX...');
    selectBlock(null);
    try {
        const docxPages = [];
        
        const originalPageNum = currentPageNum;
        for (let i = 1; i <= totalPages; i++) {
            const pageId = pageIds[i - 1];
            const pageBlocks = blocks.filter(b => b.pageId === pageId);
            
            const unlockedBlocks = pageBlocks.filter(b => !b.locked && b.type !== 'erase');
            
            await loadPage(i);
            const viewport = currentPage.getViewport({ scale: 2.0 }); 
            
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = viewport.width;
            tempCanvas.height = viewport.height;
            const ctx = tempCanvas.getContext('2d');
            await currentPage.render({ canvasContext: ctx, viewport }).promise;
            
            for (const b of pageBlocks) {
                if (b.type === 'erase' || b.locked || b.bgColor !== 'transparent') {
                    if (b.type === 'erase' || b.bgColor !== 'transparent') {
                        ctx.fillStyle = b.bgColor === 'transparent' ? '#ffffff' : b.bgColor;
                        ctx.fillRect(b.x * 2.0, b.y * 2.0, b.w * 2.0, b.h * 2.0);
                    }
                }
                if (b.type === 'image' && b.locked && b.dataUri) {
                    const img = new Image();
                    await new Promise(resolve => {
                        img.onload = () => {
                            ctx.drawImage(img, b.x * 2.0, b.y * 2.0, b.w * 2.0, b.h * 2.0);
                            resolve();
                        };
                        img.src = b.dataUri;
                    });
                }
                if ((b.type === 'static' || b.type === 'form') && b.locked && b.text) {
                    ctx.font = `${b.size * 2.0}px ${getCssFont(b.font).split(' ').pop().replace(/['"]/g, '')}`;
                    ctx.fillStyle = b.color;
                    ctx.textBaseline = 'top';
                    const lines = b.text.split('\n');
                    lines.forEach((line, idx) => {
                        ctx.fillText(line, b.x * 2.0, b.y * 2.0 + (idx * b.size * 2.0 * 1.2) + ((b.offsetY || 0) * 2.0));
                    });
                }
            }
            
            const imgData = tempCanvas.toDataURL('image/jpeg', 0.8);
            const ptW = viewport.width / 2.0;
            const ptH = viewport.height / 2.0;
            const orientation = ptW > ptH ? docx.PageOrientation.LANDSCAPE : docx.PageOrientation.PORTRAIT;
            
            const pxW = Math.round(ptW * (96 / 72));
            const pxH = Math.round(ptH * (96 / 72));
            
            const children = [];
            children.push(new docx.Paragraph({
                children: [
                    new docx.ImageRun({
                        data: Uint8Array.from(atob(imgData.split(',')[1]), c => c.charCodeAt(0)),
                        transformation: { width: pxW, height: pxH },
                        floating: {
                            horizontalPosition: { relative: docx.HorizontalPositionRelativeFrom.PAGE, offset: 0 },
                            verticalPosition: { relative: docx.VerticalPositionRelativeFrom.PAGE, offset: 0 },
                            wrap: { type: docx.TextWrappingType.NONE },
                            behindDocument: true
                        }
                    })
                ]
            }));
            
            for (const b of unlockedBlocks) {
                if (b.type === 'static' || b.type === 'form') {
                    const lines = b.text.split('\n');
                    const textRuns = lines.map((l, idx) => new docx.TextRun({
                        text: l,
                        size: b.size * 2,
                        color: (b.color || '#000000').replace('#', ''),
                        font: getCssFont(b.font).split(' ').pop().replace(/['"]/g, ''),
                        break: idx > 0 ? 1 : 0
                    }));
                    
                    children.push(new docx.Paragraph({
                        children: textRuns,
                        frame: {
                            position: { x: twip(b.x), y: twip(b.y + (b.offsetY || 0)) },
                            width: twip(b.w),
                            height: twip(b.h),
                            anchor: {
                                horizontal: docx.FrameAnchorType.PAGE,
                                vertical: docx.FrameAnchorType.PAGE
                            },
                            wrap: { type: docx.TextWrappingType.NONE }
                        }
                    }));
                }
            }
            
            docxPages.push({
                properties: {
                    page: {
                        size: { width: twip(ptW), height: twip(ptH), orientation },
                        margin: { top: 0, right: 0, bottom: 0, left: 0 }
                    }
                },
                children: children
            });
        }
        
        const doc = new docx.Document({ sections: docxPages });
        const blob = await docx.Packer.toBlob(doc);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'pdfpro-export.docx';
        a.click();
        URL.revokeObjectURL(url);
        
        await loadPage(originalPageNum);
        
    } catch (e) {
        console.error(e);
        alert("Chyba při exportu do DOCX.");
    }
    hideStatus();
});
