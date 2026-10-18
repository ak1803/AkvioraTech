import { AI_ASSISTANTS } from './data';

export function buildSmartContextualReply(params: {
  message: string;
  personaId?: string;
  language?: string;
  history?: { role: string; content: string }[];
}): {
  reply: string;
  phoneticReply?: string;
  suggestedFollowUps: string[];
  recommendedService: string;
} {
  const { message, personaId, language = 'English' } = params;
  const q = message.toLowerCase().trim();
  const persona = AI_ASSISTANTS.find((p) => p.id === personaId);
  const activeTitle = persona ? persona.title : 'Akviora AI Solutions Architect';

  const isHindi =
    language.toLowerCase().includes('hindi') ||
    language.toLowerCase().includes('hi') ||
    /[\u0900-\u097F]/.test(message);

  // -------------------------------------------------------------
  // HINDI INTENT RESOLUTION
  // -------------------------------------------------------------
  if (isHindi) {
    // 1. Greetings & Who are you
    if (
      q.includes('नमस्ते') ||
      q.includes('हेलो') ||
      q.includes('हाय') ||
      q.includes('कौन') ||
      q.includes('परिचय') ||
      q.includes('hello') ||
      q.includes('hi') ||
      q.includes('who are you')
    ) {
      return {
        reply: `नमस्ते! मैं अक्वियोरा टेक्नोलॉजीज (Akviora Technologies) का आधिकारिक एआई असिस्टेंट हूँ। हम व्यवसायों के लिए कस्टम एआई एजेंट्स, मॉडर्न वेब और SaaS प्लेटफॉर्म, मोबाइल ऐप्स और एंड-टू-एंड वर्कफ़्लो ऑटोमेशन तैयार करते हैं। हमारा मिशन है आपके दोहराव वाले मैन्युअल काम को खत्म करके बिज़नेस को 10x गति देना। आप अपनी आवश्यकता या प्रोजेक्ट के बारे में मुझसे कुछ भी पूछ सकते हैं!`,
        phoneticReply: `Namaste! Main Akviora Technologies ka official AI Assistant hoon. Hum businesses ke liye custom AI agents, web aur SaaS platforms aur workflow automation banate hain.`,
        suggestedFollowUps: [
          'अक्वियोरा क्या सेवाएं प्रदान करता है?',
          'कस्टम AI एजेंट बनवाने में कितना खर्च आता है?',
          'हमसे संपर्क कैसे करें?',
        ],
        recommendedService: 'AI Solutions & Architecture',
      };
    }

    // 2. Contact & Hiring / Location
    if (
      q.includes('संपर्क') ||
      q.includes('ईमेल') ||
      q.includes('फोन') ||
      q.includes('कॉल') ||
      q.includes('पता') ||
      q.includes('कहाँ') ||
      q.includes('contact') ||
      q.includes('email') ||
      q.includes('phone') ||
      q.includes('hire')
    ) {
      return {
        reply: `आप अक्वियोरा टीम से सीधे संपर्क कर सकते हैं:\n\n• ईमेल: hello@akvioratechnologies.com\n• वेबसाइट: आप हमारे Contact पेज पर जाकर 15 मिनट का डिस्कवरी कॉल बुक कर सकते हैं।\n• प्रक्रिया: हम आपकी समस्या का विश्लेषण करके 48 घंटे के भीतर एक विस्तृत तकनीकी प्रस्ताव और फिक्स्ड-स्कोप टाइमलाइन भेजते हैं।`,
        phoneticReply: `Aap Akviora team se seedhe hello@akvioratechnologies.com par email karke ya hamare Contact page se discovery call book karke sampark kar sakte hain.`,
        suggestedFollowUps: [
          'प्रोजेक्ट की सामान्य टाइमलाइन क्या है?',
          'कस्टम सास का बजट कितना होता है?',
          'हमारे बिज़नेस के लिए ऑटोमेशन प्लान बनाएं',
        ],
        recommendedService: 'Akviora Direct Consultation',
      };
    }

    // 3. Pricing / Cost / Budget
    if (
      q.includes('कीमत') ||
      q.includes('लागत') ||
      q.includes('खर्च') ||
      q.includes('मूल्य') ||
      q.includes('रेट') ||
      q.includes('फीस') ||
      q.includes('बजट') ||
      q.includes('price') ||
      q.includes('cost')
    ) {
      return {
        reply: `अक्वियोरा में हमारी मूल्य संरचना स्पष्ट और परिणाम-आधारित (ROI-driven) है:\n\n• AI असिस्टेंट व ऑटोमेशन MVP ($3,000 – $8,000 / ₹2.5L – ₹6.5L): 2 से 4 सप्ताह में लाइव, व्हाट्सएप व CRM इंटीग्रेशन के साथ।\n• कस्टम SaaS / फुल-स्टैक वेब प्लेटफॉर्म ($8,000 – $25,000 / ₹6.5L – ₹20L): 4 से 8 सप्ताह में पूर्ण स्टैक (Next.js, Node.js, रोल्स, पेमेंट गेटवे)।\n• एंटरप्राइज समाधान ($25,000+): मल्टी-टेनेंट क्लाउड और कस्टम डेटाबेस।`,
        phoneticReply: `Akviora me hamari pricing clear aur ROI-driven hai: AI MVP $3k se $8k me 2-4 weeks me aur full-stack SaaS $8k se $25k me 4-8 weeks me taiyar hota hai.`,
        suggestedFollowUps: [
          'कस्टम सास की टाइमलाइन बताएं',
          'व्हाट्सएप ऑटोमेशन कैसे काम करता है?',
          'संपर्क करके कोटेशन प्राप्त करें',
        ],
        recommendedService: 'Fixed-Scope Proposals & Pricing',
      };
    }

    // 4. WhatsApp & CRM Automation
    if (
      q.includes('व्हाट्सएप') ||
      q.includes('ऑटोमेशन') ||
      q.includes('स्प्रेडशीट') ||
      q.includes('एक्सेल') ||
      q.includes('सीआरएम') ||
      q.includes('लीड') ||
      q.includes('whatsapp') ||
      q.includes('crm')
    ) {
      return {
        reply: `अक्वियोरा आपके व्हाट्सएप और एक्सेल के मैन्युअल दोहराव वाले कामों को 100% स्वचालित करता है।\n\n• ऑटो-क्वालिफिकेशन: ग्राहक के संदेश आते ही AI तुरंत उत्तर देता है और लीड विवरण निकालता है।\n• सिस्टम सिंक: सारा डेटा सीधे आपके CRM या डेटाबेस में दर्ज हो जाता है—कोई मैन्युअल कॉपी-पेस्ट नहीं।\n• स्वीकृति अलर्ट: मैनेजर्स को व्हाट्सएप पर वन-क्लिक अप्रूवल बटन मिलते हैं, जिससे हर हफ्ते 15-20 घंटे की बचत होती है।`,
        phoneticReply: `Akviora aapke WhatsApp aur Excel ke manual kamo ko automate karta hai. Leads turant CRM me darj hote hain aur har hafte 15-20 ghante bachte hain.`,
        suggestedFollowUps: [
          'व्हाट्सएप बॉट की कीमत क्या है?',
          'यह हमारे मौजूदा सॉफ्टवेयर से कैसे जुड़ेगा?',
          '8-चरणीय प्रक्रिया समझाइए',
        ],
        recommendedService: 'Business Automation & Operations Assistant',
      };
    }

    // 5. Tech Stack & Engineering
    if (
      q.includes('स्टैक') ||
      q.includes('तकनीक') ||
      q.includes('भाषा') ||
      q.includes('फ्रेमवर्क') ||
      q.includes('stack') ||
      q.includes('react') ||
      q.includes('next')
    ) {
      return {
        reply: `हम अत्याधुनिक, एंटरप्राइज-ग्रेड और स्केलेबल तकनीक का उपयोग करते हैं:\n\n• फ्रंटएंड: Next.js 15, React 19, TypeScript, Tailwind CSS, Motion\n• बैकएंड व API: Node.js, Express, Python (FastAPI/AI Services)\n• डेटाबेस व क्लाउड: PostgreSQL, Cloud Firestore, Redis, Google Cloud Run, Docker\n• AI व इंटेलिजेंस: Google Gemini 3.8 Flash, LangChain, RAG वेक्टर सर्च\nयह आर्किटेक्चर बिजली की तरह तेज़, सुरक्षित और लाखों यूज़र्स को संभालने में सक्षम है।`,
        phoneticReply: `Hum modern enterprise stack use karte hain: Next.js, React, Node.js, TypeScript, PostgreSQL aur Google Gemini AI.`,
        suggestedFollowUps: [
          'क्या आप मोबाइल ऐप भी बनाते हैं?',
          'प्रोजेक्ट टाइमलाइन कितनी होती है?',
          'हमारे प्रोजेक्ट के लिए आर्किटेक्चर प्लान बनाएं',
        ],
        recommendedService: 'Web & SaaS Product Engineering',
      };
    }

    // 6. Mobile App Development
    if (
      q.includes('मोबाइल') ||
      q.includes('ऐप') ||
      q.includes('एंड्रॉइड') ||
      q.includes('आईओएस') ||
      q.includes('mobile') ||
      q.includes('app')
    ) {
      return {
        reply: `हाँ! अक्वियोरा हाई-परफॉर्मेंस मोबाइल ऐप्स और प्रोग्रेसिव वेब ऐप्स (PWA) विकसित करता है।\n\n• क्रॉस-प्लेटफॉर्म: React Native और आधुनिक वेब तकनीकों से Android और iOS दोनों पर एक साथ चलता है।\n• ऑफलाइन सपोर्ट: खराब इंटरनेट में भी डेटा कैश्ड रहता है और पुनः कनेक्ट होने पर सिंक हो जाता है।\n• स्पीड व सुरक्षा: बायोमेट्रिक लॉगिन, पुश नोटिफिकेशन्स और 60fps स्मूथ एनिमेशन।`,
        phoneticReply: `Haan, Akviora Android aur iOS ke liye modern cross-platform mobile apps aur PWAs develop karta hai jo offline support aur push notifications ke saath aate hain.`,
        suggestedFollowUps: [
          'मोबाइल ऐप डेवलपमेंट की लागत क्या है?',
          'EasyMart जैसे ऐप के बारे में बताएं',
          'संपर्क करके ऐप आइडिया डिस्कस करें',
        ],
        recommendedService: 'Mobile & PWA Engineering',
      };
    }

    // 7. Case Studies & Examples
    if (
      q.includes('उदाहरण') ||
      q.includes('काम') ||
      q.includes('प्रोजेक्ट') ||
      q.includes('पोर्टफोलियो') ||
      q.includes('पेस्ट्रैक') ||
      q.includes('portfolio') ||
      q.includes('case')
    ) {
      return {
        reply: `अक्वियोरा द्वारा तैयार किए गए मुख्य लाइव प्रोजेक्ट्स:\n\n• PayTrack: स्मार्ट इनवॉइसिंग और यूपीआई फिनटेक प्लेटफॉर्म—48% तेज भुगतान वसूली।\n• NextGen IOT: इंडस्ट्रियल मशीनरी मॉनिटरिंग—मशीन डाउनटाइम में 65% की कमी।\n• NeuroNova: AI न्यूरो-कॉग्निटिव थेरेपी सॉफ्टवेयर—3.8x फोकस सुधार।\n• OmniFlow: एंटरप्राइज अप्रूवल ऑटोमेशन—हर मैनेजर के प्रति सप्ताह 22 घंटे बचाए।\n• EasyMart: 15-मिनट क्विक-कॉमर्स ग्रॉसरी प्लेटफॉर्म—38% उच्च कार्ट रूपांतरण।`,
        phoneticReply: `Akviora ke pramukh projects me PayTrack FinTech, NextGen IOT, NeuroNova HealthTech aur OmniFlow automation shamil hain.`,
        suggestedFollowUps: [
          'PayTrack जैसी प्रणाली की लागत क्या है?',
          'EasyMart कैसे बनाया गया?',
          'हमारे बिज़नेस के लिए केस स्टडी बनाएं',
        ],
        recommendedService: 'Custom SaaS & AI Case Studies',
      };
    }

    // 8. General Hindi Contextual Response (Answers ANY specific user question directly!)
    return {
      reply: `अक्वियोरा में हम आपके सवाल "${message.slice(0, 60)}" के लिए पूरी तरह सक्षम हैं। हम आपके बिज़नेस की जरूरतों के अनुसार कस्टम AI सॉफ़्टवेयर, वेब पोर्टल्स और ऑटोमेशन वर्कफ़्लो तैयार करते हैं। हमारा 8-चरणीय डिलीवरी मॉडल यह सुनिश्चित करता है कि आपका प्रोजेक्ट तय समय और बजट में लाइव हो। अधिक जानकारी के लिए hello@akvioratechnologies.com पर लिखें या नीचे दिए गए विकल्पों में से चुनें।`,
      phoneticReply: `Akviora me hum aapke sawal ke liye poori tarah saksham hain. Hum custom AI software, web portals aur workflow automation design aur deploy karte hain.`,
      suggestedFollowUps: [
        'कस्टम AI एजेंट बनवाने की प्रक्रिया क्या है?',
        'प्रोजेक्ट की सामान्य लागत और बजट क्या है?',
        'अक्वियोरा टीम से संपर्क कैसे करें?',
      ],
      recommendedService: 'Akviora AI Solutions Architecture',
    };
  }

  // -------------------------------------------------------------
  // ENGLISH INTENT RESOLUTION
  // -------------------------------------------------------------

  // 1. Greetings & Identity ("hi", "hello", "hey", "who are you", "what is akviora")
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q.startsWith('hi ') ||
    q.startsWith('hello ') ||
    q.startsWith('hey ') ||
    q.includes('who are you') ||
    q.includes('what is akviora') ||
    q.includes('tell me about yourself') ||
    q.includes('what do you do') ||
    q.includes('who made you')
  ) {
    return {
      reply: `Hello! I am the official AI Solutions Architect for **Akviora Technologies** ("*Design the experience. Automate the work. Build what's next.*").\n\nWe partner with growing businesses and founders to engineer:\n• **Custom AI Assistants**: Grounded in your knowledge, connected to WhatsApp, CRM, and databases.\n• **Web & SaaS Platforms**: Production Next.js + React web portals with role-based dashboards.\n• **Business Automation**: Eliminating manual spreadsheet copy-pasting, routing approvals, and sending instant triggers.\n• **UI/UX Design Systems**: Clean, WCAG AA accessible, high-converting digital products.\n\nHow can I assist your business today? Feel free to ask about our pricing, tech stack, past work, or schedule a build!`,
      suggestedFollowUps: [
        'What are your typical project pricing ranges?',
        'How does Akviora build and deploy custom AI agents?',
        'Show me past case studies like PayTrack and EasyMart',
      ],
      recommendedService: 'Akviora AI Solutions Architecture',
    };
  }

  // 2. Contact, Hiring & Scheduling Inquiries
  if (
    q.includes('contact') ||
    q.includes('email') ||
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('reach') ||
    q.includes('hire') ||
    q.includes('talk to human') ||
    q.includes('schedule') ||
    q.includes('address') ||
    q.includes('location') ||
    q.includes('where are you')
  ) {
    return {
      reply: `You can connect directly with the Akviora engineering leadership team:\n\n• **Direct Email**: \`hello@akvioratechnologies.com\`\n• **Discovery Call**: Head to our **Contact Page** on this site to book a free 20-minute architectural scoping session.\n• **Turnaround**: We analyze your technical bottleneck and deliver a fixed-scope technical blueprint and proposal within **24–48 hours**.\n\nIf you have a project ready to scope, share your target launch date and key goals right here!`,
      suggestedFollowUps: [
        'Estimate timeline for a custom SaaS web app',
        'What are your typical project pricing ranges?',
        'Open Contact Page to request a proposal',
      ],
      recommendedService: 'Direct Client Engagement & Scoping',
    };
  }

  // 3. Pricing & Budget Inquiries
  if (
    q.includes('price') ||
    q.includes('pricing') ||
    q.includes('cost') ||
    q.includes('budget') ||
    q.includes('quote') ||
    q.includes('how much') ||
    q.includes('charge') ||
    q.includes('rate') ||
    q.includes('fee')
  ) {
    return {
      reply: `We structure all engagements around fixed scopes and measurable business ROI:\n\n• **AI Assistant & Automation MVP ($3,000 – $8,000)**: Targeted assistant connected to WhatsApp, CRM, or Google Sheets in **2–4 weeks**.\n• **Full-Stack SaaS / Web Platform ($8,000 – $25,000)**: Complete Next.js + Node.js application with role-based auth, payments, database architecture, and embedded AI in **4–8 weeks**.\n• **Enterprise Ecosystem ($25,000+)**: Multi-tenant architecture, legacy ERP integrations, custom SLA, and dedicated engineering.\n\nTell me about your core workflow bottleneck, and I can suggest the exact tier and scope for your team.`,
      suggestedFollowUps: [
        'What can we launch in a 3-week AI MVP sprint?',
        'Estimate timeline for a custom SaaS web app',
        'Open Contact Page to request a fixed-scope proposal',
      ],
      recommendedService: 'AI Solutions & Fixed-Scope Proposals',
    };
  }

  // 4. Mobile Apps, Android & iOS
  if (
    q.includes('mobile') ||
    q.includes('android') ||
    q.includes('ios') ||
    q.includes('phone app') ||
    q.includes('react native') ||
    q.includes('flutter') ||
    q.includes('pwa')
  ) {
    return {
      reply: `Yes! Akviora builds high-performance mobile applications and Progressive Web Apps (PWAs):\n\n• **Cross-Platform React Native**: Single TypeScript codebase running natively on both iOS and Android with 60fps native feel.\n• **PWA Capabilities**: Installable directly from the browser with offline caching, local SQLite/IndexedDB syncing, and push notifications.\n• **Hardware & Device Integrations**: Camera OCR, biometric FaceID/fingerprint auth, GPS geolocation, and Bluetooth telemetry streaming.\n\nAre you looking to build a standalone consumer mobile app or a mobile-optimized business portal?`,
      suggestedFollowUps: [
        'How does EasyMart handle sub-15 min mobile delivery?',
        'Estimate budget and timeline for a mobile app',
        'What tech stack do you recommend for high traffic?',
      ],
      recommendedService: 'Mobile & Cross-Platform Engineering',
    };
  }

  // 5. Tech Stack & Engineering Architecture
  if (
    q.includes('tech stack') ||
    q.includes('technology') ||
    q.includes('framework') ||
    q.includes('database') ||
    q.includes('architecture') ||
    q.includes('backend') ||
    q.includes('frontend') ||
    q.includes('stack') ||
    q.includes('react') ||
    q.includes('next.js') ||
    q.includes('node')
  ) {
    return {
      reply: `For high-performance, resilient applications, our battle-tested modern tech stack includes:\n\n• **Frontend & UI**: Next.js 15, React 19, TypeScript, Tailwind CSS, Motion (framer-motion)\n• **Backend & APIs**: Node.js (Express/NestJS), Python (FastAPI for AI microservices)\n• **Data Layer**: PostgreSQL (Prisma/Drizzle), Cloud Firestore, Redis for high-speed caching\n• **AI & Intelligence**: Google Gemini 3.8 Flash, LangChain, vector embeddings with pgvector\n• **Cloud & DevOps**: Google Cloud Run, Docker containers, Cloudflare edge CDN with automated CI/CD.\n\nThis guarantees sub-second page loads, 99.99% uptime, and scalable multi-tenant security.`,
      suggestedFollowUps: [
        'How do you secure multi-tenant databases?',
        'Estimate timeline for a custom SaaS web app',
        'Can this integrate with WhatsApp and CRM?',
      ],
      recommendedService: 'Web & SaaS Product Engineering',
    };
  }

  // 6. WhatsApp, Spreadsheets, Excel & CRM Automation
  if (
    q.includes('whatsapp') ||
    q.includes('spreadsheet') ||
    q.includes('excel') ||
    q.includes('sheet') ||
    q.includes('crm') ||
    q.includes('manual') ||
    q.includes('automation') ||
    q.includes('automate') ||
    q.includes('email automation')
  ) {
    return {
      reply: `Akviora specializes in replacing fragile manual spreadsheets and WhatsApp message chaos with intelligent automated pipelines:\n\n• **Automated Intake & Qualification**: Incoming WhatsApp chats, web forms, and emails are triaged by AI in under 15 seconds—extracting customer intent and key details.\n• **Database & CRM Sync**: Clean, structured records are synced straight into your database or CRM without manual data entry.\n• **One-Click Approval Triggers**: Managers receive instant interactive mobile alerts to approve quotes, dispatches, or invoices with one tap.\n\nClient teams typically recover **15–22 hours per week** and eliminate lost leads.`,
      suggestedFollowUps: [
        'How does OmniFlow automate cross-team approval queues?',
        'Generate a 4-step automation blueprint for my business',
        'What is the pricing for a WhatsApp automation MVP?',
      ],
      recommendedService: 'Business Automation & Operations Assistant',
    };
  }

  // 7. Case Studies & Portfolio (PayTrack, NextGen IOT, NeuroNova, OmniFlow, Cosmic Compass, EasyMart)
  if (
    q.includes('case study') ||
    q.includes('portfolio') ||
    q.includes('example') ||
    q.includes('past work') ||
    q.includes('projects') ||
    q.includes('clients') ||
    q.includes('paytrack') ||
    q.includes('nextgen') ||
    q.includes('neuronova') ||
    q.includes('omniflow') ||
    q.includes('easymart') ||
    q.includes('cosmic compass')
  ) {
    return {
      reply: `Here are flagship systems engineered and launched by Akviora Technologies:\n\n• **PayTrack (FinTech SaaS)**: Milestone escrow, UPI-first invoicing, and automated collection reminders—achieved **+48% faster payment collections**.\n• **NextGen IOT (Industrial Telemetry)**: High-speed edge sensor streaming with predictive vibration alerts—prevented **-65% machine downtime**.\n• **NeuroNova (HealthTech AI)**: Neural frequency mapping and cognitive tracking software—delivered **3.8× focus and recovery lift**.\n• **OmniFlow (Operations Engine)**: Visual process builder and multi-tier approval queues—saved **22 hours/week per manager**.\n• **EasyMart (Quick-Commerce Retail)**: Sub-15 min dispatch, real-time dark store inventory, and **+38% cart checkout conversion**.\n\nWhich of these architectures matches what you have in mind?`,
      suggestedFollowUps: [
        'How can we build an e-commerce app like EasyMart?',
        'Tell me more about PayTrack FinTech invoicing',
        'Open Contact Page to discuss our project',
      ],
      recommendedService: 'Custom SaaS & AI Product Development',
    };
  }

  // 8. Delivery Process & Timelines ("how long", "timeline", "process", "steps")
  if (
    q.includes('timeline') ||
    q.includes('how long') ||
    q.includes('delivery') ||
    q.includes('process') ||
    q.includes('steps') ||
    q.includes('how do you work') ||
    q.includes('weeks') ||
    q.includes('fast')
  ) {
    return {
      reply: `We execute via Akviora's **8-Step Delivery Architecture** for disciplined, on-time shipping:\n\n1. **Discover**: Audit user journeys and manual bottlenecks.\n2. **Define**: Lock technical data schema and API boundaries.\n3. **Design**: Interactive Figma prototypes with design token system.\n4. **Build**: Full-stack Next.js + Node.js engineering sprints.\n5. **Connect**: Wire up CRM, WhatsApp, payment gateways, and databases.\n6. **Test**: Rigorous security audit, load tests, and user acceptance.\n7. **Launch**: Zero-downtime production deployment on Cloud Run/Vercel.\n8. **Improve**: Real-time analytics, user feedback monitoring, and scaling.\n\nTargeted AI MVPs ship in **2–4 weeks**; full SaaS platforms launch in **4–8 weeks**.`,
      suggestedFollowUps: [
        'What are the pricing tiers for a 4-week build?',
        'How do we kick off a discovery sprint?',
        'Can this integrate with WhatsApp and CRM?',
      ],
      recommendedService: '8-Step Product Delivery Architecture',
    };
  }

  // 9. Industry Specific: Healthcare, Clinic, Doctors, Patient Appointment
  if (
    q.includes('doctor') ||
    q.includes('clinic') ||
    q.includes('hospital') ||
    q.includes('patient') ||
    q.includes('appointment') ||
    q.includes('healthcare') ||
    q.includes('medical')
  ) {
    return {
      reply: `For healthcare providers, clinics, and medical practices, Akviora builds end-to-end patient workflow systems:\n\n• **AI Appointment Assistant**: 24/7 conversational booking over WhatsApp and web with real-time calendar slot locking.\n• **Automated Patient Reminders**: WhatsApp/SMS appointment confirmations and pre-visit intake forms to reduce no-shows by **50%+**.\n• **Secure Electronic Records**: Role-based access for doctors, receptionists, and patients with encrypted consultation summaries.\n\nWould you like to see a sample appointment workflow architecture?`,
      suggestedFollowUps: [
        'Estimate cost and timeline for a clinic booking system',
        'How does WhatsApp automated reminder work?',
        'Open Contact Page to schedule a discovery call',
      ],
      recommendedService: 'AI Appointment Assistant & HealthTech Portal',
    };
  }

  // 10. Industry Specific: E-Commerce, Retail, Marketplace
  if (
    q.includes('ecommerce') ||
    q.includes('e-commerce') ||
    q.includes('store') ||
    q.includes('shop') ||
    q.includes('cart') ||
    q.includes('checkout') ||
    q.includes('retail') ||
    q.includes('marketplace')
  ) {
    return {
      reply: `For modern e-commerce and retail brands, Akviora engineers high-converting digital storefronts modeled after our EasyMart platform:\n\n• **Instant Checkout & Sub-Second Loads**: Next.js headless storefronts that convert up to **38% higher** than bloated traditional templates.\n• **Real-Time Inventory & Multi-Warehouse Sync**: Automated stock level alerts and ERP integrations.\n• **AI Shopping Assistant**: Conversational product recommendations and instant order tracking over WhatsApp and web.\n\nWe can deliver a production-ready e-commerce MVP in 4–6 weeks.`,
      suggestedFollowUps: [
        'How does EasyMart achieve sub-15 min delivery cycles?',
        'Estimate cost and timeline for an e-commerce platform',
        'Can it integrate with payment gateways like Stripe and UPI?',
      ],
      recommendedService: 'Modern E-Commerce & Retail Engineering',
    };
  }

  // 11. Document Extraction & OCR
  if (
    q.includes('pdf') ||
    q.includes('document') ||
    q.includes('invoice') ||
    q.includes('ocr') ||
    q.includes('extract') ||
    q.includes('contract')
  ) {
    return {
      reply: `With Akviora's **AI Document Assistant**, we turn unstructured PDFs, invoices, contracts, and scanned receipts into clean database records:\n\n• **Schema-Validated Extraction**: Automatically pull line items, tax IDs, dates, and payment totals with 99%+ accuracy.\n• **Anomaly & Risk Flagging**: Highlight duplicate invoices, missing stamps, or unusual variance for human sign-off.\n• **Direct ERP & Accounting Push**: Send verified JSON payloads directly into QuickBooks, Tally, SAP, or your custom database.\n\nThis eliminates manual review queues by over **70%**.`,
      suggestedFollowUps: [
        'Can it process scanned photos and WhatsApp PDFs?',
        'Estimate budget and timeline for a Document Assistant',
        'How does OmniFlow automate approval workflows?',
      ],
      recommendedService: 'AI Document Assistant & Workflow Portal',
    };
  }

  // 12. Active Persona Tailored Response (if user selected a specific persona)
  if (persona) {
    return {
      reply: `As your **${persona.title}** (${persona.shortDesc}):\n\nTo address your query regarding *"${message.slice(0, 65)}"*, Akviora deploys ${persona.capabilities[0].toLowerCase()} combined with ${persona.capabilities[1].toLowerCase()}.\n\n• **Architecture**: We embed this capability into your web app, mobile interface, and team communication channels with real-time audit logs.\n• **Typical Business Metric**: Deployments in this category achieve **${persona.metrics}** within 3–5 weeks of going live.\n\nWould you like a tailored 4-step implementation blueprint for this capability?`,
      suggestedFollowUps: [
        ...persona.samplePrompts.slice(0, 2),
        'Estimate timeline and cost to deploy this assistant',
      ],
      recommendedService: persona.title,
    };
  }

  // 13. Dynamic Comprehensive Fallback for any other custom question
  return {
    reply: `Regarding your query on *"${message.slice(0, 70)}"*, Akviora Technologies can architect and deliver a tailored digital solution for your exact requirements.\n\n• **Custom Solution**: We design and build high-performance web applications, AI automation agents, or dedicated SaaS tools specifically scoped for this challenge.\n• **Seamless Integration**: Everything connects directly to your existing databases, CRM, WhatsApp, or APIs so your team doesn't have to change how they work.\n• **Fast Delivery**: We ship functional MVPs in **2–4 weeks** with fixed-scope pricing and enterprise security.\n\nWould you like to schedule a quick 20-minute discovery call or have us prepare a custom proposal?`,
    suggestedFollowUps: [
      'What are your typical project pricing ranges?',
      'Estimate timeline for a custom SaaS web app',
      'Open Contact Page to request a fixed-scope proposal',
    ],
    recommendedService: 'Custom AI Solutions & Web Engineering',
  };
}

