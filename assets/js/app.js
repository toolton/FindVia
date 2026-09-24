
const SUPABASE_URL =
    "https://jvqwhbedyytgglorbava.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_wvJcS-DVrEIapJckmvVUtA__NBqACHY";

const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );

async function getFindViaCurrentUser() {
    const {
        data: { user },
        error
    } = await supabaseClient.auth.getUser();

    if (error) {
        console.error(
            "FindVia Auth error:",
            error
        );
        return null;
    }

    return user || null;
}

let findViaCurrentUser = null;
let findViaAuthMode = "login";

function updateFindViaAuthVisibility() {
    const authButton = document.querySelector(
        '[onclick="openAuthScreen()"]'
    );

    if (!authButton) {
        return;
    }

    if (findViaCurrentUser) {
        authButton.textContent = "👤 Account";
    } else {
        authButton.textContent = "🔐 Login / Sign Up";
    }
}

function updateFindViaAuthUI() {
    const title =
        document.getElementById("authTitle");

    const subtitle =
        document.getElementById("authSubtitle");

    const mainButton =
        document.getElementById("authMainButton");

    const toggleButton =
        document.getElementById("authToggleButton");

    const authFormBox =
        document.getElementById("authFormBox");

    const loggedInAuthBox =
        document.getElementById("loggedInAuthBox");

    const loggedInEmail =
        document.getElementById("loggedInEmail");

    if (
        !title ||
        !subtitle ||
        !mainButton ||
        !toggleButton ||
        !authFormBox ||
        !loggedInAuthBox
    ) {
        return;
    }

    if (findViaCurrentUser) {
        title.textContent = "FindVia Account";

        subtitle.textContent =
            "Your FindVia account is currently logged in.";

        authFormBox.style.display = "none";
        loggedInAuthBox.style.display = "block";

        if (loggedInEmail) {
            loggedInEmail.textContent =
                findViaCurrentUser.email || "";
        }

        return;
    }

    authFormBox.style.display = "block";
    loggedInAuthBox.style.display = "none";

    if (findViaAuthMode === "login") {
        title.textContent = "Login to FindVia";

        subtitle.textContent =
            "Login to continue using your FindVia account.";

        mainButton.textContent = "Login";

        toggleButton.textContent =
            "Create a new account";
    } else {
        title.textContent =
            "Create FindVia Account";

        subtitle.textContent =
            "Create your account using email and password.";

        mainButton.textContent =
            "Sign Up";

        toggleButton.textContent =
            "Already have an account? Login";
    }
}

async function refreshFindViaAuthState() {
    findViaCurrentUser =
        await getFindViaCurrentUser();

    updateFindViaAuthUI();
    updateFindViaAuthVisibility();

    return findViaCurrentUser;
}

function openAuthScreen() {
    document.getElementById("homeContent").style.display =
        "none";

    document.getElementById("findWorkScreen")
        ?.classList.remove("active");

    document.getElementById("findWorkersScreen")
        ?.classList.remove("active");

    document.getElementById("searchScreen")
        ?.classList.remove("active");

    document.getElementById("profileScreen")
        ?.classList.remove("active");

    document.getElementById("workerProfileScreen")
        ?.classList.remove("active");

    document.getElementById("postJobScreen")
        ?.classList.remove("active");

    document.getElementById("myJobsScreen").style.display =
        "none";

    document.getElementById("authScreen").style.display =
        "block";

    refreshFindViaAuthState();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function closeAuthScreen() {
    document.getElementById("authScreen").style.display =
        "none";

    showProfile();
}

function toggleFindViaAuthMode() {
    if (findViaCurrentUser) {
        return;
    }

    if (findViaAuthMode === "login") {
        findViaAuthMode = "signup";
    } else {
        findViaAuthMode = "login";
    }

    updateFindViaAuthUI();
}

async function handleFindViaAuth() {
    if (findViaCurrentUser) {
        return;
    }

    const emailInput =
        document.getElementById("authEmail");

    const passwordInput =
        document.getElementById("authPassword");

    const status =
        document.getElementById("authStatus");

    if (
        !emailInput ||
        !passwordInput ||
        !status
    ) {
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {
        status.textContent =
            "Please enter email and password.";

        return;
    }

    status.textContent =
        "Please wait...";

    if (findViaAuthMode === "signup") {
        const {
            data,
            error
        } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: {
                emailRedirectTo:
                    "https://toolton.github.io/FindVia/"
            }
        });

        if (error) {
            console.error(
                "FindVia signup error:",
                error
            );

            status.textContent =
                error.message;

            return;
        }

        if (data.user && !data.session) {
            passwordInput.value = "";

            showFindViaModal(
                "Account created successfully. Please check your email and confirm your account before logging in.",
                "Account Created",
                "📧"
            );

            status.textContent =
                "Please confirm your email before login.";

            return;
        }

        findViaCurrentUser =
            data.user || null;

        passwordInput.value = "";

        showFindViaModal(
            "Your FindVia account has been created successfully.",
            "Account Created",
            "✅"
        );

        findViaAuthMode = "login";

        updateFindViaAuthUI();
        updateFindViaAuthVisibility();

        return;
    }

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error) {
        console.error(
            "FindVia login error:",
            error
        );

        status.textContent =
            error.message;

        return;
    }

    if (!data.user) {
        status.textContent =
            "Login failed. Please try again.";

        return;
    }

    findViaCurrentUser =
        data.user;

    passwordInput.value = "";
    status.textContent = "";

    updateFindViaAuthUI();
    updateFindViaAuthVisibility();

    showFindViaModal(
        "Login successful. Welcome back to FindVia!",
        "Login Successful",
        "✅"
    );
}

async function signOutFindVia() {
    const {
        error
    } = await supabaseClient.auth.signOut();

    if (error) {
        console.error(
            "FindVia logout error:",
            error
        );

        showFindViaModal(
            error.message,
            "Logout Failed",
            "⚠️"
        );

        return false;
    }

    findViaCurrentUser = null;
    findViaAuthMode = "login";

    updateFindViaAuthUI();
    updateFindViaAuthVisibility();

    showFindViaModal(
        "You have been logged out of FindVia.",
        "Logged Out",
        "✅"
    );

    return true;
}

function initializeFindViaAuth() {
    supabaseClient.auth.onAuthStateChange(
        function(event, session) {
            findViaCurrentUser =
                session?.user || null;

            updateFindViaAuthUI();
            updateFindViaAuthVisibility();
        }
    );

    setTimeout(function() {
        refreshFindViaAuthState();
    }, 0);
}
        

let hindiMode =
    localStorage.getItem("findviaLanguage") === "hi";


const findViaTranslations = {

    en: {

        welcomeTitle:
            "Find Work. Find Workers.",

        welcomeText:
            "Find trusted local work and workers near you.",

        findWorkTitle:
            "Find Work",

        findWorkText:
            "Discover local jobs and work opportunities.",

        findWorkersTitle:
            "Find Workers",

        findWorkersText:
            "Find people for your work or service.",

        postTitle:
            "Need someone for a job?",

        postText:
            "Post your work requirement and find the right person.",

        postButton:
            "+ Post a Job",

        homeNav:
            "Home",

        searchNav:
            "Search",

        postNav:
            "Post",

        profileNav:
            "Profile"
    },


    hi: {

        welcomeTitle:
            "काम खोजें। काम देने वाले खोजें।",

        welcomeText:
            "अपने आसपास काम और भरोसेमंद कामगार खोजें।",

        findWorkTitle:
            "काम खोजें",

        findWorkText:
            "अपने आसपास उपलब्ध काम और रोजगार के अवसर खोजें।",

        findWorkersTitle:
            "कामगार खोजें",

        findWorkersText:
            "अपने काम या सेवा के लिए सही कामगार खोजें।",

        postTitle:
            "काम के लिए किसी की जरूरत है?",

        postText:
            "अपनी काम की जरूरत पोस्ट करें और सही व्यक्ति खोजें।",

        postButton:
            "+ काम पोस्ट करें",

        homeNav:
            "होम",

        searchNav:
            "खोजें",

        postNav:
            "पोस्ट",

        profileNav:
            "प्रोफाइल"
    }

};


/*
 * Central translation helper
 *
 * Example:
 * t("welcomeTitle")
 */
function t(key) {

    const language =
        hindiMode ? "hi" : "en";

    return (
        findViaTranslations[language][key] ||
        findViaTranslations.en[key] ||
        key
    );
}

function translateFindViaMessage(message) {

    if (!message) {
        return message;
    }

    const text =
        String(message);

    const messages = {

        "Job nahi mili.":
        {
            en: "Job not found.",
            hi: "काम नहीं मिला।"
        },

        "Pehle worker ko match karein.":
        {
            en: "Please match a worker first.",
            hi: "कृपया पहले किसी कामगार को चुनें।"
        },

        "Apna location enter karein:":
        {
            en: "Enter your location:",
            hi: "अपना स्थान दर्ज करें:"
        },

        "Please location enter karein.":
        {
            en: "Please enter a location.",
            hi: "कृपया अपना स्थान दर्ज करें।"
        },

        "Job post karne ke liye pehle Customer role select karein.":
        {
            en: "Please select the Customer role before posting a job.",
            hi: "काम पोस्ट करने से पहले Customer भूमिका चुनें।"
        },

        "Please complete all required job details.":
        {
            en: "Please complete all required job details.",
            hi: "कृपया काम की सभी आवश्यक जानकारी भरें।"
        },

        "Please enter a valid maximum budget.":
        {
            en: "Please enter a valid maximum budget.",
            hi: "कृपया अधिकतम बजट की सही राशि दर्ज करें।"
        },

        "Photo size 2MB se kam honi chahiye.":
        {
            en: "Photo size must be less than 2 MB.",
            hi: "फोटो का आकार 2 MB से कम होना चाहिए।"
        },

        "Worker profile nahi mila.":
        {
            en: "Worker profile not found.",
            hi: "कामगार प्रोफाइल नहीं मिली।"
        },

        "Pehle worker profile setup karein.":
        {
            en: "Please set up your worker profile first.",
            hi: "कृपया पहले अपना कामगार प्रोफाइल सेट करें।"
        },

        "Ye job ab available nahi hai.":
        {
            en: "This job is no longer available.",
            hi: "यह काम अब उपलब्ध नहीं है।"
        },

        "Aap already is job mein interest dikha chuke hain.":
        {
            en: "You have already shown interest in this job.",
            hi: "आप इस काम में पहले ही रुचि दिखा चुके हैं।"
        },

        "Interest sent successfully.":
        {
            en: "Interest sent successfully.",
            hi: "रुचि सफलतापूर्वक भेज दी गई है।"
        },

        "Customer ko aapki response milegi.":
        {
            en: "The customer will receive your response.",
            hi: "ग्राहक को आपकी प्रतिक्रिया मिल जाएगी।"
        },

        "Contact details abhi hidden rahengi.":
        {
            en: "Contact details will remain hidden for now.",
            hi: "संपर्क विवरण अभी छिपे रहेंगे।"
        },

        "FindVia credits insufficient hain.":
        {
            en: "You do not have enough FindVia credits.",
            hi: "आपके पास पर्याप्त FindVia credits नहीं हैं।"
        },

        "Is job par interest show karne se pehle credits recharge karein.":
        {
            en: "Please recharge your credits before showing interest in this job.",
            hi: "इस काम में रुचि दिखाने से पहले अपने credits recharge करें।"
        },

        "Is job par interest show karne ke liye Worker role select karein.":
        {
            en: "Please select the Worker role to show interest in this job.",
            hi: "इस काम में रुचि दिखाने के लिए Worker भूमिका चुनें।"
        },

        "Ye job already kisi worker ke saath matched hai.":
        {
            en: "This job is already matched with a worker.",
            hi: "यह काम पहले ही किसी कामगार के साथ match हो चुका है।"
        },

        "Worker response nahi mili.":
        {
            en: "Worker response not found.",
            hi: "कामगार की प्रतिक्रिया नहीं मिली।"
        },

        "Pehle price agreement complete karein.":
        {
            en: "Please complete the price agreement first.",
            hi: "कृपया पहले कीमत पर सहमति पूरी करें।"
        },

        "Ye job already confirmed hai.":
        {
            en: "This job is already confirmed.",
            hi: "यह काम पहले ही confirm हो चुका है।"
        },

        "Offer reject kar diya gaya.":
        {
            en: "The offer has been rejected.",
            hi: "Offer अस्वीकार कर दिया गया है।"
        }

    };

    if (messages[text]) {

        return hindiMode
            ? messages[text].hi
            : messages[text].en;
    }


    /*
     * Handle longer dynamic messages
     * containing the phrases above.
     */

    let translated =
        text;

    Object.keys(messages).forEach(
        function(sourceText) {

            const translation =
                messages[sourceText];

            const replacement =
                hindiMode
                ? translation.hi
                : translation.en;

            translated =
                translated.split(sourceText)
                .join(replacement);

        }
    );

    return translated;
}


