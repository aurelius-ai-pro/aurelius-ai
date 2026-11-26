"use strict";

const API_BASE = "http://localhost:8000";

/* ============================================================
   AVATAR PRESETS & ANIMATED FRAMES (STORED IN DATABASE)
   ============================================================ */

const AVATAR_PRESETS = {
    initial: null,
    astronaut: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="9" r="4"/><path d="M5 20a7 7 0 0 1 14 0"/><path d="M8 9h8"/></svg>`,
    scholar: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>`,
    spark: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>`,
    orbit: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(-30 12 12)"/><ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(30 12 12)"/></svg>`,
    code: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    crown: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 18h18l-1.5-10-4.5 4-3-6-3 6-4.5-4z"/></svg>`,
    phoenix: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3c2 4 6 5 6 10a6 6 0 0 1-12 0c0-5 4-6 6-10z"/><circle cx="12" cy="14" r="2"/></svg>`,
    ninja: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><path d="M5 10h14"/><path d="M5 14h14"/><circle cx="9.5" cy="12" r="1" fill="currentColor"/><circle cx="14.5" cy="12" r="1" fill="currentColor"/></svg>`,
    samurai: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 13a8 8 0 0 1 16 0"/><path d="M12 3l-2 4h4l-2-4z"/><path d="M6 13l-2 5h16l-2-5"/></svg>`,
    dragon: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l4 4-2 3 4 3-6 8-6-8 4-3-2-3 4-4z"/><circle cx="12" cy="11" r="1.2" fill="currentColor"/></svg>`,
    wolf: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4l3 5h8l3-5 1 9-8 7-8-7 1-9z"/><path d="M9 13l1.5 1M15 13l-1.5 1"/></svg>`,
    infinity: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z"/></svg>`,
    diamond: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3h12l4 6-10 12L2 9l4-6z"/><path d="M2 9h20"/></svg>`,
    saturn: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M3 16c2.5 2 15.5-4 18-8"/></svg>`,
    brain: `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9.5 4a3.5 3.5 0 0 0-3.5 3.5c0 .6.15 1.16.42 1.65A3.5 3.5 0 0 0 5 12.5c0 1.4.82 2.6 2 3.16V18a2 2 0 0 0 2 2h2V4H9.5z"/><path d="M14.5 4a3.5 3.5 0 0 1 3.5 3.5c0 .6-.15 1.16-.42 1.65A3.5 3.5 0 0 1 19 12.5c0 1.4-.82 2.6-2 3.16V18a2 2 0 0 1-2 2h-2V4h1.5z"/></svg>`
};

const AVATAR_FRAMES = [
    // Classic Frames (1-10)
    { key: "none", label: "None" },
    { key: "orbit", label: "Orbit" },
    { key: "gold", label: "Gold" },
    { key: "cyan", label: "Cyan" },
    { key: "violet", label: "Violet" },
    { key: "crimson", label: "Crimson" },
    { key: "emerald", label: "Emerald" },
    { key: "aurora", label: "Aurora" },
    { key: "quantum", label: "Quantum" },
    { key: "eclipse", label: "Eclipse" },
    // Mythic Frames (11-20)
    { key: "inferno", label: "Inferno" },
    { key: "lion", label: "Lion King" },
    { key: "dragonfire", label: "Dragon" },
    { key: "sovereign", label: "Crown" },
    { key: "phoenix", label: "Phoenix" },
    { key: "storm", label: "Storm" },
    { key: "supernova", label: "Nova" },
    { key: "mecha", label: "Mecha" },
    { key: "abyss", label: "Abyss" },
    { key: "celestial", label: "Celestial" },
    // God-Tier Animated Creatures & Legends (21-30)
    { key: "skydragon", label: "Sky Dragon" },
    { key: "prowllion", label: "Roar Lion" },
    { key: "pharaoh", label: "Pharaoh" },
    { key: "katana", label: "Katana" },
    { key: "shadowwolf", label: "Blood Wolf" },
    { key: "blackhole", label: "Black Hole" },
    { key: "valkyrie", label: "Valkyrie" },
    { key: "symbiote", label: "Symbiote" },
    { key: "galaxy", label: "Galaxy" },
    { key: "emperor", label: "Emperor" }
];

