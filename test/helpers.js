let count = 0;

function testPrint() {
  count++;
  console.log("TEST ->", count);
}

function errorPrint(mes, error) {
  console.error(mes, error.message);
  console.error(mes, error.response?.data ?? "No response data");
}

module.exports = {
  testPrint,
  errorPrint,
};
