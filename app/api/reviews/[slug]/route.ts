import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Review, Product } from "@/lib/models";
import { ApiResponse, Review as ReviewType } from "@/types";

// Mock data for when database is not available
const mockReviews = [
  {
    _id: "1",
    productId: "iphone-15-pro-max",
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
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
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
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    productId: "samsung-galaxy-s24-ultra",
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
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=600&fit=crop",
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
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    _id: "3",
    productId: "google-pixel-8-pro",
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
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&h=600&fit=crop",
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
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
];

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Review slug is required",
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    let review: ReviewType | null = null;
    let isFromDatabase = false;

    try {
      // Try to connect to database
      await connectDB();

      // Find review by slug
      const dbReview = await Review.findOne({ slug, isPublished: true })
        .populate("productId", "title slug images brand category price")
        .lean();

      if (dbReview) {
        review = dbReview as unknown as ReviewType;
        isFromDatabase = true;
      } else {
        // If not found in database, check mock data
        review = mockReviews.find((r) => r.slug === slug) || null;
      }
    } catch (dbError) {
      console.error("Database connection failed, using mock data:", dbError);

      // Fallback to mock data
      review = mockReviews.find((r) => r.slug === slug) || null;
    }

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          message: "Review not found",
        } as ApiResponse<null>,
        { status: 404 }
      );
    }

    // Increment view count if review is from database
    if (isFromDatabase && review._id) {
      try {
        await Review.findByIdAndUpdate(review._id, {
          $inc: { views: 1 },
        });
      } catch (updateError) {
        console.error("Failed to update view count:", updateError);
        // Continue without updating view count
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: review,
        message: "Review fetched successfully",
      } as ApiResponse<ReviewType>,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching review by slug:", error);

    return NextResponse.json(
      {
        success: false,
        data: null,
        message: "Internal server error",
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
