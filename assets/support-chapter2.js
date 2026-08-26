(() => {
  "use strict";

  // The support dialog may still be opened manually from “支持本站”.
  // Automatic display is intentionally restricted to the exact transition
  // from the first chapter interlude into Chapter 2, and only once per browser.
  const AUTO_SHOWN_KEY = "dead-letter-room-support-auto-chapter2-v1";
  const PAID_KEY = "dead-letter-room-support-paid";
  const storyContinue = document.getElementById("story-continue");
  const storyKicker = document.getElementById("story-kicker");
  const chapterKicker = document.getElementById("chapter-kicker");
  const supportButton = document.getElementById("support-btn");
  const supportModal = document.getElementById("support-modal");

  if (!storyContinue || !storyKicker || !chapterKicker || !supportButton || !supportModal) return;

  let pendingChapterTwoPopup = false;

  const storageGet = key => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const storageSet = (key, value) => {
    try { localStorage.setItem(key, value); } catch (_) {}
  };

  const hasAlreadyHandledAutoPopup = () => Boolean(storageGet(AUTO_SHOWN_KEY) || storageGet(PAID_KEY));

  const showAfterChapterTransition = () => {
    if (!pendingChapterTwoPopup) return;
    pendingChapterTwoPopup = false;

    // finishStory("chapter1") updates the chapter synchronously.  A small delay
    // lets the interlude close and the Chapter 2 UI finish painting before the
    // support sheet is opened, so it never competes with the story transition.
    window.setTimeout(() => {
      if (hasAlreadyHandledAutoPopup()) return;
      if (chapterKicker.textContent.trim() !== "第二章") return;

      storageSet(AUTO_SHOWN_KEY, "1");
      supportButton.click();
    }, 120);
  };

  storyContinue.addEventListener("click", () => {
    if (hasAlreadyHandledAutoPopup()) return;

    // Only the first chapter's closing interlude is allowed to arm the popup.
    // Opening/continuing a Chapter 2 save, entering Chapters 1/3/4, returning
    // from menus, or manually opening the support dialog cannot trigger it.
    if (!storyKicker.textContent.includes("第一章之后")) return;

    pendingChapterTwoPopup = true;
    showAfterChapterTransition();
  }, true);
})();
