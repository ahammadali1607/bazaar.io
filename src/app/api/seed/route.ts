import { db } from "@/db";
import { categories, products, reviews, deliveryPersons } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

const CATEGORIES_DATA = [
  { name: "Fresh Vegetables", slug: "vegetables", image: "https://images.pexels.com/photos/12298301/pexels-photo-12298301.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Farm-fresh vegetables delivered to your doorstep", sortOrder: 1 },
  { name: "Fresh Fruits", slug: "fruits", image: "https://images.pexels.com/photos/15537200/pexels-photo-15537200.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Seasonal & exotic fruits", sortOrder: 2 },
  { name: "Dairy & Eggs", slug: "dairy", image: "https://images.pexels.com/photos/5967316/pexels-photo-5967316.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Fresh milk, paneer, curd & eggs", sortOrder: 3 },
  { name: "Spices & Masala", slug: "spices", image: "https://images.pexels.com/photos/7829483/pexels-photo-7829483.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Aromatic spices for authentic cooking", sortOrder: 4 },
  { name: "Rice, Atta & Dal", slug: "staples", image: "https://images.pexels.com/photos/4444068/pexels-photo-4444068.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Essential staples for every kitchen", sortOrder: 5 },
  { name: "Oil & Ghee", slug: "oil-ghee", image: "https://images.pexels.com/photos/11025882/pexels-photo-11025882.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Cooking oils & pure ghee", sortOrder: 6 },
  { name: "Snacks & Namkeen", slug: "snacks", image: "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Crunchy snacks & traditional namkeen", sortOrder: 7 },
  { name: "Beverages", slug: "beverages", image: "https://images.pexels.com/photos/18258533/pexels-photo-18258533.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=400&w=400", description: "Tea, coffee & cold drinks", sortOrder: 8 },
];

