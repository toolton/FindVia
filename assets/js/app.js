
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




let findViaAuthMode = "login";


function openAuthScreen() {

    document.getElementById("homeContent").style.display = "none";

    document.getElementById("findWorkScreen")?.classList.remove("active");
    document.getElementById("findWorkersScreen")?.classList.remove("active");
    document.getElementById("searchScreen")?.classList.remove("active");
    document.getElementById("profileScreen")?.classList.remove("active");
    document.getElementById("workerProfileScreen")?.classList.remove("active");
    document.getElementById("postJobScreen")?.classList.remove("active");
    document.getElementById("myJobsScreen").style.display = "none";

    document.getElementById("authScreen").style.display = "block";

    updateFindViaAuthUI();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function closeAuthScreen() {

    document.getElementById("authScreen").style.display = "none";

    showProfile();
}


function toggleFindViaAuthMode() {

    if (findViaAuthMode === "login") {
        findViaAuthMode = "signup";
    } else {
        findViaAuthMode = "login";
    }

    updateFindViaAuthUI();
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

    if (!title || !subtitle || !mainButton || !toggleButton) {
        return;
    }


    if (findViaAuthMode === "login") {

        title.textContent =
            "Login to FindVia";

        subtitle.textContent =
            "Login to continue using your FindVia account.";

        mainButton.textContent =
            "Login";

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


async function handleFindViaAuth() {

    const emailInput =
        document.getElementById("authEmail");

    const passwordInput =
        document.getElementById("authPassword");

    const status =
        document.getElementById("authStatus");

    if (!emailInput || !passwordInput || !status) {
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
        emailRedirectTo: "https://toolton.github.io/FindVia/"
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

            status.textContent =
                "Account created. Please check your email and confirm your account before login.";

            return;
        }


        status.textContent =
            "Account created successfully.";

        findViaAuthMode = "login";

        updateFindViaAuthUI();

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


    status.textContent =
        "Login successful.";

    passwordInput.value = "";

    setTimeout(function() {

        closeAuthScreen();

    }, 500);
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

        return false;
    }


    return true;
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

document.getElementById("authScreen").style.display = "none";
    
hideWorkerVerificationScreen();
hideAdminScreens();
   hideWorkerRechargeScreen(); 
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

        availableJobs = availableJobs.filter(function(job) {

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


function searchWork() {

    const searchInput =
        document.getElementById("workSearch");

    const search =
        searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    if (search === "") {

        showPostedJobs();

        return;
    }

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const matchedJobs =
        jobs.filter(function(job) {

            if (!isJobAvailableForFindWork(job)) {
                return false;
            }

            const title =
                String(job.title || "").toLowerCase();

            const category =
                String(job.category || "").toLowerCase();

            const description =
                String(job.description || "").toLowerCase();

            const area =
                String(job.area || "").toLowerCase();

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

    /*
     * Matched jobs ko temporarily render karne ke liye
     * same job-card structure use kar rahe hain.
     */

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

function globalSearch() {

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
                    Work ya worker ka naam, service,
                    category ya area search karein.
                </p>

            </div>
        `;

        return;
    }

    /* =========================
       SEARCH JOBS
    ========================= */

    const jobs = JSON.parse(
        localStorage.getItem("findviaJobs") || "[]"
    );

    const matchedJobs =
        jobs.filter(function(job) {

            if (
                typeof isJobAvailableForFindWork ===
                "function"
            ) {

                if (
                    !isJobAvailableForFindWork(job)
                ) {
                    return false;
                }

            } else {

                if (job.status !== "open") {
                    return false;
                }

            }

            const title =
                String(job.title || "").toLowerCase();

            const category =
                String(job.category || "").toLowerCase();

            const description =
                String(job.description || "").toLowerCase();

            const area =
                String(job.area || "").toLowerCase();

            return (
                title.includes(search) ||
                category.includes(search) ||
                description.includes(search) ||
                area.includes(search)
            );

        });


    /* =========================
       SEARCH APPROVED WORKERS
    ========================= */

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
                worker.verificationStatus !==
                    "approved"
            ) {
                return;
            }

            const name =
                String(worker.name || "")
                    .toLowerCase();

            const service =
                String(worker.service || "")
                    .toLowerCase();

            const area =
                String(worker.area || "")
                    .toLowerCase();

            const experience =
                String(worker.experience || "")
                    .toLowerCase();

            if (
                name.includes(search) ||
                service.includes(search) ||
                area.includes(search) ||
                experience.includes(search)
            ) {

                matchedWorkers.push(worker);

            }

        } catch (error) {

            console.log(
                "Invalid worker profile skipped."
            );

        }

    });


    /* =========================
       RESULTS
    ========================= */

    if (
        matchedJobs.length === 0 &&
        matchedWorkers.length === 0
    ) {

        resultsBox.innerHTML = `
            <div class="empty-state">

                <div style="font-size:40px;">
                    🔎
                </div>

                <h3>
                    No results found
                </h3>

                <p>
                    "${escapeHTML(search)}"
                    ke liye koi matching work ya
                    approved worker nahi mila.
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
                    Search Results
                </h3>

            </div>

            <span class="results-count">
                ${
                    matchedJobs.length +
                    matchedWorkers.length
                } found
            </span>

        </div>
    `;


    /* =========================
       JOB RESULTS
    ========================= */

    if (matchedJobs.length > 0) {

        html += `
            <div style="margin:18px 0 10px;">
                <strong>
                    💼 Work Opportunities
                </strong>
            </div>
        `;

        matchedJobs.forEach(function(job) {

            html += `
                <div class="job-card">

                    <div class="job-card-top">

                        <div>

                            <span class="job-category">
                                ${escapeHTML(
                                    job.category
                                )}
                            </span>

                            <h3>
                                ${escapeHTML(
                                    job.title
                                )}
                            </h3>

                        </div>

                        <span class="job-status">
                            Open
                        </span>

                    </div>

                    <p class="job-description">
                        ${escapeHTML(
                            job.description
                        )}
                    </p>

                    <div class="job-meta">

                        <span>
                            📍 ${escapeHTML(
                                job.area
                            )}
                        </span>

                        <span>
                            🕒 ${escapeHTML(
                                job.timing
                            )}
                        </span>

                    </div>

                </div>
            `;

        });

    }


    /* =========================
       WORKER RESULTS
    ========================= */

    if (matchedWorkers.length > 0) {

        html += `
            <div style="margin:22px 0 10px;">
                <strong>
                    👷 Approved Workers
                </strong>
            </div>
        `;

        matchedWorkers.forEach(function(worker) {

            const workerName =
                worker.name || "Worker";

            const initial =
                workerName
                    .charAt(0)
                    .toUpperCase();

            html += `
                <div class="worker-card premium-worker-card">

                    <div class="worker-avatar">
                        ${escapeHTML(initial)}
                    </div>

                    <div class="worker-info">

                        <div class="worker-name-row">

                            <h4>
                                ${escapeHTML(
                                    workerName
                                )}
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

    }

    resultsBox.innerHTML = html;
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

    if (
        !name ||
        !service ||
        !experience ||
        !area ||
        !availability
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

    const existingProfile =
        JSON.parse(
            localStorage.getItem(
                "findviaWorkerProfile"
            ) || "null"
        );

    const verificationStatus =
        existingProfile?.verificationStatus === "approved"
            ? "approved"
            : "pending";

    const profileData = {
    id: user.id,
    name: name,
    service: service,
    experience: experience,
    area: area,
    availability: availability,
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

function openWorkerVerification() {

    const currentRole =
        localStorage.getItem("findviaUserRole");

    if (currentRole !== "worker") {
        alert(
            "Please select the Worker role first."
        );
        return;
    }

    const savedProfile =
        localStorage.getItem(
            "findviaWorkerProfile"
        );

    if (!savedProfile) {
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


function loadWorkerVerification() {

    const savedProfile =
        localStorage.getItem(
            "findviaWorkerProfile"
        );

    if (!savedProfile) {
        return;
    }

    const profile =
        JSON.parse(savedProfile);

    const consent =
        document.getElementById(
            "workerVerificationConsent"
        );

    if (consent) {
        consent.checked =
            profile.verificationSubmitted === true;
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


    const savedProfile =
        localStorage.getItem(
            "findviaWorkerProfile"
        );


    if (!savedProfile) {
        alert(
            "Worker profile not found."
        );
        return;
    }


    const profile =
        JSON.parse(savedProfile);


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
    "id, name, service, experience, area, availability, verification_status"
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
   localStorage.setItem(
    "findviaWorkerProfile",
    JSON.stringify({
        id: profile.id || user.id,
        name: profile.name || "",
        service: profile.service || "",
        experience: profile.experience || "",
        area: profile.area || "",
        availability: profile.availability || "",
        verificationStatus:
            profile.verification_status || "pending"
    })
); 
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
    const verificationButton =
    document.getElementById(
        "workerVerificationButton"
    );

if (verificationButton) {

    verificationButton.style.display =
        profile.verificationStatus === "approved"
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

    const adminVerificationScreen = document.getElementById(
    "adminWorkerVerificationScreen"
);
    const adminRechargeRequestsScreen =
    document.getElementById(
        "adminRechargeRequestsScreen"
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


<button
    class="primary-btn"
    style="margin-top:8px;"
    onclick="openWorkerVerificationReview(${index})"
>
    🔍 View Verification
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

async function openWorkerVerificationReview(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem(
            "findviaWorkerProfiles"
        ) || "[]"
    );

    const profileString =
        workerProfiles[index];

    if (!profileString) {

        alert(
            "Worker profile nahi mila."
        );

        return;
    }

    const localWorker =
        JSON.parse(profileString);

    const workerId =
        localWorker.id;

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

async function approveWorker(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    if (!workerProfiles[index]) {
        alert("Worker profile nahi mila.");
        return;
    }

    const worker = JSON.parse(workerProfiles[index]);

    const workerId = worker.id;

    if (!workerId) {
        alert("Worker account ID nahi mila.");
        return;
    }

    const user = await getFindViaCurrentUser();

    if (!user) {
        alert("Admin login required.");
        openAuthScreen();
        return;
    }

    const { data: adminUser, error: adminError } =
        await supabaseClient
            .from("admin_users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

    if (adminError || !adminUser) {
        alert("Admin access required.");
        return;
    }

    const { error: updateError } =
        await supabaseClient
            .from("worker_profiles")
            .update({
                verification_status: "approved"
            })
            .eq("id", workerId);

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

    worker.verificationStatus = "approved";

    workerProfiles[index] =
        JSON.stringify(worker);

    localStorage.setItem(
        "findviaWorkerProfiles",
        JSON.stringify(workerProfiles)
    );

    const currentProfile = JSON.parse(
        localStorage.getItem(
            "findviaWorkerProfile"
        ) || "null"
    );

    if (
        currentProfile &&
        currentProfile.id === workerId
    ) {
        currentProfile.verificationStatus =
            "approved";

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


async function rejectWorker(index) {

    const workerProfiles = JSON.parse(
        localStorage.getItem("findviaWorkerProfiles") || "[]"
    );

    if (!workerProfiles[index]) {
        alert("Worker profile nahi mila.");
        return;
    }

    const worker = JSON.parse(workerProfiles[index]);

    const workerId = worker.id;

    if (!workerId) {
        alert("Worker account ID nahi mila.");
        return;
    }

    const user = await getFindViaCurrentUser();

    if (!user) {
        alert("Admin login required.");
        openAuthScreen();
        return;
    }

    const { data: adminUser, error: adminError } =
        await supabaseClient
            .from("admin_users")
            .select("id")
            .eq("id", user.id)
            .maybeSingle();

    if (adminError || !adminUser) {
        alert("Admin access required.");
        return;
    }

    const { error: updateError } =
        await supabaseClient
            .from("worker_profiles")
            .update({
                verification_status: "rejected"
            })
            .eq("id", workerId);

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

    worker.verificationStatus =
        "rejected";

    workerProfiles[index] =
        JSON.stringify(worker);

    localStorage.setItem(
        "findviaWorkerProfiles",
        JSON.stringify(workerProfiles)
    );

    const currentProfile = JSON.parse(
        localStorage.getItem(
            "findviaWorkerProfile"
        ) || "null"
    );

    if (
        currentProfile &&
        currentProfile.id === workerId
    ) {
        currentProfile.verificationStatus =
            "rejected";

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

    test(
        "Insufficient credits block worker response",
        sourceHas(
            "respondToJob",
            "hasSufficientCreditsForJob"
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

    test(
        "Commission deduction is performed",
        verifySource.includes(
            "addWorkerCreditTransaction"
        )
    );

    test(
        "Completed status is saved",
        verifySource.includes(
            "completed"
        ) &&
        verifySource.includes(
            "localStorage.setItem"
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
        "Credit reader exists",
        typeof getWorkerCreditsForProfile === "function"
    );

    test(
        "Credit setter exists",
        typeof setWorkerCreditsForProfile === "function"
    );

    test(
        "Credit transaction function exists",
        typeof addWorkerCreditTransaction === "function"
    );

    test(
        "Job credit eligibility helper exists",
        typeof hasSufficientCreditsForJob === "function"
    );

    test(
        "Credit eligibility calculates commission",
        sourceHas(
            "hasSufficientCreditsForJob",
            "calculateFindViaCommission"
        )
    );

    test(
        "Credit eligibility checks current credits",
        sourceHas(
            "hasSufficientCreditsForJob",
            "currentCredits"
        )
    );


    // ==========================================
    // 8. TRANSACTION LEDGER
    // ==========================================

    const transactionSource =
        getSource(
            "addWorkerCreditTransaction"
        );

    test(
        "Transaction saves worker profile",
        transactionSource.includes(
            "workerProfile"
        )
    );

    test(
        "Transaction saves amount",
        transactionSource.includes(
            "amount"
        )
    );

    test(
        "Transaction saves type",
        transactionSource.includes(
            "type"
        )
    );

    test(
        "Transaction saves balanceAfter",
        transactionSource.includes(
            "balanceAfter"
        )
    );

    test(
        "Transaction saves createdAt",
        transactionSource.includes(
            "createdAt"
        )
    );

    test(
        "Transaction supports job details",
        transactionSource.includes(
            "jobDetails"
        )
    );

    test(
        "Transaction supports commission details",
        transactionSource.includes(
            "commissionAmount"
        )
    );

    const transactions =
        JSON.parse(
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
            transactions[
                transactions.length - 1
            ];

        test(
            "Latest transaction has balanceAfter",
            Object.prototype.hasOwnProperty.call(
                latestTransaction,
                "balanceAfter"
            )
        );

    }


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
        typeof adminAddWorkerCredits === "function"
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
    "Admin recharge approval adds credits",
    sourceHas(
        "approveWorkerRecharge",
        "setWorkerCreditsForProfile"
    )
);

test(
    "Approved recharge creates transaction",
    sourceHas(
        "approveWorkerRecharge",
        "addWorkerCreditTransaction"
    )
);

test(
    "Approved recharge status is saved",
    sourceHas(
        "approveWorkerRecharge",
        /request\.status\s*=\s*["']approved["']/
    )
);

test(
    "Approved recharge saves processed time",
    sourceHas(
        "approveWorkerRecharge",
        "request.processedAt"
    )
);

test(
    "Admin recharge rejection function exists",
    typeof rejectWorkerRecharge === "function"
);

test(
    "Rejected recharge status is saved",
    sourceHas(
        "rejectWorkerRecharge",
        /request\.status\s*=\s*["']rejected["']/
    )
);
test(
    "Rejected recharge saves processed time",
    sourceHas(
        "rejectWorkerRecharge",
        "request.processedAt"
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
