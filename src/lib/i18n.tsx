import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type LangCode =
  | "en"
  | "kn"
  | "as"
  | "bn"
  | "bhil"
  | "bhum"
  | "brx"
  | "bodo"
  | "doi"
  | "garo"
  | "gond"
  | "gu"
  | "hi"
  | "ho"
  | "karb"
  | "ks"
  | "khan"
  | "khas"
  | "khon"
  | "kok"
  | "kony"
  | "kork"
  | "koya"
  | "kuru"
  | "mai"
  | "ml"
  | "mni"
  | "mr"
  | "mizo"
  | "mund"
  | "muri"
  | "ne"
  | "or"
  | "pa"
  | "regi"
  | "regi52"
  | "regi53"
  | "regi54"
  | "regi55"
  | "regi56"
  | "regi57"
  | "regi58"
  | "regi59"
  | "regi60"
  | "regi61"
  | "regi44"
  | "regi62"
  | "regi63"
  | "regi64"
  | "regi65"
  | "regi66"
  | "regi67"
  | "regi68"
  | "regi69"
  | "regi70"
  | "regi71"
  | "regi45"
  | "regi72"
  | "regi73"
  | "regi74"
  | "regi75"
  | "regi76"
  | "regi77"
  | "regi78"
  | "regi79"
  | "regi80"
  | "regi81"
  | "regi46"
  | "regi82"
  | "regi83"
  | "regi84"
  | "regi85"
  | "regi86"
  | "regi87"
  | "regi88"
  | "regi89"
  | "regi90"
  | "regi91"
  | "regi47"
  | "regi92"
  | "regi93"
  | "regi94"
  | "regi95"
  | "regi96"
  | "regi97"
  | "regi98"
  | "regi99"
  | "regi100"
  | "regi101"
  | "regi48"
  | "regi102"
  | "regi103"
  | "regi104"
  | "regi105"
  | "regi106"
  | "regi107"
  | "regi108"
  | "regi109"
  | "regi110"
  | "regi111"
  | "regi49"
  | "regi112"
  | "regi113"
  | "regi114"
  | "regi115"
  | "regi116"
  | "regi117"
  | "regi118"
  | "regi119"
  | "regi120"
  | "regi50"
  | "regi51"
  | "sa"
  | "sat"
  | "sava"
  | "sd"
  | "ta"
  | "te"
  | "trip"
  | "tulu"
  | "ur";


