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

    document.getElementById("homeContent").style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function selectWorkCategory(category) {

    document.getElementById("workResults").innerHTML =
        "<strong>" + category + "</strong><br>" +
        "Work opportunities will appear here soon.";
}


function selectWorkerCategory(category) {

    document.getElementById("workerResults").innerHTML =
        "<strong>" + category + "</strong><br>" +
        "Available workers will appear here soon.";
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
