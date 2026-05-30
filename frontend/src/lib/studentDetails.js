export const SCHOOL_TYPES = ["Government", "Govt-Aided", "Kendriya Vidyalaya", "JNV", "Private"];
export const BOARDS = ["Maharashtra State Board", "CBSE", "ICSE", "Other"];
export const PLACES = ["Rural", "Urban"];

export const buildAdditionalDetailsForm = (profile = {}) => {
  const additional = profile.additional_details || {};
  const address = profile.address_details || {};
  const tenth = profile.education_10th || {};
  const eleventh = profile.education_11th || {};
  const twelfth = profile.education_12th || {};
  const parent = profile.parent_details || {};

  return {
    mother_name: additional.mother_name || "",
    email: additional.email || "",
    religion: additional.religion || "",
    family_income: additional.family_income || "",
    aadhaar_number: additional.aadhaar_number || "",
    address: additional.address || "",
    taluka: address.taluka || "",
    address_district: address.district || "",
    pin_code: address.pin_code || "",
    edu_10_year: tenth.year || "",
    edu_10_place: tenth.place || "",
    edu_10_school_type: tenth.school_type || "",
    edu_10_board: tenth.board || "",
    edu_10_state: tenth.state || "",
    edu_10_district: tenth.district || "",
    edu_10_roll: tenth.roll || "",
    edu_10_total: tenth.total_marks || "",
    edu_10_obtained: tenth.obtained_marks || "",
    edu_10_percentage: tenth.percentage || "",
    edu_10_school: tenth.school || "",
    edu_10_school_address: tenth.school_address || "",
    edu_10_pin: tenth.pin_code || "",
    edu_11_year: eleventh.year || "",
    edu_11_place: eleventh.place || "",
    edu_11_college_type: eleventh.college_type || "",
    edu_11_board: eleventh.board || "",
    edu_11_state: eleventh.state || "",
    edu_11_district: eleventh.district || "",
    edu_11_roll: eleventh.roll || "",
    edu_11_total: eleventh.total_marks || "",
    edu_11_obtained: eleventh.obtained_marks || "",
    edu_11_percentage: eleventh.percentage || "",
    edu_11_college: eleventh.college || "",
    edu_11_college_address: eleventh.college_address || "",
    edu_11_pin: eleventh.pin_code || "",
    edu_12_year: twelfth.year || "",
    edu_12_place: twelfth.place || "",
    edu_12_college_type: twelfth.college_type || "",
    edu_12_board: twelfth.board || "",
    edu_12_state: twelfth.state || "",
    edu_12_district: twelfth.district || "",
    edu_12_roll: twelfth.roll || "",
    edu_12_total: twelfth.total_marks || "",
    edu_12_obtained: twelfth.obtained_marks || "",
    edu_12_percentage: twelfth.percentage || "",
    edu_12_college: twelfth.college || "",
    edu_12_college_address: twelfth.college_address || "",
    edu_12_pin: twelfth.pin_code || "",
    father_occupation: parent.father_occupation || "",
    father_qualification: parent.father_qualification || "",
    mother_occupation: parent.mother_occupation || "",
    mother_qualification: parent.mother_qualification || "",
  };
};

export const buildAdditionalPayload = (form = {}) => ({
  mother_name: form.mother_name || "",
  email: form.email || "",
  religion: form.religion || "",
  family_income: form.family_income || "",
  aadhaar_number: form.aadhaar_number || "",
  address: form.address || "",
  taluka: form.taluka || "",
  address_district: form.address_district || "",
  pin_code: form.pin_code || "",
  edu_10_year: form.edu_10_year || "",
  edu_10_place: form.edu_10_place || "",
  edu_10_school_type: form.edu_10_school_type || "",
  edu_10_board: form.edu_10_board || "",
  edu_10_state: form.edu_10_state || "",
  edu_10_district: form.edu_10_district || "",
  edu_10_roll: form.edu_10_roll || "",
  edu_10_total: form.edu_10_total || "",
  edu_10_obtained: form.edu_10_obtained || "",
  edu_10_percentage: form.edu_10_percentage || "",
  edu_10_school: form.edu_10_school || "",
  edu_10_school_address: form.edu_10_school_address || "",
  edu_10_pin: form.edu_10_pin || "",
  edu_11_year: form.edu_11_year || "",
  edu_11_place: form.edu_11_place || "",
  edu_11_college_type: form.edu_11_college_type || "",
  edu_11_board: form.edu_11_board || "",
  edu_11_state: form.edu_11_state || "",
  edu_11_district: form.edu_11_district || "",
  edu_11_roll: form.edu_11_roll || "",
  edu_11_total: form.edu_11_total || "",
  edu_11_obtained: form.edu_11_obtained || "",
  edu_11_percentage: form.edu_11_percentage || "",
  edu_11_college: form.edu_11_college || "",
  edu_11_college_address: form.edu_11_college_address || "",
  edu_11_pin: form.edu_11_pin || "",
  edu_12_year: form.edu_12_year || "",
  edu_12_place: form.edu_12_place || "",
  edu_12_college_type: form.edu_12_college_type || "",
  edu_12_board: form.edu_12_board || "",
  edu_12_state: form.edu_12_state || "",
  edu_12_district: form.edu_12_district || "",
  edu_12_roll: form.edu_12_roll || "",
  edu_12_total: form.edu_12_total || "",
  edu_12_obtained: form.edu_12_obtained || "",
  edu_12_percentage: form.edu_12_percentage || "",
  edu_12_college: form.edu_12_college || "",
  edu_12_college_address: form.edu_12_college_address || "",
  edu_12_pin: form.edu_12_pin || "",
  father_occupation: form.father_occupation || "",
  father_qualification: form.father_qualification || "",
  mother_occupation: form.mother_occupation || "",
  mother_qualification: form.mother_qualification || "",
});

export const getProfileCompletion = (profile = {}) => {
  const checks = [
    profile.full_name,
    profile.phone,
    profile.parent_phone,
    profile.gender,
    profile.dob,
    profile.district,
    profile.category,
    profile.additional_details?.email,
    profile.additional_details?.aadhaar_number,
    profile.address_details?.district,
    profile.education_10th?.board,
    profile.education_12th?.board,
    profile.parent_details?.father_occupation,
  ];

  const total = checks.length;
  const completed = checks.filter(Boolean).length;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100),
  };
};