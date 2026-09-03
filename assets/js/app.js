let hindiMode = false;

function toggleLanguage() {
    hindiMode = !hindiMode;

    if (hindiMode) {
        document.getElementById("welcomeTitle").textContent =
            "काम खोजें। काम देने वाले खोजें।";

        document.getElementById("welcomeText").textContent =
            "अपने आसपास काम और भरोसेमंद workers आसानी से खोजें।";

        document.getElementById("findWorkTitle").textContent =
            "काम खोजें";

        document.getElementById("findWorkText").textContent =
            "अपने आसपास उपलब्ध काम खोजें।";

        document.getElementById("findWorkersTitle").textContent =
            "Workers खोजें";

        document.getElementById("findWorkersText").textContent =
            "अपने काम के लिए सही व्यक्ति खोजें।";

        document.getElementById("postTitle").textContent =
            "काम के लिए किसी की जरूरत है?";

        document.getElementById("postText").textContent =
            "अपनी जरूरत पोस्ट करें और सही व्यक्ति खोजें।";

        document.getElementById("postButton").textContent =
            "+ काम पोस्ट करें";

        document.getElementById("homeNav").textContent =
            "होम";

        document.getElementById("searchNav").textContent =
            "खोजें";

        document.getElementById("postNav").textContent =
            "पोस्ट";

        document.getElementById("profileNav").textContent =
            "प्रोफाइल";

    } else {

        document.getElementById("welcomeTitle").textContent =
            "Find Work. Find Workers.";

        document.getElementById("welcomeText").textContent =
            "Find trusted local work and workers near you.";

        document.getElementById("findWorkTitle").textContent =
            "Find Work";

        document.getElementById("findWorkText").textContent =
            "Discover local jobs and work opportunities.";

        document.getElementById("findWorkersTitle").textContent =
            "Find Workers";

        document.getElementById("findWorkersText").textContent =
            "Find people for your work or service.";

        document.getElementById("postTitle").textContent =
            "Need someone for a job?";

        document.getElementById("postText").textContent =
            "Post your work requirement and find the right person.";

        document.getElementById("postButton").textContent =
            "+ Post a Job";

        document.getElementById("homeNav").textContent =
            "Home";

        document.getElementById("searchNav").textContent =
            "Search";

        document.getElementById("postNav").textContent =
            "Post";

        document.getElementById("profileNav").textContent =
            "Profile";
    }
}


function selectLocation() {

    const location = prompt("Enter your location:");

    if (location && location.trim() !== "") {

        document.getElementById("locationText").textContent =
            location.trim();
    }
}




function findWork() {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.add("active");

    document.getElementById("findWorkersScreen").classList.remove("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function findWorkers() {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkersScreen").classList.add("active");

    document.getElementById("findWorkScreen").classList.remove("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function postJob() {
    alert("Job posting feature will be available soon.");
}

function goHome() {

    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("searchScreen").classList.remove("active");

    document.getElementById("homeContent").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showProfile() {
    alert("Profile section will be available soon.");
}


function closeScreens() {

    document.getElementById("findWorkScreen").classList.remove("active");

    document.getElementById("findWorkersScreen").classList.remove("active");

 document.getElementById("searchScreen").classList.remove("active");
    
    document.getElementById("homeContent").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function selectWorkerCategory(category) {

    const workers = {
        "Electrician": [
            {
                name: "Raj Electric Services",
                area: "Nearby",
                rating: "4.8",
                experience: "5+ years",
                jobs: "127"
            },
            {
                name: "Sharma Electrical Works",
                area: "Nearby",
                rating: "4.6",
                experience: "3+ years",
                jobs: "89"
            }
        ],

        "Plumber": [
            {
                name: "QuickFix Plumbing",
                area: "Nearby",
                rating: "4.7",
                experience: "6+ years",
                jobs: "143"
            },
            {
                name: "Local Plumbing Service",
                area: "Nearby",
                rating: "4.5",
                experience: "4+ years",
                jobs: "76"
            }
        ],

        "AC Repair": [
            {
                name: "CoolCare AC Service",
                area: "Nearby",
                rating: "4.8",
                experience: "5+ years",
                jobs: "156"
            },
            {
                name: "Fast AC Repair",
                area: "Nearby",
                rating: "4.6",
                experience: "3+ years",
                jobs: "94"
            }
        ],

        "Contractor": [
            {
                name: "Reliable Construction",
                area: "Nearby",
                rating: "4.7",
                experience: "8+ years",
                jobs: "210"
            }
        ],

        "Painter": [
            {
                name: "Perfect Paint Works",
                area: "Nearby",
                rating: "4.6",
                experience: "5+ years",
                jobs: "118"
            }
        ],

        "Other": [
            {
                name: "Local Service Professional",
                area: "Nearby",
                rating: "4.5",
                experience: "3+ years",
                jobs: "65"
            }
        ]
    };

    const selectedWorkers = workers[category] || [];

    let html = `
        <div class="worker-results-header">
            <div>
                <span class="results-label">AVAILABLE NEAR YOU</span>
                <h3>${category} Professionals</h3>
            </div>
            <span class="results-count">${selectedWorkers.length} found</span>
        </div>
    `;

    selectedWorkers.forEach(function(worker) {

        html += `
            <div class="worker-card premium-worker-card">

                <div class="worker-avatar">
                    ${worker.name.charAt(0)}
                </div>

                <div class="worker-info">

                    <div class="worker-name-row">
                        <h4>${worker.name}</h4>
                        <span class="verified-badge">✓ Verified</span>
                    </div>

                    <div class="worker-status">
                        <span class="online-dot"></span>
                        Available now
                    </div>

                    <p>📍 ${worker.area}</p>

                    <div class="worker-stats">
                        <span>⭐ ${worker.rating}</span>
                        <span>•</span>
                        <span>${worker.jobs} jobs</span>
                        <span>•</span>
                        <span>${worker.experience}</span>
                    </div>

                </div>

                <button
                    class="primary-btn worker-request-btn"
                    onclick="requestWorker('${worker.name}')"
                >
                    Request
                </button>

            </div>
        `;
    });

    document.getElementById("workerResults").innerHTML = html;
}
    
    

function requestWorker(workerName) {

    alert(
        "Request sent to " +
        workerName +
        ".\n\nWorker contact details will be available after booking."
    );
}



function searchWork() {

    const search = document.getElementById("workSearch").value.trim();

    if (search === "") {
        alert("Please enter what type of work you are looking for.");
        return;
    }

    document.getElementById("workResults").innerHTML =
        "<strong>Searching for:</strong><br>" + search;
}


function searchWorkers() {

    const search = document.getElementById("workerSearch").value.trim();

    if (search === "") {
        alert("Please enter the worker/service you need.");
        return;
    }

    document.getElementById("workerResults").innerHTML =
        "<strong>Searching for:</strong><br>" + search;
}


function openSearch() {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.remove("active");

    document.getElementById("findWorkersScreen").classList.remove("active");

    document.getElementById("searchScreen").classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

