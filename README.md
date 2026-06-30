# Auto-File-Sync-Monitor

An enterprise-grade administrative dashboard for monitoring automated file-transfer sync agents. It provides real-time status tracking, audit logging, role-based access control (RBAC), and GDPR/HIPAA compliance validation.

---

## 🚀 Step-by-Step Local Setup & Execution Guide

### 1. Resolve the `npm install` (ENOENT) Error
The error `npm error enoent Could not read package.json` occurs because your command prompt/terminal is in a folder that does not contain `package.json`.

**How to Fix:**
1. Open your terminal (`PS D:\Projects\Auto-File-Sync-Monitor>`).
2. Type `dir` or `ls` to list the files. If you extracted a ZIP file, it is highly likely the project files are nested in a subfolder (e.g., `D:\Projects\Auto-File-Sync-Monitor\auto-file-sync-monitor\`).
3. Change directory to where `package.json` is located:
   ```powershell
   cd name-of-the-nested-folder
   ```
4. Confirm you are in the correct folder (it should contain `package.json`, `vite.config.ts`, and the `src` folder), and run:
   ```bash
   npm install
   ```

---

### 2. Resolve VS Code "Problems"
The 7 TypeScript/Vite errors in your IDE (e.g., *Cannot find module '@tailwindcss/vite'*, *Cannot find name 'path'*, *'process'*, etc.) are completely caused by the missing `node_modules` folder.
- **The solution is automatic:** Once you run `npm install` successfully in the correct directory, TypeScript will locate the libraries and the `@types/node` definitions. All 7 IDE problems will disappear immediately.

---

### 3. Database & System Dependencies
- **No Database Server Required:** You **do not** need to install PostgreSQL, SQL Server, MySQL, or MongoDB. The application features an integrated, self-healing JSON datastore (`data-store.json`) that automatically bootstraps itself with full mock configurations, audit histories, and compliance stats upon startup.
- **Node.js:** Ensure you have Node.js installed (v18 or v20+ recommended).

---

### 4. Running the Dashboard Server Locally
The application is a full-stack Node.js (Express + Vite) app:
1. Install all dependencies:
   ```bash
   npm install
   ```
2. Build and run the server in development mode:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 🛠️ Testing the File Synchronization System

The application has been designed to allow end-to-end simulation on your local system, as well as actual deployment of scripts on your local Windows machine.

### Method A: Interactive Simulator (On the Dashboard)
1. Navigate to **Agent Overview & Simulator** on the dashboard.
2. Select **Local Agent-105** (or backup Agent-106).
3. Use the action buttons to simulate different real-world conditions:
   - **Run Scheduled Copy:** Simulates a successful copy event of a telemetry file.
   - **Simulate Route Timeout:** Simulates a network outage. It will show the agent entering an error state, buffer the file in the offline queue, and trigger an immediate critical alert banner simulating SMTP dispatch to your inbox (`dangebow@gmail.com`).
   - **Simulate Connection Restore:** Re-establishes the connection and flushes the queued files, confirming data integrity with simulated SHA-256 validation.

### Method B: Testing the Real Scripts on Your Local Machine
If you want to test the actual file copy behavior between folders on your local computer:

1. Create a simulated source directory on your C drive: `C:\iodata` (or any path).
2. Create a simulated destination directory (e.g., `C:\shared_destination`).
3. Navigate to the **Script Configurator & Download** tab on the dashboard.
4. Input your source folder (`C:\iodata`), destination folder (`C:\shared_destination`), log path, and your dashboard URL (`http://localhost:3000/api/agents/report`).
5. Download **`sync-agent.ps1`** and **`sync-agent.bat`** from the web dashboard.
6. Put some test files in `C:\iodata`.
7. Double-click `sync-agent.bat` or run the PowerShell script.
8. **Observe:**
   - The files are copied to your destination.
   - A secure, timestamped audit log is generated locally in `C:\iodata\sync_log.txt`.
   - The status is instantly reported back to your local web dashboard via API, updating the charts, file counters, and metrics in real-time!
   - Disconnect your network or change the destination path in the configurator to simulate failure—the script will automatically create a local `retry_queue.json` offline buffer and report the failure.

---

## 🛡️ Regulatory Compliance Enforcements
- **GDPR Article 25 (Privacy by Design):** The **Trace Logs & Audits** tab includes a **GDPR Mask** toggle. This automatically masks sensitive patient or employee identifiers in filenames when displayed in general auditing grids to prevent unintentional visual leakages.
- **HIPAA Security & Immutable Auditing:** Every user action (e.g. logging in as admin/auditor/operator, downloading scripts, clearing tables) creates an entry in the **Security Access Audit Trail** in the **GDPR/HIPAA Compliance** tab, matching HIPAA § 164.312(b) transmission and audit controls.
