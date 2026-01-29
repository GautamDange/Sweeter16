"use strict";

/* -----------------------------
   Visual helpers (kept as-is)
--------------------------------*/
function flashElement(elementId) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.classList.remove("highlight-flash");
  void el.offsetWidth; // restart CSS animation
  el.classList.add("highlight-flash");
}

function flashButton(buttonId) {
  const btn = document.getElementById(buttonId);
  if (!btn) return;
  btn.classList.add("highlight-flash");
  setTimeout(() => btn.classList.remove("highlight-flash"), 5000);
}

function disableConvertButton() {
  const btn = document.getElementById("Convert");
  if (!btn) return;
  btn.disabled = true;
  btn.innerText = " Converted ";
  flashButton("RUN_NEXT"); // keep your flashing on RUN_NEXT
}

/* -----------------------------
   Tiny helpers
--------------------------------*/
const $ = (id) => document.getElementById(id);

/* -----------------------------
   RESET: preserve ASM across reload (unless user confirms delete)
--------------------------------*/
const S16_KEEP = "s16-asm-keep";
const S16_TEXT = "s16-asm-text";
const S16_CLEARED = "s16-asm-cleared";
function getAsmEl() { return $("InputASM"); }
function readAsm()   { return (getAsmEl()?.value ?? ""); }
function writeAsm(t) { const el = getAsmEl(); if (el) el.value = t; }

/* -----------------------------
   Validate: R0/R1 are fixed constants
--------------------------------*/
const FIXED_REGS = new Set(["R0", "R1"]);
const WRITE_RULES = {
  // Writes to first operand register (Rd or in-place)
  "LDL": "reg1",
  "LDH": "reg1",
  "LDD": "reg1",
  "LDR": "reg1",
  "IN": "reg1",

  "ADD": "reg1",
  "SUB": "reg1",
  "MUL": "reg1",
  "DIV": "reg1",
  "ADC": "reg1",
  "SBB": "reg1",
  "XOR": "reg1",
  "OR":  "reg1",
  "AND": "reg1",
  "NOT": "reg1",

  "SHLC": "reg1",
  "SHRC": "reg1",
  "ROLC": "reg1",
  "RORC": "reg1",
  "ROLN": "reg1",
  "RORN": "reg1",

  "MAX": "reg1",
  "MIN": "reg1",
  "REV": "reg1",
  "CRC": "reg1",

  "INR": "reg1",
  "DCR": "reg1",
  "SET": "reg1",
  "CLEAR": "reg1",
  "ONE": "reg1",
  "POP": "reg1",

  // Writes to both operands
  "SWAP": "reg1_reg2",
  "SWP":  "reg1_reg2",

  // Note: *_ALL instructions only affect writable regs (R2..R7) in this simulator.
  // "SET_ALL": "all",
  // "CLEAR_ALL": "all",
  // "ONE_ALL": "all",
};

