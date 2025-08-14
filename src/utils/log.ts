export const c = {
  blue: (msg: string, ...a: any[]) =>
    console.log("%c" + msg, "color:#2196f3", ...a),
  primary: (msg: string, ...a: any[]) =>
    console.log(
      "%c" + msg,
      "background:#2196f3;color:#fff;padding:2px 6px;border-radius:2px",
      ...a
    ),

  random: (msg: string, ...a: any[]) => {
    const bg =
      "#" +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, "0");
    const r = parseInt(bg.slice(1, 3), 16);
    const g = parseInt(bg.slice(3, 5), 16);
    const b = parseInt(bg.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    const fg = yiq >= 128 ? "#000" : "#fff";
    console.log(
      "%c" + msg,
      `background:${bg};color:${fg};padding:2px 6px;border-radius:2px`,
      ...a
    );
  },

  success: (msg: string, ...a: any[]) =>
    console.log(
      "%c" + msg,
      "background:#4caf50;color:#fff;padding:2px 6px;border-radius:2px",
      ...a
    ),
  warn: (msg: string, ...a: any[]) =>
    console.log(
      "%c" + msg,
      "background:#ff9800;color:#000;padding:2px 6px;border-radius:2px",
      ...a
    ),
  error: (msg: string, ...a: any[]) =>
    console.log(
      "%c" + msg,
      "background:#f44336;color:#fff;padding:2px 6px;border-radius:2px",
      ...a
    )
};