const FRAME_ORNAMENTS = {
    inferno: `
        <svg viewBox="0 0 100 100" fill="none">
            <path class="flame-tongue" d="M22 24 C16 10, 26 2, 30 14 C34 4, 42 8, 37 20 Z" fill="#ff6d00"/>
            <path class="flame-tongue t2" d="M50 14 C46 0, 56 -4, 58 8 C62 0, 68 6, 61 16 Z" fill="#ffab00"/>
            <path class="flame-tongue" d="M76 24 C82 10, 74 2, 69 14 C65 5, 58 9, 63 20 Z" fill="#ff3d00"/>
            <path class="flame-tongue t2" d="M12 52 C2 46, 2 38, 13 42 Z" fill="#ff6d00"/>
            <path class="flame-tongue" d="M88 52 C98 46, 98 38, 87 42 Z" fill="#ff6d00"/>
            <circle class="ember-dot" cx="28" cy="12" r="1.8" fill="#fff59d"/>
            <circle class="ember-dot" cx="72" cy="14" r="1.6" fill="#ffcc80"/>
            <circle class="ember-dot" cx="50" cy="6" r="2" fill="#ffffff"/>
        </svg>`,
    lion: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="lion-crest">
                <path d="M31 20 L25 9 L36 13 L43 4 L50 12 L57 4 L64 13 L75 9 L69 20 Z" fill="#f59e0b" stroke="#fef08a" stroke-width="1.4"/>
                <path d="M20 34 L12 28 L18 42 M80 34 L88 28 L82 42" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
                <circle class="lion-eye" cx="43" cy="14" r="1.6" fill="#ffffff"/>
                <circle class="lion-eye" cx="57" cy="14" r="1.6" fill="#ffffff"/>
            </g>
        </svg>`,
    dragonfire: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="dragon-horn">
                <path d="M26 22 C14 14, 12 4, 22 2 C20 9, 25 14, 33 17" stroke="#38bdf8" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M74 22 C86 14, 88 4, 78 2 C80 9, 75 14, 67 17" stroke="#e879f9" stroke-width="2.4" stroke-linecap="round"/>
                <path d="M45 12 L50 3 L55 12" stroke="#a855f7" stroke-width="2" stroke-linecap="round"/>
            </g>
        </svg>`,
    sovereign: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="crown-float">
                <path d="M33 18 L30 7 L41 13 L50 4 L59 13 L70 7 L67 18 Z" fill="#facc15" stroke="#ffffff" stroke-width="1.3"/>
                <circle cx="50" cy="12" r="1.7" fill="#38bdf8"/>
            </g>
        </svg>`,
    phoenix: `
        <svg viewBox="0 0 100 100" fill="none">
            <path class="wing-left" d="M18 62 C4 54, 2 38, 12 28 C10 38, 14 44, 20 46 C10 48, 10 56, 19 60" fill="#f97316" stroke="#fde047" stroke-width="1.2"/>
            <path class="wing-right" d="M82 62 C96 54, 98 38, 88 28 C90 38, 86 44, 80 46 C90 48, 90 56, 81 60" fill="#f97316" stroke="#fde047" stroke-width="1.2"/>
        </svg>`,
    storm: `
        <svg viewBox="0 0 100 100" fill="none">
            <polyline class="bolt-arc" points="22,12 15,24 23,25 16,37" stroke="#7dd3fc" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline class="bolt-arc" points="78,12 85,24 77,25 84,37" stroke="#38bdf8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            <polyline class="bolt-arc" points="47,4 52,11 48,12 53,18" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
    supernova: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="star-rays">
                <path d="M50 1 L52 10 L50 13 L48 10 Z" fill="#fef08a"/>
                <path d="M50 99 L52 90 L50 87 L48 90 Z" fill="#f43f5e"/>
                <path d="M1 50 L10 52 L13 50 L10 48 Z" fill="#38bdf8"/>
                <path d="M99 50 L90 52 L87 50 L90 48 Z" fill="#a855f7"/>
            </g>
        </svg>`,
    mecha: `
        <svg viewBox="0 0 100 100" fill="none">
            <circle class="hud-ring" cx="50" cy="50" r="46" stroke="#00f5d4" stroke-width="1.4" stroke-dasharray="14 8 4 8"/>
        </svg>`,
    abyss: `
        <svg viewBox="0 0 100 100" fill="none">
            <circle cx="20" cy="20" r="2.2" fill="#e879f9"/>
            <circle cx="82" cy="78" r="2.2" fill="#a855f7"/>
            <path d="M14 50 A36 36 0 0 1 50 14" stroke="#ec4899" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
    celestial: `
        <svg viewBox="0 0 100 100" fill="none">
            <ellipse class="halo-oval" cx="50" cy="8" rx="16" ry="3.5" stroke="#fef08a" stroke-width="2"/>
            <path d="M17 55 C5 48, 5 35, 16 30" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
            <path d="M83 55 C95 48, 95 35, 84 30" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
        </svg>`,
    skydragon: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="flying-dragon-body">
                <path class="dragon-wing-l" d="M48 14 C35 2, 20 4, 16 14 C25 13, 33 16, 42 18 Z" fill="#f97316" stroke="#fde047" stroke-width="1.1"/>
                <path class="dragon-wing-r" d="M54 14 C65 1, 78 3, 82 12 C73 12, 66 15, 58 17 Z" fill="#ea580c" stroke="#fde047" stroke-width="1.1"/>
                <path d="M31 18 Q41 13 52 14 L63 11 L67 13 L61 16 Q44 18 31 18 Z" fill="#dc2626" stroke="#fef08a" stroke-width="1"/>
                <circle cx="62" cy="12" r="1.1" fill="#ffffff"/>
                <path class="dragon-breath" d="M67 13 L84 8 L79 13 L86 16 L67 14 Z" fill="#ffab00"/>
            </g>
        </svg>`,
    prowllion: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="lion-walker">
                <path d="M35 15 Q28 9 31 5" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
                <line class="lion-leg-b" x1="40" y1="18" x2="37" y2="25" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
                <line class="lion-leg-b" x1="43" y1="18" x2="46" y2="25" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
                <line class="lion-leg-f" x1="58" y1="18" x2="55" y2="25" stroke="#d97706" stroke-width="2.2" stroke-linecap="round"/>
                <line class="lion-leg-f" x1="61" y1="18" x2="64" y2="25" stroke="#fbbf24" stroke-width="2.2" stroke-linecap="round"/>
                <rect x="37" y="12" width="23" height="7" rx="3.5" fill="#f59e0b"/>
                <circle cx="61" cy="12" r="5.5" fill="#b45309" stroke="#fde047" stroke-width="1.2"/>
                <path d="M64 9 L71 10 L65 12 Z" fill="#fbbf24"/>
                <path class="lion-jaw" d="M64 13 L70 15 L64 15 Z" fill="#f59e0b"/>
                <circle cx="63" cy="10" r="1" fill="#ffffff"/>
                <path class="roar-wave" d="M74 7 A6 6 0 0 1 74 16 M78 4 A10 10 0 0 1 78 19" stroke="#fef08a" stroke-width="1.5" stroke-linecap="round"/>
            </g>
        </svg>`,
    pharaoh: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="horus-sun">
                <circle cx="50" cy="10" r="5" fill="#f59e0b" stroke="#fef08a" stroke-width="1.4"/>
                <path d="M42 13 C39 6, 44 3, 45 10 M58 13 C61 6, 56 3, 55 10" stroke="#fde047" stroke-width="1.8" stroke-linecap="round"/>
            </g>
            <path d="M16 58 C4 50, 4 36, 17 32 C12 40, 14 48, 19 54" fill="#0284c7" stroke="#fde047" stroke-width="1.2"/>
            <path d="M84 58 C96 50, 96 36, 83 32 C88 40, 86 48, 81 54" fill="#0284c7" stroke="#fde047" stroke-width="1.2"/>
        </svg>`,
    katana: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="blade-slash">
                <line x1="16" y1="14" x2="84" y2="82" stroke="#e2e8f0" stroke-width="2.2" stroke-linecap="round"/>
                <line x1="84" y1="14" x2="16" y2="82" stroke="#f43f5e" stroke-width="2.2" stroke-linecap="round"/>
                <circle cx="22" cy="20" r="2.5" fill="#f43f5e"/>
                <circle cx="78" cy="20" r="2.5" fill="#ffffff"/>
            </g>
        </svg>`,
    shadowwolf: `
        <svg viewBox="0 0 100 100" fill="none">
            <circle class="blood-moon" cx="50" cy="10" r="6" fill="#dc2626" stroke="#fca5a5" stroke-width="1.2"/>
            <path d="M36 18 L39 8 L45 15 L50 13 L55 15 L61 8 L64 18" fill="#18181b" stroke="#ef4444" stroke-width="1.5" stroke-linejoin="round"/>
        </svg>`,
    blackhole: `
        <svg viewBox="0 0 100 100" fill="none">
            <ellipse class="accretion-disk" cx="50" cy="50" rx="48" ry="15" transform="rotate(-22 50 50)" stroke="#fb923c" stroke-width="2"/>
            <ellipse class="accretion-disk" cx="50" cy="50" rx="46" ry="12" transform="rotate(22 50 50)" stroke="#c084fc" stroke-width="1.5"/>
        </svg>`,
    valkyrie: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="valk-wings">
                <path d="M22 36 C8 24, 6 10, 20 8 C18 18, 22 24, 30 26" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.3"/>
                <path d="M78 36 C92 24, 94 10, 80 8 C82 18, 78 24, 70 26" fill="#e0f2fe" stroke="#38bdf8" stroke-width="1.3"/>
            </g>
        </svg>`,
    symbiote: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="tendril-wave">
                <path d="M20 22 Q10 12 18 4 M80 22 Q90 12 82 4 M16 74 Q6 82 14 92 M84 74 Q94 82 86 92" stroke="#10b981" stroke-width="2.4" stroke-linecap="round"/>
            </g>
        </svg>`,
    galaxy: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="orbiting-planet">
                <circle cx="50" cy="4" r="3.2" fill="#38bdf8" stroke="#ffffff" stroke-width="1"/>
                <circle cx="50" cy="96" r="2.6" fill="#f472b6"/>
            </g>
        </svg>`,
    emperor: `
        <svg viewBox="0 0 100 100" fill="none">
            <g class="emperor-crest">
                <path d="M30 18 L24 6 L37 12 L44 3 L50 11 L56 3 L63 12 L76 6 L70 18 Z" fill="#fde047" stroke="#ffffff" stroke-width="1.3"/>
                <path d="M16 58 C2 48, 2 32, 16 26 C12 36, 15 44, 21 50" fill="#ff6d00" stroke="#fde047" stroke-width="1.2"/>
                <path d="M84 58 C98 48, 98 32, 84 26 C88 36, 85 44, 79 50" fill="#ff6d00" stroke="#fde047" stroke-width="1.2"/>
                <circle cx="50" cy="12" r="2" fill="#38bdf8"/>
            </g>
        </svg>`
};

function parseAvatarValue(rawValue) {
    const str = String(rawValue || "initial|none");
    const pipeIdx = str.lastIndexOf("|");
    if (pipeIdx === -1) {
        return { avatarKey: str || "initial", frameKey: "none" };
    }
    return {
        avatarKey: str.slice(0, pipeIdx) || "initial",
        frameKey: str.slice(pipeIdx + 1) || "none"
    };
}

function encodeAvatarValue(avatarKey, frameKey) {
    return `${avatarKey || "initial"}|${frameKey || "none"}`;
}

function attachAvatarHoverPencil(el) {
    if (!el) return;
    const isEditableTarget =
        el.id === "profileAvatar" ||
        el.id === "popoverAvatar" ||
        el.id === "settingsAvatarLivePreview";

    if (!isEditableTarget) return;

    const badge = document.createElement("span");
    badge.className = "avatar-edit-hover-badge";
    badge.title = currentLanguage === "ar" ? "تعديل الصورة والأفاتار" : "Edit avatar & photo";
    badge.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

    badge.addEventListener("click", (e) => {
        e.stopPropagation();
        closeAccountPopover();
        if (el.id === "settingsAvatarLivePreview") {
            document.getElementById("avatarUploadInput")?.click();
        } else {
            openSettingsModal();
        }
    });

    el.appendChild(badge);
}

function renderAvatarElement(el, rawAvatarValue, fallbackName = "G") {
    if (!el) return;
    const { avatarKey, frameKey } = parseAvatarValue(rawAvatarValue);

    el.innerHTML = "";

    if (avatarKey && avatarKey.startsWith("custom:data:image/")) {
        const imgUrl = avatarKey.slice("custom:".length);
        const img = document.createElement("img");
        img.src = imgUrl;
        img.alt = fallbackName || "User Avatar";
        img.className = "avatar-custom-img";
        el.appendChild(img);
    } else if (avatarKey && avatarKey !== "initial" && AVATAR_PRESETS[avatarKey]) {
        el.innerHTML = AVATAR_PRESETS[avatarKey];
    } else {
        el.textContent = (fallbackName || "G").charAt(0).toUpperCase();
    }

    if (frameKey && frameKey !== "none") {
        el.setAttribute("data-avatar-frame", frameKey);
        if (FRAME_ORNAMENTS[frameKey]) {
            const ornament = document.createElement("span");
            ornament.className = "avatar-ornament-layer";
            ornament.setAttribute("aria-hidden", "true");
            ornament.innerHTML = FRAME_ORNAMENTS[frameKey];
            el.appendChild(ornament);
        }
    } else {
        el.removeAttribute("data-avatar-frame");
    }

    attachAvatarHoverPencil(el);
}


/* ============================================================
   IMAGE CROPPER MODAL ("Adjust your image")
   ============================================================ */

function openAvatarCropperModal(imageDataUrl) {
    let backdrop = document.getElementById("avatarCropperBackdrop");
    if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "avatarCropperBackdrop";
        backdrop.className = "cropper-backdrop";
        backdrop.innerHTML = `
            <div class="cropper-modal-card" role="dialog" aria-modal="true" aria-labelledby="cropperModalTitle">
                <div class="cropper-header">
                    <h3 id="cropperModalTitle">Adjust your image</h3>
                    <button type="button" class="cropper-close-btn" id="cropperCloseBtn" aria-label="Close">×</button>
                </div>

                <div class="cropper-stage-wrap" id="cropperStageWrap">
                    <img id="cropperSourceImg" class="cropper-source-img" alt="Crop preview" />
                    <div class="cropper-circle-mask"></div>
                </div>

                <div class="cropper-drag-hint" id="cropperDragHint">Drag image to reposition · Use slider to zoom</div>

                <div class="cropper-zoom-bar">
                    <button type="button" class="cropper-zoom-btn" id="cropperZoomOutBtn" aria-label="Zoom out">−</button>
                    <input type="range" id="cropperZoomSlider" class="cropper-zoom-slider" min="1" max="3" step="0.02" value="1" />
                    <button type="button" class="cropper-zoom-btn" id="cropperZoomInBtn" aria-label="Zoom in">+</button>
                </div>

                <div class="cropper-footer-actions">
                    <button type="button" class="secondary-btn" id="cropperCancelBtn">Cancel</button>
                    <button type="button" class="primary-btn" id="cropperSaveBtn">Save</button>
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
    }

    const titleEl = document.getElementById("cropperModalTitle");
    const hintEl = document.getElementById("cropperDragHint");
    const cancelBtn = document.getElementById("cropperCancelBtn");
    const saveBtn = document.getElementById("cropperSaveBtn");
    const closeBtn = document.getElementById("cropperCloseBtn");
    const stageWrap = document.getElementById("cropperStageWrap");
    const sourceImg = document.getElementById("cropperSourceImg");
    const zoomSlider = document.getElementById("cropperZoomSlider");
    const zoomOutBtn = document.getElementById("cropperZoomOutBtn");
    const zoomInBtn = document.getElementById("cropperZoomInBtn");

    titleEl.textContent = currentLanguage === "ar" ? "ضبط صورتك الشخصية" : "Adjust your image";
    hintEl.textContent = currentLanguage === "ar"
        ? "اسحب الصورة لتحريكها · استخدم الشريط للتقريب"
        : "Drag image to reposition · Use slider to zoom";
    cancelBtn.textContent = currentLanguage === "ar" ? "إلغاء" : "Cancel";
    saveBtn.textContent = currentLanguage === "ar" ? "حفظ" : "Save";

    const MASK_DIAMETER = 220;
    let baseScale = 1;
    let zoomFactor = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    function clampOffsets() {
        const totalScale = baseScale * zoomFactor;
        const scaledW = sourceImg.naturalWidth * totalScale;
        const scaledH = sourceImg.naturalHeight * totalScale;
        const maxOffsetX = Math.max(0, (scaledW - MASK_DIAMETER) / 2);
        const maxOffsetY = Math.max(0, (scaledH - MASK_DIAMETER) / 2);
        offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
        offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
    }

    function applyTransform() {
        clampOffsets();
        const totalScale = baseScale * zoomFactor;
        sourceImg.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${totalScale})`;
    }

    sourceImg.onload = () => {
        const minSide = Math.min(sourceImg.naturalWidth, sourceImg.naturalHeight);
        baseScale = MASK_DIAMETER / minSide;
        zoomFactor = 1;
        offsetX = 0;
        offsetY = 0;
        zoomSlider.value = "1";
        applyTransform();
    };

    sourceImg.src = imageDataUrl;
    backdrop.hidden = false;

    const closeCropper = () => {
        backdrop.hidden = true;
    };

    closeBtn.onclick = closeCropper;
    cancelBtn.onclick = closeCropper;

    zoomSlider.oninput = () => {
        zoomFactor = parseFloat(zoomSlider.value);
        applyTransform();
    };

    zoomOutBtn.onclick = () => {
        zoomFactor = Math.max(1, +(zoomFactor - 0.15).toFixed(2));
        zoomSlider.value = String(zoomFactor);
        applyTransform();
    };

    zoomInBtn.onclick = () => {
        zoomFactor = Math.min(3, +(zoomFactor + 0.15).toFixed(2));
        zoomSlider.value = String(zoomFactor);
        applyTransform();
    };

    stageWrap.onpointerdown = (e) => {
        isDragging = true;
        dragStartX = e.clientX - offsetX;
        dragStartY = e.clientY - offsetY;
        stageWrap.setPointerCapture(e.pointerId);
    };

    stageWrap.onpointermove = (e) => {
        if (!isDragging) return;
        offsetX = e.clientX - dragStartX;
        offsetY = e.clientY - dragStartY;
        applyTransform();
    };

    stageWrap.onpointerup = (e) => {
        isDragging = false;
        if (stageWrap.hasPointerCapture(e.pointerId)) {
            stageWrap.releasePointerCapture(e.pointerId);
        }
    };

    saveBtn.onclick = () => {
        const OUTPUT_SIZE = 256;
        const canvas = document.createElement("canvas");
        canvas.width = OUTPUT_SIZE;
        canvas.height = OUTPUT_SIZE;
        const ctx = canvas.getContext("2d");

        const totalScale = baseScale * zoomFactor;
        const ratio = OUTPUT_SIZE / MASK_DIAMETER;

        ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
        ctx.save();
        ctx.beginPath();
        ctx.arc(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, OUTPUT_SIZE / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const drawW = sourceImg.naturalWidth * totalScale * ratio;
        const drawH = sourceImg.naturalHeight * totalScale * ratio;
        const drawX = (OUTPUT_SIZE - drawW) / 2 + offsetX * ratio;
        const drawY = (OUTPUT_SIZE - drawH) / 2 + offsetY * ratio;

        ctx.drawImage(sourceImg, drawX, drawY, drawW, drawH);
        ctx.restore();

        const croppedDataUrl = canvas.toDataURL("image/webp", 0.86);
        selectedAvatarKey = `custom:${croppedDataUrl}`;
        renderAvatarPickerGrid();
        closeCropper();
        showToast(currentLanguage === "ar" ? "تم قص الصورة! اضغط حفظ الإعدادات لتأكيدها." : "Image cropped! Click Save settings to apply.");
    };
}


/* ============================================================
   AUTH & MULTI-ACCOUNT STORAGE
   ============================================================ */

const ACCESS_TOKEN_KEY = "aurelius_access_token";
const USER_KEY = "aurelius_user";
const SAVED_ACCOUNTS_KEY = "aurelius_saved_accounts";

function getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function setAccessToken(token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

function clearAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function getStoredUser() {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function setStoredUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearStoredUser() {
    localStorage.removeItem(USER_KEY);
}

function getSavedAccounts() {
    try {
        const raw = localStorage.getItem(SAVED_ACCOUNTS_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function saveAccountSession(user, token) {
    if (!user || !user.email || !token) return;
    const accounts = getSavedAccounts();
    const idx = accounts.findIndex(acc => acc.email.toLowerCase() === user.email.toLowerCase());
    const entry = {
        id: user.id,
        username: user.username,
        email: user.email,
        token,
        language: user.language || "en",
        theme: user.theme || "dark",
        background: user.background || "default",
        avatar: user.avatar || "initial|none",
        lastUsed: Date.now()
    };

    if (idx >= 0) accounts[idx] = entry;
    else accounts.unshift(entry);

    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(accounts));
}

function removeSavedAccount(email) {
    const filtered = getSavedAccounts().filter(
        acc => acc.email.toLowerCase() !== email.toLowerCase()
    );
    localStorage.setItem(SAVED_ACCOUNTS_KEY, JSON.stringify(filtered));
}

function clearAuth() {
    clearAccessToken();
    clearStoredUser();
}


/* ============================================================
   I18N (ENGLISH & ARABIC)
   ============================================================ */

const TRANSLATIONS = {
    en: {
        tagline: "INTELLIGENCE, REFINED",
        newConversation: "New conversation",
        yourLibrary: "YOUR LIBRARY",
        settings: "Settings",
        switchAccount: "Switch account",
        addAnotherAccount: "Add another account",
        signOut: "Sign out",
        workspace: "Personal Workspace",
        signIn: "Sign in",
        eyebrow: "A NEW PERSPECTIVE",
        welcomeHeading: "Where should we <span>begin?</span>",
        welcomeSubtitle: "Ask freely. Explore deeply. Make something remarkable.",
        sug1Title: "Explain a concept",
        sug1Sub: "Make the complex feel simple",
        sug2Title: "Plan a project",
        sug2Sub: "Turn an idea into clear steps",
        sug3Title: "Write something",
        sug3Sub: "Shape your thoughts with clarity",
        sug4Title: "Explore an idea",
        sug4Sub: "Discover a new point of view",
        composerHint: "Aurelius can make mistakes. Verify important information.",
        composerPlaceholder: "Message Aurelius…",
        composerThinking: "Aurelius is responding…",
        sparkDesc: "Instant answers · Low thinking",
        coreDesc: "Balanced study · Medium thinking",
        sageDesc: "Deep reasoning · High thinking",
        footerNote: "A space for clearer thinking",
        convNameLabel: "Conversation name",
        cancel: "Cancel",
        saveChanges: "Save changes",
        keepConv: "Keep conversation",
        deleteConv: "Delete conversation",
        avatarLabel: "Profile avatar",
        languageLabel: "Interface language",
        themeLabel: "Interface theme",
        bgLabel: "Conversation atmosphere",
        saveSettings: "Save settings",
        syncNote: "Settings, photo, avatar & frame are saved directly to your Aurelius database.",
        settingsKicker: "PREFERENCES & WORKSPACE",
        settingsTitle: "Settings",
        settingsDesc: "Upload your photo, choose an avatar, animated frame, language, and theme.",
        switchKicker: "ACCOUNT SWITCHER",
        switchTitle: "Switch account",
        switchDesc: "Select an account below or add a new Google, Facebook, or email account.",
        chooseAccount: "Choose",
        signOutKicker: "CONFIRMATION",
        signOutTitle: "Sign out",
        signOutDesc: "Are you sure you want to sign out of your Aurelius account?"
    },
    ar: {
        tagline: "ذكاءٌ مُتقَن",
        newConversation: "محادثة جديدة",
        yourLibrary: "مكتبتك",
        settings: "الإعدادات",
        switchAccount: "تبديل الحساب",
        addAnotherAccount: "إضافة حساب آخر",
        signOut: "تسجيل الخروج",
        workspace: "مساحة العمل الشخصية",
        signIn: "تسجيل الدخول",
        eyebrow: "منظور جديد",
        welcomeHeading: "من أين <span>نبدأ؟</span>",
        welcomeSubtitle: "اسأل بحرية. استكشف بعمق. اصنع شيئًا مميزًا.",
        sug1Title: "اشرح مفهومًا",
        sug1Sub: "بسّط الأفكار المعقدة بوضوح",
        sug2Title: "خطط لمشروع",
        sug2Sub: "حوّل فكرتك إلى خطوات واضحة",
        sug3Title: "اكتب نصًا",
        sug3Sub: "صُغ أفكارك بأسلوب احترافي",
        sug4Title: "استكشف فكرة",
        sug4Sub: "اكتشف زاوية جديدة للتفكير",
        composerHint: "قد يرتكب أوريليوس أخطاءً. تحقق من المعلومات المهمة.",
        composerPlaceholder: "اكتب رسالتك إلى أوريليوس…",
        composerThinking: "أوريليوس يكتب الرد…",
        sparkDesc: "إجابات فورية · تفكير سريع",
        coreDesc: "توازن دراسي · تفكير متوسط",
        sageDesc: "تحليل عميق · تفكير فائق",
        footerNote: "مساحة لتفكير أكثر وضوحًا",
        convNameLabel: "اسم المحادثة",
        cancel: "إلغاء",
        saveChanges: "حفظ التغييرات",
        keepConv: "الإبقاء على المحادثة",
        deleteConv: "حذف المحادثة",
        avatarLabel: "أفاتار الحساب",
        languageLabel: "لغة الواجهة",
        themeLabel: "مظهر الواجهة",
        bgLabel: "خلفية المحادثة",
        saveSettings: "حفظ الإعدادات",
        syncNote: "يتم حفظ الصورة والأفاتار والبرواز والإعدادات مباشرة في قاعدة البيانات الخاصة بحسابك.",
        settingsKicker: "التفضيلات ومساحة العمل",
        settingsTitle: "الإعدادات",
        settingsDesc: "ارفع صورتك الشخصية أو اختر أفاتار وبرواز متحرك ولغة ومظهر لحسابك.",
        switchKicker: "تبديل الحسابات",
        switchTitle: "اختر حسابًا",
        switchDesc: "اختر أحد الحسابات المسجلة أو أضف حساب Google أو Facebook أو بريد إلكتروني.",
        chooseAccount: "اختيار",
        signOutKicker: "تأكيد تسجيل الخروج",
        signOutTitle: "تسجيل الخروج",
        signOutDesc: "هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟"
    }
};

let currentLanguage = localStorage.getItem("aurelius_language") || "en";

function t(key) {
    return TRANSLATIONS[currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;
}

function applyLanguage(lang = "en") {
    currentLanguage = lang === "ar" ? "ar" : "en";
    localStorage.setItem("aurelius_language", currentLanguage);

    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.dataset.i18n;
        if (TRANSLATIONS[currentLanguage][key]) {
            el.textContent = TRANSLATIONS[currentLanguage][key];
        }
    });

    document.querySelectorAll("[data-i18n-html]").forEach(el => {
        const key = el.dataset.i18nHtml;
        if (TRANSLATIONS[currentLanguage][key]) {
            el.innerHTML = TRANSLATIONS[currentLanguage][key];
        }
    });

    if (messageInput && !isGenerating) {
        messageInput.placeholder = t("composerPlaceholder");
    }
}


/* ============================================================
   DOM REFERENCES
   ============================================================ */

const sidebar = document.getElementById("sidebar");
const openSidebarBtn = document.getElementById("openSidebarBtn");
const closeSidebarBtn = document.getElementById("closeSidebarBtn");
const sidebarScrim = document.getElementById("sidebarScrim");

const newChatBtn = document.getElementById("newChatBtn");
const history = document.getElementById("history");
const historyCount = document.getElementById("historyCount");

const profileMenuTrigger = document.getElementById("profileMenuTrigger");
const profileAvatar = document.getElementById("profileAvatar");
const profileName = document.querySelector(".profile-info strong");
const profileStatus = document.querySelector(".profile-info small");

const accountPopover = document.getElementById("accountPopover");
const closeAccountPopoverBtn = document.getElementById("closeAccountPopoverBtn");
const popoverAvatar = document.getElementById("popoverAvatar");
const popoverUsername = document.getElementById("popoverUsername");
const popoverEmail = document.getElementById("popoverEmail");

const openSettingsBtn = document.getElementById("openSettingsBtn");
const openSwitchAccountModalBtn = document.getElementById("openSwitchAccountModalBtn");
const popoverSignOutBtn = document.getElementById("popoverSignOutBtn");

const topbarChatTitle = document.getElementById("topbarChatTitle");
const loginBtn = document.getElementById("loginBtn");

const welcomeScreen = document.getElementById("welcomeScreen");
const messages = document.getElementById("messages");

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const sendBtn = chatForm?.querySelector(".send-btn");

const suggestionCards = document.querySelectorAll(".suggestion-card");

const modelPicker = document.getElementById("modelPicker");
const modelPickerBtn = document.getElementById("modelPickerBtn");
const modelPickerLabel = document.getElementById("modelPickerLabel");
const modelMenu = document.getElementById("modelMenu");
const modelOptions = document.querySelectorAll(".model-option");

const modalBackdrop = document.getElementById("modalBackdrop");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalSymbol = document.getElementById("modalSymbol");
const modalKicker = document.getElementById("modalKicker");
const modalTitle = document.getElementById("modalTitle");
const modalDescription = document.getElementById("modalDescription");

const renameForm = document.getElementById("renameForm");
const renameInput = document.getElementById("renameInput");
const renameCancelBtn = document.getElementById("renameCancelBtn");

const deleteActions = document.getElementById("deleteActions");
const deleteCancelBtn = document.getElementById("deleteCancelBtn");
const deleteConfirmBtn = document.getElementById("deleteConfirmBtn");

const signOutConfirmActions = document.getElementById("signOutConfirmActions");
const signOutCancelBtn = document.getElementById("signOutCancelBtn");
const signOutConfirmBtn = document.getElementById("signOutConfirmBtn");

const switchAccountControls = document.getElementById("switchAccountControls");
const switchAccountsScroll = document.getElementById("switchAccountsScroll");
const modalAddAccountBtn = document.getElementById("modalAddAccountBtn");
const switchCancelBtn = document.getElementById("switchCancelBtn");
const switchChooseBtn = document.getElementById("switchChooseBtn");

const appearanceControls = document.getElementById("appearanceControls");
const avatarPickerGrid = document.getElementById("avatarPickerGrid");
const languageSelect = document.getElementById("languageSelect");
const themeSelect = document.getElementById("themeSelect");
const backgroundSelect = document.getElementById("backgroundSelect");
const appearanceCloseBtn = document.getElementById("appearanceCloseBtn");
const appearanceSaveBtn = document.getElementById("appearanceSaveBtn");

const modalError = document.getElementById("modalError");
const toast = document.getElementById("toast");

const authBackdrop = document.getElementById("authBackdrop");
const authCloseBtn = document.getElementById("authCloseBtn");

const loginView = document.getElementById("loginView");
const registerView = document.getElementById("registerView");
const authTitle = document.getElementById("authTitle");
const authSubtitle = document.getElementById("authSubtitle");

const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const registerUsername = document.getElementById("registerUsername");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const showRegisterBtn = document.getElementById("showRegisterBtn");
const showLoginBtn = document.getElementById("showLoginBtn");
const authError = document.getElementById("authError");

const googleLoginBtn = document.getElementById("googleLoginBtn");
const facebookLoginBtn = document.getElementById("facebookLoginBtn");
const googleRegisterBtn = document.getElementById("googleRegisterBtn");
const facebookRegisterBtn = document.getElementById("facebookRegisterBtn");


/* ============================================================
   STATE
   ============================================================ */

let currentChatId = null;
let currentChatTitle = "Aurelius";
let currentChatHasMessages = false;
let isGenerating = false;
let currentAbortController = null;

let currentThinkingMode = localStorage.getItem("aurelius_thinking_mode") || "low";

let currentRenameChatId = null;
let currentDeleteChatId = null;
let selectedAvatarKey = "initial";
let selectedFrameKey = "none";
let selectedSwitchAccount = null;
let toastTimer = null;


/* ============================================================
   TOAST & UI HELPERS
   ============================================================ */

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function setGeneratingState(generating) {
    isGenerating = generating;
    if (sendBtn) {
        if (generating) {
            sendBtn.disabled = false;
            sendBtn.classList.add("stop-mode");
            sendBtn.setAttribute("aria-label", "Stop generating");
            sendBtn.title = currentLanguage === "ar" ? "إيقاف التوليد" : "Stop generating";
            sendBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>`;
        } else {
            sendBtn.classList.remove("stop-mode");
            sendBtn.setAttribute("aria-label", "Send message");
            sendBtn.title = currentLanguage === "ar" ? "إرسال" : "Send message";
            sendBtn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 19V5M6.5 10.5 12 5l5.5 5.5"/></svg>`;
            sendBtn.disabled = !messageInput?.value.trim();
        }
    }
    if (messageInput) {
        messageInput.placeholder = generating ? t("composerThinking") : t("composerPlaceholder");
    }
}

