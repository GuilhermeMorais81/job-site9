import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';

const STORAGE_KEY = "readAloudOn";
const HOVER_DELAY_MS = 350;
const START_DELAY_MS = 80;
const START_TIMEOUT_MS = 2000;
const READABLE = "h1, h2, h3, p, li, dt, dd, label, a, button, input, .meta";
const HIGHLIGHT_CLASS = "is-being-read";
const WORD_HIGHLIGHT = "read-aloud-word";

type OnWord = (start : number, length : number) => void;

interface TextPiece {
  node : Text;
  start : number;
}

@Component({
  selector: 'app-read-aloud',
  styleUrl: './read-aloud.css',
  templateUrl: './read-aloud.html',
})
export class ReadAloud {
  private _router = inject(Router);
  protected readonly isSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  protected isOn = signal<boolean>(false);
  private _hoverTimer : ReturnType<typeof setTimeout> | undefined;
  private _current : Element | null = null;
  private _session = 0;
  private _marker : HTMLElement | null = null;

  constructor() {
    if (!this.isSupported) return;
    speechSynthesis.getVoices();

    this._router.events
      .pipe(filter(event => event instanceof NavigationStart), takeUntilDestroyed())
      .subscribe(() => this.silence());

    document.addEventListener("pointerover", this.onPointerOver);
    document.addEventListener("focusin", this.onFocusIn);
    inject(DestroyRef).onDestroy(() => {
      document.removeEventListener("pointerover", this.onPointerOver);
      document.removeEventListener("focusin", this.onFocusIn);
      this.silence();
      this._marker?.remove();
    });

    if (this.readStoredState()) this.isOn.set(true);
  }

  toggle() {
    const next = !this.isOn();
    this.isOn.set(next);
    this.storeState(next);
    if (next) this.speak("Read aloud is on. Point at any text, tap it, or move to it with the keyboard to hear it.");
    else this.silence();
  }

  private onPointerOver = (event : PointerEvent) => {
    if (!this.isOn()) return;
    clearTimeout(this._hoverTimer);
    const element = this.readableFrom(event.target);
    if (!element || element === this._current) return;
    const delay = event.pointerType === "mouse" ? HOVER_DELAY_MS : 0;
    this._hoverTimer = setTimeout(() => this.read(element), delay);
  };

  private onFocusIn = (event : FocusEvent) => {
    if (!this.isOn()) return;
    const element = this.readableFrom(event.target);
    if (element && element !== this._current) this.read(element);
  };

  private readableFrom(target : EventTarget | null) : Element | null {
    if (!(target instanceof Element)) return null;
    if (target.closest(".read-aloud-toggle")) return null;
    return target.closest(READABLE);
  }

  private read(element : Element) {
    if (element instanceof HTMLInputElement) {
      const text = this.textOf(element);
      if (!text) return;
      this.highlight(element);
      this.speak(text);
      return;
    }

    const pieces : TextPiece[] = [];
    let text = "";
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      pieces.push({ node: node as Text, start: text.length });
      text += (node.textContent ?? "").replace(/\*/g, " ");
    }
    if (!text.trim()) return;

