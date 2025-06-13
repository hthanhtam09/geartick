import mongoose from "mongoose";
import "../envConfig.ts";

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log(uri);
    await mongoose.connect(uri, {
      useNewUrlParser: "true",
      useUnifiedTopology: "true",
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

// Review Schema
const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    pros: [String],
    cons: [String],
    verdict: {
      type: String,
      required: true,
    },
    authorId: {
      type: String,
      required: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorImage: String,
    images: [String],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    seoTitle: String,
    seoDescription: String,
    tags: [String],
    readTime: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Product Schema
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subcategory: String,
    brand: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    affiliateUrl: String,
    images: [String],
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    tags: [String],
    colors: [
      {
        name: String,
        hex: String,
        image: String,
      },
    ],
    materials: [String],
    developerSupport: String,
    specifications: [
      {
        name: String,
        value: String,
        category: String,
      },
    ],
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      weight: Number,
      unit: String,
    },
    pros: [String],
    cons: [String],
    score: Number,
    bestFor: [String],
    worstFor: [String],
    releaseDate: Date,
    seoTitle: String,
    seoDescription: String,
  },
  {
    timestamps: true,
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

// Sample products data
const sampleProducts = [
  {
    title: "iPhone 15 Pro Max",
    description:
      "The most advanced iPhone ever with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.",
    category: "Smartphones",
    subcategory: "Flagship",
    brand: "Apple",
    price: 1199,
    currency: "USD",
    affiliateUrl: "https://amazon.com/iphone-15-pro-max",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "iphone-15-pro-max",
    averageRating: 4.8,
    totalReviews: 1247,
    tags: ["smartphone", "premium", "camera", "5g"],
    colors: [
      {
        name: "Natural Titanium",
        hex: "#8A8A8A",
        image:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      },
      {
        name: "Blue Titanium",
        hex: "#4A90E2",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      },
    ],
    materials: ["Titanium", "Ceramic Shield", "Aluminum"],
    developerSupport: "Excellent",
    specifications: [
      {
        name: "Display",
        value: "6.7-inch Super Retina XDR OLED",
        category: "Display",
      },
      { name: "Processor", value: "A17 Pro chip", category: "Performance" },
      { name: "Storage", value: "256GB/512GB/1TB", category: "Storage" },
      { name: "Camera", value: "48MP + 12MP + 12MP", category: "Camera" },
      { name: "Battery", value: "4441mAh", category: "Battery" },
      { name: "OS", value: "iOS 17", category: "Software" },
    ],
    dimensions: {
      length: 159.9,
      width: 76.7,
      height: 8.25,
      weight: 221,
      unit: "mm",
    },
    pros: [
      "Exceptional camera system",
      "Premium titanium build",
      "A17 Pro performance",
      "5x optical zoom",
    ],
    cons: ["Expensive", "Limited USB-C features", "Heavy"],
    score: 9.2,
    bestFor: ["Photography", "Gaming", "Business users", "Content creation"],
    worstFor: ["Budget users", "Android enthusiasts"],
    releaseDate: new Date("2023-09-22"),
    seoTitle: "iPhone 15 Pro Max Review - Best Premium Smartphone 2024",
    seoDescription:
      "Comprehensive review of iPhone 15 Pro Max with titanium design, A17 Pro chip, and advanced camera system.",
  },
  {
    title: "Samsung Galaxy S24 Ultra",
    description:
      "AI-powered flagship smartphone with S Pen, 200MP camera, titanium frame, and enhanced Galaxy AI features.",
    category: "Smartphones",
    subcategory: "Flagship",
    brand: "Samsung",
    price: 1299,
    currency: "USD",
    affiliateUrl: "https://amazon.com/samsung-galaxy-s24-ultra",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "samsung-galaxy-s24-ultra",
    averageRating: 4.7,
    totalReviews: 892,
    tags: ["smartphone", "android", "s-pen", "camera"],
    colors: [
      {
        name: "Titanium Gray",
        hex: "#6B7280",
        image:
          "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop",
      },
      {
        name: "Titanium Black",
        hex: "#1F2937",
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop",
      },
    ],
    materials: ["Titanium", "Gorilla Glass Armor", "Aluminum"],
    developerSupport: "Excellent",
    specifications: [
      {
        name: "Display",
        value: "6.8-inch Dynamic AMOLED 2X",
        category: "Display",
      },
      {
        name: "Processor",
        value: "Snapdragon 8 Gen 3",
        category: "Performance",
      },
      { name: "Storage", value: "256GB/512GB/1TB", category: "Storage" },
      {
        name: "Camera",
        value: "200MP + 12MP + 50MP + 10MP",
        category: "Camera",
      },
      { name: "Battery", value: "5000mAh", category: "Battery" },
      { name: "OS", value: "Android 14 + One UI 6.1", category: "Software" },
    ],
    dimensions: {
      length: 163.4,
      width: 79.0,
      height: 8.6,
      weight: 232,
      unit: "mm",
    },
    pros: [
      "S Pen functionality",
      "200MP camera",
      "Excellent display",
      "AI features",
    ],
    cons: ["Expensive", "Large and heavy", "Complex UI"],
    score: 9.0,
    bestFor: ["Productivity", "Note-taking", "Photography", "Business"],
    worstFor: ["Budget users", "One-handed use"],
    releaseDate: new Date("2024-01-31"),
    seoTitle: "Samsung Galaxy S24 Ultra Review - Best Android Phone 2024",
    seoDescription:
      "In-depth review of Samsung Galaxy S24 Ultra with AI features, S Pen, and 200MP camera system.",
  },
  {
    title: "Google Pixel 8 Pro",
    description:
      "Google's AI-powered flagship with advanced computational photography and pure Android experience.",
    category: "Smartphones",
    subcategory: "Flagship",
    brand: "Google",
    price: 999,
    currency: "USD",
    affiliateUrl: "https://amazon.com/google-pixel-8-pro",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "google-pixel-8-pro",
    averageRating: 4.6,
    totalReviews: 1456,
    tags: ["smartphone", "ai", "camera", "android"],
    colors: [
      {
        name: "Obsidian",
        hex: "#1F2937",
        image:
          "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
      },
      {
        name: "Porcelain",
        hex: "#F9FAFB",
        image:
          "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
      },
    ],
    materials: ["Aluminum", "Gorilla Glass Victus 2"],
    developerSupport: "Excellent",
    specifications: [
      { name: "Display", value: "6.7-inch LTPO OLED", category: "Display" },
      { name: "Processor", value: "Google Tensor G3", category: "Performance" },
      { name: "Storage", value: "128GB/256GB/512GB", category: "Storage" },
      { name: "Camera", value: "50MP + 48MP + 48MP", category: "Camera" },
      { name: "Battery", value: "4950mAh", category: "Battery" },
      { name: "OS", value: "Android 14", category: "Software" },
    ],
    dimensions: {
      length: 162.6,
      width: 76.5,
      height: 8.8,
      weight: 213,
      unit: "mm",
    },
    pros: ["AI features", "Great value", "Pure Android", "Excellent camera"],
    cons: [
      "Build quality concerns",
      "Limited availability",
      "Average performance",
    ],
    score: 8.7,
    bestFor: [
      "AI enthusiasts",
      "Photography",
      "Stock Android",
      "Value seekers",
    ],
    worstFor: ["Gaming performance", "Heavy multitasking"],
    releaseDate: new Date("2023-10-12"),
    seoTitle: "Google Pixel 8 Pro Review - Best AI Smartphone 2024",
    seoDescription:
      "Complete review of Google Pixel 8 Pro with advanced AI features and computational photography.",
  },
  {
    title: "Apple Watch Series 9",
    description:
      "Latest Apple Watch with S9 chip, Double Tap gesture, and enhanced health monitoring features.",
    category: "Smartwatches",
    subcategory: "Premium",
    brand: "Apple",
    price: 399,
    currency: "USD",
    affiliateUrl: "https://amazon.com/apple-watch-series-9",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "apple-watch-series-9",
    averageRating: 4.8,
    totalReviews: 2156,
    tags: ["smartwatch", "health", "fitness", "premium"],
    colors: [
      {
        name: "Midnight",
        hex: "#1F2937",
        image:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
      },
      {
        name: "Starlight",
        hex: "#F5F5F5",
        image:
          "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400&h=400&fit=crop",
      },
    ],
    materials: ["Aluminum", "Ion-X glass", "Silicone"],
    developerSupport: "Excellent",
    specifications: [
      {
        name: "Display",
        value: "41mm/45mm Always-On Retina",
        category: "Display",
      },
      { name: "Processor", value: "S9 chip", category: "Performance" },
      { name: "Storage", value: "32GB", category: "Storage" },
      { name: "Battery", value: "18 hours", category: "Battery" },
      { name: "OS", value: "watchOS 10", category: "Software" },
      { name: "Water Resistance", value: "50m", category: "Durability" },
    ],
    dimensions: { length: 45, width: 38, height: 10.7, weight: 32, unit: "mm" },
    pros: [
      "Excellent health tracking",
      "Smooth performance",
      "Great ecosystem",
      "Double Tap gesture",
    ],
    cons: ["Expensive", "Short battery life", "iPhone only"],
    score: 9.0,
    bestFor: [
      "Health monitoring",
      "iPhone users",
      "Fitness tracking",
      "Premium experience",
    ],
    worstFor: ["Android users", "Budget users", "Long battery life"],
    releaseDate: new Date("2023-09-22"),
    seoTitle: "Apple Watch Series 9 Review - Best Smartwatch 2024",
    seoDescription:
      "Comprehensive review of Apple Watch Series 9 with S9 chip and advanced health features.",
  },
  {
    title: "MacBook Pro 14-inch M3",
    description:
      "Professional laptop with Apple M3 chip, Liquid Retina XDR display, and up to 22-hour battery life for creative workflows.",
    category: "Laptops",
    subcategory: "Professional",
    brand: "Apple",
    price: 1999,
    currency: "USD",
    affiliateUrl: "https://amazon.com/macbook-pro-14-m3",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "macbook-pro-14-m3",
    averageRating: 4.9,
    totalReviews: 634,
    tags: ["laptop", "professional", "m3-chip", "creative"],
    colors: [
      {
        name: "Space Black",
        hex: "#1F2937",
        image:
          "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      },
      {
        name: "Silver",
        hex: "#9CA3AF",
        image:
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop",
      },
    ],
    materials: ["Aluminum", "Glass"],
    developerSupport: "Excellent",
    specifications: [
      {
        name: "Display",
        value: "14.2-inch Liquid Retina XDR",
        category: "Display",
      },
      { name: "Processor", value: "Apple M3 chip", category: "Performance" },
      { name: "RAM", value: "8GB/16GB/24GB", category: "Memory" },
      { name: "Storage", value: "512GB/1TB/2TB", category: "Storage" },
      { name: "Battery", value: "22 hours", category: "Battery" },
      { name: "OS", value: "macOS Sonoma", category: "Software" },
    ],
    dimensions: {
      length: 312.6,
      width: 221.2,
      height: 15.5,
      weight: 1600,
      unit: "mm",
    },
    pros: [
      "Exceptional performance",
      "Long battery life",
      "Excellent display",
      "Silent operation",
    ],
    cons: ["Expensive", "Limited ports", "No upgradeability"],
    score: 9.3,
    bestFor: [
      "Creative professionals",
      "Developers",
      "Content creation",
      "Performance",
    ],
    worstFor: ["Gaming", "Budget users", "Windows users"],
    releaseDate: new Date("2023-10-30"),
    seoTitle: "MacBook Pro 14-inch M3 Review - Best Creative Laptop 2024",
    seoDescription:
      "Complete review of MacBook Pro 14-inch with M3 chip, perfect for creative professionals and developers.",
  },
];

// Sample reviews data
const sampleReviews = [
  {
    title: "iPhone 15 Pro Max: The Ultimate Camera Phone?",
    content: `
      <p>After spending three weeks with the iPhone 15 Pro Max, I can confidently say this is Apple's most impressive smartphone yet. The titanium design feels premium in hand, and the A17 Pro chip delivers exceptional performance for both everyday tasks and demanding applications.</p>
      
      <h3>Camera Performance</h3>
      <p>The 48MP main camera with 2x telephoto is a game-changer. The 5x optical zoom on the telephoto lens opens up new creative possibilities, and the computational photography features continue to impress. Night mode performance has been significantly improved, capturing stunning low-light shots that rival dedicated cameras.</p>
      
      <p>The new Action mode for video recording is incredibly smooth, and the Cinematic mode with 4K HDR recording produces professional-quality footage. The front-facing camera with autofocus makes video calls and selfies much more reliable.</p>
      
      <h3>Design and Build</h3>
      <p>The titanium frame not only looks stunning but also provides excellent durability. The weight distribution feels perfect, and the new Action Button adds a layer of customization that power users will appreciate. The USB-C port finally brings the iPhone into the modern era, though it's limited to USB 2.0 speeds.</p>
      
      <p>The Ceramic Shield front glass provides excellent protection, and the IP68 rating ensures the phone can handle water and dust exposure. The new Natural Titanium finish is particularly beautiful and shows off the premium materials.</p>
      
      <h3>Performance</h3>
      <p>The A17 Pro chip is a beast. Gaming performance is exceptional, with titles like Genshin Impact running at maximum settings without breaking a sweat. The 8GB of RAM ensures smooth multitasking, and the new GPU architecture handles ray tracing beautifully.</p>
      
      <p>Benchmark scores are impressive, with the A17 Pro outperforming most desktop processors in single-core tasks. The new Neural Engine enables advanced AI features like improved Siri performance and enhanced photo processing.</p>
      
      <h3>Battery Life</h3>
      <p>Despite the powerful internals, battery life is impressive. I consistently get through a full day of heavy use, including gaming, photography, and video editing. The 20W charging is fast enough for most situations, though it's not as quick as some Android competitors.</p>
      
      <p>The new USB-C port supports faster charging speeds when using compatible chargers, and the MagSafe wireless charging remains convenient for overnight charging.</p>
      
      <h3>Software Experience</h3>
      <p>iOS 17 brings several useful improvements, including the new StandBy mode, improved Messages app, and enhanced privacy features. The integration with other Apple devices remains seamless, and the ecosystem benefits are significant for users invested in Apple's platform.</p>
      
      <p>The new Action Button is highly customizable and can be set to perform various functions like launching the camera, activating Focus modes, or running Shortcuts. This adds a new dimension to iPhone interaction that power users will love.</p>
    `,
    rating: 4.8,
    pros: [
      "Exceptional camera system with 5x zoom",
      "Premium titanium build quality",
      "A17 Pro chip delivers outstanding performance",
      "USB-C finally arrives",
      "Action Button adds useful customization",
      "Excellent video recording capabilities",
      "Seamless ecosystem integration",
      "Advanced AI features",
    ],
    cons: [
      "Very expensive starting price",
      "Limited USB-C features compared to Android",
      "Heavy compared to previous models",
      "No significant battery life improvement",
      "USB-C limited to USB 2.0 speeds",
      "Action Button placement could be better",
    ],
    verdict:
      "The iPhone 15 Pro Max is the best iPhone ever made, offering exceptional camera capabilities, premium build quality, and outstanding performance. While it's expensive, it represents the pinnacle of smartphone technology and is worth the investment for photography enthusiasts and power users. The titanium design, A17 Pro chip, and advanced camera system make this the most capable iPhone to date.",
    authorId: "tech_reviewer_1",
    authorName: "Sarah Chen",
    authorImage:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "iphone-15-pro-max-ultimate-camera-phone-review",
    likes: 234,
    views: 12500,
    isPublished: true,
    isFeatured: true,
    seoTitle: "iPhone 15 Pro Max Review - Best Camera Phone 2024",
    seoDescription:
      "Comprehensive review of iPhone 15 Pro Max with titanium design, A17 Pro chip, and advanced camera system with 5x telephoto zoom.",
    tags: [
      "smartphone",
      "apple",
      "camera",
      "premium",
      "photography",
      "titanium",
      "a17-pro",
    ],
    readTime: 8,
  },
  {
    title: "Samsung Galaxy S24 Ultra: AI-Powered Excellence",
    content: `
      <p>The Samsung Galaxy S24 Ultra represents the pinnacle of Android smartphone technology, combining cutting-edge AI features with premium hardware. After extensive testing, I'm impressed by how Samsung has integrated AI into every aspect of the user experience.</p>
      
      <h3>AI Features</h3>
      <p>Galaxy AI is the star of the show. The real-time translation during calls works seamlessly, and the AI-powered photo editing tools are incredibly powerful. Circle to Search is genuinely useful for quick information lookup, and the AI writing assistance helps with emails and messages.</p>
      
      <p>The new Generative Edit feature allows you to remove, move, or resize objects in photos with impressive accuracy. The AI-powered note-taking features automatically organize and summarize handwritten notes, making the S Pen even more valuable.</p>
      
      <h3>S Pen Experience</h3>
      <p>The integrated S Pen continues to be a unique selling point. The latency has been reduced even further, making it feel more natural than ever. The new AI-powered note-taking features are particularly impressive, automatically organizing and summarizing handwritten notes.</p>
      
      <p>The S Pen's precision makes it excellent for drawing, note-taking, and productivity tasks. The new gesture controls and quick actions make it more versatile than ever. Samsung has truly made the S Pen an integral part of the user experience.</p>
      
      <h3>Camera System</h3>
      <p>The 200MP main camera captures incredible detail, and the AI-powered image processing produces stunning results. The 5x optical zoom is sharp and reliable, while the 10x digital zoom maintains good quality thanks to AI enhancement.</p>
      
      <p>The Nightography features have been improved significantly, with better low-light performance and reduced noise. The AI-powered portrait mode produces natural-looking results, and the new ProVisual Engine enhances overall image quality.</p>
      
      <h3>Performance and Battery</h3>
      <p>The Snapdragon 8 Gen 3 chip delivers flagship performance, and the 5000mAh battery easily lasts through a full day of heavy use. The 45W charging is fast, though not as quick as some competitors.</p>
      
      <p>Gaming performance is excellent, with the Adreno 750 GPU handling demanding titles with ease. The vapor chamber cooling system keeps the device cool during extended gaming sessions.</p>
      
      <h3>Display and Design</h3>
      <p>The 6.8-inch Dynamic AMOLED 2X display is stunning, with excellent brightness and color accuracy. The 120Hz refresh rate ensures smooth scrolling and animations, and the peak brightness of 2600 nits makes it usable in bright sunlight.</p>
      
      <p>The titanium frame provides excellent durability while maintaining a premium feel. The flat display design makes it easier to use with the S Pen, and the reduced bezels maximize screen real estate.</p>
    `,
    rating: 4.7,
    pros: [
      "Revolutionary AI features",
      "Excellent S Pen integration",
      "200MP camera with great detail",
      "Premium titanium build",
      "Long battery life",
      "Stunning display quality",
      "Powerful performance",
      "Advanced photo editing tools",
    ],
    cons: [
      "Very expensive",
      "Large and heavy design",
      "Complex One UI interface",
      "Limited availability of some AI features",
      "S Pen can be lost easily",
      "Bulkier than competitors",
    ],
    verdict:
      "The Samsung Galaxy S24 Ultra is the most advanced Android smartphone available, with AI features that genuinely enhance the user experience. While expensive and large, it offers unique capabilities that justify the premium price for power users and productivity enthusiasts. The combination of AI features, S Pen functionality, and premium hardware makes this the ultimate Android device.",
    authorId: "tech_reviewer_2",
    authorName: "Michael Rodriguez",
    authorImage:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "samsung-galaxy-s24-ultra-ai-powered-excellence-review",
    likes: 189,
    views: 9870,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Samsung Galaxy S24 Ultra Review - Best AI Smartphone 2024",
    seoDescription:
      "In-depth review of Samsung Galaxy S24 Ultra with revolutionary AI features, S Pen, and 200MP camera system.",
    tags: [
      "smartphone",
      "samsung",
      "ai",
      "s-pen",
      "productivity",
      "titanium",
      "200mp",
    ],
    readTime: 7,
  },
  {
    title: "Google Pixel 8 Pro: AI Photography Master",
    content: `
      <p>Google's Pixel 8 Pro continues the company's tradition of computational photography excellence while adding powerful AI features that enhance the overall user experience. This is the phone for those who prioritize photography and AI integration.</p>
      
      <h3>Photography Excellence</h3>
      <p>The computational photography features are unmatched. Magic Eraser works flawlessly, removing unwanted objects with impressive accuracy. The new Best Take feature intelligently combines multiple shots to create the perfect group photo, and the AI-powered portrait mode produces stunning results.</p>
      
      <p>The 50MP main camera captures incredible detail, and the new AI-powered image processing produces natural-looking results. The Night Sight feature continues to impress, capturing bright, detailed photos in extremely low-light conditions.</p>
      
      <h3>AI Integration</h3>
      <p>Google's AI features feel more refined than Samsung's. The call screening is incredibly useful, and the AI-powered voice typing is remarkably accurate. The new AI wallpapers are fun to use and showcase the creative potential of AI.</p>
      
      <p>The Magic Compose feature helps write better messages, and the AI-powered photo editing tools are intuitive and powerful. Google's approach to AI feels more integrated and less gimmicky than competitors.</p>
      
      <h3>Software Experience</h3>
      <p>Pure Android with Pixel-exclusive features provides the smoothest Android experience available. The seven years of software updates ensure long-term value, and the regular feature drops keep the phone feeling fresh.</p>
      
      <p>The Material You design language looks great, and the adaptive theming creates a cohesive visual experience. The integration with Google services is seamless, making it perfect for users invested in Google's ecosystem.</p>
      
      <h3>Build Quality</h3>
      <p>While the design is familiar, the build quality has improved significantly. The aluminum frame feels solid, and the Gorilla Glass Victus 2 provides excellent protection. The IP68 rating ensures peace of mind.</p>
      
      <p>The new temperature sensor adds an interesting health monitoring feature, though its practical applications are still limited. The overall design is clean and professional, though not as distinctive as some competitors.</p>
      
      <h3>Performance and Battery</h3>
      <p>The Google Tensor G3 chip provides smooth performance for most tasks, though it's not as powerful as the latest Snapdragon chips. The 4950mAh battery provides good battery life, though not exceptional.</p>
      
      <p>Charging speeds are adequate with the 30W wired charging and 23W wireless charging. The battery optimization features help extend battery life, and the adaptive battery learns your usage patterns.</p>
    `,
    rating: 4.6,
    pros: [
      "Best computational photography",
      "Pure Android experience",
      "Seven years of updates",
      "Excellent AI features",
      "Great value proposition",
      "Seamless Google integration",
      "Advanced photo editing",
      "Clean, professional design",
    ],
    cons: [
      "Familiar design",
      "Average battery life",
      "Limited availability",
      "No expandable storage",
      "Less powerful chip",
      "Limited temperature sensor use",
    ],
    verdict:
      "The Google Pixel 8 Pro offers the best computational photography experience available, combined with pure Android and excellent AI features. While the design is familiar, the software experience and photography capabilities make it an excellent choice for photography enthusiasts and Android purists. The seven years of updates and Google's AI integration provide long-term value.",
    authorId: "tech_reviewer_3",
    authorName: "Emily Watson",
    authorImage:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "google-pixel-8-pro-ai-photography-master-review",
    likes: 156,
    views: 8230,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Google Pixel 8 Pro Review - Best AI Photography Phone 2024",
    seoDescription:
      "Complete review of Google Pixel 8 Pro with unmatched computational photography and AI features.",
    tags: [
      "smartphone",
      "google",
      "photography",
      "ai",
      "android",
      "computational-photography",
    ],
    readTime: 6,
  },
  {
    title: "Apple Watch Series 9: Health Monitoring Excellence",
    content: `
      <p>The Apple Watch Series 9 continues Apple's dominance in the smartwatch market with incremental improvements that enhance the overall user experience. While the changes are subtle, they add up to create the most refined Apple Watch yet.</p>
      
      <h3>Double Tap Gesture</h3>
      <p>The new Double Tap gesture is genuinely useful, allowing you to control the watch without touching the screen. It works reliably and adds a new dimension to watch interaction. The gesture recognition is impressively accurate and responsive.</p>
      
      <p>This feature is particularly useful when your hands are occupied, such as when carrying groceries or holding a coffee cup. The customization options allow you to set different actions for different apps, making it a versatile tool.</p>
      
      <h3>Health Monitoring</h3>
      <p>Health monitoring capabilities continue to impress. The heart rate monitoring is accurate, and the new temperature sensing provides valuable health insights. The sleep tracking is comprehensive, and the integration with the Health app is seamless.</p>
      
      <p>The new heart rate zones feature helps optimize workouts, and the improved ECG functionality provides more detailed heart health information. The fall detection and emergency SOS features provide peace of mind for users and their families.</p>
      
      <h3>Performance</h3>
      <p>The S9 chip provides smooth performance, and the new neural engine enables on-device Siri processing for faster responses. The 64-bit dual-core processor handles complex tasks efficiently, and the 32GB of storage provides ample space for apps and music.</p>
      
      <p>The improved GPU performance enables smoother animations and better gaming experiences. The new neural engine also enables more advanced health monitoring features and improved machine learning capabilities.</p>
      
      <h3>Battery Life</h3>
      <p>Battery life remains at 18 hours, which is adequate for most users. The fast charging is convenient, taking the watch from 0 to 80% in just 45 minutes. For users who need longer battery life, the Ultra model remains the better choice.</p>
      
      <p>The low-power mode extends battery life significantly, though it disables some features. The always-on display continues to be useful, though it does impact battery life somewhat.</p>
      
      <h3>Design and Display</h3>
      <p>The design remains familiar but refined, with improved materials and finishes. The Always-On Retina display is bright and readable in all lighting conditions, and the new peak brightness of 2000 nits makes it usable in bright sunlight.</p>
      
      <p>The new aluminum and stainless steel finishes look great, and the improved durability ensures the watch can handle daily wear and tear. The Digital Crown remains responsive and provides excellent haptic feedback.</p>
    `,
    rating: 4.8,
    pros: [
      "Excellent health monitoring",
      "Useful Double Tap gesture",
      "Smooth performance",
      "Great ecosystem integration",
      "Accurate sensors",
      "Bright, readable display",
      "Fast charging",
      "Comprehensive health features",
    ],
    cons: [
      "Expensive",
      "Short battery life",
      "iPhone only",
      "Incremental improvements",
      "Limited third-party app support",
      "No always-on display in low-power mode",
    ],
    verdict:
      "The Apple Watch Series 9 is the most refined Apple Watch yet, with useful new features like Double Tap and improved health monitoring. While the changes are incremental, they enhance the overall user experience and maintain Apple's position as the leader in smartwatch technology. The combination of health features, performance, and ecosystem integration makes this the best smartwatch available.",
    authorId: "tech_reviewer_5",
    authorName: "Lisa Thompson",
    authorImage:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "apple-watch-series-9-health-monitoring-excellence-review",
    likes: 198,
    views: 10560,
    isPublished: true,
    isFeatured: true,
    seoTitle: "Apple Watch Series 9 Review - Best Smartwatch 2024",
    seoDescription:
      "Comprehensive review of Apple Watch Series 9 with Double Tap gesture and advanced health features.",
    tags: ["smartwatch", "apple", "health", "fitness", "premium", "s9-chip"],
    readTime: 6,
  },
  {
    title: "MacBook Pro 14-inch M3: Creative Powerhouse",
    content: `
      <p>The MacBook Pro 14-inch with M3 chip represents the pinnacle of Apple's laptop engineering, offering exceptional performance for creative professionals and developers. This is the laptop that redefines what's possible in a portable form factor.</p>
      
      <h3>Performance</h3>
      <p>The M3 chip is a marvel of engineering, delivering desktop-class performance in a laptop form factor. Video editing in Final Cut Pro is incredibly smooth, and the new GPU architecture handles complex 3D rendering tasks with ease. The unified memory architecture ensures seamless performance across all applications.</p>
      
      <p>Benchmark scores are impressive, with the M3 outperforming many desktop processors while using significantly less power. The new GPU with hardware-accelerated ray tracing enables professional-grade 3D rendering and gaming performance.</p>
      
      <h3>Display Quality</h3>
      <p>The Liquid Retina XDR display is stunning, with exceptional color accuracy and brightness. The mini-LED technology provides perfect blacks and incredible contrast ratios. For creative professionals, this display is a game-changer, offering the accuracy needed for professional color grading and photo editing.</p>
      
      <p>The 1600 nits peak brightness and 1000 nits sustained brightness make it usable in bright environments, and the P3 wide color gamut ensures accurate color reproduction. The 120Hz ProMotion refresh rate provides smooth scrolling and animations.</p>
      
      <h3>Battery Life</h3>
      <p>The 22-hour battery life is remarkable, allowing for extended work sessions without needing to plug in. Even under heavy load, the battery life exceeds expectations, and the efficient thermal design means the laptop stays cool and quiet.</p>
      
      <p>The fast charging capabilities allow you to quickly top up the battery when needed, and the MagSafe 3 connector provides a secure connection while charging. The battery health management features help maintain long-term battery performance.</p>
      
      <h3>Build Quality</h3>
      <p>The aluminum unibody design feels premium and durable. The keyboard is excellent for long typing sessions, and the large trackpad provides precise control. The port selection is comprehensive, with Thunderbolt 4, HDMI, and SD card reader.</p>
      
      <p>The new Space Black finish looks stunning and provides excellent durability. The improved thermal design ensures the laptop stays cool even under heavy load, and the fan noise is minimal in most situations.</p>
      
      <h3>Software and Ecosystem</h3>
      <p>macOS Sonoma provides a smooth and intuitive user experience, with excellent integration with other Apple devices. The new features like Stage Manager and improved Spotlight search enhance productivity.</p>
      
      <p>The integration with iPhone and iPad is seamless, allowing you to use your phone as a webcam, share files easily, and continue work across devices. The Universal Control feature enables smooth interaction between Mac and iPad.</p>
    `,
    rating: 4.9,
    pros: [
      "Exceptional M3 performance",
      "Stunning Liquid Retina XDR display",
      "22-hour battery life",
      "Premium build quality",
      "Comprehensive port selection",
      "Excellent thermal design",
      "Seamless ecosystem integration",
      "Professional-grade capabilities",
    ],
    cons: [
      "Very expensive",
      "Limited upgradeability",
      "No touch screen",
      "Heavy for 14-inch laptop",
      "Limited gaming library",
      "High starting price",
    ],
    verdict:
      "The MacBook Pro 14-inch with M3 chip is the ultimate creative laptop, offering desktop-class performance in a portable form factor. While expensive, it represents the pinnacle of laptop technology and is worth the investment for creative professionals and developers who demand the best performance available. The combination of performance, display quality, and battery life makes this the best laptop for professional use.",
    authorId: "tech_reviewer_6",
    authorName: "Alex Johnson",
    authorImage:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    images: [
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center&q=80",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center&q=60",
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop&crop=center&q=40",
    ],
    slug: "macbook-pro-14-inch-m3-creative-powerhouse-review",
    likes: 267,
    views: 14230,
    isPublished: true,
    isFeatured: true,
    seoTitle: "MacBook Pro 14-inch M3 Review - Best Creative Laptop 2024",
    seoDescription:
      "Complete review of MacBook Pro 14-inch with M3 chip, perfect for creative professionals and developers.",
    tags: [
      "laptop",
      "apple",
      "creative",
      "performance",
      "professional",
      "m3-chip",
      "xdr-display",
    ],
    readTime: 9,
  },
];

// Seed functions
const seedProducts = async () => {
  try {
    console.log("🌱 Seeding products...");

    // Clear existing products
    await Product.deleteMany({});

    // Insert sample products
    const products = await Product.insertMany(
      sampleProducts.map((product) => ({
        ...product,
        createdAt: new Date(),
        updatedAt: new Date(),
      }))
    );

    console.log(`✅ Successfully seeded ${products.length} products`);
    return products;
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    throw error;
  }
};

const seedReviews = async () => {
  try {
    console.log("🌱 Seeding reviews...");

    // Get existing products to reference
    const products = await Product.find({}).limit(10);

    if (products.length === 0) {
      console.log("❌ No products found. Please seed products first.");
      return [];
    }

    // Clear existing reviews
    await Review.deleteMany({});

    // Create reviews with product references
    const reviewsWithProducts = sampleReviews.map((review, index) => {
      const product = products[index % products.length];
      return {
        ...review,
        productId: product._id,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    // Insert sample reviews
    const reviews = await Review.insertMany(reviewsWithProducts);

    console.log(`✅ Successfully seeded ${reviews.length} reviews`);
    return reviews;
  } catch (error) {
    console.error("❌ Error seeding reviews:", error);
    throw error;
  }
};

// Main seeding function
const seedAll = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await connectDB();

    // Seed products first
    await seedProducts();

    // Then seed reviews
    await seedReviews();

    console.log("✅ Database seeding completed successfully!");

    // Close the connection
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  } catch (error) {
    console.error("❌ Error during database seeding:", error);
    process.exit(1);
  }
};

// Run the seeding if this file is executed directly
seedAll();
