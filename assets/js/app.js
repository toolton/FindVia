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

document.getElementById("searchScreen").classList.remove("active");
document.getElementById("findWorkersScreen").classList.remove("active");
document.getElementById("findWorkScreen").classList.add("active");
document.getElementById("postJobScreen")?.classList.remove("active");
document.getElementById("myJobsScreen").style.display = "none";
document.getElementById("jobResponsesScreen")?.classList.remove("active");


    
showPostedJobs();
window.scrollTo({
top: 0,
behavior: "smooth"
});
}

function findWorkers() {
document.getElementById("homeContent").style.display = "none";

document.getElementById("searchScreen").classList.remove("active");
document.getElementById("findWorkScreen").classList.remove("active");
document.getElementById("findWorkersScreen").classList.add("active");
document.getElementById("postJobScreen")?.classList.remove("active");
document.getElementById("myJobsScreen").style.display = "none";
document.getElementById("jobResponsesScreen")?.classList.remove("active");
window.scrollTo({
top: 0,
behavior: "smooth"
});
}


function postJob() {

    const currentRole = localStorage.getItem("findviaUserRole");

    if (currentRole !== "customer") {
        alert("Job post karne ke liye pehle Customer role select karein.");

        showProfile();
        return;
    }

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("searchScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.remove("active");
document.getElementById("myJobsScreen").style.display = "none";
document.getElementById("jobResponsesScreen")?.classList.remove("active");
    document.getElementById("postJobScreen").classList.add("active");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function saveJob() {

    const title = document.getElementById("jobTitle").value.trim();
    const category = document.getElementById("jobCategory").value;
    const description = document.getElementById("jobDescription").value.trim();
    const area = document.getElementById("jobArea").value.trim();
    const timing = document.getElementById("jobTiming").value;
    const budget = document.getElementById("jobBudget").value.trim();
    const photoInput = document.getElementById("jobPhoto");

    if (!title || !category || !description || !area || !timing || !budget) {
        alert("Please complete all required job details.");
        return;
    }

    if (Number(budget) <= 0) {
        alert("Please enter a valid maximum budget.");
        return;
    }

    const createJob = function(photoData) {

        const jobs = JSON.parse(
            localStorage.getItem("findviaJobs") || "[]"
        );

        const newJob = {
            id: Date.now(),
            title: title,
            category: category,
            description: description,
            area: area,
            timing: timing,

            // Private customer information
            budget: Number(budget),

            photo: photoData || "",

            status: "open",

            createdAt: new Date().toISOString()
        };

        jobs.unshift(newJob);

        localStorage.setItem(
            "findviaJobs",
            JSON.stringify(jobs)
        );

        alert("Your job has been posted successfully.");

        document.getElementById("jobTitle").value = "";
        document.getElementById("jobCategory").value = "";
        document.getElementById("jobDescription").value = "";
        document.getElementById("jobArea").value = "";
        document.getElementById("jobTiming").value = "";
        document.getElementById("jobBudget").value = "";
        document.getElementById("jobPhoto").value = "";

        showPostedJobs();

        findWork();
    };


    if (photoInput.files && photoInput.files[0]) {

        const file = photoInput.files[0];

        if (file.size > 2 * 1024 * 1024) {
            alert("Photo size 2MB se kam honi chahiye.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function(event) {
            createJob(event.target.result);
        };

        reader.readAsDataURL(file);

    } else {

        createJob("");
    }
}


function showPostedJobs() {

    const resultsBox = document.getElementById("workResults");

    if (!resultsBox) {
        return;
    }

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const openJobs = jobs.filter(function(job) {
        return job.status === "open";
    });

    if (openJobs.length === 0) {

        resultsBox.innerHTML = `
            <div class="empty-state">
                <strong>No jobs available yet.</strong>
                <p>New local work opportunities will appear here.</p>
            </div>
        `;

        return;
    }

    let html = `
        <div class="worker-results-header">
            <div>
                <span class="results-label">LOCAL OPPORTUNITIES</span>
                <h3>Available Jobs</h3>
            </div>

            <span class="results-count">
                ${openJobs.length} found
            </span>
        </div>
    `;

    openJobs.forEach(function(job) {

        html += `
            <div class="job-card">

                <div class="job-card-top">

                    <div>
                        <span class="job-category">
                            ${job.category}
                        </span>

                        <h3>${escapeHTML(job.title)}</h3>
                    </div>

                    <span class="job-status">
                        Open
                    </span>

                </div>

                <p class="job-description">
                    ${escapeHTML(job.description)}
                </p>

                <div class="job-meta">
                    <span>📍 ${escapeHTML(job.area)}</span>
                    <span>🕒 ${escapeHTML(job.timing)}</span>
                </div>

                ${
                    job.photo
                    ? `<img
                        class="job-photo"
                        src="${job.photo}"
                        alt="Job photo"
                    >`
                    : ""
                }

                <div class="job-private-note">
                    🔒 Customer budget is hidden until the appropriate match stage.
                </div>


${
    job.matchedWorker &&
    job.matchedWorker === localStorage.getItem("findviaWorkerProfile") &&
    job.customerOffer
    ? `
        <button
            class="primary-btn"
            onclick="openWorkerOffer(${job.id})"
        >
            💰 View Private Offer
        </button>
    `
    : ""
}

                <button
                    class="primary-btn job-interest-btn"
                    onclick="respondToJob(${job.id})"
                >
                    I'm Interested
                </button>

            </div>
        `;
    });

    resultsBox.innerHTML = html;
}

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;
}


function respondToJob(jobId) {

    const currentRole = localStorage.getItem("findviaUserRole");

    if (currentRole !== "worker") {

        alert(
            "Is job par interest show karne ke liye Worker role select karein."
        );

        showProfile();
        return;
    }

    const responses = JSON.parse(
        localStorage.getItem("findviaJobResponses") || "[]"
    );

    const alreadyResponded = responses.some(function(response) {

        return (
            response.jobId === jobId &&
            response.workerProfile === localStorage.getItem("findviaWorkerProfile")
        );

    });

    if (alreadyResponded) {

        alert("Aap already is job mein interest dikha chuke hain.");
        return;
    }

    responses.push({
        jobId: jobId,
        workerProfile: localStorage.getItem("findviaWorkerProfile") || "{}",
        status: "pending",
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(
        "findviaJobResponses",
        JSON.stringify(responses)
    );

    alert(
        "Interest sent successfully.\n\n" +
        "Customer ko aapki response milegi. " +
        "Contact details abhi hidden rahengi."
    );
}


function goHome() {
hideAdminScreens();
    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("searchScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.remove("active");
document.getElementById("myJobsScreen").style.display = "none";


document.getElementById("jobResponsesScreen")?.classList.remove("active");

    
    document.getElementById("homeContent").style.display = "block";
document.getElementById("postJobScreen").classList.remove("active");
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function showProfile() {
hideAdminScreens();
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("searchScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.add("active");
document.getElementById("workerProfileScreen").classList.remove("active");
document.getElementById("postJobScreen").classList.remove("active");
 document.getElementById("myJobsScreen").style.display = "none"; 
document.getElementById("jobResponsesScreen")?.classList.remove("active");  
    loadUserRole();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
loadWorkerProfileSummary();

}




function closeScreens() {


    
    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("searchScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.remove("active");

    document.getElementById("postJobScreen")?.classList.remove("active");
    document.getElementById("myJobsScreen").style.display = "none";
    document.getElementById("jobResponsesScreen")?.classList.remove("active");

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

hideAdminScreens();
    
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.remove("active");
document.getElementById("myJobsScreen")?.classList.remove("active");
document.getElementById("jobResponsesScreen")?.classList.remove("active");
    document.getElementById("searchScreen").classList.add("active");
document.getElementById("postJobScreen").classList.remove("active");
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ================================
   USER ROLE SYSTEM
================================ */

function selectUserRole(role) {

    localStorage.setItem("findviaUserRole", role);

    updateRoleUI(role);
loadWorkerProfileSummary();
    
}


function loadUserRole() {

    const savedRole = localStorage.getItem("findviaUserRole");

    if (savedRole) {
        updateRoleUI(savedRole);
    } else {

const workerProfileBtn = document.querySelector(".worker-profile-btn");

if (workerProfileBtn) {
    workerProfileBtn.style.display = "none";
}


        
        document.getElementById("workerRoleCard")
            .classList.remove("selected");

        document.getElementById("customerRoleCard")
            .classList.remove("selected");

        document.getElementById("workerRoleCheck").textContent = "○";
        document.getElementById("customerRoleCheck").textContent = "○";

        document.getElementById("selectedRoleBox").innerHTML = `
            <span>ℹ️</span>
            <p>
                Role select karne ke baad FindVia aapke liye relevant options dikhayega.
            </p>
        `;
    }
}


function updateRoleUI(role) {

    const workerCard = document.getElementById("workerRoleCard");
    const customerCard = document.getElementById("customerRoleCard");

    const workerCheck = document.getElementById("workerRoleCheck");
    const customerCheck = document.getElementById("customerRoleCheck");
const workerProfileBtn = document.querySelector(".worker-profile-btn");

    
    workerCard.classList.remove("selected");
    customerCard.classList.remove("selected");

    workerCheck.textContent = "○";
    customerCheck.textContent = "○";


    if (role === "worker") {

        workerCard.classList.add("selected");
        workerCheck.textContent = "✓";
if (workerProfileBtn) {
    workerProfileBtn.style.display = "block";
}
        document.getElementById("selectedRoleBox").innerHTML = `
            <span>👷</span>
            <p>
                <strong>Worker selected.</strong><br>
                Ab FindVia aapko local work opportunities aur future job requests ke liye prepare karega.
            </p>
        `;

    }


    if (role === "customer") {

        customerCard.classList.add("selected");
        customerCheck.textContent = "✓";
if (workerProfileBtn) {
    workerProfileBtn.style.display = "none";
}
        document.getElementById("selectedRoleBox").innerHTML = `
            <span>🏠</span>
            <p>
                <strong>Customer selected.</strong><br>
                Ab FindVia aapko workers search karne aur future mein job post karne ke liye prepare karega.
            </p>
        `;

    }
}


/* ================================
   WORKER PROFILE
================================ */

function openWorkerProfile() {

    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.add("active");
document.getElementById("postJobScreen")?.classList.remove("active");
document.getElementById("myJobsScreen")?.classList.remove("active");
document.getElementById("jobResponsesScreen")?.classList.remove("active");
    loadWorkerProfile();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function saveWorkerProfile() {

    const name = document.getElementById("workerName").value.trim();
    const service = document.getElementById("workerService").value;
    const experience = document.getElementById("workerExperience").value;
    const area = document.getElementById("workerArea").value.trim();
    const availability = document.getElementById("workerAvailability").value;

    if (!name || !service || !experience || !area || !availability) {
        alert("Please complete all worker profile details.");
        return;
    }

    const workerProfile = {
        name: name,
        service: service,
        experience: experience,
        area: area,
        availability: availability
    };

    const profileString = JSON.stringify(workerProfile);

localStorage.setItem(
    "findviaWorkerProfile",
    profileString
);

// Admin ke liye worker profiles ki collection
const workerProfiles = JSON.parse(
    localStorage.getItem("findviaWorkerProfiles") || "[]"
);

if (!workerProfiles.includes(profileString)) {
    workerProfiles.push(profileString);
}

localStorage.setItem(
    "findviaWorkerProfiles",
    JSON.stringify(workerProfiles)
);

    alert("Worker profile saved successfully.");

    showProfile();
}


function loadWorkerProfile() {

    const savedProfile = localStorage.getItem("findviaWorkerProfile");

    if (!savedProfile) {
        return;
    }

    const profile = JSON.parse(savedProfile);

    document.getElementById("workerName").value =
        profile.name || "";

    document.getElementById("workerService").value =
        profile.service || "";

    document.getElementById("workerExperience").value =
        profile.experience || "";

    document.getElementById("workerArea").value =
        profile.area || "";

    document.getElementById("workerAvailability").value =
        profile.availability || "";
}


/* ================================
   WORKER PROFILE SUMMARY
================================ */
function loadWorkerProfileSummary() {

    const summaryBox = document.getElementById("workerProfileSummary");

    if (!summaryBox) {
        return;
    }

    const currentRole = localStorage.getItem("findviaUserRole");

    // Worker नहीं है तो profile summary hide रहे
    if (currentRole !== "worker") {
        summaryBox.style.display = "none";
        return;
    }

    const savedProfile = localStorage.getItem("findviaWorkerProfile");

    if (!savedProfile) {
        summaryBox.style.display = "none";
        return;
    }

    const profile = JSON.parse(savedProfile);

    document.getElementById("summaryWorkerName").textContent =
        profile.name || "-";

    document.getElementById("summaryWorkerService").textContent =
        profile.service || "-";

    document.getElementById("summaryWorkerExperience").textContent =
        profile.experience || "-";

    document.getElementById("summaryWorkerArea").textContent =
        profile.area || "-";

    document.getElementById("summaryWorkerAvailability").textContent =
        profile.availability || "-";

    summaryBox.style.display = "block";
}


function showMyJobs() {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("searchScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.remove("active");
    document.getElementById("jobResponsesScreen").classList.remove("active");

   document.getElementById("myJobsScreen").style.display = "block"; 

    loadMyJobs();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function loadMyJobs() {

    const box = document.getElementById("myJobsResults");

    const currentRole =
        localStorage.getItem("findviaUserRole");

    const currentWorkerProfile =
        localStorage.getItem("findviaWorkerProfile") || "";

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const responses = JSON.parse(
        localStorage.getItem("findviaJobResponses") || "[]"
    );


    /* =========================
       WORKER VIEW
    ========================= */

    if (currentRole === "worker") {


const workerCredits = getWorkerCredits();

const creditsBox = `
    <div class="job-private-note" style="margin-bottom:15px;">
        💰 <strong>FindVia Credits</strong>
        <span style="float:right;">
            ₹${workerCredits}
        </span>
    </div>
`;
        
        const matchedJobs = jobs.filter(function(job) {

            return (
                job.matchStatus === "matched" &&
                job.matchedWorker === currentWorkerProfile
            );

        });


        const title =
            document.querySelector("#myJobsScreen .profile-header h2");

        const subtitle =
            document.querySelector("#myJobsScreen .profile-header p");

        if (title) {
            title.textContent = "My Matched Jobs";
        }

        if (subtitle) {
            subtitle.textContent =
                "Jin jobs ke liye aap customer ke saath matched hain.";
        }


        if (matchedJobs.length === 0) {

            box.innerHTML = `
                <div class="empty-state">

                    <div style="font-size:40px;">📋</div>

                    <h3>No matched jobs yet</h3>

                    <p>
                        Jab koi customer aapko apni job ke liye select karega,
                        woh job yahan दिखाई देगी.
                    </p>

                </div>
            `;

            return;
        }


        let html = "";


        matchedJobs.forEach(function(job) {

            let statusText = "✅ Worker Matched";

            if (job.jobStatus === "confirmed") {

                statusText = "✅ Job Confirmed";

            } else if (job.priceStatus === "accepted") {

                statusText = "💰 Price Accepted";

            } else if (job.priceStatus === "counter_offer") {

                statusText = "💰 Counter Offer Sent";

            } else if (job.priceStatus === "rejected") {

                statusText = "❌ Offer Rejected";

            } else if (job.customerOffer) {

                statusText = "💰 Price Offer Received";

            }


            html += `
                <div class="job-card">

                    <div class="job-card-top">

                        <div>

                            <span class="job-category">
                                ${escapeHTML(job.category)}
                            </span>

                            <h3>
                                ${escapeHTML(job.title)}
                            </h3>

                        </div>

                        <span class="job-status">
                            ${statusText}
                        </span>

                    </div>


                    <p class="job-description">
                        ${escapeHTML(job.description)}
                    </p>


                    <div class="job-meta">

                        <span>
                            📍 ${escapeHTML(job.area)}
                        </span>

                        <span>
                            🕒 ${escapeHTML(job.timing)}
                        </span>

                    </div>


                    <div class="job-private-note">
                        🔒 Ye job aapke saath privately matched hai.
                    </div>


                    ${
    job.customerOffer &&
    job.priceStatus !== "accepted"
    ? `
        <button
            class="primary-btn"
            onclick="openWorkerOffer(${job.id})"
        >
            💰 View Private Offer
        </button>
    `
    : ""
}


${
    job.priceStatus === "accepted" &&
    job.jobStatus === "confirmed"
    ? `
        <button
            class="primary-btn"
            onclick="verifyCompletionOTP(${job.id})"
        >
            🔐 Enter Completion OTP
        </button>
    `
    : ""
}


${
    job.jobStatus === "completed"
    ? `
        <div class="job-private-note">
            ✅ Job Completed
        </div>
    `
    : ""
}

                    ${
                        job.priceStatus === "accepted"
                        ? `
                            <div class="job-private-note">
                                ✅ Price agreement complete.
                            </div>
                        `
                        : ""
                    }


                </div>
            `;
        });


        box.innerHTML = creditsBox + html;

        return;
    }


    /* =========================
       CUSTOMER VIEW
    ========================= */

    const title =
        document.querySelector("#myJobsScreen .profile-header h2");

    const subtitle =
        document.querySelector("#myJobsScreen .profile-header p");

    if (title) {
        title.textContent = "My Jobs";
    }

    if (subtitle) {
        subtitle.textContent =
            "Aapki posted work requirements.";
    }


    if (jobs.length === 0) {

        box.innerHTML = `
            <div class="empty-state">

                <div style="font-size:40px;">📋</div>

                <h3>No jobs posted yet</h3>

                <p>
                    Jab aap koi work requirement post karenge,
                    woh yahan दिखाई देगी.
                </p>

                <button
                    class="primary-btn"
                    onclick="postJob()"
                >
                    + Post a Job
                </button>

            </div>
        `;

        return;
    }


    let html = "";


    jobs.forEach(function(job) {

        const responseCount = responses.filter(function(response) {

            return response.jobId === job.id;

        }).length;


        html += `
            <div class="job-card">

                <div class="job-card-top">

                    <div>

                        <span class="job-category">
                            ${escapeHTML(job.category)}
                        </span>

                        <h3>
                            ${escapeHTML(job.title)}
                        </h3>

                    </div>

                    <span class="job-status">
                        ${
                            job.matchStatus === "matched"
                            ? "✅ Worker Matched"
                            : (
                                job.status === "open"
                                ? "Open"
                                : "Closed"
                            )
                        }
                    </span>

                </div>


                <p class="job-description">
                    ${escapeHTML(job.description)}
                </p>


                <div class="job-meta">

                    <span>
                        📍 ${escapeHTML(job.area)}
                    </span>

                    <span>
                        🕒 ${escapeHTML(job.timing)}
                    </span>

                </div>


                <div class="response-count-box">

                    👥

                    <strong>
                        ${responseCount}
                    </strong>

                    worker${responseCount === 1 ? "" : "s"}
                    interested

                </div>


                ${
                    job.matchStatus === "matched"
                    ? `
                        ${
                            job.priceStatus === "counter_offer"
                            ? `
                                <button
                                    class="primary-btn"
                                    onclick="openCustomerPriceResponse(${job.id})"
                                >
                                    💰 View Worker Offer
                                </button>
                            `
                            : job.priceStatus === "accepted"
? `
    ${
        job.jobStatus === "completed"
        ? `
            <div class="job-private-note">
                ✅ Job Completed
            </div>
        `
        : job.jobStatus === "confirmed"
        ? `
            <button
                class="primary-btn"
                onclick="generateCompletionOTP(${job.id})"
            >
                🔐 Generate Completion OTP
            </button>
        `
        : `
            <button
                class="primary-btn"
                onclick="confirmJob(${job.id})"
            >
                ✅ Confirm Job
            </button>
        `
    }
`
                            : job.priceStatus === "rejected"
                            ? `
                                <button
                                    class="primary-btn"
                                    onclick="openCustomerPriceResponse(${job.id})"
                                >
                                    ❌ View Price Status
                                </button>
                            `
                            : `
                                <button
                                    class="primary-btn"
                                    onclick="openPricingForJob(${job.id})"
                                >
                                    💰 Set Price
                                </button>
                            `
                        }
                    `
                    : `
                        <button
                            class="primary-btn"
                            onclick="showJobResponses(${job.id})"
                        >
                            View Responses
                        </button>
                    `
                }

            </div>
        `;
    });


    box.innerHTML = html;
}


function showJobResponses(jobId) {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("myJobsScreen").classList.remove("active");
    document.getElementById("jobResponsesScreen").classList.add("active");

    loadJobResponses(jobId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function loadJobResponses(jobId) {

    const box = document.getElementById("jobResponsesResults");

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const responses = JSON.parse(
        localStorage.getItem("findviaJobResponses") || "[]"
    );


    const job = jobs.find(function(item) {

        return item.id === jobId;

    });


    if (!job) {

        box.innerHTML = `
            <div class="empty-state">
                <h3>Job not found</h3>
            </div>
        `;

        return;
    }


    const jobResponses = responses.filter(function(response) {

        return response.jobId === jobId;

    });


    if (jobResponses.length === 0) {

        box.innerHTML = `
            <div class="empty-state">

                <div style="font-size:40px;">👥</div>

                <h3>No responses yet</h3>

                <p>
                    Jab koi worker is job mein interest dikhayega,
                    uski response yahan दिखाई देगी.
                </p>

            </div>
        `;

        return;
    }


    let html = `

        <div class="job-response-job">

            <span class="job-category">
                ${escapeHTML(job.category)}
            </span>

            <h3>
                ${escapeHTML(job.title)}
            </h3>

            <p>
                ${escapeHTML(job.area)}
            </p>

        </div>

    `;


    jobResponses.forEach(function(response, index) {

        let workerProfile = null;

        try {

            workerProfile =
                JSON.parse(response.workerProfile);

        } catch (error) {

            workerProfile = null;

        }


        if (!workerProfile) {

            html += `
                <div class="worker-response-card">

                    <div class="worker-response-avatar">
                        👷
                    </div>

                    <div class="worker-response-info">

                        <h3>
                            Worker ${index + 1}
                        </h3>

                        <p>
                            Profile details unavailable
                        </p>

                    </div>

                </div>
            `;

            return;
        }


        html += `

            <div class="worker-response-card">

                <div class="worker-response-avatar">
                    ${escapeHTML(
                        workerProfile.name
                            ? workerProfile.name.charAt(0).toUpperCase()
                            : "W"
                    )}
                </div>


                <div class="worker-response-info">

                    <div class="worker-response-name">

                        <h3>
                            ${escapeHTML(workerProfile.name)}
                        </h3>

                        <span class="verified-badge">
                            ✓ Profile
                        </span>

                    </div>


                    <p>
                        🛠️ ${escapeHTML(workerProfile.service)}
                    </p>

                    <p>
                        ⭐ ${escapeHTML(workerProfile.experience)}
                    </p>

                    <p>
                        📍 ${escapeHTML(workerProfile.area)}
                    </p>

                    <p>
                        🟢 ${escapeHTML(workerProfile.availability)}
                    </p>

                </div>

<button
    class="primary-btn"
    onclick="selectWorkerForJob(${jobId}, ${index})"
>
    Select Worker
</button>
                

            </div>

        `;
    });


    box.innerHTML = html;
}



function selectWorkerForJob(jobId, responseIndex) {

    const confirmMatch = confirm(
        "Kya aap is worker ko is job ke liye select karna chahte hain?\n\n" +
        "Select karne ke baad worker ke saath private pricing process shuru hogi."
    );

    if (!confirmMatch) {
        return;
    }

    let jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    let responses = JSON.parse(
        localStorage.getItem("findviaJobResponses") || "[]"
    );

    let job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    let jobResponses = responses.filter(function(response) {
        return response.jobId === jobId;
    });

    let selectedResponse = jobResponses[responseIndex];

    if (!selectedResponse) {
        alert("Worker response nahi mili.");
        return;
    }

    job.matchedWorker = selectedResponse.workerProfile;
    job.matchStatus = "matched";
    job.matchedAt = new Date().toISOString();

    localStorage.setItem(
        "findviaJobs",
        JSON.stringify(jobs)
    );

    selectedResponse.status = "matched";

    let globalResponseIndex = responses.findIndex(function(response) {

        return (
            response.jobId === jobId &&
            response.createdAt === selectedResponse.createdAt
        );

    });

    if (globalResponseIndex !== -1) {

        responses[globalResponseIndex].status = "matched";

    }

    localStorage.setItem(
        "findviaJobResponses",
        JSON.stringify(responses)
    );

    alert(
        "Worker successfully matched! ✅\n\n" +
        "Ab next step mein private pricing process shuru hoga."
    );

    showMyJobs();
}

function openPricingForJob(jobId) {

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    if (job.matchStatus !== "matched") {
        alert("Pehle worker ko match karein.");
        return;
    }

    const price = prompt(
        "Is job ke liye aap kitna price offer karna chahte hain?\n\n" +
        "Ye offer private rahega."
    );

    if (price === null) {
        return;
    }

    const amount = Number(price);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert("Please ek valid amount enter karein.");
        return;
    }

    job.customerOffer = amount;
    job.priceStatus = "customer_offer_sent";
    job.priceUpdatedAt = new Date().toISOString();

    localStorage.setItem(
        "findviaJobs",
        JSON.stringify(jobs)
    );

    alert(
        "Private price offer save ho gaya. ✅\n\n" +
        "Next step mein worker is offer ko dekhkar apna response dega."
    );

    showMyJobs();
}


function openWorkerOffer(jobId) {

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    const currentWorker =
        localStorage.getItem("findviaWorkerProfile");

    if (!job.matchedWorker ||
        job.matchedWorker !== currentWorker) {

        alert(
            "Ye private offer aapke liye available nahi hai."
        );

        return;
    }

    if (!job.customerOffer) {

        alert(
            "Customer ne abhi price offer nahi bheja hai."
        );

        return;
    }

    const choice = prompt(
        "Customer ka private offer: ₹" +
        job.customerOffer +
        "\n\n" +
        "1 = Accept Offer\n" +
        "2 = Counter Offer\n" +
        "3 = Reject Offer"
    );

    if (choice === null) {
        return;
    }

    if (choice === "1") {

        job.priceStatus = "accepted";
        job.workerOffer = job.customerOffer;
        job.priceUpdatedAt = new Date().toISOString();

        localStorage.setItem(
            "findviaJobs",
            JSON.stringify(jobs)
        );

        alert(
            "Offer accepted! ✅\n\n" +
            "Agla step job confirmation hoga."
        );

        showMyJobs();

        return;
    }

    if (choice === "2") {

        const counterPrice = prompt(
            "Apna counter offer enter karein:"
        );

        if (counterPrice === null) {
            return;
        }

        const amount = Number(counterPrice);

        if (!Number.isFinite(amount) || amount <= 0) {

            alert(
                "Please ek valid amount enter karein."
            );

            return;
        }

        job.workerOffer = amount;
        job.priceStatus = "counter_offer";
        job.priceUpdatedAt = new Date().toISOString();

        localStorage.setItem(
            "findviaJobs",
            JSON.stringify(jobs)
        );

        alert(
            "Counter offer send ho gaya. 💰\n\n" +
            "Customer ise review karega."
        );

        return;
    }

    if (choice === "3") {

        job.priceStatus = "rejected";
        job.priceUpdatedAt = new Date().toISOString();

        localStorage.setItem(
            "findviaJobs",
            JSON.stringify(jobs)
        );

        alert(
            "Offer reject kar diya gaya."
        );

        return;
    }

    alert(
        "Invalid option. Please 1, 2 ya 3 choose karein."
    );
}


function openCustomerPriceResponse(jobId) {

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    if (job.priceStatus === "accepted") {

        alert(
            "Worker ne aapka offer accept kar liya hai. ✅\n\n" +
            "Agla step job confirmation hoga."
        );

        return;
    }

    if (job.priceStatus === "rejected") {

        alert(
            "Worker ne aapka price offer reject kar diya hai. ❌"
        );

        return;
    }

    if (job.priceStatus === "counter_offer") {

        const workerOffer = job.workerOffer;

        const choice = confirm(
            "Worker ka counter offer: ₹" +
            workerOffer +
            "\n\n" +
            "OK = Counter offer accept karein\n" +
            "Cancel = Abhi accept na karein"
        );

        if (choice) {

            job.customerOffer = workerOffer;
            job.priceStatus = "accepted";
            job.priceUpdatedAt = new Date().toISOString();

            localStorage.setItem(
                "findviaJobs",
                JSON.stringify(jobs)
            );

            alert(
                "Worker ka offer accept ho gaya! ✅\n\n" +
                "Agla step job confirmation hoga."
            );

            showMyJobs();

        }

        return;
    }

    alert("Abhi koi worker price response nahi hai.");
}

function confirmJob(jobId) {

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    if (job.priceStatus !== "accepted") {
        alert(
            "Pehle price agreement complete karein."
        );
        return;
    }

    if (job.jobStatus === "confirmed") {
        alert(
            "Ye job already confirmed hai."
        );
        return;
    }

    const confirmJob = confirm(
        "Job confirm karna hai?\n\n" +
        "Agreed Price: ₹" +
        job.customerOffer +
        "\n\n" +
        "Confirm karne ke baad job officially active ho jayegi."
    );

    if (!confirmJob) {
        return;
    }

    job.jobStatus = "confirmed";
    job.confirmedAt = new Date().toISOString();

    localStorage.setItem(
        "findviaJobs",
        JSON.stringify(jobs)
    );

    alert(
        "Job successfully confirmed! ✅\n\n" +
        "Agreed Price: ₹" +
        job.customerOffer
    );

    showMyJobs();
}


function generateCompletionOTP(jobId) {

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    if (job.jobStatus !== "confirmed") {
        alert(
            "Pehle job confirm karein."
        );
        return;
    }

    if (job.completionOTP) {

        alert(
            "Completion OTP already generated hai.\n\n" +
            "OTP: " + job.completionOTP
        );

        return;
    }

    const otp = Math.floor(
        1000 + Math.random() * 9000
    ).toString();

    job.completionOTP = otp;
    job.completionOTPGeneratedAt =
        new Date().toISOString();

    localStorage.setItem(
        "findviaJobs",
        JSON.stringify(jobs)
    );

    alert(
        "Completion OTP generated! 🔐\n\n" +
        "OTP: " + otp +
        "\n\n" +
        "Kaam complete hone ke baad ye OTP worker ko batayein."
    );
}

function verifyCompletionOTP(jobId) {

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const job = jobs.find(function(item) {
        return item.id === jobId;
    });

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    const currentWorker =
        localStorage.getItem("findviaWorkerProfile");

    if (
        !job.matchedWorker ||
        job.matchedWorker !== currentWorker
    ) {
        alert(
            "Ye OTP aapke liye available nahi hai."
        );
        return;
    }

    if (job.jobStatus !== "confirmed") {
        alert(
            "Ye job abhi confirmed nahi hai."
        );
        return;
    }

    if (!job.completionOTP) {
        alert(
            "Customer ne abhi Completion OTP generate nahi kiya hai."
        );
        return;
    }

    const enteredOTP = prompt(
        "Customer se Completion OTP lekar yahan enter karein:"
    );

    if (enteredOTP === null) {
        return;
    }

    if (enteredOTP.trim() !== job.completionOTP) {

        alert(
            "❌ Incorrect OTP.\n\n" +
            "Job complete nahi hui."
        );

        return;
    }

    job.jobStatus = "completed";
    job.completedAt = new Date().toISOString();

    localStorage.setItem(
        "findviaJobs",
        JSON.stringify(jobs)
    );

    alert(
        "Job successfully completed! ✅\n\n" +
        "Completion OTP verified."
    );

    showMyJobs();
}


function getWorkerCredits() {

    const currentWorker =
        localStorage.getItem("findviaWorkerProfile");

    if (!currentWorker) {
        return 0;
    }

    const wallets = JSON.parse(
        localStorage.getItem("findviaWorkerCredits") || "{}"
    );

    return Number(wallets[currentWorker] || 0);
}


function setWorkerCredits(amount) {

    const currentWorker =
        localStorage.getItem("findviaWorkerProfile");

    if (!currentWorker) {
        return false;
    }

    const wallets = JSON.parse(
        localStorage.getItem("findviaWorkerCredits") || "{}"
    );

    wallets[currentWorker] = Math.max(
        0,
        Number(amount) || 0
    );

    localStorage.setItem(
        "findviaWorkerCredits",
        JSON.stringify(wallets)
    );

    return true;
}


function addWorkerCreditTransaction(
    workerProfile,
    amount,
    type,
    note
) {

    const transactions = JSON.parse(
        localStorage.getItem("findviaCreditTransactions") || "[]"
    );

    const balanceAfter = getWorkerCreditsForProfile(workerProfile);

    transactions.push({
        id: Date.now(),
        workerProfile: workerProfile,
        amount: Number(amount),
        type: type,
        note: note || "",
        balanceAfter: balanceAfter,
        createdAt: new Date().toISOString()
    });

    localStorage.setItem(
        "findviaCreditTransactions",
        JSON.stringify(transactions)
    );
}


function adminAddWorkerCredits() {

    const workerProfile =
        prompt(
            "Worker ka exact profile data enter karein:"
        );

    if (!workerProfile) {
        return;
    }

    const amountInput =
        prompt(
            "Kitne credits add karne hain?\n\n" +
            "Amount ₹ mein enter karein:"
        );

    if (amountInput === null) {
        return;
    }

    const amount = Number(amountInput);

    if (!Number.isFinite(amount) || amount <= 0) {
        alert(
            "Please ek valid amount enter karein."
        );
        return;
    }

    const currentBalance =
        getWorkerCreditsForProfile(workerProfile);

    const newBalance =
        currentBalance + amount;

    setWorkerCreditsForProfile(
        workerProfile,
        newBalance
    );

    addWorkerCreditTransaction(
        workerProfile,
        amount,
        "recharge",
        "Admin verified credit addition"
    );

    alert(
        "Credits successfully added! ✅\n\n" +
        "Added: ₹" + amount +
        "\n" +
        "New Balance: ₹" + newBalance
    );
}


function getWorkerCreditsForProfile(workerProfile) {

    const wallets = JSON.parse(
        localStorage.getItem("findviaWorkerCredits") || "{}"
    );

    return Number(
        wallets[workerProfile] || 0
    );
}


function setWorkerCreditsForProfile(
    workerProfile,
    amount
) {

    const wallets = JSON.parse(
        localStorage.getItem("findviaWorkerCredits") || "{}"
    );

    wallets[workerProfile] =
        Math.max(0, Number(amount) || 0);

    localStorage.setItem(
        "findviaWorkerCredits",
        JSON.stringify(wallets)
    );
}


function openAdminPanel() {

hideAdminScreens();
    
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("searchScreen")?.classList.remove("active");
    document.getElementById("findWorkScreen")?.classList.remove("active");
    document.getElementById("findWorkersScreen")?.classList.remove("active");
    document.getElementById("profileScreen")?.classList.remove("active");
    document.getElementById("workerProfileScreen")?.classList.remove("active");
    document.getElementById("postJobScreen")?.classList.remove("active");
    document.getElementById("jobResponsesScreen")?.classList.remove("active");

    const myJobsScreen =
        document.getElementById("myJobsScreen");

    if (myJobsScreen) {
        myJobsScreen.style.display = "none";
    }

    const adminPanelScreen =
        document.getElementById("adminPanelScreen");

    if (!adminPanelScreen) {
        alert("Admin Panel screen nahi mili.");
        return;
    }

    adminPanelScreen.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function adminLogin() {

    const passwordInput =
        document.getElementById("adminPasswordInput");

    if (!passwordInput) {
        alert("Admin login screen nahi mili.");
        return;
    }

    const password =
        passwordInput.value.trim();

    if (!password) {
        alert("Please admin password enter karein.");
        return;
    }

    /*
        Prototype admin password.
        Real authentication Supabase/backend
        ke saath later implement hogi.
    */
    const ADMIN_PASSWORD = "FindViaAdmin2026";

    if (password !== ADMIN_PASSWORD) {

        alert(
            "❌ Incorrect admin password."
        );

        passwordInput.value = "";

        return;
    }

    passwordInput.value = "";

    document.getElementById("adminLoginScreen").style.display =
        "none";

    openAdminPanel();
}

function openAdminLogin() {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("searchScreen")?.classList.remove("active");
    document.getElementById("findWorkScreen")?.classList.remove("active");
    document.getElementById("findWorkersScreen")?.classList.remove("active");
    document.getElementById("profileScreen")?.classList.remove("active");
    document.getElementById("workerProfileScreen")?.classList.remove("active");
    document.getElementById("postJobScreen")?.classList.remove("active");
    document.getElementById("jobResponsesScreen")?.classList.remove("active");

    const myJobsScreen =
        document.getElementById("myJobsScreen");

    if (myJobsScreen) {
        myJobsScreen.style.display = "none";
    }

    const adminPanelScreen =
        document.getElementById("adminPanelScreen");

    if (adminPanelScreen) {
        adminPanelScreen.style.display = "none";
    }

    const adminLoginScreen =
        document.getElementById("adminLoginScreen");

    if (!adminLoginScreen) {
        alert("Admin Login screen nahi mili.");
        return;
    }

    adminLoginScreen.style.display = "block";

    const passwordInput =
        document.getElementById("adminPasswordInput");

    if (passwordInput) {
        passwordInput.value = "";
        passwordInput.focus();
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function hideAdminScreens() {

    const adminLoginScreen = document.getElementById(
        "adminLoginScreen"
    );

    const adminPanelScreen = document.getElementById(
        "adminPanelScreen"
    );

    const adminWorkersScreen = document.getElementById(
        "adminWorkersScreen"
    );

    const adminTransactionsScreen = document.getElementById(
        "adminWorkerTransactionsScreen"
    );

    if (adminLoginScreen) {
        adminLoginScreen.style.display = "none";
    }

    if (adminPanelScreen) {
        adminPanelScreen.style.display = "none";
    }

    if (adminWorkersScreen) {
        adminWorkersScreen.style.display = "none";
    }

    if (adminTransactionsScreen) {
        adminTransactionsScreen.style.display = "none";
    }
}



function openAdminWorkers() {

    hideAdminScreens();

    const workersScreen = document.getElementById("adminWorkersScreen");
    const workersList = document.getElementById("adminWorkersList");

    if (!workersScreen || !workersList) {
        alert("Worker management screen not found.");
        return;
    }

    workersScreen.style.display = "block";

    let workerProfiles = JSON.parse(
    localStorage.getItem("findviaWorkerProfiles") || "[]"
);

// Agar existing current worker profile collection mein nahi hai,
// to use automatically collection mein add karo.
const currentWorkerProfile = localStorage.getItem(
    "findviaWorkerProfile"
);

if (
    currentWorkerProfile &&
    !workerProfiles.includes(currentWorkerProfile)
) {
    workerProfiles.push(currentWorkerProfile);

    localStorage.setItem(
        "findviaWorkerProfiles",
        JSON.stringify(workerProfiles)
    );
}

    if (workerProfiles.length === 0) {
        workersList.innerHTML = `
            <div class="job-card">
                <h3>No workers found</h3>
                <p class="job-description">
                    Abhi tak koi worker profile available nahi hai.
                </p>
            </div>
        `;
        return;
    }

    workersList.innerHTML = "";

    workerProfiles.forEach((profileString, index) => {

        const worker = JSON.parse(profileString);

        const credits = getWorkerCreditsForProfile(profileString);

        const card = document.createElement("div");
        card.className = "job-card";

        card.innerHTML = `
            <div class="job-card-top">
                <div>
                    <span class="job-category">
                        WORKER #${index + 1}
                    </span>

                    <h3>${worker.name}</h3>
                </div>

                <span class="job-status">
                    ${worker.availability}
                </span>
            </div>

            <p class="job-description">
                🔧 ${worker.service}<br>
                📍 ${worker.area}<br>
                ⭐ ${worker.experience} experience
            </p>

            <div style="
                margin-top:12px;
                padding:12px;
                border-radius:10px;
                background:#f5f5f5;
            ">
                💰 <strong>FindVia Credits</strong><br>
                <span style="font-size:20px;font-weight:bold;">
                    ₹${credits}
                </span>
            </div>
<button
    class="primary-btn"
    style="margin-top:12px;"
    onclick="adminAddWorkerCreditsFromList(${index})"
>
    ➕ Add Credits
</button>

<button
    class="primary-btn"
    style="margin-top:8px;"
    onclick="openWorkerTransactions(${index})"
>
    📋 Transaction History
</button>
            
        `;

        workersList.appendChild(card);
    });
}

function adminAddWorkerCreditsFromList(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    const profileString = workerProfiles[index];

    if (!profileString) {
        alert("Worker not found.");
        return;
    }

    const worker = JSON.parse(profileString);

    const amount = prompt(
        `Worker: ${worker.name}\n\nKitne credits add karne hain?`
    );

    if (amount === null) {
        return;
    }

    const creditAmount = Number(amount);

    if (!Number.isFinite(creditAmount) || creditAmount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }

    const currentCredits = getWorkerCreditsForProfile(profileString);

    setWorkerCreditsForProfile(
        profileString,
        currentCredits + creditAmount
    );

    addWorkerCreditTransaction(
        profileString,
        creditAmount,
        "Admin credit recharge"
    );

    alert(
        `₹${creditAmount} credits added successfully to ${worker.name}.`
    );

    openAdminWorkers();
}

function openWorkerTransactions(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    const profileString = workerProfiles[index];

    if (!profileString) {
        alert("Worker not found.");
        return;
    }

    const worker = JSON.parse(profileString);

    const transactions = JSON.parse(
        localStorage.getItem("findviaCreditTransactions") || "[]"
    );

    const workerTransactions = transactions.filter(
        function(transaction) {
            return transaction.workerProfile === profileString;
        }
    );

    const transactionScreen = document.getElementById(
        "adminWorkerTransactionsScreen"
    );

    const transactionList = document.getElementById(
        "adminWorkerTransactionsList"
    );

    const workerName = document.getElementById(
        "adminTransactionWorkerName"
    );

    if (
        !transactionScreen ||
        !transactionList ||
        !workerName
    ) {
        alert("Transaction screen not found.");
        return;
    }

    document.getElementById("adminWorkersScreen").style.display =
        "none";

    transactionScreen.style.display = "block";

    workerName.textContent =
        worker.name + " • Transaction History";

    if (workerTransactions.length === 0) {

        transactionList.innerHTML = `
            <div class="job-card">
                <h3>No transactions yet</h3>

                <p class="job-description">
                    Is worker ke liye abhi koi credit transaction nahi hai.
                </p>
            </div>
        `;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }

    transactionList.innerHTML = "";

    let runningBalance = 0;

workerTransactions
    .slice()
    .sort(function(a, b) {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    })
    .forEach(function(transaction) {

        const amount = Number(transaction.amount) || 0;

        runningBalance += amount;

        const balanceAfter =
            transaction.balanceAfter !== undefined
                ? Number(transaction.balanceAfter)
                : runningBalance;

        const isDebit = amount < 0;

        const displayAmount = Math.abs(amount);

        const date = transaction.createdAt
            ? new Date(transaction.createdAt).toLocaleString()
            : "Date unavailable";

        const card = document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `
            <div class="job-card-top">

                <div>

                    <span class="job-category">
                        ${transaction.type || "Credit Transaction"}
                    </span>

                    <h3>
                        ${isDebit ? "💸 −" : "💰 +"}₹${displayAmount}
                    </h3>

                </div>

                <span class="job-status">
                    ${isDebit ? "Deducted" : "Added"}
                </span>

            </div>

            <p class="job-description">

                📅 ${date}

                <br>

                💰 Balance after:
                <strong>₹${balanceAfter}</strong>

                ${
                    transaction.note
                    ? `<br>📝 ${transaction.note}`
                    : ""
                }

            </p>
        `;

        transactionList.appendChild(card);
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
