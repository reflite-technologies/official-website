/* Reflite Cyberspace - AI Assistant widget
   Standalone, added file. Does not read from or modify script.js/style.css.
   Client-side keyword-matching Q&A bot answering visitor questions about
   the website/business using the same facts published on the page. */
(function () {
  "use strict";

  var WA_NUMBER = "254115295927";
  var PHONE_DISPLAY = "0115295927";
  var EMAIL = "reflitetecnologies@gmail.com";
  var waUrl = function (msg) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
  };

  var PRICES = {
    "printing": "From KSh 10",
    "photocopying": "From KSh 5",
    "scanning": "From KSh 20",
    "typing": "From KSh 30",
    "cv design": "From KSh 300",
    "graphic design": "From KSh 300",
    "lamination": "From KSh 50",
    "binding": "From KSh 100",
    "computer services": "From KSh 50"
  };

  var SERVICES = [
    ["Printing", "Quality document printing for everyday and professional needs."],
    ["Photocopying", "Clear copies for documents, forms and records."],
    ["Scanning", "Convert physical documents into useful digital files."],
    ["Typing", "Accurate typing and document preparation."],
    ["Document Formatting", "Professional layout, formatting and cleanup."],
    ["Lamination", "Protect important documents with clean lamination."],
    ["Binding", "Neat binding for reports, projects and documents."],
    ["File Conversion", "Convert documents between common digital formats."],
    ["eCitizen Assistance", "Guidance with legitimate eCitizen services and processes."],
    ["KRA Services", "Assistance with legitimate KRA online services."],
    ["NSSF Services", "Assistance with legitimate NSSF online processes."],
    ["SHA Assistance", "Help navigating legitimate SHA-related online services."],
    ["HELB Services", "Assistance with legitimate HELB online services."],
    ["Passport Applications", "Guidance through passport application processes."],
    ["Visa Applications", "Digital assistance with legitimate visa application processes."],
    ["Certificate Applications", "Assistance with legitimate certificate application processes."],
    ["Business Registration", "Guidance for legitimate business registration processes."],
    ["Online Applications", "General assistance with legitimate online applications."],
    ["Graphic Design", "Professional visuals for personal and business needs."],
    ["CV Design", "Clean, modern CV design and document presentation."],
    ["Posters", "Promotional posters designed for print or digital use."],
    ["Business Cards", "Professional business card design."],
    ["Social Media Graphics", "Digital graphics for social media communication."],
    ["Video Editing", "Editing support for polished videos and content."],
    ["Computer Troubleshooting", "Diagnose and resolve common computer problems."],
    ["Software Installation", "Install legitimate software and configure applications."],
    ["Computer Setup", "Set up computers for everyday productivity."],
    ["Internet Services", "Internet access and basic digital connectivity support."],
    ["Email Assistance", "Create, configure and troubleshoot email accounts."],
    ["Website Development", "Professional websites for individuals and businesses."]
  ];

  // Intent knowledge base: each entry has keywords and a fixed answer,
  // written from the same facts published on the page (About, FAQ, Privacy,
  // Pricing, Contact sections).
  var INTENTS = [
    {
      kw: ["hello", "hi", "hey", "good morning", "good afternoon", "good evening"],
      a: "Hi! I'm the Reflite Cyberspace assistant. Ask me about our services, prices, location, hours, or how to reach us."
    },
    {
      kw: ["thank", "thanks", "asante"],
      a: "You're welcome! Anything else you'd like to know about our services?"
    },
    {
      kw: ["who are you", "what are you", "are you a bot", "are you human", "are you ai"],
      a: "I'm a simple automated assistant for the Reflite Cyberspace website. I can answer common questions about our services, pricing and contact details. For anything more specific, I'll point you to our team on WhatsApp or phone."
    },
    {
      kw: ["location", "where are you", "where is", "address", "based", "find you"],
      a: "Reflite Cyberspace is located in Kaimosi, Kenya."
    },
    {
      kw: ["contact", "phone", "call", "number", "email", "reach you", "get in touch"],
      a: "You can reach us by phone/WhatsApp on " + PHONE_DISPLAY + " or by email at " + EMAIL + ". There's also a WhatsApp button on this page."
    },
    {
      kw: ["whatsapp"],
      a: "Yes \u2014 use the green WhatsApp button on the site, or any \u201cGet Service\u201d button, to start a pre-filled WhatsApp inquiry with us."
    },
    {
      kw: ["hour", "open", "time", "when are you"],
      a: "For our current opening hours, please confirm directly with us on WhatsApp or by calling " + PHONE_DISPLAY + " \u2014 that isn't listed on the site."
    },
    {
      kw: ["who we are", "about", "what is reflite", "what do you do", "company"],
      a: "Reflite Cyberspace, under Reflite Technologies, is a professional digital service provider based in Kaimosi, Kenya, offering cyber, document, online, creative and computer services."
    },
    {
      kw: ["mission"],
      a: "Our mission: to provide accessible, reliable and responsible digital and cyber services to individuals, students, businesses and organizations."
    },
    {
      kw: ["vision"],
      a: "Our vision: to become a trusted digital service provider in Kenya."
    },
    {
      kw: ["value", "integrity", "professionalism"],
      a: "Our core values are Integrity, Privacy, Professionalism, Reliability, Satisfaction and Responsibility."
    },
    {
      kw: ["price", "cost", "fee", "how much", "charge", "rate"],
      a: buildPriceList()
    },
    {
      kw: ["government fee", "official fee", "extra charge"],
      a: "Our service/assistance fees are separate from official government or third-party fees. We don't invent or collect government fees on their behalf unless an official process expressly permits it."
    },
    {
      kw: ["service", "services", "what can you help", "offer"],
      a: "We offer cyber & document services (printing, photocopying, scanning, typing, lamination, binding), online assistance (eCitizen, KRA, NSSF, SHA, HELB, passports, visas, business registration), creative design (graphic design, CV design, posters, business cards, video editing) and computer/technology support. Ask me about any specific one!"
    },
    {
      kw: ["cv", "resume"],
      a: "Yes, we prepare professional CVs, including formatting and presentation. Price: " + PRICES["cv design"] + "."
    },
    {
      kw: ["graphic", "design", "poster", "flyer", "business card"],
      a: "Yes, we offer graphic design including posters, business cards and social media graphics. Price: " + PRICES["graphic design"] + "."
    },
    {
      kw: ["print"],
      a: "Yes, we provide quality document printing. Price: " + PRICES["printing"] + "."
    },
    {
      kw: ["photocopy", "copy", "copies"],
      a: "Yes, we do photocopying of documents, forms and records. Price: " + PRICES["photocopying"] + "."
    },
    {
      kw: ["scan"],
      a: "Yes, we scan physical documents into digital files. Price: " + PRICES["scanning"] + "."
    },
    {
      kw: ["type", "typing"],
      a: "Yes, we offer accurate typing and document preparation. Price: " + PRICES["typing"] + "."
    },
    {
      kw: ["laminat"],
      a: "Yes, we offer lamination to protect important documents. Price: " + PRICES["lamination"] + "."
    },
    {
      kw: ["bind"],
      a: "Yes, we offer neat binding for reports, projects and documents. Price: " + PRICES["binding"] + "."
    },
    {
      kw: ["ecitizen"],
      a: "Yes, we offer guidance with legitimate eCitizen services and processes."
    },
    {
      kw: ["kra", "tax", "pin"],
      a: "Yes, we assist with legitimate KRA online services."
    },
    {
      kw: ["nssf"],
      a: "Yes, we assist with legitimate NSSF online processes."
    },
    {
      kw: ["sha", "nhif"],
      a: "Yes, we help navigate legitimate SHA-related online services."
    },
    {
      kw: ["helb"],
      a: "Yes, we assist with legitimate HELB online services."
    },
    {
      kw: ["passport"],
      a: "Yes, we provide guidance through the passport application process."
    },
    {
      kw: ["visa"],
      a: "Yes, we provide digital assistance with legitimate visa application processes."
    },
    {
      kw: ["certificate"],
      a: "Yes, we assist with legitimate certificate application processes."
    },
    {
      kw: ["business registration", "register a business", "register my business"],
      a: "Yes, we provide guidance for legitimate business registration processes."
    },
    {
      kw: ["video"],
      a: "Yes, we offer video editing support for polished videos and content."
    },
    {
      kw: ["website", "web development", "web design"],
      a: "Yes, Reflite Technologies provides professional website development for individuals and businesses. Contact us to discuss your requirements."
    },
    {
      kw: ["computer", "laptop", "troubleshoot", "repair", "fix", "install", "software"],
      a: "We offer computer troubleshooting, software installation and computer setup. Price for computer services: " + PRICES["computer services"] + "."
    },
    {
      kw: ["internet", "wifi"],
      a: "Yes, we provide internet access and basic digital connectivity support."
    },
    {
      kw: ["privacy", "data", "password", "secure", "safe"],
      a: "We handle customer information responsibly: access to personal documents is limited to what's needed for the service, passwords are never unnecessarily stored or requested unless absolutely necessary, and sensitive documents aren't kept longer than needed."
    },
    {
      kw: ["hack", "illegal", "fraud", "impersonat", "unauthorized", "bypass"],
      a: "We only assist with lawful, legitimate digital services. We do not provide hacking, unauthorized access, impersonation, fraud, identity theft, malware or security bypass services."
    },
    {
      kw: ["how it works", "process", "how do i start", "how to order", "how to request"],
      a: "It's simple: 1) Browse or search our services, 2) Contact/visit us via WhatsApp, call or in person in Kaimosi, 3) We work with you to complete the task, 4) You review your completed work before you leave or submit it."
    },
    {
      kw: ["why", "why choose", "why should i"],
      a: "Fast service, affordable rates, customer privacy, professional assistance, reliable technology, friendly support, a convenient Kaimosi location, and quality results."
    },
    {
      kw: ["social media", "instagram", "tiktok", "youtube", "twitter", "facebook", "x.com"],
      a: "You can find us on Instagram (@reflite_technologies), TikTok and YouTube (@reflitetechnologies), and X (@reflitetechnologies) \u2014 links are in the footer."
    }
  ];

  function buildPriceList() {
    var lines = [];
    for (var name in PRICES) {
      if (Object.prototype.hasOwnProperty.call(PRICES, name)) {
        lines.push(cap(name) + ": " + PRICES[name]);
      }
    }
    return "Example service/assistance fees:\n" + lines.join("\n") +
      "\nPrices may vary by job size, complexity or finishing. Government/third-party fees are separate where applicable.";
  }

  function cap(s) {
    return s.replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function findServiceMatch(text) {
    for (var i = 0; i < SERVICES.length; i++) {
      var name = SERVICES[i][0];
      if (text.indexOf(name.toLowerCase()) !== -1) {
        return name + ": " + SERVICES[i][1];
      }
    }
    return null;
  }

  function answer(raw) {
    var text = raw.toLowerCase().trim();
    if (!text) return "Could you tell me a bit more about what you'd like to know?";

    var svc = findServiceMatch(text);

    var best = null, bestScore = 0;
    for (var i = 0; i < INTENTS.length; i++) {
      var intent = INTENTS[i], score = 0;
      for (var j = 0; j < intent.kw.length; j++) {
        if (text.indexOf(intent.kw[j]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = intent; }
    }

    if (best) return best.a;
    if (svc) return svc;

    return "I'm not fully sure about that one. For anything I can't answer, the fastest way to get a real answer is WhatsApp (" +
      PHONE_DISPLAY + ") or email (" + EMAIL + "). You can also tap a suggestion below.";
  }

  // ---- UI ----
  var SUGGESTIONS = ["What services do you offer?", "How much is CV design?", "Where are you located?", "How do I contact you?"];

  function build() {
    var launcher = document.createElement("button");
    launcher.className = "rc-bot-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", "Open AI assistant");
    launcher.innerHTML = "\u2726<span class=\"rc-dot\" aria-hidden=\"true\"></span>";

    var panel = document.createElement("div");
    panel.className = "rc-bot-panel";
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Reflite Cyberspace AI assistant");
    panel.innerHTML =
      '<div class="rc-bot-head">' +
        '<div class="rc-avatar" aria-hidden="true">R</div>' +
        '<div class="rc-title"><strong>Reflite Assistant</strong><small>Ask about our services</small></div>' +
        '<button type="button" class="rc-bot-close" aria-label="Close assistant">\u00d7</button>' +
      '</div>' +
      '<div class="rc-bot-body" id="rc-bot-body"></div>' +
      '<div class="rc-bot-suggestions" id="rc-bot-suggestions"></div>' +
      '<form class="rc-bot-form" id="rc-bot-form">' +
        '<input id="rc-bot-input" type="text" autocomplete="off" placeholder="Type your question...">' +
        '<button type="submit">Send</button>' +
      '</form>';

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var body = panel.querySelector("#rc-bot-body");
    var chips = panel.querySelector("#rc-bot-suggestions");
    var form = panel.querySelector("#rc-bot-form");
    var input = panel.querySelector("#rc-bot-input");
    var closeBtn = panel.querySelector(".rc-bot-close");
    var opened = false;

    function addMsg(text, who) {
      var el = document.createElement("div");
      el.className = "rc-bot-msg rc-" + who;
      el.textContent = text;
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;
    }

    function renderChips() {
      chips.innerHTML = "";
      SUGGESTIONS.forEach(function (s) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "rc-bot-chip";
        b.textContent = s;
        b.addEventListener("click", function () { handleUserText(s); });
        chips.appendChild(b);
      });
    }

    function handleUserText(text) {
      addMsg(text, "user");
      var reply = answer(text);
      setTimeout(function () { addMsg(reply, "bot"); }, 250);
    }

    function open() {
      panel.classList.add("rc-open");
      if (!opened) {
        addMsg("Hi! I'm the Reflite Cyberspace assistant. I can answer questions about our services, prices, location and how to reach us. What would you like to know?", "bot");
        renderChips();
        opened = true;
      }
      input.focus();
    }
    function close() { panel.classList.remove("rc-open"); }

    launcher.addEventListener("click", function () {
      panel.classList.contains("rc-open") ? close() : open();
    });
    closeBtn.addEventListener("click", close);

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var val = input.value.trim();
      if (!val) return;
      input.value = "";
      handleUserText(val);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
