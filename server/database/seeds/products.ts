import Database from 'better-sqlite3';
import { v4 as uuidv4 } from 'uuid';

export const seedProducts = (db: Database.Database) => {
  console.log('Seeding products...');

  const products = [
    // SMARTPHONES (15)
    {
      id: uuidv4(),
      product_name: 'Apple iPhone 15 Pro Max',
      brand: 'Apple',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400',
      specifications: JSON.stringify({
        display: '6.7" Super Retina XDR',
        processor: 'A17 Pro',
        ram: '8GB',
        storage: '256GB',
        camera: '48MP + 12MP + 12MP',
        battery: '4422mAh',
        os: 'iOS 17'
      }),
      tags: JSON.stringify(['flagship', '5g', 'premium', 'camera-phone'])
    },
    {
      id: uuidv4(),
      product_name: 'Apple iPhone 15',
      brand: 'Apple',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1696428376479-d89edfc0a82d?w=400',
      specifications: JSON.stringify({
        display: '6.1" Super Retina XDR',
        processor: 'A16 Bionic',
        ram: '6GB',
        storage: '128GB',
        camera: '48MP + 12MP',
        battery: '3349mAh',
        os: 'iOS 17'
      }),
      tags: JSON.stringify(['flagship', '5g', 'premium'])
    },
    {
      id: uuidv4(),
      product_name: 'Apple iPhone 14',
      brand: 'Apple',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1678685888221-cda948325022?w=400',
      specifications: JSON.stringify({
        display: '6.1" Super Retina XDR',
        processor: 'A15 Bionic',
        ram: '6GB',
        storage: '128GB',
        camera: '12MP + 12MP',
        battery: '3279mAh',
        os: 'iOS 17'
      }),
      tags: JSON.stringify(['flagship', '5g', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'Samsung Galaxy S24 Ultra',
      brand: 'Samsung',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400',
      specifications: JSON.stringify({
        display: '6.8" Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        camera: '200MP + 50MP + 12MP + 10MP',
        battery: '5000mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['flagship', '5g', 'premium', 'camera-phone', 's-pen'])
    },
    {
      id: uuidv4(),
      product_name: 'Samsung Galaxy S24',
      brand: 'Samsung',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      specifications: JSON.stringify({
        display: '6.2" Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 3',
        ram: '8GB',
        storage: '256GB',
        camera: '50MP + 12MP + 10MP',
        battery: '4000mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['flagship', '5g', 'premium', 'compact'])
    },
    {
      id: uuidv4(),
      product_name: 'Samsung Galaxy A55',
      brand: 'Samsung',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400',
      specifications: JSON.stringify({
        display: '6.6" Super AMOLED',
        processor: 'Exynos 1480',
        ram: '8GB',
        storage: '128GB',
        camera: '50MP + 12MP + 5MP',
        battery: '5000mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'OnePlus 12',
      brand: 'OnePlus',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=400',
      specifications: JSON.stringify({
        display: '6.82" AMOLED',
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        camera: '50MP + 64MP + 48MP',
        battery: '5400mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['flagship', '5g', 'fast-charging', 'gaming'])
    },
    {
      id: uuidv4(),
      product_name: 'OnePlus Nord CE4',
      brand: 'OnePlus',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400',
      specifications: JSON.stringify({
        display: '6.7" AMOLED',
        processor: 'Snapdragon 7 Gen 3',
        ram: '8GB',
        storage: '128GB',
        camera: '50MP + 8MP',
        battery: '5500mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'budget', 'fast-charging'])
    },
    {
      id: uuidv4(),
      product_name: 'Google Pixel 8 Pro',
      brand: 'Google',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1598654011775-eef26768daf6?w=400',
      specifications: JSON.stringify({
        display: '6.7" LTPO OLED',
        processor: 'Google Tensor G3',
        ram: '12GB',
        storage: '128GB',
        camera: '50MP + 48MP + 48MP',
        battery: '5050mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['flagship', '5g', 'premium', 'camera-phone', 'ai'])
    },
    {
      id: uuidv4(),
      product_name: 'Google Pixel 8a',
      brand: 'Google',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1565849904461-04e9dc0a7a51?w=400',
      specifications: JSON.stringify({
        display: '6.1" OLED',
        processor: 'Google Tensor G3',
        ram: '8GB',
        storage: '128GB',
        camera: '64MP + 13MP',
        battery: '4492mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'camera-phone', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'Nothing Phone (2a)',
      brand: 'Nothing',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400',
      specifications: JSON.stringify({
        display: '6.7" AMOLED',
        processor: 'MediaTek Dimensity 7200 Pro',
        ram: '8GB',
        storage: '128GB',
        camera: '50MP + 50MP',
        battery: '5000mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'unique-design', 'glyph-interface'])
    },
    {
      id: uuidv4(),
      product_name: 'Xiaomi 14',
      brand: 'Xiaomi',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400',
      specifications: JSON.stringify({
        display: '6.36" AMOLED',
        processor: 'Snapdragon 8 Gen 3',
        ram: '12GB',
        storage: '256GB',
        camera: '50MP + 50MP + 50MP',
        battery: '4610mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['flagship', '5g', 'camera-phone', 'leica'])
    },
    {
      id: uuidv4(),
      product_name: 'Realme GT 6',
      brand: 'Realme',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400',
      specifications: JSON.stringify({
        display: '6.7" AMOLED',
        processor: 'Snapdragon 8s Gen 3',
        ram: '8GB',
        storage: '256GB',
        camera: '50MP + 8MP',
        battery: '5500mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'gaming', 'fast-charging'])
    },
    {
      id: uuidv4(),
      product_name: 'OPPO Reno 12 Pro',
      brand: 'OPPO',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400',
      specifications: JSON.stringify({
        display: '6.7" AMOLED',
        processor: 'MediaTek Dimensity 9200+',
        ram: '12GB',
        storage: '256GB',
        camera: '50MP + 50MP + 8MP',
        battery: '4880mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'camera-phone', 'portrait'])
    },
    {
      id: uuidv4(),
      product_name: 'Vivo V30 Pro',
      brand: 'Vivo',
      category: 'Smartphones',
      image_url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400',
      specifications: JSON.stringify({
        display: '6.78" AMOLED',
        processor: 'MediaTek Dimensity 9200+',
        ram: '12GB',
        storage: '256GB',
        camera: '50MP + 50MP + 50MP',
        battery: '5000mAh',
        os: 'Android 14'
      }),
      tags: JSON.stringify(['mid-range', '5g', 'camera-phone', 'zeiss'])
    },

    // LAPTOPS (10)
    {
      id: uuidv4(),
      product_name: 'MacBook Air M3',
      brand: 'Apple',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=400',
      specifications: JSON.stringify({
        display: '13.6" Liquid Retina',
        processor: 'Apple M3',
        ram: '8GB',
        storage: '256GB SSD',
        graphics: '8-core GPU',
        battery: 'Up to 18 hours',
        weight: '1.24 kg'
      }),
      tags: JSON.stringify(['ultrabook', 'premium', 'lightweight', 'long-battery'])
    },
    {
      id: uuidv4(),
      product_name: 'MacBook Pro M3',
      brand: 'Apple',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      specifications: JSON.stringify({
        display: '14" Liquid Retina XDR',
        processor: 'Apple M3 Pro',
        ram: '18GB',
        storage: '512GB SSD',
        graphics: '14-core GPU',
        battery: 'Up to 17 hours',
        weight: '1.55 kg'
      }),
      tags: JSON.stringify(['professional', 'premium', 'content-creation', 'powerful'])
    },
    {
      id: uuidv4(),
      product_name: 'Dell XPS 13',
      brand: 'Dell',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400',
      specifications: JSON.stringify({
        display: '13.4" FHD+',
        processor: 'Intel Core i7-1355U',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'Intel Iris Xe',
        battery: 'Up to 12 hours',
        weight: '1.19 kg'
      }),
      tags: JSON.stringify(['ultrabook', 'premium', 'business', 'portable'])
    },
    {
      id: uuidv4(),
      product_name: 'Dell Inspiron 16',
      brand: 'Dell',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400',
      specifications: JSON.stringify({
        display: '16" FHD+',
        processor: 'Intel Core i5-1335U',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'Intel Iris Xe',
        battery: 'Up to 10 hours',
        weight: '1.87 kg'
      }),
      tags: JSON.stringify(['mid-range', 'productivity', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'HP Spectre x360',
      brand: 'HP',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1587614387466-0a72ca909e16?w=400',
      specifications: JSON.stringify({
        display: '13.5" OLED 3K2K',
        processor: 'Intel Core i7-1355U',
        ram: '16GB',
        storage: '1TB SSD',
        graphics: 'Intel Iris Xe',
        battery: 'Up to 13 hours',
        weight: '1.34 kg'
      }),
      tags: JSON.stringify(['convertible', '2-in-1', 'premium', 'touchscreen'])
    },
    {
      id: uuidv4(),
      product_name: 'HP Pavilion 15',
      brand: 'HP',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
      specifications: JSON.stringify({
        display: '15.6" FHD',
        processor: 'AMD Ryzen 5 7535HS',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'AMD Radeon',
        battery: 'Up to 9 hours',
        weight: '1.75 kg'
      }),
      tags: JSON.stringify(['mid-range', 'everyday-use', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'Lenovo ThinkPad X1 Carbon',
      brand: 'Lenovo',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1602080858428-57174f9431cf?w=400',
      specifications: JSON.stringify({
        display: '14" WUXGA',
        processor: 'Intel Core i7-1365U',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'Intel Iris Xe',
        battery: 'Up to 15 hours',
        weight: '1.12 kg'
      }),
      tags: JSON.stringify(['business', 'ultrabook', 'premium', 'durable'])
    },
    {
      id: uuidv4(),
      product_name: 'Lenovo IdeaPad Slim 5',
      brand: 'Lenovo',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400',
      specifications: JSON.stringify({
        display: '14" FHD',
        processor: 'AMD Ryzen 5 7530U',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'AMD Radeon',
        battery: 'Up to 12 hours',
        weight: '1.46 kg'
      }),
      tags: JSON.stringify(['mid-range', 'slim', 'portable', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'ASUS ROG Strix G16',
      brand: 'ASUS',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      specifications: JSON.stringify({
        display: '16" QHD 240Hz',
        processor: 'Intel Core i9-14900HX',
        ram: '32GB',
        storage: '1TB SSD',
        graphics: 'NVIDIA RTX 4070',
        battery: 'Up to 6 hours',
        weight: '2.5 kg'
      }),
      tags: JSON.stringify(['gaming', 'powerful', 'high-refresh-rate', 'rgb'])
    },
    {
      id: uuidv4(),
      product_name: 'Acer Nitro 5',
      brand: 'Acer',
      category: 'Laptops',
      image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400',
      specifications: JSON.stringify({
        display: '15.6" FHD 144Hz',
        processor: 'Intel Core i5-12500H',
        ram: '16GB',
        storage: '512GB SSD',
        graphics: 'NVIDIA RTX 4050',
        battery: 'Up to 5 hours',
        weight: '2.3 kg'
      }),
      tags: JSON.stringify(['gaming', 'budget-gaming', 'value-for-money'])
    },

    // AUDIO (10)
    {
      id: uuidv4(),
      product_name: 'Sony WH-1000XM5',
      brand: 'Sony',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400',
      specifications: JSON.stringify({
        type: 'Over-ear Wireless',
        anc: 'Industry-leading ANC',
        battery: '30 hours',
        driver: '30mm',
        bluetooth: '5.2',
        codec: 'LDAC, AAC, SBC'
      }),
      tags: JSON.stringify(['premium', 'noise-cancelling', 'wireless', 'over-ear'])
    },
    {
      id: uuidv4(),
      product_name: 'Sony WF-1000XM5',
      brand: 'Sony',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400',
      specifications: JSON.stringify({
        type: 'TWS Earbuds',
        anc: 'Premium ANC',
        battery: '8 hours (24 with case)',
        driver: '8.4mm',
        bluetooth: '5.3',
        waterproof: 'IPX4'
      }),
      tags: JSON.stringify(['premium', 'tws', 'noise-cancelling', 'compact'])
    },
    {
      id: uuidv4(),
      product_name: 'Apple AirPods Pro 2',
      brand: 'Apple',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400',
      specifications: JSON.stringify({
        type: 'TWS Earbuds',
        anc: 'Active Noise Cancellation',
        battery: '6 hours (30 with case)',
        chip: 'H2',
        bluetooth: '5.3',
        waterproof: 'IPX4'
      }),
      tags: JSON.stringify(['premium', 'tws', 'noise-cancelling', 'apple-ecosystem'])
    },
    {
      id: uuidv4(),
      product_name: 'Apple AirPods Max',
      brand: 'Apple',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1625239454054-cb7278c1c03c?w=400',
      specifications: JSON.stringify({
        type: 'Over-ear Wireless',
        anc: 'Active Noise Cancellation',
        battery: '20 hours',
        driver: '40mm',
        chip: 'H1',
        bluetooth: '5.0'
      }),
      tags: JSON.stringify(['premium', 'over-ear', 'noise-cancelling', 'luxury'])
    },
    {
      id: uuidv4(),
      product_name: 'JBL Tune 770NC',
      brand: 'JBL',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      specifications: JSON.stringify({
        type: 'Over-ear Wireless',
        anc: 'Active Noise Cancellation',
        battery: '70 hours',
        driver: '40mm',
        bluetooth: '5.3',
        fastCharge: '5 min = 3 hours'
      }),
      tags: JSON.stringify(['mid-range', 'over-ear', 'noise-cancelling', 'long-battery'])
    },
    {
      id: uuidv4(),
      product_name: 'JBL Charge 5',
      brand: 'JBL',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
      specifications: JSON.stringify({
        type: 'Portable Bluetooth Speaker',
        battery: '20 hours',
        powerbank: 'Yes',
        waterproof: 'IP67',
        bluetooth: '5.1',
        power: '40W'
      }),
      tags: JSON.stringify(['speaker', 'portable', 'waterproof', 'powerbank'])
    },
    {
      id: uuidv4(),
      product_name: 'boAt Airdopes 141',
      brand: 'boAt',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1606220838315-056192d5e927?w=400',
      specifications: JSON.stringify({
        type: 'TWS Earbuds',
        battery: '6 hours (42 with case)',
        driver: '8mm',
        bluetooth: '5.1',
        waterproof: 'IPX4',
        lowLatency: 'Yes'
      }),
      tags: JSON.stringify(['budget', 'tws', 'gaming', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'boAt Rockerz 550',
      brand: 'boAt',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400',
      specifications: JSON.stringify({
        type: 'Over-ear Wireless',
        battery: '20 hours',
        driver: '50mm',
        bluetooth: '5.0',
        physicalNoiseCancellation: 'Yes'
      }),
      tags: JSON.stringify(['budget', 'over-ear', 'bass', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'Sennheiser Momentum 4',
      brand: 'Sennheiser',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=400',
      specifications: JSON.stringify({
        type: 'Over-ear Wireless',
        anc: 'Adaptive ANC',
        battery: '60 hours',
        driver: '42mm',
        bluetooth: '5.2',
        codec: 'aptX Adaptive'
      }),
      tags: JSON.stringify(['premium', 'over-ear', 'noise-cancelling', 'audiophile'])
    },
    {
      id: uuidv4(),
      product_name: 'Bose QuietComfort Ultra',
      brand: 'Bose',
      category: 'Audio',
      image_url: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=400',
      specifications: JSON.stringify({
        type: 'Over-ear Wireless',
        anc: 'World-class ANC',
        battery: '24 hours',
        spatial: 'Immersive Audio',
        bluetooth: '5.3',
        comfort: 'Premium cushions'
      }),
      tags: JSON.stringify(['premium', 'over-ear', 'noise-cancelling', 'comfort'])
    },

    // WEARABLES (8)
    {
      id: uuidv4(),
      product_name: 'Apple Watch Ultra 2',
      brand: 'Apple',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400',
      specifications: JSON.stringify({
        display: '1.92" Retina LTPO',
        processor: 'S9 SiP',
        battery: '36 hours',
        waterproof: '100m',
        sensors: 'ECG, Blood Oxygen, Temperature',
        gps: 'Dual-frequency'
      }),
      tags: JSON.stringify(['premium', 'smartwatch', 'fitness', 'rugged', 'diving'])
    },
    {
      id: uuidv4(),
      product_name: 'Apple Watch SE',
      brand: 'Apple',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400',
      specifications: JSON.stringify({
        display: '1.57" Retina LTPO',
        processor: 'S8 SiP',
        battery: '18 hours',
        waterproof: '50m',
        sensors: 'Heart Rate, Accelerometer',
        gps: 'Yes'
      }),
      tags: JSON.stringify(['mid-range', 'smartwatch', 'fitness', 'apple-ecosystem'])
    },
    {
      id: uuidv4(),
      product_name: 'Samsung Galaxy Watch 6 Classic',
      brand: 'Samsung',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1617625802912-cbb5d6e0640d?w=400',
      specifications: JSON.stringify({
        display: '1.5" Super AMOLED',
        processor: 'Exynos W930',
        battery: '425mAh',
        waterproof: '5ATM',
        sensors: 'ECG, Blood Pressure, Sleep',
        bezel: 'Rotating'
      }),
      tags: JSON.stringify(['premium', 'smartwatch', 'fitness', 'rotating-bezel'])
    },
    {
      id: uuidv4(),
      product_name: 'Samsung Galaxy Fit 3',
      brand: 'Samsung',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1576243339231-e859b8c78b29?w=400',
      specifications: JSON.stringify({
        display: '1.6" AMOLED',
        battery: '13 days',
        waterproof: '5ATM',
        sensors: 'Heart Rate, SpO2, Sleep',
        weight: '18.5g'
      }),
      tags: JSON.stringify(['budget', 'fitness-band', 'lightweight', 'long-battery'])
    },
    {
      id: uuidv4(),
      product_name: 'Fitbit Charge 6',
      brand: 'Fitbit',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400',
      specifications: JSON.stringify({
        display: '1.04" Color AMOLED',
        battery: '7 days',
        waterproof: '50m',
        sensors: 'Heart Rate, SpO2, Stress, ECG',
        gps: 'Built-in'
      }),
      tags: JSON.stringify(['mid-range', 'fitness-tracker', 'health-focused'])
    },
    {
      id: uuidv4(),
      product_name: 'Garmin Venu 3',
      brand: 'Garmin',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400',
      specifications: JSON.stringify({
        display: '1.4" AMOLED',
        battery: '14 days',
        waterproof: '5ATM',
        sensors: 'Heart Rate, SpO2, Sleep Coach',
        sports: '30+ modes',
        gps: 'Multi-band'
      }),
      tags: JSON.stringify(['premium', 'smartwatch', 'fitness', 'sports', 'gps'])
    },
    {
      id: uuidv4(),
      product_name: 'Noise ColorFit Pro 5',
      brand: 'Noise',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      specifications: JSON.stringify({
        display: '1.85" TFT',
        battery: '7 days',
        waterproof: 'IP68',
        sensors: 'Heart Rate, SpO2, Sleep',
        sports: '100+ modes'
      }),
      tags: JSON.stringify(['budget', 'smartwatch', 'value-for-money', 'large-display'])
    },
    {
      id: uuidv4(),
      product_name: 'boAt Wave Elevate',
      brand: 'boAt',
      category: 'Wearables',
      image_url: 'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400',
      specifications: JSON.stringify({
        display: '1.83" HD',
        battery: '7 days',
        waterproof: 'IP68',
        sensors: 'Heart Rate, SpO2, Sleep',
        features: 'Bluetooth Calling'
      }),
      tags: JSON.stringify(['budget', 'smartwatch', 'calling', 'value-for-money'])
    },

    // CAMERAS (5)
    {
      id: uuidv4(),
      product_name: 'Canon EOS R6 Mark II',
      brand: 'Canon',
      category: 'Cameras',
      image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
      specifications: JSON.stringify({
        type: 'Mirrorless',
        sensor: '24.2MP Full-frame',
        video: '4K 60fps',
        autofocus: 'Dual Pixel II',
        iso: '100-102400',
        fps: '40fps burst'
      }),
      tags: JSON.stringify(['professional', 'mirrorless', 'full-frame', 'video'])
    },
    {
      id: uuidv4(),
      product_name: 'Nikon Z6 III',
      brand: 'Nikon',
      category: 'Cameras',
      image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
      specifications: JSON.stringify({
        type: 'Mirrorless',
        sensor: '24.5MP Full-frame',
        video: '4K 120fps',
        autofocus: '3D Tracking',
        iso: '100-64000',
        stabilization: '5-axis IBIS'
      }),
      tags: JSON.stringify(['professional', 'mirrorless', 'full-frame', 'hybrid'])
    },
    {
      id: uuidv4(),
      product_name: 'Sony A7 IV',
      brand: 'Sony',
      category: 'Cameras',
      image_url: 'https://images.unsplash.com/photo-1606980707123-2b49e7e20b83?w=400',
      specifications: JSON.stringify({
        type: 'Mirrorless',
        sensor: '33MP Full-frame',
        video: '4K 60fps',
        autofocus: '759-point AF',
        iso: '100-51200',
        stabilization: '5.5-stop IBIS'
      }),
      tags: JSON.stringify(['professional', 'mirrorless', 'full-frame', 'versatile'])
    },
    {
      id: uuidv4(),
      product_name: 'GoPro Hero 12',
      brand: 'GoPro',
      category: 'Cameras',
      image_url: 'https://images.unsplash.com/photo-1585270001449-b36d8e9cdc98?w=400',
      specifications: JSON.stringify({
        type: 'Action Camera',
        sensor: '27MP',
        video: '5.3K 60fps',
        stabilization: 'HyperSmooth 6.0',
        waterproof: '10m',
        hdr: 'Yes'
      }),
      tags: JSON.stringify(['action-camera', 'waterproof', 'compact', 'adventure'])
    },
    {
      id: uuidv4(),
      product_name: 'DJI Pocket 3',
      brand: 'DJI',
      category: 'Cameras',
      image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400',
      specifications: JSON.stringify({
        type: 'Gimbal Camera',
        sensor: '1" CMOS',
        video: '4K 120fps',
        stabilization: '3-axis mechanical',
        screen: '2" rotating touchscreen',
        tracking: 'ActiveTrack 6.0'
      }),
      tags: JSON.stringify(['gimbal', 'vlog', 'compact', 'stabilized'])
    },

    // TVs (5)
    {
      id: uuidv4(),
      product_name: 'Samsung Crystal 4K 55"',
      brand: 'Samsung',
      category: 'TVs',
      image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      specifications: JSON.stringify({
        size: '55 inch',
        resolution: '4K UHD',
        panel: 'Crystal Display',
        refresh: '60Hz',
        os: 'Tizen',
        hdr: 'HDR10+'
      }),
      tags: JSON.stringify(['4k', 'smart-tv', 'mid-range', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'LG OLED C3 55"',
      brand: 'LG',
      category: 'TVs',
      image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
      specifications: JSON.stringify({
        size: '55 inch',
        resolution: '4K UHD',
        panel: 'OLED evo',
        refresh: '120Hz',
        os: 'webOS',
        gaming: 'HDMI 2.1, VRR, ALLM'
      }),
      tags: JSON.stringify(['4k', 'oled', 'premium', 'gaming', 'smart-tv'])
    },
    {
      id: uuidv4(),
      product_name: 'Sony Bravia XR 65"',
      brand: 'Sony',
      category: 'TVs',
      image_url: 'https://images.unsplash.com/photo-1601944177325-f8867652837f?w=400',
      specifications: JSON.stringify({
        size: '65 inch',
        resolution: '4K UHD',
        panel: 'Full Array LED',
        processor: 'Cognitive Processor XR',
        os: 'Google TV',
        audio: 'Acoustic Multi-Audio'
      }),
      tags: JSON.stringify(['4k', 'premium', 'smart-tv', 'google-tv'])
    },
    {
      id: uuidv4(),
      product_name: 'Mi TV 5X 55"',
      brand: 'Xiaomi',
      category: 'TVs',
      image_url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400',
      specifications: JSON.stringify({
        size: '55 inch',
        resolution: '4K UHD',
        panel: 'QLED',
        refresh: '60Hz',
        os: 'Android TV',
        hdr: 'Dolby Vision'
      }),
      tags: JSON.stringify(['4k', 'qled', 'budget', 'smart-tv', 'value-for-money'])
    },
    {
      id: uuidv4(),
      product_name: 'TCL C745 55"',
      brand: 'TCL',
      category: 'TVs',
      image_url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400',
      specifications: JSON.stringify({
        size: '55 inch',
        resolution: '4K UHD',
        panel: 'QLED',
        refresh: '144Hz',
        os: 'Google TV',
        gaming: 'Game Master 2.0'
      }),
      tags: JSON.stringify(['4k', 'qled', 'gaming', 'high-refresh', 'value-for-money'])
    },

    // HOME (5)
    {
      id: uuidv4(),
      product_name: 'Dyson V15 Detect',
      brand: 'Dyson',
      category: 'Home',
      image_url: 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400',
      specifications: JSON.stringify({
        type: 'Cordless Vacuum',
        suction: '240 AW',
        battery: '60 minutes',
        filtration: 'HEPA',
        features: 'Laser detection, LCD screen',
        weight: '3.1 kg'
      }),
      tags: JSON.stringify(['premium', 'vacuum', 'cordless', 'smart'])
    },
    {
      id: uuidv4(),
      product_name: 'iRobot Roomba j7+',
      brand: 'iRobot',
      category: 'Home',
      image_url: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
      specifications: JSON.stringify({
        type: 'Robot Vacuum',
        features: 'Auto-empty, AI obstacle avoidance',
        battery: '90 minutes',
        app: 'iRobot Home',
        mapping: '3D mapping',
        dustbin: 'Self-emptying'
      }),
      tags: JSON.stringify(['premium', 'robot-vacuum', 'smart-home', 'ai'])
    },
    {
      id: uuidv4(),
      product_name: 'Philips Air Purifier AC1715',
      brand: 'Philips',
      category: 'Home',
      image_url: 'https://images.unsplash.com/photo-1588883924097-08b5c0c3523d?w=400',
      specifications: JSON.stringify({
        type: 'Air Purifier',
        coverage: '333 sq.ft',
        filtration: 'HEPA + Carbon',
        cadr: '270 m³/h',
        sensors: 'Air quality sensor',
        noise: '20.5 dB'
      }),
      tags: JSON.stringify(['air-purifier', 'hepa', 'smart-sensor', 'quiet'])
    },
    {
      id: uuidv4(),
      product_name: 'Eureka Forbes Aquaguard',
      brand: 'Eureka Forbes',
      category: 'Home',
      image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400',
      specifications: JSON.stringify({
        type: 'Water Purifier',
        technology: 'RO + UV + UF + Alkaline',
        capacity: '7 liters',
        purification: '8-stage',
        tds: 'Up to 2000 ppm',
        warranty: '1 year'
      }),
      tags: JSON.stringify(['water-purifier', 'ro', 'uv', 'health'])
    },
    {
      id: uuidv4(),
      product_name: 'Havells Instanio Prime Water Heater',
      brand: 'Havells',
      category: 'Home',
      image_url: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400',
      specifications: JSON.stringify({
        type: 'Instant Water Heater',
        capacity: '3 liters',
        power: '3000W',
        heating: 'Instant',
        safety: 'Multi-function valve',
        material: 'ABS body'
      }),
      tags: JSON.stringify(['water-heater', 'instant', 'energy-efficient'])
    },
  ];

  const insert = db.prepare(`
    INSERT INTO products (id, product_name, brand, category, image_url, specifications, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((products) => {
    for (const product of products) {
      insert.run(
        product.id,
        product.product_name,
        product.brand,
        product.category,
        product.image_url,
        product.specifications,
        product.tags
      );
    }
  });

  insertMany(products);

  console.log(`✓ Seeded ${products.length} products`);
  return products;
};
