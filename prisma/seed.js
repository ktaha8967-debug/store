const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const COUNTRIES = ['Pakistan', 'Bangladesh', 'India', 'Turkey', 'Morocco', 'Kenya', 'Ghana', 'Peru', 'Mexico', 'Indonesia'];
const CATEGORIES = ['Ceramics', 'Textiles', 'Jewelry', 'Woodwork', 'Leather', 'Home Decor', 'Fashion', 'Art'];
const VERIFICATIONS = ['GENERAL', 'VERIFIED', 'ELITE', 'GI'];
const STORIES_DATA = require('./stories_data');

// Premium Unsplash IDs for realistic mapping
const ARTISAN_IMAGES = [
  'https://images.unsplash.com/photo-1544256718-3bcf237f3974',
  'https://images.unsplash.com/photo-1589156280159-27698a70f29e',
  'https://images.unsplash.com/photo-1581456495146-65a71b2c8e52',
  'https://images.unsplash.com/photo-1596484552834-6a58f850e0a1',
  'https://images.unsplash.com/photo-1570114668478-439564cbacda'
];

const WORKSHOP_IMAGES = [
  'https://images.unsplash.com/photo-1588615419951-dc668b59fa87',
  'https://images.unsplash.com/photo-1452860606245-08befc0ff44b',
  'https://images.unsplash.com/photo-1513694203232-719a280e022f',
  'https://images.unsplash.com/photo-1601662528567-526cd06f6582',
  'https://images.unsplash.com/photo-1560963503-455b88cb54a3'
];

