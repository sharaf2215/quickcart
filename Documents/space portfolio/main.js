import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import ScrollToPlugin from 'gsap/ScrollToPlugin';

console.log("System: CORE MODULE CONNECTED");

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
const COLORS = {
    mentor1: 0x4a9eff, // Blue
    mentor2: 0xff4a8d, // Pink
    mentor3: 0x4affaa, // Green
    mentor4: 0xff8800, // Gold/Orange
    sun: 0xffaa00,     // Orange/Gold
    core1: 0x00d4ff,   // Cyan
    core2: 0x9b59b6,   // Purple
    core3: 0xffaa00,   // Gold
    core4: 0x2ecc71    // Green
};

// ------------------------------------------------------------------
// UTILS: PROCEDURAL TEXTURES
// ------------------------------------------------------------------
function createCircleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}

function createSquareTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64; canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(8, 8, 48, 48); // A simple square
    return new THREE.CanvasTexture(canvas);
}

function createTextTexture(text, color = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, 512, 128);
    ctx.fillStyle = color;
    ctx.font = 'bold italic 88px Outfit, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Glow shadow
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
    ctx.fillText(text.toUpperCase(), 256, 64);
    return new THREE.CanvasTexture(canvas);
}

function createNoiseTexture(size = 512, colorHex, complexity = 4) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, size, size);

    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    for (let i = 0; i < data.length; i += 4) {
        let v = 0;
        let freq = 1;
        let amp = 1;
        const x = (i / 4 % size);
        const y = Math.floor(i / 4 / size);

        for (let oct = 0; oct < complexity; oct++) {
            v += Math.sin(x * 0.02 * freq) * Math.cos(y * 0.02 * freq) * amp;
            freq *= 2.1;
            amp *= 0.5;
        }

        const brightness = (v + 1) * 75 + 20;
        const c = new THREE.Color(colorHex || '#ffffff');
        data[i] = c.r * brightness;
        data[i + 1] = c.g * brightness;
        data[i + 2] = c.b * brightness;
        data[i + 3] = 255;
    }

    ctx.putImageData(imgData, 0, 0);
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createGasTexture(size = 512, colorHex) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Gas Bands
    const grad = ctx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, '#000');
    grad.addColorStop(0.3, colorHex || '#ff00ff');
    grad.addColorStop(0.5, '#111');
    grad.addColorStop(0.7, colorHex || '#00ffff');
    grad.addColorStop(1, '#000');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Noise detail
    for (let i = 0; i < 40; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        ctx.fillRect(0, Math.random() * size, size, Math.random() * 5 + 1);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createCloudTexture(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, size, size);

    for (let i = 0; i < size * size / 50; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const r = Math.random() * 2 + 1;
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.2})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    return tex;
}

function createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.2, 'rgba(255,255,255,0.2)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
}

function createStudentTexture(id) {
    const loader = new THREE.TextureLoader();
    // Default to the procedural texture while loading
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${(id * 40) % 360}, 70%, 50%)`;
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${id}`, 64, 64);

    const tex = new THREE.CanvasTexture(canvas);

    // Attempt to load the real photo
    loader.load(
        `assets/student${id}.jpg`,
        (loadedTex) => {
            tex.image = loadedTex.image;
            tex.needsUpdate = true;
        },
        undefined,
        () => { /* Quiet fail, keep procedural */ }
    );

    return tex;
}

function createDataPanelTexture(title, subtitle) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Transparent background
    ctx.clearRect(0, 0, 512, 256);

    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(title, 10, 50);

    ctx.font = '32px Arial';
    ctx.fillStyle = '#aaaaaa';
    ctx.fillText(subtitle, 10, 100);

    return new THREE.CanvasTexture(canvas);
}

function createPortraitTexture(name, color) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 340;
    const ctx = canvas.getContext('2d');

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 340);
    grad.addColorStop(0, color || '#222');
    grad.addColorStop(1, '#000');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 340);

    // Modern Silhouette
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.arc(128, 120, 70, 0, Math.PI * 2); // Head
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(128, 320, 110, 150, 0, 0, Math.PI * 2); // Body
    ctx.fill();

    // Border with Glow
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, 236, 320);

    return new THREE.CanvasTexture(canvas);
}