function applyFindViaStaticLanguage() {

    const translations = {

        en: {
            "Your Location": "Your Location",
            "Select your location": "Select your location",
            "Change": "Change",

            "Find Work": "Find Work",
            "Find local work opportunities near you.":
                "Find local work opportunities near you.",
            "Search work...": "Search work...",
            "Search": "Search",
            "Other Work": "Other Work",
            "No work selected yet.":
                "No work selected yet.",

            "Find Workers": "Find Workers",
            "Find skilled workers near your location.":
                "Find skilled workers near your location.",
            "Search workers...": "Search workers...",
            "Other Worker": "Other Worker",
            "No worker category selected yet.":
                "No worker category selected yet.",

            "Search FindVia": "Search FindVia",
            "Find local work opportunities and skilled workers near you.":
                "Find local work opportunities and skilled workers near you.",
            "Search work or workers...":
                "Search work or workers...",
            "Find available work opportunities":
                "Find available work opportunities",
            "Find skilled workers near you":
                "Find skilled workers near you",
            "Search results will appear here.":
                "Search results will appear here.",

            "My Profile": "My Profile",
            "Choose how you want to use FindVia.":
                "Choose how you want to use FindVia.",
            "Your FindVia Role": "Your FindVia Role",
            "I'm looking for work": "I'm looking for work",
            "I need a worker": "I need a worker",
            "Worker Profile Setup": "Worker Profile Setup",
            "My Posted Jobs": "My Posted Jobs",
            "My Transactions": "My Transactions",
            "Admin Access": "Admin Access",
            "Worker Profile": "Worker Profile",
            "Your professional details":
                "Your professional details",
            "Edit": "Edit",
            "Name": "Name",
            "Service": "Service",
            "Experience": "Experience",
            "Area": "Area",
            "Availability": "Availability",
            "Verification": "Verification",

            "Post a Job": "Post a Job",
            "Apni work requirement share karein.":
                "Share your work requirement.",
            "काम का नाम": "Job title",
            "काम की category": "Job category",
            "Category चुनें": "Select category",
            "काम की जानकारी": "Job details",
            "काम कहाँ करना है?": "Where is the work?",
            "काम कब चाहिए?": "When do you need the work?",
            "Timing चुनें": "Select timing",
            "आपका maximum budget": "Your maximum budget",
            "काम की photo (optional)": "Job photo (optional)",
            "Post Job": "Post Job",

            "My Jobs": "My Jobs",
            "Aapki posted work requirements.":
                "Your posted work requirements.",
            "Loading your jobs...": "Loading your jobs...",

            "Interested Workers": "Interested Workers",
            "Is job mein interested workers.":
                "Workers interested in this job.",
            "Loading responses...": "Loading responses...",

            "Apne kaam ke baare mein basic information dein.":
                "Provide basic information about your work.",
            "आप कौन सा काम करते हैं?":
                "What type of work do you do?",
            "Service चुनें": "Select service",
            "Experience चुनें": "Select experience",
            "आप किस area में काम करते हैं?":
                "Which area do you work in?",
            "Availability चुनें": "Select availability",
            "Save Worker Profile": "Save Worker Profile",

            "Admin Login": "Admin Login",
            "Authorized access only": "Authorized access only",
            "ADMIN ACCESS": "ADMIN ACCESS",
            "FindVia Administration": "FindVia Administration",
            "Admin credentials enter karke dashboard access karein.":
                "Enter admin credentials to access the dashboard.",
            "Admin password": "Admin password",
            "Login to Admin Panel": "Login to Admin Panel",

            "Admin Panel": "Admin Panel",
            "FindVia system management":
                "FindVia system management",
            "MANAGEMENT": "MANAGEMENT",
            "Worker Management": "Worker Management",
            "Workers, credits aur verification ko manage karein.":
                "Manage workers, credits and verification.",
            "Manage Workers": "Manage Workers",
            "FINANCE": "FINANCE",
            "Credits & Commission": "Credits & Commission",
            "Worker credits aur FindVia commission settings yahan manage hongi.":
                "Manage worker credits and FindVia commission settings here.",
            "FindVia Commission (%)": "FindVia Commission (%)",
            "Current commission:": "Current commission:",
            "Save Commission": "Save Commission",
            "SYSTEM": "SYSTEM",
            "Platform Overview": "Platform Overview",
            "Active": "Active",
            "FindVia ke important system controls.":
                "Important FindVia system controls.",
            "Run System Test": "Run System Test",

            "My Transactions": "My Transactions",
            "आपके FindVia credit transactions":
                "Your FindVia credit transactions",
            "FindVia workers management":
                "FindVia worker management",
            "Transaction History": "Transaction History",
            "Worker transactions": "Worker transactions",
            "Worker Verification": "Worker Verification",
          "Recharge Credits": "Recharge Credits",
"Add credits to your FindVia wallet.":
    "Add credits to your FindVia wallet.",
"Recharge your credits":
    "Recharge your credits",
"Scan the QR code below and make your payment.":
    "Scan the QR code below and make your payment.",
"FINDVIA CREDITS": "FINDVIA CREDITS",
"Payment QR": "Payment QR",
"QR code will be added before deployment.":
    "QR code will be added before deployment.",
"Payment Instructions": "Payment Instructions",
"Scan the FindVia payment QR.":
    "Scan the FindVia payment QR.",
"Pay the amount you want to add.":
    "Pay the amount you want to add.",
"Enter the exact amount paid below.":
    "Enter the exact amount paid below.",
"Enter your payment transaction ID / UTR.":
    "Enter your payment transaction ID / UTR.",
"Submit the recharge request.":
    "Submit the recharge request.",
"Amount Paid": "Amount Paid",
"₹ Enter amount": "₹ Enter amount",
"Payment Transaction ID / UTR":
    "Payment Transaction ID / UTR",
"Enter UTR / transaction ID":
    "Enter UTR / transaction ID",
"Submit Recharge Request":
    "Submit Recharge Request",
"Credits will be added after payment verification.":
    "Credits will be added after payment verification.",  
"Complete your verification to work on FindVia.":
    "Complete your verification to work on FindVia.",
"Please submit the following documents for verification.":
    "Please submit the following documents for verification.",
"Your documents will only be used for FindVia verification.":
    "Your documents will only be used for FindVia verification.",
"Government ID (Aadhaar Card, Voter ID, Driving Licence, etc.)":
    "Government ID (Aadhaar Card, Voter ID, Driving Licence, etc.)",
"Recent Photo / Selfie":
    "Recent Photo / Selfie",
"Skill / Experience Proof (Optional)":
    "Skill / Experience Proof (Optional)",
"Submit for Verification":
    "Submit for Verification",
            "Please set up your worker profile first.":
    "Please set up your worker profile first.",

"Recharge form could not be found.":
    "Recharge form could not be found.",

"Please enter a valid payment amount.":
    "Please enter a valid payment amount.",

"Please enter the payment transaction ID / UTR.":
    "Please enter the payment transaction ID / UTR.",

"This payment is already pending verification.":
    "This payment is already pending verification.",

"Recharge request submitted successfully.":
    "Recharge request submitted successfully.",

"Your payment will be verified by FindVia admin.":
    "Your payment will be verified by FindVia admin.",
            "OK": "OK"
        },

        hi: {
            "Your Location": "आपका स्थान",
            "Select your location": "अपना स्थान चुनें",
            "Change": "बदलें",

            "Find Work": "काम खोजें",
            "Find local work opportunities near you.":
                "अपने आसपास उपलब्ध काम खोजें।",
            "Search work...": "काम खोजें...",
            "Search": "खोजें",
            "Other Work": "अन्य काम",
            "No work selected yet.":
                "अभी कोई काम नहीं चुना गया है।",

            "Find Workers": "कामगार खोजें",
            "Find skilled workers near your location.":
                "अपने आसपास कुशल कामगार खोजें।",
            "Search workers...": "कामगार खोजें...",
            "Other Worker": "अन्य कामगार",
            "No worker category selected yet.":
                "अभी कोई कामगार श्रेणी नहीं चुनी गई है।",

            "Search FindVia": "FindVia पर खोजें",
            "Find local work opportunities and skilled workers near you.":
                "अपने आसपास काम और कुशल कामगार खोजें।",
            "Search work or workers...":
                "काम या कामगार खोजें...",
            "Find available work opportunities":
                "उपलब्ध काम खोजें",
            "Find skilled workers near you":
                "अपने आसपास कुशल कामगार खोजें",
            "Search results will appear here.":
                "खोज के परिणाम यहाँ दिखाई देंगे।",

            "My Profile": "मेरी प्रोफाइल",
            "Choose how you want to use FindVia.":
                "चुनें कि आप FindVia का उपयोग कैसे करना चाहते हैं।",
            "Your FindVia Role": "आपकी FindVia भूमिका",
            "I'm looking for work": "मुझे काम चाहिए",
            "I need a worker": "मुझे कामगार चाहिए",
            "Worker Profile Setup": "कामगार प्रोफाइल सेट करें",
            "My Posted Jobs": "मेरे पोस्ट किए गए काम",
            "My Transactions": "मेरे लेन-देन",
            "Admin Access": "Admin Access",
            "Worker Profile": "कामगार प्रोफाइल",
            "Your professional details":
                "आपकी काम से जुड़ी जानकारी",
            "Edit": "बदलें",
            "Name": "नाम",
            "Service": "सेवा",
            "Experience": "अनुभव",
            "Area": "क्षेत्र",
            "Availability": "उपलब्धता",
            "Verification": "सत्यापन",

            "Post a Job": "काम पोस्ट करें",
            "Apni work requirement share karein.":
                "अपनी काम की जरूरत साझा करें।",
            "काम का नाम": "काम का नाम",
            "काम की category": "काम की श्रेणी",
            "Category चुनें": "श्रेणी चुनें",
            "काम की जानकारी": "काम की जानकारी",
            "काम कहाँ करना है?": "काम कहाँ करना है?",
            "काम कब चाहिए?": "काम कब चाहिए?",
            "Timing चुनें": "समय चुनें",
            "आपका maximum budget": "आपका अधिकतम बजट",
            "काम की photo (optional)":
                "काम की फोटो (वैकल्पिक)",
            "Post Job": "काम पोस्ट करें",

            "My Jobs": "मेरे काम",
            "Aapki posted work requirements.":
                "आपके द्वारा पोस्ट की गई काम की जरूरतें।",
            "Loading your jobs...":
                "आपके काम लोड हो रहे हैं...",

            "Interested Workers": "इच्छुक कामगार",
            "Is job mein interested workers.":
                "इस काम में रुचि रखने वाले कामगार।",
            "Loading responses...":
                "प्रतिक्रियाएँ लोड हो रही हैं...",

            "Apne kaam ke baare mein basic information dein.":
                "अपने काम के बारे में मूल जानकारी दें।",
            "आप कौन सा काम करते हैं?":
                "आप कौन सा काम करते हैं?",
            "Service चुनें": "सेवा चुनें",
            "Experience चुनें": "अनुभव चुनें",
            "आप किस area में काम करते हैं?":
                "आप किस क्षेत्र में काम करते हैं?",
            "Availability चुनें": "उपलब्धता चुनें",
            "Save Worker Profile": "कामगार प्रोफाइल सेव करें",

            "Admin Login": "Admin Login",
            "Authorized access only":
                "केवल अधिकृत लोगों के लिए",
            "ADMIN ACCESS": "ADMIN ACCESS",
            "FindVia Administration": "FindVia Administration",
            "Admin credentials enter karke dashboard access karein.":
                "Dashboard खोलने के लिए Admin credentials दर्ज करें।",
            "Admin password": "Admin password",
            "Login to Admin Panel":
                "Admin Panel में लॉगिन करें",

            "Admin Panel": "Admin Panel",
            "FindVia system management":
                "FindVia system management",
            "MANAGEMENT": "प्रबंधन",
            "Worker Management": "कामगार प्रबंधन",
            "Workers, credits aur verification ko manage karein.":
                "कामगार, credits और सत्यापन प्रबंधित करें।",
            "Manage Workers": "कामगार प्रबंधित करें",
            "FINANCE": "वित्त",
            "Credits & Commission": "Credits और Commission",
            "Worker credits aur FindVia commission settings yahan manage hongi.":
                "कामगार credits और FindVia commission settings यहाँ प्रबंधित होंगी।",
            "FindVia Commission (%)":
                "FindVia Commission (%)",
            "Current commission:": "वर्तमान commission:",
            "Save Commission": "Commission सेव करें",
            "SYSTEM": "सिस्टम",
            "Platform Overview": "Platform Overview",
            "Active": "सक्रिय",
            "FindVia ke important system controls.":
                "FindVia के महत्वपूर्ण system controls।",
            "Run System Test": "System Test चलाएँ",

            "My Transactions": "मेरे लेन-देन",
            "आपके FindVia credit transactions":
                "आपके FindVia credit लेन-देन",
            "FindVia workers management":
                "FindVia कामगार प्रबंधन",
            "Transaction History": "लेन-देन इतिहास",
            "Worker transactions":
                "कामगार के लेन-देन",
            "Recharge Credits": "क्रेडिट रिचार्ज करें",
"Add credits to your FindVia wallet.":
    "अपने FindVia वॉलेट में क्रेडिट जोड़ें।",
"Recharge your credits":
    "अपने क्रेडिट रिचार्ज करें",
"Scan the QR code below and make your payment.":
    "नीचे दिए गए QR कोड को स्कैन करके भुगतान करें।",
"FINDVIA CREDITS": "FINDVIA क्रेडिट",
"Payment QR": "भुगतान QR",
"QR code will be added before deployment.":
    "तैनाती से पहले वास्तविक QR कोड जोड़ा जाएगा।",
"Payment Instructions": "भुगतान के निर्देश",
"Scan the FindVia payment QR.":
    "FindVia का भुगतान QR स्कैन करें।",
"Pay the amount you want to add.":
    "जितनी राशि जोड़नी है, उसका भुगतान करें।",
"Enter the exact amount paid below.":
    "नीचे भुगतान की गई सही राशि दर्ज करें।",
"Enter your payment transaction ID / UTR.":
    "अपना भुगतान Transaction ID / UTR दर्ज करें।",
"Submit the recharge request.":
    "रिचार्ज अनुरोध जमा करें।",
"Amount Paid": "भुगतान की गई राशि",
"₹ Enter amount": "₹ राशि दर्ज करें",
"Payment Transaction ID / UTR":
    "भुगतान Transaction ID / UTR",
"Enter UTR / transaction ID":
    "UTR / Transaction ID दर्ज करें",
"Submit Recharge Request":
    "रिचार्ज अनुरोध जमा करें",
"Credits will be added after payment verification.":
    "भुगतान सत्यापन के बाद क्रेडिट जोड़े जाएंगे।",


"Worker Verification":
    "कामगार सत्यापन",
"Complete your verification to work on FindVia.":
    "FindVia पर काम करने के लिए अपना सत्यापन पूरा करें।",
"Please submit the following documents for verification.":
    "सत्यापन के लिए नीचे दिए गए दस्तावेज़ जमा करें।",
"Your documents will only be used for FindVia verification.":
    "आपके दस्तावेज़ केवल FindVia सत्यापन के लिए उपयोग किए जाएंगे।",
"Government ID (Aadhaar Card, Voter ID, Driving Licence, etc.)":
    "सरकारी पहचान पत्र (आधार कार्ड, वोटर आईडी, ड्राइविंग लाइसेंस आदि)",
"Recent Photo / Selfie":
    "हाल की फोटो / सेल्फी",
"Skill / Experience Proof (Optional)":
    "कौशल / अनुभव प्रमाण (वैकल्पिक)",
"Submit for Verification":
    "सत्यापन के लिए जमा करें",
            "Please set up your worker profile first.":
    "कृपया पहले अपना कामगार प्रोफाइल सेट करें।",

"Recharge form could not be found.":
    "रिचार्ज फॉर्म नहीं मिल सका।",

"Please enter a valid payment amount.":
    "कृपया भुगतान की सही राशि दर्ज करें।",

"Please enter the payment transaction ID / UTR.":
    "कृपया भुगतान Transaction ID / UTR दर्ज करें।",

"This payment is already pending verification.":
    "यह भुगतान पहले से सत्यापन के लिए लंबित है।",

"Recharge request submitted successfully.":
    "रिचार्ज अनुरोध सफलतापूर्वक जमा हो गया है।",

"Your payment will be verified by FindVia admin.":
    "आपके भुगतान का सत्यापन FindVia एडमिन द्वारा किया जाएगा।",
                    
            "OK": "ठीक है"
        }
    };

    const language =
        hindiMode ? "hi" : "en";

    const dictionary =
        translations[language];

    const walker =
        document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT
        );

    const textNodes = [];

    while (walker.nextNode()) {
        textNodes.push(walker.currentNode);
    }

    textNodes.forEach(function(node) {

        const original =
            node.textContent.trim();

        if (!original) {
            return;
        }

        if (
            dictionary[original] !== undefined
        ) {
            node.textContent =
                node.textContent.replace(
                    original,
                    dictionary[original]
                );
        }

    });

    document
        .querySelectorAll(
            "input[placeholder], textarea[placeholder]"
        )
        .forEach(function(input) {

            const original =
                input.getAttribute(
                    "placeholder"
                );

            if (
                original &&
                dictionary[original]
            ) {
                input.setAttribute(
                    "placeholder",
                    dictionary[original]
                );
            }

        });

}



/*
 * Set text safely by element ID.
 */
function setFindViaText(
    elementId,
    translationKey
) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return;
    }

    element.textContent =
        t(translationKey);
}


/*
 * Apply all currently registered
 * static translations.
 */
function applyFindViaLanguage() {

    Object.keys(
        findViaTranslations.en
    ).forEach(function(key) {

        const element =
            document.getElementById(key);

        if (!element) {
            return;
        }

        element.textContent =
            t(key);

    });

}


/*
 * Main language switch.
 */
function toggleLanguage() {

    hindiMode =
        !hindiMode;

    localStorage.setItem(
        "findviaLanguage",
        hindiMode ? "hi" : "en"
    );

    applyFindViaLanguage();
    applyFindViaStaticLanguage();
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

    document.getElementById("authScreen").style.display = "none";

hideAdminScreens();
hideWorkerTransactionScreen();
    hideWorkerRechargeScreen();
 hideWorkerVerificationScreen();   
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

alert(
    "FindVia mein workers ko direct browse nahi kiya jaata.\n\n" +
    "Pehle apni job post karein. Interested workers response bhejenge, " +
    "uske baad aap worker ko privately select kar sakte hain."
);

return;

}

function postJob() {
hideWorkerTransactionScreen();
hideWorkerRechargeScreen();

    
hideWorkerVerificationScreen();
    
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
loadJobCategories();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
async function loadJobCategories() {

    const categorySelect =
        document.getElementById("jobCategory");

    if (!categorySelect) {
        return;
    }

    categorySelect.innerHTML = `
        <option value="">
            Category load ho rahi hai...
        </option>
    `;

    const {
        data: categories,
        error
    } = await supabaseClient
        .from("job_categories")
        .select(
            "id, name, name_hi, icon"
        )
        .eq("active", true)
        .order("name", {
            ascending: true
        });

    if (error) {

        console.error(
            "Job categories load error:",
            error
        );

        categorySelect.innerHTML = `
            <option value="">
                Category load nahi ho saki
            </option>
        `;

        return;
    }

    if (
        !categories ||
        categories.length === 0
    ) {

        categorySelect.innerHTML = `
            <option value="">
                Abhi koi category available nahi hai
            </option>
        `;

        return;
    }

    categorySelect.innerHTML = `
        <option value="">
            Category चुनें
        </option>
    `;

    categories.forEach(function(category) {

        const option =
            document.createElement("option");

        option.value =
            category.name;

        option.textContent =
            (
                category.icon
                ? category.icon + " "
                : ""
            ) +
            category.name_hi +
            " / " +
            category.name;

        categorySelect.appendChild(option);
    });
}
async function loadWorkerServices() {

    const serviceSelect =
        document.getElementById("workerService");

    if (!serviceSelect) {
        return;
    }

    serviceSelect.innerHTML = `
        <option value="">
            Service load ho rahi hai...
        </option>
    `;

    const {
        data: categories,
        error
    } = await supabaseClient
        .from("job_categories")
        .select(
            "id, name, name_hi, icon"
        )
        .eq("active", true)
        .order("name", {
            ascending: true
        });

    if (error) {

        console.error(
            "Worker services load error:",
            error
        );

        serviceSelect.innerHTML = `
            <option value="">
                Service load nahi ho saki
            </option>
        `;

        return;
    }

    if (
        !categories ||
        categories.length === 0
    ) {

        serviceSelect.innerHTML = `
            <option value="">
                Abhi koi service available nahi hai
            </option>
        `;

        return;
    }

    serviceSelect.innerHTML = `
        <option value="">
            Service चुनें
        </option>
    `;

    categories.forEach(function(category) {

        const option =
            document.createElement("option");

        option.value = category.name;

        option.textContent =
            `${category.icon || "🛠️"} ${category.name}`;

        serviceSelect.appendChild(option);

    });

    const savedProfile =
        JSON.parse(
            localStorage.getItem(
                "findviaWorkerProfile"
            ) || "null"
        );

    if (
        savedProfile &&
        savedProfile.service
    ) {
        serviceSelect.value =
            savedProfile.service;
    }
}

async function saveJob() {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Please login to continue.");
        return;
    }

    const title =
        document.getElementById("jobTitle").value.trim();

    const category =
        document.getElementById("jobCategory").value;

    const description =
        document.getElementById("jobDescription").value.trim();

    const area =
        document.getElementById("jobArea").value.trim();

    const timing =
        document.getElementById("jobTiming").value;

    const budget =
        document.getElementById("jobBudget").value.trim();

    const photoInput =
        document.getElementById("jobPhoto");


    if (
        !title ||
        !category ||
        !description ||
        !area ||
        !timing ||
        !budget
    ) {
        alert(
            "Please complete all required job details."
        );

        return;
    }


    if (
        !Number.isFinite(Number(budget)) ||
        Number(budget) <= 0
    ) {
        alert(
            "Please enter a valid maximum budget."
        );

        return;
    }


    const createJob =
        async function(photoData) {

            const {
                data: jobId,
                error
            } =
                await supabaseClient.rpc(
                    "create_findvia_job",
                    {
                        p_title: title,
                        p_category: category,
                        p_description: description,
                        p_area: area,
                        p_timing: timing,
                        p_photo_data: photoData || "",
                        p_max_budget: Number(budget)
                    }
                );


            if (error) {

                console.error(
                    "FindVia job creation error:",
                    error
                );

                alert(
                    "Job post nahi ho saki.\n\n" +
                    error.message
                );

                return;
            }


            if (!jobId) {

                alert(
                    "Job post failed. Please try again."
                );

                return;
            }


            alert(
                "Your job has been posted successfully."
            );


            document.getElementById(
                "jobTitle"
            ).value = "";

            document.getElementById(
                "jobCategory"
            ).value = "";

            document.getElementById(
                "jobDescription"
            ).value = "";

            document.getElementById(
                "jobArea"
            ).value = "";

            document.getElementById(
                "jobTiming"
            ).value = "";

            document.getElementById(
                "jobBudget"
            ).value = "";

            document.getElementById(
                "jobPhoto"
            ).value = "";


            await showPostedJobs();

            findWork();
        };


    if (
        photoInput &&
        photoInput.files &&
        photoInput.files[0]
    ) {

        const file =
            photoInput.files[0];


        if (
            file.size >
            2 * 1024 * 1024
        ) {

            alert(
                "Photo size 2MB se kam honi chahiye."
            );

            return;
        }


        const reader =
            new FileReader();


        reader.onload =
            async function(event) {

                await createJob(
                    event.target.result
                );

            };


        reader.readAsDataURL(file);

    } else {

        await createJob("");

    }
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


async function showPostedJobs(categoryFilter = "") {

    const resultsBox =
        document.getElementById("workResults");

    if (!resultsBox) {
        return;
    }


    resultsBox.innerHTML = `
        <div class="empty-state">
            <strong>Loading jobs...</strong>
            <p>Please wait.</p>
        </div>
    `;


    const {
        data: jobs,
        error
    } =
        await supabaseClient
            .from("jobs")
            .select(
                "id, title, category, description, area, timing, photo_data, status, match_status, matched_worker_id, job_status, created_at"
            )
            .eq("status", "open")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "FindVia jobs load error:",
            error
        );

        resultsBox.innerHTML = `
            <div class="empty-state">
                <strong>Jobs load nahi ho sake.</strong>
                <p>
                    ${escapeHTML(error.message)}
                </p>
            </div>
        `;

        return;
    }


    let availableJobs =
        (jobs || []).filter(
            function(job) {

                return (
                    job.status === "open" &&
                    !job.match_status &&
                    job.job_status !== "confirmed" &&
                    job.job_status !== "completed"
                );

            }
        );


    if (categoryFilter) {

        availableJobs =
            availableJobs.filter(
                function(job) {

                    return (
                        job.category ===
                        categoryFilter
                    );

                }
            );

    }


    if (
        availableJobs.length === 0
    ) {

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
                            ? escapeHTML(categoryFilter) +
                              " Jobs"
                            : "Available Jobs"
                    }
                </h3>

            </div>

            <span class="results-count">
                ${availableJobs.length} found
            </span>

        </div>
    `;


    availableJobs.forEach(
        function(job) {

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
                        job.photo_data
                            ? `
                                <img
                                    class="job-photo"
                                    src="${job.photo_data}"
                                    alt="Job photo"
                                >
                            `
                            : ""
                    }


                    <div class="job-private-note">
                        🔒 Customer budget is hidden until the appropriate match stage.
                    </div>


                    <button
                        class="primary-btn job-interest-btn"
                        onclick="respondToJob('${job.id}')"
                    >
                        I'm Interested
                    </button>

                </div>
            `;

        }
    );


    resultsBox.innerHTML =
        html;
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

async function respondToJob(jobId) {

    const {
        data: job,
        error: jobError
    } =
        await supabaseClient
            .from("jobs")
            .select(
                "id, title, category, description, area, timing, photo_data, status, match_status, matched_worker_id, job_status"
            )
            .eq("id", jobId)
            .maybeSingle();


    if (jobError) {

        console.error(
            "FindVia job lookup error:",
            jobError
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            jobError.message
        );

        return;
    }


    if (!job) {

        alert(
            "Job nahi mili."
        );

        return;
    }


    if (
        job.status !== "open" ||
        job.match_status === "matched" ||
        job.job_status === "confirmed" ||
        job.job_status === "completed"
    ) {

        alert(
            t("Ye job ab available nahi hai.")
        );

        return;
    }


    const currentRole =
        localStorage.getItem(
            "findviaUserRole"
        );


    if (
        currentRole !== "worker"
    ) {

        alert(
            t(
                "Is job par interest show karne ke liye Worker role select karein."
            )
        );

        showProfile();

        return;
    }


    /*
     * Worker verification, duplicate response,
     * authentication and worker identity are now
     * checked securely by Supabase RPC.
     *
     * Customer maximum budget is NOT fetched here.
     */


    const {
        data: responseId,
        error: responseError
    } =
        await supabaseClient.rpc(
            "create_findvia_job_response",
            {
                p_job_id: jobId
            }
        );


    if (responseError) {

        console.error(
            "FindVia job response error:",
            responseError
        );


        const errorMessage =
            String(
                responseError.message || ""
            );


        if (
            errorMessage.includes(
                "already responded"
            )
        ) {

            alert(
                t(
                    "Aap already is job mein interest dikha chuke hain."
                )
            );

            return;
        }


        if (
            errorMessage.includes(
                "Worker verification required"
            )
        ) {

            alert(
                "⏳ Worker verification required.\n\n" +
                "Aapka worker profile abhi approved nahi hai.\n\n" +
                "Admin approval ke baad hi aap jobs par response kar sakte hain."
            );

            return;
        }


        if (
            errorMessage.includes(
                "Job is not available"
            )
        ) {

            alert(
                t(
                    "Ye job ab available nahi hai."
                )
            );

            return;
        }


        alert(
            "Interest send nahi ho saka.\n\n" +
            errorMessage
        );

        return;
    }


    if (!responseId) {

        alert(
            "Interest send nahi ho saka. Please try again."
        );

        return;
    }


    alert(
        "Interest sent successfully.\n\n" +
        "Customer ko aapki response milegi. " +
        "Contact details abhi hidden rahengi."
    );
}


