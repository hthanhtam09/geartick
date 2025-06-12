import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | GearTick",
  description:
    "Learn about GearTick - your trusted source for expert product reviews and recommendations.",
};

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-6">About GearTick</h1>
          <p className="text-xl text-muted-foreground">
            Your trusted source for expert product reviews and recommendations
          </p>
        </div>

        <div className="space-y-12">
          {/* Mission Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Mission</h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              At GearTick, we believe that everyone deserves access to honest,
              comprehensive, and expert product reviews. Our mission is to help
              you make informed purchasing decisions by providing detailed
              analysis, real-world testing, and unbiased recommendations for the
              best gear across all categories.
            </p>
          </section>

          {/* What We Do Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Expert Reviews</h3>
                <p className="text-muted-foreground">
                  Our team of experienced reviewers thoroughly tests each
                  product, providing detailed analysis of features, performance,
                  and value for money.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Product Comparisons
                </h3>
                <p className="text-muted-foreground">
                  We create comprehensive comparison tables and head-to-head
                  reviews to help you choose between similar products in any
                  category.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Category Guides</h3>
                <p className="text-muted-foreground">
                  Browse our extensive collection of product categories to find
                  the perfect gear for your specific needs and preferences.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">
                  Community Insights
                </h3>
                <p className="text-muted-foreground">
                  We aggregate and analyze user reviews and feedback to provide
                  a complete picture of product performance and reliability.
                </p>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Accuracy</h3>
                <p className="text-muted-foreground">
                  We prioritize factual, evidence-based reviews with real
                  testing data.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Impartiality</h3>
                <p className="text-muted-foreground">
                  Our reviews are completely independent and unbiased, free from
                  manufacturer influence.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-muted-foreground">
                  We&apos;re open about our testing methods and always disclose
                  any relationships.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section>
            <h2 className="text-3xl font-semibold mb-6">Our Team</h2>
            <p className="text-lg leading-relaxed text-muted-foreground mb-6">
              GearTick is powered by a team of passionate product enthusiasts,
              industry experts, and technology professionals. We combine years
              of experience with cutting-edge testing methodologies to deliver
              the most comprehensive and reliable product reviews available.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Our reviewers come from diverse backgrounds including engineering,
              design, journalism, and consumer advocacy, ensuring we provide
              well-rounded perspectives on every product we review.
            </p>
          </section>

          {/* Contact Section */}
          <section className="bg-accent/50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-6">
              Have questions, suggestions, or want to collaborate? We&apos;d
              love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@geartick.com"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Us
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-md hover:bg-accent transition-colors"
              >
                Learn More
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
