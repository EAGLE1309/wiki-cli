const wait = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

export default wait