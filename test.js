try {
  throw new Error([{ a: "1", b: "2" }]);
} catch (e) {
  console.error(e);
}
