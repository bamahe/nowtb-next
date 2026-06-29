// =============================================================================
// Real client testimonials from Google Business Profile reviews
// Source: Barrett Henry REALTOR + The NOW Team Google reviews
// =============================================================================

export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  stars: 5;
  source: "google" | "website";
}

export const testimonials: Testimonial[] = [
  // --- Google Reviews (Barrett Henry REALTOR) ---
  {
    quote: "Working with Barrett Henry has truly been THE BEST experience I've ever had with a realtor. From start to finish, he made the process smooth and stress-free.",
    name: "Regina Castillo",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "We have used Barrett many times for both buying and selling properties, and he has always exceeded our expectations.",
    name: "Sandra Misuraca",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "I've had Barrett as my realtor for 10 years now. After using his services to sell my first house, I never needed to find another agent.",
    name: "Ryan Mauk",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "Barrett was straight with us from day one — no fluff, just honest advice about what we could get for our money in this market.",
    name: "Savannah Waldron",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "Barrett Henry made our move incredibly simple and stress-free. He was there every step of the way with unmatched professionalism.",
    name: "Holland McKnight",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "Barrett is without question the most professional real estate agent I have ever done business with. He is a true servant leader that works EXTREMELY hard for his clients.",
    name: "Adam Marburger",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "Barrett Sold my house and did an excellent job. The process was quick and easy. Definitely will use Barrett again in the future!",
    name: "Rachel Mauk",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  {
    quote: "Barrett made buying a house easy. He was patient, understanding, and devoted to making our dreams come true. It was a delight.",
    name: "Patricia Larry",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
  // --- NOW Team Website Testimonials ---
  {
    quote: "I sold my townhome in Riverview with The NOW Team and the whole process was incredibly smooth. Barrett and his team had a plan from day one. Professional photos, strategic pricing, and a marketing push that had my phone blowing up with showing requests within the first 48 hours.",
    name: "Kevin T.",
    location: "Riverview",
    stars: 5,
    source: "website",
  },
  {
    quote: "The NOW Team helped me buy my second investment property in Brandon and I would not trust anyone else with my real estate investments. Barrett understands the numbers and his team does the legwork to find properties that actually make financial sense.",
    name: "Derek W.",
    location: "Brandon",
    stars: 5,
    source: "website",
  },
  {
    quote: "I was nervous about buying on my own as a single woman and The NOW Team put me completely at ease. Barrett was straightforward and honest about what I could afford and what neighborhoods made the most sense for my situation.",
    name: "Natalie R.",
    location: "Tampa",
    stars: 5,
    source: "website",
  },
  {
    quote: "We had a terrible experience with our previous agent and almost gave up on selling. A friend told us to call The NOW Team and it was the best decision we made. Our Valrico home sold for more than our original agent had even suggested listing it for.",
    name: "Danielle F.",
    location: "Valrico",
    stars: 5,
    source: "website",
  },
  {
    quote: "We have bought and sold several homes over the years and The NOW Team is by far the best experience we have had. Barrett's market knowledge in South Tampa is outstanding and his team backs it up with flawless execution.",
    name: "Greg & Pamela T.",
    location: "Tampa",
    stars: 5,
    source: "website",
  },
  {
    quote: "This was our third transaction with The NOW Team and we keep coming back because they keep delivering. We have referred at least six families to The NOW Team over the years and every single one has had a great experience.",
    name: "Michelle & Scott L.",
    location: "Valrico",
    stars: 5,
    source: "website",
  },
  {
    quote: "I was a first-time buyer looking in St. Pete on a pretty tight budget. The NOW Team never made me feel like I was too small of a client. Barrett took the time to educate me on the process and set realistic expectations.",
    name: "Jasmine P.",
    location: "St. Petersburg",
    stars: 5,
    source: "website",
  },
  {
    quote: "Barrett was a life saver! We were only renting, but he constantly sent us houses that fit our criteria, and was able to get us into our dream home.",
    name: "Terry St. Martin",
    location: "Tampa Bay",
    stars: 5,
    source: "google",
  },
];
