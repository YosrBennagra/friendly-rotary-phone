import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DatabaseService } from './database.service';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const databaseService = app.get(DatabaseService);

  // Initialize the database connection
  await app.init();

  console.log('🌱 Starting database seeding...');

  try {
    // Check if there are any existing users
    const existingUsers = await databaseService.users.countDocuments();
    if (existingUsers > 0) {
      console.log('📋 Database already contains data. Skipping seed.');
      return;
    }

    // Create sample users
    console.log('👤 Creating sample users...');
    
    const hashedPassword = await bcrypt.hash('password123', 12);
    
    const user1 = await databaseService.createUser({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: hashedPassword,
      settings: {
        theme: 'light',
        notifications: true,
      },
    });

    const user2 = await databaseService.createUser({
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      password: hashedPassword,
      settings: {
        theme: 'dark',
        notifications: false,
      },
    });

    console.log('📄 Creating sample CVs...');

    // Create sample CVs
    const cv1 = await databaseService.createCV({
      userId: user1.id!,
      title: 'Software Developer CV',
      slug: 'software-developer-cv',
      template: 'MODERN',
      isPublic: true,
      theme: {
        fontFamily: 'Inter',
        accentColor: '#3b82f6',
        spacing: 'normal',
        showIcons: true,
        compactMode: false,
      },
      data: {
        header: {
          fullName: 'John Doe',
          title: 'Senior Software Developer',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          website: 'https://johndoe.dev',
          github: 'https://github.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          avatarUrl: '',
          summaryRichText: 'Passionate software developer with 5+ years of experience building scalable web applications.',
        },
        experience: [
          {
            id: '1',
            company: 'Tech Corp',
            position: 'Senior Software Developer',
            location: 'San Francisco, CA',
            startDate: '2020-01-01',
            endDate: '2023-12-31',
            description: 'Led development of microservices architecture serving 1M+ users daily.',
            skills: ['TypeScript', 'Node.js', 'React', 'MongoDB'],
          },
          {
            id: '2',
            company: 'Startup Inc',
            position: 'Full Stack Developer',
            location: 'Remote',
            startDate: '2018-06-01',
            endDate: '2019-12-31',
            description: 'Built full-stack applications using modern web technologies.',
            skills: ['JavaScript', 'Python', 'PostgreSQL', 'Docker'],
          },
        ],
        education: [
          {
            id: '1',
            institution: 'University of Technology',
            degree: 'Bachelor of Science in Computer Science',
            location: 'San Francisco, CA',
            startDate: '2014-09-01',
            endDate: '2018-05-31',
            description: 'Graduated Magna Cum Laude',
            gpa: '3.8',
          },
        ],
        skills: {
          groups: [
            {
              id: '1',
              name: 'Programming Languages',
              skills: ['TypeScript', 'JavaScript', 'Python', 'Go', 'Rust'],
            },
            {
              id: '2',
              name: 'Frameworks & Libraries',
              skills: ['React', 'Node.js', 'Express', 'NestJS', 'Next.js'],
            },
            {
              id: '3',
              name: 'Databases & Tools',
              skills: ['MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Kubernetes'],
            },
          ],
        },
        projects: [
          {
            id: '1',
            name: 'E-commerce Platform',
            description: 'Full-stack e-commerce solution with payment integration',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            url: 'https://github.com/johndoe/ecommerce',
            startDate: '2023-01-01',
            endDate: '2023-06-30',
          },
        ],
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Developer Associate',
            issuer: 'Amazon Web Services',
            date: '2022-03-15',
            expiryDate: '2025-03-15',
            credentialId: 'AWS-DA-123456',
            url: 'https://aws.amazon.com/certification/',
          },
        ],
        languages: [
          {
            id: '1',
            language: 'English',
            proficiency: 'Native',
          },
          {
            id: '2',
            language: 'Spanish',
            proficiency: 'Intermediate',
          },
        ],
        interests: [
          {
            id: '1',
            name: 'Open Source Contributing',
            description: 'Active contributor to various open-source projects',
          },
          {
            id: '2',
            name: 'Photography',
            description: 'Landscape and street photography enthusiast',
          },
        ],
        customSections: [],
      },
    });

    const cv2 = await databaseService.createCV({
      userId: user2.id!,
      title: 'Marketing Manager CV',
      slug: 'marketing-manager-cv',
      template: 'CLASSIC',
      isPublic: false,
      theme: {
        fontFamily: 'Inter',
        accentColor: '#10b981',
        spacing: 'compact',
        showIcons: true,
        compactMode: true,
      },
      data: {
        header: {
          fullName: 'Jane Smith',
          title: 'Digital Marketing Manager',
          email: 'jane.smith@example.com',
          phone: '+1 (555) 987-6543',
          location: 'New York, NY',
          website: 'https://janesmith.marketing',
          github: '',
          linkedin: 'https://linkedin.com/in/janesmith',
          avatarUrl: '',
          summaryRichText: 'Results-driven marketing professional with 7+ years of experience in digital marketing and brand management.',
        },
        experience: [
          {
            id: '1',
            company: 'Marketing Agency Pro',
            position: 'Digital Marketing Manager',
            location: 'New York, NY',
            startDate: '2019-03-01',
            endDate: '2024-01-31',
            description: 'Led digital marketing campaigns that increased client ROI by 150% on average.',
            skills: ['SEO', 'SEM', 'Social Media', 'Analytics'],
          },
        ],
        education: [
          {
            id: '1',
            institution: 'Business University',
            degree: 'Master of Business Administration',
            location: 'New York, NY',
            startDate: '2015-09-01',
            endDate: '2017-05-31',
            description: 'Concentration in Digital Marketing',
            gpa: '3.9',
          },
        ],
        skills: {
          groups: [
            {
              id: '1',
              name: 'Digital Marketing',
              skills: ['SEO', 'SEM', 'Social Media Marketing', 'Email Marketing', 'Content Marketing'],
            },
            {
              id: '2',
              name: 'Analytics & Tools',
              skills: ['Google Analytics', 'Google Ads', 'Facebook Ads', 'HubSpot', 'Mailchimp'],
            },
          ],
        },
        projects: [],
        certifications: [
          {
            id: '1',
            name: 'Google Ads Certified',
            issuer: 'Google',
            date: '2023-01-15',
            expiryDate: '2024-01-15',
            credentialId: 'GA-123456',
            url: 'https://skillshop.exceedlms.com/student/catalog',
          },
        ],
        languages: [
          {
            id: '1',
            language: 'English',
            proficiency: 'Native',
          },
          {
            id: '2',
            language: 'French',
            proficiency: 'Conversational',
          },
        ],
        interests: [
          {
            id: '1',
            name: 'Digital Trends',
            description: 'Staying up-to-date with the latest digital marketing trends',
          },
        ],
        customSections: [],
      },
    });

    console.log('📋 Creating sample versions...');

    // Create sample versions
    await databaseService.createVersion({
      cvId: cv1.id!,
      label: 'Initial Version',
      snapshot: {
        template: cv1.template,
        theme: cv1.theme,
        data: cv1.data,
      },
    });

    await databaseService.createVersion({
      cvId: cv2.id!,
      label: 'Initial Version',
      snapshot: {
        template: cv2.template,
        theme: cv2.theme,
        data: cv2.data,
      },
    });

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   👤 2 users`);
    console.log(`   📄 2 CVs`);
    console.log(`   📋 2 versions`);
    console.log('');
    console.log('🔐 Login credentials:');
    console.log('   📧 john.doe@example.com / password123');
    console.log('   📧 jane.smith@example.com / password123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('❌ Seed script failed:', error);
  process.exit(1);
});