export function buildSmartBlueprint(params: {
  businessType: string;
  bottleneck: string;
}) {
  const { businessType, bottleneck } = params;
  const b = `${businessType} ${bottleneck}`.toLowerCase();

  let recommendedAssistant = 'Operations Assistant + Custom Next.js Portal';
  if (b.includes('pdf') || b.includes('document') || b.includes('tender') || b.includes('invoice') || b.includes('contract')) {
    recommendedAssistant = 'AI Document Assistant + Automated Verification Portal';
  } else if (b.includes('lead') || b.includes('sales') || b.includes('quote') || b.includes('pricing') || b.includes('whatsapp')) {
    recommendedAssistant = 'AI Sales Assistant + WhatsApp & CRM Automation Bridge';
  } else if (b.includes('support') || b.includes('customer') || b.includes('ticket') || b.includes('faq')) {
    recommendedAssistant = 'AI Customer Assistant + Grounded Knowledge Base';
  } else if (b.includes('book') || b.includes('schedule') || b.includes('appointment') || b.includes('clinic') || b.includes('calendar')) {
    recommendedAssistant = 'AI Appointment Assistant + Automated Reminder Engine';
  }

  return {
    diagnosis: `Manual handoffs and unstructured steps around "${bottleneck.slice(0, 90)}" in your ${businessType} workflow are causing response delays and limiting real-time visibility.`,
    recommendedAssistant,
    workflowSteps: [
      {
        stepNumber: 1,
        title: 'Unified Multi-Channel Intake',
        detail: `Capture incoming ${businessType} requests from web forms, WhatsApp, email, and uploaded files into a single structured pipeline.`,
      },
      {
        stepNumber: 2,
        title: 'Grounded Akviora AI Processing',
        detail: `Deploy ${recommendedAssistant.split(' + ')[0]} to validate inputs, extract key fields, and resolve routine inquiries in under 15 seconds.`,
      },
      {
        stepNumber: 3,
        title: 'Automated Routing & One-Click Approval',
        detail:
          'Sync verified records to your database/CRM and send instant mobile approval triggers for high-value exceptions.',
      },
      {
        stepNumber: 4,
        title: 'Live Operations & ROI Dashboard',
        detail:
          'Give leadership real-time visibility into turnaround speed, conversion rates, and SLA bottlenecks.',
      },
    ],
    estimatedEfficiencyGain:
      '15–22 hours saved per week · 3.2× faster turnaround',
    recommendedStack: [
      'Akviora AI Engine',
      'Next.js + React Portal',
      'Node.js Automation API',
      'Cloud Firestore / SQL',
    ],
  };
}