sendBtn?.addEventListener("click", (e) => {
    if (isGenerating && currentAbortController) {
        e.preventDefault();
        currentAbortController.abort();
    }
});

function setConversationView(showMessages) {
    if (welcomeScreen) welcomeScreen.hidden = showMessages;
    if (messages) {
        messages.hidden = !showMessages;
        if (!showMessages) messages.innerHTML = "";
    }
}

function updateTopbar(title = "Aurelius") {
    currentChatTitle = title || "Aurelius";
    const displayTitle = currentChatTitle === "New Chat" ? "New conversation" : currentChatTitle;

    if (topbarChatTitle) topbarChatTitle.textContent = displayTitle;

    if (currentChatTitle === "Aurelius" || currentChatTitle === "New conversation" || currentChatTitle === "New Chat") {
        document.title = "Aurelius AI · Learn & Master";
    } else {
        document.title = `${displayTitle} — Aurelius AI`;
    }
}


/* ============================================================
   API HELPER & CURRENT USER LOADER
   ============================================================ */

async function apiRequest(endpoint, options = {}) {
    const token = getAccessToken();
    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {})
    };
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    const data = await response.json().catch(() => ({}));

    if (response.status === 401) {
        clearAuth();
        updateLoginButton();
        openAuth("login");
        throw new Error(data.detail || "Session expired. Please sign in again.");
    }

    if (!response.ok) {
        throw new Error(data.detail || "Request failed");
    }

    return data;
}

function updateProfile(user) {
    if (!user) return;
    const name = user.username || user.email?.split("@")[0] || "User";
    const email = user.email || "";
    const avatarRaw = user.avatar || "initial|none";

    if (profileName) profileName.textContent = name;
    if (profileStatus) profileStatus.textContent = email;
    renderAvatarElement(profileAvatar, avatarRaw, name);

    if (popoverUsername) popoverUsername.textContent = name;
    if (popoverEmail) popoverEmail.textContent = email;
    renderAvatarElement(popoverAvatar, avatarRaw, name);
}

function updateLoginButton() {
    if (!loginBtn) return;
    const loggedIn = Boolean(getAccessToken());
    loginBtn.hidden = loggedIn;
}

async function loadCurrentUser() {
    const token = getAccessToken();
    if (!token) {
        openAuth("login");
        return;
    }

    try {
        const user = await apiRequest("/auth/me");
        setStoredUser(user);
        saveAccountSession(user, token);
        updateProfile(user);
        updateLoginButton();

        if (user.theme || user.background) {
            applyAppearance(user.theme || "dark", user.background || "default");
        }
        if (user.language) {
            applyLanguage(user.language);
        }

        if (authBackdrop) authBackdrop.hidden = true;
        await loadChats();
    } catch (error) {
        console.error("Failed to load user:", error);
        clearAuth();
        updateLoginButton();
        openAuth("login");
    }
}


/* ============================================================
   COMPACT ACCOUNT POPOVER
   ============================================================ */

function openAccountPopover() {
    if (!accountPopover) return;
    accountPopover.hidden = false;
    profileMenuTrigger?.setAttribute("aria-expanded", "true");
}

function closeAccountPopover() {
    if (!accountPopover) return;
    accountPopover.hidden = true;
    profileMenuTrigger?.setAttribute("aria-expanded", "false");
}

profileMenuTrigger?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!getAccessToken()) {
        openAuth("login");
        return;
    }
    if (accountPopover?.hidden) openAccountPopover();
    else closeAccountPopover();
});

closeAccountPopoverBtn?.addEventListener("click", closeAccountPopover);

document.addEventListener("click", (e) => {
    if (
        accountPopover &&
        !accountPopover.hidden &&
        !accountPopover.contains(e.target) &&
        !profileMenuTrigger?.contains(e.target)
    ) {
        closeAccountPopover();
    }
});


/* ============================================================
   SWITCH ACCOUNT CENTER MODAL
   ============================================================ */

function openSwitchAccountModal() {
    closeAccountPopover();
    clearModal();

    modalSymbol.textContent = "⇄";
    modalKicker.textContent = t("switchKicker");
    modalTitle.textContent = t("switchTitle");
    modalDescription.textContent = t("switchDesc");

    const accounts = getSavedAccounts();
    const activeUser = getStoredUser();
    selectedSwitchAccount = accounts.find(
        acc => activeUser && acc.email.toLowerCase() === activeUser.email.toLowerCase()
    ) || accounts[0] || null;

    renderSwitchAccountsModalList();

    if (switchAccountControls) switchAccountControls.hidden = false;
    openModal();
}

function renderSwitchAccountsModalList() {
    if (!switchAccountsScroll) return;
    const accounts = getSavedAccounts();
    const activeUser = getStoredUser();

    switchAccountsScroll.innerHTML = "";

    if (accounts.length === 0) {
        switchAccountsScroll.innerHTML = `<p class="empty-accounts-note">No saved accounts yet.</p>`;
        if (switchChooseBtn) switchChooseBtn.disabled = true;
        return;
    }

    if (switchChooseBtn) switchChooseBtn.disabled = false;

    accounts.forEach(acc => {
        const isCurrent = activeUser && acc.email.toLowerCase() === activeUser.email.toLowerCase();
        const isSelected = selectedSwitchAccount && acc.email.toLowerCase() === selectedSwitchAccount.email.toLowerCase();

        const item = document.createElement("div");
        item.className = `switch-modal-item ${isSelected ? "selected" : ""}`;

        const avatarDiv = document.createElement("div");
        avatarDiv.className = "saved-acc-avatar";
        renderAvatarElement(avatarDiv, acc.avatar || "initial|none", acc.username || acc.email);

        const infoDiv = document.createElement("div");
        infoDiv.className = "saved-acc-info";
        infoDiv.innerHTML = `
            <strong>${acc.username || "User"} ${isCurrent ? '<span class="active-pill">Active</span>' : ""}</strong>
            <small>${acc.email}</small>
        `;

        const rightControls = document.createElement("div");
        rightControls.className = "switch-item-right";

        const radioSpan = document.createElement("span");
        radioSpan.className = `switch-radio ${isSelected ? "checked" : ""}`;
        radioSpan.textContent = isSelected ? "✓" : "";

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-acc-btn";
        removeBtn.title = "Remove account";
        removeBtn.textContent = "×";
        removeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            removeSavedAccount(acc.email);
            const remaining = getSavedAccounts();
            if (selectedSwitchAccount?.email.toLowerCase() === acc.email.toLowerCase()) {
                selectedSwitchAccount = remaining[0] || null;
            }
            renderSwitchAccountsModalList();
        });

        rightControls.append(radioSpan, removeBtn);
        item.append(avatarDiv, infoDiv, rightControls);

        item.addEventListener("click", () => {
            selectedSwitchAccount = acc;
            renderSwitchAccountsModalList();
        });

        switchAccountsScroll.appendChild(item);
    });
}

async function confirmSwitchAccount() {
    if (!selectedSwitchAccount) return;
    const activeUser = getStoredUser();

    if (activeUser && selectedSwitchAccount.email.toLowerCase() === activeUser.email.toLowerCase()) {
        closeModal();
        return;
    }

    const account = selectedSwitchAccount;
    closeModal();

    currentChatId = null;
    currentChatHasMessages = false;
    localStorage.removeItem("aurelius_current_chat");
    setConversationView(false);
    updateTopbar("Aurelius");

    setAccessToken(account.token);
    setStoredUser(account);

    try {
        await loadCurrentUser();
        showToast(`Switched to ${account.email}`);
    } catch {
        removeSavedAccount(account.email);
        openAuth("login");
        if (loginEmail) loginEmail.value = account.email;
        loginPassword?.focus();
        showToast("Session expired. Please sign in again.");
    }
}