const PRODUCT_BASE = {
  Ceramics: ['https://images.unsplash.com/photo-1610701596007-11502861dcfa', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61', 'https://images.unsplash.com/photo-1565193566173-7a0cb3d162cc'],
  Textiles: ['https://images.unsplash.com/photo-1606760227091-3dd870d97f1d', 'https://images.unsplash.com/photo-1528255915607-9012fda0f838', 'https://images.unsplash.com/photo-1584852957448-f58c70a2cb93'],
  Jewelry: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338', 'https://images.unsplash.com/photo-1599643478524-fb52445cbf92', 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908'],
  Woodwork: ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126', 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7', 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1'],
  Leather: ['https://images.unsplash.com/photo-1483985988355-763728e1935b', 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809', 'https://images.unsplash.com/photo-1590736704728-f4730bb30770'],
  'Home Decor': ['https://images.unsplash.com/photo-1513694203232-719a280e022f', 'https://images.unsplash.com/photo-1540932239986-30128078f3c5', 'https://images.unsplash.com/photo-1505693314120-0d443867891c'],
  Fashion: ['https://images.unsplash.com/photo-1512436991641-6745cdb1723f', 'https://images.unsplash.com/photo-1550614000-4b95d466f654', 'https://images.unsplash.com/photo-1485230405346-71acb9518d9c'],
  Art: ['https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8', 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5', 'https://images.unsplash.com/photo-1579762715111-a6e1905e0721']
};

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const formatUrl = (id) => `${id}?auto=format&fit=crop&q=80&w=800`;
const generateGallery = (baseArray, count = 6) => {
  return Array.from({length: count}, () => formatUrl(getRandom(baseArray)));
};

async function main() {
  console.log('Seeding database with 20 Makers and 50+ Products for Business Model Integration...');

  // Create Users
  const admin = await prisma.user.create({
    data: { email: 'admin@britsync.com', password: 'password123', name: 'Britsync Admin', role: 'ADMIN' },
  });
  const buyer = await prisma.user.create({
    data: { email: 'buyer@example.com', password: 'password123', name: 'Premium Collector', role: 'BUYER' },
  });

  let makerProfiles = [];

  // Generate 35 Makers
  for (let i = 1; i <= 35; i++) {
    const country = getRandom(COUNTRIES);
    const verification = getRandom(VERIFICATIONS);
    
    const user = await prisma.user.create({
      data: {
        email: `maker${i}@example.com`,
        password: 'password123',
        name: `Master Artisan ${i}`,
        role: 'MAKER',
      },
    });

    const maker = await prisma.makerProfile.create({
      data: {
        userId: user.id,
        businessName: `Heritage Studio ${i}`,
        founderName: `Founder ${i}`,
        founderStory: `Born into a family of artisans, my grandfather taught me this craft in the foothills of ${country}. I took over the workshop with a mission to modernize our approach without losing our soul.`,
        businessStory: `Operating for over ${Math.floor(Math.random() * 50) + 10} years, we bring authentic ${country} art to the world, preserving ancient techniques.`,
        country: country,
        verificationStatus: verification,
        yearsInBusiness: Math.floor(Math.random() * 50) + 1,
        coverImage: formatUrl(getRandom(WORKSHOP_IMAGES)),
        founderPhoto: formatUrl(getRandom(ARTISAN_IMAGES)),
        workshopGallery: JSON.stringify(generateGallery(WORKSHOP_IMAGES, 4)),
        teamPhotos: JSON.stringify(generateGallery(ARTISAN_IMAGES, 3)),
        productionPhotos: JSON.stringify(generateGallery(WORKSHOP_IMAGES, 5)),
        lifestylePhotos: JSON.stringify(generateGallery(WORKSHOP_IMAGES, 3)),
        mission: 'To preserve traditional craftsmanship while providing fair, sustainable wages to local women.',
        employeeCount: Math.floor(Math.random() * 40) + 2,
        impactStory: `Empowering our local village, we provide education stipends for the children of our ${Math.floor(Math.random() * 40) + 2} employees.`
      }
    });
    makerProfiles.push(maker);
  }

  // Generate 110 Products
  for (let i = 1; i <= 110; i++) {
    const maker = getRandom(makerProfiles);
    const category = getRandom(CATEGORIES);
    
    // We force a mix of General vs Elite/GI products for the UI comparison testing
    const isEliteOrGI = i % 2 === 0; 
    const vStatus = isEliteOrGI ? (Math.random() > 0.5 ? 'ELITE' : 'GI') : 'GENERAL';
    const priceBase = isEliteOrGI ? (Math.floor(Math.random() * 800) + 300) : (Math.floor(Math.random() * 150) + 30);

    const product = await prisma.product.create({
      data: {
        makerId: maker.id,
        name: `Authentic ${category} Masterpiece ${i}`,
        description: `A stunning, handcrafted piece representing the best of ${maker.country} ${category}. This item embodies the rich cultural heritage of its origin.`,
        story: `Handmade over 4 weeks using traditional methods passed down through generations. Every imperfection is a mark of the human hand.`,
        category: category,
        price: priceBase,
        inventory: Math.floor(Math.random() * 15) + 1,
        images: JSON.stringify(generateGallery(PRODUCT_BASE[category], 6)),
        verificationStatus: vStatus,
        origin: `${maker.country} (Rural Workshop)`,
        materials: '100% Locally Sourced Organic Materials',
        productionMethod: 'Hand-carved and naturally dyed without machinery.',
        dimensions: 'Approx. 45cm x 30cm x 15cm (Handmade variances apply)',
        careInstructions: 'Spot clean only. Keep away from direct sunlight.',
        shippingInfo: isEliteOrGI ? 'Premium White-Glove Shipping (Insured)' : 'Standard International Shipping',
        returnPolicy: '30-day returns for unused items.',
        isEcoFriendly: true,
        isWomenLed: Math.random() > 0.5,
        isHandmade: true,
      }
    });

    // Generate Passport for ELITE or GI products
    if (['ELITE', 'GI'].includes(product.verificationStatus)) {
      await prisma.productPassport.create({
        data: {
          productId: product.id,
          originCountry: maker.country,
          materialsList: 'Certified Organic Materials, Ethical Dyes',
          inspectionDate: new Date(),
          verificationHistory: 'Passed rigorous physical inspection by Britsync Agents.',
          qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BRITSYNC'
        }
      });
    }

    // Generate Reviews
    if (Math.random() > 0.3) {
      await prisma.review.create({
        data: {
          buyerId: buyer.id,
          productId: product.id,
          rating: 5,
          comment: 'Absolutely beautiful craftsmanship. Exceeded all expectations. The packaging and story made it feel so special.'
        }
      });
    }
  }

  // Generate 30 Unique Stories
  console.log('Generating 30 unique Maker Stories...');
  for (let i = 0; i < STORIES_DATA.length; i++) {
    const sData = STORIES_DATA[i];
    // Assign to a random maker
    const maker = getRandom(makerProfiles);
    
    await prisma.story.create({
      data: {
        makerId: maker.id,
        title: sData.title,
        excerpt: sData.excerpt,
        content: sData.content,
        country: sData.country,
        village: sData.village,
        craft: sData.craft,
        heroImage: sData.heroImage,
        photography: JSON.stringify(sData.photography),
        timeline: JSON.stringify(sData.timeline)
      }
    });
  }

  console.log('Database seeded successfully with massive comprehensive datasets.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