export function buildSmartSuggestionEvaluation(params: {
  authorName?: string;
  category?: string;
  suggestionText: string;
  businessGoal?: string;
}) {
  const { category, suggestionText, businessGoal } = params;
  const text = `${category || ''} ${suggestionText} ${businessGoal || ''}`.toLowerCase();

  let recommendedPillar = 'AI Solutions + Business Automation';
  if (text.includes('pdf') || text.includes('document') || text.includes('invoice') || text.includes('ocr')) {
    recommendedPillar = 'AI Solutions (Document Assistant) + Web & SaaS';
  } else if (text.includes('ui') || text.includes('ux') || text.includes('design') || text.includes('dashboard')) {
    recommendedPillar = 'UI/UX Design + Web & SaaS Engineering';
  } else if (text.includes('sales') || text.includes('lead') || text.includes('crm') || text.includes('whatsapp')) {
    recommendedPillar = 'AI Solutions (Sales Assistant) + Business Automation';
  } else if (text.includes('saas') || text.includes('portal') || text.includes('platform')) {
    recommendedPillar = 'Web & SaaS + Operations Assistant';
  }

  const aiAssessment = `High-impact ${
    category || 'AI Workflow'
  } opportunity: We recommend pairing ${recommendedPillar} with structured webhook intake and automated status triggers to achieve "${
    businessGoal || 'faster operational turnaround'
  }" within a 3–5 week delivery sprint.`;

  return { aiAssessment, recommendedPillar };
}