function normalizeAsmLine(line) {
  // remove comments, commas, extra whitespace
  return line
    .split(";")[0]
    .replace(/,/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function findWritesToFixedRegisters(asmText) {
  const rawLines = String(asmText ?? "").split("\n");
  const issues = [];

  rawLines.forEach((raw, idx) => {
    const lineNumber = idx + 1;
    const cleaned = normalizeAsmLine(raw);
    if (!cleaned) return;

    let tokens = cleaned.split(" ");

    // Allow "label: INSTR ..."
    if (tokens[0]?.endsWith(":")) {
      tokens = tokens.slice(1);
      if (tokens.length === 0) return;
    }

    const op = (tokens[0] || "").toUpperCase();
    const rule = WRITE_RULES[op];
    if (!rule) return;

    const r1 = (tokens[1] || "").toUpperCase();
    const r2 = (tokens[2] || "").toUpperCase();

    const hit = (reg) => FIXED_REGS.has(reg);

    if (rule === "all") {
      issues.push({ lineNumber, op, raw: raw.trim(), reg: "R0/R1" });
      return;
    }

    if (rule === "reg1") {
      if (hit(r1)) issues.push({ lineNumber, op, raw: raw.trim(), reg: r1 });
      return;
    }

    if (rule === "reg1_reg2") {
      if (hit(r1)) issues.push({ lineNumber, op, raw: raw.trim(), reg: r1 });
      if (hit(r2)) issues.push({ lineNumber, op, raw: raw.trim(), reg: r2 });
      return;
    }
  });

  return issues;
}

/* -----------------------------
   Content loaders
--------------------------------*/
function loadSamplePrograms() {
  const tabContent = $("tabContent");
  if (!tabContent) return;
  import("./Sample_program.js").then((module) => {
    const data = module?.default ?? [];
    tabContent.innerHTML = data.map(program => `
      <h3>${program.name}</h3>
      <pre><code>${program.code.trim()}</code></pre>
      <hr>
    `).join("");
  }).catch(err => {
    tabContent.innerHTML = `<p>Error loading sample programs: ${err.message}</p>`;
  });
}

function loadInstructionSet() {
  const tabContent = $("tabContent");
  if (!tabContent) return;
  import("./Sample_instructions.js").then((module) => {
    const data = module?.default ?? [];
    const sorted = [...data].sort((a, b) => (a?.name ?? "").localeCompare((b?.name ?? ""), undefined, { sensitivity: "base" }));
    tabContent.innerHTML = sorted.map(instruction => `
      <h3>${instruction.name}</h3>
      <p><strong>Syntax:</strong> <code>${instruction.syntax}</code></p>
      <p><strong>Description:</strong> ${instruction.description}</p>
      <pre><code>${instruction.example}</code></pre>
      <hr>
    `).join("");
  }).catch(err => {
    tabContent.innerHTML = `<p>Error loading instruction set: ${err.message}</p>`;
  });
}

/* -----------------------------
   RESET dialog (Keep / Clear)
--------------------------------*/
function showResetDialog({ onKeep, onClear }) {
  // Avoid duplicates
  const existing = document.getElementById("s16-reset-overlay");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "s16-reset-overlay";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.45)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";

  const modal = document.createElement("div");
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.style.width = "min(520px, calc(100vw - 32px))";
  modal.style.background = "#fff";
  modal.style.borderRadius = "12px";
  modal.style.boxShadow = "0 10px 30px rgba(0,0,0,0.25)";
  modal.style.padding = "16px";

  const title = document.createElement("div");
  title.textContent = "Reset simulator?";
  title.style.fontWeight = "700";
  title.style.fontSize = "1.1rem";
  title.style.marginBottom = "8px";

  const body = document.createElement("div");
  body.textContent = "Do you want to keep the currently written ASM program text after reset?";
  body.style.marginBottom = "14px";

  const btnRow = document.createElement("div");
  btnRow.style.display = "flex";
  btnRow.style.gap = "10px";
  btnRow.style.justifyContent = "flex-end";

  const btnClear = document.createElement("button");
  btnClear.type = "button";
  btnClear.className = "primary-btn";
  btnClear.textContent = "Clear code";
  btnClear.style.backgroundColor = "#6c757d";
  // Override global button CSS inside modal
  btnClear.style.width = "auto";
  btnClear.style.maxWidth = "none";
  btnClear.style.margin = "0";
  btnClear.style.display = "inline-flex";
  btnClear.style.justifyContent = "center";
  btnClear.style.alignItems = "center";
  btnClear.style.padding = "10px 14px";

  const btnKeep = document.createElement("button");
  btnKeep.type = "button";
  btnKeep.className = "primary-btn";
  btnKeep.textContent = "Keep code";
  // Override global button CSS inside modal
  btnKeep.style.width = "auto";
  btnKeep.style.maxWidth = "none";
  btnKeep.style.margin = "0";
  btnKeep.style.display = "inline-flex";
  btnKeep.style.justifyContent = "center";
  btnKeep.style.alignItems = "center";
  btnKeep.style.padding = "10px 14px";

  function close() {
    overlay.remove();
    document.removeEventListener("keydown", onKeyDown, true);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") {
      // Default action: keep
      e.preventDefault();
      close();
      onKeep?.();
    }
    if (e.key === "Enter") {
      // Default action: keep
      e.preventDefault();
      close();
      onKeep?.();
    }
  }

  btnKeep.addEventListener("click", () => {
    close();
    onKeep?.();
  });
  btnClear.addEventListener("click", () => {
    close();
    onClear?.();
  });

  // Clicking outside the modal = keep (default)
  overlay.addEventListener("click", (e) => {
    if (e.target !== overlay) return;
    close();
    onKeep?.();
  });

  btnRow.appendChild(btnClear);
  btnRow.appendChild(btnKeep);
  modal.appendChild(title);
  modal.appendChild(body);
  modal.appendChild(btnRow);
  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  document.addEventListener("keydown", onKeyDown, true);
  btnKeep.focus();
}