function goHome() {
document.getElementById("authScreen").style.display = "none";
    
hideAdminScreens();
  hideWorkerTransactionScreen();  
hideWorkerRechargeScreen();
    
hideWorkerVerificationScreen();
    
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

document.getElementById("authScreen").style.display = "none";

    
hideAdminScreens();
hideWorkerTransactionScreen();
hideWorkerRechargeScreen();    
hideWorkerVerificationScreen();
    
    
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

document.getElementById("authScreen").style.display = "none";
    

hideWorkerVerificationScreen();
   hideWorkerRechargeScreen(); 
    
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




async function searchWork() {

    const searchInput =
        document.getElementById("workSearch");

    const search =
        searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    if (search === "") {

        await showPostedJobs();

        return;
    }

    const {
        data: jobs,
        error
    } = await supabaseClient
        .from("jobs")
        .select(
            "id, title, category, description, area, timing, photo_data, status, match_status, matched_worker_id, job_status, created_at"
        )
        .eq("status", "open")
        .order("created_at", {
            ascending: false
        });

    if (error) {

        console.error(
            "FindVia work search error:",
            error
        );

        const resultsBox =
            document.getElementById("workResults");

        if (resultsBox) {

            resultsBox.innerHTML = `
                <div class="empty-state">

                    <strong>
                        Search failed.
                    </strong>

                    <p>
                        ${escapeHTML(error.message)}
                    </p>

                </div>
            `;
        }

        return;
    }

    const matchedJobs =
        (jobs || []).filter(function(job) {

            if (
                job.match_status ||
                job.job_status === "confirmed" ||
                job.job_status === "completed"
            ) {
                return false;
            }

            const title =
                String(job.title || "")
                    .toLowerCase();

            const category =
                String(job.category || "")
                    .toLowerCase();

            const description =
                String(job.description || "")
                    .toLowerCase();

            const area =
                String(job.area || "")
                    .toLowerCase();

            return (
                title.includes(search) ||
                category.includes(search) ||
                description.includes(search) ||
                area.includes(search)
            );

        });

    const resultsBox =
        document.getElementById("workResults");

    if (!resultsBox) {
        return;
    }

    if (matchedJobs.length === 0) {

        resultsBox.innerHTML = `
            <div class="empty-state">

                <strong>
                    No matching jobs found.
                </strong>

                <p>
                    Is search ke liye abhi koi available job nahi mili.
                </p>

            </div>
        `;

        return;
    }

    let html = `
        <div class="worker-results-header">

            <div>

                <span class="results-label">
                    SEARCH RESULTS
                </span>

                <h3>
                    Matching Jobs
                </h3>

            </div>

            <span class="results-count">
                ${matchedJobs.length} found
            </span>

        </div>
    `;

    matchedJobs.forEach(function(job) {

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
                    job.photo_data
                    ? `
                        <img
                            class="job-photo"
                            src="${job.photo_data}"
                            alt="Job photo"
                        >
                    `
                    : ""
                }

                <div class="job-private-note">
                    🔒 Customer budget is hidden until the appropriate match stage.
                </div>

                <button
                    class="primary-btn job-interest-btn"
                    onclick="respondToJob('${job.id}')"
                >
                    I'm Interested
                </button>

            </div>
        `;

    });

    resultsBox.innerHTML =
        html;
}


function searchWorkers() {

    const searchInput =
        document.getElementById("workerSearch");

    const search =
        searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    if (search === "") {

        document.getElementById(
            "workerResults"
        ).innerHTML = `
            <div class="empty-state">
                <strong>Search workers or services.</strong>
                <p>
                    Worker name, service, experience ya area search karein.
                </p>
            </div>
        `;

        return;
    }

    const workerProfiles = JSON.parse(
        localStorage.getItem(
            "findviaWorkerProfiles"
        ) || "[]"
    );

    const matchedWorkers = [];

    workerProfiles.forEach(function(profileData) {

        try {

            const worker =
                typeof profileData === "string"
                    ? JSON.parse(profileData)
                    : profileData;

            if (
                !worker ||
                worker.verificationStatus !== "approved"
            ) {
                return;
            }

            const name =
                String(worker.name || "").toLowerCase();

            const service =
                String(worker.service || "").toLowerCase();

            const area =
                String(worker.area || "").toLowerCase();

            const experience =
                String(worker.experience || "").toLowerCase();

            const availability =
                String(worker.availability || "").toLowerCase();

            if (
                name.includes(search) ||
                service.includes(search) ||
                area.includes(search) ||
                experience.includes(search) ||
                availability.includes(search)
            ) {

                matchedWorkers.push(worker);

            }

        } catch (error) {

            console.log(
                "Invalid worker profile skipped."
            );

        }

    });

    const resultsBox =
        document.getElementById(
            "workerResults"
        );

    if (!resultsBox) {
        return;
    }

    let html = `
        <div class="worker-results-header">

            <div>
                <span class="results-label">
                    SEARCH RESULTS
                </span>

                <h3>
                    Matching Workers
                </h3>
            </div>

            <span class="results-count">
                ${matchedWorkers.length} found
            </span>

        </div>
    `;

    if (matchedWorkers.length === 0) {

        html += `
            <div class="empty-state">

                <div style="font-size:40px;">
                    👷
                </div>

                <h3>
                    No approved workers found
                </h3>

                <p>
                    Is search ke liye koi approved worker nahi mila.
                </p>

            </div>
        `;

        resultsBox.innerHTML = html;

        return;
    }

    matchedWorkers.forEach(function(worker) {

        const workerName =
            worker.name || "Worker";

        const workerInitial =
            workerName
            .charAt(0)
            .toUpperCase();

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
                            worker.availability ||
                            "Available"
                        )}

                    </div>

                    <p>
                        🔧 ${escapeHTML(
                            worker.service ||
                            "Service not specified"
                        )}
                    </p>

                    <p>
                        📍 ${escapeHTML(
                            worker.area ||
                            "Area not specified"
                        )}
                    </p>

                    <div class="worker-stats">

                        <span>
                            💼 ${escapeHTML(
                                worker.experience ||
                                "Experience not specified"
                            )}
                        </span>

                    </div>

                </div>

            </div>
        `;
    });

    resultsBox.innerHTML = html;
}