const PRODUCTS_DATA = [
  // Vegetables (cat 1)
  { name: "Fresh Tomatoes", slug: "fresh-tomatoes", description: "Juicy, ripe tomatoes sourced from local farms. Perfect for curries, salads, and chutneys. Rich in lycopene and vitamins.", price: "35.00", mrp: "45.00", unit: "1 kg", image: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 1, isFeatured: true, rating: "4.5", reviewCount: 28, tags: ["fresh", "organic", "bestseller"] },
  { name: "Green Onions (Hara Pyaz)", slug: "green-onions", description: "Fresh spring onions, crisp and aromatic. Great for garnishing and stir-frying.", price: "20.00", mrp: "25.00", unit: "250 g", image: "https://images.pexels.com/photos/3872432/pexels-photo-3872432.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 1, isFeatured: false, rating: "4.2", reviewCount: 12, tags: ["fresh", "garnish"] },
  { name: "Fresh Potatoes (Aloo)", slug: "fresh-potatoes", description: "Premium quality potatoes. A staple in every Indian kitchen, perfect for sabzi, paratha, and more.", price: "30.00", mrp: "40.00", unit: "1 kg", image: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 1, isFeatured: true, rating: "4.6", reviewCount: 45, tags: ["staple", "bestseller"] },
  { name: "Fresh Cauliflower (Phool Gobi)", slug: "fresh-cauliflower", description: "Fresh white cauliflower, perfect for gobi paratha, aloo gobi, and stir-fry.", price: "40.00", mrp: "50.00", unit: "1 pc", image: "https://images.pexels.com/photos/461245/pexels-photo-461245.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 1, isFeatured: false, rating: "4.3", reviewCount: 15, tags: ["fresh", "seasonal"] },
  { name: "Lady Finger (Bhindi)", slug: "lady-finger", description: "Tender, young lady fingers. Great for bhindi masala and fry.", price: "45.00", mrp: "55.00", unit: "500 g", image: "https://images.pexels.com/photos/3652898/pexels-photo-3652898.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 1, isFeatured: false, rating: "4.1", reviewCount: 9, tags: ["fresh"] },
  { name: "Fresh Spinach (Palak)", slug: "fresh-spinach", description: "Nutrient-rich, fresh palak leaves. Ideal for palak paneer, dal palak, and smoothies.", price: "25.00", mrp: "30.00", unit: "500 g", image: "https://images.pexels.com/photos/2325843/pexels-photo-2325843.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 1, isFeatured: true, rating: "4.4", reviewCount: 18, tags: ["healthy", "iron-rich"] },

  // Fruits (cat 2)
  { name: "Fresh Bananas (Kela)", slug: "fresh-bananas", description: "Sweet, ripe bananas packed with potassium. Great for breakfast and snacking.", price: "40.00", mrp: "50.00", unit: "1 dozen", image: "https://images.pexels.com/photos/2872755/pexels-photo-2872755.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 2, isFeatured: true, rating: "4.7", reviewCount: 52, tags: ["popular", "healthy"] },
  { name: "Fresh Apples (Seb)", slug: "fresh-apples", description: "Crisp, juicy Shimla apples. Rich in fiber and antioxidants.", price: "120.00", mrp: "150.00", unit: "1 kg", image: "https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 2, isFeatured: true, rating: "4.5", reviewCount: 34, tags: ["premium", "healthy"] },
  { name: "Fresh Mangoes (Aam)", slug: "fresh-mangoes", description: "Alphonso-style sweet mangoes. The king of fruits, perfect for shakes and desserts.", price: "180.00", mrp: "220.00", unit: "1 kg", image: "https://images.pexels.com/photos/2294471/pexels-photo-2294471.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 2, isFeatured: true, rating: "4.8", reviewCount: 67, tags: ["seasonal", "premium", "bestseller"] },
  { name: "Sweet Oranges (Santra)", slug: "sweet-oranges", description: "Nagpur oranges, sweet and tangy. Loaded with Vitamin C.", price: "80.00", mrp: "100.00", unit: "1 kg", image: "https://images.pexels.com/photos/17975562/pexels-photo-17975562.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 2, isFeatured: false, rating: "4.3", reviewCount: 21, tags: ["citrus", "vitamin-c"] },
  { name: "Fresh Pomegranate (Anar)", slug: "fresh-pomegranate", description: "Ruby-red pomegranate seeds bursting with flavor. Great for juicing and garnishing.", price: "160.00", mrp: "200.00", unit: "1 kg", image: "https://images.pexels.com/photos/17245317/pexels-photo-17245317.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 2, isFeatured: false, rating: "4.6", reviewCount: 29, tags: ["superfood", "antioxidant"] },
  { name: "Fresh Guava (Amrood)", slug: "fresh-guava", description: "Local farm guavas, crunchy and sweet. Rich in Vitamin C.", price: "60.00", mrp: "75.00", unit: "1 kg", image: "https://images.pexels.com/photos/3758553/pexels-photo-3758553.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 2, isFeatured: false, rating: "4.4", reviewCount: 16, tags: ["local", "seasonal"] },

  // Dairy (cat 3)
  { name: "Farm Fresh Milk", slug: "farm-fresh-milk", description: "Pure, pasteurized full-cream milk from local dairy farms. Rich and creamy.", price: "65.00", mrp: "70.00", unit: "1 litre", image: "https://images.pexels.com/photos/36183642/pexels-photo-36183642.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 3, isFeatured: true, rating: "4.8", reviewCount: 89, tags: ["daily", "fresh", "bestseller"] },
  { name: "Fresh Paneer", slug: "fresh-paneer", description: "Soft, fresh cottage cheese made from pure milk. Perfect for paneer butter masala.", price: "90.00", mrp: "110.00", unit: "200 g", image: "https://images.pexels.com/photos/5737247/pexels-photo-5737247.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 3, isFeatured: true, rating: "4.6", reviewCount: 42, tags: ["fresh", "protein"] },
  { name: "Farm Fresh Eggs", slug: "farm-fresh-eggs", description: "Country eggs from free-range hens. Nutritious and delicious.", price: "85.00", mrp: "95.00", unit: "12 pcs", image: "https://images.pexels.com/photos/162712/egg-white-food-protein-162712.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 3, isFeatured: false, rating: "4.5", reviewCount: 36, tags: ["protein", "fresh"] },
  { name: "Fresh Curd (Dahi)", slug: "fresh-curd", description: "Creamy, thick dahi made from pure milk. Great for raita and lassi.", price: "40.00", mrp: "45.00", unit: "500 g", image: "https://images.pexels.com/photos/5967316/pexels-photo-5967316.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 3, isFeatured: false, rating: "4.4", reviewCount: 23, tags: ["probiotic", "daily"] },

  // Spices (cat 4)
  { name: "Turmeric Powder (Haldi)", slug: "turmeric-powder", description: "Pure, bright yellow turmeric powder. Anti-inflammatory and essential for cooking.", price: "45.00", mrp: "55.00", unit: "200 g", image: "https://images.pexels.com/photos/4198370/pexels-photo-4198370.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 4, isFeatured: true, rating: "4.7", reviewCount: 56, tags: ["essential", "organic"] },
  { name: "Red Chilli Powder (Lal Mirch)", slug: "red-chilli-powder", description: "Hot and vibrant red chilli powder. Adds color and heat to any dish.", price: "55.00", mrp: "65.00", unit: "200 g", image: "https://images.pexels.com/photos/35156984/pexels-photo-35156984.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 4, isFeatured: false, rating: "4.3", reviewCount: 31, tags: ["spicy", "essential"] },
  { name: "Garam Masala", slug: "garam-masala", description: "Aromatic blend of premium whole spices. The secret to flavorful Indian cooking.", price: "75.00", mrp: "90.00", unit: "100 g", image: "https://images.pexels.com/photos/7829483/pexels-photo-7829483.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 4, isFeatured: true, rating: "4.8", reviewCount: 48, tags: ["blend", "premium", "bestseller"] },
  { name: "Cumin Seeds (Jeera)", slug: "cumin-seeds", description: "Whole cumin seeds for tempering and flavoring. Essential in every kitchen.", price: "65.00", mrp: "80.00", unit: "200 g", image: "https://images.pexels.com/photos/6157052/pexels-photo-6157052.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 4, isFeatured: false, rating: "4.5", reviewCount: 22, tags: ["whole-spice"] },

  // Staples (cat 5)
  { name: "Basmati Rice", slug: "basmati-rice", description: "Premium long-grain basmati rice. Aromatic and fluffy, perfect for biryani and pulao.", price: "180.00", mrp: "220.00", unit: "5 kg", image: "https://images.pexels.com/photos/28674713/pexels-photo-28674713.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 5, isFeatured: true, rating: "4.7", reviewCount: 73, tags: ["premium", "staple", "bestseller"] },
  { name: "Whole Wheat Atta", slug: "whole-wheat-atta", description: "Stone-ground whole wheat flour for soft rotis. Made from select grains.", price: "250.00", mrp: "280.00", unit: "10 kg", image: "https://images.pexels.com/photos/4444068/pexels-photo-4444068.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 5, isFeatured: true, rating: "4.6", reviewCount: 61, tags: ["staple", "daily"] },
  { name: "Toor Dal (Arhar)", slug: "toor-dal", description: "Clean, polished toor dal. Cooks fast and makes silky smooth dal.", price: "140.00", mrp: "160.00", unit: "1 kg", image: "https://images.pexels.com/photos/16620746/pexels-photo-16620746.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 5, isFeatured: false, rating: "4.4", reviewCount: 38, tags: ["protein", "staple"] },
  { name: "Moong Dal", slug: "moong-dal", description: "Yellow moong dal, easy to digest and nutritious. Great for dal tadka.", price: "120.00", mrp: "140.00", unit: "1 kg", image: "https://images.pexels.com/photos/32986479/pexels-photo-32986479.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 5, isFeatured: false, rating: "4.3", reviewCount: 19, tags: ["healthy", "light"] },
  { name: "Sugar (Cheeni)", slug: "sugar", description: "Refined white sugar. Essential sweetener for tea, sweets and cooking.", price: "48.00", mrp: "52.00", unit: "1 kg", image: "https://images.pexels.com/photos/2523650/pexels-photo-2523650.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 5, isFeatured: false, rating: "4.2", reviewCount: 14, tags: ["daily", "essential"] },

  // Oil & Ghee (cat 6)
  { name: "Mustard Oil (Sarson)", slug: "mustard-oil", description: "Pure cold-pressed mustard oil. Traditional cooking oil with pungent aroma.", price: "180.00", mrp: "210.00", unit: "1 litre", image: "https://images.pexels.com/photos/11025882/pexels-photo-11025882.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 6, isFeatured: true, rating: "4.6", reviewCount: 44, tags: ["traditional", "pure"] },
  { name: "Pure Desi Ghee", slug: "pure-desi-ghee", description: "Aromatic desi ghee made from cow's milk. Adds rich flavor to every dish.", price: "550.00", mrp: "620.00", unit: "1 litre", image: "https://images.pexels.com/photos/18012040/pexels-photo-18012040.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 6, isFeatured: true, rating: "4.9", reviewCount: 82, tags: ["premium", "pure", "bestseller"] },
  { name: "Sunflower Oil", slug: "sunflower-oil", description: "Light and healthy sunflower cooking oil. Low in saturated fats.", price: "160.00", mrp: "185.00", unit: "1 litre", image: "https://images.pexels.com/photos/6485578/pexels-photo-6485578.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 6, isFeatured: false, rating: "4.3", reviewCount: 27, tags: ["healthy", "light"] },

  // Snacks (cat 7)
  { name: "Aloo Bhujia", slug: "aloo-bhujia", description: "Crispy, spicy aloo bhujia namkeen. Perfect tea-time snack.", price: "55.00", mrp: "65.00", unit: "400 g", image: "https://images.pexels.com/photos/34270742/pexels-photo-34270742.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 7, isFeatured: true, rating: "4.5", reviewCount: 39, tags: ["crispy", "popular"] },
  { name: "Mixture Namkeen", slug: "mixture-namkeen", description: "Classic mixture with sev, peanuts, and flattened rice. Irresistibly crunchy.", price: "45.00", mrp: "55.00", unit: "300 g", image: "https://images.pexels.com/photos/36219575/pexels-photo-36219575.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 7, isFeatured: false, rating: "4.4", reviewCount: 25, tags: ["traditional"] },
  { name: "Masala Peanuts", slug: "masala-peanuts", description: "Roasted peanuts coated with spicy masala. Protein-packed snack.", price: "60.00", mrp: "70.00", unit: "250 g", image: "https://images.pexels.com/photos/6485578/pexels-photo-6485578.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 7, isFeatured: false, rating: "4.3", reviewCount: 17, tags: ["protein", "snack"] },

  // Beverages (cat 8)
  { name: "Premium Tea (Chai Patti)", slug: "premium-tea", description: "Strong CTC tea leaves for the perfect morning chai. Rich aroma and bold flavor.", price: "120.00", mrp: "140.00", unit: "250 g", image: "https://images.pexels.com/photos/18258533/pexels-photo-18258533.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 8, isFeatured: true, rating: "4.7", reviewCount: 58, tags: ["daily", "bestseller"] },
  { name: "Instant Coffee", slug: "instant-coffee", description: "Premium instant coffee granules. Makes a smooth, aromatic cup every time.", price: "150.00", mrp: "175.00", unit: "100 g", image: "https://images.pexels.com/photos/37304947/pexels-photo-37304947.jpeg?auto=compress&cs=tinysrgb&w=600", categoryId: 8, isFeatured: false, rating: "4.4", reviewCount: 22, tags: ["morning", "energy"] },
];

const REVIEWS_DATA = [
  { productId: 1, customerName: "Ramu Kaka", rating: 5, comment: "Very fresh tomatoes! Just like from the farm. Will order again." },
  { productId: 1, customerName: "Sunita Devi", rating: 4, comment: "Good quality, delivered on time. Slightly soft but tasty." },
  { productId: 1, customerName: "Mohan Lal", rating: 5, comment: "Best tomatoes in the village! Red and juicy." },
  { productId: 3, customerName: "Geeta Bai", rating: 5, comment: "Perfect aloo for making paratha. No black spots." },
  { productId: 3, customerName: "Ram Prasad", rating: 4, comment: "Good size potatoes. Fresh from farm." },
  { productId: 7, customerName: "Lakshmi Devi", rating: 5, comment: "Sweet and fresh bananas. Kids loved them!" },
  { productId: 7, customerName: "Pappu Yadav", rating: 5, comment: "Best kela in the area. Perfectly ripe." },
  { productId: 9, customerName: "Meena Kumari", rating: 5, comment: "Aam ka raja! So sweet and flavorful. Best mangoes ever!" },
  { productId: 9, customerName: "Suresh Ji", rating: 5, comment: "Reminded me of childhood. Pure desi mango taste." },
  { productId: 9, customerName: "Kamla Devi", rating: 4, comment: "Very good mangoes but slightly expensive." },
  { productId: 13, customerName: "Shanti Devi", rating: 5, comment: "Fresh milk every morning. Pure and creamy like village milk." },
  { productId: 13, customerName: "Rajesh Kumar", rating: 5, comment: "Best milk delivery. Always on time and fresh." },
  { productId: 13, customerName: "Bimla Devi", rating: 4, comment: "Good quality milk. My family loves it." },
  { productId: 19, customerName: "Sita Ram", rating: 5, comment: "Pure haldi! Yellow color is amazing. Must buy." },
  { productId: 21, customerName: "Prem Chand", rating: 5, comment: "Best garam masala. Smells heavenly! My wife is very happy." },
  { productId: 23, customerName: "Durga Prasad", rating: 5, comment: "Excellent basmati rice. Long grains and aromatic." },
  { productId: 23, customerName: "Savitri Devi", rating: 4, comment: "Good rice for daily use. Cooks well." },
  { productId: 28, customerName: "Hari Om", rating: 5, comment: "Pure desi ghee taste! Just like homemade. Very aromatic." },
  { productId: 28, customerName: "Kamini Devi", rating: 5, comment: "This ghee makes dal taste amazing. Pure quality." },
  { productId: 33, customerName: "Tulsi Das", rating: 5, comment: "Strong chai! Perfect for morning. Great taste." },
  { productId: 14, customerName: "Neeta Singh", rating: 5, comment: "Soft paneer, freshly made. Palak paneer came out perfect!" },
  { productId: 6, customerName: "Anita Sharma", rating: 5, comment: "Fresh palak leaves. Made delicious palak paneer!" },
  { productId: 24, customerName: "Govind Ji", rating: 5, comment: "Soft rotis every time. This atta is the best." },
];

const DELIVERY_PERSONS_DATA = [
  { name: "Raju Bhaiya", phone: "9876543210", vehicle: "Motorcycle", totalDeliveries: 342 },
  { name: "Sunil Kumar", phone: "9876543211", vehicle: "Bicycle", totalDeliveries: 189 },
  { name: "Deepak Yadav", phone: "9876543212", vehicle: "Motorcycle", totalDeliveries: 267 },
  { name: "Anil Sharma", phone: "9876543213", vehicle: "Auto", totalDeliveries: 156 },
];

export async function POST() {
  try {
    // Clear existing data
    await db.execute(sql`TRUNCATE reviews, orders, products, categories, delivery_persons RESTART IDENTITY CASCADE`);

    // Insert categories
    await db.insert(categories).values(CATEGORIES_DATA);

    // Insert products
    const allProducts = PRODUCTS_DATA.map((p) => ({
      ...p,
      images: [p.image],
      stock: 100,
      isActive: true,
    }));
    await db.insert(products).values(allProducts);

    // Insert reviews
    await db.insert(reviews).values(REVIEWS_DATA);

    // Insert delivery persons
    await db.insert(deliveryPersons).values(DELIVERY_PERSONS_DATA);

    return NextResponse.json({ success: true, message: "Database seeded successfully!" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
