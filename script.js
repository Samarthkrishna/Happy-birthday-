// Initialize variables
let currentSection = 0;
const sections = document.querySelectorAll('section');
const loader = document.getElementById('loader');
const experience = document.getElementById('experience');

// Starfield
function initStarfield() {
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const stars = [];
    const starCount = 200;
    
    for(let i = 0; i < starCount; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 2 + 1,
            speed: Math.random() * 0.5 + 0.2,
            opacity: Math.random() * 0.5 + 0.5
        });
    }
    
    function animateStars() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            star.x -= star.speed;
            if(star.x < 0) star.x = canvas.width;
            
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            ctx.fill();
        });
        
        requestAnimationFrame(animateStars);
    }
    
    animateStars();
}

// Constellation Generator
function initConstellation() {
    const canvas = document.getElementById('constellation-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let stars = [];
    
    function generateStars(name) {
        stars = [];
        const nameHash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        
        for(let i = 0; i < 50; i++) {
            stars.push({
                x: (Math.sin(nameHash + i * 10) * 0.5 + 0.5) * canvas.width,
                y: (Math.cos(nameHash + i * 7) * 0.5 + 0.5) * canvas.height,
                connections: []
            });
        }
        
        drawConstellation();
    }
    
    function drawConstellation() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw stars
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#00ffff';
            ctx.fill();
        });
        
        // Draw connections
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        
        for(let i = 0; i < stars.length; i++) {
            for(let j = i + 1; j < stars.length; j++) {
                const distance = Math.sqrt(
                    Math.pow(stars[i].x - stars[j].x, 2) + 
                    Math.pow(stars[i].y - stars[j].y, 2)
                );
                
                if(distance < 150) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    generateStars('Birthday Star');
}

// Wish Generator
const wishTemplates = [
    "May your day shimmer with {adj1} moments that sparkle like {thing1} under {thing2} light",
    "Here's to {adj2} adventures and {adj3} memories that glow brighter than {thing3}",
    "Wishing you a year where every day feels like discovering {thing4} in a field of {thing5}",
    "May your spirit dance with {adj4} energy and your heart overflow with {adj5} joy",
    "Today, the universe conspired to make {thing6} just for you to enjoy with {thing7}"
];

const adjectives = ["magical", "luminous", "sparkling", "radiant", "cosmic", "ethereal", "glowing", "brilliant"];
const things = ["stardust", "fireflies", "northern lights", "supernovas", "rainbows", "sunbeams", "moonbeams", "auroras"];

function generateWish() {
    const favThings = document.getElementById('favThings').value.split(',').map(item => item.trim());
    const allThings = [...things, ...favThings.filter(item => item !== '')];
    
    let wish = wishTemplates[Math.floor(Math.random() * wishTemplates.length)];
    
    // Replace placeholders
    wish = wish.replace(/{adj(\d+)}/g, (match, num) => 
        adjectives[Math.floor(Math.random() * adjectives.length)]
    );
    
    wish = wish.replace(/{thing(\d+)}/g, (match, num) => 
        allThings[Math.floor(Math.random() * allThings.length)]
    );
    
    const wishDisplay = document.getElementById('wishText');
    wishDisplay.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < wish.length) {
            wishDisplay.innerHTML += wish.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    };
    typeWriter();
}

// Navigation
function enterExperience() {
    document.getElementById('cosmic-entrance').classList.add('hidden');
    document.getElementById('constellation').classList.remove('hidden');
    currentSection = 1;
    initConstellation();
}

function nextSection() {
    sections[currentSection].classList.add('hidden');
    currentSection++;
    if(currentSection < sections.length) {
        sections[currentSection].classList.remove('hidden');
        
        if(currentSection === 4) { // Final message
            startFireworks();
            document.getElementById('bg-music').play();
        }
    }
}

// Time Capsule Slider
document.getElementById('timeSlider').addEventListener('input', function(e) {
    const time = e.target.value;
    const messages = document.querySelectorAll('.message');
    
    messages.forEach(msg => {
        msg.classList.remove('active');
        if(parseInt(msg.dataset.time) <= time) {
            msg.classList.add('active');
        }
    });
});

// Fireworks
function startFireworks() {
    const container = document.querySelector('.fireworks-container');
    for(let i = 0; i < 30; i++) {
        setTimeout(() => {
            createFirework(container);
        }, i * 300);
    }
}

function createFirework(container) {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.style.left = `${Math.random() * 100}%`;
    firework.style.top = `${Math.random() * 100}%`;
    container.appendChild(firework);
    
    setTimeout(() => firework.remove(), 1000);
}

// Initialize
window.addEventListener('load', () => {
    setTimeout(() => {
        loader.classList.add('hidden');
        experience.classList.remove('hidden');
        initStarfield();
    }, 2000);
});

// Resize handling
window.addEventListener('resize', () => {
    initStarfield();
    if(currentSection >= 1) {
        initConstellation();
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if(e.key === 'ArrowRight' || e.key === ' ') {
        nextSection();
    }
});

// Share functionality
function shareExperience() {
    if(navigator.share) {
        navigator.share({
            title: 'Cosmic Birthday Experience',
            text: 'Check out this mind-blowing birthday wish!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    }
                             }
