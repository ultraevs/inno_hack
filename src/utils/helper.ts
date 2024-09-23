export const bgByFieldMap = new Map([
  ["not started", ["#C63A3A", "#FFD0D1"]],
  ["in progress", ["#4D3AC6", "#D0DBFF"]],
  ["done", ["#3AC64F", "#D0FFD0"]],
]);

export const getBgByField = (alt: string): string[] =>
  bgByFieldMap.get(alt) || ["#939393", "#E9E9E9"];