openSwitchAccountModalBtn?.addEventListener("click", openSwitchAccountModal);
switchCancelBtn?.addEventListener("click", closeModal);
switchChooseBtn?.addEventListener("click", confirmSwitchAccount);
modalAddAccountBtn?.addEventListener("click", () => {
    closeModal();
    openAuth("login", true);
});


/* ============================================================
   SIGN OUT CENTER CONFIRMATION MODAL
   ============================================================ */

function openSignOutConfirmModal() {
    closeAccountPopover();
    clearModal();

    modalSymbol.textContent = "↗";
    modalKicker.textContent = t("signOutKicker");
    modalTitle.textContent = t("signOutTitle");
    modalDescription.textContent = t("signOutDesc");

    if (signOutConfirmActions) signOutConfirmActions.hidden = false;
    openModal();
}

function executeSignOut() {
    closeModal();
    clearAuth();
    currentChatId = null;
    currentChatHasMessages = false;
    localStorage.removeItem("aurelius_current_chat");

    setConversationView(false);
    updateLoginButton();

    if (profileName) profileName.textContent = "Guest user";
    if (profileStatus) profileStatus.textContent = "Sign in to continue";
    renderAvatarElement(profileAvatar, "initial|none", "G");
    if (history) history.innerHTML = "";
    if (historyCount) historyCount.textContent = "0";
    updateTopbar("Aurelius");

    showToast("Signed out successfully.");
    openAuth("login");
}

popoverSignOutBtn?.addEventListener("click", openSignOutConfirmModal);
signOutCancelBtn?.addEventListener("click", closeModal);
signOutConfirmBtn?.addEventListener("click", executeSignOut);


/* ============================================================
   REAL GOOGLE & FACEBOOK OAUTH HANDLING
   ============================================================ */

function startGoogleOAuth() { window.location.href = `${API_BASE}/auth/google/login`; }
function startFacebookOAuth() { window.location.href = `${API_BASE}/auth/facebook/login`; }

googleLoginBtn?.addEventListener("click", startGoogleOAuth);
googleRegisterBtn?.addEventListener("click", startGoogleOAuth);
facebookLoginBtn?.addEventListener("click", startFacebookOAuth);
facebookRegisterBtn?.addEventListener("click", startFacebookOAuth);

function handleOAuthCallbackFromURL() {
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get("oauth_token");
    const oauthError = params.get("oauth_error");

    if (oauthToken || oauthError) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    if (oauthError) {
        openAuth("login");
        showAuthError(oauthError);
        return false;
    }

    if (oauthToken) {
        setAccessToken(oauthToken);
        return true;
    }

    return false;
}


/* ============================================================
   AUTH UI & REQUESTS
   ============================================================ */

function showAuthError(message) {
    if (!authError) return;
    authError.textContent = message;
    authError.classList.add("show");
    authError.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearAuthError() {
    if (!authError) return;
    authError.textContent = "";
    authError.classList.remove("show");
}

function ensureConfirmPasswordField() {
    if (!registerForm || document.getElementById("registerConfirmPassword")) return;
    const passField = registerPassword?.closest(".auth-field");
    if (!passField) return;

    const confirmDiv = document.createElement("div");
    confirmDiv.className = "auth-field";
    confirmDiv.innerHTML = `
        <label for="registerConfirmPassword">Confirm Password</label>
        <input id="registerConfirmPassword" type="password" placeholder="Re-enter your password" required />
    `;
    passField.insertAdjacentElement("afterend", confirmDiv);
}

function showLoginView() {
    clearAuthError();
    if (loginView) loginView.hidden = false;
    if (registerView) registerView.hidden = true;
    if (authTitle) authTitle.textContent = "Welcome back";
    if (authSubtitle) authSubtitle.textContent = "Sign in to continue to Aurelius";
}

function showRegisterView() {
    clearAuthError();
    ensureConfirmPasswordField();
    if (loginView) loginView.hidden = true;
    if (registerView) registerView.hidden = false;
    if (authTitle) authTitle.textContent = "Create your account";
    if (authSubtitle) authSubtitle.textContent = "Use your @gmail.com or @facebook.com email";
}

showRegisterBtn?.addEventListener("click", () => showRegisterView());
showLoginBtn?.addEventListener("click", () => showLoginView());
authCloseBtn?.addEventListener("click", closeAuth);
loginBtn?.addEventListener("click", () => openAuth("login"));

function openAuth(view = "login", allowCloseIfLoggedIn = false) {
    if (!authBackdrop) return;
    if (authCloseBtn) {
        authCloseBtn.hidden = !(allowCloseIfLoggedIn && getAccessToken());
    }
    if (view === "register") showRegisterView();
    else showLoginView();

    authBackdrop.hidden = false;
    setTimeout(() => {
        if (view === "register") registerUsername?.focus();
        else loginEmail?.focus();
    }, 50);
}

function closeAuth() {
    if (!authBackdrop || !getAccessToken()) return;
    authBackdrop.hidden = true;
}

function validateFrontendEmailAndPassword(email, password, confirmPassword) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/;
    const match = email.match(emailRegex);
    if (!match) {
        return "Invalid email format. Please complete your email (e.g. name@gmail.com).";
    }
    const domain = match[1].toLowerCase();
    if (domain !== "gmail.com" && domain !== "facebook.com") {
        return `Domain '@${domain}' is not allowed. Please use @gmail.com or @facebook.com.`;
    }
    if (password !== confirmPassword) {
        return "Passwords do not match.";
    }
    if (password.length < 6) {
        return "This password is weak. Minimum 6 characters required (avoid 123456 or 111111).";
    }
    if (new Set(password).size <= 2) {
        return "This password is weak. Avoid repeated digits like '111111'; mix letters and numbers.";
    }
    const seq = "01234567890 09876543210 abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba";
    if (seq.includes(password.toLowerCase())) {
        return "This password is weak. Avoid sequential characters like '123456'; use letters, numbers, and symbols.";
    }
    return null;
}

