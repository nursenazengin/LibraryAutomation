import axios from "axios";

export const fetchBooks = async (setSelectedBooks) => {
  try {
    const response = await axios.get("https://localhost:7253/api/Books");
    setSelectedBooks(response.data);
  } catch (error) {
    console.error("API'den veri çekerken hata:", error);
  }
};