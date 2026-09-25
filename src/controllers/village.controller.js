const VillageModel = require("../models/village.model");

async function getProfile(req, res) {
  const profile = await VillageModel.getVillageProfile();
  return res.status(200).json({
    message: "Master data desa retrieved successfully",
    data: profile,
  });
}

async function updateProfile(req, res) {
  const {
    village_name,
    head_of_village,
    vision,
    mission,
    address,
    phone,
    email,
    description,
  } = req.body;

  const currentProfile = await VillageModel.getVillageProfile();

  let logo_url = currentProfile ? currentProfile.logo_url : null;
  let banner_url = currentProfile ? currentProfile.banner_url : null;

  if (req.files) {
    if (req.files.logo && req.files.logo.length > 0) {
      logo_url = `/uploads/${req.files.logo[0].filename}`;
    }
    if (req.files.banner && req.files.banner.length > 0) {
      banner_url = `/uploads/${req.files.banner[0].filename}`;
    }
  }

  const updatedProfile = await VillageModel.updateVillageProfile({
    village_name,
    head_of_village,
    vision,
    mission,
    address,
    phone,
    email,
    logo_url,
    banner_url,
    description,
  });

  return res.status(200).json({
    message: "Master data desa updated successfully",
    data: updatedProfile,
  });
}

module.exports = {
  getProfile,
  updateProfile,
};