function openLoginOtpModal(email) {
    let otpOverlay = document.getElementById("loginOtpOverlay");
    if (!otpOverlay) {
        otpOverlay = document.createElement("div");
        otpOverlay.id = "loginOtpOverlay";
        otpOverlay.className = "otp-mini-backdrop";
        otpOverlay.innerHTML = `
            <div class="otp-mini-card" role="dialog" aria-modal="true">
                <button type="button" class="otp-mini-close" id="otpMiniCloseBtn" aria-label="Close">×</button>
                <div class="otp-mini-icon">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8">
                        <rect x="3" y="5" width="18" height="14" rx="2.5"/>
                        <polyline points="3 7 12 13 21 7"/>
                    </svg>
                </div>
                <h3>Verify Your Identity</h3>
                <p id="otpMiniSubtitle">Enter the 6-digit code sent to your email</p>
                <div class="otp-boxes-row" id="otpBoxesRow">
                    <input type="text" inputmode="numeric" maxlength="1" class="otp-digit-box" />
                    <input type="text" inputmode="numeric" maxlength="1" class="otp-digit-box" />
                    <input type="text" inputmode="numeric" maxlength="1" class="otp-digit-box" />
                    <input type="text" inputmode="numeric" maxlength="1" class="otp-digit-box" />
                    <input type="text" inputmode="numeric" maxlength="1" class="otp-digit-box" />
                    <input type="text" inputmode="numeric" maxlength="1" class="otp-digit-box" />
                </div>
                <div class="otp-mini-error" id="otpMiniError"></div>
                <button type="button" class="auth-submit" id="otpMiniVerifyBtn">Verify &amp; Enter Aurelius</button>
            </div>
        `;
        document.body.appendChild(otpOverlay);
    }

    const subtitleEl = document.getElementById("otpMiniSubtitle");
    const errorEl = document.getElementById("otpMiniError");
    const verifyBtn = document.getElementById("otpMiniVerifyBtn");
    const closeBtn = document.getElementById("otpMiniCloseBtn");
    const boxes = Array.from(otpOverlay.querySelectorAll(".otp-digit-box"));

    subtitleEl.innerHTML = `We sent a 6-digit code to <strong>${email}</strong>`;
    errorEl.textContent = "";
    boxes.forEach(b => { b.value = ""; });
    otpOverlay.hidden = false;

    setTimeout(() => boxes[0]?.focus(), 50);

    boxes.forEach((box, idx) => {
        box.oninput = (e) => {
            const val = e.target.value.replace(/\D/g, "");
            box.value = val.slice(0, 1);
            if (val && idx < boxes.length - 1) boxes[idx + 1].focus();
            if (boxes.every(b => b.value.length === 1)) verifyBtn.click();
        };

        box.onkeydown = (e) => {
            if (e.key === "Backspace" && !box.value && idx > 0) boxes[idx - 1].focus();
        };

        box.onpaste = (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData?.getData("text") || "").replace(/\D/g, "").slice(0, 6);
            pasted.split("").forEach((ch, i) => { if (boxes[i]) boxes[i].value = ch; });
            const nextIdx = Math.min(pasted.length, boxes.length - 1);
            boxes[nextIdx]?.focus();
            if (pasted.length === 6) verifyBtn.click();
        };
    });

    closeBtn.onclick = () => { otpOverlay.hidden = true; };

    verifyBtn.onclick = async () => {
        errorEl.textContent = "";
        const code = boxes.map(b => b.value).join("");
        if (code.length !== 6) {
            errorEl.textContent = "Please enter all 6 digits.";
            return;
        }

        verifyBtn.disabled = true;
        verifyBtn.textContent = "Verifying...";

        try {
            const response = await fetch(`${API_BASE}/auth/verify-login-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.detail || "Incorrect code.");

            setAccessToken(data.access_token);
            if (data.user) {
                setStoredUser(data.user);
                saveAccountSession(data.user, data.access_token);
                updateProfile(data.user);
            }
            updateLoginButton();
            otpOverlay.hidden = true;
            loginForm?.reset();
            showToast("Identity verified! Welcome to Aurelius.");
            await loadCurrentUser();
        } catch (err) {
            errorEl.textContent = err.message || "Incorrect code.";
            boxes.forEach(b => { b.value = ""; });
            boxes[0]?.focus();
        } finally {
            verifyBtn.disabled = false;
            verifyBtn.textContent = "Verify & Enter Aurelius";
        }
    };
}

async function registerUser(username, email, password, confirmPassword) {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirm_password: confirmPassword })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || "Registration failed");
    return data;
}

async function loginUser(email, password) {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.detail || "Login failed");
    return data;
}

registerForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthError();

    const username = registerUsername.value.trim();
    const email = registerEmail.value.trim().toLowerCase();
    const password = registerPassword.value;
    const confirmPassword = document.getElementById("registerConfirmPassword")?.value || "";

    if (!username || username.length < 2) return showAuthError("Please enter a valid username.");

    const validationError = validateFrontendEmailAndPassword(email, password, confirmPassword);
    if (validationError) return showAuthError(validationError);

    const submitBtn = registerForm.querySelector(".auth-submit");
    const oldText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Creating account...";
    }

    try {
        await registerUser(username, email, password, confirmPassword);
        showToast("Account created! Now sign in to verify your email.");
        registerForm.reset();
        showLoginView();
        loginEmail.value = email;
        loginPassword.value = "";
        loginPassword.focus();
    } catch (error) {
        showAuthError(error.message || "Registration failed.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = oldText || "Create account";
        }
    }
});

loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    clearAuthError();

    const email = loginEmail.value.trim().toLowerCase();
    const password = loginPassword.value;

    if (!email) return showAuthError("Please enter your email.");
    if (!password) return showAuthError("Please enter your password.");

    const submitBtn = loginForm.querySelector(".auth-submit");
    const oldText = submitBtn?.textContent;
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Checking credentials...";
    }

    try {
        const data = await loginUser(email, password);
        if (data.requires_2fa) {
            showToast("6-digit verification code sent to your email.");
            openLoginOtpModal(data.email || email);
        }
    } catch (error) {
        showAuthError(error.message || "Invalid email or password.");
    } finally {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = oldText || "Continue";
        }
    }
});


/* ============================================================
   SETTINGS MODAL (CUSTOM PHOTO UPLOAD + AVATARS + ANIMATED FRAMES)
   ============================================================ */

function ensureFramePickerSection() {
    if (!avatarPickerGrid || document.getElementById("framePickerGrid")) return;

    // 1. Live Preview Card فوق الأفاتارز
    const previewBox = document.createElement("div");
    previewBox.id = "avatarLivePreviewBox";
    previewBox.className = "avatar-live-preview-box";
    previewBox.innerHTML = `
        <div id="settingsAvatarLivePreview" class="avatar-preview-circle"></div>
        <div class="avatar-preview-meta">
            <strong id="settingsPreviewUserName">Aurelius Member</strong>
            <small id="settingsPreviewFrameName">Avatar & Frame Live Preview</small>
        </div>
    `;
    avatarPickerGrid.parentNode.insertBefore(previewBox, avatarPickerGrid);

    // 2. شريط رفع صورة شخصية مع إرشاد المقاس المناسب
    const uploadCard = document.createElement("div");
    uploadCard.id = "avatarUploadCard";
    uploadCard.className = "avatar-upload-card";
    uploadCard.innerHTML = `
        <div class="avatar-upload-info">
            <strong id="avatarUploadTitle">Upload custom photo</strong>
            <small id="avatarUploadHint">Recommended size: 512×512 px (Square 1:1) · JPG, PNG, WebP</small>
        </div>
        <div class="avatar-upload-actions">
            <input type="file" id="avatarUploadInput" accept="image/png,image/jpeg,image/webp" hidden />
            <button type="button" id="avatarUploadTriggerBtn" class="avatar-upload-trigger-btn">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span id="avatarUploadBtnText">Upload</span>
            </button>
        </div>
    `;
    avatarPickerGrid.parentNode.insertBefore(uploadCard, avatarPickerGrid);

    const fileInput = document.getElementById("avatarUploadInput");
    const triggerBtn = document.getElementById("avatarUploadTriggerBtn");

    triggerBtn.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async () => {
        const file = fileInput.files?.[0];
        fileInput.value = "";
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            showToast(currentLanguage === "ar" ? "يرجى اختيار ملف صورة صالح." : "Please select a valid image file.");
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            showToast(currentLanguage === "ar" ? "الحد الأقصى لحجم الصورة 8 ميجابايت." : "Maximum image size is 8 MB.");
            return;
        }

        const dataUrl = await readFileAsDataURL(file);
        openAvatarCropperModal(dataUrl);
    });

    // 3. سيكشن البراويز المتحركة تحت الأفاتارز
    const frameLabel = document.createElement("label");
    frameLabel.id = "frameSectionLabel";
    frameLabel.textContent = currentLanguage === "ar" ? "برواز الأفاتار المتحرك" : "Animated avatar frame";

    const frameGrid = document.createElement("div");
    frameGrid.id = "framePickerGrid";
    frameGrid.className = "frame-picker-grid";

    avatarPickerGrid.insertAdjacentElement("afterend", frameLabel);
    frameLabel.insertAdjacentElement("afterend", frameGrid);
}

function updateLiveAvatarPreview() {
    const user = getStoredUser();
    const fallbackName = user?.username || "A";
    const previewCircle = document.getElementById("settingsAvatarLivePreview");
    const previewUser = document.getElementById("settingsPreviewUserName");
    const previewDesc = document.getElementById("settingsPreviewFrameName");

    const uploadTitle = document.getElementById("avatarUploadTitle");
    const uploadHint = document.getElementById("avatarUploadHint");
    const uploadBtnText = document.getElementById("avatarUploadBtnText");

    if (uploadTitle) {
        uploadTitle.textContent = currentLanguage === "ar" ? "ارفع صورتك الشخصية" : "Upload custom photo";
    }
    if (uploadHint) {
        uploadHint.textContent = currentLanguage === "ar"
            ? "المقاس المثالي: 512×512 بكسل (مربعة 1:1) · JPG, PNG, WebP"
            : "Recommended size: 512×512 px (Square 1:1) · JPG, PNG, WebP";
    }
    if (uploadBtnText) {
        uploadBtnText.textContent = currentLanguage === "ar" ? "اختيار صورة" : "Upload";
    }

    if (previewCircle) {
        renderAvatarElement(previewCircle, encodeAvatarValue(selectedAvatarKey, selectedFrameKey), fallbackName);
    }
    if (previewUser) {
        previewUser.textContent = user?.username || "Aurelius Member";
    }
    if (previewDesc) {
        const frameObj = AVATAR_FRAMES.find(f => f.key === selectedFrameKey);
        const avatarLabel = selectedAvatarKey.startsWith("custom:") ? "Custom Photo" : selectedAvatarKey;
        previewDesc.textContent = `Avatar: ${avatarLabel} · Frame: ${frameObj?.label || "None"}`;
    }
}

function renderAvatarPickerGrid() {
    if (!avatarPickerGrid) return;
    ensureFramePickerSection();

    const user = getStoredUser();
    const fallbackName = user?.username || "A";

    avatarPickerGrid.innerHTML = "";
    Object.keys(AVATAR_PRESETS).forEach(key => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `avatar-choice-btn ${selectedAvatarKey === key ? "active" : ""}`;
        btn.title = key.charAt(0).toUpperCase() + key.slice(1);
        renderAvatarElement(btn, `${key}|none`, fallbackName);

        btn.addEventListener("click", () => {
            selectedAvatarKey = key;
            renderAvatarPickerGrid();
        });

        avatarPickerGrid.appendChild(btn);
    });

    const frameGrid = document.getElementById("framePickerGrid");
    const frameLabel = document.getElementById("frameSectionLabel");
    if (frameLabel) {
        frameLabel.textContent = currentLanguage === "ar" ? "برواز الأفاتار المتحرك" : "Animated avatar frame";
    }

    if (frameGrid) {
        frameGrid.innerHTML = "";
        AVATAR_FRAMES.forEach(frame => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = `frame-choice-btn ${selectedFrameKey === frame.key ? "active" : ""}`;
            btn.title = frame.label;

            const swatch = document.createElement("span");
            swatch.className = "frame-swatch";
            if (frame.key !== "none") {
                swatch.setAttribute("data-avatar-frame", frame.key);
            } else {
                swatch.textContent = "∅";
            }

            const lbl = document.createElement("span");
            lbl.className = "frame-choice-label";
            lbl.textContent = frame.label;

            btn.append(swatch, lbl);
            btn.addEventListener("click", () => {
                selectedFrameKey = frame.key;
                renderAvatarPickerGrid();
            });

            frameGrid.appendChild(btn);
        });
    }

    updateLiveAvatarPreview();
}

function applyAppearance(theme = "dark", background = "default") {
    localStorage.setItem("aurelius_theme", theme);
    localStorage.setItem("aurelius_background", background);

    document.documentElement.dataset.theme = theme;
    if (background === "default") delete document.documentElement.dataset.background;
    else document.documentElement.dataset.background = background;

    if (themeSelect) themeSelect.value = theme;
    if (backgroundSelect) backgroundSelect.value = background;
}

function loadAppearance() {
    const user = getStoredUser();
    const theme = user?.theme || localStorage.getItem("aurelius_theme") || "dark";
    const background = user?.background || localStorage.getItem("aurelius_background") || "default";
    const lang = user?.language || localStorage.getItem("aurelius_language") || "en";

    const parsed = parseAvatarValue(user?.avatar || "initial|none");
    selectedAvatarKey = parsed.avatarKey;
    selectedFrameKey = parsed.frameKey;

    applyAppearance(theme, background);
    if (languageSelect) languageSelect.value = lang;
    renderAvatarPickerGrid();
}

async function saveSettingsToDatabase() {
    const language = languageSelect?.value || "en";
    const theme = themeSelect?.value || "dark";
    const background = backgroundSelect?.value || "default";
    const avatar = encodeAvatarValue(selectedAvatarKey, selectedFrameKey);

    const oldText = appearanceSaveBtn?.textContent;
    if (appearanceSaveBtn) {
        appearanceSaveBtn.disabled = true;
        appearanceSaveBtn.textContent = "...";
    }

    try {
        if (getAccessToken()) {
            const updatedUser = await apiRequest("/auth/preferences", {
                method: "PUT",
                body: JSON.stringify({ language, theme, background, avatar })
            });
            setStoredUser(updatedUser);
            saveAccountSession(updatedUser, getAccessToken());
            updateProfile(updatedUser);
        }

        applyAppearance(theme, background);
        applyLanguage(language);
        closeModal();
        showToast(language === "ar" ? "تم حفظ الصورة والأفاتار والبرواز والإعدادات بنجاح." : "Photo, avatar, frame & settings saved.");
    } catch (error) {
        showModalError(error.message || "Failed to save settings.");
    } finally {
        if (appearanceSaveBtn) {
            appearanceSaveBtn.disabled = false;
            appearanceSaveBtn.textContent = oldText || t("saveSettings");
        }
    }
}

openSettingsBtn?.addEventListener("click", () => {
    closeAccountPopover();
    openSettingsModal();
});


/* ============================================================
   SIDEBAR & MODEL PICKER
   ============================================================ */

function openSidebar() {
    sidebar?.classList.add("open");
    sidebarScrim?.classList.add("visible");
}

function closeSidebar() {
    sidebar?.classList.remove("open");
    sidebarScrim?.classList.remove("visible");
}

openSidebarBtn?.addEventListener("click", openSidebar);
closeSidebarBtn?.addEventListener("click", closeSidebar);
sidebarScrim?.addEventListener("click", closeSidebar);

function setThinkingMode(mode) {
    currentThinkingMode = mode;
    localStorage.setItem("aurelius_thinking_mode", mode);
    modelOptions.forEach(opt => {
        const isSelected = opt.dataset.mode === mode;
        opt.classList.toggle("active", isSelected);
        if (isSelected && modelPickerLabel) {
            modelPickerLabel.textContent = opt.dataset.label || "Aurelius Spark";
        }
    });
}

modelPickerBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = modelPickerBtn.getAttribute("aria-expanded") === "true";
    modelPickerBtn.setAttribute("aria-expanded", String(!isOpen));
    if (modelMenu) modelMenu.hidden = isOpen;
});

modelOptions.forEach(option => {
    option.addEventListener("click", () => {
        setThinkingMode(option.dataset.mode);
        modelPickerBtn?.setAttribute("aria-expanded", "false");
        if (modelMenu) modelMenu.hidden = true;
    });
});

document.addEventListener("click", (event) => {
    if (modelPicker && !modelPicker.contains(event.target)) {
        modelPickerBtn?.setAttribute("aria-expanded", "false");
        if (modelMenu) modelMenu.hidden = true;
    }
});


/* ============================================================
   MODAL HELPERS
   ============================================================ */

function clearModal() {
    if (renameForm) renameForm.hidden = true;
    if (deleteActions) deleteActions.hidden = true;
    if (signOutConfirmActions) signOutConfirmActions.hidden = true;
    if (switchAccountControls) switchAccountControls.hidden = true;
    if (appearanceControls) appearanceControls.hidden = true;
    if (modalError) modalError.textContent = "";
}

function openModal() { if (modalBackdrop) modalBackdrop.hidden = false; }

function closeModal() {
    if (modalBackdrop) modalBackdrop.hidden = true;
    clearModal();
    currentRenameChatId = null;
    currentDeleteChatId = null;
}

function openSettingsModal() {
    clearModal();
    modalSymbol.textContent = "⚙";
    modalKicker.textContent = t("settingsKicker");
    modalTitle.textContent = t("settingsTitle");
    modalDescription.textContent = t("settingsDesc");
    if (appearanceControls) appearanceControls.hidden = false;
    loadAppearance();
    openModal();
}

function showModalError(message) { if (modalError) modalError.textContent = message; }

modalCloseBtn?.addEventListener("click", closeModal);
appearanceCloseBtn?.addEventListener("click", closeModal);
modalBackdrop?.addEventListener("click", (e) => { if (e.target === modalBackdrop) closeModal(); });
appearanceSaveBtn?.addEventListener("click", saveSettingsToDatabase);


/* ============================================================
   MARKDOWN, LATEX & RTL DETECTION
   ============================================================ */

function isRTL(text) {
    const clean = String(text || "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/`[^`]+`/g, "")
        .replace(/<[^>]+>/g, "")
        .trimStart();

    return /^[\u0600-\u06FF\u0590-\u05FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(clean);
}

function applyBubbleDirection(bubble, text) {
    const rtl = isRTL(text);
    bubble.setAttribute("dir", rtl ? "rtl" : "ltr");
    if (rtl) bubble.setAttribute("lang", "ar");
    else bubble.removeAttribute("lang");
}

function applyInputDirection() {
    if (!messageInput) return;
    if (!messageInput.value.trim()) {
        messageInput.style.direction = currentLanguage === "ar" ? "rtl" : "ltr";
        messageInput.style.textAlign = currentLanguage === "ar" ? "right" : "left";
        return;
    }
    const rtl = isRTL(messageInput.value);
    messageInput.style.direction = rtl ? "rtl" : "ltr";
    messageInput.style.textAlign = rtl ? "right" : "left";
}

function renderMarkdown(text) {
    const mathBlocks = [];
    const protectedText = String(text || "").replace(
        /(\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\$[^\$\n]+?\$|\\\([\s\S]*?\\\))/g,
        (match) => {
            const id = `@@MATH_BLOCK_${mathBlocks.length}@@`;
            mathBlocks.push(match);
            return id;
        }
    );

    const rawHTML = window.marked ? marked.parse(protectedText, { gfm: true, breaks: true }) : protectedText;
    let cleanHTML = window.DOMPurify
        ? DOMPurify.sanitize(rawHTML, { ADD_DATA_URI_TAGS: ["img"] })
        : rawHTML;

    mathBlocks.forEach((math, index) => {
        cleanHTML = cleanHTML.replace(`@@MATH_BLOCK_${index}@@`, () => math);
    });

    return cleanHTML;
}

const LANG_EXTENSIONS = {
    python: "py", py: "py",
    javascript: "js", js: "js",
    typescript: "ts", ts: "ts",
    html: "html", css: "css",
    cpp: "cpp", "c++": "cpp", c: "c",
    csharp: "cs", cs: "cs",
    java: "java", json: "json",
    sql: "sql", bash: "sh", sh: "sh",
    php: "php", ruby: "rb", go: "go", rust: "rs",
    xml: "xml", yaml: "yml", yml: "yml", markdown: "md", md: "md"
};

const SVG_ICONS = {
    copy: `<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    check: `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    regenerate: `<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><polyline points="21 3 21 9 15 9"/></svg>`,
    edit: `<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`,
    downloadCircle: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v7"/><polyline points="9 12.5 12 15.5 15 12.5"/></svg>`
};

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}

function exportTableToPDF(tableEl) {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
        showToast("Please allow popups to export PDF.");
        return;
    }
    win.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8" />
            <title>Aurelius Table Export</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 28px; color: #111; }
                h2 { margin-bottom: 14px; font-size: 18px; }
                table { width: 100%; border-collapse: collapse; font-size: 13px; }
                th, td { border: 1px solid #cbd5e1; padding: 9px 12px; text-align: left; }
                th { background: #f1f5f9; font-weight: bold; }
                tr:nth-child(even) { background: #f8fafc; }
            </style>
        </head>
        <body>
            <h2>Aurelius — Exported Table</h2>
            ${tableEl.outerHTML}
            <script>window.onload = () => { window.print(); window.close(); };<\/script>
        </body>
        </html>
    `);
    win.document.close();
}

function enhanceCodeBlocks(container, autoScrollBoxes = false) {
    container.querySelectorAll("pre").forEach(pre => {
        if (pre.parentElement?.classList.contains("code-box-wrapper")) return;

        const codeEl = pre.querySelector("code");
        const langMatch = codeEl?.className?.match(/language-([a-zA-Z0-9_+-]+)/);
        const rawLang = (langMatch ? langMatch[1] : "code").toLowerCase();
        const ext = LANG_EXTENSIONS[rawLang] || "txt";

        const wrapper = document.createElement("div");
        wrapper.className = "code-box-wrapper";

        const header = document.createElement("div");
        header.className = "code-block-header";
        header.innerHTML = `<span class="code-lang">${rawLang}</span>`;

        const actions = document.createElement("div");
        actions.className = "code-header-actions";

        const downloadBtn = document.createElement("button");
        downloadBtn.type = "button";
        downloadBtn.className = "box-icon-btn";
        downloadBtn.title = `Download .${ext}`;
        downloadBtn.innerHTML = SVG_ICONS.downloadCircle;
        downloadBtn.addEventListener("click", () => {
            const codeText = codeEl ? codeEl.innerText : pre.innerText;
            downloadTextFile(`aurelius_code.${ext}`, codeText);
        });

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "box-icon-btn";
        copyBtn.title = "Copy code";
        copyBtn.innerHTML = SVG_ICONS.copy;
        copyBtn.addEventListener("click", async () => {
            const codeText = codeEl ? codeEl.innerText : pre.innerText;
            await navigator.clipboard.writeText(codeText);
            copyBtn.innerHTML = SVG_ICONS.check;
            copyBtn.classList.add("done");
            setTimeout(() => {
                copyBtn.innerHTML = SVG_ICONS.copy;
                copyBtn.classList.remove("done");
            }, 1600);
        });

        actions.appendChild(downloadBtn);
        actions.appendChild(copyBtn);
        header.appendChild(actions);

        pre.parentNode.insertBefore(wrapper, pre);
        wrapper.appendChild(header);
        wrapper.appendChild(pre);

        if (autoScrollBoxes) pre.scrollTop = pre.scrollHeight;
    });
}

function enhanceTables(container, autoScrollBoxes = false) {
    container.querySelectorAll("table").forEach(table => {
        if (table.closest(".table-box-wrapper")) return;

        const wrapper = document.createElement("div");
        wrapper.className = "table-box-wrapper";

        const header = document.createElement("div");
        header.className = "table-box-header";
        header.innerHTML = `<span class="code-lang">TABLE</span>`;

        const actions = document.createElement("div");
        actions.className = "code-header-actions";

        const pdfBtn = document.createElement("button");
        pdfBtn.type = "button";
        pdfBtn.className = "box-icon-btn";
        pdfBtn.title = "Download PDF";
        pdfBtn.innerHTML = SVG_ICONS.downloadCircle;
        pdfBtn.addEventListener("click", () => exportTableToPDF(table));

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "box-icon-btn";
        copyBtn.title = "Copy table";
        copyBtn.innerHTML = SVG_ICONS.copy;
        copyBtn.addEventListener("click", async () => {
            const rows = Array.from(table.querySelectorAll("tr")).map(tr =>
                Array.from(tr.querySelectorAll("th, td")).map(cell => cell.innerText.trim()).join("\t")
            ).join("\n");
            await navigator.clipboard.writeText(rows);
            copyBtn.innerHTML = SVG_ICONS.check;
            copyBtn.classList.add("done");
            setTimeout(() => {
                copyBtn.innerHTML = SVG_ICONS.copy;
                copyBtn.classList.remove("done");
            }, 1600);
        });

        actions.appendChild(pdfBtn);
        actions.appendChild(copyBtn);
        header.appendChild(actions);

        const scrollArea = document.createElement("div");
        scrollArea.className = "table-scroll-area";

        table.parentNode.insertBefore(wrapper, table);
        wrapper.appendChild(header);
        wrapper.appendChild(scrollArea);
        scrollArea.appendChild(table);

        if (autoScrollBoxes) scrollArea.scrollTop = scrollArea.scrollHeight;
    });
}

function renderBubbleContent(bubble, text, isStreaming = false) {
    bubble.innerHTML = renderMarkdown(text);
    applyBubbleDirection(bubble, text);
    enhanceCodeBlocks(bubble, isStreaming);
    enhanceTables(bubble, isStreaming);

    if (!isStreaming && typeof window.renderMathInElement === "function") {
        renderMathInElement(bubble, {
            delimiters: [
                { left: "$$", right: "$$", display: true },
                { left: "\\[", right: "\\]", display: true },
                { left: "$", right: "$", display: false },
                { left: "\\(", right: "\\)", display: false }
            ],
            throwOnError: false
        });
    }
}

async function handleRegenerateLastResponse(aiWrapper) {
    if (isGenerating || !currentChatId) return;

    const allUserMsgs = messages.querySelectorAll(".message.user");
    const lastUserWrapper = allUserMsgs[allUserMsgs.length - 1];
    if (!lastUserWrapper) return;

    const lastUserText = lastUserWrapper.dataset.rawText || lastUserWrapper.querySelector(".bubble")?.innerText?.trim();
    if (!lastUserText) return;

    const token = getAccessToken();
    try {
        await fetch(`${API_BASE}/chats/${currentChatId}/messages/truncate`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
    } catch (err) {
        console.error(err);
    }

    aiWrapper?.remove();
    await streamAssistantReply(lastUserText);
}

function startInlineEditUserMessage(userWrapper) {
    if (isGenerating) return;
    const bubble = userWrapper.querySelector(".bubble");
    const actionsBar = userWrapper.querySelector(".message-actions-bar");
    const originalText = userWrapper.dataset.rawText || bubble.innerText;

    bubble.hidden = true;
    if (actionsBar) actionsBar.hidden = true;

    const editBox = document.createElement("div");
    editBox.className = "inline-edit-box";

    const textarea = document.createElement("textarea");
    textarea.className = "inline-edit-textarea";
    textarea.value = originalText;

    const btnRow = document.createElement("div");
    btnRow.className = "inline-edit-actions";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.className = "secondary-btn";
    cancelBtn.textContent = currentLanguage === "ar" ? "إلغاء" : "Cancel";
    cancelBtn.onclick = () => {
        editBox.remove();
        bubble.hidden = false;
        if (actionsBar) actionsBar.hidden = false;
    };

    const saveBtn = document.createElement("button");
    saveBtn.type = "button";
    saveBtn.className = "primary-btn";
    saveBtn.textContent = currentLanguage === "ar" ? "إرسال" : "Send";
    saveBtn.onclick = async () => {
        const updatedText = textarea.value.trim();
        if (!updatedText) return;

        const msgId = userWrapper.dataset.messageId;
        const token = getAccessToken();

        if (currentChatId && msgId) {
            await fetch(`${API_BASE}/chats/${currentChatId}/messages/truncate?from_message_id=${msgId}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            }).catch(console.error);
        } else if (currentChatId) {
            await fetch(`${API_BASE}/chats/${currentChatId}/messages/truncate`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            }).catch(console.error);
        }

        let next = userWrapper.nextElementSibling;
        while (next) {
            const toRemove = next;
            next = next.nextElementSibling;
            toRemove.remove();
        }
        userWrapper.remove();

        addMessage("user", updatedText);
        await streamAssistantReply(updatedText);
    };

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(saveBtn);
    editBox.appendChild(textarea);
    editBox.appendChild(btnRow);
    userWrapper.appendChild(editBox);
    textarea.focus();
}

