export type Language = 'en' | 'ar';

export const translations = {
  en: {
    // Login
    loginTitle: 'WOLF LSK Agency',
    loginSubtitle: 'Client & Order Management System',
    username: 'Username',
    password: 'Password',
    loginButton: 'Sign In',
    loginError: 'Invalid credentials. Please try again.',
    welcomeBack: 'Welcome Back',

    // Navbar
    dashboard: 'Dashboard',
    logout: 'Logout',
    adminPanel: 'Admin Panel',

    // Stats
    totalRevenue: 'Total Revenue',
    outstanding: 'Outstanding Balance',
    activeOrders: 'Active Orders',
    totalClients: 'Total Clients',

    // Search & Controls
    searchPlaceholder: 'Search by name, phone, or service...',
    newOrder: 'New Order',
    orders: 'orders',

    // Table Headers
    client: 'Client',
    service: 'Service',
    deliveryDate: 'Delivery Date',
    total: 'Total',
    remaining: 'Remaining',
    status: 'Status',
    actions: 'Actions',

    // Table Actions
    edit: 'Edit',
    delete: 'Delete',
    printPdf: 'Print PDF',

    // Status
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    delivered: 'Delivered',

    // Empty States
    noOrders: 'No Orders Yet',
    noOrdersDesc: 'Click the "New Order" button above to add your first client and start managing your projects.',
    noResults: 'No Results Found',
    noResultsDesc: 'No orders match your search. Try a different term.',

    // Modal
    newOrderTitle: 'New Order',
    editOrderTitle: 'Edit Order',
    newOrderDesc: 'Fill in the client and project details',
    editOrderDesc: 'Update the order details below',
    clientInfo: 'Client Information',
    serviceDetails: 'Service Details',
    financialDetails: 'Financial Details',
    orderStatus: 'Order Status',
    clientName: 'Client Name',
    phoneNumber: 'Phone Number',
    serviceRequested: 'Service Requested',
    projectDescription: 'Project Description',
    projectDescPlaceholder: 'Describe the project scope, requirements, and deliverables...',
    deliveryDateLabel: 'Delivery Date',
    totalAmount: 'Total Amount ($)',
    firstPayment: 'First Payment / Deposit ($)',
    remainingBalanceLabel: 'Remaining Balance',
    autoCalc: 'Auto-calculated: Total - First Payment',
    dateOfFirstPayment: 'Date of First Payment',
    secondPaymentDue: 'Remaining Balance Due Date',
    statusLabel: 'Status',
    cancel: 'Cancel',
    createOrder: 'Create Order',
    updateOrder: 'Update Order',

    // Services
    webDev: 'Web Development',
    commercialMarketing: 'Commercial Marketing',
    adCampaign: 'Ad Campaign Management',
    seoAudit: 'SEO & Site Audit',
    designBranding: 'Design & Branding',
    aiVideos: 'AI Promotional Videos',
    other: 'Other',

    // Delete confirm
    deleteConfirm: 'Are you sure you want to delete this order?',

    // Footer
    footerText: '© 2024 WOLF LSK Agency — Client & Order Management System',
    dataStored: 'Data stored locally in your browser',

    // PDF Invoice
    invoice: 'INVOICE',
    invoiceDate: 'Invoice Date',
    invoiceNumber: 'Invoice No.',
    billTo: 'Bill To',
    orderDetails: 'Order Details',
    description: 'Description',
    paymentSummary: 'Payment Summary',
    depositPaid: 'Deposit Paid',
    balanceDue: 'Balance Due',
    paymentDates: 'Payment Dates',
    firstPaymentDate: 'First Payment Date',
    secondPaymentDate: 'Second Payment Due',
    thankYou: 'Thank you for trusting WOLF LSK Agency',
    agencyTagline: 'Premium Digital Solutions',
  },

  ar: {
    // Login
    loginTitle: 'وكالة وولف LSK',
    loginSubtitle: 'نظام إدارة العملاء والطلبات',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginButton: 'تسجيل الدخول',
    loginError: 'بيانات غير صحيحة. يرجى المحاولة مرة أخرى.',
    welcomeBack: 'مرحباً بعودتك',

    // Navbar
    dashboard: 'لوحة التحكم',
    logout: 'تسجيل الخروج',
    adminPanel: 'لوحة الإدارة',

    // Stats
    totalRevenue: 'إجمالي الإيرادات',
    outstanding: 'الرصيد المستحق',
    activeOrders: 'الطلبات النشطة',
    totalClients: 'إجمالي العملاء',

    // Search & Controls
    searchPlaceholder: 'البحث بالاسم، الهاتف، أو الخدمة...',
    newOrder: 'طلب جديد',
    orders: 'طلبات',

    // Table Headers
    client: 'العميل',
    service: 'الخدمة',
    deliveryDate: 'تاريخ التسليم',
    total: 'الإجمالي',
    remaining: 'المتبقي',
    status: 'الحالة',
    actions: 'الإجراءات',

    // Table Actions
    edit: 'تعديل',
    delete: 'حذف',
    printPdf: 'طباعة PDF',

    // Status
    pending: 'قيد الانتظار',
    inProgress: 'قيد التنفيذ',
    completed: 'مكتمل',
    delivered: 'تم التسليم',

    // Empty States
    noOrders: 'لا توجد طلبات بعد',
    noOrdersDesc: 'انقر على زر "طلب جديد" أعلاه لإضافة عميلك الأول والبدء في إدارة مشاريعك.',
    noResults: 'لا توجد نتائج',
    noResultsDesc: 'لا توجد طلبات مطابقة لبحثك. جرب مصطلحاً مختلفاً.',

    // Modal
    newOrderTitle: 'طلب جديد',
    editOrderTitle: 'تعديل الطلب',
    newOrderDesc: 'أدخل بيانات العميل وتفاصيل المشروع',
    editOrderDesc: 'قم بتحديث تفاصيل الطلب أدناه',
    clientInfo: 'معلومات العميل',
    serviceDetails: 'تفاصيل الخدمة',
    financialDetails: 'التفاصيل المالية',
    orderStatus: 'حالة الطلب',
    clientName: 'اسم العميل',
    phoneNumber: 'رقم الهاتف',
    serviceRequested: 'الخدمة المطلوبة',
    projectDescription: 'وصف المشروع',
    projectDescPlaceholder: 'صف نطاق المشروع والمتطلبات والمخرجات...',
    deliveryDateLabel: 'تاريخ التسليم',
    totalAmount: 'المبلغ الإجمالي ($)',
    firstPayment: 'الدفعة الأولى / العربون ($)',
    remainingBalanceLabel: 'الرصيد المتبقي',
    autoCalc: 'محسوب تلقائياً: الإجمالي - الدفعة الأولى',
    dateOfFirstPayment: 'تاريخ الدفعة الأولى',
    secondPaymentDue: 'موعد استحقاق الرصيد المتبقي',
    statusLabel: 'الحالة',
    cancel: 'إلغاء',
    createOrder: 'إنشاء الطلب',
    updateOrder: 'تحديث الطلب',

    // Services
    webDev: 'تطوير المواقع',
    commercialMarketing: 'التسويق التجاري',
    adCampaign: 'إدارة الحملات الإعلانية',
    seoAudit: 'تحسين محركات البحث وتدقيق الموقع',
    designBranding: 'التصميم والهوية البصرية',
    aiVideos: 'فيديوهات ترويجية بالذكاء الاصطناعي',
    other: 'أخرى',

    // Delete confirm
    deleteConfirm: 'هل أنت متأكد من حذف هذا الطلب؟',

    // Footer
    footerText: '© 2024 وكالة وولف LSK — نظام إدارة العملاء والطلبات',
    dataStored: 'البيانات محفوظة محلياً في متصفحك',

    // PDF Invoice
    invoice: 'فاتورة',
    invoiceDate: 'تاريخ الفاتورة',
    invoiceNumber: 'رقم الفاتورة',
    billTo: 'فاتورة إلى',
    orderDetails: 'تفاصيل الطلب',
    description: 'الوصف',
    paymentSummary: 'ملخص الدفع',
    depositPaid: 'الدفعة المدفوعة',
    balanceDue: 'الرصيد المستحق',
    paymentDates: 'تواريخ الدفع',
    firstPaymentDate: 'تاريخ الدفعة الأولى',
    secondPaymentDate: 'موعد استحقاق الدفعة الثانية',
    thankYou: 'شكراً لثقتكم في وكالة وولف LSK',
    agencyTagline: 'حلول رقمية متميزة',
  },
};

export type TranslationKey = keyof typeof translations.en;