/* -----------------------------
   Wire everything after DOM is ready
--------------------------------*/
document.addEventListener("DOMContentLoaded", () => {
  const btnConvert      = $("Convert");
  const btnRunNext      = $("RUN_NEXT");
  const btnReset        = $("RESET");
  const tabPrograms     = $("tabPrograms");
  const tabInstructions = $("tabInstructions");
  const tabManual       = $("tabManual");
  const tabContent      = $("tabContent");

  // Restore ASM if preserved
  if (sessionStorage.getItem(S16_KEEP) === "1") {
    writeAsm(sessionStorage.getItem(S16_TEXT) || "");
  }
  sessionStorage.removeItem(S16_KEEP);
  sessionStorage.removeItem(S16_TEXT);

  // Convert
  btnConvert?.addEventListener("click", () => {
    const inputASM = readAsm();
    if (!inputASM.trim()) {
      alert("Please provide an ASM program to convert.");
      return;
    }

    const fixedWrites = findWritesToFixedRegisters(inputASM);
    if (fixedWrites.length > 0) {
      const lines = fixedWrites
        .slice(0, 8)
        .map(i => `Line ${i.lineNumber}: ${i.raw || i.op}`)
        .join("\n");
      const more = fixedWrites.length > 8 ? `\n...and ${fixedWrites.length - 8} more.` : "";
      alert(
        "Your program writes to fixed constant registers R0/R1.\n" +
        "R0 is hardcoded to 0x0000 and R1 is hardcoded to 0x0001.\n\n" +
        "Please change the destination register to one of: R2, R3, R4, R5, R6, R7.\n\n" +
        "Offending lines:\n" + lines + more
      );
      return;
    }

    try {
      // assemble() and loadProgram() must exist globally in your project
      const assembledProgram = assemble(inputASM);
      loadProgram(assembledProgram);
    } catch (error) {
      alert(`Error during assembly: ${error.message}`);
      return;
    }

    disableConvertButton();
    if (btnRunNext) btnRunNext.style.display = "inline-block";
    if (btnReset)   btnReset.style.display   = "inline-block";
    btnConvert.style.display = "none";
  });

  // Run Next
  btnRunNext?.addEventListener("click", () => {
    // executeNext() must exist globally in your project
    executeNext();
  });

  // Tabs
  tabPrograms?.addEventListener("click", () => {
    tabPrograms.classList.add("active");
    tabInstructions?.classList.remove("active");
    loadSamplePrograms();
  });

  tabInstructions?.addEventListener("click", () => {
    tabInstructions.classList.add("active");
    tabPrograms?.classList.remove("active");
    loadInstructionSet();
  });

  tabManual?.addEventListener("click", () => {
    tabManual.classList.add("active");
    tabPrograms?.classList.remove("active");
    tabInstructions?.classList.remove("active");

    // UserManual must be defined (e.g., loaded via <script> before this file)
    const manual = (typeof window.UserManual === "string") ? window.UserManual : "";
    const formattedManual = manual
      .replace(/## (.*?)\n/g, "<h2>$1</h2>\n")
      .replace(/# (.*?)\n/g, "<h1>$1</h1>\n")
      .replace(/\n/g, "<br>");
    if (tabContent) tabContent.innerHTML = formattedManual || "<p>Manual not loaded.</p>";
  });

  // Initial content & small effects
  loadSamplePrograms();      // default view
  flashButton("Convert");    // flash Convert on page load

  // Blink the Manual tab briefly
  if (tabManual) {
    tabManual.classList.add("blink");
    setTimeout(() => tabManual.classList.remove("blink"), 5000);
  }

  // RESET: ask before deleting ASM, preserve across reload if NO
  btnReset?.addEventListener("click", (e) => {
    // If an old handler exists in a cached script, prevent it from firing.
    e?.preventDefault?.();
    e?.stopImmediatePropagation?.();
    const asm = readAsm();
    const keep = () => {
      if (asm.trim().length > 0) {
        sessionStorage.setItem(S16_KEEP, "1");
        sessionStorage.setItem(S16_TEXT, asm);
      }
      location.reload();
    };

    const clear = () => {
      sessionStorage.removeItem(S16_KEEP);
      sessionStorage.removeItem(S16_TEXT);
      sessionStorage.setItem(S16_CLEARED, "1");
      location.reload();
    };

    showResetDialog({ onKeep: keep, onClear: clear });
  });
});