function addMessage(role, content, messageId = null) {
    if (!messages) return null;
    setConversationView(true);

    const normalizedRole = role === "user" ? "user" : "ai";
    const wrapper = document.createElement("div");
    wrapper.className = `message ${normalizedRole}`;
    wrapper.dataset.rawText = content;
    if (messageId) wrapper.dataset.messageId = messageId;

    const bubble = document.createElement("div");
    bubble.className = "bubble";

    const actionsBar = document.createElement("div");
    actionsBar.className = "message-actions-bar";

    if (normalizedRole === "ai") {
        renderBubbleContent(bubble, content, false);
        wrapper.appendChild(bubble);

        const regenBtn = document.createElement("button");
        regenBtn.type = "button";
        regenBtn.className = "icon-action-btn";
        regenBtn.title = currentLanguage === "ar" ? "إعادة التوليد" : "Regenerate";
        regenBtn.innerHTML = SVG_ICONS.regenerate;
        regenBtn.addEventListener("click", () => handleRegenerateLastResponse(wrapper));

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "icon-action-btn";
        copyBtn.title = currentLanguage === "ar" ? "نسخ" : "Copy";
        copyBtn.innerHTML = SVG_ICONS.copy;
        copyBtn.addEventListener("click", async () => {
            const raw = wrapper.dataset.rawText || content || bubble.innerText;
            await navigator.clipboard.writeText(raw);
            copyBtn.innerHTML = SVG_ICONS.check;
            setTimeout(() => { copyBtn.innerHTML = SVG_ICONS.copy; }, 1600);
        });

        actionsBar.appendChild(regenBtn);
        actionsBar.appendChild(copyBtn);
        wrapper.appendChild(actionsBar);
    } else {
        if (String(content).includes("![") && String(content).includes("data:image/")) {
            renderBubbleContent(bubble, content, false);
        } else {
            bubble.textContent = content;
            applyBubbleDirection(bubble, content);
        }
        wrapper.appendChild(bubble);

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "icon-action-btn";
        copyBtn.title = currentLanguage === "ar" ? "نسخ" : "Copy";
        copyBtn.innerHTML = SVG_ICONS.copy;
        copyBtn.addEventListener("click", async () => {
            const raw = wrapper.dataset.rawText || content;
            await navigator.clipboard.writeText(raw);
            copyBtn.innerHTML = SVG_ICONS.check;
            setTimeout(() => { copyBtn.innerHTML = SVG_ICONS.copy; }, 1600);
        });

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.className = "icon-action-btn";
        editBtn.title = currentLanguage === "ar" ? "تعديل الرسالة" : "Edit message";
        editBtn.innerHTML = SVG_ICONS.edit;
        editBtn.addEventListener("click", () => startInlineEditUserMessage(wrapper));

        actionsBar.appendChild(copyBtn);
        actionsBar.appendChild(editBtn);
        wrapper.appendChild(actionsBar);
    }

    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
    return wrapper;
}

function addThinkingMessage() {
    if (!messages) return null;
    const wrapper = document.createElement("div");
    wrapper.className = "message ai thinking-message";
    wrapper.innerHTML = `
        <div class="bubble">
            <div class="thinking-dots" aria-label="Aurelius is thinking">
                <i></i><i></i><i></i>
            </div>
        </div>
    `;
    messages.appendChild(wrapper);
    messages.scrollTop = messages.scrollHeight;
    return wrapper;
}


/* ============================================================
   CHATS MANAGEMENT
   ============================================================ */

function renderChatActiveState() {
    document.querySelectorAll(".chat-item").forEach(item => {
        item.classList.toggle("active", Number(item.dataset.chatId) === Number(currentChatId));
    });
}

async function loadChatMessages(chatId, title = "Conversation") {
    if (isGenerating) return;
    try {
        const data = await apiRequest(`/chats/${chatId}/messages`);
        const items = Array.isArray(data) ? data : data?.messages || [];

        currentChatId = Number(chatId);
        currentChatHasMessages = items.length > 0;
        localStorage.setItem("aurelius_current_chat", String(currentChatId));

        updateTopbar(title);
        if (messages) messages.innerHTML = "";
        setConversationView(currentChatHasMessages);

        items.forEach(msg => addMessage(msg.role, msg.content, msg.id));
        renderChatActiveState();

        const allMsgs = messages.querySelectorAll(".message");
        const lastMsg = allMsgs[allMsgs.length - 1];
        if (lastMsg && lastMsg.classList.contains("user")) {
            const actionsBar = lastMsg.querySelector(".message-actions-bar");
            if (actionsBar && !actionsBar.querySelector(".regen-user-btn")) {
                const regenBtn = document.createElement("button");
                regenBtn.type = "button";
                regenBtn.className = "icon-action-btn regen-user-btn";
                regenBtn.title = currentLanguage === "ar" ? "إعادة المحاولة" : "Regenerate";
                regenBtn.innerHTML = SVG_ICONS.regenerate;
                regenBtn.onclick = () => {
                    const rawPrompt = lastMsg.dataset.rawText || lastMsg.querySelector(".bubble")?.textContent || "";
                    if (!rawPrompt.trim()) return;
                    lastMsg.remove();
                    messageInput.value = rawPrompt.replace(/!\[([^\]]*)\]\(data:image\/[^)]+\)/g, "").trim();
                    chatForm.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
                };
                actionsBar.prepend(regenBtn);
            }
        }
    } catch (error) {
        console.error("Failed to load messages:", error);
        showToast(error.message || "Failed to load conversation.");
    }
}

async function loadChats() {
    const user = getStoredUser();
    if (!user) return;

    try {
        const data = await apiRequest(`/chats/${user.id}`);
        const chats = Array.isArray(data) ? data : data?.chats || [];

        if (history) history.innerHTML = "";
        if (historyCount) historyCount.textContent = String(chats.length);

        chats.forEach(chat => addChatItem(chat));
        renderChatActiveState();

        if (currentChatId === null && chats.length > 0) {
            const savedId = Number(localStorage.getItem("aurelius_current_chat"));
            const savedChat = chats.find(c => Number(c.id) === savedId);
            if (savedChat) {
                await loadChatMessages(savedChat.id, savedChat.title || "Conversation");
            }
        }
    } catch (error) {
        console.error("Failed to load chats:", error);
        showToast(error.message || "Failed to load conversations.");
    }
}

function addChatItem(chat) {
    if (!history) return;

    const item = document.createElement("div");
    item.className = "chat-item";
    item.dataset.chatId = String(chat.id);
    if (Number(chat.id) === Number(currentChatId)) {
        item.classList.add("active");
    }

    const titleText = chat.title || "New conversation";

    const titleSpan = document.createElement("span");
    titleSpan.className = "chat-title";
    titleSpan.title = titleText;
    titleSpan.textContent = titleText;

    const actionsDiv = document.createElement("div");
    actionsDiv.className = "chat-actions";

    const renameButton = document.createElement("button");
    renameButton.type = "button";
    renameButton.className = "rename-chat";
    renameButton.title = "Rename";
    renameButton.textContent = "✎";
    renameButton.addEventListener("click", (e) => {
        e.stopPropagation();
        openRenameModal(chat);
    });

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-chat";
    deleteButton.title = "Delete";
    deleteButton.textContent = "×";
    deleteButton.addEventListener("click", (e) => {
        e.stopPropagation();
        openDeleteModal(chat);
    });

    actionsDiv.append(renameButton, deleteButton);
    item.append(titleSpan, actionsDiv);

    item.addEventListener("click", async () => {
        closeSidebar();
        await loadChatMessages(chat.id, titleText);
    });

    history.appendChild(item);
}

async function createChat(initialTitle = "New conversation") {
    const user = getStoredUser();
    if (!user) {
        openAuth("login");
        return null;
    }

    const data = await apiRequest("/chats", {
        method: "POST",
        body: JSON.stringify({ user_id: user.id, title: initialTitle })
    });

    const chat = data?.chat || data;
    currentChatId = Number(chat.id);
    currentChatHasMessages = false;
    localStorage.setItem("aurelius_current_chat", String(currentChatId));

    updateTopbar(chat.title || initialTitle);
    setConversationView(false);
    await loadChats();
    return currentChatId;
}

async function startNewChat() {
    if (isGenerating) {
        showToast("Please wait until Aurelius finishes responding.");
        return;
    }

    if (currentChatId !== null && !currentChatHasMessages) {
        setConversationView(false);
        messageInput?.focus();
        showToast("You're already in a new conversation.");
        return;
    }

    const existingEmpty = Array.from(document.querySelectorAll(".chat-item")).find(el => {
        const t = el.querySelector(".chat-title")?.textContent?.trim();
        return t === "New conversation" || t === "New Chat";
    });

    if (existingEmpty) {
        const emptyId = Number(existingEmpty.dataset.chatId);
        await loadChatMessages(emptyId, "New conversation");
        if (!currentChatHasMessages) {
            messageInput?.focus();
            return;
        }
    }

    try {
        await createChat("New conversation");
        messageInput?.focus();
    } catch (error) {
        console.error("Failed to create chat:", error);
        showToast(error.message || "Failed to create conversation.");
    }
}

newChatBtn?.addEventListener("click", startNewChat);


/* ============================================================
   RENAME & DELETE CHAT
   ============================================================ */

function openRenameModal(chat) {
    clearModal();
    currentRenameChatId = chat.id;
    modalSymbol.textContent = "✎";
    modalKicker.textContent = "CONVERSATION SETTINGS";
    modalTitle.textContent = "Rename conversation";
    modalDescription.textContent = "Give this conversation a name that is easy to recognize.";
    renameForm.hidden = false;
    renameInput.value = chat.title || "";
    openModal();
    setTimeout(() => {
        renameInput.focus();
        renameInput.select();
    }, 50);
}

renameCancelBtn?.addEventListener("click", closeModal);

renameForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = renameInput.value.trim();
    if (!title) return showModalError("Conversation name cannot be empty.");
    if (!currentRenameChatId) return;

    try {
        await apiRequest(`/chats/${currentRenameChatId}/title`, {
            method: "PUT",
            body: JSON.stringify({ title })
        });
        if (Number(currentChatId) === Number(currentRenameChatId)) {
            updateTopbar(title);
        }
        closeModal();
        await loadChats();
        showToast("Conversation renamed.");
    } catch (error) {
        showModalError(error.message || "Failed to rename conversation.");
    }
});

function openDeleteModal(chat) {
    clearModal();
    currentDeleteChatId = chat.id;
    modalSymbol.textContent = "×";
    modalKicker.textContent = "DANGER ZONE";
    modalTitle.textContent = "Delete conversation";
    modalDescription.textContent = `Are you sure you want to delete "${chat.title || "this conversation"}"?`;
    deleteActions.hidden = false;
    openModal();
}

deleteCancelBtn?.addEventListener("click", closeModal);

deleteConfirmBtn?.addEventListener("click", async () => {
    if (!currentDeleteChatId) return;
    try {
        await apiRequest(`/chats/${currentDeleteChatId}`, { method: "DELETE" });
        if (Number(currentChatId) === Number(currentDeleteChatId)) {
            currentChatId = null;
            currentChatHasMessages = false;
            localStorage.removeItem("aurelius_current_chat");
            setConversationView(false);
            updateTopbar("Aurelius");
        }
        closeModal();
        await loadChats();
        showToast("Conversation deleted.");
    } catch (error) {
        showModalError(error.message || "Failed to delete conversation.");
    }
});


/* ============================================================
   SEND MESSAGE & SSE STREAMING
   ============================================================ */

async function streamAssistantReply(text) {
    const token = getAccessToken();
    if (!token) {
        openAuth("login");
        return;
    }

    setGeneratingState(true);
    const thinkingMessage = addThinkingMessage();
    let aiWrapper = null;
    let aiBubble = null;
    let statusPill = null;
    let fullText = "";

    currentAbortController = new AbortController();

    try {
        const response = await fetch(`${API_BASE}/chat/stream`, {
            method: "POST",
            signal: currentAbortController.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                chat_id: currentChatId,
                message: text,
                mode: currentThinkingMode
            })
        });

        if (response.status === 401) {
            clearAuth();
            openAuth("login");
            throw new Error("Your session has expired.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || "Failed to send message.");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("Streaming is not supported.");

        const decoder = new TextDecoder("utf-8");
        let buffer = "";

        while (true) {
            const { value, done } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n\n");
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.startsWith("data: ")) continue;
                const payload = JSON.parse(line.slice(6));

                if (payload.error) throw new Error(payload.error);

                if (payload.status) {
                    thinkingMessage?.remove();
                    if (!aiBubble) {
                        aiWrapper = addMessage("ai", "");
                        aiBubble = aiWrapper?.querySelector(".bubble");
                    }
                    if (!statusPill && aiBubble) {
                        statusPill = document.createElement("div");
                        statusPill.className = "generation-status-pill";
                        aiBubble.appendChild(statusPill);
                    }
                    if (statusPill) statusPill.textContent = `⏳ ${payload.status}`;
                }

                if (payload.artifact) {
                    statusPill?.remove();
                    statusPill = null;
                    openRightArtifactPanel(payload.artifact);
                }

                if (payload.chunk) {
                    thinkingMessage?.remove();
                    statusPill?.remove();
                    statusPill = null;
                    if (!aiBubble) {
                        aiWrapper = addMessage("ai", "");
                        aiBubble = aiWrapper?.querySelector(".bubble");
                    }
                    fullText += payload.chunk;
                    if (aiBubble) {
                        renderBubbleContent(aiBubble, fullText, true);
                        messages.scrollTop = messages.scrollHeight;
                    }
                }

                if (payload.done && aiBubble) {
                    const finalReply = payload.reply || fullText;
                    if (aiWrapper) aiWrapper.dataset.rawText = finalReply;
                    renderBubbleContent(aiBubble, finalReply, false);
                    messages.scrollTop = messages.scrollHeight;
                }
            }
        }

        await loadChats();
    } catch (error) {
        if (thinkingMessage && thinkingMessage.isConnected) {
            thinkingMessage.remove();
        }
        if (error.name === "AbortError") {
            if (aiBubble && fullText) {
                if (aiWrapper) aiWrapper.dataset.rawText = fullText;
                renderBubbleContent(aiBubble, fullText, false);
            }
            showToast(currentLanguage === "ar" ? "تم إيقاف التوليد." : "Generation stopped.");
        } else {
            console.error("Chat error:", error);
            addMessage("ai", `**Error:** ${error.message || "Something went wrong."}`);
        }
    } finally {
        currentAbortController = null;
        setGeneratingState(false);
        messageInput?.focus();
    }
}

chatForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (isGenerating) return;

    const text = messageInput.value.trim();
    if (!text) return;

    const token = getAccessToken();
    if (!token) {
        openAuth("login");
        return;
    }

    const isFirstMessageInChat = !currentChatHasMessages;

    if (!currentChatId) {
        try {
            const initialTitle = text.length > 40 ? text.slice(0, 39) + "…" : text;
            await createChat(initialTitle);
        } catch (error) {
            showToast(error.message || "Failed to start conversation.");
            return;
        }
    }

    addMessage("user", text);
    currentChatHasMessages = true;

    if (isFirstMessageInChat) {
        const instantTitle = text.length > 40 ? text.slice(0, 39) + "…" : text;
        updateTopbar(instantTitle);
    }

    messageInput.value = "";
    messageInput.style.height = "auto";
    applyInputDirection();

    await streamAssistantReply(text);
});


/* ============================================================
   INPUT & SHORTCUTS
   ============================================================ */

messageInput?.addEventListener("input", () => {
    messageInput.style.height = "auto";
    const maxHeight = 180;
    messageInput.style.height = `${Math.min(messageInput.scrollHeight, maxHeight)}px`;
    messageInput.style.overflowY = messageInput.scrollHeight > maxHeight ? "auto" : "hidden";

    applyInputDirection();
    if (sendBtn) sendBtn.disabled = isGenerating || !messageInput.value.trim();
});

messageInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        if (!isGenerating) chatForm?.requestSubmit();
    }
});

suggestionCards.forEach(card => {
    card.addEventListener("click", () => {
        if (isGenerating) return;
        if (!getAccessToken()) {
            openAuth("login");
            return;
        }
        const promptText = currentLanguage === "ar"
            ? (card.dataset.promptAr || card.dataset.prompt || "")
            : (card.dataset.prompt || "");

        messageInput.value = promptText;
        messageInput.dispatchEvent(new Event("input"));
        messageInput.focus();
    });
});

document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (getAccessToken()) startNewChat();
        else openAuth("login");
    }
    if (event.key === "Escape") {
        const cropper = document.getElementById("avatarCropperBackdrop");
        if (cropper && !cropper.hidden) {
            cropper.hidden = true;
            return;
        }
        if (modalBackdrop && !modalBackdrop.hidden) closeModal();
        if (accountPopover && !accountPopover.hidden) closeAccountPopover();
    }
});


/* ============================================================
   COLLAPSIBLE LEFT SIDEBAR (INSIDE BRAND ROW) & RESIZABLE RIGHT PANEL
   ============================================================ */

(function setupLeftSidebarToggle() {
    const brandRow = document.querySelector(".brand-row");
    const topbarTitle = document.querySelector(".topbar-title");

    if (brandRow && !document.getElementById("insideSidebarToggleBtn")) {
        const insideBtn = document.createElement("button");
        insideBtn.type = "button";
        insideBtn.id = "insideSidebarToggleBtn";
        insideBtn.className = "sidebar-collapse-btn inside-sidebar-toggle";
        insideBtn.title = "Collapse sidebar";
        insideBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`;

        insideBtn.addEventListener("click", () => {
            if (window.innerWidth <= 760) {
                sidebar?.classList.remove("open");
                sidebarScrim?.classList.remove("visible");
            } else {
                document.body.classList.toggle("sidebar-collapsed");
            }
        });

        brandRow.appendChild(insideBtn);
    }

    if (topbarTitle && !document.getElementById("desktopSidebarToggle")) {
        const openBtn = document.createElement("button");
        openBtn.type = "button";
        openBtn.id = "desktopSidebarToggle";
        openBtn.className = "sidebar-collapse-btn topbar-reopen-btn";
        openBtn.title = "Expand sidebar";
        openBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="9" y1="3" x2="9" y2="21"/></svg>`;

        openBtn.addEventListener("click", () => {
            if (window.innerWidth <= 760) {
                sidebar?.classList.toggle("open");
                sidebarScrim?.classList.toggle("visible");
            } else {
                document.body.classList.remove("sidebar-collapsed");
            }
        });

        topbarTitle.prepend(openBtn);
    }
})();


/* ============================================================
   QURAN BOXES + SAVED ARTIFACTS + RIGHT PANEL + GEMINI COMPOSER
   ============================================================ */

let pendingAttachmentFile = null;
let pendingAttachmentPreviewUrl = null;

function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

function enhanceQuranBlocks(container) {
    container.querySelectorAll("pre code.language-quran").forEach(codeEl => {
        const pre = codeEl.parentElement;
        if (!pre || pre.parentElement?.classList.contains("quran-box-wrapper")) return;

        const verseText = codeEl.innerText.trim();
        const wrapper = document.createElement("div");
        wrapper.className = "quran-box-wrapper";
        wrapper.innerHTML = `
            <div class="quran-box-header">
                <span>﷽ · القرآن الكريم</span>
                <button type="button" class="box-icon-btn" title="نسخ الآية">${SVG_ICONS.copy}</button>
            </div>
            <div class="quran-verse-content">${verseText}</div>
        `;

        const copyBtn = wrapper.querySelector("button");
        copyBtn.onclick = async () => {
            await navigator.clipboard.writeText(verseText);
            copyBtn.innerHTML = SVG_ICONS.check;
            setTimeout(() => { copyBtn.innerHTML = SVG_ICONS.copy; }, 1500);
        };

        pre.replaceWith(wrapper);
    });
}

function enhanceSavedArtifacts(container) {
    container.querySelectorAll("pre code").forEach(codeEl => {
        const pre = codeEl.parentElement;
        if (!pre || pre.parentElement?.classList.contains("saved-artifact-card")) return;

        const classMatch = codeEl.className.match(/language-artifact:(pdf|docx|html):([^\s]+)/);
        if (!classMatch) return;

        const artType = classMatch[1];
        const artFilename = classMatch[2];
        const artBody = codeEl.innerText.trim();

        const card = document.createElement("div");
        card.className = "saved-artifact-card";
        card.innerHTML = `
            <div class="saved-artifact-meta">
                <span class="saved-artifact-icon">${artType === "pdf" ? "📄" : artType === "docx" ? "📝" : "🌐"}</span>
                <div>
                    <strong>${artFilename}</strong>
                    <small>${artType.toUpperCase()} · Saved in chat</small>
                </div>
            </div>
            <button type="button" class="primary-btn saved-artifact-open-btn">Open</button>
        `;

        const openBtn = card.querySelector("button");
        openBtn.onclick = async () => {
            if (artType === "html") {
                openRightArtifactPanel({ type: "html", filename: artFilename, html: artBody });
                return;
            }
            openBtn.disabled = true;
            openBtn.textContent = "...";
            try {
                const res = await apiRequest("/artifacts/export", {
                    method: "POST",
                    body: JSON.stringify({
                        type: artType,
                        filename: artFilename,
                        content: artBody
                    })
                });
                openRightArtifactPanel(res);
            } catch (err) {
                showToast(err.message || "Failed to open file.");
            } finally {
                openBtn.disabled = false;
                openBtn.textContent = "Open";
            }
        };

        pre.replaceWith(card);
    });
}

function sanitizePreviewHtml(rawHtml) {
    const guardScript = `
    <script>
      document.addEventListener("click", function(e) {
        const link = e.target.closest("a");
        if (!link) return;
        const href = (link.getAttribute("href") || "").trim();
        if (!href || href === "#" || href.startsWith("javascript:")) {
          e.preventDefault();
        } else if (href.startsWith("#")) {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth" });
        } else if (!href.startsWith("mailto:") && !href.startsWith("tel:")) {
          e.preventDefault();
        }
      }, true);
    <\/script>`;

    if (/<\/body>/i.test(rawHtml)) {
        return rawHtml.replace(/<\/body>/i, `${guardScript}</body>`);
    }
    return rawHtml + guardScript;
}

function openRightArtifactPanel(artifact) {
    const appShell = document.querySelector(".app-shell");
    let panel = document.getElementById("artifactSidePanel");

    if (!panel) {
        panel = document.createElement("aside");
        panel.id = "artifactSidePanel";
        panel.className = "artifact-side-panel";
        panel.innerHTML = `
            <div class="artifact-resizer" id="artifactResizer" title="Drag to resize (up to 50% width)"></div>
            <div class="artifact-panel-header">
                <div class="artifact-panel-title-wrap">
                    <button type="button" id="artifactCollapseBtn" class="sidebar-collapse-btn" title="Collapse/Expand panel">
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><line x1="15" y1="3" x2="15" y2="21"/></svg>
                    </button>
                    <strong id="artifactPanelTitle">Preview</strong>
                </div>
                <div class="artifact-panel-actions">
                    <a id="artifactDownloadLink" class="secondary-btn" download style="text-decoration:none; height:32px; display:inline-flex; align-items:center; padding:0 12px; font-size:12px;">Download</a>
                    <button type="button" id="artifactCloseBtn" class="box-icon-btn" title="Close">×</button>
                </div>
            </div>
            <div class="artifact-panel-body" id="artifactPanelBody"></div>
        `;
        (appShell || document.body).appendChild(panel);

        document.getElementById("artifactCloseBtn").onclick = () => {
            panel.hidden = true;
            panel.style.width = "";
            document.body.classList.remove("right-panel-open", "right-panel-collapsed");
        };

        document.getElementById("artifactCollapseBtn").onclick = () => {
            const willCollapse = !document.body.classList.contains("right-panel-collapsed");
            if (willCollapse) {
                panel.dataset.prevWidth = panel.style.width || "420px";
                panel.style.width = "";
                document.body.classList.add("right-panel-collapsed");
            } else {
                document.body.classList.remove("right-panel-collapsed");
                panel.style.width = panel.dataset.prevWidth || "420px";
            }
        };

        const resizer = document.getElementById("artifactResizer");
        let isResizing = false;

        resizer.addEventListener("mousedown", (e) => {
            if (document.body.classList.contains("right-panel-collapsed")) return;
            isResizing = true;
            document.body.classList.add("is-resizing-panel");
            e.preventDefault();
        });

        window.addEventListener("mousemove", (e) => {
            if (!isResizing) return;
            const minW = 420;
            const maxW = Math.floor(window.innerWidth * 0.5);
            const desiredW = window.innerWidth - e.clientX;
            const clampedW = Math.max(minW, Math.min(maxW, desiredW));
            panel.style.width = `${clampedW}px`;
        });

        window.addEventListener("mouseup", () => {
            if (!isResizing) return;
            isResizing = false;
            document.body.classList.remove("is-resizing-panel");
        });
    }

    const titleEl = document.getElementById("artifactPanelTitle");
    const bodyEl = document.getElementById("artifactPanelBody");
    const dlLink = document.getElementById("artifactDownloadLink");

    titleEl.textContent = artifact.filename || "Live Preview";
    bodyEl.innerHTML = "";

    if (artifact.data_url) {
        dlLink.hidden = false;
        dlLink.href = artifact.data_url;
        dlLink.download = artifact.filename || "aurelius_file";
    } else if (artifact.html) {
        dlLink.hidden = false;
        const blob = new Blob([artifact.html], { type: "text/html;charset=utf-8" });
        dlLink.href = URL.createObjectURL(blob);
        dlLink.download = artifact.filename || "preview.html";
    } else {
        dlLink.hidden = true;
    }

    if (artifact.type === "image") {
        bodyEl.innerHTML = `<img src="${artifact.data_url}" alt="Preview Image" />`;
    } else if (artifact.type === "pdf") {
        bodyEl.innerHTML = `<iframe src="${artifact.data_url}"></iframe>`;
    } else if (artifact.type === "docx") {
        const div = document.createElement("div");
        div.className = "artifact-doc-preview";
        div.dir = isRTL(artifact.text) ? "rtl" : "ltr";
        div.textContent = artifact.text;
        bodyEl.appendChild(div);
    } else if (artifact.type === "html") {
        const iframe = document.createElement("iframe");
        iframe.sandbox = "allow-scripts allow-modals";
        iframe.srcdoc = sanitizePreviewHtml(artifact.html);
        bodyEl.appendChild(iframe);
    }

    panel.style.width = "420px";
    panel.hidden = false;
    document.body.classList.add("right-panel-open");
    document.body.classList.remove("right-panel-collapsed");
}

