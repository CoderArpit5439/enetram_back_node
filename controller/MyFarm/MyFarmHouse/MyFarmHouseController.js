
import myFarmHouseModel from "../../../model/MyFarm/FarmHouse/FarmHouseModel.js";

export const addFarmHouse = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;

 
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing or invalid",
      });
    }

    const token = authHeader.split(" ")[1].trim();


    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const authUserId = decoded.user.id; // ✅ ONLY JWT user_id

  
    const parseArrayField = (field) => {
      if (!field) return JSON.stringify([]);
      try {
        return JSON.stringify(JSON.parse(field));
      } catch {
        return JSON.stringify([field]);
      }
    };

    const frontImage = req.files?.front_image?.[0] ?? null;
    const sliderImages = req.files?.slider_images ?? [];

    const front_image = frontImage
      ? {
          fileName: frontImage.filename,
          url: `${baseUrl}/uploads/${frontImage.filename}`,
          originalName: frontImage.originalname,
          mimetype: frontImage.mimetype,
          size: frontImage.size,
        }
      : null;

    const slider_images =
      sliderImages.length > 0
        ? sliderImages.map((img) => ({
            fileName: img.filename,
            url: `${baseUrl}/uploads/${img.filename}`,
            originalName: img.originalname,
            mimetype: img.mimetype,
            size: img.size,
          }))
        : [];

    const {
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


    if (!farm_house_name || !address) {
      return res.status(400).json({
        success: false,
        message: "farm_house_name and address are required",
      });
    }

    const farmhouseData = {
      user_id: authUserId,
      farm_house_name,
      address,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      map_link: map_link || null,
      city: city || null,
      email: email || null,
      mobile: mobile || null,
      whatsapp_no: whatsapp_no || null,
      contact_person_name: contact_person_name || null,
      contact_person_number: contact_person_number || null,

      front_image,
      slider_images,

      details_about: details_about || null,
      home_rules: parseArrayField(home_rules),
      policy: parseArrayField(policy),
      amenities: parseArrayField(amenities),

      total_rooms: total_rooms ? parseInt(total_rooms) : null,
      area_size: area_size || null,

      price_day_weekdays: price_day_weekdays
        ? parseFloat(price_day_weekdays)
        : null,
      price_day_weekend: price_day_weekend
        ? parseFloat(price_day_weekend)
        : null,

      same_day_booking_weekdays: same_day_booking_weekdays
        ? parseFloat(same_day_booking_weekdays)
        : null,
      same_day_booking_weekend: same_day_booking_weekend
        ? parseFloat(same_day_booking_weekend)
        : null,

      no_of_guest_allowed: no_of_guest_allowed
        ? parseInt(no_of_guest_allowed)
        : null,

      bathrooms: bathrooms ? parseInt(bathrooms) : null,

      extra_person_charge: extra_person_charge
        ? parseFloat(extra_person_charge)
        : null,

      number_of_extra_person: number_of_extra_person
        ? parseInt(number_of_extra_person)
        : null,

      advance_payment_percentage: advance_payment_percentage
        ? parseFloat(advance_payment_percentage)
        : null,

      with_stay_in: with_stay_in ? parseFloat(with_stay_in) : null,
      with_stay_out: with_stay_out ? parseFloat(with_stay_out) : null,
      without_stay_in: without_stay_in ? parseFloat(without_stay_in) : null,
      without_stay_out: without_stay_out ? parseFloat(without_stay_out) : null,

      room_details: room_details || null,
      law_details: law_details || null,
      pool_details: pool_details || null,

      facebook_link: facebook_link || null,
      instagram_link: instagram_link || null,
      twitter_link: twitter_link || null,
    };

  
    const newFarmHouse = await myFarmHouseModel.create(farmhouseData);

    return res.status(201).json({
      success: true,
      message: "Farm House Added Successfully",
      data: newFarmHouse,
    });

  } catch (error) {
    console.error("FarmHouse Add Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const updateFarmHouse = async (req, res) => {
  try {
    const farmHouseId = req.params.id;

    const existingFarmHouse = await myFarmHouseModel.findByPk(farmHouseId);

    if (!existingFarmHouse) {
      return res.status(404).json({
        success: false,
        message: "Farmhouse not found",
      });
    }

    const frontImage = req.files?.front_image?.[0] || null;
    const sliderImages = req.files?.slider_images || [];

    const front_image = frontImage
      ? {
          fileName: frontImage.filename,
          path: frontImage.path,
          originalName: frontImage.originalname,
          mimetype: frontImage.mimetype,
          size: frontImage.size,
        }
      : existingFarmHouse.front_image;

    const slider_images =
      sliderImages.length > 0
        ? sliderImages.map((img) => ({
            fileName: img.filename,
            path: img.path,
            originalName: img.originalname,
            mimetype: img.mimetype,
            size: img.size,
          }))
        : existingFarmHouse.slider_images;

    const updatedData = {
      ...req.body,
      front_image,
      slider_images,
    };

    await existingFarmHouse.update(updatedData);

    return res.status(200).json({
      success: true,
      message: "Farmhouse updated successfully",
      data: existingFarmHouse,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Update failed",
      error: error.message,
    });
  }
};


export const deleteFarmHouse = async (req, res) => {
  try {
    const farmHouseId = req.params.id;

    const farmHouse = await myFarmHouseModel.findByPk(farmHouseId);

    if (!farmHouse) {
      return res.status(404).json({
        success: false,
        message: "Farmhouse not found",
      });
    }

    await farmHouse.destroy();

    return res.status(200).json({
      success: true,
      message: "Farmhouse deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Delete failed",
      error: error.message,
    });
  }
};


export const getFarmHouseById = async (req, res) => {
  try {
    const { id } = req.params;

    const farmhouse = await myFarmHouseModel.findByPk(id);

    if (!farmhouse) {
      return res.status(404).json({
        success: false,
        message: "Farmhouse not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: farmhouse,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};


export const getFarmHousesByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;

    const farmHouses = await myFarmHouseModel.findAll({
      where: { user_id },
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: farmHouses.length,
      data: farmHouses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};


export const getAllFarmHouses = async (req, res) => {
  try {
    const farmHouses = await myFarmHouseModel.findAll({
      order: [["id", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      count: farmHouses.length,
      data: farmHouses,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Fetch failed",
      error: error.message,
    });
  }
};
