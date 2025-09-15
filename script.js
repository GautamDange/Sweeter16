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
function getAsmEl() { return $("InputASM"); }
function readAsm()   { return (getAsmEl()?.value ?? ""); }
function writeAsm(t) { const el = getAsmEl(); if (el) el.value = t; }

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
    tabContent.innerHTML = data.map(instruction => `
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
  btnReset?.addEventListener("click", () => {
    const asm = readAsm();
    const hasText = asm.trim().length > 0;
    let wantsDelete = false;

    if (hasText) {
      wantsDelete = window.confirm(
        "Reset will reload the simulator.\n If you also want to keep the ASM program text Click on Cancel."
      );
    }

    if (!wantsDelete && hasText) {
      sessionStorage.setItem(S16_KEEP, "1");
      sessionStorage.setItem(S16_TEXT, asm);
    } else {
      sessionStorage.removeItem(S16_KEEP);
      sessionStorage.removeItem(S16_TEXT);
    }

    location.reload();
  });
});
