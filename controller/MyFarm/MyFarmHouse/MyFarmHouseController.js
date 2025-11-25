import myFarmHouse from "../../../model/MyFarm/FarmHouse/FarmHouseModel.js";
import fs from "fs";

export const addFarmHouse = async (req, res) => {
  try {
    console.log('Request Body:', req.body);
    console.log('Uploaded Files:', req.files);

    // Parse array fields from JSON strings
    const parseArrayField = (field) => {
      if (!field || field === '') return [];
      try {
        if (typeof field === 'string') {
          return JSON.parse(field);
        }
        return Array.isArray(field) ? field : [field];
      } catch (error) {
        console.log(`Error parsing field: ${field}`, error);
        return Array.isArray(field) ? field : [field];
      }
    };

   
    const mediaFiles = req.files && req.files.length > 0 
      ? req.files.map((file) => ({
          fileName: file.filename,
          path: file.path,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size
        }))
      : [];

    const {
      user_id,
      farm_house_name,
      address,
      latitude,
      longitude,
      map_link,
      city,
      email,
      mobile,
      whatsapp_no,
      contact_person_name,
      contact_person_number,
      details_about,
      home_rules,
      policy,
      amenities,
      total_rooms,
      area_size,
      price_day_weekdays,
      price_day_weekend,
      same_day_booking_weekdays,
      same_day_booking_weekend,
      no_of_guest_allowed,
      bathrooms,
      extra_person_charge,
      number_of_extra_person,
      advance_payment_percentage,
      with_stay_in,
      with_stay_out,
      without_stay_in,
      without_stay_out,
      room_details,
      law_details,
      pool_details,
      facebook_link,
      instagram_link,
      twitter_link,
    } = req.body;

   
    if (!user_id || !farm_house_name || !address) {
      return res.status(400).json({
        success: false,
        message: "user_id, farm_house_name and address are required.",
      });
    }

    
    const farmhouseData = {
      user_id: parseInt(user_id),
      farm_house_name,
      address,
      latitude: latitude || null,
      longitude: longitude || null,
      map_link: map_link || null,
      city: city || null,
      email: email || null,
      mobile: mobile || null,
      whatsapp_no: whatsapp_no || null,
      contact_person_name: contact_person_name || null,
      contact_person_number: contact_person_number || null,
      upload_media: mediaFiles,
      details_about: details_about || null,
      home_rules: parseArrayField(home_rules),
      policy: parseArrayField(policy),
      amenities: parseArrayField(amenities),
      total_rooms: total_rooms ? parseInt(total_rooms) : null,
      area_size: area_size || null,
      price_day_weekdays: price_day_weekdays ? parseFloat(price_day_weekdays) : null,
      price_day_weekend: price_day_weekend ? parseFloat(price_day_weekend) : null,
      same_day_booking_weekdays: same_day_booking_weekdays || null,
      same_day_booking_weekend: same_day_booking_weekend || null,
      no_of_guest_allowed: no_of_guest_allowed ? parseInt(no_of_guest_allowed) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      extra_person_charge: extra_person_charge ? parseFloat(extra_person_charge) : null,
      number_of_extra_person: number_of_extra_person ? parseInt(number_of_extra_person) : null,
      advance_payment_percentage: advance_payment_percentage ? parseFloat(advance_payment_percentage) : null,
      with_stay_in: with_stay_in || null,
      with_stay_out: with_stay_out || null,
      without_stay_in: without_stay_in || null,
      without_stay_out: without_stay_out || null,
      room_details: room_details || null,
      law_details: law_details || null,
      pool_details: pool_details || null,
      facebook_link: facebook_link || null,
      instagram_link: instagram_link || null,
      twitter_link: twitter_link || null,
    };

    console.log('Processed Farmhouse Data:', farmhouseData);

    const newFarm = await myFarmHouse.create(farmhouseData);

    return res.status(201).json({
      success: true,
      message: "Farm House Added Successfully",
      data: newFarm,
    });
  } catch (error) {
    console.error("FarmHouse Add Error: ", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const editFarmHouse = async (req, res) => {
  try {
    const { id } = req.params;

    const farmhouse = await myFarmHouse.findOne({ where: { id } });
    if (!farmhouse) {
      return res.status(404).json({
        success: false,
        message: "Farm House not found",
      });
    }

    const newMedia =
      req.files?.map((f) => ({
        fileName: f.filename,
        path: f.path,
      })) || [];

    const oldMedia = req.body.old_media ? JSON.parse(req.body.old_media) : [];

    const deleteMedia = req.body.delete_media
      ? JSON.parse(req.body.delete_media)
      : [];

    deleteMedia.forEach((media) => {
      try {
        if (media.path && fs.existsSync(media.path)) {
          fs.unlinkSync(media.path); // delete file from server
        }
      } catch (err) {
        console.log("File delete error:", err);
      }
    });

    const finalMedia = [...oldMedia, ...newMedia];

    const updatedFarm = await farmhouse.update({
      ...req.body,
      upload_media: finalMedia,
    });

    return res.status(200).json({
      success: true,
      message: "Farm House Updated Successfully",
      data: updatedFarm,
    });
  } catch (error) {
    console.error("FarmHouse Update Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteFarmHouse = async (req, res) => {
  try {
    const { id } = req.params;

    const farmhouse = await myFarmHouse.findOne({ where: { id } });

    if (!farmhouse) {
      return res.status(404).json({
        success: false,
        message: "Farm House not found",
      });
    }

    // 🟦 DELETE MEDIA FILES FROM SERVER
    const mediaFiles = farmhouse.upload_media || [];

    mediaFiles.forEach((file) => {
      try {
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path); // remove file
        }
      } catch (err) {
        console.log("Media delete error: ", err);
      }
    });

    // 🟦 Paranoid Delete (Soft Delete)
    await farmhouse.destroy();

    return res.status(200).json({
      success: true,
      message: "Farm House Deleted Successfully",
    });
  } catch (error) {
    console.error("FarmHouse Delete Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getFarmHousesByUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "user_id is required",
      });
    }

    const list = await myFarmHouse.findAll({
      where: { user_id },
      order: [["created_at", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      message: "FarmHouses fetched successfully",
      data: list,
    });
  } catch (error) {
    console.error("Get Farmhouses Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const getSingleFarmHouse = async (req, res) => {
  try {
    const { id } = req.params;

    const farmhouse = await myFarmHouse.findOne({ where: { id } });

    if (!farmhouse) {
      return res.status(404).json({
        success: false,
        message: "Farm House not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Farm House fetched successfully",
      data: farmhouse,
    });
  } catch (error) {
    console.error("Get Single FarmHouse Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};