// ------------------------------------------------------------------
// MAIN CLASS
// ------------------------------------------------------------------
class CosmicJourney {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 50000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });

        this.objects = {
            mentors: [],
            sun: null,
            branches: [],
            galaxies: [],
            coreMembers: [],
            dataBackground: null,
            studentTokens: [] // For raycasting
        };

        this.raycaster = new THREE.Raycaster();
        this.mousePos = new THREE.Vector2();
        this.mouse = { x: 0, y: 0, isDown: false };
        this.sunRotationTarget = { x: 0, y: 0 };
        this.sunRotationCurrent = { x: 0, y: 0 };

        // Dynamic Look-At Target
        this.lookAtTarget = new THREE.Vector3(0, 0, -1000);

        // Scene adjustments
        this.scene.fog = new THREE.FogExp2(0x000000, 0.00005);
        this.init();
    }

    init() {
        console.log("System: INITIALIZING COSMIC JOURNEY...");

        // 1. Immediate UI Setup (Ensures button works even if 3D takes time)
        this.setupUI();

        // Renderer Setup
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        this.container.appendChild(this.renderer.domElement);

        // Lighting - REFINED
        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambient);

        const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
        this.scene.add(hemi);

        this.sunLight = new THREE.PointLight(0xffaa00, 6.0, 35000);
        this.sunLightPosition = new THREE.Vector3(0, 0, -10000);
        this.sunLight.position.copy(this.sunLightPosition);
        this.scene.add(this.sunLight);

        // Click interaction for students
        window.addEventListener('click', (e) => this.handlePick(e));
        window.addEventListener('mousemove', (e) => {
            this.mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Headlight (Balanced searchlight)
        this.headlight = new THREE.PointLight(0xffffff, 2.5, 10000);
        this.scene.add(this.headlight);

        // Build World (In background)
        try {
            this.createStarfield();
            this.createNebulae();
            this.createCosmicDust(); // New background detail
            this.createDataBackground();
            this.createMentors();
            this.createMentorGalaxy();
            this.createSunSystem();
            this.createCoreGalaxies();
            console.log("System: WORLD ASSETS GENERATED.");
        } catch (err) {
            console.error("System: Error generating world:", err);
        }

        // Interaction for Sun
        window.addEventListener('mousedown', () => this.mouse.isDown = true);
        window.addEventListener('mouseup', () => this.mouse.isDown = false);
        window.addEventListener('mousemove', (e) => {
            if (this.mouse.isDown && this.objects.sun) {
                this.sunRotationTarget.y += e.movementX * 0.005;
                this.sunRotationTarget.x += e.movementY * 0.005;
            }
        });

        // Setup Camera Start
        this.camera.position.set(0, 50, 2000); // Backed up a bit
        this.camera.lookAt(0, 0, -1000);

        // Setup GSAP & Animation
        this.setupScroll();
        this.animate();

        // Final UI Polish
        this.hideLoader();
        console.log("System: NAVIGATION ARRAYS ONLINE.");

        // Resize Handler
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
            ScrollTrigger.refresh();
        });
    }

    // ... (World Init) ...

    setupUI() {
        const btn = document.getElementById('enter-btn');
        const welcomeScreen = document.getElementById('welcome-screen');
        const scrollContent = document.getElementById('scroll-content');

        if (btn) {
            btn.addEventListener('click', () => {
                console.log("System: SEQUENCE INITIATED BY USER.");

                // 1. Visual feedback on button
                gsap.to(btn, {
                    scale: 0.9,
                    opacity: 0,
                    duration: 0.3,
                    pointerEvents: 'none'
                });

                // 2. Hide welcome screen
                welcomeScreen.classList.add('hidden'); // Immediate signal
                gsap.to(welcomeScreen, {
                    opacity: 0,
                    duration: 0.8,
                    ease: "power2.inOut",
                    onComplete: () => {
                        welcomeScreen.style.display = 'none';
                    }
                });

                // 3. Unlock Scroll
                if (scrollContent) {
                    scrollContent.style.display = 'block';
                    console.log("System: SCROLL ENGINE ENGAGED.");
                }

                document.body.style.overflow = 'auto';
                document.documentElement.style.overflow = 'auto';
                document.body.style.height = 'auto';

                // 4. Force refresh and jump to start of timeline
                setTimeout(() => {
                    ScrollTrigger.refresh();

                    // First set immediate scroll to ensure triggers are active
                    window.scrollTo(0, 1);

                    // Then smooth scroll into the first mentor
                    if (window.gsap && window.gsap.plugins && window.gsap.plugins.scrollTo) {
                        gsap.to(window, {
                            scrollTo: window.innerHeight * 0.5,
                            duration: 2.5,
                            ease: "power3.inOut"
                        });
                    } else {
                        // Fallback if plugin failed
                        window.scrollTo({
                            top: window.innerHeight * 0.5,
                            behavior: 'smooth'
                        });
                    }
                }, 50);
            });

            // Modal Close
            const modal = document.getElementById('student-profile-modal');
            const closeBtn = document.getElementById('modal-close');
            if (closeBtn && modal) {
                closeBtn.addEventListener('click', () => {
                    modal.classList.add('hidden');
                    document.body.style.overflow = 'auto'; // Re-enable scroll if needed
                });
            }

            console.log("System: UI EVENT HANDLERS READY.");

            // Top Navigation Menu Logic
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetLabel = link.getAttribute('data-target');
                    if (this.tl) {
                        const scrollPos = this.tl.scrollTrigger.labelToScroll(targetLabel);
                        gsap.to(window, {
                            scrollTo: scrollPos,
                            duration: 2.5,
                            ease: "power3.inOut"
                        });
                    }
                });
            });
        } else {
            console.error("System: Enter button not found!");
        }
    }

    hideLoader() {
        const loader = document.getElementById('loader');
        if (!loader) return;

        // Phase 1: Fade out the loader FIRST
        gsap.to(loader, {
            opacity: 0,
            duration: 1.5,
            delay: 0.8, // Brief hold so user sees the loader
            ease: "power2.inOut",
            onComplete: () => {
                loader.style.display = 'none';
                if (loader.parentNode) loader.remove();
                console.log("System: BOOT SEQUENCE COMPLETE.");

                // Phase 2: Animate welcome screen in AFTER loader is gone
                const welcome = document.getElementById('welcome-screen');
                if (!welcome) return;

                // Make the container visible
                gsap.to(welcome, { opacity: 1, duration: 0.1 });

                // Staggered cinematic reveal of each element
                const elements = [
                    welcome.querySelector('.explore-text'),
                    welcome.querySelector('.main-title'),
                    welcome.querySelector('.protocol-text'),
                    welcome.querySelector('.initiate-btn')
                ].filter(Boolean);

                gsap.to(elements, {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.25,
                    ease: "power3.out",
                    onStart: () => {
                        // Enable button clicks only after it appears
                        const btn = document.getElementById('enter-btn');
                        if (btn) btn.style.pointerEvents = 'auto';
                    }
                });
            }
        });
    }

    // ------------------------------------------------------------------
    // CREATION: ENVIRONMENT (STARS & NEBULAE)
    // ------------------------------------------------------------------
    createStarfield() {
        const count = 25000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        const starColors = [0xffffff, 0xddeeff, 0xffeedd, 0xffcccc, 0xffaa00];

        for (let i = 0; i < count; i++) {
            const r = 35000 * Math.random(); // Increased radius
            const theta = 2 * Math.PI * Math.random();
            const phi = Math.acos(2 * Math.random() - 1);

            pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            pos[i * 3 + 2] = (Math.random() - 0.5) * 100000; // Deep depth

            const c = new THREE.Color(starColors[Math.floor(Math.random() * starColors.length)]);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 2,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        this.scene.add(new THREE.Points(geo, mat));
    }

    createNebulae() {
        // Create soft colorful background clouds using textured sprites
        const nebulaTex = createGlowTexture();
        for (let i = 0; i < 20; i++) { // More nebulae
            const count = 300;
            const geo = new THREE.BufferGeometry();
            const pos = new Float32Array(count * 3);
            const col = new Float32Array(count * 3);

            const basePos = new THREE.Vector3(
                (Math.random() - 0.5) * 15000,
                (Math.random() - 0.5) * 15000,
                -Math.random() * 35000 // Deeper range
            );

            const colors = [0x00f2ff, 0x9b59b6, 0xff00ff, 0x27c93f, 0xffaa00];
            const baseColor = new THREE.Color(colors[i % colors.length]);

            for (let j = 0; j < count; j++) {
                pos[j * 3] = basePos.x + (Math.random() - 0.5) * 6000;
                pos[j * 3 + 1] = basePos.y + (Math.random() - 0.5) * 6000;
                pos[j * 3 + 2] = basePos.z + (Math.random() - 0.5) * 6000;

                col[j * 3] = baseColor.r;
                col[j * 3 + 1] = baseColor.g;
                col[j * 3 + 2] = baseColor.b;
            }

            geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

            const mat = new THREE.PointsMaterial({
                size: 800, // Massive cloud sprites
                map: nebulaTex,
                vertexColors: true,
                transparent: true,
                opacity: 0.08, // More visible
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            this.scene.add(new THREE.Points(geo, mat));
        }
    }

    createCosmicDust() {
        const count = 3000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const col = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 5000;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 5000;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 20000;

            const c = new THREE.Color(Math.random() > 0.5 ? 0x00f2ff : 0xffaa00);
            col[i * 3] = c.r;
            col[i * 3 + 1] = c.g;
            col[i * 3 + 2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 15,
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            map: createCircleTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const dust = new THREE.Points(geo, mat);
        this.scene.add(dust);
        this.objects.dust = dust;
    }

    createDataBackground() {
        // Specific blocky/data background for Planet section
        const group = new THREE.Group();
        this.scene.add(group);
        this.objects.dataBackground = group;

        // 1. Blocky Particles (Large Purple Squares)
        const count = 100;
        const squareGeo = new THREE.PlaneGeometry(300, 300);
        const squareMat = new THREE.MeshBasicMaterial({
            color: 0x9b59b6,
            transparent: true,
            opacity: 0.05,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        });

        for (let i = 0; i < count; i++) {
            const square = new THREE.Mesh(squareGeo, squareMat);
            square.position.set(
                (Math.random() - 0.5) * 15000,
                (Math.random() - 0.5) * 15000,
                -Math.random() * 8000
            );
            square.rotation.z = Math.random() * Math.PI;
            group.add(square);
        }

        // 2. Data Dots (Small Cyan Squares)
        const dotCount = 1000;
        const dotGeo = new THREE.BufferGeometry();
        const dotPos = [];
        for (let i = 0; i < dotCount; i++) {
            dotPos.push(
                (Math.random() - 0.5) * 15000,
                (Math.random() - 0.5) * 15000,
                -Math.random() * 8000
            );
        }
        dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPos, 3));
        const dotMat = new THREE.PointsMaterial({
            color: 0x00f2ff,
            size: 15,
            transparent: true,
            opacity: 0.3,
            map: createSquareTexture()
        });
        group.add(new THREE.Points(dotGeo, dotMat));
    }


    // ------------------------------------------------------------------
    // CREATION: MENTORS
    // ------------------------------------------------------------------
    createMentors() {
        // Mentor 1: Santushta Iyer (Terrestrial)
        const m1 = this.createPlanet({
            id: 1,
            color: COLORS.mentor1,
            size: 350, // Massive Increase
            pos: { x: -1600, y: 0, z: -1500 }, // Pushed wider
            name: "Santushta Iyer",
            role: "Mentor",
            desc: "Expert handling FEWD and BOE subjects, crafting high-performance front-end architectures and operational excellence.",
            side: 'left',
            type: 'terrestrial',
            linkedin: "https://www.linkedin.com/in/santushta-iyer-a-99862a25b",
            github: "https://github.com",
            email: "mailto:mentor1@example.com"
        });

        // Mentor 2: Hanuram T (Gas Giant)
        const m2 = this.createPlanet({
            id: 2,
            color: COLORS.mentor2,
            size: 450, // Massive Increase
            pos: { x: 1800, y: 150, z: -3500 }, // Pushed wider
            name: "Hanuram T",
            role: "Mentor",
            desc: "Specialist in FEWD and BOE subjects, dedicated to bridging the gap between design and scalable engineering.",
            side: 'right',
            type: 'gas',
            hasRings: true,
            linkedin: "https://www.linkedin.com/in/hanuram-t",
            github: "https://github.com",
            email: "mailto:mentor2@example.com"
        });

        // Mentor 3: Karunakaran (KK) (Alien Jungle)
        const m3 = this.createPlanet({
            id: 3,
            color: COLORS.mentor3,
            size: 320, // Massive Increase
            pos: { x: -1600, y: -100, z: -5500 }, // Pushed wider
            name: "Karunakaran (KK)",
            role: "Mentor",
            desc: "Strategist in English LSRW and Critical Thinking, empowering students with elite communication and analytical skills.",
            side: 'left',
            type: 'terrestrial',
            linkedin: "https://www.linkedin.com/in/h-karunakaran-3b1285376",
            github: "https://github.com",
            email: "mailto:mentor3@example.com"
        });

        // Mentor 4: Arvind (Ice Giant)
        const m4 = this.createPlanet({
            id: 4,
            color: COLORS.mentor4,
            size: 400, // Massive Increase
            pos: { x: 1800, y: -200, z: -7000 }, // Pushed wider
            name: "Arvind",
            role: "Expert",
            desc: "Maestro of PSUP and Engineering Maths, solving complex equations and building logical foundations for explorers.",
            side: 'right',
            type: 'gas',
            linkedin: "https://www.linkedin.com/in/aravind-r-812634245",
            github: "https://github.com",
            email: "mailto:mentor4@example.com"
        });

        this.objects.mentors = [m1, m2, m3, m4];
    }

    createMentorGalaxy() {
        // A huge distant spiral galaxy as background for the planet section
        const group = new THREE.Group();
        group.position.set(2000, 2000, -8000);
        this.scene.add(group);

        const count = 5000;
        const geo = new THREE.BufferGeometry();
        const pos = [];
        const col = [];
        const baseColor = new THREE.Color(COLORS.mentor1);

        for (let i = 0; i < count; i++) {
            const r = Math.random() * 5000;
            const angle = Math.random() * Math.PI * 2;
            const arms = 3;
            const armOffset = (i % arms) * (Math.PI * 2 / arms);
            const spiral = r * 0.001;
            const x = Math.cos(angle + spiral + armOffset) * r;
            const y = Math.sin(angle + spiral + armOffset) * r;
            const z = (Math.random() - 0.5) * 500;

            pos.push(x, y, z);
            col.push(baseColor.r, baseColor.g, baseColor.b);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 15,
            vertexColors: true,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const points = new THREE.Points(geo, mat);
        group.add(points);
        this.objects.mentorGalaxy = group;
    }

    createPlanet(config) {
        const group = new THREE.Group();
        group.position.set(config.pos.x, config.pos.y, config.pos.z);

        // 1. Planet Core (Terrain/Gas)
        const geo = new THREE.SphereGeometry(config.size, 64, 64);
        const tex = config.type === 'gas'
            ? createGasTexture(512, new THREE.Color(config.color).getStyle())
            : createNoiseTexture(512, new THREE.Color(config.color).getStyle(), 4);

        const mat = new THREE.MeshPhongMaterial({
            map: tex,
            bumpMap: tex,
            bumpScale: 10,
            shininess: 30,
            emissive: new THREE.Color(config.color),
            emissiveIntensity: 0.8 // High self-glow
        });
        const planet = new THREE.Mesh(geo, mat);
        group.add(planet);

        // 2. Cloud Layer (Atmospheric depth)
        const cloudGeo = new THREE.SphereGeometry(config.size + 2, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
            map: createCloudTexture(1024),
            transparent: true,
            opacity: 0.3,
            blending: THREE.AdditiveBlending
        });
        const clouds = new THREE.Mesh(cloudGeo, cloudMat);
        group.add(clouds);
        group.userData.clouds = clouds;

        // 3. Atmosphere (Outer Fresnel Glow)
        const atmoGeo = new THREE.SphereGeometry(config.size * 1.25, 64, 64);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: config.color,
            transparent: true,
            opacity: 0.1,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        group.add(new THREE.Mesh(atmoGeo, atmoMat));

        // 4. Rings (Optional)
        if (config.hasRings) {
            const ringGeo = new THREE.RingGeometry(config.size * 1.4, config.size * 2.5, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                map: createGasTexture(512, new THREE.Color(config.color).getStyle()),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.4
            });
            const rings = new THREE.Mesh(ringGeo, ringMat);
            rings.rotation.x = Math.PI * 0.4;
            group.add(rings);
            group.userData.rings = rings;
        }

        // Info Line
        const dir = config.side === 'left' ? 1 : -1;
        const lineLen = config.size * 8.0; // Much longer to bridge screen gap
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(lineLen * dir, config.size * 0.5, 0)
        ]);
        const lineMat = new THREE.LineBasicMaterial({ color: config.color, transparent: true, opacity: 0 });
        const line = new THREE.Line(lineGeo, lineMat);
        group.add(line);

        this.scene.add(group);

        return {
            group: group,
            planet: planet,
            clouds: clouds,
            line: line,
            config: config
        };
    }

    // ... (Sun Logic) ...

    // ... (HUD Update Logic) ...
    updateMentorHUD(config) {
        const panel = document.getElementById('mentor-panel');
        const nameEl = document.getElementById('mentor-name');
        const roleEl = document.getElementById('mentor-role');
        const descEl = document.getElementById('mentor-desc');
        const photoContainer = document.querySelector('.mentor-photo');

        nameEl.innerText = config.name;
        roleEl.innerText = "// " + config.role;
        descEl.innerText = config.desc;

        // Image Logic (using placeholders if file not found logic isn't robust, but here we just set src)
        // Ensure image exists or fallback
        // Since we don't have real images, we can use a placeholder generator data URI or color block
        // For now, let's create a dynamic colored block or stick a placeholder image if available
        photoContainer.innerHTML = ''; // Clear
        const img = document.createElement('img');
        // Simple distinct placeholder using https://placehold.co or similar if online, but local is safer
        // Let's use a generated canvas data URL to be safe and cool
        img.src = this.generateAvatar(config.id, config.color);
        photoContainer.appendChild(img);

        // Positioning
        // Remove old classes
        panel.classList.remove('side-left', 'side-right');

        if (config.side === 'left') {
            // Planet Left -> Panel Right
            panel.classList.add('side-right');
        } else {
            // Planet Right -> Panel Left
            panel.classList.add('side-left');
        }
    }

    generateAvatar(id, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');

        // Bg
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, 100, 100);

        // Circle
        ctx.fillStyle = new THREE.Color(colorHex).getStyle();
        ctx.beginPath();
        ctx.arc(50, 50, 40, 0, Math.PI * 2);
        ctx.fill();

        // Text
        ctx.fillStyle = '#000';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(id, 50, 50);

        return canvas.toDataURL();
    }

    // ------------------------------------------------------------------
    // UTILITY: TYPEWRITER EFFECT
    // ------------------------------------------------------------------
    typewriterEffect(elementId, text, speed = 40) {
        const el = document.getElementById(elementId);
        if (!el) return;
        el.textContent = '';
        let i = 0;
        const interval = setInterval(() => {
            el.textContent += text[i];
            i++;
            if (i >= text.length) clearInterval(interval);
        }, speed);
    }

    // ------------------------------------------------------------------
    // CREATION: SUN & BRANCHES
    // ------------------------------------------------------------------
    createSunSystem() {
        const sunZ = -8000;

        // Sun Group
        const sunGroup = new THREE.Group();
        sunGroup.position.set(0, 0, sunZ);
        this.scene.add(sunGroup);
        this.objects.sun = sunGroup;

        // Sun Mesh
        const geo = new THREE.SphereGeometry(250, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
            color: COLORS.sun,
            emissive: COLORS.sun,
            emissiveIntensity: 2.5, // Ultimate Sun Glow
            map: createNoiseTexture(512, '#ff8800', 3)
        });
        const sun = new THREE.Mesh(geo, mat);
        sunGroup.add(sun);

        const folksMat = new THREE.SpriteMaterial({
            map: createTextTexture("FOLKS", "#00f2ff"),
            transparent: true,
            opacity: 1.0,
            blending: THREE.AdditiveBlending,
            depthTest: false
        });
        const folks = new THREE.Sprite(folksMat);
        folks.scale.set(200, 60, 1); // Compact, inside sun
        folks.position.set(0, 0, 260); // On sun face, centered
        sunGroup.add(folks);
        this.objects.folks = folks;

        // Corona
        const corona = new THREE.Mesh(
            new THREE.SphereGeometry(280, 64, 64), // Reduced from 450
            new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
        );
        sunGroup.add(corona);

        // "FOLKS" Text Floating Above
        // (Handled by simple HTML Overlay or just omitted for pure visual flow? Request says "Text above: 'FOLKS'". I'll stick to CSS overlay for crisp text)

        // Branch Sets: 8 + 8 + 8 = 24 students
        // Each set is shown sequentially during the sun scroll sequence
        this.createBranchSet(sunGroup, 8, 0);
        this.createBranchSet(sunGroup, 8, 1);
        this.createBranchSet(sunGroup, 8, 2);
    }

    createBranchSet(parent, count, setIndex) {
        const setGroup = new THREE.Group();
        parent.add(setGroup);
        if (!this.objects.branches[setIndex]) this.objects.branches[setIndex] = setGroup;

        // Hide initially
        setGroup.visible = false;

        let idBase = setIndex * 8 + 1;

        for (let i = 0; i < count; i++) {
            const studentId = idBase + i;
            const angle = (i / count) * Math.PI * 2 + (setIndex * 1.5); // More distinct rotation per set
            const dist = 600 + Math.random() * 150; // Increased distance
            const x = Math.cos(angle) * dist;
            const y = Math.sin(angle) * dist;
            const z = (Math.random() - 0.5) * 300;

            // Generate unique color for this student
            const hue = (studentId * 137.5) % 360; // Golden angle for distribution
            const studentColor = new THREE.Color(`hsl(${hue}, 80%, 60%)`);


            // Lines removed — clean solar system look


            // Student Token (Glowing Round with Ring)
            const tokenGroup = new THREE.Group();
            tokenGroup.position.set(x, y, z);
            setGroup.add(tokenGroup);

            // 1. The Core Portrait Disc — load real photo at full quality
            const discGeo = new THREE.CircleGeometry(70, 64);
            const discMat = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            const disc = new THREE.Mesh(discGeo, discMat);
            tokenGroup.add(disc);

            // Direct TextureLoader — no canvas pipeline, max quality
            new THREE.TextureLoader().load(
                `assets/student${studentId}.jpg`,
                (tex) => {
                    tex.minFilter = THREE.LinearFilter;
                    disc.material.map = tex;
                    disc.material.needsUpdate = true;
                },
                undefined,
                () => {
                    // Fallback: styled number disc
                    const fb = document.createElement('canvas');
                    fb.width = 256; fb.height = 256;
                    const fc = fb.getContext('2d');
                    fc.beginPath(); fc.arc(128, 128, 124, 0, Math.PI * 2);
                    fc.fillStyle = `hsl(${hue}, 60%, 20%)`; fc.fill();
                    fc.fillStyle = `hsl(${hue}, 90%, 70%)`;
                    fc.font = 'bold 80px Arial';
                    fc.textAlign = 'center'; fc.textBaseline = 'middle';
                    fc.fillText(studentId, 128, 128);
                    disc.material.map = new THREE.CanvasTexture(fb);
                    disc.material.needsUpdate = true;
                }
            );

            // 2. Neon Ring System — Bright core + Outer glow halo
            // Inner bright ring
            const ringGeo = new THREE.RingGeometry(71, 75, 64);
            const ringMat = new THREE.MeshBasicMaterial({
                color: studentColor,
                transparent: true,
                opacity: 1.0,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            tokenGroup.add(ring);

            // Outer soft glow ring
            const outerRingGeo = new THREE.RingGeometry(75, 90, 64);
            const outerRingMat = new THREE.MeshBasicMaterial({
                color: studentColor,
                transparent: true,
                opacity: 0.25,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            tokenGroup.add(new THREE.Mesh(outerRingGeo, outerRingMat));

            // 3. The Glow Aura (COLORFUL)
            const glowMat = new THREE.SpriteMaterial({
                map: createGlowTexture(),
                color: studentColor,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending
            });
            const glow = new THREE.Sprite(glowMat);
            glow.scale.set(200, 200, 1);
            tokenGroup.add(glow);

            // Store for interaction and rotation
            tokenGroup.userData = {
                isStudent: true,
                id: studentId,
                isGroup: true,
                ring: ring,
                rotationSpeed: Math.random() * 0.02 + 0.01
            };

            disc.userData = tokenGroup.userData;
            this.objects.studentTokens.push(disc);
        }
    }

    // ------------------------------------------------------------------
    // CREATION: CORE GALAXIES
    // ------------------------------------------------------------------
    createCoreGalaxies() {
        const startZ = -12000;
        const gap = 4000;

        // 1. Spiral (Cyan)
        this.createGalaxy({
            z: startZ,
            color: COLORS.core1,
            type: 'spiral',
            name: "Core Member 1" // Placeholder
        }, 0);

        // 2. Elliptical (Purple)
        this.createGalaxy({
            z: startZ - gap,
            color: COLORS.core2,
            type: 'elliptical',
            name: "Core Member 2"
        }, 1);

        // 3. Grand Spiral (Gold)
        this.createGalaxy({
            z: startZ - (gap * 2),
            color: COLORS.core3,
            type: 'grand',
            name: "Core Member 3"
        }, 2);

        // 4. Spiral (Green)
        this.createGalaxy({
            z: startZ - (gap * 3),
            color: COLORS.core4,
            type: 'spiral',
            name: "Core Member 4"
        }, 3);
    }

    createGalaxy(config, index) {
        const group = new THREE.Group();
        group.position.set(0, 0, config.z); // Centered on path
        this.scene.add(group);
        this.objects.galaxies.push(group);

        // Particle System
        const pCount = 2000;
        const geo = new THREE.BufferGeometry();
        const pos = [];
        const col = [];
        const baseColor = new THREE.Color(config.color);

        for (let i = 0; i < pCount; i++) {
            // Galaxy Math
            const r = Math.random() * 1000;
            const angle = Math.random() * Math.PI * 2;

            let x, y, z;
            if (config.type === 'spiral' || config.type === 'grand') {
                const arms = config.type === 'grand' ? 5 : 3;
                const armOffset = (i % arms) * (Math.PI * 2 / arms);
                const spiral = r * 0.005;
                const finalAngle = angle + spiral + armOffset;
                x = Math.cos(finalAngle) * r;
                y = Math.sin(finalAngle) * r;
                z = (Math.random() - 0.5) * (100 - r * 0.1);
            } else {
                // Elliptical
                x = Math.cos(angle) * r * 1.5;
                y = Math.sin(angle) * r * 0.8;
                z = (Math.random() - 0.5) * 300;
            }

            pos.push(x, y, z);
            col.push(baseColor.r, baseColor.g, baseColor.b);
        }

        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));

        const mat = new THREE.PointsMaterial({
            size: 4,
            vertexColors: true,
            transparent: true,
            opacity: 0, // Hidden initially
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geo, mat);
        group.add(particles);
        group.userData.particles = particles;

        // Note: 3D Photo Planes removed to prioritize high-quality HUD personnel dossiers.
        this.objects.coreMembers.push({
            group: group,
            config: config
        });
    }

    // ------------------------------------------------------------------
    // ANIMATION LOOP (Dynamic & Professional)
    // ------------------------------------------------------------------
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;

        // 0. Update Camera & Headlight
        if (this.headlight) {
            this.headlight.position.copy(this.camera.position);
        }
        // Use dynamic Look-At target
        this.camera.lookAt(this.lookAtTarget);

        // 1. Rotate Mentors & Students (Spheres)
        this.objects.mentors.forEach(m => {
            m.planet.rotation.y += 0.002;
            if (m.clouds) {
                m.clouds.rotation.y += 0.003;
            }
        });

        this.objects.studentTokens.forEach(token => {
            if (token.parent && token.parent.userData.isGroup) {
                // Billboard: Face the camera
                token.parent.lookAt(this.camera.position);
                // Rotate Ring specifically
                token.parent.userData.ring.rotation.z += token.parent.userData.rotationSpeed;
            }
        });

        // 2. Pulsing Sun & Interactive Rotation
        if (this.objects.sun) {
            // Smoothly interpolate rotation to target
            this.sunRotationCurrent.x += (this.sunRotationTarget.x - this.sunRotationCurrent.x) * 0.1;
            this.sunRotationCurrent.y += (this.sunRotationTarget.y - this.sunRotationCurrent.y) * 0.1;

            this.objects.sun.rotation.y = this.sunRotationCurrent.y;
            this.objects.sun.rotation.x = this.sunRotationCurrent.x;

            const pulse = 1 + Math.sin(time * 2) * 0.02;
            this.objects.sun.scale.set(pulse, pulse, pulse);

            this.objects.sun.children.forEach((child, i) => {
                // Background layers (text & corona) rotate with sun + own drift
                if (i > 0) child.rotation.z += 0.001 * (i % 2 === 0 ? 1 : -1);
            });
        }

        // 3. Background Drifting
        if (this.objects.dataBackground) {
            this.objects.dataBackground.position.z += 0.5; // Slight forward drift
            if (this.objects.dataBackground.position.z > 2000) this.objects.dataBackground.position.z = 0;
        }

        if (this.objects.dust) {
            this.objects.dust.rotation.y += 0.0005;
            this.objects.dust.position.z += 1.0;
            if (this.objects.dust.position.z > 5000) this.objects.dust.position.z = 0;
        }

        if (this.objects.mentorGalaxy) {
            this.objects.mentorGalaxy.rotation.z += 0.0001;
        }
        this.objects.coreMembers.forEach(member => {
            member.group.userData.particles.rotation.z += 0.0002;
        });

        // 4. Interaction Hover Feedback
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects.studentTokens);
        if (intersects.length > 0) {
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }

        this.renderer.render(this.scene, this.camera);
    }

    // ------------------------------------------------------------------
    // GSAP SCROLL ORCHESTRATION
    // ------------------------------------------------------------------
    setupScroll() {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#scroll-content",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5
            }
        });

        // 1. ENTRY -> PLANET 1
        const m1 = this.objects.mentors[0];
        const m1OffsetX = m1.config.side === 'left' ? 750 : -750;

        tl.to(this.camera.position, {
            x: m1.group.position.x + m1OffsetX,
            y: m1.group.position.y + 20,
            z: m1.group.position.z + 350,
            duration: 5,
            ease: "power2.inOut",
            onComplete: () => {
                this.updateMentorHUD(m1.config);
                document.getElementById('mentor-panel').classList.add('visible');
            }
        }, 0);
        this.tl = tl; // Store for global access

        tl.to(this.lookAtTarget, {
            x: m1.group.position.x,
            y: m1.group.position.y,
            z: m1.group.position.z,
            duration: 5,
            ease: "power2.inOut"
        }, 0);

        tl.to('#welcome-screen', { opacity: 0, duration: 1, pointerEvents: "none" }, 0);

        // 2. MENTOR LOOP
        this.objects.mentors.forEach((m, i) => {
            const label = `mentor${i + 1}`;
            tl.addLabel(label);

            const camXOffset = m.config.side === 'left' ? 750 : -750;

            tl.to(this.camera.position, {
                x: m.group.position.x + camXOffset,
                y: m.group.position.y + 20,
                z: m.group.position.z + 1000, // Even further for gargantuan scale
                duration: 5,
                ease: "power2.inOut",
                onStart: () => {
                    document.getElementById('mentor-panel').classList.remove('visible');
                },
                onComplete: () => {
                    this.updateMentorHUD(m.config);
                    document.getElementById('mentor-panel').classList.add('visible');
                    // Typewriter on all text fields after panel opens
                    this.typewriterEffect('mentor-name', m.config.name, 60);
                    this.typewriterEffect('mentor-role', '// ' + m.config.role, 50);
                    this.typewriterEffect('mentor-desc', m.config.desc, 18);
                }
            }, label);

            tl.to(this.lookAtTarget, {
                x: m.group.position.x,
                y: m.group.position.y,
                z: m.group.position.z,
                duration: 5,
                ease: "power2.inOut"
            }, label);

            tl.to({}, { duration: 6 }); // Narrative Hold

            // Exit transition
            if (i < this.objects.mentors.length - 1) {
                tl.to({}, {
                    duration: 0.5,
                    onStart: () => {
                        document.getElementById('mentor-panel').classList.remove('visible');
                    }
                });
            }

            if (i === this.objects.mentors.length - 1) {
                // Fly to Sun
                tl.to(this.camera.position, {
                    x: 0, y: 0, z: this.objects.sun.position.z + 1200,
                    duration: 8, ease: "power2.inOut",
                    onStart: () => { document.getElementById('mentor-panel').classList.remove('visible'); }
                }, "flyingToSun");

                tl.to(this.lookAtTarget, {
                    x: 0, y: 0, z: this.objects.sun.position.z,
                    duration: 8, ease: "power2.inOut"
                }, "flyingToSun");
            }
        });

        // 3. SUN / COMMUNITY
        tl.addLabel("sunArrival");
        this.objects.branches.forEach((set, i) => {
            tl.call(() => { set.visible = true; });
            tl.fromTo(set.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2, ease: "back.out(1.2)" });
            tl.to({}, { duration: 4 });
            tl.to(set.scale, { x: 0, y: 0, z: 0, duration: 1 });
            tl.call(() => { set.visible = false; });
        });

        // VOID TRANSITION: Calm flight after the sun sequence
        tl.to(this.camera.position, {
            z: "-=4000",
            duration: 12,
            ease: "power1.inOut"
        });

        // 4. CORE GALAXY PASSAGE
        tl.addLabel("galaxyEntrance");
        this.objects.coreMembers.forEach((member, i) => {
            const label = `core${i + 1}`;
            tl.addLabel(label);

            const camX = i % 2 === 0 ? -600 : 600; // Increased offset

            // 1. Move camera to Member Sector
            tl.to(this.camera.position, {
                x: camX,
                y: member.group.position.y,
                z: member.group.position.z + 1400, // Backed up for scale
                duration: 8,
                ease: "power2.inOut"
            }, label);

            tl.to(this.lookAtTarget, {
                x: member.group.position.x,
                y: member.group.position.y,
                z: member.group.position.z,
                duration: 8,
                ease: "power2.inOut"
            }, label);

            // 2. Open Dossier AFTER arrival — with typewriter
            tl.to({}, {
                duration: 0.1,
                onStart: () => {
                    const panel = document.getElementById(`core-panel-${i + 1}`);
                    panel.classList.add('visible');

                    // Typewriter for name
                    const nameEl = document.getElementById(`core-name-${i + 1}`);
                    const bioEl = document.getElementById(`core-bio-${i + 1}`);

                    if (nameEl) {
                        const origName = nameEl.dataset.orig || nameEl.textContent;
                        nameEl.dataset.orig = origName;
                        nameEl.textContent = '';
                        let ni = 0;
                        const ni_interval = setInterval(() => {
                            nameEl.textContent += origName[ni++];
                            if (ni >= origName.length) clearInterval(ni_interval);
                        }, 55);
                    }

                    // Typewriter for bio (slower, character by character)
                    if (bioEl) {
                        const origBio = bioEl.dataset.orig || bioEl.innerText;
                        bioEl.dataset.orig = origBio;
                        bioEl.textContent = '';
                        let bi = 0;
                        const bi_interval = setInterval(() => {
                            bioEl.textContent += origBio[bi++];
                            if (bi >= origBio.length) clearInterval(bi_interval);
                        }, 12);
                    }
                }
            });

            tl.to({}, { duration: 12 }); // Extensive Narrative Hold

            // 3. Close Dossier BEFORE moving to next sector
            tl.to({}, {
                duration: 1.5,
                onStart: () => {
                    document.getElementById(`core-panel-${i + 1}`).classList.remove('visible');
                }
            });

            tl.to({}, { duration: 4 }); // Pause in void
        });

        // 5. FINALE
        tl.addLabel("finale");
        tl.to(this.camera.position, {
            z: "-=4500", // Further for grand scale
            duration: 15,
            ease: "power2.inOut"
        });

        // Sequences finale text reveal
        tl.to("#final-signature", {
            opacity: 1,
            duration: 1,
            onStart: () => {
                const textNodes = document.querySelectorAll('#final-signature > *');
                gsap.fromTo(textNodes,
                    { opacity: 0, y: 30 },
                    { opacity: 1, y: 0, duration: 1.5, stagger: 0.4, ease: "power3.out" }
                );
            }
        }, "-=12");
    }

    // UI REFINEMENT
    updateMentorHUD(config) {
        const panel = document.getElementById('mentor-panel');
        const photoContainer = document.querySelector('.mentor-photo');

        document.getElementById('mentor-name').innerText = config.name;
        document.getElementById('mentor-role').innerText = "// " + config.role;
        document.getElementById('mentor-desc').innerText = config.desc;

        const lnLink = panel.querySelector('.social-link.linkedin');
        if (lnLink) lnLink.href = config.linkedin || "#";
        const ghLink = panel.querySelector('.social-link.github');
        if (ghLink) ghLink.href = config.github || "#";
        const emLink = panel.querySelector('.social-link.email');
        if (emLink) emLink.href = config.email || "#";

        photoContainer.innerHTML = '';
        const img = document.createElement('img');
        img.src = `assets/mentor${config.id}.jpg`;
        img.onerror = () => { img.src = this.generateAvatar(config.id, config.color); };
        photoContainer.appendChild(img);

        panel.classList.remove('side-left', 'side-right');
        panel.classList.add(config.side === 'left' ? 'side-right' : 'side-left');
    }

    generateAvatar(id, colorHex) {
        const canvas = document.createElement('canvas');
        canvas.width = 200; canvas.height = 200;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#111'; ctx.fillRect(0, 0, 200, 200);
        ctx.fillStyle = new THREE.Color(colorHex).getStyle();
        ctx.beginPath(); ctx.arc(100, 100, 80, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#000'; ctx.font = 'bold 60px Arial';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(id, 100, 100);
        return canvas.toDataURL();
    }

    handlePick(e) {
        if (this.mouse.isDown) return;
        const modal = document.getElementById('student-profile-modal');
        if (modal && !modal.classList.contains('hidden')) return;

        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersects = this.raycaster.intersectObjects(this.objects.studentTokens);

        if (intersects.length > 0) {
            const token = intersects[0].object;
            this.openStudentProfile(token.userData.id);
        }
    }

    openStudentProfile(id) {
        const modal = document.getElementById('student-profile-modal');
        const img = document.getElementById('modal-student-img');
        const nameNode = document.getElementById('modal-student-name');
        nameNode.innerText = `SQUAD_MEMBER_${id}`;
        img.src = `assets/student${id}.jpg`;
        img.onerror = () => { img.src = this.generateAvatar(id, '#00f2ff'); };
        modal.classList.remove('hidden');
        gsap.fromTo(".modal-container",
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

// Start Main App
new CosmicJourney();
