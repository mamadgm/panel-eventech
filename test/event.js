const axios = require("axios");
const API_BASE_URL = "https://apieventech.mammutepd.ir";

async function createEvent(token, name) {
  const formData = new FormData();

  formData.append("name", name);
  formData.append("start_acceptance", "2012-12-12:12:12");
  formData.append("start_time", "2012-12-12:12:13");
  formData.append("end_time", "2012-12-12:15:14");
  formData.append("hall_id", "");
  formData.append("using_algorithm", "false");
  formData.append("hall_name", "test_hall");
  formData.append("hall_capacity", "669");
  formData.append("hall_address", "test address , test address");

  const categories = ["test_cat1", "test_cat1"];

  categories.forEach((cat) => {
    formData.append("categories", cat);
  });
  //TODO: add image
  //   if (form.image instanceof File) {
  //     formData.append("image", form.image);
  //   }

  const response = await axios.post(`${API_BASE_URL}/api/v0/core/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  if (response.data) {
    return response.data;
  } else {
    throw new Error("Bad things");
  }
}

module.exports = {
  createEvent,
};
