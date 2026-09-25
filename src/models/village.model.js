const db = require("../config/database");

async function getVillageProfile() {
  const [rows] = await db.query(
    "SELECT * FROM village_profile ORDER BY id ASC LIMIT 1"
  );
  return rows[0] || null;
}

async function updateVillageProfile(data) {
  const current = await getVillageProfile();

  if (!current) {
    // Insert if no profile exists yet
    const [result] = await db.query(
      `INSERT INTO village_profile (village_name, head_of_village, vision, mission, address, phone, email, logo_url, banner_url, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.village_name,
        data.head_of_village,
        data.vision,
        data.mission,
        data.address,
        data.phone || null,
        data.email || null,
        data.logo_url || null,
        data.banner_url || null,
        data.description || null,
      ]
    );
    return await getVillageProfile();
  } else {
    // Update existing profile (id = 1)
    const updatedName = data.village_name !== undefined ? data.village_name : current.village_name;
    const updatedHead = data.head_of_village !== undefined ? data.head_of_village : current.head_of_village;
    const updatedVision = data.vision !== undefined ? data.vision : current.vision;
    const updatedMission = data.mission !== undefined ? data.mission : current.mission;
    const updatedAddress = data.address !== undefined ? data.address : current.address;
    const updatedPhone = data.phone !== undefined ? data.phone : current.phone;
    const updatedEmail = data.email !== undefined ? data.email : current.email;
    const updatedLogo = data.logo_url !== undefined ? data.logo_url : current.logo_url;
    const updatedBanner = data.banner_url !== undefined ? data.banner_url : current.banner_url;
    const updatedDesc = data.description !== undefined ? data.description : current.description;

    await db.query(
      `UPDATE village_profile SET 
        village_name = ?, 
        head_of_village = ?, 
        vision = ?, 
        mission = ?, 
        address = ?, 
        phone = ?, 
        email = ?, 
        logo_url = ?, 
        banner_url = ?, 
        description = ?
       WHERE id = ?`,
      [
        updatedName,
        updatedHead,
        updatedVision,
        updatedMission,
        updatedAddress,
        updatedPhone,
        updatedEmail,
        updatedLogo,
        updatedBanner,
        updatedDesc,
        current.id,
      ]
    );
    return await getVillageProfile();
  }
}

module.exports = {
  getVillageProfile,
  updateVillageProfile,
};
