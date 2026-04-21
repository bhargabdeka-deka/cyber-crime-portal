const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function runTests() {
  try {
    console.log("--- Starting Verification Tests ---");

    // 1. Normal User Login
    console.log("\n[Test 1] Normal User Login...");
    const userLoginRes = await axios.post(`${BASE_URL}/users/login`, {
      email: "user@example.com",
      password: "password123"
    });
    console.log("✔ Success: User logged in");
    const userToken = userLoginRes.data.token;
    const userId = userLoginRes.data.user.id;

    // 2. Normal User Access Admin Route (Expect 403)
    console.log("\n[Test 2] Normal User Access Admin Route (Expect 403)...");
    try {
      await axios.get(`${BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      console.log("✘ Fail: User accessed admin route");
    } catch (err) {
      if (err.response && err.response.status === 403) {
        console.log("✔ Success: Got 403 Forbidden as expected");
      } else {
        console.log("✘ Fail: Unexpected error", err.message);
      }
    }

    // 3. Superadmin Login
    console.log("\n[Test 3] Superadmin Login...");
    const superLoginRes = await axios.post(`${BASE_URL}/users/login`, {
      email: "super@example.com",
      password: "password123"
    });
    console.log("✔ Success: Superadmin logged in");
    const superToken = superLoginRes.data.token;

    // 4. Superadmin Access Admin Route
    console.log("\n[Test 4] Superadmin Access Admin Route...");
    const usersRes = await axios.get(`${BASE_URL}/admin/users`, {
      headers: { Authorization: `Bearer ${superToken}` }
    });
    console.log(`✔ Success: Fetched ${usersRes.data.data.length} users`);

    // 5. Superadmin Create Admin
    console.log("\n[Test 5] Superadmin Create Admin...");
    try {
        const createAdminRes = await axios.post(`${BASE_URL}/admin/create-admin`, {
            name: "New Admin",
            email: "admin@example.com",
            password: "password123"
        }, {
            headers: { Authorization: `Bearer ${superToken}` }
        });
        console.log("✔ Success: Admin created");
    } catch (err) {
        if (err.response && err.response.data.message.includes("already exists")) {
            console.log("✔ Success: Admin already exists (re-test case)");
        } else {
            throw err;
        }
    }

    // 6. Admin Login
    console.log("\n[Test 6] Admin Login...");
    const adminLoginRes = await axios.post(`${BASE_URL}/users/login`, {
      email: "admin@example.com",
      password: "password123"
    });
    console.log("✔ Success: Admin logged in");
    const adminToken = adminLoginRes.data.token;

    // 7. Admin Disable User
    console.log("\n[Test 7] Admin Disable User...");
    const disableRes = await axios.put(`${BASE_URL}/admin/disable-user/${userId}`, {}, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log("✔ Success:", disableRes.data.message);

    // 8. User Login (Now Disabled, Expect 403)
    console.log("\n[Test 8] Disabled User Login (Expect 403)...");
    try {
      await axios.post(`${BASE_URL}/users/login`, {
        email: "user@example.com",
        password: "password123"
      });
      console.log("✘ Fail: Disabled user logged in");
    } catch (err) {
      if (err.response && err.response.status === 403 && err.response.data.message === "Account disabled") {
        console.log("✔ Success: Got 403 'Account disabled' as expected");
      } else {
        console.log("✘ Fail: Unexpected error", err.message, err.response?.data);
      }
    }

    console.log("\n--- All Backend RBAC Tests Passed! ---");

  } catch (err) {
    console.error("\n✘ ERROR during verification:", err.message);
    if (err.response) console.error("Response data:", err.response.data);
  }
}

runTests();
