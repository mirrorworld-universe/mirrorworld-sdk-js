export const waitFor = (delay = 3000) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const random = (size = 5) => Math.round(Math.random() ** size);
