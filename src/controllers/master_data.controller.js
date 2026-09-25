const MasterDataModel = require("../models/master_data.model");

// GET All Master Data in 1 Request
async function getAllMasterData(req, res) {
  const data = await MasterDataModel.getAllMasterData();
  return res.status(200).json({
    message: "All master data retrieved successfully",
    data,
  });
}

// 1. KEPALA DESA CONTROLLERS
async function getVillageHead(req, res) {
  const data = await MasterDataModel.getVillageHead();
  return res.status(200).json({
    message: "Master data Kepala Desa retrieved successfully",
    data,
  });
}

async function updateVillageHead(req, res) {
  const { name, period, description } = req.body;
  const current = await MasterDataModel.getVillageHead();

  let photo_url = current ? current.photo_url : null;
  if (req.file) {
    photo_url = `/uploads/${req.file.filename}`;
  }

  const updated = await MasterDataModel.updateVillageHead({
    name,
    period,
    description,
    photo_url,
  });

  return res.status(200).json({
    message: "Master data Kepala Desa updated successfully",
    data: updated,
  });
}

// 2. VISI MISI CONTROLLERS
async function getVisionMission(req, res) {
  const data = await MasterDataModel.getVisionMission();
  return res.status(200).json({
    message: "Master data Visi Misi retrieved successfully",
    data,
  });
}

async function updateVisionMission(req, res) {
  const { vision, mission } = req.body;
  if (!vision || !mission) {
    return res.status(400).json({ message: "Vision and mission are required" });
  }

  const updated = await MasterDataModel.updateVisionMission({
    vision,
    mission,
  });

  return res.status(200).json({
    message: "Master data Visi Misi updated successfully",
    data: updated,
  });
}

// 3. LETAK GEOGRAFIS & STATISTIK ADMINISTRASI CONTROLLERS
async function getGeographics(req, res) {
  const data = await MasterDataModel.getGeographics();
  return res.status(200).json({
    message: "Master data Letak Geografis retrieved successfully",
    data,
  });
}

async function updateGeographics(req, res) {
  const {
    google_maps_url,
    border_north,
    border_south,
    border_east,
    border_west,
    area_size,
    average_altitude,
    total_dusun,
    topography,
  } = req.body;

  const updated = await MasterDataModel.updateGeographics({
    google_maps_url,
    border_north,
    border_south,
    border_east,
    border_west,
    area_size,
    average_altitude,
    total_dusun,
    topography,
  });

  return res.status(200).json({
    message: "Master data Letak Geografis updated successfully",
    data: updated,
  });
}

// 4. MASTER APP SETTINGS CONTROLLERS
async function getAppSettings(req, res) {
  const data = await MasterDataModel.getAppSettings();
  return res.status(200).json({
    message: "Master data App Settings retrieved successfully",
    data,
  });
}

async function updateAppSettings(req, res) {
  const { app_name, village_name } = req.body;
  const current = await MasterDataModel.getAppSettings();

  let logo_url = current ? current.logo_url : null;
  if (req.file) {
    logo_url = `/uploads/${req.file.filename}`;
  }

  const updated = await MasterDataModel.updateAppSettings({
    app_name,
    village_name,
    logo_url,
  });

  return res.status(200).json({
    message: "Master data App Settings updated successfully",
    data: updated,
  });
}

// 5. INFORMASI KANTOR & KONTAK DESA CONTROLLERS
async function getOfficeInfo(req, res) {
  const data = await MasterDataModel.getOfficeInfo();
  return res.status(200).json({
    message: "Master data Informasi Kantor & Kontak Desa retrieved successfully",
    data,
  });
}

async function updateOfficeInfo(req, res) {
  const {
    office_address,
    operational_hours,
    operational_description,
    phone,
    email,
  } = req.body;

  const updated = await MasterDataModel.updateOfficeInfo({
    office_address,
    operational_hours,
    operational_description,
    phone,
    email,
  });

  return res.status(200).json({
    message: "Master data Informasi Kantor & Kontak Desa updated successfully",
    data: updated,
  });
}

module.exports = {
  getAllMasterData,
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
};