function openSearch() {

document.getElementById("authScreen").style.display = "none";
   hideWorkerVerificationScreen(); 
hideAdminScreens();
hideWorkerRechargeScreen();    
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




async function globalSearch() {

const input =
    document.getElementById("globalSearch");

const search =
    input
    ? input.value.trim().toLowerCase()
    : "";

const resultsBox =
    document.getElementById("globalResults");

if (!resultsBox) {
    return;
}

if (!search) {

    resultsBox.innerHTML = `
        <div class="empty-state">

            <strong>
                Search something on FindVia.
            </strong>

            <p>
                Work title, service, category ya area search karein.
            </p>

        </div>
    `;

    return;
}


const currentRole =
    localStorage.getItem("findviaUserRole");


/*
 * FindVia rule:
 * Customer ko direct worker directory nahi dikhani hai.
 * Work opportunities worker side par available hongi.
 */

if (currentRole !== "worker") {

    resultsBox.innerHTML = `
        <div class="empty-state">

            <div style="font-size:40px;">
                🔒
            </div>

            <h3>
                Worker Search
            </h3>

            <p>
                Available work search karne ke liye
                Worker role select karein.
            </p>

        </div>
    `;

    return;
}


const {
    data: jobs,
    error
} = await supabaseClient
    .from("jobs")
    .select(
        "id, title, category, description, area, timing, photo_data, status, match_status, matched_worker_id, job_status, created_at"
    )
    .eq("status", "open")
    .order("created_at", {
        ascending: false
    });


if (error) {

    console.error(
        "FindVia global search error:",
        error
    );

    resultsBox.innerHTML = `
        <div class="empty-state">

            <strong>
                Search failed.
            </strong>

            <p>
                ${escapeHTML(error.message)}
            </p>

        </div>
    `;

    return;
}


const matchedJobs =
    (jobs || []).filter(function(job) {

        if (
            job.match_status ||
            job.job_status === "confirmed" ||
            job.job_status === "completed"
        ) {
            return false;
        }


        const title =
            String(job.title || "")
                .toLowerCase();

        const category =
            String(job.category || "")
                .toLowerCase();

        const description =
            String(job.description || "")
                .toLowerCase();

        const area =
            String(job.area || "")
                .toLowerCase();


        return (
            title.includes(search) ||
            category.includes(search) ||
            description.includes(search) ||
            area.includes(search)
        );

    });


if (matchedJobs.length === 0) {

    resultsBox.innerHTML = `
        <div class="empty-state">

            <div style="font-size:40px;">
                🔎
            </div>

            <h3>
                No work found
            </h3>

            <p>
                "${escapeHTML(search)}"
                ke liye abhi koi available work nahi mila.
            </p>

        </div>
    `;

    return;
}


let html = `
    <div class="worker-results-header">

        <div>

            <span class="results-label">
                FINDVIA SEARCH
            </span>

            <h3>
                Available Work
            </h3>

        </div>

        <span class="results-count">
            ${matchedJobs.length} found
        </span>

    </div>
`;


matchedJobs.forEach(function(job) {

    html += `
        <div class="job-card">

            <div class="job-card-top">

                <div>

                    <span class="job-category">
                        ${escapeHTML(
                            job.category || ""
                        )}
                    </span>

                    <h3>
                        ${escapeHTML(
                            job.title || ""
                        )}
                    </h3>

                </div>

                <span class="job-status">
                    Open
                </span>

            </div>


            <p class="job-description">
                ${escapeHTML(
                    job.description || ""
                )}
            </p>


            <div class="job-meta">

                <span>
                    📍 ${escapeHTML(
                        job.area || ""
                    )}
                </span>

                <span>
                    🕒 ${escapeHTML(
                        job.timing || ""
                    )}
                </span>

            </div>


            ${
                job.photo_data
                ? `
                    <img
                        class="job-photo"
                        src="${job.photo_data}"
                        alt="Job photo"
                    >
                `
                : ""
            }


            <div class="job-private-note">
                🔒 Customer budget is hidden until the appropriate match stage.
            </div>


            <button
                class="primary-btn job-interest-btn"
                onclick="respondToJob('${job.id}')"
            >
                I'm Interested
            </button>

        </div>
    `;

});


resultsBox.innerHTML =
    html;

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

const workerRechargeBox =
    document.getElementById(
        "workerRechargeBox"
    );

if (workerRechargeBox) {

    if (role === "worker") {

        workerRechargeBox.style.display =
            "block";

    } else {

        workerRechargeBox.style.display =
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
loadWorkerServices();
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function saveWorkerProfile() {
    const name =
        document.getElementById("workerName").value.trim();

    const service =
        document.getElementById("workerService").value;

    const experience =
        document.getElementById("workerExperience").value;

    const area =
        document.getElementById("workerArea").value.trim();

    const availability =
        document.getElementById("workerAvailability").value;
const commissionPreference =
    document.getElementById("workerCommissionPreference")?.value ||
    "percentage";
    

    if (
    !name ||
    !service ||
    !experience ||
    !area ||
    !availability ||
    !commissionPreference
) {
        alert("Please complete all worker profile details.");
        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        openAuthScreen();
        return;
    }

       const {
        data: existingProfile,
        error: existingProfileError
    } = await supabaseClient
        .from("worker_profiles")
        .select("verification_status")
        .eq("id", user.id)
        .maybeSingle();

    if (existingProfileError) {
        console.error(
            "Worker verification status load error:",
            existingProfileError
        );

        alert(
            "Worker profile status load nahi ho saka.\n\n" +
            existingProfileError.message
        );

        return;
    }

    const verificationStatus =
        existingProfile?.verification_status || "pending"; 

    const profileData = {
    id: user.id,
    name: name,
    service: service,
    experience: experience,
    area: area,
    availability: availability,
    commission_preference:
        commissionPreference,
    verification_status:
        verificationStatus,
    updated_at:
        new Date().toISOString()
};
    const {
        error
    } = await supabaseClient
        .from("worker_profiles")
        .upsert(
            profileData,
            {
                onConflict: "id"
            }
        );

    if (error) {
        console.error(
            "Worker profile save error:",
            error
        );

        alert(
            "Worker profile save nahi ho saki.\n\n" +
            error.message
        );

        return;
    }

    const workerProfile = {
    name: name,
    service: service,
    experience: experience,
    area: area,
    availability: availability,
    commissionPreference:
        commissionPreference,
    verificationStatus:
        verificationStatus
};

    localStorage.setItem(
        "findviaWorkerProfile",
        JSON.stringify(workerProfile)
    );

    alert(
        "Worker profile saved successfully."
    );

    showProfile();
}

async function openWorkerVerification() {

    const currentRole =
        localStorage.getItem("findviaUserRole");

    if (currentRole !== "worker") {
        alert(
            "Please select the Worker role first."
        );
        return;
    }

    const user =
    await getFindViaCurrentUser();

if (!user) {
    openAuthScreen();
    return;
}

const {
    data: profile,
    error: profileError
} = await supabaseClient
    .from("worker_profiles")
    .select("id, name")
    .eq("id", user.id)
    .maybeSingle();

if (profileError) {
    console.error(
        "Worker profile verification check error:",
        profileError
    );

    alert(
        "Worker profile load nahi ho saki.\n\n" +
        profileError.message
    );

    return;
}

if (!profile) {
    alert(
        "Please complete your Worker Profile first."
    );
    return;
}

    document
        .getElementById("profileScreen")
        .classList.remove("active");

    document
        .getElementById("workerProfileScreen")
        .classList.remove("active");

 
const verificationScreen =
    document.getElementById(
        "workerVerificationScreen"
    );

if (verificationScreen) {

    verificationScreen.style.display = "block";
    verificationScreen.classList.add("active");
}
    loadWorkerVerification();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function loadWorkerVerification() {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        return;
    }

    const {
        data: profile,
        error
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "verification_status, verification_submitted"
        )
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error(
            "Worker verification load error:",
            error
        );

        return;
    }

    if (!profile) {
        return;
    }

    const consent =
        document.getElementById(
            "workerVerificationConsent"
        );

    if (consent) {

        consent.checked =
            profile.verification_submitted === true;
    }
}


async function submitWorkerVerification() {

    const governmentId =
        document.getElementById(
            "workerGovernmentId"
        );

    const selfie =
        document.getElementById(
            "workerSelfie"
        );

    const skillProof =
        document.getElementById(
            "workerSkillProof"
        );

    const consent =
        document.getElementById(
            "workerVerificationConsent"
        );


    if (
        !governmentId ||
        !governmentId.files.length
    ) {
        alert(
            "Please upload your Government ID."
        );
        return;
    }


    if (
        !selfie ||
        !selfie.files.length
    ) {
        alert(
            "Please upload your recent photo or selfie."
        );
        return;
    }


    if (
        !consent ||
        !consent.checked
    ) {
        alert(
            "Please confirm the verification consent."
        );
        return;
    }


    const user =
        await getFindViaCurrentUser();


    if (!user) {
        openAuthScreen();
        return;
    }


    const {
    data: profile,
    error: profileError
} = await supabaseClient
    .from("worker_profiles")
    .select(
        "id, name, service, experience, area, availability, commission_preference, verification_status, verification_submitted"
    )
    .eq("id", user.id)
    .maybeSingle();

if (profileError) {

    console.error(
        "Worker profile load error:",
        profileError
    );

    alert(
        "Worker profile load nahi ho saki.\n\n" +
        profileError.message
    );

    return;
}

if (!profile) {

    alert(
        "Worker profile not found."
    );

    return;
}

    const governmentFile =
        governmentId.files[0];

    const selfieFile =
        selfie.files[0];

    const skillFile =
        skillProof &&
        skillProof.files.length
            ? skillProof.files[0]
            : null;


    const timestamp =
        Date.now();


    const governmentPath =
        user.id +
        "/government-id-" +
        timestamp +
        "-" +
        encodeURIComponent(
            governmentFile.name
        );


    const selfiePath =
        user.id +
        "/selfie-" +
        timestamp +
        "-" +
        encodeURIComponent(
            selfieFile.name
        );


    const skillPath =
        skillFile
            ? user.id +
              "/skill-proof-" +
              timestamp +
              "-" +
              encodeURIComponent(
                  skillFile.name
              )
            : null;


    try {

        /*
         * Government ID upload
         */
        const {
            error:
                governmentUploadError
        } = await supabaseClient
            .storage
            .from("worker-verification")
            .upload(
                governmentPath,
                governmentFile,
                {
                    upsert: false,
                    contentType:
                        governmentFile.type ||
                        "application/octet-stream"
                }
            );


        if (governmentUploadError) {

            console.error(
                "Government ID upload error:",
                governmentUploadError
            );

            alert(
                "Government ID upload nahi ho saki.\n\n" +
                governmentUploadError.message
            );

            return;
        }


        /*
         * Selfie upload
         */
        const {
            error:
                selfieUploadError
        } = await supabaseClient
            .storage
            .from("worker-verification")
            .upload(
                selfiePath,
                selfieFile,
                {
                    upsert: false,
                    contentType:
                        selfieFile.type ||
                        "application/octet-stream"
                }
            );


        if (selfieUploadError) {

            console.error(
                "Selfie upload error:",
                selfieUploadError
            );

            alert(
                "Selfie upload nahi ho saki.\n\n" +
                selfieUploadError.message
            );

            return;
        }


        /*
         * Optional skill proof upload
         */
        if (skillFile) {

            const {
                error:
                    skillUploadError
            } = await supabaseClient
                .storage
                .from("worker-verification")
                .upload(
                    skillPath,
                    skillFile,
                    {
                        upsert: false,
                        contentType:
                            skillFile.type ||
                            "application/octet-stream"
                    }
                );


            if (skillUploadError) {

                console.error(
                    "Skill proof upload error:",
                    skillUploadError
                );

                alert(
                    "Skill proof upload nahi ho saki.\n\n" +
                    skillUploadError.message
                );

                return;
            }
        }


        /*
         * Save verification information
         * in worker_profiles
         */
        const {
            error:
                profileUpdateError
        } = await supabaseClient
            .from("worker_profiles")
            .update({
                verification_status:
                    "pending",

                verification_submitted:
                    true,

                verification_submitted_at:
                    new Date().toISOString(),

                government_id_file:
                    governmentPath,

                selfie_file:
                    selfiePath,

                skill_proof_file:
                    skillPath
            })
            .eq(
                "id",
                user.id
            );


        if (profileUpdateError) {

            console.error(
                "Worker verification save error:",
                profileUpdateError
            );

            alert(
                "Verification details save nahi ho sake.\n\n" +
                profileUpdateError.message
            );

            return;
        }


        /*
         * Keep local profile data
         * for current frontend screens.
         */
        profile.verificationStatus =
            "pending";

        profile.verificationSubmitted =
            true;

        profile.verificationSubmittedAt =
            new Date().toISOString();

        profile.verificationDocuments = {

            governmentId:
                governmentPath,

            selfie:
                selfiePath,

            skillProof:
                skillPath || ""
        };


        const profileString =
            JSON.stringify(profile);


        localStorage.setItem(
            "findviaWorkerProfile",
            profileString
        );


        /*
         * Keep existing admin/local
         * verification list compatible.
         */
        let workerProfiles =
            JSON.parse(
                localStorage.getItem(
                    "findviaWorkerProfiles"
                ) || "[]"
            );


        const oldProfile =
            workerProfiles.findIndex(
                function(item) {

                    try {

                        const worker =
                            typeof item === "string"
                                ? JSON.parse(item)
                                : item;

                        return (
                            worker &&
                            worker.name ===
                                profile.name
                        );

                    } catch (error) {

                        return false;
                    }
                }
            );


        if (oldProfile !== -1) {

            workerProfiles[oldProfile] =
                profileString;

        } else {

            workerProfiles.push(
                profileString
            );
        }


        localStorage.setItem(
            "findviaWorkerProfiles",
            JSON.stringify(
                workerProfiles
            )
        );


        alert(
            "Verification request submitted successfully.\n\n" +
            "Your documents have been uploaded and are now pending admin verification."
        );


        showProfile();


    } catch (error) {

        console.error(
            "Worker verification error:",
            error
        );

        alert(
            "Verification submit nahi ho saki.\n\n" +
            error.message
        );
    }
}


async function loadWorkerProfile() {
    const user =
        await getFindViaCurrentUser();

    if (!user) {
        return;
    }

    const {
        data: profile,
        error
    } = await supabaseClient
        .from("worker_profiles")
        .select(
    "id, name, service, experience, area, availability, commission_preference, verification_status"
)
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error(
            "Worker profile load error:",
            error
        );

        return;
    }

    if (!profile) {
        return;
    }

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

const commissionPreferenceSelect =
    document.getElementById("workerCommissionPreference");

if (commissionPreferenceSelect) {
    commissionPreferenceSelect.value =
        profile.commission_preference || "percentage";
}

    
}   

/* ================================
   WORKER PROFILE SUMMARY
================================ */
async function loadWorkerProfileSummary() {

    const summaryBox =
        document.getElementById("workerProfileSummary");

    if (!summaryBox) {
        return;
    }

    const currentRole =
        localStorage.getItem("findviaUserRole");

    // Worker नहीं है तो profile summary hide रहे
    if (currentRole !== "worker") {
        summaryBox.style.display = "none";
        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        summaryBox.style.display = "none";
        return;
    }

    const {
        data: profile,
        error
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "id, name, service, experience, area, availability, commission_preference, verification_status"
        )
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error(
            "Worker profile summary load error:",
            error
        );

        summaryBox.style.display = "none";
        return;
    }

    if (!profile) {
        summaryBox.style.display = "none";
        return;
    }

    document.getElementById(
        "summaryWorkerName"
    ).textContent =
        profile.name || "-";

    document.getElementById(
        "summaryWorkerService"
    ).textContent =
        profile.service || "-";

    document.getElementById(
        "summaryWorkerExperience"
    ).textContent =
        profile.experience || "-";

    document.getElementById(
        "summaryWorkerArea"
    ).textContent =
        profile.area || "-";

    document.getElementById(
        "summaryWorkerAvailability"
    ).textContent =
        profile.availability || "-";

    const verificationElement =
        document.getElementById(
            "summaryWorkerVerification"
        );

    if (verificationElement) {

        if (
            profile.verification_status ===
            "approved"
        ) {

            verificationElement.textContent =
                "🟢 Approved";

        } else if (
            profile.verification_status ===
            "rejected"
        ) {

            verificationElement.textContent =
                "🔴 Rejected";

        } else {

            verificationElement.textContent =
                "🟡 Pending Verification";
        }
    }

    const verificationButton =
        document.getElementById(
            "workerVerificationButton"
        );

    if (verificationButton) {

        verificationButton.style.display =
            profile.verification_status ===
            "approved"
                ? "none"
                : "block";
    }

    summaryBox.style.display = "block";
}


function showMyJobs() {
hideWorkerTransactionScreen();
    hideWorkerRechargeScreen();
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


async function loadMyJobs() {

    const box =
        document.getElementById("myJobsResults");

    if (!box) {
        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        box.innerHTML = `
            <div class="empty-state">
                <h3>Please login to continue.</h3>
            </div>
        `;
        return;
    }

    const currentRole =
        localStorage.getItem("findviaUserRole");


    /* =========================
       WORKER VIEW
    ========================= */

    if (currentRole === "worker") {

        const {
            data: matchedJobs,
            error: workerJobsError
        } = await supabaseClient
            .from("jobs")
            .select(`
                id,
                title,
                category,
                description,
                area,
                timing,
                status,
                match_status,
                matched_worker_id,
                customer_offer,
                worker_offer,
                price_status,
                job_status
            `)
            .eq("matched_worker_id", user.id)
            .eq("match_status", "matched")
            .order("created_at", {
                ascending: false
            });


        if (workerJobsError) {

            console.error(
                "FindVia worker jobs error:",
                workerJobsError
            );

            box.innerHTML = `
                <div class="empty-state">
                    <h3>Jobs load nahi ho saki.</h3>
                    <p>
                        ${escapeHTML(workerJobsError.message)}
                    </p>
                </div>
            `;

            return;
        }


        const title =
            document.querySelector(
                "#myJobsScreen .profile-header h2"
            );

        const subtitle =
            document.querySelector(
                "#myJobsScreen .profile-header p"
            );

        if (title) {
            title.textContent =
                "My Matched Jobs";
        }

        if (subtitle) {
            subtitle.textContent =
                "Jin jobs ke liye aap customer ke saath matched hain.";
        }


        if (!matchedJobs || matchedJobs.length === 0) {

            box.innerHTML = `
                <div class="empty-state">

                    <div style="font-size:40px;">
                        📋
                    </div>

                    <h3>
                        No matched jobs yet
                    </h3>

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

            let statusText =
                "✅ Worker Matched";

            if (job.job_status === "confirmed") {

                statusText =
                    "✅ Job Confirmed";

            } else if (
                job.price_status === "accepted"
            ) {

                statusText =
                    "💰 Price Accepted";

            } else if (
                job.price_status === "counter_offer"
            ) {

                statusText =
                    "💰 Counter Offer Sent";

            } else if (
                job.price_status === "rejected"
            ) {

                statusText =
                    "❌ Offer Rejected";

            } else if (
                job.customer_offer
            ) {

                statusText =
                    "💰 Price Offer Received";
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

                </div>
            `;
        });


        box.innerHTML =
            html;

        return;
    }


    /* =========================
       CUSTOMER VIEW
    ========================= */

    const title =
        document.querySelector(
            "#myJobsScreen .profile-header h2"
        );

    const subtitle =
        document.querySelector(
            "#myJobsScreen .profile-header p"
        );

    if (title) {
        title.textContent =
            "My Jobs";
    }

    if (subtitle) {
        subtitle.textContent =
            "Aapki posted work requirements.";
    }


    const {
        data: jobs,
        error: jobsError
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            title,
            category,
            description,
            area,
            timing,
            status,
            match_status,
            matched_worker_id,
            customer_offer,
            worker_offer,
            price_status,
            job_status
        `)
        .eq("customer_id", user.id)
        .order("created_at", {
            ascending: false
        });


    if (jobsError) {

        console.error(
            "FindVia customer jobs error:",
            jobsError
        );

        box.innerHTML = `
            <div class="empty-state">
                <h3>Jobs load nahi ho saki.</h3>
                <p>
                    ${escapeHTML(jobsError.message)}
                </p>
            </div>
        `;

        return;
    }


    if (!jobs || jobs.length === 0) {

        box.innerHTML = `
            <div class="empty-state">

                <div style="font-size:40px;">
                    📋
                </div>

                <h3>
                    No jobs posted yet
                </h3>

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


    const jobIds =
        jobs.map(function(job) {
            return job.id;
        });


    const {
        data: responses,
        error: responsesError
    } = await supabaseClient
        .from("job_responses")
        .select("id, job_id, worker_id, status")
        .in("job_id", jobIds);


    if (responsesError) {

        console.error(
            "FindVia job response count error:",
            responsesError
        );

        box.innerHTML = `
            <div class="empty-state">
                <h3>Responses load nahi ho saki.</h3>
                <p>
                    ${escapeHTML(responsesError.message)}
                </p>
            </div>
        `;

        return;
    }


    const responseList =
        responses || [];


    let html = "";


    jobs.forEach(function(job) {

        const responseCount =
            responseList.filter(function(response) {

                return response.job_id === job.id;

            }).length;


        const isMatched =
            job.match_status === "matched";


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
                            isMatched
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
                    isMatched
                    ? `
                        <div class="job-private-note">
                            🔒 Worker successfully matched.
                            Private pricing will be handled in the next step.
                        </div>
                    `
                    : `
                        <button
                            class="primary-btn"
                            onclick="showJobResponses('${job.id}')"
                        >
                            View Responses
                        </button>
                    `
                }

            </div>
        `;
    });


    box.innerHTML =
        html;
}


function showJobResponses(jobId) {

    hideAdminScreens();
hideWorkerTransactionScreen();
hideWorkerRechargeScreen();
    
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



async function loadJobResponses(jobId) {

    const box =
        document.getElementById("jobResponsesResults");

    if (!box) {
        return;
    }


    const user =
        await getFindViaCurrentUser();

    if (!user) {

        box.innerHTML = `
            <div class="empty-state">
                <h3>Please login to continue.</h3>
            </div>
        `;

        return;
    }


    const {
        data: job,
        error: jobError
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            title,
            category,
            area,
            status,
            match_status,
            matched_worker_id
        `)
        .eq("id", jobId)
        .eq("customer_id", user.id)
        .maybeSingle();


    if (jobError) {

        console.error(
            "FindVia job response job error:",
            jobError
        );

        box.innerHTML = `
            <div class="empty-state">
                <h3>Job load nahi ho saki.</h3>
                <p>
                    ${escapeHTML(jobError.message)}
                </p>
            </div>
        `;

        return;
    }


    if (!job) {

        box.innerHTML = `
            <div class="empty-state">
                <h3>Job not found</h3>
            </div>
        `;

        return;
    }


    const {
        data: jobResponses,
        error: responsesError
    } = await supabaseClient
        .from("job_responses")
        .select(`
            id,
            job_id,
            worker_id,
            status,
            worker_offer,
            price_status,
            created_at
        `)
        .eq("job_id", jobId)
        .order("created_at", {
            ascending: true
        });


    if (responsesError) {

        console.error(
            "FindVia job responses error:",
            responsesError
        );

        box.innerHTML = `
            <div class="empty-state">
                <h3>Responses load nahi ho saki.</h3>
                <p>
                    ${escapeHTML(responsesError.message)}
                </p>
            </div>
        `;

        return;
    }


    const responses =
        jobResponses || [];


    if (responses.length === 0) {

        box.innerHTML = `
            <div class="empty-state">

                <div style="font-size:40px;">
                    👥
                </div>

                <h3>
                    No responses yet
                </h3>

                <p>
                    Jab koi worker is job mein interest dikhayega,
                    uski response yahan दिखाई देगी.
                </p>

            </div>
        `;

        return;
    }


    const workerIds =
        responses.map(function(response) {
            return response.worker_id;
        });


    const {
        data: workerProfiles,
        error: profilesError
    } = await supabaseClient
        .from("worker_profiles")
        .select(`
            id,
            name,
            service,
            experience,
            area,
            availability,
            verification_status
        `)
        .in("id", workerIds);


    if (profilesError) {

        console.error(
            "FindVia worker profiles error:",
            profilesError
        );

        box.innerHTML = `
            <div class="empty-state">
                <h3>Worker profiles load nahi ho saki.</h3>
                <p>
                    ${escapeHTML(profilesError.message)}
                </p>
            </div>
        `;

        return;
    }


    const profileList =
        workerProfiles || [];


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


    responses.forEach(function(response, index) {

        const workerProfile =
            profileList.find(function(profile) {

                return profile.id === response.worker_id;

            });


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


                ${
                    response.status === "pending" &&
                    job.match_status !== "matched"
                    ? `
                        <button
                            class="primary-btn"
                            onclick="selectWorkerForJob(
                                '${job.id}',
                                '${response.id}'
                            )"
                        >
                            Select Worker
                        </button>
                    `
                    : `
                        <div class="job-private-note">
                            ${
                                response.status === "accepted"
                                    ? "✅ Selected Worker"
                                    : "Response: " +
                                      escapeHTML(response.status)
                            }
                        </div>
                    `
                }

            </div>
        `;
    });


    box.innerHTML =
        html;
}


async function selectWorkerForJob(
    jobId,
    responseId
) {

    showFindViaActionModal(
        "Select Worker",
        "Kya aap is worker ko is job ke liye select karna chahte hain?\n\n" +
        "Select karne ke baad worker ke saath private pricing process shuru hogi.",
        [
            {
                text: "Select Worker",
                icon: "👷",

                action: async function() {

                    closeFindViaActionModal();


                    const user =
                        await getFindViaCurrentUser();

                    if (!user) {

                        alert(
                            "Please login to continue."
                        );

                        return;
                    }


                    const {
                        data: selected,
                        error
                    } =
                        await supabaseClient.rpc(
                            "select_findvia_worker",
                            {
                                p_job_id: jobId,
                                p_response_id: responseId
                            }
                        );


                    if (error) {

                        console.error(
                            "FindVia worker selection error:",
                            error
                        );


                        const errorMessage =
                            String(
                                error.message || ""
                            );


                        if (
                            errorMessage.includes(
                                "already matched"
                            )
                        ) {

                            alert(
                                "Ye job already kisi worker ke saath matched hai."
                            );

                        } else {

                            alert(
                                "Worker select nahi ho saka.\n\n" +
                                errorMessage
                            );
                        }

                        return;
                    }


                    if (!selected) {

                        alert(
                            "Worker select nahi ho saka. Please try again."
                        );

                        return;
                    }


                    alert(
                        "Worker successfully matched! ✅\n\n" +
                        "Ab next step mein private pricing process shuru hoga."
                    );


                    await showMyJobs();
                }
            }
        ]
    );
}


async function openPricingForJob(jobId) {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Please login to continue.");
        return;
    }


    const {
        data: job,
        error
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            customer_id,
            status,
            match_status,
            matched_worker_id,
            customer_offer,
            worker_offer,
            price_status,
            job_status
        `)
        .eq("id", jobId)
        .eq("customer_id", user.id)
        .maybeSingle();


    if (error) {
        console.error(
            "FindVia pricing job error:",
            error
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            error.message
        );

        return;
    }


    if (!job) {
        alert("Job nahi mili.");
        return;
    }


    if (
        job.match_status !== "matched" ||
        !job.matched_worker_id
    ) {
        alert("Pehle worker ko match karein.");
        return;
    }


    if (job.job_status === "confirmed") {
        alert("Ye job already confirmed hai.");
        return;
    }


    if (job.price_status === "accepted") {
        alert(
            "Price agreement already complete hai. ✅"
        );

        return;
    }


    showFindViaInputModal(
        "Private Price Offer",
        "Is job ke liye aap kitna price offer karna chahte hain?\n\nYe offer private rahega.",
        async function(price) {

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


            const {
                data: success,
                error: priceError
            } =
                await supabaseClient.rpc(
                    "update_findvia_job_price",
                    {
                        p_job_id: jobId,
                        p_action: "customer_offer",
                        p_amount: amount
                    }
                );


            if (priceError) {

                console.error(
                    "FindVia customer price error:",
                    priceError
                );

                alert(
                    "Price offer save nahi ho saka.\n\n" +
                    priceError.message
                );

                return;
            }


            if (!success) {

                alert(
                    "Price offer save nahi ho saka."
                );

                return;
            }


            alert(
                "Private price offer save ho gaya. ✅\n\n" +
                "Ab worker is offer ko dekhkar response de sakta hai."
            );


            await showMyJobs();
        },
        "number",
        "Enter amount",
        "Please amount enter karein.",
        "💰"
    );
}



async function openWorkerOffer(jobId) {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Please login to continue.");
        return;
    }


    const {
        data: job,
        error
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            title,
            matched_worker_id,
            customer_offer,
            worker_offer,
            price_status,
            job_status,
            match_status
        `)
        .eq("id", jobId)
        .eq("matched_worker_id", user.id)
        .maybeSingle();


    if (error) {

        console.error(
            "FindVia worker pricing error:",
            error
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            error.message
        );

        return;
    }


    if (!job) {

        alert(
            "Ye private offer aapke liye available nahi hai."
        );

        return;
    }


    if (job.job_status === "confirmed") {

        alert(
            "Ye job already confirmed hai."
        );

        return;
    }


    if (!job.customer_offer) {

        alert(
            "Customer ne abhi price offer nahi bheja hai."
        );

        return;
    }


    if (job.price_status === "accepted") {

        alert(
            "Price offer already accepted hai. ✅"
        );

        return;
    }


    if (job.price_status === "rejected") {

        alert(
            "Ye offer reject kiya ja chuka hai."
        );

        return;
    }


    showFindViaActionModal(
        "Customer ka Private Offer",
        "₹" + job.customer_offer,
        [

            {
                text: "Accept Offer",
                icon: "✅",

                action: async function() {

                    const {
                        data: success,
                        error
                    } =
                        await supabaseClient.rpc(
                            "update_findvia_job_price",
                            {
                                p_job_id: jobId,
                                p_action: "worker_accept"
                            }
                        );


                    if (error) {

                        console.error(
                            "FindVia worker accept error:",
                            error
                        );

                        alert(
                            "Offer accept nahi ho saka.\n\n" +
                            error.message
                        );

                        return;
                    }


                    if (!success) {

                        alert(
                            "Offer accept nahi ho saka."
                        );

                        return;
                    }


                    closeFindViaActionModal();


                    alert(
                        "Offer accepted! ✅\n\n" +
                        "Ab customer job confirmation kar sakta hai."
                    );


                    await showMyJobs();
                }
            },


            {
                text: "Counter Offer",
                icon: "💰",

                action: function() {

                    showFindViaInputModal(
                        "Counter Offer",
                        "Apna counter offer enter karein:",

                        async function(counterPrice) {

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


                            const {
                                data: success,
                                error
                            } =
                                await supabaseClient.rpc(
                                    "update_findvia_job_price",
                                    {
                                        p_job_id: jobId,
                                        p_action: "worker_counter",
                                        p_amount: amount
                                    }
                                );


                            if (error) {

                                console.error(
                                    "FindVia counter offer error:",
                                    error
                                );

                                alert(
                                    "Counter offer send nahi ho saka.\n\n" +
                                    error.message
                                );

                                return;
                            }


                            if (!success) {

                                alert(
                                    "Counter offer send nahi ho saka."
                                );

                                return;
                            }


                            closeFindViaActionModal();
                            closeFindViaInputModal();


                            alert(
                                "Counter offer send ho gaya. 💰\n\n" +
                                "Customer ise review karega."
                            );


                            await showMyJobs();
                        }
                    );
                }
            },


            {
                text: "Reject Offer",
                icon: "❌",

                action: async function() {

                    const {
                        data: success,
                        error
                    } =
                        await supabaseClient.rpc(
                            "update_findvia_job_price",
                            {
                                p_job_id: jobId,
                                p_action: "worker_reject"
                            }
                        );


                    if (error) {

                        console.error(
                            "FindVia worker reject error:",
                            error
                        );

                        alert(
                            "Offer reject nahi ho saka.\n\n" +
                            error.message
                        );

                        return;
                    }


                    if (!success) {

                        alert(
                            "Offer reject nahi ho saka."
                        );

                        return;
                    }


                    closeFindViaActionModal();


                    alert(
                        "Offer reject kar diya gaya."
                    );


                    await showMyJobs();
                }
            }

        ]
    );
}
        

    
       
async function openCustomerPriceResponse(jobId) {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Please login to continue.");
        return;
    }


    const {
        data: job,
        error
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            customer_id,
            customer_offer,
            worker_offer,
            price_status,
            job_status,
            match_status,
            matched_worker_id
        `)
        .eq("id", jobId)
        .eq("customer_id", user.id)
        .maybeSingle();


    if (error) {

        console.error(
            "FindVia customer price response error:",
            error
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            error.message
        );

        return;
    }


    if (!job) {
        alert("Job nahi mili.");
        return;
    }


    if (job.price_status === "accepted") {

        alert(
            "Worker ne price offer accept kar liya hai. ✅\n\n" +
            "Agla step job confirmation hoga."
        );

        return;
    }


    if (job.price_status === "rejected") {

        alert(
            "Worker ne aapka price offer reject kar diya hai. ❌"
        );

        return;
    }


    if (job.price_status === "counter_offer") {

        const workerOffer =
            job.worker_offer;


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

                    action: async function() {

                        const {
                            data: success,
                            error
                        } =
                            await supabaseClient.rpc(
                                "update_findvia_job_price",
                                {
                                    p_job_id: jobId,
                                    p_action: "customer_accept_counter"
                                }
                            );


                        if (error) {

                            console.error(
                                "FindVia counter acceptance error:",
                                error
                            );

                            alert(
                                "Counter offer accept nahi ho saka.\n\n" +
                                error.message
                            );

                            return;
                        }


                        if (!success) {

                            alert(
                                "Counter offer accept nahi ho saka."
                            );

                            return;
                        }


                        closeFindViaActionModal();


                        alert(
                            "Worker ka offer accept ho gaya! ✅\n\n" +
                            "Ab job confirmation ki ja sakti hai."
                        );


                        await showMyJobs();
                    }
                }
            ]
        );


        return;
    }


    alert(
        "Abhi koi worker price response nahi hai."
    );
}




async function confirmJob(jobId) {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Please login to continue.");
        return;
    }


    const {
        data: job,
        error
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            customer_id,
            customer_offer,
            worker_offer,
            price_status,
            job_status,
            match_status,
            matched_worker_id,
            commission_percent,
            commission_amount,
            commission_locked_at
        `)
        .eq("id", jobId)
        .eq("customer_id", user.id)
        .maybeSingle();


    if (error) {

        console.error(
            "FindVia confirm job load error:",
            error
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            error.message
        );

        return;
    }


    if (!job) {
        alert("Job nahi mili.");
        return;
    }


    if (job.price_status !== "accepted") {

        alert(
            "Pehle price agreement complete karein."
        );

        return;
    }


    if (job.job_status === "confirmed") {

        alert(
            "Ye job already confirmed hai."
        );

        return;
    }


    const agreedPrice =
        Number(
            job.customer_offer
        ) || 0;

showFindViaActionModal(
    "Confirm Job",

    "Job confirm karna hai?\n\n" +
    "Agreed Price: ₹" +
    agreedPrice +
    "\n\n" +
    "Commission category aur matched worker ki commission preference ke according calculate hoga.\n\n" +
    "Final commission job confirm hote hi lock ho jayega.",
    
        [
            {
                text: "Confirm Job",
                icon: "✅",

                action: async function() {

                    const {
                        data: success,
                        error
                    } =
                        await supabaseClient.rpc(
                            "confirm_findvia_job",
                            {
                                p_job_id: jobId
                            }
                        );


                    if (error) {

                        console.error(
                            "FindVia confirm job error:",
                            error
                        );

                        alert(
                            "Job confirm nahi ho saki.\n\n" +
                            error.message
                        );

                        return;
                    }


                    if (!success) {

                        alert(
                            "Job confirm nahi ho saki."
                        );

                        return;
                    }


                    const {
                        data: confirmedJob,
                        error: commissionError
                    } =
                        await supabaseClient
                            .from("jobs")
                            .select(
                                `
                                commission_percent,
                                commission_amount,
                                commission_locked_at
                                `
                            )
                            .eq("id", jobId)
                            .maybeSingle();


                    if (commissionError) {

                        console.error(
                            "FindVia commission load error:",
                            commissionError
                        );

                        closeFindViaActionModal();

                        alert(
                            "Job confirm ho gayi hai, " +
                            "lekin commission details load nahi ho saki.\n\n" +
                            commissionError.message
                        );

                        await showMyJobs();

                        return;
                    }


                    closeFindViaActionModal();


                    const lockedPercent =
                        Number(
                            confirmedJob?.commission_percent
                        ) || 0;

                    const lockedAmount =
                        Number(
                            confirmedJob?.commission_amount
                        ) || 0;


                    alert(
                        "Job successfully confirmed! ✅\n\n" +
                        "Agreed Price: ₹" +
                        agreedPrice +
                        "\n\n" +
                        "Commission Locked: " +
                        lockedPercent +
                        "%\n" +
                        "Commission Amount: ₹" +
                        lockedAmount
                    );


                    await showMyJobs();
                }
            }
        ]
    );
}



async function generateCompletionOTP(jobId) {

    const {
        data: {
            user
        },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please login karein.");
        return;
    }

    const {
        data: job,
        error: jobError
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            customer_id,
            status,
            job_status,
            match_status,
            matched_worker_id
        `)
        .eq("id", jobId)
        .eq("customer_id", user.id)
        .maybeSingle();

    if (jobError) {

        console.error(
            "FindVia OTP job load error:",
            jobError
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            jobError.message
        );

        return;
    }

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    if (
        job.status !== "confirmed" ||
        job.job_status !== "confirmed"
    ) {
        alert(
            "Pehle job confirm honi chahiye."
        );

        return;
    }

    if (
        job.match_status !== "matched" ||
        !job.matched_worker_id
    ) {
        alert(
            "Is job par worker matched nahi hai."
        );

        return;
    }

    const {
        data: otp,
        error: otpError
    } = await supabaseClient.rpc(
        "get_findvia_completion_otp",
        {
            p_job_id: jobId
        }
    );

    if (otpError) {

        console.error(
            "FindVia completion OTP load error:",
            otpError
        );

        alert(
            "Completion OTP nahi mil saka.\n\n" +
            otpError.message
        );

        return;
    }

    if (!otp) {

        alert(
            "Worker ne abhi completion OTP request nahi kiya hai."
        );

        return;
    }

    alert(
        "🔐 Completion OTP\n\n" +
        "OTP: " + otp +
        "\n\n" +
        "Kaam complete hone ke baad ye OTP worker ko batayein."
    );
}