const _baseAddMessage = addMessage;
addMessage = function(role, content, messageId = null) {
    if (role === "user") {
        const imgMatch = String(content).match(/!\[([^\]]*)\]\((data:image\/[^)]+)\)/);
        const fileMatch = String(content).match(/📎\s*\[([^\]]+)\]/);

        if (imgMatch || fileMatch) {
            setConversationView(true);
            const cleanText = String(content)
                .replace(/!\[([^\]]*)\]\((data:image\/[^)]+)\)/g, "")
                .replace(/📎\s*\[([^\]]+)\]/g, "")
                .trim();

            const wrapper = document.createElement("div");
            wrapper.className = "message user";
            wrapper.dataset.rawText = content;
            if (messageId) wrapper.dataset.messageId = messageId;

            if (imgMatch) {
                const thumbBox = document.createElement("div");
                thumbBox.className = "user-msg-thumb-card";
                thumbBox.title = "Click to preview full image";
                thumbBox.innerHTML = `<img src="${imgMatch[2]}" alt="${imgMatch[1] || "Image"}" />`;
                thumbBox.onclick = () => openRightArtifactPanel({
                    type: "image",
                    filename: imgMatch[1] || "uploaded_image.png",
                    data_url: imgMatch[2]
                });
                wrapper.appendChild(thumbBox);
            } else if (fileMatch) {
                const filePill = document.createElement("div");
                filePill.className = "user-msg-file-card";
                filePill.innerHTML = `<span>📄</span><strong>${fileMatch[1]}</strong>`;
                wrapper.appendChild(filePill);
            }

            if (cleanText) {
                const bubble = document.createElement("div");
                bubble.className = "bubble";
                bubble.textContent = cleanText;
                applyBubbleDirection(bubble, cleanText);
                wrapper.appendChild(bubble);
            }

            const actionsBar = document.createElement("div");
            actionsBar.className = "message-actions-bar";

            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "icon-action-btn";
            copyBtn.title = currentLanguage === "ar" ? "نسخ" : "Copy";
            copyBtn.innerHTML = SVG_ICONS.copy;
            copyBtn.onclick = async () => {
                await navigator.clipboard.writeText(cleanText || content);
                copyBtn.innerHTML = SVG_ICONS.check;
                setTimeout(() => { copyBtn.innerHTML = SVG_ICONS.copy; }, 1600);
            };

            actionsBar.appendChild(copyBtn);
            wrapper.appendChild(actionsBar);

            messages.appendChild(wrapper);
            messages.scrollTop = messages.scrollHeight;
            return wrapper;
        }
    }

    return _baseAddMessage(role, content, messageId);
};

const _origRenderBubbleContent = renderBubbleContent;
renderBubbleContent = function(bubble, text, isStreaming = false) {
    _origRenderBubbleContent(bubble, text, isStreaming);
    enhanceQuranBlocks(bubble);
    enhanceSavedArtifacts(bubble);

    bubble.querySelectorAll("img").forEach(img => {
        img.style.cursor = "pointer";
        img.title = "Click to open in side panel";
        img.onclick = () => openRightArtifactPanel({
            type: "image",
            filename: "aurelius_image.png",
            data_url: img.src
        });
    });

    bubble.querySelectorAll(".code-box-wrapper").forEach(wrapper => {
        const lang = wrapper.querySelector(".code-lang")?.textContent?.trim();
        const actions = wrapper.querySelector(".code-header-actions");
        if (!actions || actions.querySelector(".run-code-btn")) return;

        if (["html", "javascript", "js", "css"].includes(lang)) {
            const runBtn = document.createElement("button");
            runBtn.type = "button";
            runBtn.className = "box-icon-btn run-code-btn";
            runBtn.title = "Run in Side Panel";
            runBtn.innerHTML = `<svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;
            runBtn.onclick = () => {
                const codeText = wrapper.querySelector("code")?.innerText || "";
                const htmlDoc = lang === "html"
                    ? codeText
                    : `<!DOCTYPE html><html dir="auto"><head><meta charset="utf-8"><style>body{font-family:sans-serif;padding:20px;}</style></head><body><pre id="out"></pre><script>console.log=(...a)=>{document.getElementById('out').textContent+=a.join(' ')+'\\n'};${codeText}<\/script></body></html>`;
                openRightArtifactPanel({ type: "html", filename: `run.${lang === "html" ? "html" : "js"}`, html: htmlDoc });
            };
            actions.prepend(runBtn);
        }
    });
};

(function setupGeminiStyleComposer() {
    if (!chatForm || !messageInput || document.getElementById("attachFileBtn")) return;

    const composerBottom = chatForm.querySelector(".composer-bottom");
    const composerHint = composerBottom?.querySelector(".composer-hint");

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "multimodalFileInput";
    fileInput.accept = "image/*,.pdf,.docx,.txt,.py,.js,.html,.css,.json";
    fileInput.hidden = true;

    const attachBtn = document.createElement("button");
    attachBtn.type = "button";
    attachBtn.id = "attachFileBtn";
    attachBtn.className = "gemini-plus-btn";
    attachBtn.title = "Add files or images";
    attachBtn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`;

    const previewShelf = document.createElement("div");
    previewShelf.id = "composerPreviewShelf";
    previewShelf.className = "composer-preview-shelf";
    previewShelf.hidden = true;
    chatForm.insertBefore(previewShelf, messageInput);

    if (composerBottom) {
        if (composerHint) composerHint.remove();
        composerBottom.prepend(attachBtn);
    }

    function clearPendingAttachment() {
        pendingAttachmentFile = null;
        pendingAttachmentPreviewUrl = null;
        fileInput.value = "";
        previewShelf.innerHTML = "";
        previewShelf.hidden = true;
        if (sendBtn && !isGenerating) {
            sendBtn.disabled = !messageInput.value.trim();
        }
    }

    attachBtn.onclick = () => fileInput.click();

    fileInput.onchange = async () => {
        const f = fileInput.files?.[0];
        if (!f) return;
        pendingAttachmentFile = f;

        if (f.type.startsWith("image/")) {
            pendingAttachmentPreviewUrl = await readFileAsDataURL(f);
            previewShelf.innerHTML = `
                <div class="composer-thumb-item">
                    <img src="${pendingAttachmentPreviewUrl}" alt="${f.name}" />
                    <button type="button" class="composer-thumb-remove" title="Remove">×</button>
                </div>
            `;
        } else {
            pendingAttachmentPreviewUrl = null;
            previewShelf.innerHTML = `
                <div class="composer-file-item">
                    <span class="file-badge">📄</span>
                    <span class="file-name">${f.name}</span>
                    <button type="button" class="composer-thumb-remove" title="Remove">×</button>
                </div>
            `;
        }

        previewShelf.hidden = false;
        previewShelf.querySelector(".composer-thumb-remove").onclick = clearPendingAttachment;
        if (sendBtn) sendBtn.disabled = false;
        messageInput.focus();
    };

    chatForm.addEventListener("submit", async (e) => {
        if (!pendingAttachmentFile) return;
        e.preventDefault();
        e.stopImmediatePropagation();

        if (isGenerating) return;
        const text = messageInput.value.trim();
        const fileToSend = pendingAttachmentFile;
        const previewDataUrl = pendingAttachmentPreviewUrl;

        clearPendingAttachment();

        if (!currentChatId) {
            await createChat(text || fileToSend.name);
        }

        if (fileToSend.type.startsWith("image/") && previewDataUrl) {
            addMessage("user", `${text}\n![${fileToSend.name}](${previewDataUrl})`.trim());
        } else {
            addMessage("user", `${text}\n📎 [${fileToSend.name}]`.trim());
        }

        currentChatHasMessages = true;
        messageInput.value = "";
        messageInput.style.height = "auto";

        setGeneratingState(true);
        const thinkingMsg = addThinkingMessage();
        let aiWrapper = null;
        let aiBubble = null;
        let statusPill = null;
        let fullText = "";

        currentAbortController = new AbortController();

        const formData = new FormData();
        formData.append("chat_id", String(currentChatId));
        formData.append("message", text);
        formData.append("mode", currentThinkingMode);
        formData.append("file", fileToSend);

        try {
            const response = await fetch(`${API_BASE}/chat/stream-multimodal`, {
                method: "POST",
                signal: currentAbortController.signal,
                headers: { "Authorization": `Bearer ${getAccessToken()}` },
                body: formData
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(errData.detail || "Failed to process attachment.");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder("utf-8");
            let buffer = "";

            while (true) {
                const { value, done } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const lines = buffer.split("\n\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const payload = JSON.parse(line.slice(6));

                    if (payload.error) throw new Error(payload.error);

                    if (payload.status) {
                        thinkingMsg?.remove();
                        if (!aiWrapper) {
                            aiWrapper = addMessage("ai", "");
                            aiBubble = aiWrapper.querySelector(".bubble");
                        }
                        if (!statusPill) {
                            statusPill = document.createElement("div");
                            statusPill.className = "generation-status-pill";
                            aiBubble.appendChild(statusPill);
                        }
                        statusPill.textContent = `⏳ ${payload.status}`;
                    }

                    if (payload.artifact) {
                        statusPill?.remove();
                        statusPill = null;
                        openRightArtifactPanel(payload.artifact);
                    }

                    if (payload.chunk) {
                        thinkingMsg?.remove();
                        statusPill?.remove();
                        statusPill = null;
                        if (!aiWrapper) {
                            aiWrapper = addMessage("ai", "");
                            aiBubble = aiWrapper.querySelector(".bubble");
                        }
                        fullText += payload.chunk;
                        renderBubbleContent(aiBubble, fullText, true);
                        messages.scrollTop = messages.scrollHeight;
                    }

                    if (payload.done && aiBubble) {
                        const finalReply = payload.reply || fullText;
                        aiWrapper.dataset.rawText = finalReply;
                        renderBubbleContent(aiBubble, finalReply, false);
                    }
                }
            }
            await loadChats();
        } catch (err) {
            thinkingMsg?.remove();
            if (err.name === "AbortError") {
                if (aiBubble && fullText) {
                    aiWrapper.dataset.rawText = fullText;
                    renderBubbleContent(aiBubble, fullText, false);
                }
                showToast(currentLanguage === "ar" ? "تم إيقاف التوليد." : "Generation stopped.");
            } else {
                addMessage("ai", `**Error:** ${err.message}`);
            }
        } finally {
            currentAbortController = null;
            setGeneratingState(false);
            messageInput?.focus();
        }
    }, true);
})();


/* ============================================================
   INITIALIZATION
   ============================================================ */

async function init() {
    loadAppearance();
    applyLanguage(currentLanguage);
    setThinkingMode(currentThinkingMode);
    setConversationView(false);
    if (sendBtn) sendBtn.disabled = true;
    updateLoginButton();

    const cachedUser = getStoredUser();
    if (getAccessToken() && cachedUser) {
        updateProfile(cachedUser);
    }

    const receivedOAuth = handleOAuthCallbackFromURL();

    if (receivedOAuth || getAccessToken()) {
        await loadCurrentUser();
    } else {
        openAuth("login");
    }
}

// ── شريط Copy & Download فوق الصور المولدة في الشات ──
(function initGeneratedImageToolbar() {
    function attachToolbarToImage(img) {
        if (!img || img.dataset.toolbarAttached === "true") return;
        const isAssistantImg = img.closest(".assistant, .assistant-message, .bot-message, [data-role='assistant']");
        if (!isAssistantImg || img.classList.contains("avatar")) return;

        img.dataset.toolbarAttached = "true";

        const wrapper = document.createElement("div");
        wrapper.className = "generated-img-wrapper";

        const actions = document.createElement("div");
        actions.className = "generated-img-actions";
        actions.addEventListener("click", (e) => e.stopPropagation());

        const copyIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        const checkIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4ade80" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
        const downloadIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="8 12 12 16 16 12"></polyline><line x1="12" y1="8" x2="12" y2="16"></line></svg>`;

        const copyBtn = document.createElement("button");
        copyBtn.type = "button";
        copyBtn.className = "img-action-btn";
        copyBtn.title = "Copy image";
        copyBtn.innerHTML = copyIcon;
        copyBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const res = await fetch(img.src);
                const blob = await res.blob();
                await navigator.clipboard.write([
                    new ClipboardItem({ [blob.type || "image/png"]: blob })
                ]);
                copyBtn.innerHTML = checkIcon;
                setTimeout(() => { copyBtn.innerHTML = copyIcon; }, 1500);
            } catch (err) {
                console.error("Image copy failed:", err);
            }
        });

        const downloadBtn = document.createElement("button");
        downloadBtn.type = "button";
        downloadBtn.className = "img-action-btn";
        downloadBtn.title = "Download image";
        downloadBtn.innerHTML = downloadIcon;
        downloadBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            e.stopPropagation();
            try {
                const res = await fetch(img.src);
                const blob = await res.blob();
                const blobUrl = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = blobUrl;
                a.download = `aurelius_image_${Date.now()}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
            } catch (err) {
                console.error("Image download failed:", err);
            }
        });

        actions.appendChild(copyBtn);
        actions.appendChild(downloadBtn);

        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(actions);
        wrapper.appendChild(img);
    }

    const observer = new MutationObserver(() => {
        document.querySelectorAll("img").forEach(attachToolbarToImage);
    });
    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll("img").forEach(attachToolbarToImage);
})();

init();