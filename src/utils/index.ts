const makeBtn = (
  innerText: string,
  className?: string[]
): HTMLButtonElement => {
  const b = document.createElement("button");
  className &&
    className.forEach((cname) => {
      b.classList.add(cname);
    });
  b.innerHTML = innerText;
  return b;
};

const makeElement = <K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string
): HTMLElementTagNameMap[K] => {
  const element = document.createElement(tagName);
  className && element.classList.add(className);
  return element;
};

const getRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date().getTime();
  const diffMs = now - date.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
};

export { makeBtn, makeElement, getRelativeTime };
