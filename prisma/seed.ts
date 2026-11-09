import { PrismaClient, RoleName } from '@prisma/client';
import defaults from '../src/content/defaults.json';
import {
  SEED_CATEGORIES,
  SEED_MENU_ITEMS,
  SEED_OPENING_HOURS,
} from '../src/lib/seed-data';

const prisma = new PrismaClient();

/**
 * Dev-only seed script (`npm run db:seed`, PRD 11.3 & 13).
 * Populates Roles, initial Owner/Manager/Staff accounts, ContentBlocks,
 * Categories, MenuItems, OpeningHours, DeliveryZones, and NotificationTemplates.
 */
async function main() {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to run dummy seed data in production (PRD 4.2).');
  }

  console.log('Seeding Saanjh skeleton database...');

  // 1. Seed Roles (PRD 9.9)
  const roles = [
    {
      name: RoleName.OWNER,
      description: 'Business owner with full access including users, payments, and POS settings',
      permissions: ['*'],
    },
    {
      name: RoleName.MANAGER,
      description: 'Day-to-day operations, menu, offers, content, hours, reviews, and reports',
      permissions: [
        'orders_reservations:manage',
        'inventory:toggle_stock',
        'menu:edit',
        'content_offers_hours:edit',
        'reviews:moderate',
        'payments:refund',
        'analytics:view_basic',
        'analytics:view_full',
      ],
    },
    {
      name: RoleName.STAFF,
      description: 'Floor and kitchen team: view/update orders & reservations, mark out of stock',
      permissions: [
        'orders_reservations:manage',
        'inventory:toggle_stock',
        'analytics:view_basic',
      ],
    },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { name: r.name },
      update: { permissions: r.permissions, description: r.description },
      create: { name: r.name, permissions: r.permissions, description: r.description },
    });
  }

  const ownerRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.OWNER } });
  const managerRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.MANAGER } });
  const staffRole = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.STAFF } });

  // 2. Seed Dev Staff Accounts
  const users = [
    { email: 'owner@saanjh.local', name: '{{USER_OWNER_NAME}}', roleId: ownerRole.id },
    { email: 'manager@saanjh.local', name: '{{USER_MANAGER_NAME}}', roleId: managerRole.id },
    { email: 'staff@saanjh.local', name: '{{USER_STAFF_NAME}}', roleId: staffRole.id },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, roleId: u.roleId },
      create: {
        email: u.email,
        name: u.name,
        passwordHash: '$2b$10$devPlaceholderHashOnlyForSkeletonTesting',
        roleId: u.roleId,
      },
    });
  }

  // 3. Seed ContentBlocks from defaults.json
  for (const [key, value] of Object.entries(defaults)) {
    const section = key.split('.')[0] ?? 'global';
    await prisma.contentBlock.upsert({
      where: { key },
      update: { value },
      create: { key, value, section, locale: 'en' },
    });
  }

  // 4. Seed Categories & Menu Items
  for (const cat of SEED_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: {
        id: cat.id,
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
      },
    });
  }

  for (const item of SEED_MENU_ITEMS) {
    await prisma.menuItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        price: item.price,
        isAvailable: item.isAvailable,
      },
      create: {
        id: item.id,
        slug: item.slug,
        categoryId: item.categoryId,
        name: item.name,
        description: item.description,
        price: item.price,
        imageSlot: item.imageSlot,
        imageAspect: item.imageAspect,
        isVeg: item.isVeg,
        isSignature: item.isSignature,
        isNew: item.isNew,
        isAvailable: item.isAvailable,
        prepTimeMins: item.prepTimeMins,
        taxClassPercent: item.taxRatePercent,
      },
    });
  }

  // 5. Seed Opening Hours
  for (const oh of SEED_OPENING_HOURS) {
    await prisma.openingHours.upsert({
      where: { dayOfWeek: oh.dayOfWeek },
      update: { openTime: oh.openTime, closeTime: oh.closeTime, isClosed: oh.isClosed },
      create: {
        dayOfWeek: oh.dayOfWeek,
        dayLabel: oh.dayLabel,
        openTime: oh.openTime,
        closeTime: oh.closeTime,
        isClosed: oh.isClosed,
      },
    });
  }

  // 6. Seed Delivery Zones
  await prisma.deliveryZone.upsert({
    where: { pincode: '400001' },
    update: {},
    create: {
      pincode: '400001',
      areaName: '{{DELIVERY_ZONE_1_NAME}}',
      deliveryFee: 50,
      minOrderAmount: 300,
      estimatedMins: 35,
    },
  });

  console.log('Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

