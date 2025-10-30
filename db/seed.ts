import 'dotenv/config';
import { db, client } from './index';
import { models } from './schema';

const seedData = [
  {
    name: 'Vision Detection',
    version: 'v1.2',
    description: 'Object detection and classification',
  },
  {
    name: 'Quality Control',
    version: 'v2.0',
    description: 'Defect detection and quality assessment',
  },
  {
    name: 'Assembly Verification',
    version: 'v1.5',
    description: 'Assembly correctness verification',
  },
  {
    name: 'Predictive Maintenance',
    version: 'v3.1',
    description: 'Equipment failure prediction',
  },
];

async function seed() {
  try {
    console.log('🌱 Seeding database...');

    // Insert models
    await db.insert(models).values(seedData);

    console.log('✅ Database seeded successfully!');
    console.log(`   - Inserted ${seedData.length} models`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seed();