    this.highlight(element);
    this.speak(text, (start, length) => this.highlightWord(pieces, start, length));
  }

  private highlightWord(pieces : TextPiece[], start : number, length : number) {
    const piece = [...pieces].reverse().find(p => p.start <= start);
    if (!piece) return;
    const nodeLength = piece.node.length;
    const from = Math.min(start - piece.start, nodeLength);
    const to = Math.min(from + length, nodeLength);
    const range = document.createRange();
    range.setStart(piece.node, from);
    range.setEnd(piece.node, to);
    if ("highlights" in CSS) CSS.highlights.set(WORD_HIGHLIGHT, new Highlight(range));
    this.moveMarker(range.getBoundingClientRect());
  }

  private moveMarker(rect : DOMRect) {
    if (rect.width === 0) return;
    const marker = this.marker();
    const wasHidden = !marker.classList.contains("visible");
    if (wasHidden) marker.classList.add("no-slide");
    marker.style.transform = `translate(${rect.left + window.scrollX - 3}px, ${rect.top + window.scrollY - 1}px)`;
    marker.style.width = `${rect.width + 6}px`;
    marker.style.height = `${rect.height + 2}px`;
    if (wasHidden) {
      void marker.offsetWidth;
      marker.classList.remove("no-slide");
    }
    marker.classList.add("visible");
  }

  private marker() : HTMLElement {
    if (!this._marker) {
      this._marker = document.createElement("div");
      this._marker.className = "read-aloud-marker";
      this._marker.setAttribute("aria-hidden", "true");
      document.body.appendChild(this._marker);
    }
    return this._marker;
  }

  private textOf(element : Element) : string {
    if (element instanceof HTMLInputElement) {
      const label = element.labels?.[0]?.innerText ?? element.getAttribute("aria-label") ?? "";
      const hint = element.getAttribute("aria-describedby");
      const hintText = hint ? document.getElementById(hint)?.innerText ?? "" : "";
      return [label.replace("*", ", required"), hintText].filter(Boolean).join(". ");
    }
    const ariaLabel = element.getAttribute("aria-label");
    return (ariaLabel || (element as HTMLElement).innerText || "").replace(/\*/g, ", required").trim();
  }

  private highlight(element : Element) {
    this._current?.classList.remove(HIGHLIGHT_CLASS);
    element.classList.add(HIGHLIGHT_CLASS);
    this._current = element;
  }

  private speak(text : string, onWord? : OnWord) {
    const session = ++this._session;
    speechSynthesis.cancel();
    this.clearWord();
    setTimeout(() => this.utter(session, text, this.bestVoice(), onWord), START_DELAY_MS);
  }

  private utter(session : number, text : string, voice : SpeechSynthesisVoice | undefined, onWord? : OnWord) {
    if (session !== this._session) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.95;
    if (voice) utterance.voice = voice;
    let started = false;

    const fallBackToLocal = () => {
      if (session !== this._session || !voice || voice.localService) return;
      speechSynthesis.cancel();
      setTimeout(() => this.utter(session, text, this.localVoice(), onWord), START_DELAY_MS);
    };

    utterance.onstart = () => { started = true; };
    utterance.onboundary = (event) => {
      if (session !== this._session || event.name !== "word" || !onWord) return;
      const length = event.charLength || (/^\S+/.exec(text.slice(event.charIndex))?.[0].length ?? 0);
      if (length > 0) onWord(event.charIndex, length);
    };
    utterance.onend = () => {
      if (session === this._session) this.clearHighlight();
    };
    utterance.onerror = (event) => {
      if (event.error !== "interrupted" && event.error !== "canceled") fallBackToLocal();
    };

    speechSynthesis.resume();
    speechSynthesis.speak(utterance);
    setTimeout(() => { if (!started) fallBackToLocal(); }, START_TIMEOUT_MS);
  }

  private englishVoices() : SpeechSynthesisVoice[] {
    return speechSynthesis.getVoices().filter(v => v.lang.toLowerCase().startsWith("en"));
  }

  private bestVoice() : SpeechSynthesisVoice | undefined {
    const rank = (voice : SpeechSynthesisVoice) : number => {
      const name = voice.name.toLowerCase();
      if (name.includes("natural")) return 0;
      if (name.includes("google")) return 1;
      if (name.includes("online")) return 2;
      return 3;
    };
    return this.englishVoices().sort((a, b) =>
      rank(a) - rank(b) || Number(b.lang === "en-US") - Number(a.lang === "en-US")
    )[0];
  }

  private localVoice() : SpeechSynthesisVoice | undefined {
    const local = this.englishVoices().filter(v => v.localService);
    return local.find(v => v.lang === "en-US") ?? local[0];
  }

  private clearHighlight() {
    this._current?.classList.remove(HIGHLIGHT_CLASS);
    this._current = null;
    this.clearWord();
  }

  private clearWord() {
    if ("highlights" in CSS) CSS.highlights.delete(WORD_HIGHLIGHT);
    this._marker?.classList.remove("visible");
  }

  private silence() {
    clearTimeout(this._hoverTimer);
    this._session++;
    speechSynthesis.cancel();
    this.clearHighlight();
  }

  private readStoredState() : boolean {
    try { return localStorage.getItem(STORAGE_KEY) === "true"; }
    catch { return false; }
  }

  private storeState(on : boolean) {
    try { localStorage.setItem(STORAGE_KEY, String(on)); }
    catch { }
  }
}