async function verifyCompletionOTP(jobId) {

    const {
        data: {
            user
        },
        error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
        alert("Please login karein.");
        return;
    }

    const {
        data: job,
        error: jobError
    } = await supabaseClient
        .from("jobs")
        .select(`
            id,
            matched_worker_id,
            status,
            job_status
        `)
        .eq("id", jobId)
        .maybeSingle();

    if (jobError) {

        console.error(
            "FindVia completion job load error:",
            jobError
        );

        alert(
            "Job load nahi ho saki.\n\n" +
            jobError.message
        );

        return;
    }

    if (!job) {
        alert("Job nahi mili.");
        return;
    }

    if (job.matched_worker_id !== user.id) {

        alert(
            "Ye job aapke liye available nahi hai."
        );

        return;
    }

    if (
        job.status !== "confirmed" ||
        job.job_status !== "confirmed"
    ) {

        alert(
            "Ye job abhi confirmed nahi hai."
        );

        return;
    }

    /*
     * Worker completion OTP request karta hai.
     * OTP customer ke paas jayega / customer OTP
     * screen se dekh sakta hai.
     */
    const {
        data: requestResult,
        error: requestError
    } = await supabaseClient.rpc(
        "request_findvia_completion_otp",
        {
            p_job_id: jobId
        }
    );

    if (requestError) {

        console.error(
            "FindVia completion OTP request error:",
            requestError
        );

        alert(
            "Completion OTP request nahi ho saki.\n\n" +
            requestError.message
        );

        return;
    }

    if (!requestResult) {

        alert(
            "Completion OTP request nahi ho saki."
        );

        return;
    }

    showFindViaInputModal(
        "Complete Job",
        "Customer se mila 6-digit OTP enter karein:",
        async function(enteredOTP) {

            const otp = String(
                enteredOTP || ""
            ).trim();

            if (!/^\d{6}$/.test(otp)) {

                alert(
                    "❌ Valid 6-digit OTP enter karein."
                );

                return;
            }

            const {
                data: completed,
                error: completeError
            } = await supabaseClient.rpc(
                "complete_findvia_job_with_otp",
                {
                    p_job_id: jobId,
                    p_otp: otp
                }
            );

            if (completeError) {

                console.error(
                    "FindVia job completion error:",
                    completeError
                );

                alert(
                    "❌ Job complete nahi hui.\n\n" +
                    completeError.message
                );

                return;
            }

            if (!completed) {

                alert(
                    "Job complete nahi hui."
                );

                return;
            }

            alert(
                "Job successfully completed! ✅\n\n" +
                "Completion OTP verified.\n" +
                "Commission securely process ho gaya."
            );

            showMyJobs();
        }
    );
}
    
            




    

async function getWorkerCreditsFromSupabase() {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        return 0;
    }


    const {
        data: wallet,
        error
    } = await supabaseClient
        .from("worker_credits")
        .select("balance")
        .eq(
            "worker_id",
            user.id
        )
        .maybeSingle();


    if (error) {

        console.error(
            "FindVia worker credit balance error:",
            error
        );

        return 0;
    }


    if (!wallet) {
        return 0;
    }


    return Number(
        wallet.balance
    ) || 0;
}


async function isFindViaAdmin() {

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        return false;
    }

    const {
        data: adminRecord,
        error
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (error) {
        console.error(
            "Admin authorization check error:",
            error
        );
        return false;
    }

    return !!adminRecord;
}


