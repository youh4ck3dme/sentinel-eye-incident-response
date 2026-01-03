# 👁️ Sentinel Eye - Incident Response AI (v2.5 EXTREME)

> **Advanced Fraud Detection System** utilizing Google's Gemini 1.5 Flash model combined with a robust local heuristic engine for offline resilience.

![Sentinel Eye Banner](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

---

## 🚀 Key Features (Functional Specification)

### 1. 📱 UI & UX MODULES (The Visual Layer)

#### **PBX Command Center**

The core interface is a **"Glassmorphic" Command Center** designed for high-stress security operations.

- **Visual Style:** Dark-mode first, utilizing `bg-zinc-900/40` with `backdrop-blur-2xl` for a depth-rich, futuristic aesthetic.
- **Interaction Design:**
  - **Connection Panel:** A dedicated "PBX KONFIGURÁCIA" module allows granular control over SIP Server IPs, WSS Ports, and Line Extensions.
  - **Haptic/Visual Feedback:** Connect buttons transition from "PRIPOJIŤ" (Red/Pulse) to "PRIPOJENÉ" (Zinc/Static) upon handshake.
  - **Telemetry:** A footer ("Telemetry Engine v2.5") mimics hardware appliance readout.

#### **Incident Response Dashboard**

A real-time visualization surface for active threats.

- **Activity Log:** A scrolling "Terminal-style" feed displaying events with semantic coloring:
  - **🔴 RED**: Critical Errors / High Threat Detections.
  - **🟢 GREEN**: Successful Handshakes / Safe Status.
  - **GRAY**: System Info / Heartbeats.
- **Live Status:** A pulsing "Live Stream" indicator ensures operators know the data is real-time.
- **Micro-Animations:** Elements enter via `slide-in-from-bottom` and `fade-in`, maintaining a fluid, 60fps experience.

#### **PWA Capabilities**

- **Native-Like Experience:** Powered by `vite-plugin-pwa`, the application is fully installable on iOS and Android.
- **Offline Resilience:** Critical UI shells and the **Local Heuristic Engine** remain functional even without an internet connection.

### 2. 🧠 AI INTEGRATION (Client-Side Logic)

#### **Real-Time Audio & Text Analysis**

The system employs a **Hybrid Intelligence Architecture** to process voice data:

- **Input Processing:** Web Audio API captures raw streams, which are transcribed and fed into the analysis engine.
- **Latency Optimization:** Immediate "Pre-flight" analysis happens directly in the browser using Regex-based pattern matching.

#### **Hybrid AI Engine**

The threat detection logic operates on two layers:

1. **Layer 1 (Cloud):** Asynchronous calls to `/api/analyze` (powered by **Google Gemini models via `@google/genai`**) for deep semantic understanding.
2. **Layer 2 (Local Heuristic Fallback):** A robust, client-side JavaScript engine ("HEURISTIC FALLBACK ENGINE") that executes if the cloud is unreachable.
    - **Pattern Recognition:** Scans for regex patterns including: *Financial*, *Urgency*, *Impersonation*.
    - **Scoring Algorithm:** Calculates a composite `score` (0-100). If `score >= 50`, it triggers a **CRITICAL THREAT**.

### 3. 🛡️ SECURITY ARCHITECTURE (Zero-Trust Frontend)

#### **Strict Security Protocols**

- **NIST SP 800-61r2 Compliance:** The threat categorization aligns with international incident response standards.
- **OWASP Alignment:** Active monitoring for Session Hijacking indicators (`sid=`, `token`, `cookie` keywords).
- **Transport Security:** Enforced HTTPS via `mkcert` and strictly secure WSS connections for PBX traffic.

#### **Zero-Trust UI Behavior**

- **Re-Authentication Gates:** Critical configuration changes require re-entry of credentials.
- **Defensive Data Handling:** The application presumes all input is potentially malicious.

### 4. 🚀 "WOW" FEATURES LIST

- **⚡ In-Browser Voice Deception Detection:** A fully client-side "Lie Detector" that correlates "Urgency" + "Impersonation" keywords to boost threat scores instantly without server latency.
- **🕸️ Resilient Hybrid AI:** Automatically fails over from Cloud AI to a **Local Regex Engine** in milliseconds if the internet is cut.
- **🎨 Cinematic "Glass" UI:** A React 19 interface utilizing `backdrop-filter` and hardware-accelerated CSS animations.
- **📊 Dynamic Risk Matrix:** Calculates `Likelihood` vs. `Impact` in real-time to generate a sophisticated "Composite Risk Score".
- **🔊 Synthetic Counter-Measures:** Capable of generating "Security TTS" audio to automate responses.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, TailwindCSS
- **Build Tool**: Vite 6.0 (configured with `vite-plugin-pwa`)
- **AI Integration**: `@google/genai` SDK + Server-side Proxy
- **Testing**: Vitest, React Testing Library, MSW
- **Security**: Server-side API Key injection (Edge-ready)

## 📦 Installation & Setup

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-repo/sentinel-eye.git
    cd sentinel-eye
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Configure Environment**:
    Create a `.env.local` file in the root directory:

    ```env
    GEMINI_API_KEY=your_google_gemini_api_key_here
    ```

4. **Run Development Server**:

    ```bash
    npm run dev
    ```

    Access at `http://localhost:5173`.

## 🧪 Testing

The project includes a comprehensive test suite covering Unit, Integration, and Scenario tests.

```bash
# Run all tests
npm run test

# Run tests with UI
npm run test:ui

# Check code coverage
npm run test:coverage
```

**Coverage**:

- ✅ **Unit Tests**: Components (Header, Input, Dashboard)
- ✅ **Integration**: Full App flows and Error Boundaries
- ✅ **Scenarios**: 6 Threat Categories (Financial, Family, Tech, Delivery, Authority, Crypto)
