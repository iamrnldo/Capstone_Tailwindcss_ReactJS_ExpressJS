// Enum constants yang sync dengan database
export const GENDER_OPTIONS = [
  { value: "", label: "Pilih jenis kelamin" },
  { value: "laki-laki", label: "Laki-laki" },
  { value: "perempuan", label: "Perempuan" },
];

export const KELAS_OPTIONS = [
  { value: "", label: "Pilih kelas" },
  { value: "10", label: "Kelas 10" },
  { value: "11", label: "Kelas 11" },
  { value: "12", label: "Kelas 12" },
];

export const PEMINATAN_OPTIONS = [
  { value: "", label: "Pilih peminatan" },
  { value: "ipa", label: "IPA" },
  { value: "ips", label: "IPS" },
  { value: "bahasa", label: "Bahasa" },
];

// Helper functions
export const getGenderLabel = (value) => {
  const option = GENDER_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : "-";
};

export const getKelasLabel = (value) => {
  const option = KELAS_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : "-";
};

export const getPeminatanLabel = (value) => {
  const option = PEMINATAN_OPTIONS.find((opt) => opt.value === value);
  return option ? option.label : "-";
};