async function openAdminPanel() {

    const isAdmin =
        await isFindViaAdmin();

    if (!isAdmin) {
        alert(
            "Admin access required. Please login with the authorized admin account."
        );
        openAdminLogin();
        return;
    }

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
        await loadFindViaCommissionPercent();

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


async function adminLogin() {

    const emailInput =
        document.getElementById("adminEmailInput");

    const passwordInput =
        document.getElementById("adminPasswordInput");

    if (!emailInput || !passwordInput) {
        alert("Admin login screen nahi mili.");
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {
        alert("Please email aur password enter karein.");
        return;
    }

    const {
        data,
        error
    } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password
    });

    if (error || !data.user) {
        console.error(
            "Admin login error:",
            error
        );

        alert(
            error?.message ||
            "Admin login failed."
        );

        passwordInput.value = "";
        return;
    }

    const {
        data: adminRecord,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

    if (adminError || !adminRecord) {

        await supabaseClient.auth.signOut();

        alert(
            "Admin access required. This account is not authorized for the Admin Panel."
        );

        passwordInput.value = "";
        return;
    }

    passwordInput.value = "";

    const adminLoginScreen =
        document.getElementById("adminLoginScreen");

    if (adminLoginScreen) {
        adminLoginScreen.style.display = "none";
    }

    await openAdminPanel();
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

    document.getElementById("adminCategoriesScreen").style.display = "none";

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

    const adminVerificationScreen = document.getElementById(
    "adminWorkerVerificationScreen"
);
    const adminRechargeRequestsScreen =
    document.getElementById(
        "adminRechargeRequestsScreen"
    );

        const adminJobsScreen =
        document.getElementById(
            "adminJobsScreen"
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

if (adminVerificationScreen) {
    adminVerificationScreen.style.display = "none";
}
if (adminRechargeRequestsScreen) {
    adminRechargeRequestsScreen.style.display = "none";
}
        if (adminJobsScreen) {
        adminJobsScreen.style.display = "none";
        }
}

async function openAdminJobs() {

    hideAdminScreens();

    document.getElementById(
        "homeContent"
    ).style.display = "none";


    document.getElementById(
        "searchScreen"
    )?.classList.remove("active");

    document.getElementById(
        "findWorkScreen"
    )?.classList.remove("active");

    document.getElementById(
        "findWorkersScreen"
    )?.classList.remove("active");

    document.getElementById(
        "profileScreen"
    )?.classList.remove("active");

    document.getElementById(
        "workerProfileScreen"
    )?.classList.remove("active");

    document.getElementById(
        "postJobScreen"
    )?.classList.remove("active");

    document.getElementById(
        "jobResponsesScreen"
    )?.classList.remove("active");


    const myJobsScreen =
        document.getElementById(
            "myJobsScreen"
        );

    if (myJobsScreen) {
        myJobsScreen.style.display =
            "none";
    }


    const adminJobsScreen =
        document.getElementById(
            "adminJobsScreen"
        );

    if (!adminJobsScreen) {

        alert(
            "Admin Jobs screen nahi mili."
        );

        return;
    }


    adminJobsScreen.style.display =
        "block";


    await loadAdminJobs();


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


async function loadAdminJobs() {

    const jobsList =
        document.getElementById(
            "adminJobsList"
        );

    if (!jobsList) {
        return;
    }


    jobsList.innerHTML = `
        <div class="job-card">
            <p>
                Jobs load ho rahi hain...
            </p>
        </div>
    `;


    const {
        data,
        error
    } = await supabaseClient.rpc(
        "admin_list_findvia_jobs"
    );


    if (error) {

        console.error(
            "FindVia admin jobs load error:",
            error
        );


        jobsList.innerHTML = `
            <div class="job-card">
                <p>
                    Jobs load nahi ho saki.
                </p>
                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>
            </div>
        `;

        return;
    }


    let jobs = data;


    if (typeof jobs === "string") {

        try {
            jobs = JSON.parse(jobs);
        } catch (parseError) {

            console.error(
                "FindVia admin jobs JSON parse error:",
                parseError
            );

            jobs = [];
        }
    }


    if (!Array.isArray(jobs)) {
        jobs = [];
    }


    if (jobs.length === 0) {

        jobsList.innerHTML = `
            <div class="job-card">
                <h3>
                    No Jobs
                </h3>

                <p>
                    Abhi FindVia me koi job nahi hai.
                </p>
            </div>
        `;

        return;
    }


    jobsList.innerHTML = "";


    jobs.forEach(function(job) {

        const title =
            escapeHTML(
                job.title || "Untitled Job"
            );


        const category =
            escapeHTML(
                job.category || "-"
            );


        const area =
            escapeHTML(
                job.area || "-"
            );


        const price =
            Number(
                job.customer_offer ??
                job.worker_offer ??
                0
            ) || 0;


        const commissionPercent =
            Number(
                job.commission_percent
            );


        const commissionAmount =
            Number(
                job.commission_amount
            );


        const safeCommissionPercent =
            Number.isFinite(
                commissionPercent
            )
            ? commissionPercent
            : 0;


        const safeCommissionAmount =
            Number.isFinite(
                commissionAmount
            )
            ? commissionAmount
            : 0;


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
                        ${category}
                    </span>

                    <h3>
                        ${title}
                    </h3>

                </div>

                <span class="job-status">
                    ${
                        escapeHTML(
                            job.job_status ||
                            job.price_status ||
                            "Unknown"
                        )
                    }
                </span>

            </div>


            <p class="job-description">

                📍 ${area}

                <br>

                💰 Agreed Price:
                <strong>
                    ₹${price}
                </strong>

                <br>

                💳 Commission:
                <strong>
                    ${safeCommissionPercent}%
                </strong>

                <br>

                💸 Commission Amount:
                <strong>
                    ₹${safeCommissionAmount}
                </strong>

            </p>


            <div
                style="
                    margin-top:12px;
                    display:flex;
                    gap:8px;
                    flex-wrap:wrap;
                "
            >

                <button
                    class="primary-btn"
                    onclick="
                        adminChangeJobCommission(
                            ${Number(job.id)}
                        )
                    "
                >
                    ⚙️ Change Commission
                </button>

            </div>

        `;


        jobsList.appendChild(card);

    });
}


async function adminChangeJobCommission(
    jobId
) {

    if (!jobId) {

        alert(
            "Job ID nahi mila."
        );

        return;
    }


    const commissionInput =
        prompt(
            "Is job ke liye commission percentage enter karein (0-100):"
        );


    if (
        commissionInput === null
    ) {
        return;
    }


    const commission =
        Number(
            commissionInput
        );


    if (
        !Number.isFinite(
            commission
        ) ||
        commission < 0 ||
        commission > 100
    ) {

        alert(
            "Commission 0 se 100 ke beech hona chahiye."
        );

        return;
    }


    const confirmed =
        confirm(
            "Job #" +
            jobId +
            " ki commission " +
            commission +
            "% set karni hai?"
        );


    if (!confirmed) {
        return;
    }


    const {
        data,
        error
    } = await supabaseClient.rpc(
        "admin_update_findvia_job_commission",
        {
            p_job_id:
                jobId,

            p_commission_percent:
                commission
        }
    );


    if (error) {

        console.error(
            "FindVia admin job commission update error:",
            error
        );


        alert(
            "Commission update nahi ho saki.\n\n" +
            error.message
        );

        return;
    }


    const newAmount =
        Number(data);


    if (
        !Number.isFinite(
            newAmount
        )
    ) {

        alert(
            "Commission update hui, lekin returned amount invalid hai."
        );

        await loadAdminJobs();

        return;
    }


    alert(
        "Job commission successfully updated! ✅\n\n" +
        "New Commission: " +
        commission +
        "%\n" +
        "Commission Amount: ₹" +
        newAmount
    );


    await loadAdminJobs();
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

function hideWorkerRechargeScreen() {

    const rechargeScreen =
        document.getElementById(
            "workerRechargeScreen"
        );

    if (!rechargeScreen) {
        return;
    }

    rechargeScreen.classList.remove(
        "active"
    );

    rechargeScreen.style.display =
        "none";
}

function hideWorkerVerificationScreen() {

    const screen =
        document.getElementById(
            "workerVerificationScreen"
        );

    if (!screen) {
        return;
    }

    screen.classList.remove("active");
    screen.style.display = "none";
}

function openAdminCategories() {
    hideAdminScreens();

    document.getElementById("adminPanelScreen").style.display = "none";
    document.getElementById("adminCategoriesScreen").style.display = "block";

    loadAdminCategories();
}
async function loadAdminCategories() {

    const {
        data,
        error
    } = await supabaseClient
        .from("job_categories")
        .select("*")
        .order("created_at", {
            ascending: true
        });

    if (error) {

        console.error(
            "Failed to load categories:",
            error
        );

        alert(
            "Failed to load job categories.\n\n" +
            error.message
        );

        return;
    }

    const container =
        document.getElementById(
            "adminCategoriesList"
        );

    if (!container) {
        return;
    }

    if (
        !data ||
        data.length === 0
    ) {

        container.innerHTML =
            "<p>No categories found.</p>";

        return;
    }

    container.innerHTML =
        data.map(
            function(category) {

                const safeName =
                    escapeHTML(
                        category.name || "-"
                    );

                const safeNameHi =
                    escapeHTML(
                        category.name_hi || ""
                    );

                const safeIcon =
                    escapeHTML(
                        category.icon || "🛠️"
                    );

                const commissionPercent =
                    Number(
                        category.commission_percent
                    ) || 0;

                const fixedFee =
                    Number(
                        category.commission_fixed_fee
                    ) || 0;

                return `
                    <div class="job-card">

                        <div>

                            <strong>
                                ${safeIcon}
                                ${safeName}
                            </strong>

                            ${
                                safeNameHi
                                    ? `
                                        <div>
                                            ${safeNameHi}
                                        </div>
                                    `
                                    : ""
                            }

                            <small>
                                Percentage:
                                ${
                                    category.allow_percentage
                                        ? "Yes"
                                        : "No"
                                }

                                |

                                Fixed:
                                ${
                                    category.allow_fixed
                                        ? "Yes"
                                        : "No"
                                }
                            </small>

                            <br>

                            <small>
                                Commission:
                                ${commissionPercent}%

                                |

                                Fixed Fee:
                                ₹${fixedFee}
                            </small>

                            <br>

                            <small>
                                Status:
                                ${
                                    category.active
                                        ? "Active"
                                        : "Disabled"
                                }
                            </small>

                        </div>

                        <div
                            style="
                                display:flex;
                                flex-direction:column;
                                gap:8px;
                                margin-top:12px;
                            "
                        >

                            <button
                                class="primary-btn"
                                onclick="adminEditCategory('${category.id}')"
                            >
                                ✏️ Edit
                            </button>

                            <button
                                class="secondary-btn"
                                onclick="adminToggleCategory(
                                    '${category.id}',
                                    ${category.active}
                                )"
                            >
                                ${
                                    category.active
                                        ? "Disable"
                                        : "Enable"
                                }
                            </button>

                        </div>

                    </div>
                `;
            }
        ).join("");
}

async function adminEditCategory(categoryId) {

        const isAdmin =
        await isFindViaAdmin();

    if (!isAdmin) {
        alert("Admin access required.");
        return;
    }

    if (!categoryId) {

        alert(
            "Category ID nahi mila."
        );

        return;
    }

    const {
        data: category,
        error: loadError
    } = await supabaseClient
        .from("job_categories")
        .select(
            "id, name, name_hi, icon, allow_percentage, allow_fixed, commission_percent, commission_fixed_fee, active"
        )
        .eq(
            "id",
            categoryId
        )
        .maybeSingle();

    if (loadError || !category) {

        alert(
            "Category load nahi ho saki." +
            (
                loadError
                    ? "\n\n" +
                      loadError.message
                    : ""
            )
        );

        return;
    }

    const name =
        prompt(
            "Category name:",
            category.name || ""
        );

    if (name === null) {
        return;
    }

    const nameHi =
        prompt(
            "Category Hindi name:",
            category.name_hi || ""
        );

    if (nameHi === null) {
        return;
    }

    const icon =
        prompt(
            "Category icon:",
            category.icon || ""
        );

    if (icon === null) {
        return;
    }

    const commissionPercent =
        prompt(
            "Commission percentage:",
            category.commission_percent ?? 0
        );

    if (commissionPercent === null) {
        return;
    }

    const fixedFee =
        prompt(
            "Fixed commission fee:",
            category.commission_fixed_fee ?? 0
        );

    if (fixedFee === null) {
        return;
    }

    const allowPercentage =
        confirm(
            "Percentage commission allow karna hai?\n\n" +
            "OK = Yes\n" +
            "Cancel = No"
        );

    const allowFixed =
        confirm(
            "Fixed commission allow karna hai?\n\n" +
            "OK = Yes\n" +
            "Cancel = No"
        );

    if (
        !name.trim()
    ) {

        alert(
            "Category name is required."
        );

        return;
    }

    if (
        !allowPercentage &&
        !allowFixed
    ) {

        alert(
            "At least one commission mode must be allowed."
        );

        return;
    }

    const percentageNumber =
        Number(
            commissionPercent
        );

    const fixedFeeNumber =
        Number(
            fixedFee
        );

    if (
        !Number.isFinite(
            percentageNumber
        ) ||
        percentageNumber < 0 ||
        percentageNumber > 100
    ) {

        alert(
            "Commission percentage must be between 0 and 100."
        );

        return;
    }

    if (
        !Number.isFinite(
            fixedFeeNumber
        ) ||
        fixedFeeNumber < 0
    ) {

        alert(
            "Fixed commission fee invalid hai."
        );

        return;
    }

    const {
        error: updateError
    } = await supabaseClient
        .from("job_categories")
        .update({
            name:
                name.trim(),

            name_hi:
                nameHi.trim(),

            icon:
                icon.trim(),

            allow_percentage:
                allowPercentage,

            allow_fixed:
                allowFixed,

            commission_percent:
                percentageNumber,

            commission_fixed_fee:
                fixedFeeNumber,

            updated_at:
                new Date().toISOString()
        })
        .eq(
            "id",
            categoryId
        );

    if (updateError) {

        console.error(
            "Failed to update category:",
            updateError
        );

        alert(
            "Category update nahi ho saki.\n\n" +
            updateError.message
        );

        return;
    }

    alert(
        "Category updated successfully."
    );

    await loadAdminCategories();
}

async function adminAddCategory() {

        const isAdmin =
        await isFindViaAdmin();

    if (!isAdmin) {
        alert("Admin access required.");
        return;
    }
    const name =
        document.getElementById(
            "adminCategoryName"
        ).value.trim();

    const nameHi =
        document.getElementById(
            "adminCategoryNameHi"
        ).value.trim();

    const icon =
        document.getElementById(
            "adminCategoryIcon"
        ).value.trim();

    const commissionPercent =
        Number(
            document.getElementById(
                "adminCategoryCommissionPercent"
            ).value || 0
        );

    const fixedFee =
        Number(
            document.getElementById(
                "adminCategoryFixedFee"
            ).value || 0
        );

    const allowPercentage =
        document.getElementById(
            "adminCategoryAllowPercentage"
        ).checked;

    const allowFixed =
        document.getElementById(
            "adminCategoryAllowFixed"
        ).checked;

    if (!name) {
        alert("Category name is required.");
        return;
    }

    if (
    !Number.isFinite(
        commissionPercent
    ) ||
    commissionPercent < 0 ||
    commissionPercent > 100
) {

    alert(
        "Commission percentage must be between 0 and 100."
    );

    return;
}

if (
    !Number.isFinite(
        fixedFee
    ) ||
    fixedFee < 0
) {

    alert(
        "Fixed commission fee invalid hai."
    );

    return;
}

    if (
        !allowPercentage &&
        !allowFixed
    ) {
        alert(
            "At least one commission mode must be allowed."
        );

        return;
    }

    const {
        error
    } = await supabaseClient
        .from("job_categories")
        .insert({
            name: name,
            name_hi: nameHi,
            icon: icon,
            active: true,
            allow_percentage: allowPercentage,
            allow_fixed: allowFixed,
            commission_percent: commissionPercent,
            commission_fixed_fee: fixedFee
        });

    if (error) {
        console.error(
            "Failed to add category:",
            error
        );

        alert(
            "Failed to add category."
        );

        return;
    }

    alert("Category added successfully.");

    document.getElementById(
        "adminCategoryName"
    ).value = "";

    document.getElementById(
        "adminCategoryNameHi"
    ).value = "";

    document.getElementById(
        "adminCategoryIcon"
    ).value = "";

    document.getElementById(
        "adminCategoryCommissionPercent"
    ).value = "";

    document.getElementById(
        "adminCategoryFixedFee"
    ).value = "";

    loadAdminCategories();
}

async function adminToggleCategory(
    categoryId,
    currentStatus
) {

    const isAdmin =
        await isFindViaAdmin();

    if (!isAdmin) {
        alert(
            "Admin access required."
        );
        return;
    }

    const {
        error
    } = await supabaseClient
        .from("job_categories")
        .update({
            active: !currentStatus,
            updated_at: new Date().toISOString()
        })
        .eq("id", categoryId);

    if (error) {

        console.error(
            "Failed to update category:",
            error
        );

        alert(
            "Category update failed.\n\n" +
            error.message
        );

        return;
    }

    await loadAdminCategories();
}

async function openAdminRechargeRequests() {

    hideAdminScreens();

    const rechargeScreen =
        document.getElementById(
            "adminRechargeRequestsScreen"
        );

    const rechargeList =
        document.getElementById(
            "adminRechargeRequestsList"
        );


    if (
        !rechargeScreen ||
        !rechargeList
    ) {

        alert(
            "Recharge requests screen not found."
        );

        return;
    }


    rechargeScreen.style.display =
        "block";


    rechargeList.innerHTML = `
        <div class="job-card">
            <h3>Loading recharge requests...</h3>
            <p class="job-description">
                Please wait.
            </p>
        </div>
    `;


    /*
     * Make sure the current user
     * is an authorized FindVia admin.
     */

    const user =
        await getFindViaCurrentUser();


    if (!user) {

        alert(
            "Please login to continue."
        );

        return;
    }


    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();


    if (adminError) {

        console.error(
            "FindVia admin check error:",
            adminError
        );

        rechargeList.innerHTML = `
            <div class="job-card">
                <h3>Unable to verify admin access</h3>
                <p class="job-description">
                    Please try again.
                </p>
            </div>
        `;

        return;
    }


    if (!adminUser) {

        alert(
            "Admin access required."
        );

        return;
    }


    /*
     * Load recharge requests from Supabase.
     */

    const {
        data: requests,
        error: requestsError
    } = await supabaseClient
        .from("recharge_requests")
        .select(
            "id, worker_id, amount, utr_number, status, admin_note, created_at, reviewed_at"
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (requestsError) {

        console.error(
            "FindVia recharge requests load error:",
            requestsError
        );

        rechargeList.innerHTML = `
            <div class="job-card">
                <h3>Could not load recharge requests</h3>
                <p class="job-description">
                    ${requestsError.message}
                </p>
            </div>
        `;

        return;
    }


    if (
        !requests ||
        requests.length === 0
    ) {

        rechargeList.innerHTML = `
            <div class="job-card">

                <h3>
                    No recharge requests
                </h3>

                <p class="job-description">
                    There are no worker recharge requests yet.
                </p>

            </div>
        `;


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        return;
    }


    /*
     * Load worker names separately because
     * recharge_requests.worker_id points to auth.users.
     */

    const workerIds = [
        ...new Set(
            requests
                .map(
                    function(request) {
                        return request.worker_id;
                    }
                )
                .filter(Boolean)
        )
    ];


    let workerMap = {};


    if (workerIds.length > 0) {

        const {
            data: workers,
            error: workersError
        } = await supabaseClient
            .from("worker_profiles")
            .select(
                "id, name, service, area"
            )
            .in(
                "id",
                workerIds
            );


        if (workersError) {

            console.error(
                "FindVia worker profile load error:",
                workersError
            );

        } else {

            (workers || [])
                .forEach(
                    function(worker) {

                        workerMap[
                            worker.id
                        ] = worker;

                    }
                );

        }
    }


    rechargeList.innerHTML = "";


    requests.forEach(
        function(request) {

            const worker =
                workerMap[
                    request.worker_id
                ] || null;


            const workerName =
                worker &&
                worker.name
                    ? worker.name
                    : "Worker";


            const workerService =
                worker &&
                worker.service
                    ? worker.service
                    : "-";


            const workerArea =
                worker &&
                worker.area
                    ? worker.area
                    : "-";


            const amount =
                Number(
                    request.amount
                ) || 0;


            const submittedDate =
                request.created_at
                    ? new Date(
                        request.created_at
                    ).toLocaleString()
                    : "Date unavailable";


            const reviewedDate =
                request.reviewed_at
                    ? new Date(
                        request.reviewed_at
                    ).toLocaleString()
                    : "-";


            let statusText =
                "Pending";


            if (
                request.status ===
                "approved"
            ) {

                statusText =
                    "Approved";

            } else if (
                request.status ===
                "rejected"
            ) {

                statusText =
                    "Rejected";
            }


            const safeWorkerName =
                String(workerName)
                    .replace(
                        /[&<>"']/g,
                        function(character) {

                            return {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#039;"
                            }[character];

                        }
                    );


            const safeService =
                String(workerService)
                    .replace(
                        /[&<>"']/g,
                        function(character) {

                            return {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#039;"
                            }[character];

                        }
                    );


            const safeArea =
                String(workerArea)
                    .replace(
                        /[&<>"']/g,
                        function(character) {

                            return {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#039;"
                            }[character];

                        }
                    );


            const safeUtr =
                String(
                    request.utr_number || "-"
                )
                    .replace(
                        /[&<>"']/g,
                        function(character) {

                            return {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#039;"
                            }[character];

                        }
                    );


            const safeNote =
                String(
                    request.admin_note || ""
                )
                    .replace(
                        /[&<>"']/g,
                        function(character) {

                            return {
                                "&": "&amp;",
                                "<": "&lt;",
                                ">": "&gt;",
                                '"': "&quot;",
                                "'": "&#039;"
                            }[character];

                        }
                    );


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
                            RECHARGE REQUEST
                        </span>

                        <h3>
                            ${safeWorkerName}
                        </h3>

                    </div>

                    <span class="job-status">
                        ${statusText}
                    </span>

                </div>


                <p class="job-description">

                    🔧 Service:
                    <strong>
                        ${safeService}
                    </strong>

                    <br>

                    📍 Area:
                    <strong>
                        ${safeArea}
                    </strong>

                    <br>

                    💰 Amount:
                    <strong>
                        ₹${amount}
                    </strong>

                    <br>

                    🧾 Transaction ID / UTR:
                    <strong>
                        ${safeUtr}
                    </strong>

                    <br>

                    📅 Submitted:
                    <strong>
                        ${submittedDate}
                    </strong>

                    <br>

                    🕒 Reviewed:
                    <strong>
                        ${reviewedDate}
                    </strong>

                </p>


                ${
                    safeNote
                    ? `
                        <p
                            class="job-description"
                            style="
                                margin-top:10px;
                                padding:10px;
                                background:#f5f5f5;
                                border-radius:10px;
                            "
                        >
                            📝 Admin Note:
                            <strong>
                                ${safeNote}
                            </strong>
                        </p>
                    `
                    : ""
                }


                ${
                    request.status ===
                    "pending"
                    ? `

                        <button
                            class="primary-btn"
                            style="margin-top:12px;"
                            onclick="approveWorkerRecharge(${request.id})"
                        >
                            Approve & Add Credits
                        </button>


                        <button
                            class="primary-btn"
                            style="margin-top:8px;"
                            onclick="rejectWorkerRecharge(${request.id})"
                        >
                            Reject Request
                        </button>

                    `
                    : `

                        <div
                            style="
                                margin-top:12px;
                                padding:10px;
                                border-radius:10px;
                                background:#f5f5f5;
                                text-align:center;
                                font-weight:600;
                            "
                        >
                            Request processed
                        </div>

                    `
                }

            `;


            rechargeList.appendChild(
                card
            );

        }
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


async function approveWorkerRecharge(requestId) {

    const user =
        await getFindViaCurrentUser();


    if (!user) {

        alert(
            "Please login to continue."
        );

        return;
    }


    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();


    if (adminError) {

        console.error(
            "FindVia admin check error:",
            adminError
        );

        alert(
            "Could not verify admin access."
        );

        return;
    }


    if (!adminUser) {

        alert(
            "Admin access required."
        );

        return;
    }


    const requestIdNumber =
        Number(requestId);


    if (
        !Number.isInteger(
            requestIdNumber
        ) ||
        requestIdNumber <= 0
    ) {

        alert(
            "Invalid recharge request."
        );

        return;
    }


    const adminNote =
        prompt(
            "Optional admin note:",
            "Recharge approved."
        );


    if (
        adminNote === null
    ) {

        return;
    }


    const {
        error: approveError
    } = await supabaseClient
        .rpc(
            "approve_recharge_request",
            {
                p_request_id:
                    requestIdNumber,

                p_admin_note:
                    adminNote.trim() ||
                    null
            }
        );


    if (approveError) {

        console.error(
            "FindVia recharge approval error:",
            approveError
        );


        alert(
            approveError.message ||
            "Recharge approval failed."
        );

        return;
    }


    alert(
        "Recharge approved successfully."
    );


    await openAdminRechargeRequests();

}
        

async function rejectWorkerRecharge(requestId) {

    const user =
        await getFindViaCurrentUser();


    if (!user) {

        alert(
            "Please login to continue."
        );

        return;
    }


    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();


    if (adminError) {

        console.error(
            "FindVia admin check error:",
            adminError
        );

        alert(
            "Could not verify admin access."
        );

        return;
    }


    if (!adminUser) {

        alert(
            "Admin access required."
        );

        return;
    }


    const requestIdNumber =
        Number(requestId);


    if (
        !Number.isInteger(
            requestIdNumber
        ) ||
        requestIdNumber <= 0
    ) {

        alert(
            "Invalid recharge request."
        );

        return;
    }


    const adminNote =
        prompt(
            "Reason for rejection:",
            "Payment could not be verified."
        );


    if (
        adminNote === null
    ) {

        return;
    }


    const {
        error: rejectError
    } = await supabaseClient
        .rpc(
            "reject_recharge_request",
            {
                p_request_id:
                    requestIdNumber,

                p_admin_note:
                    adminNote.trim() ||
                    null
            }
        );


    if (rejectError) {

        console.error(
            "FindVia recharge rejection error:",
            rejectError
        );


        alert(
            rejectError.message ||
            "Recharge rejection failed."
        );

        return;
    }


    alert(
        "Recharge request rejected."
    );


    await openAdminRechargeRequests();

}


async function openAdminWorkers() {

    hideAdminScreens();

    const workersScreen =
        document.getElementById("adminWorkersScreen");

    const workersList =
        document.getElementById("adminWorkersList");

    if (!workersScreen || !workersList) {
        alert("Worker management screen not found.");
        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Admin login required.");
        openAuthScreen();
        return;
    }

    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (adminError || !adminUser) {
        console.error(
            "Admin access check error:",
            adminError
        );

        alert("Admin access required.");
        return;
    }

    workersScreen.style.display = "block";

    workersList.innerHTML = `
        <div class="job-card">
            <h3>Loading workers...</h3>
            <p class="job-description">
                Please wait.
            </p>
        </div>
    `;

    const {
        data: workers,
        error: workersError
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "id, name, service, experience, area, availability, verification_status, verification_submitted"
        )
        .order("created_at", {
            ascending: true
        });

    if (workersError) {
        console.error(
            "Admin worker load error:",
            workersError
        );

        workersList.innerHTML = `
            <div class="job-card">
                <h3>Workers load nahi ho sake</h3>
                <p class="job-description">
                    ${escapeHTML(workersError.message)}
                </p>
            </div>
        `;

        return;
    }

    if (!workers || workers.length === 0) {
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

    const workerIds =
        workers.map(function(worker) {
            return worker.id;
        });

    const {
        data: wallets,
        error: walletError
    } = await supabaseClient
        .from("worker_credits")
        .select("worker_id, balance")
        .in("worker_id", workerIds);

    if (walletError) {
        console.error(
            "Admin worker credits load error:",
            walletError
        );
    }

    const walletMap = {};

    (wallets || []).forEach(function(wallet) {

        walletMap[wallet.worker_id] =
            Number(wallet.balance) || 0;

    });

    workersList.innerHTML = "";

    workers.forEach(function(worker, index) {

        const status =
            worker.verification_status || "pending";

        const statusText =
            status === "approved"
                ? "Approved"
                : status === "rejected"
                ? "Rejected"
                : "Pending";

        const credits =
            walletMap[worker.id] || 0;

        const card =
            document.createElement("div");

        card.className = "job-card";

        card.innerHTML = `
            <div class="job-card-top">

                <div>

                    <span class="job-category">
                        WORKER #${index + 1}
                    </span>

                    <h3>
                        ${escapeHTML(
                            worker.name || "-"
                        )}
                    </h3>

                </div>

                <span class="job-status">
                    ${statusText}
                </span>

            </div>

            <p class="job-description">
                🔧 ${escapeHTML(
                    worker.service || "-"
                )}<br>

                📍 ${escapeHTML(
                    worker.area || "-"
                )}<br>

                ⭐ ${escapeHTML(
                    worker.experience || "-"
                )} experience
            </p>

            <div style="
                margin-top:12px;
                padding:12px;
                border-radius:10px;
                background:#f5f5f5;
            ">

                💰 <strong>FindVia Credits</strong><br>

                <span style="
                    font-size:20px;
                    font-weight:bold;
                ">
                    ₹${credits}
                </span>

            </div>

            <button
                class="primary-btn"
                style="margin-top:12px;"
                onclick="adminAddWorkerCreditsFromList('${worker.id}')"
            >
                ➕ Add Credits
            </button>

            <button
                class="primary-btn"
                style="margin-top:8px;"
                onclick="openWorkerTransactionsById('${worker.id}')"
            >
                📋 Transaction History
            </button>

            <button
                class="primary-btn"
                style="margin-top:8px;"
                onclick="openWorkerVerificationReview('${worker.id}')"
            >
                🔍 View Verification
            </button>

            ${
                status !== "approved"

                ? `
                    <button
                        class="primary-btn"
                        style="margin-top:8px;"
                        onclick="approveWorker('${worker.id}')"
                    >
                        ✅ Approve Worker
                    </button>
                `

                : `

                    <button
                        class="primary-btn"
                        style="margin-top:8px;"
                        onclick="rejectWorker('${worker.id}')"
                    >
                        ❌ Reject Worker
                    </button>

                `
            }

        `;

        workersList.appendChild(card);

    });
}


async function adminAddWorkerCreditsFromList(workerId) {

    if (!workerId) {
        alert("Worker account ID nahi mila.");
        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {
        alert("Admin login required.");
        openAuthScreen();
        return;
    }

    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (adminError || !adminUser) {
        alert("Admin access required.");
        return;
    }

    const {
        data: worker,
        error: workerError
    } = await supabaseClient
        .from("worker_profiles")
        .select("id, name")
        .eq("id", workerId)
        .maybeSingle();

    if (workerError || !worker) {

        alert(
            "Worker profile nahi mili." +
            (
                workerError
                    ? "\n\n" + workerError.message
                    : ""
            )
        );

        return;
    }

    const amount =
        prompt(
            `Worker: ${worker.name || "-"}\n\nKitne credits add karne hain?`
        );

    if (amount === null) {
        return;
    }

    const creditAmount =
        Number(amount);

    if (
        !Number.isFinite(creditAmount) ||
        creditAmount <= 0
    ) {

        alert(
            "Please enter a valid amount."
        );

        return;
    }

    const {
        data: wallet,
        error: walletError
    } = await supabaseClient
        .from("worker_credits")
        .select("id, balance")
        .eq("worker_id", workerId)
        .maybeSingle();

    if (walletError) {

        alert(
            "Worker credits load nahi ho sake.\n\n" +
            walletError.message
        );

        return;
    }

    const currentBalance =
        Number(wallet?.balance) || 0;

    let updateError = null;

    if (wallet) {

        const result =
            await supabaseClient
                .from("worker_credits")
                .update({
                    balance:
                        currentBalance +
                        creditAmount,

                    updated_at:
                        new Date().toISOString()
                })
                .eq(
                    "worker_id",
                    workerId
                );

        updateError =
            result.error;

    } else {

        const result =
            await supabaseClient
                .from("worker_credits")
                .insert({
                    worker_id:
                        workerId,

                    balance:
                        creditAmount
                });

        updateError =
            result.error;
    }

    if (updateError) {

        console.error(
            "Admin credit update error:",
            updateError
        );

        alert(
            "Credits add nahi ho sake.\n\n" +
            updateError.message
        );

        return;
    }

    const {
        error: transactionError
    } = await supabaseClient
        .from("credit_transactions")
        .insert({
            worker_id:
                workerId,

            amount:
                creditAmount,

            transaction_type:
                "admin_credit",

            note:
                "Admin manually added credits"
        });

    if (transactionError) {

        console.error(
            "Admin credit transaction error:",
            transactionError
        );

        alert(
            "Credits add ho gaye, lekin transaction ledger entry save nahi ho saki.\n\n" +
            transactionError.message
        );

        await openAdminWorkers();

        return;
    }

    alert(
        `₹${creditAmount} credits added successfully to ${
            worker.name || "worker"
        }.`
    );

    await openAdminWorkers();
}

async function openWorkerTransactionsById(workerId) {

    if (!workerId) {

        alert(
            "Worker account ID nahi mila."
        );

        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Admin login required."
        );

        openAuthScreen();

        return;
    }

    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (
        adminError ||
        !adminUser
    ) {

        alert(
            "Admin access required."
        );

        return;
    }

    const {
        data: worker,
        error: workerError
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "id, name, service"
        )
        .eq("id", workerId)
        .maybeSingle();

    if (workerError || !worker) {

        alert(
            "Worker profile nahi mili." +
            (
                workerError
                    ? "\n\n" +
                      workerError.message
                    : ""
            )
        );

        return;
    }

    const {
        data: transactions,
        error: transactionError
    } = await supabaseClient
        .from("credit_transactions")
        .select(
            "id, amount, transaction_type, note, created_at"
        )
        .eq(
            "worker_id",
            workerId
        )
        .order(
            "created_at",
            {
                ascending: true
            }
        );

    if (transactionError) {

        console.error(
            "Worker transaction load error:",
            transactionError
        );

        alert(
            "Transaction history load nahi ho saki.\n\n" +
            transactionError.message
        );

        return;
    }

    const transactionScreen =
        document.getElementById(
            "adminWorkerTransactionsScreen"
        );

    const transactionList =
        document.getElementById(
            "adminWorkerTransactionsList"
        );

    const workerName =
        document.getElementById(
            "adminTransactionWorkerName"
        );

    if (
        !transactionScreen ||
        !transactionList ||
        !workerName
    ) {

        alert(
            "Transaction screen not found."
        );

        return;
    }

    hideAdminScreens();

    transactionScreen.style.display =
        "block";

    workerName.textContent =
        (worker.name || "-") +
        " • Transaction History";

    if (
        !transactions ||
        transactions.length === 0
    ) {

        transactionList.innerHTML = `
            <div class="job-card">

                <h3>
                    No transactions yet
                </h3>

                <p class="job-description">
                    Is worker ke liye abhi koi
                    credit transaction nahi hai.
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

    transactions.forEach(
        function(transaction) {

            const amount =
                Number(
                    transaction.amount
                ) || 0;

            runningBalance += amount;

            const isDebit =
                amount < 0;

            const displayAmount =
                Math.abs(amount);

            const transactionDate =
                transaction.created_at
                    ? new Date(
                        transaction.created_at
                    ).toLocaleString()
                    : "Date unavailable";

            const transactionType =
                transaction.transaction_type ||
                "Credit Transaction";

            const note =
                transaction.note || "";

            const safeType =
                escapeHTML(
                    String(
                        transactionType
                    )
                );

            const safeNote =
                escapeHTML(
                    String(
                        note
                    )
                );

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
                            ${safeType}
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

                    📅 ${transactionDate}

                    <br>

                    💳 Running Balance:
                    <strong>
                        ₹${runningBalance}
                    </strong>

                    ${
                        safeNote
                            ? `
                                <br>
                                📝 ${safeNote}
                            `
                            : ""
                    }

                </p>
            `;

            transactionList.appendChild(
                card
            );

        }
    );

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
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

async function openWorkerVerificationReview(workerId) {

    if (!workerId) {

    alert(
        "Worker account ID nahi mila."
    );

    return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Admin login required."
        );

        openAuthScreen();

        return;
    }

    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (
        adminError ||
        !adminUser
    ) {

        alert(
            "Admin access required."
        );

        return;
    }

    const {
        data: worker,
        error: workerError
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "id, name, service, experience, area, availability, verification_status, verification_submitted, verification_submitted_at, government_id_file, selfie_file, skill_proof_file"
        )
        .eq("id", workerId)
        .maybeSingle();

    if (workerError) {

        console.error(
            "Worker verification load error:",
            workerError
        );

        alert(
            "Worker verification data load nahi ho saki.\n\n" +
            workerError.message
        );

        return;
    }

    if (!worker) {

        alert(
            "Worker profile Supabase mein nahi mili."
        );

        return;
    }

    const verificationScreen =
        document.getElementById(
            "adminWorkerVerificationScreen"
        );

    const detailsBox =
        document.getElementById(
            "adminWorkerVerificationDetails"
        );

    const workerName =
        document.getElementById(
            "adminVerificationWorkerName"
        );

    if (
        !verificationScreen ||
        !detailsBox ||
        !workerName
    ) {

        alert(
            "Verification screen nahi mili."
        );

        return;
    }

    hideAdminScreens();

    verificationScreen.style.display =
        "block";

    workerName.textContent =
        (worker.name || "-") +
        " • Verification";

    const status =
        worker.verification_status ||
        "pending";

    const statusText =
        status === "approved"
            ? "Approved"
            : status === "rejected"
            ? "Rejected"
            : "Pending";

    const submittedAt =
        worker.verification_submitted_at
            ? new Date(
                worker.verification_submitted_at
            ).toLocaleString()
            : "Not submitted";

    let governmentIdUrl = null;
    let selfieUrl = null;
    let skillProofUrl = null;

    if (worker.government_id_file) {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(
                    "worker-verification"
                )
                .createSignedUrl(
                    worker.government_id_file,
                    3600
                );

        if (error) {

            console.error(
                "Government ID signed URL error:",
                error
            );

        } else if (data) {

            governmentIdUrl =
                data.signedUrl;

        }
    }

    if (worker.selfie_file) {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(
                    "worker-verification"
                )
                .createSignedUrl(
                    worker.selfie_file,
                    3600
                );

        if (error) {

            console.error(
                "Selfie signed URL error:",
                error
            );

        } else if (data) {

            selfieUrl =
                data.signedUrl;

        }
    }

    if (worker.skill_proof_file) {

        const {
            data,
            error
        } =
            await supabaseClient.storage
                .from(
                    "worker-verification"
                )
                .createSignedUrl(
                    worker.skill_proof_file,
                    3600
                );

        if (error) {

            console.error(
                "Skill proof signed URL error:",
                error
            );

        } else if (data) {

            skillProofUrl =
                data.signedUrl;

        }
    }

    function documentPreview(
        label,
        icon,
        filePath,
        signedUrl
    ) {

        if (!filePath) {

            return `
                <div
                    style="
                        margin-top:10px;
                        padding:12px;
                        border-radius:10px;
                        background:#f5f5f5;
                    "
                >
                    <strong>
                        ${icon} ${label}
                    </strong>

                    <br>

                    <span>
                        Not submitted
                    </span>
                </div>
            `;
        }

        if (!signedUrl) {

            return `
                <div
                    style="
                        margin-top:10px;
                        padding:12px;
                        border-radius:10px;
                        background:#f5f5f5;
                    "
                >
                    <strong>
                        ${icon} ${label}
                    </strong>

                    <br>

                    <span>
                        File uploaded, but secure preview
                        could not be generated.
                    </span>
                </div>
            `;
        }

        const lowerPath =
            filePath.toLowerCase();

        const isImage =
            lowerPath.endsWith(".jpg") ||
            lowerPath.endsWith(".jpeg") ||
            lowerPath.endsWith(".png") ||
            lowerPath.endsWith(".webp") ||
            lowerPath.endsWith(".gif");

        if (isImage) {

            return `
                <div
                    style="
                        margin-top:10px;
                        padding:12px;
                        border-radius:10px;
                        background:#f5f5f5;
                    "
                >
                    <strong>
                        ${icon} ${label}
                    </strong>

                    <div style="margin-top:10px;">
                        <img
                            src="${signedUrl}"
                            alt="${label}"
                            style="
                                width:100%;
                                max-width:420px;
                                max-height:420px;
                                object-fit:contain;
                                border-radius:10px;
                                border:1px solid #ddd;
                                background:#fff;
                            "
                        >
                    </div>

                    <a
                        href="${signedUrl}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="primary-btn"
                        style="
                            display:inline-block;
                            margin-top:10px;
                            text-decoration:none;
                        "
                    >
                        🔗 Open Full File
                    </a>
                </div>
            `;
        }

        return `
            <div
                style="
                    margin-top:10px;
                    padding:12px;
                    border-radius:10px;
                    background:#f5f5f5;
                "
            >
                <strong>
                    ${icon} ${label}
                </strong>

                <br>

                <a
                    href="${signedUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="primary-btn"
                    style="
                        display:inline-block;
                        margin-top:10px;
                        text-decoration:none;
                    "
                >
                    📄 Open Document
                </a>
            </div>
        `;
    }

    detailsBox.innerHTML = `

        <div class="job-card">

            <div class="job-card-top">

                <div>

                    <span class="job-category">
                        WORKER VERIFICATION
                    </span>

                    <h3>
                        ${worker.name || "-"}
                    </h3>

                </div>

                <span class="job-status">
                    ${statusText}
                </span>

            </div>

            <p class="job-description">

                🔧 Service:
                <strong>
                    ${worker.service || "-"}
                </strong>

                <br>

                📍 Area:
                <strong>
                    ${worker.area || "-"}
                </strong>

                <br>

                ⭐ Experience:
                <strong>
                    ${worker.experience || "-"}
                </strong>

                <br>

                🟢 Availability:
                <strong>
                    ${worker.availability || "-"}
                </strong>

                <br>

                📅 Submitted:
                <strong>
                    ${submittedAt}
                </strong>

            </p>

        </div>


        <div class="job-card">

            <h3>
                Verification Documents
            </h3>

            ${documentPreview(
                "Government ID",
                "📄",
                worker.government_id_file,
                governmentIdUrl
            )}

            ${documentPreview(
                "Recent Photo / Selfie",
                "📷",
                worker.selfie_file,
                selfieUrl
            )}

            ${documentPreview(
                "Skill / Experience Proof",
                "📄",
                worker.skill_proof_file,
                skillProofUrl
            )}

            ${
                status !== "approved"
                ? `
                    <button
                        class="primary-btn"
                        style="margin-top:14px;"
                        onclick="approveWorkerFromVerification(${index})"
                    >
                        ✅ Approve Worker
                    </button>
                `
                : ""
            }

            ${
                status !== "rejected"
                ? `
                    <button
                        class="primary-btn"
                        style="margin-top:8px;"
                        onclick="rejectWorkerFromVerification(${index})"
                    >
                        ❌ Reject Worker
                    </button>
                `
                : ""
            }

        </div>

    `;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function approveWorkerFromVerification(index) {

    approveWorker(index);

}

function rejectWorkerFromVerification(index) {

    rejectWorker(index);

}

function openWorkerRecharge() {

    hideAdminScreens();
    hideWorkerTransactionScreen();
    hideWorkerVerificationScreen();


    const profileScreen =
        document.getElementById(
            "profileScreen"
        );

    const rechargeScreen =
        document.getElementById(
            "workerRechargeScreen"
        );


    if (!rechargeScreen) {

        alert(
            "Recharge screen nahi mili."
        );

        return;
    }


    if (profileScreen) {

        profileScreen.classList.remove(
            "active"
        );

    }


    rechargeScreen.style.display =
        "block";


    rechargeScreen.classList.add(
        "active"
    );


    const amountInput =
        document.getElementById(
            "rechargeAmount"
        );

    const transactionInput =
        document.getElementById(
            "rechargeTransactionId"
        );


    if (amountInput) {
        amountInput.value = "";
    }


    if (transactionInput) {
        transactionInput.value = "";
    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}



async function submitWorkerRechargeRequest() {

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Please login to continue."
        );

        return;
    }


    const amountInput =
        document.getElementById(
            "rechargeAmount"
        );

    const transactionInput =
        document.getElementById(
            "rechargeTransactionId"
        );


    if (
        !amountInput ||
        !transactionInput
    ) {

        alert(
            t("Recharge form could not be found.")
        );

        return;
    }


    const amount =
        Number(
            amountInput.value
        );


    const transactionId =
        transactionInput.value.trim();


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            t("Please enter a valid payment amount.")
        );

        return;
    }


    if (!transactionId) {

        alert(
            t(
                "Please enter the payment transaction ID / UTR."
            )
        );

        return;
    }


    /*
     * Confirm that the logged-in user
     * has a worker profile in Supabase.
     */

    const {
        data: workerProfile,
        error: profileError
    } = await supabaseClient
        .from("worker_profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();


    if (profileError) {

        console.error(
            "FindVia worker profile check error:",
            profileError
        );

        alert(
            "Worker profile check failed. Please try again."
        );

        return;
    }


    if (!workerProfile) {

        alert(
            t(
                "Please set up your worker profile first."
            )
        );

        return;
    }


    /*
     * Prevent duplicate pending request
     * for the same UTR / transaction ID.
     */

    const {
        data: existingRequest,
        error: existingRequestError
    } = await supabaseClient
        .from("recharge_requests")
        .select("id")
        .eq("worker_id", user.id)
        .eq("utr_number", transactionId)
        .eq("status", "pending")
        .maybeSingle();


    if (existingRequestError) {

        console.error(
            "FindVia recharge duplicate check error:",
            existingRequestError
        );

        alert(
            "Could not verify your previous recharge requests. Please try again."
        );

        return;
    }


    if (existingRequest) {

        alert(
            t(
                "This payment is already pending verification."
            )
        );

        return;
    }


    /*
     * Create the recharge request in Supabase.
     */

    const {
        error: insertError
    } = await supabaseClient
        .from("recharge_requests")
        .insert([
            {
                worker_id: user.id,
                amount: amount,
                utr_number: transactionId,
                status: "pending"
            }
        ]);


    if (insertError) {

        console.error(
            "FindVia recharge request insert error:",
            insertError
        );

        alert(
            "Recharge request submit nahi ho saki. Please try again."
        );

        return;
    }


    amountInput.value = "";

    transactionInput.value = "";


    alert(
        t(
            "Recharge request submitted successfully."
        ) +
        "\n\n" +
        t(
            "Your payment will be verified by FindVia admin."
        )
    );


    showProfile();

}

  async function openWorkerTransactionHistory() {

    hideAdminScreens();

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Please login to continue."
        );

        return;
    }


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


    transactionList.innerHTML = `
        <div class="job-card">

            <h3>
                Loading transactions...
            </h3>

            <p class="job-description">
                Please wait.
            </p>

        </div>
    `;


    /*
     * Load worker credit transactions
     * directly from Supabase.
     */

    const {
        data: transactions,
        error: transactionError
    } = await supabaseClient
        .from("credit_transactions")
        .select(
            "id, worker_id, amount, transaction_type, note, created_at"
        )
        .eq(
            "worker_id",
            user.id
        )
        .order(
            "created_at",
            {
                ascending: false
            }
        );


    if (transactionError) {

        console.error(
            "FindVia transaction history error:",
            transactionError
        );


        transactionList.innerHTML = `
            <div class="job-card">

                <h3>
                    Transaction history load nahi ho saki
                </h3>

                <p class="job-description">
                    ${transactionError.message}
                </p>

            </div>
        `;

        return;
    }


    transactionList.innerHTML = "";


    if (
        !transactions ||
        transactions.length === 0
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


    /*
     * Current worker_credits balance.
     * This is the authoritative current balance.
     */

    const {
        data: creditWallet,
        error: creditError
    } = await supabaseClient
        .from("worker_credits")
        .select(
            "balance"
        )
        .eq(
            "worker_id",
            user.id
        )
        .maybeSingle();


    if (creditError) {

        console.error(
            "FindVia worker credit balance error:",
            creditError
        );

    }


    const currentBalance =
        creditWallet
            ? Number(
                creditWallet.balance
            ) || 0
            : 0;


    transactions.forEach(
        function(transaction) {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            const isDebit =
                amount < 0;


            const displayAmount =
                Math.abs(amount);


            const transactionDate =
                transaction.created_at
                    ? new Date(
                        transaction.created_at
                    ).toLocaleString()
                    : "Date unavailable";


            const transactionType =
                transaction.transaction_type ||
                "Credit Transaction";


            const note =
                transaction.note ||
                "";


            const safeType =
                String(
                    transactionType
                ).replace(
                    /[&<>"']/g,
                    function(character) {

                        return {
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#039;"
                        }[character];

                    }
                );


            const safeNote =
                String(
                    note
                ).replace(
                    /[&<>"']/g,
                    function(character) {

                        return {
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#039;"
                        }[character];

                    }
                );


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
                            ${safeType}
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

                    📅 ${transactionDate}

                    <br>

                    💳 Current Balance:
                    <strong>
                        ₹${currentBalance}
                    </strong>


                    ${
                        safeNote
                            ? `
                                <br>

                                📝
                                ${safeNote}
                            `
                            : ""
                    }

                </p>

            `;


            transactionList.appendChild(
                card
            );

        }
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

  }  
    



    
/* ================================
   FINDVIA COMMISSION SYSTEM
================================ */

let findViaCommissionPercent = 10;


async function loadFindViaCommissionPercent() {

    const {
        data,
        error
    } = await supabaseClient
        .from("platform_settings")
        .select("commission_percent")
        .eq("id", "global")
        .maybeSingle();

    if (error) {

        console.error(
            "FindVia commission load error:",
            error
        );

        return findViaCommissionPercent;
    }

    if (!data) {
        return findViaCommissionPercent;
    }

    const commission =
        Number(
            data.commission_percent
        );

    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {

        return findViaCommissionPercent;
    }

    findViaCommissionPercent =
        commission;

    return findViaCommissionPercent;
}


function getFindViaCommissionPercent() {

    const commission =
        Number(
            findViaCommissionPercent
        );

    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {
        return 10;
    }

    return commission;
}


async function setFindViaCommissionPercent(percent) {

    const commission =
        Number(percent);

    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {

        return false;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Admin login required."
        );

        return false;
    }

    const {
        data,
        error
    } = await supabaseClient
        .rpc(
            "update_findvia_global_commission",
            {
                p_commission:
                    commission
            }
        );

    if (error) {

        console.error(
            "FindVia commission update error:",
            error
        );

        alert(
            "Commission save nahi ho saki.\n\n" +
            error.message
        );

        return false;
    }

    const savedCommission =
        Number(data);

    if (
        !Number.isFinite(savedCommission) ||
        savedCommission < 0 ||
        savedCommission > 100
    ) {

        alert(
            "Invalid commission response."
        );

        return false;
    }

    findViaCommissionPercent =
        savedCommission;

    return true;
}


function calculateFindViaCommission(amount) {

    const price =
        Number(amount);

    if (
        !Number.isFinite(price) ||
        price <= 0
    ) {
        return 0;
    }

    const commissionPercent =
        getFindViaCommissionPercent();

    return Math.round(
        (
            price *
            commissionPercent
        ) / 100
    );
}


async function saveAdminCommission() {

    const input =
        document.getElementById(
            "adminCommissionInput"
        );

    const currentDisplay =
        document.getElementById(
            "adminCommissionCurrent"
        );

    if (!input) {
        return;
    }

    const commission =
        Number(
            input.value
        );

    if (
        !Number.isFinite(commission) ||
        commission < 0 ||
        commission > 100
    ) {

        alert(
            "Commission must be between 0% and 100%."
        );

        return;
    }

    const saved =
        await setFindViaCommissionPercent(
            commission
        );

    if (!saved) {
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

async function approveWorker(workerId) {

    if (!workerId) {

        alert(
            "Worker account ID nahi mila."
        );

        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Admin login required."
        );

        openAuthScreen();

        return;
    }

    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (
        adminError ||
        !adminUser
    ) {

        alert(
            "Admin access required."
        );

        return;
    }

    const {
        data: worker,
        error: workerError
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "id, name, verification_status"
        )
        .eq("id", workerId)
        .maybeSingle();

    if (workerError || !worker) {

        alert(
            "Worker profile nahi mili." +
            (
                workerError
                    ? "\n\n" +
                      workerError.message
                    : ""
            )
        );

        return;
    }

    const {
        error: updateError
    } = await supabaseClient
        .from("worker_profiles")
        .update({
            verification_status:
                "approved"
        })
        .eq(
            "id",
            workerId
        );

    if (updateError) {

        console.error(
            "Worker approval error:",
            updateError
        );

        alert(
            "Worker approve nahi ho saka.\n\n" +
            updateError.message
        );

        return;
    }

    alert(
        "✅ Worker approved successfully."
    );

    await openAdminWorkers();
}


async function rejectWorker(workerId) {

    if (!workerId) {

        alert(
            "Worker account ID nahi mila."
        );

        return;
    }

    const user =
        await getFindViaCurrentUser();

    if (!user) {

        alert(
            "Admin login required."
        );

        openAuthScreen();

        return;
    }

    const {
        data: adminUser,
        error: adminError
    } = await supabaseClient
        .from("admin_users")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

    if (
        adminError ||
        !adminUser
    ) {

        alert(
            "Admin access required."
        );

        return;
    }

    const {
        data: worker,
        error: workerError
    } = await supabaseClient
        .from("worker_profiles")
        .select(
            "id, name, verification_status"
        )
        .eq("id", workerId)
        .maybeSingle();

    if (workerError || !worker) {

        alert(
            "Worker profile nahi mili." +
            (
                workerError
                    ? "\n\n" +
                      workerError.message
                    : ""
            )
        );

        return;
    }

    const {
        error: updateError
    } = await supabaseClient
        .from("worker_profiles")
        .update({
            verification_status:
                "rejected"
        })
        .eq(
            "id",
            workerId
        );

    if (updateError) {

        console.error(
            "Worker rejection error:",
            updateError
        );

        alert(
            "Worker reject nahi ho saka.\n\n" +
            updateError.message
        );

        return;
    }

    alert(
        "❌ Worker rejected."
    );

    await openAdminWorkers();
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

    function sourceHas(
        functionName,
        pattern
    ) {

        const source =
            getSource(functionName);

        if (!source) {
            return false;
        }

        if (pattern instanceof RegExp) {
            return pattern.test(source);
        }

        return source.includes(pattern);
    }


    // ==========================================
    // 1. CORE MARKETPLACE
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
        "Completion OTP generation exists",
        typeof generateCompletionOTP === "function"
    );

    test(
        "Completion OTP verification exists",
        typeof verifyCompletionOTP === "function"
    );


    // ==========================================
    // 2. WORKER VERIFICATION
    // ==========================================

    test(
        "Worker verification is required before response",
        sourceHas(
            "respondToJob",
            /verificationStatus\s*!==\s*["']approved["']/
        )
    );

    test(
        "Worker profile is required for response",
        sourceHas(
            "respondToJob",
            "findviaWorkerProfile"
        )
    );

   test(
    "Worker role is required for response",
    sourceHas(
        "respondToJob",
        /currentRole\s*!==\s*["']worker["']/
    )
); 

    


    // ==========================================
    // 3. JOB MATCHING SAFETY
    // ==========================================

    test(
        "Worker matching checks job existence",
        sourceHas(
            "selectWorkerForJob",
            "if (!job)"
        )
    );

    test(
        "Matched job cannot be matched again",
        sourceHas(
            "selectWorkerForJob",
            /job\.matchStatus\s*===\s*["']matched["']/
        )
    );

    test(
        "Worker responses are used for matching",
        sourceHas(
            "selectWorkerForJob",
            "findviaJobResponses"
        )
    );


    // ==========================================
    // 4. PRICING
    // ==========================================

    test(
        "Customer pricing function is available",
        typeof openPricingForJob === "function"
    );

    test(
        "Worker offer function is available",
        typeof openWorkerOffer === "function"
    );

    test(
        "Customer price response is available",
        typeof openCustomerPriceResponse === "function"
    );

    test(
        "Confirmation requires accepted price",
        sourceHas(
            "confirmJob",
            /job\.priceStatus\s*!==\s*["']accepted["']/
        )
    );

    test(
        "Already confirmed job is protected",
        sourceHas(
            "confirmJob",
            /job\.jobStatus\s*===\s*["']confirmed["']/
        )
    );


    // ==========================================
    // 5. OTP / COMPLETION
    // ==========================================

    const otpSource =
        getSource("generateCompletionOTP");

    const verifySource =
        getSource("verifyCompletionOTP");

    test(
        "OTP generation requires confirmed job",
        /job\.jobStatus\s*!==\s*["']confirmed["']/.test(
            otpSource
        )
    );

    test(
        "OTP verification checks matched worker",
        verifySource.includes(
            "job.matchedWorker"
        )
    );

    test(
        "OTP verification requires confirmed job",
        /job\.jobStatus\s*!==\s*["']confirmed["']/.test(
            verifySource
        )
    );

    test(
        "OTP completion logic exists",
        verifySource.includes(
            "completionOTP"
        )
    );

    test(
        "Insufficient credits block completion",
        verifySource.includes(
            "currentCredits"
        ) &&
        verifySource.includes(
            "commissionAmount"
        )
    );

    


    // ==========================================
    // PART 1 ENDS HERE
    // ==========================================
    // ==========================================
    // 6. COMMISSION SYSTEM
    // ==========================================

    test(
        "Commission getter exists",
        typeof getFindViaCommissionPercent === "function"
    );

    test(
        "Commission setter exists",
        typeof setFindViaCommissionPercent === "function"
    );

    test(
        "Commission calculator exists",
        typeof calculateFindViaCommission === "function"
    );

    test(
        "Admin commission save exists",
        typeof saveAdminCommission === "function"
    );

    test(
        "Completion stores commission percentage",
        verifySource.includes(
            "job.commissionPercent"
        )
    );

    test(
        "Completion stores commission amount",
        verifySource.includes(
            "job.commissionAmount"
        )
    );

    test(
        "Completion stores commission lock time",
        verifySource.includes(
            "job.commissionLockedAt"
        )
    );

    const commissionPercent =
        getFindViaCommissionPercent();

    test(
        "Commission percentage is valid",
        Number.isFinite(
            Number(commissionPercent)
        ) &&
        Number(commissionPercent) >= 0 &&
        Number(commissionPercent) <= 100
    );

    const commission1000 =
        calculateFindViaCommission(1000);

    const expected1000 =
        Math.round(
            1000 *
            Number(commissionPercent) /
            100
        );

    test(
        "Commission calculation for ₹1000",
        commission1000 === expected1000
    );

    const commission500 =
        calculateFindViaCommission(500);

    const expected500 =
        Math.round(
            500 *
            Number(commissionPercent) /
            100
        );

    test(
        "Commission calculation for ₹500",
        commission500 === expected500
    );


        // ==========================================
    // 7. CREDIT SYSTEM
    // ==========================================

    test(
        "Supabase worker credit reader exists",
        typeof getWorkerCreditsFromSupabase === "function"
    );

    test(
        "Secure credit deduction RPC is used",
        verifySource.includes(
            "complete_findvia_job_with_otp"
        )
    );

    test(
        "Completion uses backend commission processing",
        verifySource.includes(
            "supabaseClient.rpc"
        )
    );

    
    


    // ==========================================
    // 9. ADMIN
    // ==========================================

    test(
        "Admin login function exists",
        typeof adminLogin === "function"
    );

    test(
        "Admin panel function exists",
        typeof openAdminPanel === "function"
    );

    test(
        "Admin worker screen function exists",
        typeof openAdminWorkers === "function"
    );

        test(
        "Admin credit function exists",
        typeof adminAddWorkerCreditsFromList === "function"
    );

    test(
        "Admin worker transaction function exists",
        typeof openWorkerTransactions === "function"
    );

    test(
        "Approve worker function exists",
        typeof approveWorker === "function"
    );

    test(
        "Reject worker function exists",
        typeof rejectWorker === "function"
    );

    test(
        "Approve worker sets approved status",
        sourceHas(
            "approveWorker",
            'verificationStatus = "approved"'
        )
    );

    test(
        "Reject worker sets rejected status",
        sourceHas(
            "rejectWorker",
            'verificationStatus = "rejected"'
        )
    );

    test(
        "Admin screens can be hidden",
        typeof hideAdminScreens === "function"
    );


    // ==========================================
    // 10. WORKER TRANSACTION HISTORY
    // ==========================================

    test(
        "Worker transaction history exists",
        typeof openWorkerTransactionHistory === "function"
    );

    test(
        "Worker transaction screen can be hidden",
        typeof hideWorkerTransactionScreen === "function"
    );

    test(
        "Worker history reads transactions",
        sourceHas(
            "openWorkerTransactionHistory",
            "findviaCreditTransactions"
        )
    );

    test(
        "Worker history filters worker transactions",
        sourceHas(
            "openWorkerTransactionHistory",
            "workerProfile"
        )
    );


    // ==========================================
    // PART 2 ENDS HERE
    // ==========================================
    // ==========================================
    // 11. NAVIGATION / SCREEN HIDING
    // ==========================================

    test(
        "Find Work hides admin screens",
        sourceHas(
            "findWork",
            "hideAdminScreens"
        )
    );

    test(
        "Find Work hides worker transaction screen",
        sourceHas(
            "findWork",
            "hideWorkerTransactionScreen"
        )
    );

    test(
        "Find Workers hides admin screens",
        sourceHas(
            "findWorkers",
            "hideAdminScreens"
        )
    );

    test(
        "Find Workers hides worker transaction screen",
        sourceHas(
            "findWorkers",
            "hideWorkerTransactionScreen"
        )
    );

    test(
        "Profile hides admin screens",
        sourceHas(
            "showProfile",
            "hideAdminScreens"
        )
    );

    test(
        "Profile hides worker transaction screen",
        sourceHas(
            "showProfile",
            "hideWorkerTransactionScreen"
        )
    );


    // ==========================================
    // 12. SEARCH
    // ==========================================

    test(
        "Work search exists",
        typeof searchWork === "function"
    );

    test(
        "Worker search exists",
        typeof searchWorkers === "function"
    );

    test(
        "Global search exists",
        typeof globalSearch === "function"
    );

    test(
        "Work category selection exists",
        typeof selectWorkCategory === "function"
    );

    test(
        "Work search uses workSearch",
        sourceHas(
            "searchWork",
            "workSearch"
        )
    );

    test(
        "Worker search uses workerSearch",
        sourceHas(
            "searchWorkers",
            "workerSearch"
        )
    );

    test(
        "Global search function is available",
        typeof globalSearch === "function"
    );


    // ==========================================
    // 13. JOB AVAILABILITY / EXPIRY
    // ==========================================

    test(
        "Posted jobs function exists",
        typeof showPostedJobs === "function"
    );

    test(
        "Job availability logic exists",
        sourceHas(
            "showPostedJobs",
            "available"
        )
    );

   test(
    "Job expiry logic exists",
    typeof isJobAvailableForFindWork === "function" &&
    sourceHas(
        "isJobAvailableForFindWork",
        "job.timing"
    )
); 

    // ==========================================
    // 14. LANGUAGE SYSTEM
    // ==========================================

    test(
        "Language state exists",
        typeof hindiMode === "boolean"
    );

    test(
        "Translation dictionary exists",
        typeof findViaTranslations === "object"
    );

    test(
        "Translation helper exists",
        typeof t === "function"
    );

    test(
        "Message translation exists",
        typeof translateFindViaMessage === "function"
    );

    test(
        "Static language function exists",
        typeof applyFindViaStaticLanguage === "function"
    );

    test(
        "Language toggle exists",
        typeof toggleLanguage === "function"
    );

    test(
        "Toggle applies static language",
        sourceHas(
            "toggleLanguage",
            "applyFindViaStaticLanguage"
        )
    );


    // ==========================================
    // 15. CUSTOM MODALS
    // ==========================================

    test(
        "Custom alert modal exists",
        typeof showFindViaModal === "function"
    );

    test(
        "Custom alert close exists",
        typeof closeFindViaModal === "function"
    );

    test(
        "Action modal exists",
        typeof showFindViaActionModal === "function"
    );

    test(
        "Action modal close exists",
        typeof closeFindViaActionModal === "function"
    );

    test(
        "Input modal exists",
        typeof showFindViaInputModal === "function"
    );

    test(
        "Input modal close exists",
        typeof closeFindViaInputModal === "function"
    );


    // ==========================================
    // 16. ENTER SUPPORT
    // ==========================================

    const inputModalSource =
        getSource(
            "showFindViaInputModal"
        );

    test(
        "Input modal supports Enter",
        inputModalSource.includes(
            'event.key !== "Enter"'
        )
    );

    test(
        "Input modal Enter submits",
        inputModalSource.includes(
            "submit.click()"
        )
    );

    test(
        "Work search function is available for Enter",
        typeof searchWork === "function"
    );

    test(
        "Worker search function is available for Enter",
        typeof searchWorkers === "function"
    );

    test(
        "Global search function is available for Enter",
        typeof globalSearch === "function"
    );

    test(
        "Admin login function is available for Enter",
        typeof adminLogin === "function"
    );


    // ==========================================
    // 17. STORAGE
    // ==========================================

    test(
        "localStorage is available",
        typeof localStorage !== "undefined"
    );

    const requiredStorageKeys = [
        "findviaJobs",
        "findviaJobResponses",
        "findviaUserRole",
        "findviaWorkerProfile",
        "findviaCreditTransactions",
        "findviaCommissionPercent",
        "findviaRechargeRequests"
    ];

    requiredStorageKeys.forEach(
        function(key) {

            test(
                "Storage system supports: " + key,
                typeof localStorage.getItem === "function"
            );

        }
    );

// ==========================================
// 18. WORKER RECHARGE SYSTEM
// ==========================================

test(
    "Worker recharge function exists",
    typeof openWorkerRecharge === "function"
);

test(
    "Worker recharge screen can be hidden",
    typeof hideWorkerRechargeScreen === "function"
);

test(
    "Recharge request submission function exists",
    typeof submitWorkerRechargeRequest === "function"
);

test(
    "Recharge requests use dedicated storage",
    sourceHas(
        "submitWorkerRechargeRequest",
        "findviaRechargeRequests"
    )
);

test(
    "Recharge request stores payment amount",
    sourceHas(
        "submitWorkerRechargeRequest",
        "amount"
    )
);

test(
    "Recharge request stores transaction ID",
    sourceHas(
        "submitWorkerRechargeRequest",
        "transactionId"
    )
);

test(
    "Recharge request starts as pending",
    sourceHas(
        "submitWorkerRechargeRequest",
        /status\s*:\s*["']pending["']/
    )
);

test(
    "Admin recharge requests screen exists",
    typeof openAdminRechargeRequests === "function"
);

test(
    "Admin recharge approval function exists",
    typeof approveWorkerRecharge === "function"
);

test(
    "Admin recharge approval uses secure RPC",
    sourceHas(
        "approveWorkerRecharge",
        "approve_recharge_request"
    )
);

test(
    "Admin recharge rejection uses secure RPC",
    sourceHas(
        "rejectWorkerRecharge",
        "reject_recharge_request"
    )
);




test(
    "Recharge requests are protected from duplicate pending UTR",
    sourceHas(
        "submitWorkerRechargeRequest",
        "alreadyPending"
    )
);

test(
    "Admin screens hide recharge requests screen",
    sourceHas(
        "hideAdminScreens",
        "adminRechargeRequestsScreen"
    )
);

test(
    "Recharge request screen can reopen after processing",
    sourceHas(
        "approveWorkerRecharge",
        "openAdminRechargeRequests"
    ) &&
    sourceHas(
        "rejectWorkerRecharge",
        "openAdminRechargeRequests"
    )
);


// ==========================================
// 19. FINAL RESULT
// ==========================================
    

    const passed =
        results.filter(
            function(result) {
                return result.passed;
            }
        ).length;

    const failed =
        results.filter(
            function(result) {
                return !result.passed;
            }
        ).length;


    let message =
        "🧪 FindVia Full System Test\n\n";


    results.forEach(
        function(result) {

            message +=
                (
                    result.passed
                        ? "✅ "
                        : "❌ "
                ) +
                result.name +
                "\n";

        }
    );


    message +=
        "\n--------------------\n" +
        "TOTAL: " + results.length +
        "\n" +
        "PASSED: " + passed +
        "\n" +
        "FAILED: " + failed;


    if (failed === 0) {

        message +=
            "\n\n🎉 ALL SYSTEM CHECKS PASSED.";

    } else {

        message +=
            "\n\n⚠️ PLEASE REVIEW FAILED CHECKS.";

    }


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

    message =
    translateFindViaMessage(message);

    const localizedMessages = {

        "Job nahi mili.":
            {
                en: "Job not found.",
                hi: "काम नहीं मिला।"
            },

        "Pehle worker ko match karein.":
            {
                en: "Please match a worker first.",
                hi: "कृपया पहले किसी worker को match करें।"
            },

        "Worker profile nahi mila.":
            {
                en: "Worker profile not found.",
                hi: "Worker profile नहीं मिला।"
            },

        "Pehle worker profile setup karein.":
            {
                en: "Please set up your worker profile first.",
                hi: "कृपया पहले अपना worker profile सेट करें।"
            },

        "Please location enter karein.":
            {
                en: "Please enter a location.",
                hi: "कृपया location दर्ज करें।"
            },

        "Please amount enter karein.":
            {
                en: "Please enter an amount.",
                hi: "कृपया amount दर्ज करें।"
            },

        "Please ek valid amount enter karein.":
            {
                en: "Please enter a valid amount.",
                hi: "कृपया सही amount दर्ज करें।"
            },

        "Offer reject kar diya gaya.":
            {
                en: "The offer has been rejected.",
                hi: "Offer अस्वीकार कर दिया गया है।"
            },

        "Pehle price agreement complete karein.":
            {
                en: "Please complete the price agreement first.",
                hi: "कृपया पहले price agreement पूरा करें।"
            },

        "Ye job already confirmed hai.":
            {
                en: "This job is already confirmed.",
                hi: "यह job पहले से confirmed है।"
            },

        "Pehle job confirm karein.":
            {
                en: "Please confirm the job first.",
                hi: "कृपया पहले job confirm करें।"
            }

    };

    const translation =
        localizedMessages[message];

    if (translation) {

        showFindViaModal(
            hindiMode
                ? translation.hi
                : translation.en,
            "FindVia",
            "ℹ️"
        );

        return;
    }

    /*
     * Temporary fallback:
     * Unconverted messages continue working.
     * They will be cleaned in the next language pass.
     */

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

    const cancelText =
        hindiMode
            ? "रद्द करें"
            : "Cancel";

    const localizedActions =
        actions.map(function(item) {

            const actionTranslations = {

                "Select Worker": {
                    en: "Select Worker",
                    hi: "Worker चुनें"
                },

                "Accept Offer": {
                    en: "Accept Offer",
                    hi: "Offer स्वीकार करें"
                },

                "Counter Offer": {
                    en: "Counter Offer",
                    hi: "Counter Offer दें"
                },

                "Reject Offer": {
                    en: "Reject Offer",
                    hi: "Offer अस्वीकार करें"
                },

                "Confirm Job": {
                    en: "Confirm Job",
                    hi: "Job confirm करें"
                }

            };

            const translation =
                actionTranslations[item.text];

            return {
                ...item,
                text:
                    translation
                    ? (
                        hindiMode
                        ? translation.hi
                        : translation.en
                    )
                    : item.text
            };

        });

    modal.innerHTML = `
        <div class="findvia-modal-box">

            <div class="findvia-modal-icon">
                💰
            </div>

            <h3>
                ${escapeHTML(
                    title
                )}
            </h3>

            <p>
                ${escapeHTML(
                    message
                )}
            </p>

            <div class="findvia-action-buttons">

                ${
                    localizedActions
                    .map(function(item, index) {

                        return `
                            <button
                                type="button"
                                class="primary-btn"
                                data-action-index="${index}"
                            >
                                ${item.icon}
                                ${item.text}
                            </button>
                        `;

                    })
                    .join("")
                }

                <button
                    type="button"
                    class="back-btn"
                    onclick="closeFindViaActionModal()"
                >
                    ${cancelText}
                </button>

            </div>

        </div>
    `;

    localizedActions.forEach(
        function(item, index) {

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

        }
    );

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

    const continueText =
        hindiMode
            ? "आगे बढ़ें"
            : "Continue";

    const cancelText =
        hindiMode
            ? "रद्द करें"
            : "Cancel";

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
                    ${continueText}
                </button>

                <button
                    type="button"
                    class="back-btn"
                    onclick="closeFindViaInputModal()"
                >
                    ${cancelText}
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

    input.addEventListener(
        "keydown",
        function(event) {

            if (event.key !== "Enter") {
                return;
            }

            event.preventDefault();

            submit.click();
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



document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.key !== "Enter" ||
            event.target.tagName !== "INPUT"
        ) {
            return;
        }

        const inputId =
            event.target.id;

        if (inputId === "workSearch") {

            event.preventDefault();

            searchWork();

            return;
        }

        if (inputId === "workerSearch") {

            event.preventDefault();

            searchWorkers();

            return;
        }

        if (inputId === "globalSearch") {

            event.preventDefault();

            globalSearch();

            return;
        }

        if (inputId === "adminPasswordInput") {

            event.preventDefault();

            adminLogin();

            return;
        }
    }
);


/* =========================================
   FindVia Automatic Icon Normalizer
   ========================================= */

function normalizeFindViaIconImage(
    image,
    targetSize = 128
) {

    if (!image || !image.naturalWidth) {
        return;
    }

    const sourceCanvas =
        document.createElement("canvas");

    sourceCanvas.width =
        image.naturalWidth;

    sourceCanvas.height =
        image.naturalHeight;

    const sourceContext =
        sourceCanvas.getContext("2d", {
            willReadFrequently: true
        });

    sourceContext.drawImage(
        image,
        0,
        0
    );

    const imageData =
        sourceContext.getImageData(
            0,
            0,
            sourceCanvas.width,
            sourceCanvas.height
        );

    const pixels =
        imageData.data;

    let minX =
        sourceCanvas.width;

    let minY =
        sourceCanvas.height;

    let maxX = -1;

    let maxY = -1;

    for (
        let y = 0;
        y < sourceCanvas.height;
        y++
    ) {

        for (
            let x = 0;
            x < sourceCanvas.width;
            x++
        ) {

            const alpha =
                pixels[
                    (y * sourceCanvas.width + x) * 4 + 3
                ];

            if (alpha > 8) {

                if (x < minX) {
                    minX = x;
                }

                if (y < minY) {
                    minY = y;
                }

                if (x > maxX) {
                    maxX = x;
                }

                if (y > maxY) {
                    maxY = y;
                }
            }
        }
    }

    if (maxX < minX || maxY < minY) {
        return;
    }

    const cropWidth =
        maxX - minX + 1;

    const cropHeight =
        maxY - minY + 1;

    const padding =
        Math.round(targetSize * 0.14);

    const finalCanvas =
        document.createElement("canvas");

    finalCanvas.width =
        targetSize;

    finalCanvas.height =
        targetSize;

    const finalContext =
        finalCanvas.getContext("2d");

    const availableSize =
        targetSize - padding * 2;

    const scale =
        Math.min(
            availableSize / cropWidth,
            availableSize / cropHeight
        );

    const drawWidth =
        cropWidth * scale;

    const drawHeight =
        cropHeight * scale;

    const drawX =
        (targetSize - drawWidth) / 2;

    const drawY =
        (targetSize - drawHeight) / 2;

    finalContext.drawImage(
        sourceCanvas,
        minX,
        minY,
        cropWidth,
        cropHeight,
        drawX,
        drawY,
        drawWidth,
        drawHeight
    );

    image.src =
        finalCanvas.toDataURL("image/png");
}


function normalizeFindViaIcons() {

    const icons =
        document.querySelectorAll(
            "img.findvia-icon, img.findvia-icon-nav, img.findvia-icon-action"
        );

    icons.forEach(function(image) {

        if (
            image.dataset.findviaNormalized === "true"
        ) {
            return;
        }

        image.dataset.findviaNormalized =
            "true";

        if (image.complete) {

            normalizeFindViaIconImage(
                image
            );

        } else {

            image.addEventListener(
                "load",
                function() {

                    normalizeFindViaIconImage(
                        image
                    );

                },
                {
                    once: true
                }
            );
        }
    });
}


function normalizeFindViaBackIcon() {

    const backButtons =
        document.querySelectorAll(
            ".back-btn"
        );

    if (!backButtons.length) {
        return;
    }

    const backImage =
        new Image();

    backImage.onload =
        function() {

            const canvas =
                document.createElement("canvas");

            canvas.width =
                backImage.naturalWidth;

            canvas.height =
                backImage.naturalHeight;

            const context =
                canvas.getContext("2d", {
                    willReadFrequently: true
                });

            context.drawImage(
                backImage,
                0,
                0
            );

            const imageData =
                context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            const pixels =
                imageData.data;

            let minX =
                canvas.width;

            let minY =
                canvas.height;

            let maxX = -1;

            let maxY = -1;

            for (
                let y = 0;
                y < canvas.height;
                y++
            ) {

                for (
                    let x = 0;
                    x < canvas.width;
                    x++
                ) {

                    const alpha =
                        pixels[
                            (y * canvas.width + x) * 4 + 3
                        ];

                    if (alpha > 8) {

                        minX =
                            Math.min(minX, x);

                        minY =
                            Math.min(minY, y);

                        maxX =
                            Math.max(maxX, x);

                        maxY =
                            Math.max(maxY, y);
                    }
                }
            }

            if (
                maxX < minX ||
                maxY < minY
            ) {
                return;
            }

            const cropWidth =
                maxX - minX + 1;

            const cropHeight =
                maxY - minY + 1;

            const finalSize =
                128;

            const finalCanvas =
                document.createElement("canvas");

            finalCanvas.width =
                finalSize;

            finalCanvas.height =
                finalSize;

            const finalContext =
                finalCanvas.getContext("2d");

            const padding =
                16;

            const available =
                finalSize - padding * 2;

            const scale =
                Math.min(
                    available / cropWidth,
                    available / cropHeight
                );

            const width =
                cropWidth * scale;

            const height =
                cropHeight * scale;

            finalContext.drawImage(
                canvas,
                minX,
                minY,
                cropWidth,
                cropHeight,
                (finalSize - width) / 2,
                (finalSize - height) / 2,
                width,
                height
            );

            const normalizedIcon =
                finalCanvas.toDataURL(
                    "image/png"
                );

            backButtons.forEach(
                function(button) {

                    button.style.setProperty(
                        "--findvia-back-icon",
                        `url("${normalizedIcon}")`
                    );

                }
            );
        };

    backImage.src =
        "assets/icons/back.png";
}


function initializeFindViaIconSystem() {

    normalizeFindViaIcons();
    normalizeFindViaBackIcon();
}
