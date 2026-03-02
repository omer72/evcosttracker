export type Language = "he" | "en";

export const translations = {
  // General
  loading: { he: "טוען...", en: "Loading..." },
  back: { he: "חזרה", en: "Back" },
  cancel: { he: "ביטול", en: "Cancel" },
  delete: { he: "מחיקה", en: "Delete" },
  save: { he: "שמירה", en: "Save Changes" },
  ok: { he: "אישור", en: "OK" },

  // App
  appTitle: { he: "מעקב עלויות טעינה", en: "EV Cost Tracker" },
  signOut: { he: "התנתקות", en: "Sign Out" },
  signIn: { he: "התחברות", en: "Sign In" },
  signUp: { he: "הרשמה", en: "Sign Up" },
  settings: { he: "הגדרות", en: "Settings" },
  calculator: { he: "מחשבון", en: "Calculator" },
  history: { he: "היסטוריה", en: "History" },
  signedOutSuccess: { he: "התנתקת בהצלחה", en: "Successfully signed out" },
  errorSigningOut: { he: "שגיאה בהתנתקות", en: "Error signing out" },

  // Hero
  heroTitle: { he: "מעקב עלויות טעינה", en: "EV Cost Tracker" },
  heroSubtitle: {
    he: "אפליקציה לבעלי רכב חשמלי בבניינים משותפים למעקב וניהול עלויות טעינה. האפליקציה מאפשרת רישום אוטומטי של טעינות, חישוב הוצאות והפקת דוחות Excel/PDF. הירשמו, אמתו את האימייל, רשמו את הרכב וייבאו נתונים קיימים. ⚡🚗",
    en: "A web app for EV owners in shared buildings to track and manage charging costs. It automates session logging, calculates expenses, and generates Excel/PDF reports. Users can sign up, verify their email, register their vehicle, and import existing data. Simplify EV charging cost management with an easy-to-use platform. ⚡🚗",
  },

  // Calculator
  calcTitle: { he: "מחשבון טעינה חשמלית", en: "EV Charging Calculator App" },
  car: { he: "רכב", en: "Car" },
  selectCar: { he: "בחר רכב", en: "Select Car" },
  selectACar: { he: "בחר רכב", en: "Select a car" },
  lastMeterReading: { he: "קריאת מונה אחרונה", en: "Last Meter Reading" },
  currentMeterReading: { he: "קריאת מונה נוכחית", en: "Current Meter Reading" },
  pricePerKwh: { he: "מחיר לקוט\"ש (₪)", en: "Price per kWh (₪)" },
  additionalCharges: { he: "חיובים נוספים", en: "Additional Charges" },
  addCharge: { he: "הוסף חיוב", en: "Add Charge" },
  description: { he: "תיאור", en: "Description" },
  amount: { he: "סכום", en: "Amount" },
  calculateCost: { he: "חשב עלות", en: "Calculate Cost" },
  pleaseLogin: { he: "אנא התחבר", en: "Please login" },
  pleaseSelectCar: { he: "אנא בחר רכב", en: "Please select a car" },
  readingError: { he: "הקריאה הנוכחית לא יכולה להיות נמוכה מהקריאה הקודמת", en: "Current reading cannot be less than previous reading" },
  errorSavingHistory: { he: "שגיאה בשמירת היסטוריה", en: "Error saving charging history" },
  errorSavingCharges: { he: "שגיאה בשמירת חיובים נוספים", en: "Error saving additional charges" },

  // Calculation Result
  calculationResult: { he: "תוצאת החישוב", en: "Calculation Result" },
  totalAmount: { he: "סכום כולל", en: "Total Amount" },
  consumption: { he: "צריכה", en: "Consumption" },
  basicCost: { he: "עלות בסיסית", en: "Basic Cost" },
  additionalCost: { he: "חיובים נוספים", en: "Additional Charges" },

  // History
  chargingHistory: { he: "היסטוריית טעינות", en: "Charging History" },
  date: { he: "תאריך", en: "Date" },
  current: { he: "נוכחי", en: "Current" },
  previous: { he: "קודם", en: "Previous" },
  total: { he: "סה\"כ", en: "Total" },
  actions: { he: "פעולות", en: "Actions" },
  unknownCar: { he: "רכב לא ידוע", en: "Unknown Car" },

  // Edit Dialog
  editReading: { he: "עריכת קריאה", en: "Edit Reading" },
  currentReading: { he: "קריאה נוכחית", en: "Current Reading" },
  errorUpdating: { he: "שגיאה בעדכון הקריאה", en: "Error updating reading" },
  updatedSuccess: { he: "הקריאה עודכנה בהצלחה", en: "Reading updated successfully" },

  // Delete confirmation
  areYouSure: { he: "האם אתה בטוח?", en: "Are you sure?" },
  deleteConfirmCar: { he: "פעולה זו לא ניתנת לביטול. הרכב וכל היסטוריית הטעינות שלו יימחקו לצמיתות.", en: "This action cannot be undone. This will permanently delete the car and all its associated charging history." },
  deleteConfirmReading: { he: "פעולה זו לא ניתנת לביטול. הקריאה וכל החיובים הנוספים שלה יימחקו לצמיתות.", en: "This action cannot be undone. This will permanently delete the reading and all associated additional charges." },

  // Export
  import: { he: "ייבוא", en: "Import" },
  export: { he: "ייצוא", en: "Export" },
  importing: { he: "מייבא...", en: "Importing..." },
  importError: { he: "שגיאת ייבוא", en: "Import Error" },
  importSuccess: { he: "הייבוא הושלם בהצלחה", en: "Import completed successfully" },

  // Settings
  carManagement: { he: "ניהול רכבים", en: "Car Management" },
  enterCarNumber: { he: "הזן מספר רכב", en: "Enter car number" },
  addCar: { he: "הוסף רכב", en: "Add Car" },
  carAdded: { he: "הרכב נוסף בהצלחה", en: "Car added successfully" },
  carDeleted: { he: "הרכב והיסטוריה נמחקו בהצלחה", en: "Car and associated history deleted successfully" },
  enterCarNumberError: { he: "אנא הזן מספר רכב", en: "Please enter a car number" },
  errorFetchingCars: { he: "שגיאה בטעינת רכבים", en: "Error fetching cars" },
  errorAddingCar: { he: "שגיאה בהוספת רכב", en: "Error adding car" },
  errorDeletingCar: { he: "שגיאה במחיקת רכב", en: "Error deleting car" },
  errorDeletingReading: { he: "שגיאה במחיקת קריאה", en: "Error deleting reading" },
  readingDeleted: { he: "הקריאה נמחקה בהצלחה", en: "Reading deleted successfully" },

  // Login
  loginTitle: { he: "מחשבון עלות טעינה חשמלית", en: "EV Charging Cost Calculator" },
  loginSubtitle: { he: "אנא התחבר כדי להמשיך", en: "Please sign in to continue" },
  connectionError: { he: "לא ניתן להתחבר לשירות האימות. אנא בדוק את חיבור האינטרנט ונסה שוב.", en: "Unable to connect to authentication service. Please check your internet connection and try again." },
  retryConnection: { he: "נסה שוב", en: "Retry Connection" },
  connectionIssue: { he: "בעיית חיבור זוהתה", en: "Connection Issue Detected" },
  connectionIssueDesc: { he: "נראה שיש בעיה בהתחברות לשירות האימות.", en: "There seems to be an issue connecting to the Supabase authentication service." },
  possibleSolutions: { he: "פתרונות אפשריים:", en: "Possible solutions:" },
  checkInternet: { he: "בדוק את חיבור האינטרנט שלך", en: "Check your internet connection" },
  verifyProject: { he: "ודא שפרויקט Supabase פעיל", en: "Verify that your Supabase project is active" },
  checkCredentials: { he: "ודא שכתובת URL ומפתח API נכונים", en: "Make sure your project's URL and API key are correct" },
  clearCache: { he: "נסה לנקות את מטמון הדפדפן", en: "Try clearing your browser cache" },
  signInSuccess: { he: "התחברת בהצלחה!", en: "Successfully signed in!" },
  signInError: { he: "שגיאה בהתחברות. נסה שוב.", en: "Error during sign in. Please try again." },
  signUpError: { he: "שגיאה בהרשמה. נסה שוב.", en: "Error during sign up. Please try again." },
  connectionErrorRetry: { he: "שגיאת חיבור. נסה שוב מאוחר יותר.", en: "Connection error. Please try again later." },

  // Chart
  overview: { he: "סקירה", en: "Overview" },

  // Footer
  createdBy: { he: "נוצר על ידי עומר אטרוג,", en: "Created by Omer Etrog," },

  // Error deleting charges
  errorDeletingCharges: { he: "שגיאה במחיקת חיובים נוספים", en: "Error deleting additional charges" },
} as const;

export type TranslationKey = keyof typeof translations;
