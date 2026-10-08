(() => {
  const pick = (list) => list[Math.floor(Math.random() * list.length)];
  const next = ihmRewrite(location.href, pick);
  if (next && next !== location.href) history.replaceState(history.state, "", next);
})();
