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

    const currentLocation =
        document.getElementById(
            "locationText"
        )?.textContent || "";

    showFindViaInputModal(
    "Select Location",
    "Apna location enter karein:",
    function(location) {

        const cleanLocation =
            location.trim();

        if (!cleanLocation) {

            alert(
                "Please location enter karein."
            );

            return;
        }

        const locationText =
            document.getElementById(
                "locationText"
            );

        if (locationText) {

            locationText.textContent =
                cleanLocation;
        }
    },
    "text",
    "Enter location",
    "Please location enter karein.",
    "📍"
);

    const input =
        document.getElementById(
            "findviaModalInput"
        );

    if (
        input &&
        currentLocation &&
        currentLocation !== "Select Location"
    ) {

        input.value =
            currentLocation;
    }
}

function findWork() {

hideAdminScreens();
hideWorkerTransactionScreen();
    
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

hideAdminScreens();
 hideWorkerTransactionScreen();   
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
hideWorkerTransactionScreen();
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

function hasSufficientCreditsForJob(job) {

    if (!job) {
        return false;
    }

    const workerProfile =
        localStorage.getItem("findviaWorkerProfile");

    if (!workerProfile) {
        return false;
    }

    const currentCredits =
        getWorkerCreditsForProfile(workerProfile);

    /*
     * Customer ka maximum budget worker ko show nahi hota.
     * Sirf internal eligibility check ke liye use ho raha hai.
     */
    const maximumJobAmount =
        Number(job.budget);

    if (
        !Number.isFinite(maximumJobAmount) ||
        maximumJobAmount <= 0
    ) {
        return true;
    }

    const estimatedCommission =
        calculateFindViaCommission(
            maximumJobAmount
        );

    return currentCredits >= estimatedCommission;
}

function isJobAvailableForFindWork(job) {

    if (!job) {
        return false;
    }

    // Job open honi chahiye
    if (job.status !== "open") {
        return false;
    }

    // Already matched job available nahi hai
    if (job.matchStatus === "matched") {
        return false;
    }

    // Confirmed / completed job available nahi hai
    if (
        job.jobStatus === "confirmed" ||
        job.jobStatus === "completed"
    ) {
        return false;
    }

    /*
     * Fixed-time expiry:
     *
     * Today     → aaj raat 11:59:59 PM tak
     * Tomorrow  → kal raat 11:59:59 PM tak
     * This week → current week ke end tak
     *
     * As soon as possible / Flexible
     * → fixed expiry nahi.
     */

    const now = new Date();

    if (job.timing === "Today") {

        const endOfToday =
            new Date();

        endOfToday.setHours(
            23, 59, 59, 999
        );

        if (now > endOfToday) {
            return false;
        }
    }

    if (job.timing === "Tomorrow") {

        const endOfTomorrow =
            new Date();

        endOfTomorrow.setDate(
            endOfTomorrow.getDate() + 1
        );

        endOfTomorrow.setHours(
            23, 59, 59, 999
        );

        if (now > endOfTomorrow) {
            return false;
        }
    }

    if (job.timing === "Within this week") {

        const endOfWeek =
            new Date();

        const day =
            endOfWeek.getDay();

        const daysUntilSunday =
            7 - day;

        endOfWeek.setDate(
            endOfWeek.getDate() +
            daysUntilSunday
        );

        endOfWeek.setHours(
            23, 59, 59, 999
        );

        if (now > endOfWeek) {
            return false;
        }
    }

    return true;
}

function showPostedJobs(categoryFilter = "") {

    const resultsBox =
        document.getElementById("workResults");

    if (!resultsBox) {
        return;
    }

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    let availableJobs = jobs.filter(function(job) {
        return isJobAvailableForFindWork(job);
    });

    if (categoryFilter) {

        availableJobs =
            availableJobs.filter(function(job) {

                return (
                    job.category === categoryFilter
                );

            });
    }

    if (availableJobs.length === 0) {

        resultsBox.innerHTML = `
            <div class="empty-state">

                <strong>
                    ${
                        categoryFilter
                        ? "No jobs found in this category."
                        : "No jobs available yet."
                    }
                </strong>

                <p>
                    ${
                        categoryFilter
                        ? "Is category mein abhi koi available job nahi hai."
                        : "New local work opportunities will appear here."
                    }
                </p>

            </div>
        `;

        return;
    }

    let html = `
        <div class="worker-results-header">

            <div>

                <span class="results-label">
                    LOCAL OPPORTUNITIES
                </span>

                <h3>
                    ${
                        categoryFilter
                        ? escapeHTML(categoryFilter) + " Jobs"
                        : "Available Jobs"
                    }
                </h3>

            </div>

            <span class="results-count">
                ${availableJobs.length} found
            </span>

        </div>
    `;

    availableJobs.forEach(function(job) {

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
                        Open
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

                ${
                    job.photo
                    ? `
                        <img
                            class="job-photo"
                            src="${job.photo}"
                            alt="Job photo"
                        >
                    `
                    : ""
                }

                <div class="job-private-note">
                    🔒 Customer budget is hidden until the appropriate match stage.
                </div>

                ${
                    job.matchedWorker &&
                    job.matchedWorker ===
                        localStorage.getItem(
                            "findviaWorkerProfile"
                        ) &&
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

                ${
                    hasSufficientCreditsForJob(job)
                    ? `
                        <button
                            class="primary-btn job-interest-btn"
                            onclick="respondToJob(${job.id})"
                        >
                            I'm Interested
                        </button>
                    `
                    : ""
                }

            </div>
        `;
    });

    resultsBox.innerHTML = html;
}


function selectWorkCategory(category) {

    const searchInput =
        document.getElementById("workSearch");

    if (searchInput) {
        searchInput.value = "";
    }

    showPostedJobs(category);
}



function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value || "";

    return div.innerHTML;
}

function respondToJob(jobId) {

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

if (!isJobAvailableForFindWork(job)) {

    alert(
        "Ye job ab available nahi hai.\n\n" +
        "Job expire, match ya complete ho chuki ho sakti hai."
    );

    return;
}
    
    const workerProfile = JSON.parse(
        localStorage.getItem("findviaWorkerProfile") || "null"
    );

    if (!workerProfile) {
        alert(
            "Worker profile nahi mila.\n\n" +
            "Pehle worker profile setup karein."
        );
        return;
    }

    if (workerProfile.verificationStatus !== "approved") {
        alert(
            "⏳ Worker verification required.\n\n" +
            "Aapka worker profile abhi approved nahi hai.\n\n" +
            "Admin approval ke baad hi aap jobs par response kar sakte hain."
        );
        return;
    }

    const currentRole =
        localStorage.getItem("findviaUserRole");

    if (currentRole !== "worker") {

        alert(
            "Is job par interest show karne ke liye Worker role select karein."
        );

        showProfile();
        return;
    }

    /*
     * Final completion se pehle hi credit eligibility check.
     */
    if (!hasSufficientCreditsForJob(job)) {

        alert(
            "❌ FindVia credits insufficient hain.\n\n" +
            "Is job par interest show karne se pehle credits recharge karein."
        );

        return;
    }

    const responses = JSON.parse(
        localStorage.getItem("findviaJobResponses") || "[]"
    );

    const alreadyResponded =
        responses.some(function(response) {

            return (
                response.jobId === jobId &&
                response.workerProfile ===
                    localStorage.getItem(
                        "findviaWorkerProfile"
                    )
            );

        });

    if (alreadyResponded) {

        alert(
            "Aap already is job mein interest dikha chuke hain."
        );

        return;
    }

    responses.push({

        jobId: jobId,

        workerProfile:
            localStorage.getItem(
                "findviaWorkerProfile"
            ) || "{}",

        status: "pending",

        createdAt:
            new Date().toISOString()
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
  hideWorkerTransactionScreen();  
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
hideWorkerTransactionScreen();
    
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

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    const approvedWorkers = [];

    workerProfiles.forEach(function(profileData) {

        try {

            const worker =
                typeof profileData === "string"
                    ? JSON.parse(profileData)
                    : profileData;

            if (
                worker &&
                worker.verificationStatus === "approved" &&
                worker.service === category
            ) {

                approvedWorkers.push(worker);

            }

        } catch (error) {

            console.log(
                "Invalid worker profile skipped."
            );

        }

    });

    const selectedWorkers =
        approvedWorkers;

    let html = `
        <div class="worker-results-header">

            <div>

                <span class="results-label">
                    AVAILABLE NEAR YOU
                </span>

                <h3>
                    ${escapeHTML(category)} Professionals
                </h3>

            </div>

            <span class="results-count">
                ${selectedWorkers.length} found
            </span>

        </div>
    `;

    if (selectedWorkers.length === 0) {

        html += `
            <div class="empty-state">

                <div style="font-size:40px;">
                    👷
                </div>

                <h3>
                    No approved workers found
                </h3>

                <p>
                    Is service ke liye abhi koi approved worker available nahi hai.
                </p>

            </div>
        `;

        document.getElementById(
            "workerResults"
        ).innerHTML = html;

        return;
    }

    selectedWorkers.forEach(function(worker) {

        const workerName =
            worker.name || "Worker";

        const workerInitial =
            workerName.charAt(0).toUpperCase();

        html += `
            <div class="worker-card premium-worker-card">

                <div class="worker-avatar">
                    ${escapeHTML(workerInitial)}
                </div>

                <div class="worker-info">

                    <div class="worker-name-row">

                        <h4>
                            ${escapeHTML(workerName)}
                        </h4>

                        <span class="verified-badge">
                            ✓ Verified
                        </span>

                    </div>

                    <div class="worker-status">

                        <span class="online-dot"></span>

                        ${escapeHTML(
                            worker.availability || "Available"
                        )}

                    </div>

                    <p>
                        📍 ${escapeHTML(
                            worker.area || "Area not specified"
                        )}
                    </p>

                    <div class="worker-stats">

                        <span>
                            💼 ${escapeHTML(
                                worker.experience || "Experience not specified"
                            )}
                        </span>

                    </div>

                </div>

            </div>
        `;
    });

    document.getElementById(
        "workerResults"
    ).innerHTML = html;
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
 hideWorkerTransactionScreen();   
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen").classList.remove("active");
    document.getElementById("findWorkersScreen").classList.remove("active");
    document.getElementById("profileScreen").classList.remove("active");
    document.getElementById("workerProfileScreen").classList.remove("active");
document.getElementById("myJobsScreen").style.display = "none";
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


    const myJobsButton =
    document.getElementById("myJobsButton");

if (myJobsButton) {

    if (role === "worker") {

        myJobsButton.textContent =
            "📋 My Matched Jobs";

    } else {

        myJobsButton.textContent =
            "📋 My Posted Jobs";
    }
}



    const workerTransactionsBox =
    document.getElementById(
        "workerTransactionsBox"
    );

if (workerTransactionsBox) {

    if (role === "worker") {

        workerTransactionsBox.style.display =
            "block";

    } else {

        workerTransactionsBox.style.display =
            "none";
    }
}
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

    const existingProfile = JSON.parse(
        localStorage.getItem("findviaWorkerProfile") || "null"
    );

    const workerProfile = {
        name: name,
        service: service,
        experience: experience,
        area: area,
        availability: availability,
verificationStatus:
    existingProfile?.verificationStatus === "approved"
        ? "approved"
        : "pending"
        
    };

    const profileString = JSON.stringify(workerProfile);

    localStorage.setItem(
        "findviaWorkerProfile",
        profileString
    );

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    const existingProfileString =
        existingProfile
            ? JSON.stringify(existingProfile)
            : null;

    const existingIndex =
        existingProfileString
            ? workerProfiles.indexOf(existingProfileString)
            : -1;

    if (existingIndex !== -1) {
        workerProfiles[existingIndex] = profileString;
    } else if (!workerProfiles.includes(profileString)) {
        workerProfiles.push(profileString);
    }

    localStorage.setItem(
        "findviaWorkerProfiles",
        JSON.stringify(workerProfiles)
    );

    alert(
        "Worker profile saved successfully.\n\n" +
        "Verification status: " +
        workerProfile.verificationStatus
    );

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

const verificationElement =
    document.getElementById("summaryWorkerVerification");

if (verificationElement) {

    if (profile.verificationStatus === "approved") {

        verificationElement.textContent =
            "🟢 Approved";

    } else if (profile.verificationStatus === "rejected") {

        verificationElement.textContent =
            "🔴 Rejected";

    } else {

        verificationElement.textContent =
            "🟡 Pending Verification";
    }
}
    

    summaryBox.style.display = "block";
}


function showMyJobs() {
hideWorkerTransactionScreen();
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

    hideAdminScreens();
hideWorkerTransactionScreen();
    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen")?.classList.remove("active");
    document.getElementById("findWorkersScreen")?.classList.remove("active");
    document.getElementById("searchScreen")?.classList.remove("active");
    document.getElementById("profileScreen")?.classList.remove("active");
    document.getElementById("workerProfileScreen")?.classList.remove("active");
    document.getElementById("postJobScreen")?.classList.remove("active");

    document.getElementById("myJobsScreen").style.display = "none";

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

    function continueWorkerSelection() {

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

        if (job.matchStatus === "matched") {

            alert(
                "Ye job already kisi worker ke saath matched hai."
            );

            return;
        }

        let jobResponses = responses.filter(function(response) {
            return response.jobId === jobId;
        });

        let selectedResponse =
            jobResponses[responseIndex];

        if (!selectedResponse) {
            alert("Worker response nahi mili.");
            return;
        }

        job.matchedWorker =
            selectedResponse.workerProfile;

        job.matchStatus =
            "matched";

        job.matchedAt =
            new Date().toISOString();

        localStorage.setItem(
            "findviaJobs",
            JSON.stringify(jobs)
        );

        selectedResponse.status =
            "matched";

        let globalResponseIndex =
            responses.findIndex(function(response) {

                return (
                    response.jobId === jobId &&
                    response.createdAt ===
                        selectedResponse.createdAt
                );

            });

        if (globalResponseIndex !== -1) {

            responses[
                globalResponseIndex
            ].status = "matched";

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

    showFindViaActionModal(
        "Select Worker",
        "Kya aap is worker ko is job ke liye select karna chahte hain?\n\n" +
        "Select karne ke baad worker ke saath private pricing process shuru hogi.",
        [
            {
                text: "Select Worker",
                icon: "👷",
                action: function() {

                    closeFindViaActionModal();

                    continueWorkerSelection();
                }
            },
            
        ]
    );
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

    showFindViaInputModal(
        "Private Price Offer",
        "Is job ke liye aap kitna price offer karna chahte hain?\n\nYe offer private rahega.",
        function(price) {

            const amount =
                Number(price);

            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please ek valid amount enter karein."
                );

                return;
            }

            job.customerOffer =
                amount;

            job.priceStatus =
                "customer_offer_sent";

            job.priceUpdatedAt =
                new Date().toISOString();

            localStorage.setItem(
                "findviaJobs",
                JSON.stringify(jobs)
            );

            alert(
                "Private price offer save ho gaya. ✅\n\n" +
                "Next step mein worker is offer ko dekhkar apna response dega."
            );

            showMyJobs();
        },
        "number",
        "Enter amount",
        "Please amount enter karein.",
        "💰"
    );
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

    if (
        !job.matchedWorker ||
        job.matchedWorker !== currentWorker
    ) {

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

    showFindViaActionModal(
        "Customer ka Private Offer",
        "₹" + job.customerOffer,
        [
            {
                text: "Accept Offer",
                icon: "✅",
                action: function() {

                    job.priceStatus = "accepted";
                    job.workerOffer = job.customerOffer;
                    job.priceUpdatedAt =
                        new Date().toISOString();

                    localStorage.setItem(
                        "findviaJobs",
                        JSON.stringify(jobs)
                    );

                    closeFindViaActionModal();

                    alert(
                        "Offer accepted! ✅\n\n" +
                        "Agla step job confirmation hoga."
                    );

                    showMyJobs();
                }
            },

            {
                text: "Counter Offer",
                icon: "💰",
                action: function() {

                    showFindViaInputModal(
                        "Counter Offer",
                        "Apna counter offer enter karein:",
                        function(counterPrice) {

                            const amount =
                                Number(counterPrice);

                            if (
                                !Number.isFinite(amount) ||
                                amount <= 0
                            ) {

                                alert(
                                    "Please ek valid amount enter karein."
                                );

                                return;
                            }

closeFindViaActionModal();

                            
                            job.workerOffer = amount;
                            job.priceStatus =
                                "counter_offer";
                            job.priceUpdatedAt =
                                new Date().toISOString();

                            localStorage.setItem(
                                "findviaJobs",
                                JSON.stringify(jobs)
                            );

                            closeFindViaInputModal();

                            alert(
                                "Counter offer send ho gaya. 💰\n\n" +
                                "Customer ise review karega."
                            );
                        }
                    );
                }
            },

            {
                text: "Reject Offer",
                icon: "❌",
                action: function() {

                    job.priceStatus = "rejected";
                    job.priceUpdatedAt =
                        new Date().toISOString();

                    localStorage.setItem(
                        "findviaJobs",
                        JSON.stringify(jobs)
                    );

                    closeFindViaActionModal();

                    alert(
                        "Offer reject kar diya gaya."
                    );
                }
            }
        ]
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

        const workerOffer =
            job.workerOffer;

        showFindViaActionModal(
            "Worker Counter Offer",
            "Worker ka counter offer: ₹" +
            workerOffer +
            "\n\n" +
            "Kya aap ye offer accept karna chahte hain?",
            [
                {
                    text: "Accept Offer",
                    icon: "✅",
                    action: function() {

                        job.customerOffer =
                            workerOffer;

                        job.priceStatus =
                            "accepted";

                        job.priceUpdatedAt =
                            new Date().toISOString();

                        localStorage.setItem(
                            "findviaJobs",
                            JSON.stringify(jobs)
                        );

                        closeFindViaActionModal();

                        alert(
                            "Worker ka offer accept ho gaya! ✅\n\n" +
                            "Agla step job confirmation hoga."
                        );

                        showMyJobs();
                    }
                },
                
            ]
        );

        return;
    }

    alert(
        "Abhi koi worker price response nahi hai."
    );
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

    showFindViaActionModal(
        "Confirm Job",
        "Job confirm karna hai?\n\n" +
        "Agreed Price: ₹" +
        job.customerOffer +
        "\n\n" +
        "Confirm karne ke baad job officially active ho jayegi.",
        [
            {
                text: "Confirm Job",
                icon: "✅",
                action: function() {

                    job.jobStatus =
                        "confirmed";

                    job.confirmedAt =
                        new Date().toISOString();

                    localStorage.setItem(
                        "findviaJobs",
                        JSON.stringify(jobs)
                    );

                    closeFindViaActionModal();

                    alert(
                        "Job successfully confirmed! ✅\n\n" +
                        "Agreed Price: ₹" +
                        job.customerOffer
                    );

                    showMyJobs();
                }
            },
          
        ]
    );
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

    showFindViaInputModal(
        "Complete Job",
        "Customer se mila 4-digit OTP enter karein:",
        function(enteredOTP) {

            if (
                enteredOTP.trim() !==
                job.completionOTP
            ) {

                alert(
                    "❌ Incorrect OTP.\n\n" +
                    "Job complete nahi hui."
                );

                return;
            }

            const agreedAmount =
                Number(job.customerOffer);

            if (
                !Number.isFinite(agreedAmount) ||
                agreedAmount <= 0
            ) {

                alert(
                    "Job price valid nahi hai.\n\n" +
                    "Commission process nahi ho sakta."
                );

                return;
            }

            const commissionPercent =
                getFindViaCommissionPercent();

            const commissionAmount =
                calculateFindViaCommission(
                    agreedAmount
                );

            job.finalAmount =
                agreedAmount;

            job.commissionPercent =
                commissionPercent;

            job.commissionAmount =
                commissionAmount;

            job.commissionLockedAt =
                new Date().toISOString();

            const workerProfile =
                localStorage.getItem(
                    "findviaWorkerProfile"
                );

            if (!workerProfile) {

                alert(
                    "Worker profile nahi mila.\n\n" +
                    "Job complete nahi hui."
                );

                return;
            }

            const currentCredits =
                getWorkerCreditsForProfile(
                    workerProfile
                );

            if (
                currentCredits <
                commissionAmount
            ) {

                alert(
                    "❌ Insufficient FindVia credits.\n\n" +
                    "Required: ₹" +
                    commissionAmount +
                    "\n" +
                    "Available: ₹" +
                    currentCredits +
                    "\n\n" +
                    "Please recharge credits before completing this job."
                );

                return;
            }

            const newBalance =
                currentCredits -
                commissionAmount;

            setWorkerCreditsForProfile(
                workerProfile,
                newBalance
            );

            addWorkerCreditTransaction(
                workerProfile,
                -commissionAmount,
                "debit",
                "Commission deducted for Job #" +
                    job.id,
                {
                    jobId: job.id,
                    jobAmount:
                        job.finalAmount,
                    commissionPercent:
                        job.commissionPercent,
                    commissionAmount:
                        job.commissionAmount
                }
            );

            job.jobStatus =
                "completed";

            job.completedAt =
                new Date().toISOString();

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
    );
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
    note,
    jobDetails
) {

    const transactions = JSON.parse(
        localStorage.getItem("findviaCreditTransactions") || "[]"
    );

    const balanceAfter =
        getWorkerCreditsForProfile(workerProfile);

    const transaction = {
        id: Date.now(),
        workerProfile: workerProfile,
        amount: Number(amount),
        type: type,
        note: note || "",
        balanceAfter: balanceAfter,
        createdAt: new Date().toISOString()
    };

    if (jobDetails) {
        transaction.jobId =
            jobDetails.jobId || null;

        transaction.jobAmount =
            Number(jobDetails.jobAmount) || 0;

        transaction.commissionPercent =
            Number(jobDetails.commissionPercent) || 0;

        transaction.commissionAmount =
            Number(jobDetails.commissionAmount) || 0;
    }

    transactions.push(transaction);

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


const commissionInput =
    document.getElementById("adminCommissionInput");

const commissionDisplay =
    document.getElementById("adminCommissionCurrent");

const currentCommission =
    getFindViaCommissionPercent();

if (commissionInput) {
    commissionInput.value = currentCommission;
}

if (commissionDisplay) {
    commissionDisplay.textContent =
        currentCommission + "%";
}
    

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

function hideWorkerTransactionScreen() {

    const transactionScreen =
        document.getElementById(
            "workerTransactionHistoryScreen"
        );

    if (transactionScreen) {
        transactionScreen.style.display = "none";
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
    ${worker.verificationStatus === "approved"
        ? "Approved"
        : worker.verificationStatus === "rejected"
        ? "Rejected"
        : "Pending"}
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


${
    worker.verificationStatus !== "approved"
    ? `
        <button
            class="primary-btn"
            style="margin-top:8px;"
            onclick="approveWorker(${index})"
        >
            ✅ Approve Worker
        </button>
    `
    : `
        <button
            class="primary-btn"
            style="margin-top:8px;"
            onclick="rejectWorker(${index})"
        >
            ❌ Reject Worker
        </button>
    `
}

            
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
${
    transaction.jobId
    ? `
        <br>🔧 Job ID:
        <strong>#${transaction.jobId}</strong>

        <br>💵 Job Amount:
        <strong>₹${transaction.jobAmount}</strong>

        <br>📊 Commission:
        <strong>
            ${transaction.commissionPercent}%
            (₹${transaction.commissionAmount})
        </strong>
    `
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


function openWorkerTransactionHistory() {

    hideAdminScreens();

    const workerProfile =
        localStorage.getItem(
            "findviaWorkerProfile"
        );

    if (!workerProfile) {

        alert(
            "Worker profile nahi mila."
        );

        return;
    }

    const worker =
        JSON.parse(workerProfile);

    const transactions =
        JSON.parse(
            localStorage.getItem(
                "findviaCreditTransactions"
            ) || "[]"
        );

    const workerTransactions =
        transactions.filter(
            function(transaction) {

                return (
                    transaction.workerProfile ===
                    workerProfile
                );

            }
        );

    const profileScreen =
        document.getElementById(
            "profileScreen"
        );

    const transactionScreen =
        document.getElementById(
            "workerTransactionHistoryScreen"
        );

    const transactionList =
        document.getElementById(
            "workerTransactionHistoryList"
        );

    if (
        !transactionScreen ||
        !transactionList
    ) {

        alert(
            "Transaction History screen nahi mili."
        );

        return;
    }

    if (profileScreen) {
        profileScreen.classList.remove(
            "active"
        );
    }

    transactionScreen.style.display =
        "block";

    transactionList.innerHTML = "";

    if (
        workerTransactions.length === 0
    ) {

        transactionList.innerHTML = `
            <div class="job-card">

                <h3>
                    No transactions yet
                </h3>

                <p class="job-description">
                    Abhi tak aapki koi credit transaction nahi hui hai.
                </p>

            </div>
        `;

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }

    let runningBalance = 0;

    workerTransactions
        .slice()
        .sort(function(a, b) {

            return (
                new Date(
                    a.createdAt || 0
                ) -
                new Date(
                    b.createdAt || 0
                )
            );

        })
        .forEach(function(transaction) {

            const amount =
                Number(transaction.amount) || 0;

            runningBalance += amount;

            const balanceAfter =
                transaction.balanceAfter !== undefined
                    ? Number(
                        transaction.balanceAfter
                    )
                    : runningBalance;

            const isDebit =
                amount < 0;

            const displayAmount =
                Math.abs(amount);

            const date =
                transaction.createdAt
                    ? new Date(
                        transaction.createdAt
                    ).toLocaleString()
                    : "Date unavailable";

            const card =
                document.createElement(
                    "div"
                );

            card.className =
                "job-card";

            card.innerHTML = `

                <div class="job-card-top">

                    <div>

                        <span class="job-category">
                            ${transaction.type || "Credit Transaction"}
                        </span>

                        <h3>
                            ${
                                isDebit
                                    ? "💸 −"
                                    : "💰 +"
                            }₹${displayAmount}
                        </h3>

                    </div>

                    <span class="job-status">
                        ${
                            isDebit
                                ? "Deducted"
                                : "Added"
                        }
                    </span>

                </div>

                <p class="job-description">

                    📅 ${date}

                    <br>

                    💳 Balance after:
                    <strong>
                        ₹${balanceAfter}
                    </strong>

                    ${
                        transaction.note
                            ? `
                                <br>
                                📝 ${transaction.note}
                            `
                            : ""
                    }

                    ${
                        transaction.jobId
                            ? `
                                <br>
                                🔧 Job ID:
                                <strong>
                                    #${transaction.jobId}
                                </strong>

                                <br>
                                💵 Job Amount:
                                <strong>
                                    ₹${transaction.jobAmount}
                                </strong>

                                <br>
                                📊 Commission:
                                <strong>
                                    ${transaction.commissionPercent}%
                                    (₹${transaction.commissionAmount})
                                </strong>
                            `
                            : ""
                    }

                </p>
            `;

            transactionList.appendChild(
                card
            );

        });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

/* ================================
   FINDVIA COMMISSION SYSTEM
================================ */

function getFindViaCommissionPercent() {

    const savedCommission = localStorage.getItem(
        "findviaCommissionPercent"
    );

    if (savedCommission === null) {
        return 10;
    }

    const commission = Number(savedCommission);

    if (!Number.isFinite(commission) || commission < 0 || commission > 100) {
        return 10;
    }

    return commission;
}


function setFindViaCommissionPercent(percent) {

    const commission = Number(percent);

    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {
        return false;
    }

    localStorage.setItem(
        "findviaCommissionPercent",
        commission.toString()
    );

    return true;
}


function calculateFindViaCommission(amount) {

    const price = Number(amount);

    if (!Number.isFinite(price) || price <= 0) {
        return 0;
    }

    const commissionPercent =
        getFindViaCommissionPercent();

    return Math.round(
        (price * commissionPercent) / 100
    );
}

function saveAdminCommission() {

    const input = document.getElementById(
        "adminCommissionInput"
    );

    const currentDisplay = document.getElementById(
        "adminCommissionCurrent"
    );

    if (!input) {
        return;
    }

    const commission = Number(input.value);

    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {
        alert("Commission must be between 0% and 100%.");
        return;
    }

    const saved = setFindViaCommissionPercent(
        commission
    );

    if (!saved) {
        alert("Unable to save commission.");
        return;
    }

    if (currentDisplay) {
        currentDisplay.textContent =
            commission + "%";
    }

    alert(
        "Commission updated successfully to " +
        commission +
        "%."
    );
}


function approveWorker(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    if (!workerProfiles[index]) {
        alert("Worker profile nahi mila.");
        return;
    }

    const worker = JSON.parse(workerProfiles[index]);

    worker.verificationStatus = "approved";

    workerProfiles[index] = JSON.stringify(worker);

    localStorage.setItem(
        "findviaWorkerProfiles",
        JSON.stringify(workerProfiles)
    );

    const currentProfile = JSON.parse(
        localStorage.getItem("findviaWorkerProfile") || "null"
    );

    if (
        currentProfile &&
        currentProfile.name === worker.name
    ) {
        currentProfile.verificationStatus = "approved";

        localStorage.setItem(
            "findviaWorkerProfile",
            JSON.stringify(currentProfile)
        );
    }

    alert(
        "✅ Worker approved successfully."
    );

    openAdminWorkers();
}


function rejectWorker(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    if (!workerProfiles[index]) {
        alert("Worker profile nahi mila.");
        return;
    }

    const worker = JSON.parse(workerProfiles[index]);

    worker.verificationStatus = "rejected";

    workerProfiles[index] = JSON.stringify(worker);

    localStorage.setItem(
        "findviaWorkerProfiles",
        JSON.stringify(workerProfiles)
    );

    const currentProfile = JSON.parse(
        localStorage.getItem("findviaWorkerProfile") || "null"
    );

    if (
        currentProfile &&
        currentProfile.name === worker.name
    ) {
        currentProfile.verificationStatus = "rejected";

        localStorage.setItem(
            "findviaWorkerProfile",
            JSON.stringify(currentProfile)
        );
    }

    alert(
        "❌ Worker rejected."
    );

    openAdminWorkers();
}



function runFindViaSystemTest() {

    const results = [];

    function test(name, condition) {
        results.push({
            name: name,
            passed: Boolean(condition)
        });
    }

    function getSource(functionName) {

        try {

            if (
                typeof window[functionName] === "function"
            ) {
                return window[functionName].toString();
            }

            return "";

        } catch (error) {

            return "";
        }
    }


    // ==========================================
    // BASIC SYSTEM
    // ==========================================

    test(
        "Worker response function exists",
        typeof respondToJob === "function"
    );

    test(
        "Worker matching function exists",
        typeof selectWorkerForJob === "function"
    );

    test(
        "Customer pricing function exists",
        typeof openPricingForJob === "function"
    );

    test(
        "Worker offer function exists",
        typeof openWorkerOffer === "function"
    );

    test(
        "Customer price response function exists",
        typeof openCustomerPriceResponse === "function"
    );

    test(
        "Job confirmation function exists",
        typeof confirmJob === "function"
    );

    test(
        "Completion OTP function exists",
        typeof generateCompletionOTP === "function"
    );

    test(
        "OTP verification function exists",
        typeof verifyCompletionOTP === "function"
    );


    // ==========================================
    // WORKER VERIFICATION
    // ==========================================

    const responseSource =
        getSource("respondToJob");

    test(
        "Pending/rejected worker response is blocked",
        responseSource.includes(
            "verificationStatus !== \"approved\""
        )
    );


    // ==========================================
    // MATCHING SAFETY
    // ==========================================

    const matchSource =
        getSource("selectWorkerForJob");

    test(
        "Worker matching checks job existence",
        matchSource.includes("if (!job)")
    );

    test(
        "Matched job cannot be matched again",
        /job\.matchStatus\s*===\s*["']matched["']/.test(
            matchSource
        )
    );


    // ==========================================
    // PRICING SAFETY
    // ==========================================

    const customerPricingSource =
        getSource("openPricingForJob");

    test(
        "Customer pricing requires matched job",
        customerPricingSource.includes(
            'job.matchStatus !== "matched"'
        )
    );

    const workerOfferSource =
        getSource("openWorkerOffer");

    test(
        "Worker offer verifies matched worker",
        workerOfferSource.includes(
            "job.matchedWorker"
        )
    );


    // ==========================================
    // CONFIRMATION SAFETY
    // ==========================================

    const confirmSource =
        getSource("confirmJob");

    test(
        "Confirmation requires accepted price",
        confirmSource.includes(
            'job.priceStatus !== "accepted"'
        )
    );

    test(
        "Already confirmed job is protected",
        confirmSource.includes(
            'job.jobStatus === "confirmed"'
        )
    );


    // ==========================================
    // COMPLETION SAFETY
    // ==========================================

    const otpSource =
        getSource("generateCompletionOTP");

    test(
        "OTP generation requires confirmed job",
        otpSource.includes(
            'job.jobStatus !== "confirmed"'
        )
    );

    const verifySource =
        getSource("verifyCompletionOTP");

    test(
        "OTP verifies matched worker",
        verifySource.includes(
            "job.matchedWorker"
        )
    );

    test(
        "OTP verification requires confirmed job",
        verifySource.includes(
            'job.jobStatus !== "confirmed"'
        )
    );

    test(
        "OTP cannot be generated twice",
        otpSource.includes(
            "job.completionOTP"
        )
    );

    test(
    "Insufficient credits block completion",
    verifySource.includes("currentCredits") &&
    verifySource.includes("commissionAmount") &&
    verifySource.includes("return")
);

    test(
        "Commission transaction is created",
        verifySource.includes(
            "addWorkerCreditTransaction"
        )
    );

    test(
    "Completed status is saved",
    verifySource.includes("job.jobStatus") &&
    verifySource.includes("completed") &&
    verifySource.includes("localStorage.setItem") 
);

    // ==========================================
    // COMMISSION LOCK
    // ==========================================

    test(
        "Commission percentage is stored on job",
        verifySource.includes(
            "job.commissionPercent"
        )
    );

    test(
        "Commission amount is stored on job",
        verifySource.includes(
            "job.commissionAmount"
        )
    );

    test(
        "Commission lock timestamp is stored",
        verifySource.includes(
            "job.commissionLockedAt"
        )
    );


    // ==========================================
    // CREDIT SYSTEM
    // ==========================================

    test(
        "Credit reader exists",
        typeof getWorkerCreditsForProfile === "function"
    );

    test(
        "Credit setter exists",
        typeof setWorkerCreditsForProfile === "function"
    );

    test(
        "Transaction ledger exists",
        typeof addWorkerCreditTransaction === "function"
    );


    // ==========================================
    // CALCULATION TESTS
    // ==========================================

    const commissionPercent =
        getFindViaCommissionPercent();

    const commission1000 =
        calculateFindViaCommission(1000);

    const expected1000 =
        Math.round(
            1000 *
            commissionPercent /
            100
        );

    test(
        "Commission calculation: ₹1000",
        commission1000 === expected1000
    );


    const commission500 =
        calculateFindViaCommission(500);

    const expected500 =
        Math.round(
            500 *
            commissionPercent /
            100
        );

    test(
        "Commission calculation: ₹500",
        commission500 === expected500
    );


    // ==========================================
    // TRANSACTION DATA
    // ==========================================

    const transactions = JSON.parse(
        localStorage.getItem(
            "findviaCreditTransactions"
        ) || "[]"
    );

    test(
        "Transaction storage is readable",
        Array.isArray(transactions)
    );

    if (transactions.length > 0) {

        const latestTransaction =
            transactions[transactions.length - 1];

        test(
            "Latest transaction has balanceAfter",
            Object.prototype.hasOwnProperty.call(
                latestTransaction,
                "balanceAfter"
            )
        );
    }


    // ==========================================
    // RESULT
    // ==========================================

    const passed =
        results.filter(function(result) {
            return result.passed;
        }).length;

    const failed =
        results.filter(function(result) {
            return !result.passed;
        }).length;


    let message =
        "🧪 FindVia Business Rule Audit\n\n";

    results.forEach(function(result) {

        message +=
            (result.passed ? "✅ " : "❌ ") +
            result.name +
            "\n";

    });

    message +=
        "\n--------------------\n" +
        "PASSED: " + passed +
        "\n" +
        "FAILED: " + failed;


    alert(message);
}


function showFindViaModal(
    message,
    title = "FindVia",
    icon = "ℹ️"
) {
    const modal =
        document.getElementById("findviaModal");

    const modalTitle =
        document.getElementById("findviaModalTitle");

    const modalMessage =
        document.getElementById("findviaModalMessage");

    const modalIcon =
        document.getElementById("findviaModalIcon");

    if (!modal) {
        return;
    }

    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalIcon.textContent = icon;

    modal.style.display = "flex";
}


function closeFindViaModal() {

    const modal =
        document.getElementById("findviaModal");

    if (!modal) {
        return;
    }

    modal.style.display = "none";
}


window.alert = function(message) {

    showFindViaModal(
        message,
        "FindVia",
        "ℹ️"
    );

};


function showFindViaActionModal(
    title,
    message,
    actions
) {

    let modal =
        document.getElementById(
            "findviaActionModal"
        );

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id =
            "findviaActionModal";

        modal.className =
            "findvia-modal";

        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="findvia-modal-box">

            <div class="findvia-modal-icon">
                💰
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <div class="findvia-action-buttons">

                ${actions.map(function(item) {

                    return `
                        <button
                            type="button"
                            class="primary-btn"
                            data-action-index="${actions.indexOf(item)}"
                        >
                            ${item.icon} ${item.text}
                        </button>
                    `;

                }).join("")}

                <button
                    type="button"
                    class="back-btn"
                    onclick="closeFindViaActionModal()"
                >
                    Cancel
                </button>

            </div>

        </div>
    `;

    actions.forEach(function(item, index) {

        const button =
            modal.querySelector(
                `[data-action-index="${index}"]`
            );

        if (button) {

            button.addEventListener(
                "click",
                item.action
            );
        }
    });

    modal.style.display = "flex";
}


function closeFindViaActionModal() {

    const modal =
        document.getElementById(
            "findviaActionModal"
        );

    if (modal) {
        modal.style.display = "none";
    }
}

function showFindViaInputModal(
    title,
    message,
    onSubmit,
    inputType = "text",
    placeholder = "Enter here",
    emptyMessage = "Please value enter karein.",
    icon = "ℹ️"
) {

    let modal =
        document.getElementById(
            "findviaInputModal"
        );

    if (!modal) {

        modal =
            document.createElement("div");

        modal.id =
            "findviaInputModal";

        modal.className =
            "findvia-modal";

        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div class="findvia-modal-box">

            <div class="findvia-modal-icon">
                ${icon}
            </div>

            <h3>
                ${escapeHTML(title)}
            </h3>

            <p>
                ${escapeHTML(message)}
            </p>

            <input
                type="${inputType}"
                id="findviaModalInput"
                class="findvia-modal-input"
                placeholder="${escapeHTML(placeholder)}"
                min="1"
                inputmode="text"
            >

            <div class="findvia-action-buttons">

                <button
                    type="button"
                    class="primary-btn"
                    id="findviaInputSubmit"
                >
                    Continue
                </button>

                <button
                    type="button"
                    class="back-btn"
                    onclick="closeFindViaInputModal()"
                >
                    Cancel
                </button>

            </div>

        </div>
    `;

    const input =
        document.getElementById(
            "findviaModalInput"
        );

    const submit =
        document.getElementById(
            "findviaInputSubmit"
        );

    submit.addEventListener(
        "click",
        function() {

            const value =
                input.value.trim();

            if (!value) {

                alert(emptyMessage);

                return;
            }

            closeFindViaInputModal();

            onSubmit(value);

        }
    );

    modal.style.display = "flex";

    setTimeout(function() {
        input.focus();
    }, 100);
}

function closeFindViaInputModal() {

    const modal =
        document.getElementById(
            "findviaInputModal"
        );

    if (modal) {
        modal.style.display = "none";
    }
}

