const db = require("../config/database");

// ============================================================
// 1. KEPALA DESA MODEL
// ============================================================
async function getVillageHead() {
  const [rows] = await db.query("SELECT * FROM village_head ORDER BY id ASC LIMIT 1");
  return rows[0] || null;
}

async function updateVillageHead(data) {
  const current = await getVillageHead();
  if (!current) {
    await db.query(
      `INSERT INTO village_head (name, photo_url, period, description) VALUES (?, ?, ?, ?)`,
      [data.name, data.photo_url || null, data.period, data.description || null]
    );
  } else {
    const name = data.name !== undefined ? data.name : current.name;
    const photoUrl = data.photo_url !== undefined ? data.photo_url : current.photo_url;
    const period = data.period !== undefined ? data.period : current.period;
    const description = data.description !== undefined ? data.description : current.description;

    await db.query(
      `UPDATE village_head SET name = ?, photo_url = ?, period = ?, description = ? WHERE id = ?`,
      [name, photoUrl, period, description, current.id]
    );
  }
  return await getVillageHead();
}

// ============================================================
// 2. VISI MISI MODEL
// ============================================================
async function getVisionMission() {
  const [rows] = await db.query("SELECT * FROM village_vision_mission ORDER BY id ASC LIMIT 1");
  return rows[0] || null;
}

async function updateVisionMission(data) {
  const current = await getVisionMission();
  if (!current) {
    await db.query(
      `INSERT INTO village_vision_mission (vision, mission) VALUES (?, ?)`,
      [data.vision, data.mission]
    );
  } else {
    const vision = data.vision !== undefined ? data.vision : current.vision;
    const mission = data.mission !== undefined ? data.mission : current.mission;

    await db.query(
      `UPDATE village_vision_mission SET vision = ?, mission = ? WHERE id = ?`,
      [vision, mission, current.id]
    );
  }
  return await getVisionMission();
}

// ============================================================
// 3. LETAK GEOGRAFIS & STATISTIK ADMINISTRASI MODEL
// ============================================================
async function getGeographics() {
  const [rows] = await db.query("SELECT * FROM village_geographics ORDER BY id ASC LIMIT 1");
  return rows[0] || null;
}

async function updateGeographics(data) {
  const current = await getGeographics();
  if (!current) {
    await db.query(
      `INSERT INTO village_geographics (google_maps_url, border_north, border_south, border_east, border_west, area_size, average_altitude, total_dusun, topography)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.google_maps_url,
        data.border_north,
        data.border_south,
        data.border_east,
        data.border_west,
        data.area_size,
        data.average_altitude,
        data.total_dusun || 0,
        data.topography,
      ]
    );
  } else {
    const gmaps = data.google_maps_url !== undefined ? data.google_maps_url : current.google_maps_url;
    const north = data.border_north !== undefined ? data.border_north : current.border_north;
    const south = data.border_south !== undefined ? data.border_south : current.border_south;
    const east = data.border_east !== undefined ? data.border_east : current.border_east;
    const west = data.border_west !== undefined ? data.border_west : current.border_west;
    const area = data.area_size !== undefined ? data.area_size : current.area_size;
    const altitude = data.average_altitude !== undefined ? data.average_altitude : current.average_altitude;
    const totalDusun = data.total_dusun !== undefined ? data.total_dusun : current.total_dusun;
    const topo = data.topography !== undefined ? data.topography : current.topography;

    await db.query(
      `UPDATE village_geographics SET 
        google_maps_url = ?, border_north = ?, border_south = ?, border_east = ?, border_west = ?,
        area_size = ?, average_altitude = ?, total_dusun = ?, topography = ?
       WHERE id = ?`,
      [gmaps, north, south, east, west, area, altitude, totalDusun, topo, current.id]
    );
  }
  return await getGeographics();
}

// ============================================================
// 4. MASTER APP SETTINGS MODEL
// ============================================================
async function getAppSettings() {
  const [rows] = await db.query("SELECT * FROM app_settings ORDER BY id ASC LIMIT 1");
  return rows[0] || null;
}

async function updateAppSettings(data) {
  const current = await getAppSettings();
  if (!current) {
    await db.query(
      `INSERT INTO app_settings (app_name, village_name, logo_url) VALUES (?, ?, ?)`,
      [data.app_name, data.village_name, data.logo_url || null]
    );
  } else {
    const appName = data.app_name !== undefined ? data.app_name : current.app_name;
    const villageName = data.village_name !== undefined ? data.village_name : current.village_name;
    const logoUrl = data.logo_url !== undefined ? data.logo_url : current.logo_url;

    await db.query(
      `UPDATE app_settings SET app_name = ?, village_name = ?, logo_url = ? WHERE id = ?`,
      [appName, villageName, logoUrl, current.id]
    );
  }
  return await getAppSettings();
}

// ============================================================
// 5. INFORMASI KANTOR & KONTAK DESA MODEL
// ============================================================
async function getOfficeInfo() {
  const [rows] = await db.query("SELECT * FROM village_office_info ORDER BY id ASC LIMIT 1");
  return rows[0] || null;
}

async function updateOfficeInfo(data) {
  const current = await getOfficeInfo();
  if (!current) {
    await db.query(
      `INSERT INTO village_office_info (office_address, operational_hours, operational_description, phone, email)
       VALUES (?, ?, ?, ?, ?)`,
      [
        data.office_address,
        data.operational_hours,
        data.operational_description || null,
        data.phone,
        data.email,
      ]
    );
  } else {
    const address = data.office_address !== undefined ? data.office_address : current.office_address;
    const hours = data.operational_hours !== undefined ? data.operational_hours : current.operational_hours;
    const desc = data.operational_description !== undefined ? data.operational_description : current.operational_description;
    const phone = data.phone !== undefined ? data.phone : current.phone;
    const email = data.email !== undefined ? data.email : current.email;

    await db.query(
      `UPDATE village_office_info SET 
        office_address = ?, operational_hours = ?, operational_description = ?, phone = ?, email = ?
       WHERE id = ?`,
      [address, hours, desc, phone, email, current.id]
    );
  }
  return await getOfficeInfo();
}

// Combined getter for all master data modules
async function getAllMasterData() {
  const [villageHead, visionMission, geographics, appSettings, officeInfo] = await Promise.all([
    getVillageHead(),
    getVisionMission(),
    getGeographics(),
    getAppSettings(),
    getOfficeInfo(),
  ]);

  return {
    app_settings: appSettings,
    village_head: villageHead,
    vision_mission: visionMission,
    geographics: geographics,
    office_info: officeInfo,
  };
}

module.exports = {
  getVillageHead,
  updateVillageHead,
  getVisionMission,
  updateVisionMission,
  getGeographics,
  updateGeographics,
  getAppSettings,
  updateAppSettings,
  getOfficeInfo,
  updateOfficeInfo,
  getAllMasterData,
};