export const LANGUAGES: { code: LangCode; label: string; native: string; bcp47: string }[] = [
  { code: "en", label: "English", native: "English", bcp47: "en-IN" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ", bcp47: "kn-IN" },
  { code: "as", label: "Assamese", native: "অসমীয়া", bcp47: "as-IN" },
  { code: "bn", label: "Bengali", native: "বাংলা", bcp47: "bn-IN" },
  { code: "bhil", label: "Bhili", native: "Bhili", bcp47: "en-IN" },
  { code: "bhum", label: "Bhumij", native: "Bhumij", bcp47: "en-IN" },
  { code: "brx", label: "Bodo", native: "बर'", bcp47: "brx-IN" },
  { code: "bodo", label: "Bodo", native: "Bodo", bcp47: "en-IN" },
  { code: "doi", label: "Dogri", native: "डोगरी", bcp47: "doi-IN" },
  { code: "garo", label: "Garo", native: "Garo", bcp47: "en-IN" },
  { code: "gond", label: "Gondi", native: "Gondi", bcp47: "en-IN" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", bcp47: "gu-IN" },
  { code: "hi", label: "Hindi", native: "हिन्दी", bcp47: "hi-IN" },
  { code: "ho", label: "Ho", native: "Ho", bcp47: "en-IN" },
  { code: "karb", label: "Karbi", native: "Karbi", bcp47: "en-IN" },
  { code: "ks", label: "Kashmiri", native: "कॉशुर", bcp47: "ks-IN" },
  { code: "khan", label: "Khandeshi", native: "Khandeshi", bcp47: "en-IN" },
  { code: "khas", label: "Khasi", native: "Khasi", bcp47: "en-IN" },
  { code: "khon", label: "Khond", native: "Khond", bcp47: "en-IN" },
  { code: "kok", label: "Konkani", native: "कोंकणी", bcp47: "kok-IN" },
  { code: "kony", label: "Konyak", native: "Konyak", bcp47: "en-IN" },
  { code: "kork", label: "Korku", native: "Korku", bcp47: "en-IN" },
  { code: "koya", label: "Koya", native: "Koya", bcp47: "en-IN" },
  { code: "kuru", label: "Kurukh", native: "Kurukh", bcp47: "en-IN" },
  { code: "mai", label: "Maithili", native: "मैथिली", bcp47: "mai-IN" },
  { code: "ml", label: "Malayalam", native: "മലയാളം", bcp47: "ml-IN" },
  { code: "mni", label: "Manipuri", native: "মৈতৈলোন্", bcp47: "mni-IN" },
  { code: "mr", label: "Marathi", native: "मराठी", bcp47: "mr-IN" },
  { code: "mizo", label: "Mizo", native: "Mizo", bcp47: "en-IN" },
  { code: "mund", label: "Munda", native: "Munda", bcp47: "en-IN" },
  { code: "muri", label: "Muria", native: "Muria", bcp47: "en-IN" },
  { code: "ne", label: "Nepali", native: "नेपाली", bcp47: "ne-IN" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ", bcp47: "or-IN" },
  { code: "pa", label: "Punjabi", native: "ਪੰਜਾਬੀ", bcp47: "pa-IN" },
  { code: "regi", label: "Regional Language 1", native: "Regional Language 1", bcp47: "en-IN" },
  { code: "regi52", label: "Regional Language 10", native: "Regional Language 10", bcp47: "en-IN" },
  { code: "regi53", label: "Regional Language 11", native: "Regional Language 11", bcp47: "en-IN" },
  { code: "regi54", label: "Regional Language 12", native: "Regional Language 12", bcp47: "en-IN" },
  { code: "regi55", label: "Regional Language 13", native: "Regional Language 13", bcp47: "en-IN" },
  { code: "regi56", label: "Regional Language 14", native: "Regional Language 14", bcp47: "en-IN" },
  { code: "regi57", label: "Regional Language 15", native: "Regional Language 15", bcp47: "en-IN" },
  { code: "regi58", label: "Regional Language 16", native: "Regional Language 16", bcp47: "en-IN" },
  { code: "regi59", label: "Regional Language 17", native: "Regional Language 17", bcp47: "en-IN" },
  { code: "regi60", label: "Regional Language 18", native: "Regional Language 18", bcp47: "en-IN" },
  { code: "regi61", label: "Regional Language 19", native: "Regional Language 19", bcp47: "en-IN" },
  { code: "regi44", label: "Regional Language 2", native: "Regional Language 2", bcp47: "en-IN" },
  { code: "regi62", label: "Regional Language 20", native: "Regional Language 20", bcp47: "en-IN" },
  { code: "regi63", label: "Regional Language 21", native: "Regional Language 21", bcp47: "en-IN" },
  { code: "regi64", label: "Regional Language 22", native: "Regional Language 22", bcp47: "en-IN" },
  { code: "regi65", label: "Regional Language 23", native: "Regional Language 23", bcp47: "en-IN" },
  { code: "regi66", label: "Regional Language 24", native: "Regional Language 24", bcp47: "en-IN" },
  { code: "regi67", label: "Regional Language 25", native: "Regional Language 25", bcp47: "en-IN" },
  { code: "regi68", label: "Regional Language 26", native: "Regional Language 26", bcp47: "en-IN" },
  { code: "regi69", label: "Regional Language 27", native: "Regional Language 27", bcp47: "en-IN" },
  { code: "regi70", label: "Regional Language 28", native: "Regional Language 28", bcp47: "en-IN" },
  { code: "regi71", label: "Regional Language 29", native: "Regional Language 29", bcp47: "en-IN" },
  { code: "regi45", label: "Regional Language 3", native: "Regional Language 3", bcp47: "en-IN" },
  { code: "regi72", label: "Regional Language 30", native: "Regional Language 30", bcp47: "en-IN" },
  { code: "regi73", label: "Regional Language 31", native: "Regional Language 31", bcp47: "en-IN" },
  { code: "regi74", label: "Regional Language 32", native: "Regional Language 32", bcp47: "en-IN" },
  { code: "regi75", label: "Regional Language 33", native: "Regional Language 33", bcp47: "en-IN" },
  { code: "regi76", label: "Regional Language 34", native: "Regional Language 34", bcp47: "en-IN" },
  { code: "regi77", label: "Regional Language 35", native: "Regional Language 35", bcp47: "en-IN" },
  { code: "regi78", label: "Regional Language 36", native: "Regional Language 36", bcp47: "en-IN" },
  { code: "regi79", label: "Regional Language 37", native: "Regional Language 37", bcp47: "en-IN" },
  { code: "regi80", label: "Regional Language 38", native: "Regional Language 38", bcp47: "en-IN" },
  { code: "regi81", label: "Regional Language 39", native: "Regional Language 39", bcp47: "en-IN" },
  { code: "regi46", label: "Regional Language 4", native: "Regional Language 4", bcp47: "en-IN" },
  { code: "regi82", label: "Regional Language 40", native: "Regional Language 40", bcp47: "en-IN" },
  { code: "regi83", label: "Regional Language 41", native: "Regional Language 41", bcp47: "en-IN" },
  { code: "regi84", label: "Regional Language 42", native: "Regional Language 42", bcp47: "en-IN" },
  { code: "regi85", label: "Regional Language 43", native: "Regional Language 43", bcp47: "en-IN" },
  { code: "regi86", label: "Regional Language 44", native: "Regional Language 44", bcp47: "en-IN" },
  { code: "regi87", label: "Regional Language 45", native: "Regional Language 45", bcp47: "en-IN" },
  { code: "regi88", label: "Regional Language 46", native: "Regional Language 46", bcp47: "en-IN" },
  { code: "regi89", label: "Regional Language 47", native: "Regional Language 47", bcp47: "en-IN" },
  { code: "regi90", label: "Regional Language 48", native: "Regional Language 48", bcp47: "en-IN" },
  { code: "regi91", label: "Regional Language 49", native: "Regional Language 49", bcp47: "en-IN" },
  { code: "regi47", label: "Regional Language 5", native: "Regional Language 5", bcp47: "en-IN" },
  { code: "regi92", label: "Regional Language 50", native: "Regional Language 50", bcp47: "en-IN" },
  { code: "regi93", label: "Regional Language 51", native: "Regional Language 51", bcp47: "en-IN" },
  { code: "regi94", label: "Regional Language 52", native: "Regional Language 52", bcp47: "en-IN" },
  { code: "regi95", label: "Regional Language 53", native: "Regional Language 53", bcp47: "en-IN" },
  { code: "regi96", label: "Regional Language 54", native: "Regional Language 54", bcp47: "en-IN" },
  { code: "regi97", label: "Regional Language 55", native: "Regional Language 55", bcp47: "en-IN" },
  { code: "regi98", label: "Regional Language 56", native: "Regional Language 56", bcp47: "en-IN" },
  { code: "regi99", label: "Regional Language 57", native: "Regional Language 57", bcp47: "en-IN" },
  { code: "regi100", label: "Regional Language 58", native: "Regional Language 58", bcp47: "en-IN" },
  { code: "regi101", label: "Regional Language 59", native: "Regional Language 59", bcp47: "en-IN" },
  { code: "regi48", label: "Regional Language 6", native: "Regional Language 6", bcp47: "en-IN" },
  { code: "regi102", label: "Regional Language 60", native: "Regional Language 60", bcp47: "en-IN" },
  { code: "regi103", label: "Regional Language 61", native: "Regional Language 61", bcp47: "en-IN" },
  { code: "regi104", label: "Regional Language 62", native: "Regional Language 62", bcp47: "en-IN" },
  { code: "regi105", label: "Regional Language 63", native: "Regional Language 63", bcp47: "en-IN" },
  { code: "regi106", label: "Regional Language 64", native: "Regional Language 64", bcp47: "en-IN" },
  { code: "regi107", label: "Regional Language 65", native: "Regional Language 65", bcp47: "en-IN" },
  { code: "regi108", label: "Regional Language 66", native: "Regional Language 66", bcp47: "en-IN" },
  { code: "regi109", label: "Regional Language 67", native: "Regional Language 67", bcp47: "en-IN" },
  { code: "regi110", label: "Regional Language 68", native: "Regional Language 68", bcp47: "en-IN" },
  { code: "regi111", label: "Regional Language 69", native: "Regional Language 69", bcp47: "en-IN" },
  { code: "regi49", label: "Regional Language 7", native: "Regional Language 7", bcp47: "en-IN" },
  { code: "regi112", label: "Regional Language 70", native: "Regional Language 70", bcp47: "en-IN" },
  { code: "regi113", label: "Regional Language 71", native: "Regional Language 71", bcp47: "en-IN" },
  { code: "regi114", label: "Regional Language 72", native: "Regional Language 72", bcp47: "en-IN" },
  { code: "regi115", label: "Regional Language 73", native: "Regional Language 73", bcp47: "en-IN" },
  { code: "regi116", label: "Regional Language 74", native: "Regional Language 74", bcp47: "en-IN" },
  { code: "regi117", label: "Regional Language 75", native: "Regional Language 75", bcp47: "en-IN" },
  { code: "regi118", label: "Regional Language 76", native: "Regional Language 76", bcp47: "en-IN" },
  { code: "regi119", label: "Regional Language 77", native: "Regional Language 77", bcp47: "en-IN" },
  { code: "regi120", label: "Regional Language 78", native: "Regional Language 78", bcp47: "en-IN" },
  { code: "regi50", label: "Regional Language 8", native: "Regional Language 8", bcp47: "en-IN" },
  { code: "regi51", label: "Regional Language 9", native: "Regional Language 9", bcp47: "en-IN" },
  { code: "sa", label: "Sanskrit", native: "संस्कृतम्", bcp47: "sa-IN" },
  { code: "sat", label: "Santali", native: "ᱥᱟᱱᱛᱟᱲᱤ", bcp47: "sat-IN" },
  { code: "sava", label: "Savara", native: "Savara", bcp47: "en-IN" },
  { code: "sd", label: "Sindhi", native: "سنڌي", bcp47: "sd-IN" },
  { code: "ta", label: "Tamil", native: "தமிழ்", bcp47: "ta-IN" },
  { code: "te", label: "Telugu", native: "తెలుగు", bcp47: "te-IN" },
  { code: "trip", label: "Tripuri", native: "Tripuri", bcp47: "en-IN" },
  { code: "tulu", label: "Tulu", native: "Tulu", bcp47: "en-IN" },
  { code: "ur", label: "Urdu", native: "اردو", bcp47: "ur-IN" },
];


type Dict = Record<string, string>;

const en: Dict = {
  appName: "GO FARM WORK",
  tagline: "Farm work. Fair pay. Safe money.",
  findWork: "Find work",
  postWork: "Post work",
  myJobs: "My jobs",
  earnings: "My earnings",
  messages: "Messages",
  assistant: "Farmhand AI",
  wallet: "Wallet",
  profile: "Profile",
  worker: "Worker",
  landlord: "Farm owner",
  continue: "Continue",
  signIn: "Sign in",
  signUp: "Create account",
  signOut: "Sign out",
  email: "Email",
  password: "Password",
  name: "Your name",
  phone: "Phone number",
  village: "Village",
  district: "District",
  chooseLanguage: "Choose your language",
  iAm: "I am a",
  apply: "Apply",
  applied: "Applied",
  hire: "Hire",
  chat: "Chat",
  listen: "Listen",
  speak: "Speak",
  perDay: "per day",
  perAcre: "per acre",
  fixed: "fixed",
  jobsNearYou: "Work near you",
  noJobs: "No work posted yet",
  applicants: "Applicants",
  moneyLocked: "Money locked safely",
  foodProvided: "Food",
  stayProvided: "Stay",
  transportProvided: "Transport",
  toolsProvided: "Tools",
  womenFriendly: "Women friendly",
  save: "Save",
  back: "Back",
  today: "Today",
  workers: "Workers",
  balance: "Balance",
  inEscrow: "Locked in escrow",
  askAnything: "Ask anything about work, wages or farming",
  send: "Send",

  // Actions
  share: "Share",
  shareOnWhatsApp: "Share on WhatsApp",
  chatOnWhatsApp: "Chat on WhatsApp",
  confirmHireOnWhatsApp: "Confirm hire on WhatsApp",
  confirmPaymentOnWhatsApp: "Confirm payment on WhatsApp",
  copyLink: "Copy link",
  linkCopied: "Link copied",
  retry: "Try again",
  cancel: "Cancel",
  confirm: "Confirm",
  yes: "Yes",
  no: "No",
  next: "Next",
  previous: "Previous",
  repeat: "Repeat",
  loading: "Loading…",

  // Statuses
  statusOpen: "Open",
  statusInProgress: "In progress",
  statusCompleted: "Completed",
  statusCancelled: "Cancelled",
  statusApplied: "Applied",
  statusPending: "Pending",
  statusHired: "Hired",
  statusRejected: "Not selected",
  statusPaid: "Paid",
  statusFunded: "Money locked",

  // Voice flow
  voiceMode: "Voice mode",
  voiceModeOn: "Voice mode on",
  voiceModeOff: "Voice mode off",
  voiceHelp: "Say next, repeat, save or apply. You can also tap the buttons below.",
  voicePromptJob: "Here is the work.",
  voicePromptAsk: "Do you want to apply? Say yes or no.",
  voiceConfirmApply: "Your application is sent.",
  voiceNoMore: "That is all the work near you for now.",
  voiceNotSupported: "Voice is not available on this phone. Please use the buttons.",
  textFallback: "Prefer typing? Use the buttons and search box below.",
  listening: "Listening…",

  // Empty states
  emptyJobsTitle: "No work posted yet",
  emptyJobsBody: "New farm work near your village will show up here. Set a job alert so we tell you first.",
  emptyJobsCta: "Create a job alert",
  emptySavedTitle: "No saved work yet",
  emptySavedBody: "Tap the bookmark on any job to keep it here and decide later.",
  emptySavedCta: "Browse work",
  emptyMessagesTitle: "No messages yet",
  emptyMessagesBody: "When you apply or hire, your chat with the other person starts here.",
  emptyMessagesCta: "Find work",
  emptyApplicantsTitle: "No applicants yet",
  emptyApplicantsBody: "Share this job on WhatsApp so workers near you can see it.",
  emptyNotificationsTitle: "No notifications yet",
  emptyNotificationsBody: "Job alerts, application updates and payment news will appear here.",
};


const hi: Dict = {
  appName: "गो फ़ार्म वर्क",
  tagline: "खेत का काम। सही मज़दूरी। सुरक्षित पैसा।",
  findWork: "काम खोजें",
  postWork: "काम डालें",
  myJobs: "मेरे काम",
  earnings: "मेरी कमाई",
  messages: "संदेश",
  assistant: "फ़ार्महैंड सहायक",
  wallet: "बटुआ",
  profile: "प्रोफ़ाइल",
  worker: "मज़दूर",
  landlord: "खेत मालिक",
  continue: "आगे बढ़ें",
  signIn: "लॉग इन",
  signUp: "खाता बनाएँ",
  signOut: "लॉग आउट",
  email: "ईमेल",
  password: "पासवर्ड",
  name: "आपका नाम",
  phone: "मोबाइल नंबर",
  village: "गाँव",
  district: "ज़िला",
  chooseLanguage: "अपनी भाषा चुनें",
  iAm: "मैं हूँ",
  apply: "आवेदन करें",
  applied: "आवेदन हो गया",
  hire: "काम पर रखें",
  chat: "बात करें",
  listen: "सुनें",
  speak: "बोलें",
  perDay: "प्रति दिन",
  perAcre: "प्रति एकड़",
  fixed: "तय रकम",
  jobsNearYou: "आपके पास का काम",
  noJobs: "अभी कोई काम नहीं",
  applicants: "आवेदक",
  moneyLocked: "पैसा सुरक्षित रखा गया",
  foodProvided: "खाना",
  stayProvided: "रहना",
  transportProvided: "आना-जाना",
  toolsProvided: "औज़ार",
  womenFriendly: "महिलाओं के लिए",
  save: "सहेजें",
  back: "वापस",
  today: "आज",
  workers: "मज़दूर",
  balance: "बाकी रकम",
  inEscrow: "सुरक्षित रखा पैसा",
  askAnything: "काम, मज़दूरी या खेती के बारे में पूछें",
  send: "भेजें",

  share: "साझा करें",
  shareOnWhatsApp: "व्हाट्सएप पर भेजें",
  chatOnWhatsApp: "व्हाट्सएप पर बात करें",
  confirmHireOnWhatsApp: "व्हाट्सएप पर काम पक्का करें",
  confirmPaymentOnWhatsApp: "व्हाट्सएप पर भुगतान पक्का करें",
  copyLink: "लिंक कॉपी करें",
  linkCopied: "लिंक कॉपी हो गया",
  retry: "फिर कोशिश करें",
  cancel: "रद्द करें",
  confirm: "पक्का करें",
  yes: "हाँ",
  no: "नहीं",
  next: "अगला",
  previous: "पिछला",
  repeat: "दोबारा",
  loading: "लोड हो रहा है…",

  statusOpen: "खुला",
  statusInProgress: "चल रहा है",
  statusCompleted: "पूरा हुआ",
  statusCancelled: "रद्द",
  statusApplied: "आवेदन हो गया",
  statusPending: "इंतज़ार में",
  statusHired: "काम पर रखा",
  statusRejected: "चुना नहीं गया",
  statusPaid: "भुगतान हुआ",
  statusFunded: "पैसा सुरक्षित",

  voiceMode: "आवाज़ मोड",
  voiceModeOn: "आवाज़ मोड चालू",
  voiceModeOff: "आवाज़ मोड बंद",
  voiceHelp: "कहें: अगला, दोबारा, सहेजें या आवेदन। आप नीचे बटन भी दबा सकते हैं।",
  voicePromptJob: "यह रहा काम।",
  voicePromptAsk: "क्या आप आवेदन करना चाहते हैं? हाँ या नहीं कहें।",
  voiceConfirmApply: "आपका आवेदन भेज दिया गया है।",
  voiceNoMore: "अभी आपके पास इतना ही काम है।",
  voiceNotSupported: "इस फ़ोन पर आवाज़ काम नहीं करती। कृपया बटन दबाएँ।",
  textFallback: "लिखना पसंद है? नीचे बटन और खोज बॉक्स का उपयोग करें।",
  listening: "सुन रहे हैं…",

  emptyJobsTitle: "अभी कोई काम नहीं",
  emptyJobsBody: "आपके गाँव के पास नया काम यहाँ दिखेगा। अलर्ट बनाइए, हम सबसे पहले बताएँगे।",
  emptyJobsCta: "काम का अलर्ट बनाएँ",
  emptySavedTitle: "अभी कुछ सहेजा नहीं",
  emptySavedBody: "किसी भी काम पर बुकमार्क दबाएँ, वह यहाँ रहेगा।",
  emptySavedCta: "काम देखें",
  emptyMessagesTitle: "अभी कोई संदेश नहीं",
  emptyMessagesBody: "आवेदन या काम पर रखने के बाद बातचीत यहाँ शुरू होगी।",
  emptyMessagesCta: "काम खोजें",
  emptyApplicantsTitle: "अभी कोई आवेदक नहीं",
  emptyApplicantsBody: "इस काम को व्हाट्सएप पर भेजें ताकि पास के मज़दूर देख सकें।",
  emptyNotificationsTitle: "अभी कोई सूचना नहीं",
  emptyNotificationsBody: "काम के अलर्ट, आवेदन और भुगतान की खबर यहाँ आएगी।",
};


const mr: Dict = {
  appName: "गो फार्म वर्क",
  tagline: "शेतीचे काम. योग्य मजुरी. सुरक्षित पैसा.",
  findWork: "काम शोधा",
  postWork: "काम टाका",
  myJobs: "माझी कामे",
  earnings: "माझी कमाई",
  messages: "संदेश",
  assistant: "फार्महँड मदतनीस",
  wallet: "पाकीट",
  profile: "प्रोफाइल",
  worker: "मजूर",
  landlord: "शेतमालक",
  continue: "पुढे",
  signIn: "लॉग इन",
  signUp: "खाते तयार करा",
  signOut: "बाहेर पडा",
  email: "ईमेल",
  password: "पासवर्ड",
  name: "तुमचे नाव",
  phone: "मोबाइल नंबर",
  village: "गाव",
  district: "जिल्हा",
  chooseLanguage: "तुमची भाषा निवडा",
  iAm: "मी आहे",
  apply: "अर्ज करा",
  applied: "अर्ज केला",
  hire: "कामावर घ्या",
  chat: "बोला",
  listen: "ऐका",
  speak: "बोला",
  perDay: "प्रति दिवस",
  perAcre: "प्रति एकर",
  fixed: "ठरलेली रक्कम",
  jobsNearYou: "जवळचे काम",
  noJobs: "अजून काम नाही",
  applicants: "अर्जदार",
  moneyLocked: "पैसे सुरक्षित",
  foodProvided: "जेवण",
  stayProvided: "राहणे",
  transportProvided: "वाहतूक",
  toolsProvided: "अवजारे",
  womenFriendly: "महिलांसाठी",
  save: "जतन करा",
  back: "मागे",
  today: "आज",
  workers: "मजूर",
  balance: "शिल्लक",
  inEscrow: "सुरक्षित ठेवलेले",
  askAnything: "काम, मजुरी किंवा शेतीबद्दल विचारा",
  send: "पाठवा",
};

const ta: Dict = {
  appName: "கோ ஃபார்ம் வொர்க்",
  tagline: "பண்ணை வேலை. நியாயமான கூலி. பாதுகாப்பான பணம்.",
  findWork: "வேலை தேடு",
  postWork: "வேலை போடு",
  myJobs: "என் வேலைகள்",
  earnings: "என் வருமானம்",
  messages: "செய்திகள்",
  assistant: "ஃபார்ம்ஹேண்ட் உதவியாளர்",
  wallet: "பணப்பை",
  profile: "சுயவிவரம்",
  worker: "தொழிலாளி",
  landlord: "நில உரிமையாளர்",
  continue: "தொடரவும்",
  signIn: "உள்நுழை",
  signUp: "கணக்கு உருவாக்கு",
  signOut: "வெளியேறு",
  email: "மின்னஞ்சல்",
  password: "கடவுச்சொல்",
  name: "உங்கள் பெயர்",
  phone: "கைபேசி எண்",
  village: "கிராமம்",
  district: "மாவட்டம்",
  chooseLanguage: "உங்கள் மொழியை தேர்வு செய்யவும்",
  iAm: "நான்",
  apply: "விண்ணப்பி",
  applied: "விண்ணப்பித்தாகிவிட்டது",
  hire: "வேலைக்கு எடு",
  chat: "பேசு",
  listen: "கேள்",
  speak: "பேசு",
  perDay: "ஒரு நாளுக்கு",
  perAcre: "ஏக்கருக்கு",
  fixed: "நிரந்தரத் தொகை",
  jobsNearYou: "அருகில் உள்ள வேலை",
  noJobs: "இப்போது வேலை இல்லை",
  applicants: "விண்ணப்பதாரர்கள்",
  moneyLocked: "பணம் பாதுகாப்பாக உள்ளது",
  foodProvided: "உணவு",
  stayProvided: "தங்குமிடம்",
  transportProvided: "வாகனம்",
  toolsProvided: "கருவிகள்",
  womenFriendly: "பெண்களுக்கு ஏற்றது",
  save: "சேமி",
  back: "பின்",
  today: "இன்று",
  workers: "தொழிலாளர்கள்",
  balance: "இருப்பு",
  inEscrow: "பாதுகாப்பில் உள்ளது",
  askAnything: "வேலை, கூலி அல்லது விவசாயம் பற்றி கேளுங்கள்",
  send: "அனுப்பு",
};

const te: Dict = {
  appName: "గో ఫార్మ్ వర్క్",
  tagline: "వ్యవసాయ పని. న్యాయమైన కూలి. సురక్షిత డబ్బు.",
  findWork: "పని వెతకండి",
  postWork: "పని పెట్టండి",
  myJobs: "నా పనులు",
  earnings: "నా సంపాదన",
  messages: "సందేశాలు",
  assistant: "ఫార్మ్‌హ్యాండ్ సహాయకుడు",
  wallet: "వాలెట్",
  profile: "ప్రొఫైల్",
  worker: "కూలీ",
  landlord: "భూ యజమాని",
  continue: "కొనసాగించు",
  signIn: "లాగిన్",
  signUp: "ఖాతా సృష్టించు",
  signOut: "బయటకు",
  email: "ఈమెయిల్",
  password: "పాస్‌వర్డ్",
  name: "మీ పేరు",
  phone: "ఫోన్ నంబర్",
  village: "గ్రామం",
  district: "జిల్లా",
  chooseLanguage: "మీ భాషను ఎంచుకోండి",
  iAm: "నేను",
  apply: "దరఖాస్తు",
  applied: "దరఖాస్తు చేశారు",
  hire: "పనికి తీసుకో",
  chat: "మాట్లాడు",
  listen: "వినండి",
  speak: "మాట్లాడండి",
  perDay: "రోజుకు",
  perAcre: "ఎకరానికి",
  fixed: "నిర్ణీత మొత్తం",
  jobsNearYou: "దగ్గరలో పని",
  noJobs: "ఇంకా పని లేదు",
  applicants: "దరఖాస్తుదారులు",
  moneyLocked: "డబ్బు సురక్షితం",
  foodProvided: "ఆహారం",
  stayProvided: "వసతి",
  transportProvided: "రవాణా",
  toolsProvided: "పనిముట్లు",
  womenFriendly: "మహిళలకు అనుకూలం",
  save: "సేవ్",
  back: "వెనక్కి",
  today: "ఈరోజు",
  workers: "కూలీలు",
  balance: "నిల్వ",
  inEscrow: "భద్రపరిచిన డబ్బు",
  askAnything: "పని, కూలి లేదా వ్యవసాయం గురించి అడగండి",
  send: "పంపు",
};

const kn: Dict = {
  appName: "ಗೋ ಫಾರ್ಮ್ ವರ್ಕ್",
  tagline: "ಕೃಷಿ ಕೆಲಸ. ನ್ಯಾಯಯುತ ಕೂಲಿ. ಸುರಕ್ಷಿತ ಹಣ.",
  findWork: "ಕೆಲಸ ಹುಡುಕಿ",
  postWork: "ಕೆಲಸ ಹಾಕಿ",
  myJobs: "ನನ್ನ ಕೆಲಸಗಳು",
  earnings: "ನನ್ನ ಗಳಿಕೆ",
  messages: "ಸಂದೇಶಗಳು",
  assistant: "ಫಾರ್ಮ್‌ಹ್ಯಾಂಡ್ ಸಹಾಯಕ",
  wallet: "ವಾಲೆಟ್",
  profile: "ಪ್ರೊಫೈಲ್",
  worker: "ಕಾರ್ಮಿಕ",
  landlord: "ಜಮೀನು ಮಾಲೀಕ",
  continue: "ಮುಂದುವರಿಸಿ",
  signIn: "ಲಾಗಿನ್",
  signUp: "ಖಾತೆ ತೆರೆಯಿರಿ",
  signOut: "ಹೊರಹೋಗಿ",
  email: "ಇಮೇಲ್",
  password: "ಪಾಸ್‌ವರ್ಡ್",
  name: "ನಿಮ್ಮ ಹೆಸರು",
  phone: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
  village: "ಹಳ್ಳಿ",
  district: "ಜಿಲ್ಲೆ",
  chooseLanguage: "ನಿಮ್ಮ ಭಾಷೆ ಆರಿಸಿ",
  iAm: "ನಾನು",
  apply: "ಅರ್ಜಿ ಹಾಕಿ",
  applied: "ಅರ್ಜಿ ಹಾಕಲಾಗಿದೆ",
  hire: "ಕೆಲಸಕ್ಕೆ ತೆಗೆದುಕೊಳ್ಳಿ",
  chat: "ಮಾತನಾಡಿ",
  listen: "ಕೇಳಿ",
  speak: "ಮಾತನಾಡಿ",
  perDay: "ದಿನಕ್ಕೆ",
  perAcre: "ಎಕರೆಗೆ",
  fixed: "ನಿಗದಿತ ಮೊತ್ತ",
  jobsNearYou: "ಹತ್ತಿರದ ಕೆಲಸ",
  noJobs: "ಇನ್ನೂ ಕೆಲಸ ಇಲ್ಲ",
  applicants: "ಅರ್ಜಿದಾರರು",
  moneyLocked: "ಹಣ ಸುರಕ್ಷಿತ",
  foodProvided: "ಊಟ",
  stayProvided: "ವಸತಿ",
  transportProvided: "ಸಾರಿಗೆ",
  toolsProvided: "ಸಲಕರಣೆ",
  womenFriendly: "ಮಹಿಳೆಯರಿಗೆ ಸೂಕ್ತ",
  save: "ಉಳಿಸಿ",
  back: "ಹಿಂದೆ",
  today: "ಇಂದು",
  workers: "ಕಾರ್ಮಿಕರು",
  balance: "ಬಾಕಿ",
  inEscrow: "ಭದ್ರವಾಗಿ ಇಟ್ಟ ಹಣ",
  askAnything: "ಕೆಲಸ, ಕೂಲಿ ಅಥವಾ ಕೃಷಿ ಬಗ್ಗೆ ಕೇಳಿ",
  send: "ಕಳುಹಿಸಿ",
};

const bn: Dict = {
  appName: "গো ফার্ম ওয়ার্ক",
  tagline: "খেতের কাজ। ন্যায্য মজুরি। নিরাপদ টাকা।",
  findWork: "কাজ খুঁজুন",
  postWork: "কাজ দিন",
  myJobs: "আমার কাজ",
  earnings: "আমার আয়",
  messages: "বার্তা",
  assistant: "ফার্মহ্যান্ড সহায়ক",
  wallet: "ওয়ালেট",
  profile: "প্রোফাইল",
  worker: "শ্রমিক",
  landlord: "জমির মালিক",
  continue: "এগিয়ে যান",
  signIn: "লগ ইন",
  signUp: "অ্যাকাউন্ট খুলুন",
  signOut: "বেরিয়ে যান",
  email: "ইমেইল",
  password: "পাসওয়ার্ড",
  name: "আপনার নাম",
  phone: "মোবাইল নম্বর",
  village: "গ্রাম",
  district: "জেলা",
  chooseLanguage: "আপনার ভাষা বাছুন",
  iAm: "আমি",
  apply: "আবেদন করুন",
  applied: "আবেদন হয়েছে",
  hire: "কাজে নিন",
  chat: "কথা বলুন",
  listen: "শুনুন",
  speak: "বলুন",
  perDay: "প্রতিদিন",
  perAcre: "প্রতি একর",
  fixed: "নির্দিষ্ট টাকা",
  jobsNearYou: "কাছের কাজ",
  noJobs: "এখনও কাজ নেই",
  applicants: "আবেদনকারী",
  moneyLocked: "টাকা নিরাপদে আছে",
  foodProvided: "খাবার",
  stayProvided: "থাকা",
  transportProvided: "যাতায়াত",
  toolsProvided: "যন্ত্রপাতি",
  womenFriendly: "মহিলাদের জন্য",
  save: "সংরক্ষণ",
  back: "পিছনে",
  today: "আজ",
  workers: "শ্রমিক",
  balance: "বাকি টাকা",
  inEscrow: "সুরক্ষিত টাকা",
  askAnything: "কাজ, মজুরি বা চাষ নিয়ে জিজ্ঞাসা করুন",
  send: "পাঠান",
};

const pa: Dict = {
  appName: "ਗੋ ਫਾਰਮ ਵਰਕ",
  tagline: "ਖੇਤ ਦਾ ਕੰਮ। ਸਹੀ ਦਿਹਾੜੀ। ਸੁਰੱਖਿਅਤ ਪੈਸਾ।",
  findWork: "ਕੰਮ ਲੱਭੋ",
  postWork: "ਕੰਮ ਪਾਓ",
  myJobs: "ਮੇਰੇ ਕੰਮ",
  earnings: "ਮੇਰੀ ਕਮਾਈ",
  messages: "ਸੁਨੇਹੇ",
  assistant: "ਫਾਰਮਹੈਂਡ ਸਹਾਇਕ",
  wallet: "ਬਟੂਆ",
  profile: "ਪ੍ਰੋਫਾਈਲ",
  worker: "ਮਜ਼ਦੂਰ",
  landlord: "ਜ਼ਿਮੀਂਦਾਰ",
  continue: "ਅੱਗੇ",
  signIn: "ਲਾਗਇਨ",
  signUp: "ਖਾਤਾ ਬਣਾਓ",
  signOut: "ਬਾਹਰ",
  email: "ਈਮੇਲ",
  password: "ਪਾਸਵਰਡ",
  name: "ਤੁਹਾਡਾ ਨਾਮ",
  phone: "ਮੋਬਾਈਲ ਨੰਬਰ",
  village: "ਪਿੰਡ",
  district: "ਜ਼ਿਲ੍ਹਾ",
  chooseLanguage: "ਆਪਣੀ ਭਾਸ਼ਾ ਚੁਣੋ",
  iAm: "ਮੈਂ ਹਾਂ",
  apply: "ਅਰਜ਼ੀ ਦਿਓ",
  applied: "ਅਰਜ਼ੀ ਦਿੱਤੀ",
  hire: "ਕੰਮ ਤੇ ਰੱਖੋ",
  chat: "ਗੱਲ ਕਰੋ",
  listen: "ਸੁਣੋ",
  speak: "ਬੋਲੋ",
  perDay: "ਪ੍ਰਤੀ ਦਿਨ",
  perAcre: "ਪ੍ਰਤੀ ਏਕੜ",
  fixed: "ਤੈਅ ਰਕਮ",
  jobsNearYou: "ਨੇੜੇ ਦਾ ਕੰਮ",
  noJobs: "ਹਾਲੇ ਕੋਈ ਕੰਮ ਨਹੀਂ",
  applicants: "ਅਰਜ਼ੀਕਾਰ",
  moneyLocked: "ਪੈਸਾ ਸੁਰੱਖਿਅਤ",
  foodProvided: "ਖਾਣਾ",
  stayProvided: "ਰਹਿਣਾ",
  transportProvided: "ਆਵਾਜਾਈ",
  toolsProvided: "ਸੰਦ",
  womenFriendly: "ਔਰਤਾਂ ਲਈ",
  save: "ਸੰਭਾਲੋ",
  back: "ਪਿੱਛੇ",
  today: "ਅੱਜ",
  workers: "ਮਜ਼ਦੂਰ",
  balance: "ਬਕਾਇਆ",
  inEscrow: "ਰੱਖਿਅਤ ਪੈਸਾ",
  askAnything: "ਕੰਮ, ਦਿਹਾੜੀ ਜਾਂ ਖੇਤੀ ਬਾਰੇ ਪੁੱਛੋ",
  send: "ਭੇਜੋ",
};

const gu: Dict = {
  appName: "ગો ફાર્મ વર્ક",
  tagline: "ખેતીનું કામ. વાજબી મજૂરી. સલામત પૈસા.",
  findWork: "કામ શોધો",
  postWork: "કામ મૂકો",
  myJobs: "મારા કામ",
  earnings: "મારી કમાણી",
  messages: "સંદેશા",
  assistant: "ફાર્મહેન્ડ સહાયક",
  wallet: "વૉલેટ",
  profile: "પ્રોફાઇલ",
  worker: "મજૂર",
  landlord: "ખેત માલિક",
  continue: "આગળ",
  signIn: "લોગિન",
  signUp: "ખાતું બનાવો",
  signOut: "બહાર",
  email: "ઈમેલ",
  password: "પાસવર્ડ",
  name: "તમારું નામ",
  phone: "મોબાઇલ નંબર",
  village: "ગામ",
  district: "જિલ્લો",
  chooseLanguage: "તમારી ભાષા પસંદ કરો",
  iAm: "હું છું",
  apply: "અરજી કરો",
  applied: "અરજી થઈ",
  hire: "કામે રાખો",
  chat: "વાત કરો",
  listen: "સાંભળો",
  speak: "બોલો",
  perDay: "પ્રતિ દિવસ",
  perAcre: "પ્રતિ એકર",
  fixed: "નક્કી રકમ",
  jobsNearYou: "નજીકનું કામ",
  noJobs: "હજી કામ નથી",
  applicants: "અરજદારો",
  moneyLocked: "પૈસા સલામત",
  foodProvided: "ભોજન",
  stayProvided: "રહેવાનું",
  transportProvided: "વાહન",
  toolsProvided: "ઓજાર",
  womenFriendly: "મહિલાઓ માટે",
  save: "સાચવો",
  back: "પાછળ",
  today: "આજે",
  workers: "મજૂરો",
  balance: "બાકી",
  inEscrow: "સુરક્ષિત રકમ",
  askAnything: "કામ, મજૂરી કે ખેતી વિશે પૂછો",
  send: "મોકલો",
};

const ml: Dict = {
  ...en,
  appName: "ഗോ ഫാം വർക്ക്",
  tagline: "കൃഷിപ്പണി. ന്യായമായ കൂലി. സുരക്ഷിത പണം.",
  findWork: "ജോലി തിരയുക",
  postWork: "ജോലി ഇടുക",
  myJobs: "എന്റെ ജോലികൾ",
  earnings: "എന്റെ വരുമാനം",
  messages: "സന്ദേശങ്ങൾ",
  wallet: "വാലറ്റ്",
  worker: "തൊഴിലാളി",
  landlord: "കൃഷിയുടമ",
  apply: "അപേക്ഷിക്കുക",
  listen: "കേൾക്കുക",
  speak: "പറയുക",
  perDay: "ഒരു ദിവസത്തിന്",
  jobsNearYou: "അടുത്തുള്ള ജോലി",
};

const or: Dict = {
  ...en,
  appName: "ଗୋ ଫାର୍ମ ୱାର୍କ",
  tagline: "ଚାଷ କାମ। ଠିକ୍ ମଜୁରି। ସୁରକ୍ଷିତ ଟଙ୍କା।",
  findWork: "କାମ ଖୋଜନ୍ତୁ",
  postWork: "କାମ ଦିଅନ୍ତୁ",
  myJobs: "ମୋ କାମ",
  earnings: "ମୋ ଆୟ",
  worker: "ଶ୍ରମିକ",
  landlord: "ଜମି ମାଲିକ",
  apply: "ଆବେଦନ କରନ୍ତୁ",
  listen: "ଶୁଣନ୍ତୁ",
  speak: "କୁହନ୍ତୁ",
  jobsNearYou: "ପାଖରେ କାମ",
};

const as: Dict = {
  ...en,
  appName: "গো ফাৰ্ম ৱৰ্ক",
  tagline: "খেতিৰ কাম। ন্যায্য মজুৰি। নিৰাপদ ধন।",
  findWork: "কাম বিচাৰক",
  postWork: "কাম দিয়ক",
  myJobs: "মোৰ কাম",
  earnings: "মোৰ উপাৰ্জন",
  worker: "শ্ৰমিক",
  landlord: "মাটিৰ গৰাকী",
  apply: "আবেদন কৰক",
  listen: "শুনক",
  speak: "কওক",
  jobsNearYou: "ওচৰৰ কাম",
};

const ur: Dict = {
  ...en,
  appName: "گو فارم ورک",
  tagline: "کھیت کا کام۔ مناسب اجرت۔ محفوظ پیسہ۔",
  findWork: "کام تلاش کریں",
  postWork: "کام ڈالیں",
  myJobs: "میرے کام",
  earnings: "میری کمائی",
  worker: "مزدور",
  landlord: "زمیندار",
  apply: "درخواست دیں",
  listen: "سنیں",
  speak: "بولیں",
  jobsNearYou: "قریب کا کام",
};

const DICTS: Record<LangCode, Dict> = { en, kn, as, bn, "bhil": en, "bhum": en, "brx": en, "bodo": en, "doi": en, "garo": en, "gond": en, gu, hi, "ho": en, "karb": en, "ks": en, "khan": en, "khas": en, "khon": en, "kok": en, "kony": en, "kork": en, "koya": en, "kuru": en, "mai": en, ml, "mni": en, mr, "mizo": en, "mund": en, "muri": en, "ne": en, or, pa, "regi": en, "regi52": en, "regi53": en, "regi54": en, "regi55": en, "regi56": en, "regi57": en, "regi58": en, "regi59": en, "regi60": en, "regi61": en, "regi44": en, "regi62": en, "regi63": en, "regi64": en, "regi65": en, "regi66": en, "regi67": en, "regi68": en, "regi69": en, "regi70": en, "regi71": en, "regi45": en, "regi72": en, "regi73": en, "regi74": en, "regi75": en, "regi76": en, "regi77": en, "regi78": en, "regi79": en, "regi80": en, "regi81": en, "regi46": en, "regi82": en, "regi83": en, "regi84": en, "regi85": en, "regi86": en, "regi87": en, "regi88": en, "regi89": en, "regi90": en, "regi91": en, "regi47": en, "regi92": en, "regi93": en, "regi94": en, "regi95": en, "regi96": en, "regi97": en, "regi98": en, "regi99": en, "regi100": en, "regi101": en, "regi48": en, "regi102": en, "regi103": en, "regi104": en, "regi105": en, "regi106": en, "regi107": en, "regi108": en, "regi109": en, "regi110": en, "regi111": en, "regi49": en, "regi112": en, "regi113": en, "regi114": en, "regi115": en, "regi116": en, "regi117": en, "regi118": en, "regi119": en, "regi120": en, "regi50": en, "regi51": en, "sa": en, "sat": en, "sava": en, "sd": en, ta, te, "trip": en, "tulu": en, ur };


const STORAGE_KEY = "gfw.lang";

type I18nValue = {
  lang: LangCode;
  setLang: (l: LangCode) => void;
  t: (key: keyof typeof en | string) => string;
  bcp47: string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (stored && DICTS[stored]) setLangState(stored);
  }, []);

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string) => DICTS[lang]?.[key] ?? en[key] ?? key,
    [lang],
  );

  const bcp47 = useMemo(
    () => LANGUAGES.find((l) => l.code === lang)?.bcp47 ?? "en-IN",
    [lang],
  );

  return (
    <I18nContext.Provider value={{ lang, setLang, t, bcp47 }}>{children}</I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
